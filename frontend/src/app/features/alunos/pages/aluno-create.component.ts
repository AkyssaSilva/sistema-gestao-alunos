import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AlunoService } from '../services/aluno.service';

const cpfValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const cpf = String(control.value ?? '').replace(/\D/g, '');

  if (!cpf) {
    return null;
  }

  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
    return { cpfInvalido: true };
  }

  const calcularDigito = (base: string, pesoInicial: number): number => {
    const soma = [...base].reduce(
      (total, digito, indice) => total + Number(digito) * (pesoInicial - indice),
      0,
    );
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };

  const primeiroDigito = calcularDigito(cpf.slice(0, 9), 10);
  const segundoDigito = calcularDigito(cpf.slice(0, 10), 11);

  return cpf.endsWith(`${primeiroDigito}${segundoDigito}`) ? null : { cpfInvalido: true };
};

@Component({
  selector: 'app-aluno-create',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './aluno-create.component.html',
  styleUrl: './aluno-create.component.css',
})
export class AlunoCreateComponent {
  private readonly formBuilder = inject(FormBuilder).nonNullable;
  private readonly alunoService = inject(AlunoService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly isSubmitting = signal(false);
  readonly errorMessage = signal('');
  readonly successMatricula = signal<string | null>(null);

  readonly form = this.formBuilder.group({
    nomeCompleto: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(120), Validators.pattern(/\S/)]],
    cpf: ['', [Validators.required, cpfValidator]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
    telefone: ['', [
      Validators.required,
      Validators.pattern(/^(?:[1-9][0-9](?:9[0-9]{8}|[2-5][0-9]{7})|\([1-9][0-9]\) ?(?:9[0-9]{4}|[2-5][0-9]{3})-?[0-9]{4})$/),
    ]],
  });

  canDeactivate(): boolean {
    if (!this.form.dirty || this.successMatricula()) {
      return true;
    }

    return window.confirm('Há alterações não salvas. Deseja sair mesmo assim?');
  }

  cadastrar(): void {
    if (this.isSubmitting()) {
      return;
    }

    this.errorMessage.set('');
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const values = this.form.getRawValue();
    this.isSubmitting.set(true);

    this.alunoService.cadastrar({
      nomeCompleto: values.nomeCompleto.trim(),
      cpf: values.cpf.replace(/\D/g, ''),
      email: values.email.trim(),
      telefone: values.telefone.trim(),
    }).pipe(
      finalize(() => this.isSubmitting.set(false)),
    ).subscribe({
      next: (aluno) => {
        this.form.markAsPristine();
        this.successMatricula.set(aluno.matricula);
      },
      error: (error: HttpErrorResponse) => {
        const mensagem = error.error?.mensagem;
        this.errorMessage.set(
          typeof mensagem === 'string'
            ? mensagem
            : error.status === 0
              ? 'Não foi possível conectar ao servidor. Tente novamente.'
              : 'Não foi possível cadastrar o aluno. Confira os dados e tente novamente.',
        );
      },
    });
  }

  voltarParaLista(): void {
    const queryParams = this.route.snapshot.queryParamMap;

    void this.router.navigate(['/dashboard'], {
      queryParams: {
        q: queryParams.get('q'),
        status: queryParams.get('status'),
        page: queryParams.get('page'),
      },
    });
  }
}