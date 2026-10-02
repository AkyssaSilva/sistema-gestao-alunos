import { TestBed } from '@angular/core/testing';
import { SessionService } from '../../../core/services/session.service';
import { AuthorizationService } from './authorization.service';

describe('AuthorizationService', () => {
  let authorizationService: AuthorizationService;
  let sessionService: SessionService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    authorizationService = TestBed.inject(AuthorizationService);
    sessionService = TestBed.inject(SessionService);
  });

  it('grants list, search, and detail access to both profiles', () => {
    sessionService.save({ token: 'jwt', tipo: 'Bearer', perfil: 'ADMIN' });
    expect(authorizationService.can('ALUNOS:LIST')).toBe(true);
    expect(authorizationService.can('ALUNOS:SEARCH')).toBe(true);
    expect(authorizationService.can('ALUNOS:READ')).toBe(true);

    sessionService.save({ token: 'jwt', tipo: 'Bearer', perfil: 'LEITOR' });
    expect(authorizationService.can('ALUNOS:LIST')).toBe(true);
    expect(authorizationService.can('ALUNOS:SEARCH')).toBe(true);
    expect(authorizationService.can('ALUNOS:READ')).toBe(true);
  });

  it('grants mutations only to ADMIN', () => {
    sessionService.save({ token: 'jwt', tipo: 'Bearer', perfil: 'ADMIN' });
    expect(authorizationService.can('ALUNOS:CREATE')).toBe(true);
    expect(authorizationService.can('ALUNOS:UPDATE')).toBe(true);
    expect(authorizationService.can('ALUNOS:INACTIVATE')).toBe(true);

    sessionService.save({ token: 'jwt', tipo: 'Bearer', perfil: 'LEITOR' });
    expect(authorizationService.can('ALUNOS:CREATE')).toBe(false);
    expect(authorizationService.can('ALUNOS:UPDATE')).toBe(false);
    expect(authorizationService.can('ALUNOS:INACTIVATE')).toBe(false);
  });
});