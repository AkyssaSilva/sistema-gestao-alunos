import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		redirectTo: 'login',
	},
	{
		path: 'login',
		canActivate: [guestGuard],
		loadComponent: () => import('./features/auth/pages/login/login.component').then((module) => module.LoginComponent),
	},
	{
		path: 'dashboard',
		canActivate: [authGuard],
		loadComponent: () => import('./features/dashboard/pages/dashboard.component').then((module) => module.DashboardComponent),
	},
	{ path: '**', redirectTo: 'login' },
];
