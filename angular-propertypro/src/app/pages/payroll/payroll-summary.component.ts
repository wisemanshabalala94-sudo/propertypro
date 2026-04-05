import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PayrollService } from '../../services/payroll.service';

@Component({
  selector: 'app-payroll-summary',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="payroll-shell">
      <div class="page-title">
        <span>Staff payroll</span>
        <h1>Salary, attendance, and payslip control for your operations team.</h1>
        <p>Review payment cadence, pending approvals, and the next payroll date in one view.</p>
      </div>

      <div class="summary-grid">
        <article class="summary-card">
          <span>Total staff</span>
          <strong>{{ summary.totalStaff }}</strong>
        </article>
        <article class="summary-card">
          <span>Next payroll</span>
          <strong>{{ summary.nextPayment }}</strong>
        </article>
        <article class="summary-card">
          <span>Total payroll</span>
          <strong>R{{ summary.totalPayroll | number }}</strong>
        </article>
        <article class="summary-card">
          <span>Pending actions</span>
          <strong>{{ summary.pendingActions }}</strong>
        </article>
      </div>

      <div class="action-panel">
        <a routerLink="/staff/payslips" class="action-btn">Open payslip list</a>
        <a routerLink="/staff/dashboard" class="secondary-btn">Back to staff dashboard</a>
      </div>
    </section>
  `,
  styles: [
    `
      .payroll-shell {
        padding: 3rem 2rem 4rem;
        max-width: 1200px;
        margin: 0 auto;
      }
      .page-title span {
        display: inline-block;
        color: #047857;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.35em;
      }
      .page-title h1 {
        margin: 1rem 0 0.5rem;
        font-size: clamp(2.4rem, 3vw, 3.2rem);
        color: #0f392a;
      }
      .page-title p {
        color: #475569;
        max-width: 700px;
        line-height: 1.8;
      }
      .summary-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 1.5rem;
        margin-top: 2.5rem;
      }
      .summary-card {
        padding: 2rem;
        border-radius: 1.75rem;
        background: white;
        box-shadow: 0 30px 80px rgba(15, 60, 47, 0.08);
      }
      .summary-card span {
        display: block;
        color: #475569;
        margin-bottom: 1rem;
        font-weight: 700;
      }
      .summary-card strong {
        display: block;
        font-size: 2.25rem;
        color: #0f5132;
      }
      .action-panel {
        margin-top: 2rem;
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
      }
      .action-btn,
      .secondary-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 4rem;
        padding: 0 1.75rem;
        border-radius: 1.25rem;
        font-weight: 700;
      }
      .action-btn {
        background: #10b981;
        color: white;
      }
      .secondary-btn {
        background: #f3faf6;
        color: #065f46;
      }
      @media (max-width: 960px) {
        .summary-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }
      @media (max-width: 640px) {
        .summary-grid {
          grid-template-columns: 1fr;
        }
      }
    `
  ]
})
export class PayrollSummaryComponent {
  summary = this.getSummary();

  constructor(private auth: AuthService, private payroll: PayrollService) {}

  private getSummary() {
    const role = this.auth.getCurrentUser()?.role ?? 'staff';
    return this.payroll.getSummaryForRole(role);
  }
}
