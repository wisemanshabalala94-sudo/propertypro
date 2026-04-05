import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserRole } from '../../core/models/domain.models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  template: `
    <section class="login-page">
      <div class="login-card">
        <div class="login-card__brand">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <rect width="40" height="40" rx="10" fill="#7C3AED"/>
            <path d="M10 28L20 10L30 28" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M14 22h12" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
          </svg>
          <span class="login-card__title">PropertyPro</span>
          <p class="login-card__subtitle">Sign in to your account</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="submit()" class="login-form">
          <div class="form-group">
            <label class="form-label">Email</label>
            <input formControlName="email" type="email" placeholder="you@company.com" class="form-input" />
            @if (loginForm.controls.email.invalid && loginForm.controls.email.touched) {
              <small class="form-error">Enter a valid email</small>
            }
          </div>

          <div class="form-group">
            <label class="form-label">Password</label>
            <input formControlName="password" type="password" placeholder="Enter password" class="form-input" />
            @if (loginForm.controls.password.invalid && loginForm.controls.password.touched) {
              <small class="form-error">Password is required</small>
            }
          </div>

          <div class="form-group">
            <label class="form-label">Role</label>
            <select formControlName="role" class="form-select">
              <option value="tenant">Tenant</option>
              <option value="owner">Owner</option>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button type="submit" class="btn btn-primary btn-lg" [disabled]="loginForm.invalid || submitting">
            @if (submitting) { <span class="spinner spinner--sm"></span> }
            {{ submitting ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <div class="login-footer">
          <p>New here? <a routerLink="/signup/tenant">Tenant Signup</a> or <a routerLink="/signup/owner">Owner Signup</a></p>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .login-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      background: linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 50%, #F9FAFB 100%);
    }
    .login-card {
      background: white;
      border-radius: 1rem;
      padding: 2.5rem;
      box-shadow: 0 10px 40px rgba(0,0,0,0.08);
      border: 1px solid #E5E7EB;
      width: 100%;
      max-width: 28rem;
    }
    .login-card__brand { text-align: center; margin-bottom: 2rem; }
    .login-card__title { display: block; font-size: 1.5rem; font-weight: 700; color: #1F2937; margin-top: 0.75rem; }
    .login-card__subtitle { font-size: 0.875rem; color: #6B7280; margin-top: 0.25rem; }
    .login-form { display: flex; flex-direction: column; gap: 1rem; }
    .form-error { color: #EF4444; font-size: 0.75rem; margin-top: 0.25rem; }
    .login-footer { text-align: center; margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid #E5E7EB; font-size: 0.875rem; color: #6B7280; }
    .login-footer a { color: #7C3AED; font-weight: 500; text-decoration: none; }
    .login-footer a:hover { text-decoration: underline; }
    .spinner--sm { width: 1rem; height: 1rem; border-width: 2px; display: inline-block; vertical-align: middle; margin-right: 0.5rem; }
  `]
})
export class LoginComponent {
  loginForm = this.createForm();
  submitting = false;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  private createForm() {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['tenant' as UserRole, Validators.required]
    });
  }

  async submit() {
    if (this.loginForm.invalid || this.submitting) return;
    this.submitting = true;
    try {
      const { email, password, role } = this.loginForm.value;
      await this.auth.signIn(email || '', password || '', (role || 'tenant') as UserRole);
      this.auth.redirectToDashboard();
    } finally {
      this.submitting = false;
    }
  }
}
