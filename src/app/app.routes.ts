import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'reactive',
    loadChildren: () => import('./reactive/reactive.routes').then((m) => m.reactiveRoutes),
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes'),
  },
  {
    path: 'countries',
    loadChildren: () => import('./countries/countries.routes').then((m) => m.countriesRoutes),
  },
  {
    path: '**',
    redirectTo: 'auth',
  },
];
