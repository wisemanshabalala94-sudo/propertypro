import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PayrollService, Payslip } from '../../services/payroll.service';

@Component({
  selector: 'app-payslip-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="payslip-detail-shell" *ngIf="payslip; else notFound">
      <div class="detail-header">
        <div>
          <span>Pay slip details</span>
          <h1>{{ payslip.reference }}</h1>
          <p>{{ payslip.building }} • {{ payslip.recipient }}</p>
        </div>
        <div class="buttons">
          <button class="primary-btn" (click)="downloadPayslip()">Download payslip</button>
          <a [routerLink]="[basePath, 'payslips']" class="secondary-btn">Back to payslips</a>
        </div>
      </div>

      <div class="detail-grid">
        <article>
          <h2>Payment summary</h2>
          <dl>
            <dt>Pay period</dt>
            <dd>{{ payslip.payPeriod }}</dd>
            <dt>Payment date</dt>
            <dd>{{ payslip.paymentDate }}</dd>
            <dt>Status</dt>
            <dd>{{ payslip.status }}</dd>
          </dl>
        </article>

        <article>
          <h2>Amounts</h2>
          <dl>
            <dt>Gross</dt>
            <dd>R{{ payslip.grossAmount | number }}</dd>
            <dt>Deductions</dt>
            <dd>R{{ payslip.totalDeductions | number }}</dd>
            <dt>Net</dt>
            <dd><strong>R{{ payslip.netAmount | number }}</strong></dd>
          </dl>
        </article>
      </div>

      <section class="line-items">
        <h2>Line items</h2>
        <div class="item-row" *ngFor="let item of payslip.lineItems">
          <span>{{ item.description }}</span>
          <strong>{{ item.itemType === 'deduction' ? '-' : '+' }}R{{ item.amount | number }}</strong>
        </div>
      </section>

      <div class="notes-card">
        <h2>Notes</h2>
        <p>{{ payslip.notes }}</p>
      </div>
    </section>

    <ng-template #notFound>
      <section class="payslip-detail-shell">
        <div class="empty-state">
          <h1>Payslip not found</h1>
          <p>We couldn't find that payslip. Use the payslip list to select a valid record.</p>
          <a routerLink="/home" class="secondary-btn">Return home</a>
        </div>
      </section>
    </ng-template>
  `,
  styles: [
    `
      .payslip-detail-shell {
        padding: 3rem 2rem 4rem;
        max-width: 1000px;
        margin: 0 auto;
      }
      .detail-header {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        align-items: center;
      }
      .detail-header span {
        color: #7C3AED;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.35em;
      }
      .detail-header h1 {
        margin: 0.5rem 0 0;
        font-size: clamp(2rem, 3vw, 2.8rem);
        color: #0f392a;
      }
      .detail-header p {
        color: #475569;
      }
      .buttons {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
      }
      .primary-btn,
      .secondary-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 3.75rem;
        padding: 0 1.5rem;
        border-radius: 1rem;
        font-weight: 700;
      }
      .primary-btn {
        background: #7C3AED;
        color: white;
        border: none;
      }
      .secondary-btn {
        background: #f3f0ff;
        color: #4338CA;
      }
      .detail-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.5rem;
        margin-top: 2.5rem;
      }
      article {
        background: white;
        border-radius: 1.75rem;
        padding: 2rem;
        box-shadow: 0 30px 80px rgba(124, 58, 237, 0.08);
      }
      dl {
        margin: 0;
      }
      dt {
        color: #475569;
        margin-top: 1rem;
      }
      dd {
        margin: 0.35rem 0 0;
        font-weight: 700;
        color: #374151;
      }
      .line-items {
        margin-top: 2.5rem;
      }
      .item-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 1.25rem;
        background: white;
        border-radius: 1rem;
        margin-bottom: 0.75rem;
        box-shadow: 0 20px 60px rgba(124, 58, 237, 0.06);
      }
      .notes-card {
        margin-top: 2rem;
        padding: 2rem;
        background: white;
        border-radius: 1.75rem;
        box-shadow: 0 30px 80px rgba(124, 58, 237, 0.08);
      }
      .empty-state {
        text-align: center;
        padding: 3rem;
        background: white;
        border-radius: 1.75rem;
        box-shadow: 0 30px 80px rgba(124, 58, 237, 0.08);
      }
      .empty-state h1 {
        margin: 0;
        color: #0f392a;
      }
      .empty-state p {
        color: #475569;
        line-height: 1.8;
      }
      .secondary-btn {
        margin-top: 1.5rem;
        display: inline-flex;
      }
      @media (max-width: 860px) {
        .detail-header {
          flex-direction: column;
          align-items: stretch;
        }
        .detail-grid {
          grid-template-columns: 1fr;
        }
      }
    `
  ]
})
export class PayslipDetailComponent {
  basePath = 'staff';
  payslip: Payslip | undefined;

  constructor(private route: ActivatedRoute, private router: Router, private payroll: PayrollService) {
    const rolePath = window.location.pathname.split('/')[1];
    this.basePath = rolePath || 'staff';
    const payslipId = this.route.snapshot.paramMap.get('id');
    if (payslipId) {
      this.payslip = this.payroll.getPayslipById(payslipId);
    }
  }

  downloadPayslip() {
    if (!this.payslip) {
      return;
    }
    const content = [
      `Payslip Reference: ${this.payslip.reference}`,
      `Recipient: ${this.payslip.recipient}`,
      `Building: ${this.payslip.building}`,
      `Pay period: ${this.payslip.payPeriod}`,
      `Payment date: ${this.payslip.paymentDate}`,
      `Gross amount: R${this.payslip.grossAmount}`,
      `Total deductions: R${this.payslip.totalDeductions}`,
      `Net amount: R${this.payslip.netAmount}`,
      '',
      'Line items:',
      ...this.payslip.lineItems.map((item) => `${item.description}: ${item.itemType === 'deduction' ? '-' : '+'}R${item.amount}`),
      '',
      `Notes: ${this.payslip.notes}`
    ].join('\n');

    const blob = new Blob([content], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${this.payslip.reference}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  }
}
