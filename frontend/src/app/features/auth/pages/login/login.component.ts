import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private readonly formBuilder = inject(FormBuilder).nonNullable;
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly isSubmitting = signal(false);
  readonly showPassword = signal(false);
  readonly errorMessage = signal('');
  readonly form = this.formBuilder.group({
    nomeUsuario: ['', [Validators.required]],
    senha: ['', [Validators.required]],
  });

  submit(): void {
    if (this.isSubmitting()) {
      return;
    }

    this.errorMessage.set('');

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.authService
      .login(this.form.getRawValue())
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => {
          const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
          const destination = returnUrl?.startsWith('/') && !returnUrl.startsWith('//')
            ? returnUrl
            : '/dashboard';
          void this.router.navigateByUrl(destination);
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage.set(
            error.status === 0
              ? 'Não foi possível conectar ao servidor. Tente novamente.'
              : 'Usuário ou senha inválidos.',
          );
        },
      });
  }
}