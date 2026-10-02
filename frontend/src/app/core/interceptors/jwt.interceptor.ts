import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { SessionService } from '../services/session.service';

export const jwtInterceptor: HttpInterceptorFn = (request, next) => {
  const session = inject(SessionService).session;

  if (!session || !request.url.startsWith('/') || request.url.startsWith('/auth/login')) {
    return next(request);
  }

  return next(
    request.clone({
      setHeaders: { Authorization: `${session.tipo} ${session.token}` },
    }),
  );
};