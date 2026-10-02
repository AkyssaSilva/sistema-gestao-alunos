import { Routes } from '@angular/router';
import { authGuard, guestGuard, permissionGuard } from './core/guards/auth.guard';
import { unsavedChangesGuard } from './core/guards/unsaved-changes.guard';

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
	{
		path: 'alunos/novo',
		canActivate: [authGuard, permissionGuard],
		canDeactivate: [unsavedChangesGuard],
		data: { permissions: ['ALUNOS:CREATE'] },
		loadComponent: () => import('./features/alunos/pages/aluno-create.component').then((module) => module.AlunoCreateComponent),
	},
	{ path: '**', redirectTo: 'login' },
];
