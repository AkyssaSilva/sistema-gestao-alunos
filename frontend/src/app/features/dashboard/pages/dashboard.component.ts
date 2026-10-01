import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SessionService } from '../../../core/services/session.service';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  readonly sessionService = inject(SessionService);
  private readonly authService = inject(AuthService);

  logout(): void {
    this.authService.logout();
  }
}