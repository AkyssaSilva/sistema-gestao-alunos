import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EMPTY, Subject, catchError, debounceTime, distinctUntilChanged, map, merge, of, switchMap, tap } from 'rxjs';
import { SessionService } from '../../../core/services/session.service';
import { AuthorizationService } from '../../auth/services/authorization.service';
import { AuthService } from '../../auth/services/auth.service';
import { AlunoService } from '../../alunos/services/aluno.service';
import { Aluno, ConsultaAlunos, FiltroStatusAluno, Pagina } from '../../alunos/models/aluno.model';

interface EstadoDaLista {
  busca: string;
  status: FiltroStatusAluno;
  pagina: number;
}

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly alunoService = inject(AlunoService);
  private readonly authorizationService = inject(AuthorizationService);
  private readonly searchInput = new Subject<string>();
  private readonly refreshList = new Subject<void>();
  private readonly pageSize = 10;

  readonly sessionService = inject(SessionService);
  private readonly authService = inject(AuthService);
  readonly alunos = signal<Aluno[]>([]);
  readonly busca = signal('');
  readonly filtroStatus = signal<FiltroStatusAluno>('ATIVOS');
  readonly paginaAtual = signal(1);
  readonly totalRegistros = signal(0);
  readonly totalPaginas = signal(0);
  readonly carregando = signal(true);
  readonly erro = signal(false);
  readonly alunoExpandido = signal<number | null>(null);
  readonly inativandoId = signal<number | null>(null);
  readonly mensagem = signal('');

  constructor() {
    const routeState = this.route.queryParamMap.pipe(
      map((params): EstadoDaLista => {
        const page = Number(params.get('page'));
        const status = params.get('status');

        return {
          busca: params.get('q') ?? '',
          status: status === 'INATIVOS' || status === 'TODOS' ? status : 'ATIVOS',
          pagina: Number.isInteger(page) && page > 0 ? page : 1,
        };
      }),
      distinctUntilChanged((previous, current) =>
        previous.busca === current.busca
        && previous.status === current.status
        && previous.pagina === current.pagina,
      ),
    );

    merge(routeState, this.refreshList.pipe(map(() => this.currentListState())))
      .pipe(
        tap((state) => {
          this.busca.set(state.busca);
          this.filtroStatus.set(state.status);
          this.paginaAtual.set(state.pagina);
          this.carregando.set(true);
          this.erro.set(false);
        }),
        switchMap((state) => this.alunoService.listar(state).pipe(
          map((page) => ({ page, failed: false })),
          catchError(() => of({ page: null, failed: true })),
        )),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(({ page, failed }) => {
        this.carregando.set(false);
        this.erro.set(failed);

        if (page) {
          this.updatePage(page);
        }
      });

    this.searchInput
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((busca) => this.navigateToList({ ...this.currentListState(), busca, pagina: 1 }));
  }

  get podeCadastrar(): boolean {
    return this.authorizationService.can('ALUNOS:CREATE');
  }

  get podeEditar(): boolean {
    return this.authorizationService.can('ALUNOS:UPDATE');
  }

  get podeInativar(): boolean {
    return this.authorizationService.can('ALUNOS:INACTIVATE');
  }

  logout(): void {
    this.authService.logout();
  }

  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.busca.set(value);
    this.searchInput.next(value);
  }

  clearSearch(): void {
    this.busca.set('');
    this.searchInput.next('');
  }

  changeStatus(event: Event): void {
    const status = (event.target as HTMLSelectElement).value as FiltroStatusAluno;
    this.navigateToList({ ...this.currentListState(), status, pagina: 1 });
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPaginas() || page === this.paginaAtual()) {
      return;
    }

    this.navigateToList({ ...this.currentListState(), pagina: page });
  }

  paginasVisiveis(): number[] {
    const total = this.totalPaginas();
    const start = Math.max(1, Math.min(this.paginaAtual() - 2, total - 4));
    const end = Math.min(total, start + 4);
    return Array.from({ length: Math.max(0, end - start + 1) }, (_, index) => start + index);
  }

  primeiroRegistro(): number {
    return this.totalRegistros() === 0 ? 0 : (this.paginaAtual() - 1) * this.pageSize + 1;
  }

  ultimoRegistro(): number {
    return Math.min(this.paginaAtual() * this.pageSize, this.totalRegistros());
  }

  alternarDetalhes(id: number): void {
    this.alunoExpandido.update((expandedId) => expandedId === id ? null : id);
  }

  mostrarAviso(acao: string): void {
    this.mensagem.set(`${acao} ainda não está disponível nesta versão.`);
  }

  inativar(aluno: Aluno): void {
    if (!this.podeInativar || this.inativandoId() !== null) {
      return;
    }

    if (!window.confirm(`Inativar ${aluno.nomeCompleto}?`)) {
      return;
    }

    this.inativandoId.set(aluno.id);
    this.mensagem.set('');
    this.alunoService
      .inativar(aluno.id)
      .pipe(
        tap(() => {
          this.mensagem.set(`${aluno.nomeCompleto} foi inativado.`);
          this.refreshList.next();
        }),
        catchError((error: HttpErrorResponse) => {
          this.mensagem.set(error.status === 404
            ? 'Aluno não encontrado.'
            : 'Não foi possível inativar o aluno. Tente novamente.');
          return EMPTY;
        }),
        tap({ finalize: () => this.inativandoId.set(null) }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        complete: () => this.inativandoId.set(null),
        error: () => this.inativandoId.set(null),
      });
  }

  retry(): void {
    this.refreshList.next();
  }

  private currentListState(): EstadoDaLista {
    return {
      busca: this.busca(),
      status: this.filtroStatus(),
      pagina: this.paginaAtual(),
    };
  }

  private navigateToList(state: EstadoDaLista): void {
    this.mensagem.set('');
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        q: state.busca || null,
        status: state.status,
        page: state.pagina,
      },
      queryParamsHandling: 'merge',
    });
  }

  private updatePage(page: Pagina<Aluno>): void {
    this.alunos.set(page.content);
    this.totalRegistros.set(page.totalElements);
    this.totalPaginas.set(page.totalPages);
  }
}