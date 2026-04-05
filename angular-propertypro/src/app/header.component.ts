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
          <img src="/wiseworx-logo.svg" alt="Wiseworx" class="logo" />
        </a>
      </div>
      <nav class="nav-links">
        <a routerLink="/home">Home</a>
        <a routerLink="/signup/owner">Owner signup</a>
        <a routerLink="/signup/tenant">Tenant signup</a>
        <a routerLink="/login" *ngIf="!user()">Login</a>
        <a routerLink="/admin/dashboard" *ngIf="user()?.role === 'admin'">Admin</a>
        <a routerLink="/owner/dashboard" *ngIf="user()?.role === 'owner'">Owner</a>
        <a routerLink="/staff/dashboard" *ngIf="user()?.role === 'staff'">Staff</a>
        <a routerLink="/tenant/dashboard" *ngIf="user()?.role === 'tenant' && user()?.isApproved">Tenant</a>
        <a routerLink="/tenant/pending" *ngIf="user()?.role === 'tenant' && !user()?.isApproved">Status</a>
        <button class="sign-out" *ngIf="user()" (click)="signOut()">Sign out</button>
      </nav>
    </header>
  `,
  styles: [
    `
      .app-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        padding: 1.25rem 2rem;
        background: rgba(255, 255, 255, 0.88);
        box-shadow: 0 12px 36px rgba(15, 60, 47, 0.08);
        position: sticky;
        top: 0;
        z-index: 50;
        backdrop-filter: blur(12px);
      }
      .brand a {
        display: flex;
        align-items: center;
      }
      .logo {
        height: 32px;
        width: auto;
      }
      .nav-links {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.75rem;
      }
      .nav-links a,
      .sign-out {
        padding: 0.8rem 1rem;
        border-radius: 999px;
        font-weight: 700;
      }
      .nav-links a {
        background: #ecfdf5;
        color: #065f46;
      }
      .sign-out {
        border: 1px solid #10b981;
        background: white;
        color: #065f46;
        cursor: pointer;
      }
      @media (max-width: 860px) {
        .app-header {
          flex-direction: column;
          align-items: stretch;
        }
        .nav-links {
          justify-content: center;
        }
      }
    `
  ]
})
export class HeaderComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  user = this.auth.user;

  signOut() {
    this.auth.signOut();
    this.router.navigate(['/home']);
  }
}
