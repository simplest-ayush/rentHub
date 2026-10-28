import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'auth',
    loadComponent: () => import('./features/auth/auth/auth.component').then(m => m.AuthComponent),
  },
  {
    path: 'listings/new',
    canActivate: [authGuard],
    loadComponent: () => import('./features/listings/listing-form/listing-form.component').then(m => m.ListingFormComponent),
  },
  {
    path: 'listings/preview',
    canActivate: [authGuard],
    loadComponent: () => import('./features/listings/listing-preview/listing-preview.component').then(m => m.ListingPreviewComponent),
  },
  {
    path: 'listings/:id/edit',
    canActivate: [authGuard],
    loadComponent: () => import('./features/listings/listing-form/listing-form.component').then(m => m.ListingFormComponent),
  },
  {
    path: 'listings/:id',
    loadComponent: () => import('./features/listings/listing-details/listing-details.component').then(m => m.ListingDetailsComponent),
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./features/profile/profile/profile.component').then(m => m.ProfileComponent),
  },
  { 
    path: '**', 
    redirectTo: '' 
  },
];