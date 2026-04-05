import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <header class="app-header">
      <a routerLink="/" class="brand"><span class="brand__name">PropertyPro</span></a>
      <nav class="nav-links">
        <a routerLink="/">Home</a>
        @if (!user()) { <a routerLink="/login">Sign In</a> }
        @else {
          @if (user()?.role === 'admin') { <a routerLink="/admin/dashboard">Admin</a> }
          @if (user()?.role === 'owner') { <a routerLink="/owner/dashboard">Dashboard</a> }
          @if (user()?.role === 'staff') { <a routerLink="/staff/dashboard">Dashboard</a> }
          @if (user()?.role === 'tenant' && user()?.isApproved) { <a routerLink="/tenant/dashboard">Dashboard</a> }
          @if (user()?.role === 'tenant' && !user()?.isApproved) { <a routerLink="/tenant/pending">Status</a> }
          <button class="btn btn-sm btn-secondary" (click)="signOut()">Sign Out</button>
        }
      </nav>
    </header>
  `,
  styles: [`
    .app-header { display: flex; align-items: center; justify-content: space-between; padding: 0.875rem 2rem; background: white; border-bottom: 1px solid #E5E7EB; position: sticky; top: 0; z-index: 50; }
    .brand { display: flex; align-items: center; gap: 0.5rem; text-decoration: none; }
    .brand__name { font-size: 1.125rem; font-weight: 700; color: #1F2937; }
    .nav-links { display: flex; align-items: center; gap: 0.5rem; }
    .nav-links a { padding: 0.5rem 0.875rem; border-radius: 0.5rem; font-size: 0.875rem; font-weight: 500; color: #6B7280; text-decoration: none; }
    .nav-links a:hover { color: #1F2937; background: #F3F4F6; }
    .btn { display: inline-flex; align-items: center; justify-content: center; padding: 0.375rem 0.75rem; border-radius: 0.5rem; font-weight: 600; font-size: 0.75rem; cursor: pointer; border: 1px solid transparent; }
    .btn-sm { padding: 0.375rem 0.75rem; font-size: 0.75rem; }
    .btn-secondary { background: white; color: #374151; border-color: #D1D5DB; }
    @media (max-width: 768px) { .app-header { flex-direction: column; gap: 0.75rem; padding: 0.75rem 1rem; } .nav-links { flex-wrap: wrap; justify-content: center; } }
  `]
})
export class HeaderComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  user = this.auth.user;
  signOut() { this.auth.signOut(); this.router.navigate(['/']); }
}
