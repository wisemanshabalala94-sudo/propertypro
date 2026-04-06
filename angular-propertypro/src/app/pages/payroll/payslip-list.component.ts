import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PayrollService, Payslip } from '../../services/payroll.service';

@Component({
  selector: 'app-payslip-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="payslip-shell">
      <div class="page-header">
        <div>
          <span>Pay slips</span>
          <h1>Recent payroll records for your account.</h1>
          <p>Download or review each payslip, and keep payroll status aligned with operations.</p>
        </div>
        <button class="primary-btn" (click)="refresh()">Refresh</button>
      </div>

      <div class="payslip-table" *ngIf="payslips.length; else emptyState">
        <div class="table-header">
          <span>Reference</span>
          <span>Recipient</span>
          <span>Pay period</span>
          <span>Status</span>
          <span>Amount</span>
        </div>
        <div class="table-row" *ngFor="let payslip of payslips" [routerLink]="['/', rolePath, 'payslips', payslip.id]">
          <span>{{ payslip.reference }}</span>
          <span>{{ payslip.recipient }}</span>
          <span>{{ payslip.payPeriod }}</span>
          <span class="status {{ payslip.status }}">{{ payslip.status }}</span>
          <span>R{{ payslip.netAmount | number }}</span>
        </div>
      </div>

      <ng-template #emptyState>
        <div class="empty-state">
          <p>No payslips are available yet. Check back after the next payroll run.</p>
          <a routerLink="/home" class="secondary-btn">Return home</a>
        </div>
      </ng-template>
    </section>
  `,
  styles: [
    `
      .payslip-shell {
        padding: 3rem 2rem 4rem;
        max-width: 1200px;
        margin: 0 auto;
      }
      .page-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
      }
      .page-header span {
        display: inline-block;
        color: #7C3AED;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.35em;
      }
      .page-header h1 {
        margin: 0.5rem 0 0;
        font-size: clamp(2rem, 3vw, 2.75rem);
        color: #0f392a;
      }
      .page-header p {
        color: #475569;
        max-width: 720px;
        line-height: 1.8;
      }
      .primary-btn {
        background: #7C3AED;
        color: white;
        min-height: 3.75rem;
        border: none;
        border-radius: 1rem;
        padding: 0 1.5rem;
        font-weight: 700;
        cursor: pointer;
      }
      .payslip-table {
        margin-top: 2rem;
        border-radius: 1.75rem;
        overflow: hidden;
        background: white;
        box-shadow: 0 30px 80px rgba(124, 58, 237, 0.08);
      }
      .table-header,
      .table-row {
        display: grid;
        grid-template-columns: 1.3fr 1fr 1fr 0.9fr 1fr;
        gap: 1rem;
        padding: 1.25rem 1.5rem;
        align-items: center;
      }
      .table-header {
        background: #f3f0ff;
        color: #7C3AED;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.02em;
      }
      .table-row {
        cursor: pointer;
        border-top: 1px solid #ecfdf5;
        transition: background 0.2s ease;
      }
      .table-row:hover {
        background: #f5f3ff;
      }
      .status {
        text-transform: capitalize;
        font-weight: 700;
      }
      .status.pending {
        color: #b45309;
      }
      .status.processed {
        color: #7C3AED;
      }
      .status.paid {
        color: #4338CA;
      }
      .status.cancelled {
        color: #991b1b;
      }
      .empty-state {
        margin-top: 3rem;
        padding: 3rem;
        text-align: center;
        background: white;
        border-radius: 1.75rem;
        box-shadow: 0 30px 80px rgba(124, 58, 237, 0.08);
      }
      .empty-state p {
        margin: 0 0 1.5rem;
        color: #475569;
      }
      .secondary-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 3.75rem;
        padding: 0 1.5rem;
        border-radius: 1rem;
        background: #f3f0ff;
        color: #4338CA;
        font-weight: 700;
      }
      @media (max-width: 860px) {
        .page-header {
          flex-direction: column;
          align-items: flex-start;
        }
        .table-header,
        .table-row {
          grid-template-columns: 1fr;
          gap: 0.75rem;
        }
      }
    `
  ]
})
export class PayslipListComponent {
  rolePath = 'staff';
  payslips: Payslip[] = [];

  constructor(private auth: AuthService, private payroll: PayrollService, private router: Router) {
    const role = this.auth.getCurrentUser()?.role ?? 'staff';
    this.rolePath = role === 'owner' ? 'owner' : 'staff';
    this.payslips = this.payroll.getPayslipsForRole(role);
  }

  refresh() {
    const role = this.auth.getCurrentUser()?.role ?? 'staff';
    this.payslips = this.payroll.getPayslipsForRole(role);
  }
}
