import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

interface UploadFileState {
  readonly name: string;
  readonly size: number;
  readonly type: string;
  readonly lastModified: number;
}

interface TenantOnboardingPayload {
  readonly fullName: string;
  readonly email: string;
  readonly phoneNumber: string;
  readonly idNumber: string;
  readonly propertyAddress: string;
  readonly monthlyRent: number;
  readonly employerName: string;
  readonly moveInDate: string;
  readonly idDocument: UploadFileState | null;
  readonly bankStatements: readonly UploadFileState[];
  readonly agreedToTerms: boolean;
}

@Component({
  selector: 'app-tenant-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <section class="onboarding-page">
      <div class="onboarding-shell">
        <header class="page-header">
          <p class="eyebrow">Tenant onboarding</p>
          <h1>Complete your PropertyPro access request</h1>
          <p class="lede">
            WiseWorx requires a valid ID document and the latest three months of bank statements before
            tenant access can be approved.
          </p>
        </header>

        <div class="progress-card" aria-label="Onboarding progress">
          <div class="progress-track">
            <div class="progress-bar" [style.width.%]="progressPercentage()"></div>
          </div>
          <div class="step-indicators">
            <span class="step-pill" [class.active]="currentStep() >= 1">1. Profile</span>
            <span class="step-pill" [class.active]="currentStep() >= 2">2. Documents</span>
            <span class="step-pill" [class.active]="currentStep() >= 3">3. Review</span>
          </div>
        </div>

        @if (submissionLocked()) {
          <section class="lockout-card">
            <h2>Application submitted</h2>
            <p>
              Your onboarding package has been sent for review. Access remains locked until an administrator
              approves your account.
            </p>
            <ul>
              <li>ID document received: <strong>{{ uploadedIdDocument()?.name }}</strong></li>
              <li>Bank statements received: <strong>{{ bankStatementFiles().length }}</strong> of 3</li>
              <li>Status: <strong>Pending approval</strong></li>
            </ul>
            <div class="lockout-actions">
              <a routerLink="/tenant/pending" class="primary-link">View pending status</a>
            </div>
          </section>
        } @else {
          <form class="onboarding-form" [formGroup]="onboardingForm" (ngSubmit)="submitApplication()">
            @if (currentStep() === 1) {
              <section class="form-card">
                <h2>Step 1 · Personal and tenancy details</h2>
                <div class="form-grid">
                  <label class="field">
                    <span>Full name</span>
                    <input type="text" formControlName="fullName" />
                    @if (showControlError('fullName')) {
                      <small>Full name is required.</small>
                    }
                  </label>

                  <label class="field">
                    <span>Email address</span>
                    <input type="email" formControlName="email" />
                    @if (showControlError('email')) {
                      <small>Enter a valid email address.</small>
                    }
                  </label>

                  <label class="field">
                    <span>Phone number</span>
                    <input type="tel" formControlName="phoneNumber" />
                    @if (showControlError('phoneNumber')) {
                      <small>Phone number is required.</small>
                    }
                  </label>

                  <label class="field">
                    <span>ID number</span>
                    <input type="text" formControlName="idNumber" />
                    @if (showControlError('idNumber')) {
                      <small>ID number must be at least 6 characters.</small>
                    }
                  </label>

                  <label class="field field-wide">
                    <span>Property address</span>
                    <input type="text" formControlName="propertyAddress" />
                    @if (showControlError('propertyAddress')) {
                      <small>Property address is required.</small>
                    }
                  </label>

                  <label class="field">
                    <span>Monthly rent (R)</span>
                    <input type="number" formControlName="monthlyRent" min="1" />
                    @if (showControlError('monthlyRent')) {
                      <small>Monthly rent must be greater than zero.</small>
                    }
                  </label>

                  <label class="field">
                    <span>Employer name</span>
                    <input type="text" formControlName="employerName" />
                    @if (showControlError('employerName')) {
                      <small>Employer name is required.</small>
                    }
                  </label>

                  <label class="field">
                    <span>Move-in date</span>
                    <input type="date" formControlName="moveInDate" />
                    @if (showControlError('moveInDate')) {
                      <small>Select your expected move-in date.</small>
                    }
                  </label>
                </div>
              </section>
            }

            @if (currentStep() === 2) {
              <section class="form-card">
                <h2>Step 2 · Upload compliance documents</h2>

                <label class="upload-card">
                  <span class="upload-title">Government ID document</span>
                  <input type="file" accept=".pdf,.png,.jpg,.jpeg" (change)="onIdDocumentSelected($event)" />
                  <span class="upload-hint">Accepted: PDF, PNG, JPG</span>
                  @if (uploadedIdDocument(); as document) {
                    <strong>{{ document.name }}</strong>
                  } @else if (idDocumentTouched()) {
                    <small>An ID document is required.</small>
                  }
                </label>

                <div class="upload-card">
                  <span class="upload-title">Three latest bank statements</span>
                  <input type="file" accept=".pdf,.png,.jpg,.jpeg" multiple (change)="onBankStatementsSelected($event)" />
                  <span class="upload-hint">Upload exactly three files covering the last three months.</span>

                  @if (bankStatementFiles().length > 0) {
                    <ul class="file-list">
                      @for (file of bankStatementFiles(); track file.name + file.lastModified) {
                        <li>{{ file.name }}</li>
                      }
                    </ul>
                  }

                  @if (bankStatementsTouched() && bankStatementFiles().length !== 3) {
                    <small>Exactly three bank statements are required.</small>
                  }
                </div>

                <label class="checkbox-field">
                  <input type="checkbox" formControlName="agreedToTerms" />
                  <span>I confirm the information is accurate and understand access is locked until approval.</span>
                </label>
                @if (showControlError('agreedToTerms')) {
                  <small class="checkbox-error">You must accept the declaration before continuing.</small>
                }
              </section>
            }

            @if (currentStep() === 3) {
              <section class="form-card">
                <h2>Step 3 · Review and submit</h2>

                <div class="review-grid">
                  <div><span>Applicant</span><strong>{{ onboardingForm.controls.fullName.value }}</strong></div>
                  <div><span>Email</span><strong>{{ onboardingForm.controls.email.value }}</strong></div>
                  <div><span>Phone</span><strong>{{ onboardingForm.controls.phoneNumber.value }}</strong></div>
                  <div><span>ID number</span><strong>{{ onboardingForm.controls.idNumber.value }}</strong></div>
                  <div><span>Property</span><strong>{{ onboardingForm.controls.propertyAddress.value }}</strong></div>
                  <div><span>Monthly rent</span><strong>R {{ onboardingForm.controls.monthlyRent.value }}</strong></div>
                  <div><span>Employer</span><strong>{{ onboardingForm.controls.employerName.value }}</strong></div>
                  <div><span>Move-in date</span><strong>{{ onboardingForm.controls.moveInDate.value }}</strong></div>
                  <div><span>ID upload</span><strong>{{ uploadedIdDocument()?.name ?? 'Missing' }}</strong></div>
                  <div><span>Bank statements</span><strong>{{ bankStatementFiles().length }} / 3</strong></div>
                </div>

                <div class="alert-box">
                  <strong>Access lockout policy</strong>
                  <p>
                    You will be redirected to the pending status page after submission. Tenant dashboards remain
                    unavailable until your onboarding package is approved by an administrator.
                  </p>
                </div>
              </section>
            }

            <div class="form-actions">
              @if (currentStep() > 1) {
                <button type="button" class="secondary-button" (click)="goToPreviousStep()">Back</button>
              }
              @if (currentStep() < 3) {
                <button type="button" class="primary-button" (click)="goToNextStep()">Continue</button>
              } @else {
                <button type="submit" class="primary-button">Submit onboarding</button>
              }
            </div>
          </form>
        }
      </div>
    </section>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }

    .onboarding-page {
      min-height: 100%;
      background: linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%);
      padding: 2rem 1rem 4rem;
      color: #111827;
    }

    .onboarding-shell {
      margin: 0 auto;
      max-width: 960px;
      display: grid;
      gap: 1.5rem;
    }

    .page-header,
    .progress-card,
    .form-card,
    .lockout-card {
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 1.25rem;
      box-shadow: 0 20px 45px rgba(15, 23, 42, 0.08);
      padding: 1.5rem;
    }

    .eyebrow {
      margin: 0 0 0.5rem;
      color: #7C3AED;
      font-size: 0.9rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    h1,
    h2 {
      margin: 0 0 0.75rem;
    }

    .lede {
      margin: 0;
      color: #4b5563;
      line-height: 1.6;
    }

    .progress-track {
      height: 0.65rem;
      background: #e5e7eb;
      border-radius: 999px;
      overflow: hidden;
      margin-bottom: 1rem;
    }

    .progress-bar {
      height: 100%;
      background: linear-gradient(90deg, #7C3AED 0%, #8B5CF6 100%);
      transition: width 180ms ease-in-out;
    }

    .step-indicators {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
    }

    .step-pill {
      border-radius: 999px;
      padding: 0.55rem 0.9rem;
      background: #f3f4f6;
      color: #6b7280;
      font-weight: 600;
    }

    .step-pill.active {
      background: rgba(124, 58, 237, 0.12);
      color: #7C3AED;
    }

    .form-grid,
    .review-grid {
      display: grid;
      gap: 1rem;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    }

    .field,
    .upload-card {
      display: grid;
      gap: 0.45rem;
    }

    .field-wide {
      grid-column: 1 / -1;
    }

    .field span,
    .upload-title,
    .review-grid span {
      font-weight: 600;
      color: #374151;
    }

    input[type="text"],
    input[type="email"],
    input[type="tel"],
    input[type="number"],
    input[type="date"],
    input[type="file"] {
      width: 100%;
      border: 1px solid #d1d5db;
      border-radius: 0.85rem;
      padding: 0.85rem 1rem;
      font: inherit;
      background: #ffffff;
      color: #111827;
      box-sizing: border-box;
    }

    input:focus {
      outline: 2px solid rgba(124, 58, 237, 0.22);
      outline-offset: 1px;
      border-color: #7C3AED;
    }

    small {
      color: #dc2626;
      font-size: 0.85rem;
    }

    .upload-card {
      border: 1px dashed #cbd5e1;
      border-radius: 1rem;
      padding: 1rem;
      margin-bottom: 1rem;
      background: #f8fafc;
    }

    .upload-hint {
      color: #6b7280;
      font-size: 0.9rem;
    }

    .file-list {
      margin: 0.25rem 0 0;
      padding-left: 1.1rem;
      color: #374151;
    }

    .checkbox-field {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      margin-top: 1rem;
      color: #374151;
    }

    .checkbox-field input {
      margin-top: 0.15rem;
    }

    .checkbox-error {
      display: block;
      margin-top: 0.5rem;
    }

    .review-grid div {
      display: grid;
      gap: 0.35rem;
      border: 1px solid #e5e7eb;
      border-radius: 0.95rem;
      padding: 1rem;
      background: #f9fafb;
    }

    .alert-box {
      margin-top: 1rem;
      border-left: 4px solid #7C3AED;
      background: #F5F3FF;
      padding: 1rem;
      border-radius: 0.85rem;
      color: #5B21B6;
    }

    .form-actions,
    .lockout-actions {
      display: flex;
      gap: 0.75rem;
      justify-content: flex-end;
      flex-wrap: wrap;
    }

    .primary-button,
    .secondary-button,
    .primary-link {
      border: 0;
      border-radius: 999px;
      padding: 0.9rem 1.25rem;
      font: inherit;
      font-weight: 700;
      cursor: pointer;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .primary-button,
    .primary-link {
      background: #7C3AED;
      color: #ffffff;
    }

    .secondary-button {
      background: #e5e7eb;
      color: #111827;
    }

    .lockout-card ul {
      color: #374151;
      line-height: 1.7;
      padding-left: 1.25rem;
    }

    @media (max-width: 640px) {
      .onboarding-page {
        padding-inline: 0.75rem;
      }

      .form-actions {
        justify-content: stretch;
      }

      .primary-button,
      .secondary-button {
        flex: 1 1 auto;
      }
    }
  `]
})
export class TenantSignupComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);

  protected readonly currentStep = signal(1);
  protected readonly uploadedIdDocument = signal<UploadFileState | null>(null);
  protected readonly bankStatementFiles = signal<readonly UploadFileState[]>([]);
  protected readonly idDocumentTouched = signal(false);
  protected readonly bankStatementsTouched = signal(false);
  protected readonly submissionLocked = signal(false);

  protected readonly onboardingForm = this.formBuilder.nonNullable.group({
    fullName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', [Validators.required]],
    idNumber: ['', [Validators.required, Validators.minLength(6)]],
    propertyAddress: ['', [Validators.required]],
    monthlyRent: [0, [Validators.required, Validators.min(1)]],
    employerName: ['', [Validators.required]],
    moveInDate: ['', [Validators.required]],
    agreedToTerms: [false, [Validators.requiredTrue]]
  });

  protected readonly progressPercentage = computed(() => (this.currentStep() / 3) * 100);

  protected showControlError(controlName: keyof typeof this.onboardingForm.controls): boolean {
    const control = this.onboardingForm.controls[controlName];
    return control.invalid && (control.touched || control.dirty);
  }

  protected goToNextStep(): void {
    if (this.currentStep() === 1) {
      this.markStepOneTouched();
      if (this.isStepOneValid()) {
        this.currentStep.set(2);
      }
      return;
    }

    if (this.currentStep() === 2) {
      this.idDocumentTouched.set(true);
      this.bankStatementsTouched.set(true);
      this.onboardingForm.controls.agreedToTerms.markAsTouched();

      if (this.hasValidDocuments() && this.onboardingForm.controls.agreedToTerms.valid) {
        this.currentStep.set(3);
      }
    }
  }

  protected goToPreviousStep(): void {
    if (this.currentStep() > 1) {
      this.currentStep.update((step) => step - 1);
    }
  }

  protected onIdDocumentSelected(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    const file = input?.files?.item(0) ?? null;
    this.idDocumentTouched.set(true);
    this.uploadedIdDocument.set(file ? this.mapFile(file) : null);
  }

  protected onBankStatementsSelected(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    const files = input?.files ? Array.from(input.files).slice(0, 3).map((file) => this.mapFile(file)) : [];
    this.bankStatementsTouched.set(true);
    this.bankStatementFiles.set(files);
  }

  protected submitApplication(): void {
    this.markStepOneTouched();
    this.idDocumentTouched.set(true);
    this.bankStatementsTouched.set(true);
    this.onboardingForm.controls.agreedToTerms.markAsTouched();

    if (!this.onboardingForm.valid || !this.hasValidDocuments()) {
      if (this.currentStep() !== 3) {
        this.currentStep.set(3);
      }
      return;
    }

    const payload: TenantOnboardingPayload = {
      fullName: this.onboardingForm.controls.fullName.value,
      email: this.onboardingForm.controls.email.value,
      phoneNumber: this.onboardingForm.controls.phoneNumber.value,
      idNumber: this.onboardingForm.controls.idNumber.value,
      propertyAddress: this.onboardingForm.controls.propertyAddress.value,
      monthlyRent: this.onboardingForm.controls.monthlyRent.value,
      employerName: this.onboardingForm.controls.employerName.value,
      moveInDate: this.onboardingForm.controls.moveInDate.value,
      idDocument: this.uploadedIdDocument(),
      bankStatements: this.bankStatementFiles(),
      agreedToTerms: this.onboardingForm.controls.agreedToTerms.value
    };

    localStorage.setItem('propertypro.tenantOnboarding', JSON.stringify(payload));
    localStorage.setItem('propertypro.tenantApprovalStatus', 'pending');
    this.submissionLocked.set(true);
    void this.router.navigate(['/tenant/pending']);
  }

  private isStepOneValid(): boolean {
    return (
      this.onboardingForm.controls.fullName.valid &&
      this.onboardingForm.controls.email.valid &&
      this.onboardingForm.controls.phoneNumber.valid &&
      this.onboardingForm.controls.idNumber.valid &&
      this.onboardingForm.controls.propertyAddress.valid &&
      this.onboardingForm.controls.monthlyRent.valid &&
      this.onboardingForm.controls.employerName.valid &&
      this.onboardingForm.controls.moveInDate.valid
    );
  }

  private markStepOneTouched(): void {
    this.onboardingForm.controls.fullName.markAsTouched();
    this.onboardingForm.controls.email.markAsTouched();
    this.onboardingForm.controls.phoneNumber.markAsTouched();
    this.onboardingForm.controls.idNumber.markAsTouched();
    this.onboardingForm.controls.propertyAddress.markAsTouched();
    this.onboardingForm.controls.monthlyRent.markAsTouched();
    this.onboardingForm.controls.employerName.markAsTouched();
    this.onboardingForm.controls.moveInDate.markAsTouched();
  }

  private hasValidDocuments(): boolean {
    return this.uploadedIdDocument() !== null && this.bankStatementFiles().length === 3;
  }

  private mapFile(file: File): UploadFileState {
    return {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified
    };
  }
}