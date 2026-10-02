import { Injectable, inject } from '@angular/core';
import { SessionService } from '../../../core/services/session.service';
import { Permission, PROFILE_PERMISSIONS } from '../models/permissions.model';

@Injectable({ providedIn: 'root' })
export class AuthorizationService {
  private readonly sessionService = inject(SessionService);

  can(permission: Permission): boolean {
    const perfil = this.sessionService.session?.perfil;
    return perfil ? PROFILE_PERMISSIONS[perfil].includes(permission) : false;
  }

  canAll(permissions: readonly Permission[]): boolean {
    return permissions.every((permission) => this.can(permission));
  }
}