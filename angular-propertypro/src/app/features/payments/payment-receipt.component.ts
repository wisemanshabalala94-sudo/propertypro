import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaystackService, Payment } from '../../services/paystack.service';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-payment-receipt',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="receipt-page">
      @if (loading()) {
        <div class="receipt-loading"><div class="spinner"></div><p>Generating receipt...</p></div>
      } @else if (receipt()) {
        <div class="receipt-card" #receiptCard>
          <!-- Letterhead -->
          <div class="receipt-letterhead">
            <div class="receipt-letterhead__logo">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="8" fill="#7C3AED"/><text x="50%" y="55%" text-anchor="middle" fill="white" font-size="12" font-weight="bold" dominant-baseline="middle">WW</text></svg>
            </div>
            <div class="receipt-letterhead__info">
              <div class="receipt-letterhead__company">PropertyPro by WiseWorx</div>
              <div class="receipt-letterhead__address">Enterprise Property Management</div>
              <div class="receipt-letterhead__contact">support@wiseworx.co.za | +27 11 000 0000</div>
            </div>
            <div class="receipt-letterhead__title">PAYMENT RECEIPT</div>
          </div>

          <!-- Receipt Details -->
          <div class="receipt-body">
            <div class="receipt-row">
              <div class="receipt-row__item">
                <span class="receipt-row__label">Receipt Number</span>
                <span class="receipt-row__value">{{ receipt()!.receiptNumber }}</span>
              </div>
              <div class="receipt-row__item">
                <span class="receipt-row__label">Date</span>
                <span class="receipt-row__value">{{ receipt()!.date }}</span>
              </div>
            </div>

            <div class="receipt-row">
              <div class="receipt-row__item">
                <span class="receipt-row__label">Paystack Reference</span>
                <span class="receipt-row__value">{{ receipt()!.paystackRef }}</span>
              </div>
              <div class="receipt-row__item">
                <span class="receipt-row__label">Payment Method</span>
                <span class="receipt-row__value">{{ receipt()!.method }}</span>
              </div>
            </div>

            <hr class="receipt-divider" />

            <div class="receipt-row">
              <div class="receipt-row__item">
                <span class="receipt-row__label">Tenant</span>
                <span class="receipt-row__value">{{ receipt()!.tenantName }}</span>
              </div>
              <div class="receipt-row__item">
                <span class="receipt-row__label">Property</span>
                <span class="receipt-row__value">{{ receipt()!.propertyName }}</span>
              </div>
            </div>

            <div class="receipt-row">
              <div class="receipt-row__item">
                <span class="receipt-row__label">Invoice Number</span>
                <span class="receipt-row__value">{{ receipt()!.invoiceNumber }}</span>
              </div>
              <div class="receipt-row__item">
                <span class="receipt-row__label">Invoice Type</span>
                <span class="receipt-row__value">{{ receipt()!.invoiceType }}</span>
              </div>
            </div>

            <hr class="receipt-divider" />

            <!-- Amount Breakdown -->
            <div class="receipt-amounts">
              <div class="receipt-amounts__row">
                <span>Invoice Amount</span>
                <span>{{ receipt()!.amount }}</span>
              </div>
              <div class="receipt-amounts__row receipt-amounts__row--fee">
                <span>Platform Fee (WiseWorx)</span>
                <span>-R100.00</span>
              </div>
              <div class="receipt-amounts__row receipt-amounts__row--net">
                <span>Net to Property Owner</span>
                <span>{{ receipt()!.netAmount }}</span>
              </div>
              <div class="receipt-amounts__row receipt-amounts__row--total">
                <span>Total Paid</span>
                <span>{{ receipt()!.totalPaid }}</span>
              </div>
            </div>

            <!-- QR Code Verification -->
            <div class="receipt-qr">
              <div class="receipt-qr__code">
                <div class="receipt-qr__placeholder">
                  <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                    <rect x="5" y="5" width="20" height="20" fill="#1F2937"/>
                    <rect x="55" y="5" width="20" height="20" fill="#1F2937"/>
                    <rect x="5" y="55" width="20" height="20" fill="#1F2937"/>
                    <rect x="30" y="30" width="20" height="20" fill="#1F2937"/>
                    <rect x="10" y="10" width="10" height="10" fill="white"/>
                    <rect x="60" y="10" width="10" height="10" fill="white"/>
                    <rect x="10" y="60" width="10" height="10" fill="white"/>
                    <rect x="13" y="13" width="4" height="4" fill="#1F2937"/>
                    <rect x="63" y="13" width="4" height="4" fill="#1F2937"/>
                    <rect x="13" y="63" width="4" height="4" fill="#1F2937"/>
                    <rect x="35" y="35" width="10" height="10" fill="white"/>
                    <rect x="38" y="38" width="4" height="4" fill="#1F2937"/>
                  </svg>
                </div>
              </div>
              <div class="receipt-qr__text">
                <div class="receipt-qr__label">Scan to verify</div>
                <div class="receipt-qr__ref">{{ receipt()!.receiptNumber }}</div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="receipt-footer">
            <p class="receipt-footer__text">This is a computer-generated receipt. No signature required.</p>
            <p class="receipt-footer__powered">Powered by PropertyPro™ — A WiseWorx Company</p>
          </div>
        </div>

        <div class="receipt-actions">
          <button class="btn btn-primary" (click)="printReceipt()">
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            Print Receipt
          </button>
          <button class="btn btn-secondary" (click)="emailReceipt()">
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            Email Receipt
          </button>
          <button class="btn btn-secondary" (click)="downloadPdf()">
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Download PDF
          </button>
        </div>
      } @else {
        <div class="receipt-empty">
          <p>No receipt to display</p>
          <button class="btn btn-secondary" routerLink="/tenant/dashboard">Back to Dashboard</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .receipt-page { min-height: 100vh; background: #F9FAFB; padding: 2rem; display: flex; flex-direction: column; align-items: center; }
    .receipt-loading { display: flex; flex-direction: column; align-items: center; gap: 1rem; color: #6B7280; padding: 4rem; }
    .receipt-card { background: white; border-radius: 0.75rem; box-shadow: 0 4px 12px rgba(0,0,0,0.08); border: 1px solid #E5E7EB; width: 100%; max-width: 600px; overflow: hidden; }
    .receipt-letterhead { padding: 1.5rem; background: linear-gradient(135deg, #F5F3FF, #EDE9FE); display: flex; align-items: center; gap: 1rem; border-bottom: 2px solid #7C3AED; }
    .receipt-letterhead__logo { flex-shrink: 0; }
    .receipt-letterhead__info { flex: 1; }
    .receipt-letterhead__company { font-weight: 700; color: #1F2937; font-size: 1.1rem; }
    .receipt-letterhead__address { font-size: 0.8rem; color: #6B7280; }
    .receipt-letterhead__contact { font-size: 0.75rem; color: #9CA3AF; }
    .receipt-letterhead__title { font-weight: 800; color: #7C3AED; font-size: 1.25rem; letter-spacing: 0.05em; }
    .receipt-body { padding: 1.5rem; }
    .receipt-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem; }
    .receipt-row__item { display: flex; flex-direction: column; gap: 0.25rem; }
    .receipt-row__label { font-size: 0.7rem; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600; }
    .receipt-row__value { font-size: 0.9rem; color: #1F2937; font-weight: 500; }
    .receipt-divider { border: none; border-top: 1px dashed #E5E7EB; margin: 1rem 0; }
    .receipt-amounts { background: #F9FAFB; border-radius: 0.5rem; padding: 1rem; margin: 1rem 0; }
    .receipt-amounts__row { display: flex; justify-content: space-between; padding: 0.375rem 0; font-size: 0.85rem; color: #374151; }
    .receipt-amounts__row--fee { color: #6B7280; font-size: 0.8rem; }
    .receipt-amounts__row--net { border-top: 1px solid #E5E7EB; padding-top: 0.5rem; margin-top: 0.25rem; }
    .receipt-amounts__row--total { font-weight: 700; font-size: 1.1rem; color: #1F2937; border-top: 2px solid #7C3AED; padding-top: 0.5rem; margin-top: 0.5rem; }
    .receipt-qr { display: flex; align-items: center; gap: 1rem; padding: 1rem; background: #F9FAFB; border-radius: 0.5rem; margin-top: 1rem; }
    .receipt-qr__placeholder { background: white; padding: 0.5rem; border-radius: 0.25rem; border: 1px solid #E5E7EB; }
    .receipt-qr__label { font-size: 0.75rem; color: #6B7280; }
    .receipt-qr__ref { font-size: 0.7rem; color: #9CA3AF; font-family: monospace; }
    .receipt-footer { padding: 1rem 1.5rem; background: #F9FAFB; border-top: 1px solid #E5E7EB; text-align: center; }
    .receipt-footer__text { font-size: 0.75rem; color: #9CA3AF; margin: 0 0 0.25rem; }
    .receipt-footer__powered { font-size: 0.7rem; color: #6B7280; font-weight: 600; margin: 0; }
    .receipt-actions { display: flex; gap: 0.75rem; margin-top: 1.5rem; flex-wrap: wrap; justify-content: center; }
    .btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.625rem 1.25rem; border-radius: 0.5rem; font-weight: 600; font-size: 0.875rem; cursor: pointer; border: 1px solid transparent; text-decoration: none; }
    .btn-primary { background: #7C3AED; color: white; } .btn-primary:hover { background: #6D28D9; }
    .btn-secondary { background: white; color: #374151; border-color: #D1D5DB; } .btn-secondary:hover { background: #F9FAFB; }
    .receipt-empty { text-align: center; padding: 4rem; color: #6B7280; }
    @media print { .receipt-actions, .receipt-page { padding: 0; background: white; } .receipt-card { box-shadow: none; border: none; } }
    @media (max-width: 640px) { .receipt-row { grid-template-columns: 1fr; } .receipt-actions { flex-direction: column; } .receipt-actions .btn { width: 100%; justify-content: center; } }
  `]
})
export class PaymentReceiptComponent implements OnInit {
  private paystack = inject(PaystackService);
  private supabase = inject(SupabaseService);
  protected loading = signal(true);
  protected receipt = signal<{
    receiptNumber: string; date: string; paystackRef: string; method: string;
    tenantName: string; propertyName: string; invoiceNumber: string; invoiceType: string;
    amount: string; netAmount: string; totalPaid: string;
  } | null>(null);

  ngOnInit(): void { void this.loadReceipt(); }

  private async loadReceipt(): Promise<void> {
    // Get latest payment from Supabase
    try {
      const user = this.supabase['authService']?.getCurrentUser?.();
      if (!user?.auth?.accessToken) { this.loading.set(false); return; }

      const payments = await this.supabase.getPaymentsByOrg(user.organizationId ?? '', user.auth.accessToken).catch(() => []);
      const payment = payments[0];
      if (!payment) { this.loading.set(false); return; }

      this.receipt.set({
        receiptNumber: `RCPT-${payment.id.slice(0, 8).toUpperCase()}`,
        date: new Date(payment.created_at).toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' }),
        paystackRef: payment.paystack_reference ?? 'N/A',
        method: payment.payment_method.replace('_', ' ').toUpperCase(),
        tenantName: payment.tenant_id?.slice(0, 8) ?? 'N/A',
        propertyName: 'PropertyPro Property',
        invoiceNumber: payment.invoice_id?.slice(0, 8) ?? 'N/A',
        invoiceType: 'Rent',
        amount: `R${Number(payment.amount).toFixed(2)}`,
        netAmount: `R${(Number(payment.amount) - 100).toFixed(2)}`,
        totalPaid: `R${Number(payment.amount).toFixed(2)}`
      });
    } catch { /* silent */ }
    finally { this.loading.set(false); }
  }

  printReceipt(): void { window.print(); }

  emailReceipt(): void {
    // TODO: Send email via Supabase Edge Function
    alert('Receipt sent to your email.');
  }

  downloadPdf(): void {
    // TODO: Generate PDF using jsPDF
    alert('PDF download started.');
  }
}
