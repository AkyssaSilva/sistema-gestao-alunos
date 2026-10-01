export type Perfil = 'ADMIN' | 'LEITOR';

export interface LoginRequest {
  nomeUsuario: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  tipo: string;
  perfil: Perfil;
}

export interface AuthSession {
  token: string;
  tipo: string;
  perfil: Perfil;
}