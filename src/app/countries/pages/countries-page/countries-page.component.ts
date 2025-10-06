import { JsonPipe } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CountriesService } from '../../services/countries.service';
import { Country } from '../../interfaces/countries.interface';
import { filter, map, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-countries-page',
  imports: [ReactiveFormsModule, JsonPipe],
  templateUrl: './countries-page.component.html',
})
export class CountriesPageComponent {
  private fb = inject(FormBuilder);
  private countriesService = inject(CountriesService);

  regions = signal(this.countriesService.regions);

  countriesByRegion = signal<Country[]>([]);
  borders = signal<Country[]>([]);

  myForm = this.fb.group({
    region: ['', Validators.required],
    country: ['', Validators.required],
    border: ['', Validators.required],
  });

  //! SHOULD UNSUBSCRIBE ON COMPONENT DESTROY
  /* selectedRegionChanged = this.myForm.get('region')!.valueChanges.subscribe((value) => {
    console.log({ value });
    }); */

  //! SHOULD UNSUBSCRIBE ON COMPONENT DESTROY
  onFormChanged = effect((onCleanup) => {
    const selectedRegionSubscription = this.onRegionChange();
    const selectedCountrySubscription = this.onCountryChange();

    onCleanup(() => {
      selectedRegionSubscription.unsubscribe();
      selectedCountrySubscription.unsubscribe();
    });
  });

  onRegionChange() {
    return this.myForm
      .get('region')!
      .valueChanges.pipe(
        tap(() => this.myForm.get('country')!.setValue('')),
        tap(() => this.myForm.get('border')!.setValue('')),
        tap(() => {
          this.countriesByRegion.set([]);
          this.borders.set([]);
        }),
        map((region) => region!.toLowerCase()),
        switchMap((region) => this.countriesService.getCountriesByRegion(region!))
      )
      .subscribe((countries) => {
        this.countriesByRegion.set(countries);
      });
  }

  onCountryChange() {
    return this.myForm
      .get('country')!
      .valueChanges.pipe(
        tap(() => this.myForm.get('border')!.setValue('')),
        filter((value) => value!.length > 0),
        switchMap((code) => this.countriesService.getCountryByAlphaCode(code!)),
        switchMap(({ borders }) => this.countriesService.getCountryNamesByCode(borders))
      )
      .subscribe((countries) => {
        this.borders.set(countries);
      });
  }
}
