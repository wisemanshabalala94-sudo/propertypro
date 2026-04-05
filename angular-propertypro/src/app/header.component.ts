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
      <div class="brand">
        <a routerLink="/">
          <span class="brand__logo">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="6" fill="#7C3AED"/>
              <path d="M7 20L14 7L21 20" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M10 16h8" stroke="white" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </span>
          <span class="brand__name">PropertyPro</span>
        </a>
      </div>
      <nav class="nav-links">
        <a routerLink="/">Home</a>
        @if (!user()) {
          <a routerLink="/login" class="nav-link--outline">Sign In</a>
          <a routerLink="/signup/owner" class="btn btn-primary btn-sm">Get Started</a>
        } @else {
          @if (user()?.role === 'admin') { <a routerLink="/admin/dashboard" class="nav-link--active">Admin</a> }
          @if (user()?.role === 'owner') { <a routerLink="/owner/dashboard" class="nav-link--active">Dashboard</a> }
          @if (user()?.role === 'staff') { <a routerLink="/staff/dashboard" class="nav-link--active">Dashboard</a> }
          @if (user()?.role === 'tenant' && user()?.isApproved) { <a routerLink="/tenant/dashboard" class="nav-link--active">Dashboard</a> }
          @if (user()?.role === 'tenant' && !user()?.isApproved) { <a routerLink="/tenant/pending" class="nav-link--active">Status</a> }
          <button class="btn btn-sm btn-secondary" (click)="signOut()">Sign Out</button>
        }
      </nav>
    </header>
  `,
  styles: [`
    .app-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 0.875rem 2rem;
      background: white;
      border-bottom: 1px solid #E5E7EB;
      position: sticky;
      top: 0;
      z-index: 50;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04);
    }
    .brand a { display: flex; align-items: center; gap: 0.75rem; text-decoration: none; }
    .brand__name { font-size: 1.125rem; font-weight: 700; color: #1F2937; }
    .nav-links { display: flex; align-items: center; gap: 0.5rem; }
    .nav-links a {
      padding: 0.5rem 0.875rem;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      font-weight: 500;
      color: #6B7280;
      text-decoration: none;
      transition: all 0.15s ease;
    }
    .nav-links a:hover { color: #1F2937; background: #F3F4F6; }
    .nav-link--active { color: #7C3AED !important; background: #F5F3FF !important; font-weight: 600 !important; }
    .nav-link--outline {
      border: 1px solid #D1D5DB;
      color: #374151;
    }
    @media (max-width: 768px) {
      .app-header { flex-direction: column; gap: 0.75rem; padding: 0.75rem 1rem; }
      .nav-links { flex-wrap: wrap; justify-content: center; }
    }
  `]
})
export class HeaderComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  user = this.auth.user;

  signOut() {
    this.auth.signOut();
    this.router.navigate(['/']);
  }
}
