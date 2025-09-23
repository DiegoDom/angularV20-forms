import { Route } from '@angular/router';
import { CountriesPageComponent } from './pages/countries-page/countries-page.component';

export const countriesRoutes: Route[] = [
  {
    path: '',
    component: CountriesPageComponent,
  },
  {
    path: '**',
    redirectTo: 'countries',
  },
];
