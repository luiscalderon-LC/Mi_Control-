
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard').then(m => m.Dashboard)
  },
  {
    path: 'dinero',
    loadComponent: () =>
      import('./pages/dinero/dinero').then(m => m.Dinero)
  },
  {
    path: 'pasajes',
    loadComponent: () =>
      import('./pages/pasajes/pasajes').then(m => m.Pasajes)
  },
  {
    path: 'alimentacion',
    loadComponent: () =>
      import('./pages/alimentacion/alimentacion').then(m => m.Alimentacion)
  },
  {
    path: 'reportes',
    loadComponent: () =>
      import('./pages/reportes/reportes').then(m => m.Reportes)
  },
  { path: '**', redirectTo: 'dashboard' }
];
