import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthorizationService } from '../../features/auth/services/authorization.service';
import { Permission } from '../../features/auth/models/permissions.model';
import { SessionService } from '../services/session.service';

export const authGuard: CanActivateFn = (_route, state) => {
  const router = inject(Router);

  return inject(SessionService).isAuthenticated
    ? true
    : router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};

export const guestGuard: CanActivateFn = () =>
  inject(SessionService).isAuthenticated
    ? inject(Router).createUrlTree(['/dashboard'])
    : true;

export const permissionGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const requiredPermissions = route.data['permissions'] as Permission[] | undefined;

  return requiredPermissions && inject(AuthorizationService).canAll(requiredPermissions)
    ? true
    : router.createUrlTree(['/dashboard']);
};