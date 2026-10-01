import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthSession, LoginResponse } from '../../features/auth/models/auth.models';

const TOKEN_KEY = 'token';
const PROFILE_KEY = 'perfil';
const TOKEN_TYPE_KEY = 'tipoToken';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly sessionState = new BehaviorSubject<AuthSession | null>(this.readSession());

  readonly session$ = this.sessionState.asObservable();

  get session(): AuthSession | null {
    return this.sessionState.value;
  }

  get isAuthenticated(): boolean {
    return this.session !== null;
  }

  save(response: LoginResponse): void {
    const session: AuthSession = {
      token: response.token,
      tipo: response.tipo || 'Bearer',
      perfil: response.perfil,
    };

    localStorage.setItem(TOKEN_KEY, session.token);
    localStorage.setItem(PROFILE_KEY, session.perfil);
    localStorage.setItem(TOKEN_TYPE_KEY, session.tipo);
    this.sessionState.next(session);
  }

  clear(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(PROFILE_KEY);
    localStorage.removeItem(TOKEN_TYPE_KEY);
    this.sessionState.next(null);
  }

  private readSession(): AuthSession | null {
    const token = localStorage.getItem(TOKEN_KEY);
    const perfil = localStorage.getItem(PROFILE_KEY);
    const tipo = localStorage.getItem(TOKEN_TYPE_KEY) || 'Bearer';

    if (!token || (perfil !== 'ADMIN' && perfil !== 'LEITOR')) {
      return null;
    }

    return { token, tipo, perfil };
  }
}