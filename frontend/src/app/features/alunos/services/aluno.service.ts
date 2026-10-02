import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Aluno, ConsultaAlunos, Pagina } from '../models/aluno.model';

const PAGE_SIZE = 10;

@Injectable({ providedIn: 'root' })
export class AlunoService {
  private readonly http = inject(HttpClient);

  listar(consulta: ConsultaAlunos): Observable<Pagina<Aluno>> {
    const busca = consulta.busca.trim();
    let params = new HttpParams()
      .set('page', String(Math.max(0, consulta.pagina - 1)))
      .set('size', String(PAGE_SIZE))
      .set('sort', 'nomeCompleto,asc')
      .set('status', consulta.status);

    if (busca) {
      const buscaMatricula = /^ALU/i.test(busca) || /^\d+$/.test(busca);
      params = params.set(buscaMatricula ? 'matricula' : 'nomeCompleto', busca);
    }

    return this.http.get<Pagina<Aluno>>('/alunos', { params });
  }

  inativar(id: number): Observable<Aluno> {
    return this.http.patch<Aluno>(`/alunos/${id}/inativar`, {});
  }
}