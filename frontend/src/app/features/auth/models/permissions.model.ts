import { Perfil } from './auth.models';

export type Permission =
  | 'ALUNOS:LIST'
  | 'ALUNOS:SEARCH'
  | 'ALUNOS:READ'
  | 'ALUNOS:CREATE'
  | 'ALUNOS:UPDATE'
  | 'ALUNOS:INACTIVATE';

export const PROFILE_PERMISSIONS: Record<Perfil, readonly Permission[]> = {
  ADMIN: [
    'ALUNOS:LIST',
    'ALUNOS:SEARCH',
    'ALUNOS:READ',
    'ALUNOS:CREATE',
    'ALUNOS:UPDATE',
    'ALUNOS:INACTIVATE',
  ],
  LEITOR: ['ALUNOS:LIST', 'ALUNOS:SEARCH', 'ALUNOS:READ'],
};