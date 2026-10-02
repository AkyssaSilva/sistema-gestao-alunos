export type FiltroStatusAluno = 'ATIVOS' | 'INATIVOS' | 'TODOS';
export type StatusAluno = 'ATIVO' | 'INATIVO';

export interface Aluno {
  id: number;
  nomeCompleto: string;
  email: string;
  cpf: string;
  telefone: string;
  matricula: string;
  status: StatusAluno;
}

export interface CriarAlunoRequest {
  nomeCompleto: string;
  email: string;
  cpf: string;
  telefone: string;
}

export interface Pagina<T> {
  content: T[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface ConsultaAlunos {
  busca: string;
  status: FiltroStatusAluno;
  pagina: number;
}