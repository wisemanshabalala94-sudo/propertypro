import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserRole } from '../../core/models/domain.models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <section class="auth-shell">
      <div class="form-panel">
        <h2>Welcome back to Wiseworx</h2>
        <p>Sign in to access your dashboard and workflow tools.</p>

        <form [formGroup]="loginForm" (ngSubmit)="submit()">
          <label>Email</label>
          <input formControlName="email" type="email" placeholder="you@company.com" />

          <label>Password</label>
          <input formControlName="password" type="password" placeholder="Enter password" />

          <label>Role</label>
          <select formControlName="role">
            <option value="tenant">Tenant</option>
            <option value="owner">Owner</option>
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
          </select>

          <button type="submit" [disabled]="loginForm.invalid">Sign in</button>
        </form>

        <p class="helper-text">
          New here? <a routerLink="/signup/tenant">Tenant Signup</a> or <a routerLink="/signup/owner">Owner Signup</a>
        </p>
      </div>
    </section>
  `,
  styles: [
    `
      .auth-shell {
        min-height: 100vh;
        display: grid;
        place-items: center;
        padding: 2rem;
        background: radial-gradient(circle at top, #ecfdf5, #f5fbf6);
      }
      .form-panel {
        max-width: 420px;
        width: 100%;
        background: white;
        border-radius: 1.75rem;
        box-shadow: 0 32px 90px rgba(15, 60, 47, 0.12);
        padding: 2.5rem;
      }
      h2 {
        margin: 0 0 0.75rem;
        color: #0f392a;
      }
      p {
        color: #4b5563;
        line-height: 1.7;
      }
      label {
        display: block;
        margin-top: 1rem;
        color: #166534;
        font-weight: 700;
        letter-spacing: 0.04em;
      }
      input, select {
        width: 100%;
        padding: 0.95rem 1rem;
        margin-top: 0.5rem;
        border: 1px solid #d1fae5;
        border-radius: 1rem;
        background: #f8faf9;
      }
      button {
        width: 100%;
        margin-top: 1.5rem;
        padding: 1rem;
        background: #10b981;
        color: white;
        border: none;
        border-radius: 1rem;
        font-weight: 700;
        cursor: pointer;
      }
      button:disabled {
        opacity: 0.65;
        cursor: not-allowed;
      }
      .helper-text {
        margin-top: 1.5rem;
        color: #4b5563;
      }
      a {
        color: #10b981;
      }
    `
  ]
})
export class LoginComponent {
  loginForm = this.createForm();

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  private createForm() {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['tenant', Validators.required]
    });
  }

  async submit() {
    if (this.loginForm.invalid) {
      return;
    }
    const { email, password, role } = this.loginForm.value;
    const emailVal = email || '';
    const passwordVal = password || '';
    const roleVal = (role || 'tenant') as UserRole;
    await this.auth.signIn(emailVal, passwordVal, roleVal);
    this.auth.redirectToDashboard();
  }
}
