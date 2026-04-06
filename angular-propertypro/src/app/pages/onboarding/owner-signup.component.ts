import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-owner-signup',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <section class="signup-shell owner-signup">
      <div class="intro-card">
        <span>Owner onboarding</span>
        <h1>Register your company and activate your owner dashboard.</h1>
        <p>Select a subscription tier, enter company details, and set up payout banking.</p>
      </div>

      <form [formGroup]="signupForm" class="signup-form" (ngSubmit)="submit()">
        <label>Subscription Plan</label>
        <div class="plan-grid">
          <label class="plan-card" [class.active]="signupForm.value.plan === 'Entry'">
            <input type="radio" formControlName="plan" value="Entry" />
            <strong>Entry</strong>
            <span>Basic building operations</span>
          </label>
          <label class="plan-card" [class.active]="signupForm.value.plan === 'Basic'">
            <input type="radio" formControlName="plan" value="Basic" />
            <strong>Basic</strong>
            <span>Finance workflows + tenant management</span>
          </label>
          <label class="plan-card" [class.active]="signupForm.value.plan === 'Pro'">
            <input type="radio" formControlName="plan" value="Pro" />
            <strong>Pro</strong>
            <span>Full property controls + analytics</span>
          </label>
          <label class="plan-card" [class.active]="signupForm.value.plan === 'Unlimited'">
            <input type="radio" formControlName="plan" value="Unlimited" />
            <strong>Unlimited</strong>
            <span>Enterprise-scale with premium support</span>
          </label>
        </div>

        <label>Company Name</label>
        <input formControlName="companyName" placeholder="Wiseworx Properties" />

        <label>Registration Number</label>
        <input formControlName="regNumber" placeholder="1234567890" />

        <label>Tax ID</label>
        <input formControlName="taxId" placeholder="TAX-12345" />

        <label>Bank Account</label>
        <input formControlName="bankAccount" placeholder="Company bank account" />

        <button type="submit" [disabled]="signupForm.invalid">Create Organization</button>
      </form>
    </section>
  `,
  styles: [
    `
      .signup-shell {
        max-width: 1050px;
        margin: 3rem auto;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        padding: 0 1.5rem;
      }
      .intro-card {
        background: linear-gradient(180deg, #F5F3FF 0%, #EDE9FE 100%);
        border-radius: 2rem;
        padding: 2.5rem;
        box-shadow: 0 32px 70px rgba(124, 58, 237, 0.1);
      }
      .intro-card span {
        color: #7C3AED;
        font-weight: 800;
        display: inline-block;
        margin-bottom: 1rem;
      }
      .intro-card h1 {
        margin: 0;
        color: #0f392a;
        font-size: clamp(2rem, 2.5vw, 2.75rem);
      }
      .intro-card p {
        margin-top: 1.25rem;
        color: #4B5563;
        line-height: 1.8;
      }
      .signup-form {
        background: white;
        border-radius: 2rem;
        padding: 2.5rem;
        box-shadow: 0 32px 60px rgba(124, 58, 237, 0.08);
        display: grid;
        gap: 1rem;
      }
      label {
        color: #166534;
        font-weight: 700;
      }
      input {
        width: 100%;
        border-radius: 1rem;
        border: 1px solid #d1fae5;
        padding: 1rem;
        background: #f8faf9;
      }
      .plan-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 1rem;
      }
      .plan-card {
        border: 1px solid #d1fae5;
        border-radius: 1.5rem;
        padding: 1rem;
        display: grid;
        gap: 0.5rem;
        cursor: pointer;
        background: #f9fff8;
      }
      .plan-card.active {
        border-color: #7C3AED;
        box-shadow: 0 12px 30px rgba(124, 58, 237, 0.18);
      }
      .plan-card strong {
        display: block;
        font-size: 1.1rem;
      }
      button {
        width: 100%;
        padding: 1rem;
        background: #7C3AED;
        color: white;
        border: none;
        border-radius: 1rem;
        font-weight: 700;
        cursor: pointer;
        margin-top: 1rem;
      }
      @media (max-width: 860px) {
        .signup-shell {
          grid-template-columns: 1fr;
        }
        .plan-grid {
          grid-template-columns: 1fr;
        }
      }
    `
  ]
})
export class OwnerSignupComponent {
  signupForm = this.createForm();

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  private createForm() {
    return this.fb.group({
      plan: ['Pro', Validators.required],
      companyName: ['', Validators.required],
      regNumber: ['', Validators.required],
      taxId: ['', Validators.required],
      bankAccount: ['', Validators.required]
    });
  }

  async submit() {
    if (this.signupForm.invalid) {
      return;
    }
    const { plan, companyName, regNumber, taxId } = this.signupForm.value;
    const payload = {
      plan: plan || 'Pro',
      companyName: companyName || '',
      regNumber: regNumber || '',
      taxId: taxId || ''
    };
    await this.auth.signUpOwner(payload);
    this.router.navigate(['/owner/dashboard']);
  }
}
