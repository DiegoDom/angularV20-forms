import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '../../../utils/form-utils';

@Component({
  selector: 'app-dynamic-page',
  imports: [JsonPipe, ReactiveFormsModule],
  templateUrl: './dynamic-page.component.html',
})
export class DynamicPageComponent {
  private fb = inject(FormBuilder);
  formUtils = FormUtils;

  myForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    favorites: this.fb.array(
      [
        ['Zelda', Validators.required],
        ['GTA San Andres', Validators.required],
      ],
      [Validators.minLength(3), Validators.required]
    ),
  });

  newFavorite = this.fb.control([null], [Validators.required, Validators.minLength(2)]);

  get favoritesGames() {
    return this.myForm.get('favorites') as FormArray;
  }

  onAddToFavorites() {
    if (this.newFavorite.invalid) return;

    const newFavorite = this.newFavorite.value;
    this.favoritesGames.push(
      this.fb.control(newFavorite, [Validators.required, Validators.minLength(2)])
    );

    this.newFavorite.reset();
  }

  onDeleteFavorite(index: number) {
    this.favoritesGames.removeAt(index);
  }

  onSubmit() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }

    console.log(this.myForm.value);

    this.favoritesGames.clear();
    this.myForm.reset({
      favorites: this.fb.array([]),
    });
  }
}
