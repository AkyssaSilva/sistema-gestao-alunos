import { Component, input, output, inject, OnInit, signal} from "@angular/core";
import { Aluno, StatusAluno } from "../../models/aluno.model";
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import { AlunoService } from "../../services/aluno.service";
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-aluno-edicao',
  imports: [ReactiveFormsModule],
  templateUrl: './aluno-edicao.component.html',
  styleUrl: './aluno-edicao.component.css',
})
export class  AlunoEdicaoComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder).nonNullable;
  private readonly alunoService = inject(AlunoService);
  readonly salvando = signal(false);
  readonly mensagemErro = signal('');

  aluno = input.required<Aluno>();
  fechar = output<void>();
  atualizado = output<void>();

  private valoresOriginais: unknown;

  readonly form = this.formBuilder.group({
    nomeCompleto: ['', [
      Validators.required, 
      Validators.minLength(3), 
      Validators.maxLength(120), 
      Validators.pattern(/\S/)
    ]],
    cpf: [{value: '', disabled: true}],
    email: ['', [
      Validators.required, 
      Validators.email, 
      Validators.maxLength(254)
    ]],
    telefone: ['', [
      Validators.required, 
      Validators.pattern(/^(?:[1-9][0-9](?:9[0-9]{8}|[2-5][0-9]{7})|\([1-9][0-9]\) ?(?:9[0-9]{4}|[2-5][0-9]{3})-?[0-9]{4})$/)]],
    matricula: [{value: '', disabled: true}],
    status:[''],
  });

  ngOnInit(): void {
    this.preencherFormulario();
    this.valoresOriginais = this.form.getRawValue();
  }

  get possuiAlteracoes(): boolean {
    const atual = this.form.getRawValue();
    return JSON.stringify(atual) !== JSON.stringify(this.valoresOriginais);
  }

  get podeSalvar(): boolean {
    return (
      this.possuiAlteracoes && this.form.valid && !this.salvando()
    )
  }

  private preencherFormulario(): void {
    this.form.patchValue({
      nomeCompleto: this.aluno().nomeCompleto,
      cpf: this.aluno().cpf,
      email: this.aluno().email,
      telefone: this.aluno().telefone,
      matricula: this.aluno().matricula,
      status: this.aluno().status,
    });
  }

  atualizarAluno(): void {

    if (!this.podeSalvar) {
      return;
    }

    this.salvando.set(true);
    this.mensagemErro.set('');

    const dados = this.form.getRawValue();

    this.alunoService.atualizar(
      this.aluno().id, {
        nomeCompleto: dados.nomeCompleto.trim(),
        email: dados.email.trim(),
        telefone: dados.telefone.trim(),
        status: dados.status as StatusAluno,
      }
    ).subscribe({
        next: () => {
          this.atualizado.emit();
          this.salvando.set(false);
          this.fechar.emit();
        },
        error: (error: HttpErrorResponse) => {
          this.salvando.set(false);
          if(error.status === 409){
            this.mensagemErro.set('E-mail já cadastrado');
            return;
          }
        }
      }
    );
  }

  fecharModal(): void{
    if(this.possuiAlteracoes && !window.confirm('Há alterações não salvas. Deseja sair mesmo assim?')){
      return;
    }
    this.fechar.emit();
  }
}