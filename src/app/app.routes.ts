import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then( m => m.HomePage)
  },

  {
    path: 'editar-gasto',
    loadComponent: () => import('./pages/editar-gasto/editar-gasto.page').then( m => m.EditarGastoPage)
  },
  {
    path: 'nuevo-gasto',
    loadComponent: () => import('./pages/nuevo-gasto/nuevo-gasto.page').then( m => m.NuevoGastoPage)
  },
];
