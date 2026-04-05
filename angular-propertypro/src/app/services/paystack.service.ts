import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

declare global {
  interface Window {
    PaystackPop?: PaystackPopStatic;
  }
}

export interface InvoicePaymentCalculation {
  invoiceAmount: number;
  platformFee: number;
  grossAmount: number;
  netAmount: number;
  amountInKobo: number;
  platformFeeInKobo: number;
  grossAmountInKobo: number;
  netAmountInKobo: number;
  currency: 'ZAR';
}

export interface PaystackMetadataField {
  display_name: string;
  variable_name: string;
  value: string;
}

export interface PaystackTransactionMetadata {
  custom_fields: PaystackMetadataField[];
  invoiceId?: string;
  invoiceReference?: string;
  tenantId?: string;
  organizationId?: string;
  platformFee?: number;
  netAmount?: number;
}

export interface PaystackInitializeOptions {
  email: string;
  amount: number;
  reference: string;
  invoiceId?: string;
  tenantId?: string;
  organizationId?: string;
  metadata?: PaystackTransactionMetadata;
  onSuccess: (response: PaystackSuccessResponse) => void;
  onClose?: () => void;
}

export interface PaystackSuccessResponse {
  reference: string;
  status: string;
  trans?: string;
  transaction?: string;
  trxref?: string;
  message?: string;
}

export interface PaystackCancelledResponse {
  status: 'cancelled' | 'failed';
  message: string;
}

export interface PaystackVerificationData {
  id?: number;
  domain?: string;
  status?: string;
  reference?: string;
  receipt_number?: string | null;
  amount?: number;
  message?: string | null;
  gateway_response?: string;
  paid_at?: string | null;
  created_at?: string;
  channel?: string;
  currency?: string;
  metadata?: Record<string, unknown> | null;
  fees?: number | null;
  customer?: {
    id?: number;
    email?: string;
    first_name?: string | null;
    last_name?: string | null;
  };
}

export interface PaystackVerificationResponse {
  status: boolean;
  message: string;
  data?: PaystackVerificationData;
}

export interface PaystackWebhookEventData {
  reference?: string;
  amount?: number;
  status?: string;
  paid_at?: string | null;
  currency?: string;
  metadata?: Record<string, unknown> | null;
  customer?: {
    email?: string;
  };
}

export interface PaystackWebhookEvent {
  event: string;
  data: PaystackWebhookEventData;
}

interface PaystackSetupOptions {
  key: string;
  email: string;
  amount: number;
  ref: string;
  currency: 'ZAR';
  metadata: PaystackTransactionMetadata;
  callback: (response: PaystackSuccessResponse) => void;
  onClose: () => void;
}

interface PaystackHandler {
  openIframe(): void;
}

interface PaystackPopStatic {
  setup(options: PaystackSetupOptions): PaystackHandler;
}

@Injectable({ providedIn: 'root' })
export class PaystackService {
  readonly platformFee = 100;
  readonly currency: 'ZAR' = 'ZAR';

  calculateInvoiceAmounts(invoiceAmount: number, platformFee: number = this.platformFee): InvoicePaymentCalculation {
    const normalizedInvoiceAmount = this.normalizeAmount(invoiceAmount);
    const normalizedPlatformFee = this.normalizeAmount(platformFee);
    const grossAmount = this.normalizeAmount(normalizedInvoiceAmount + normalizedPlatformFee);
    const netAmount = normalizedInvoiceAmount;

    return {
      invoiceAmount: normalizedInvoiceAmount,
      platformFee: normalizedPlatformFee,
      grossAmount,
      netAmount,
      amountInKobo: this.toMinorUnit(normalizedInvoiceAmount),
      platformFeeInKobo: this.toMinorUnit(normalizedPlatformFee),
      grossAmountInKobo: this.toMinorUnit(grossAmount),
      netAmountInKobo: this.toMinorUnit(netAmount),
      currency: this.currency
    };
  }

  buildInvoiceReference(invoiceId: string, tenantId: string): string {
    const compactInvoiceId = this.sanitizeReferencePart(invoiceId);
    const compactTenantId = this.sanitizeReferencePart(tenantId);
    const timestamp = Date.now().toString(36).toUpperCase();

    return `PP-${compactInvoiceId}-${compactTenantId}-${timestamp}`.slice(0, 100);
  }

  pay(options: PaystackInitializeOptions): void {
    const paystack = window.PaystackPop;

    if (!paystack) {
      options.onSuccess({
        reference: options.reference,
        status: 'failed',
        message: 'Paystack script not loaded.'
      });
      return;
    }

    const calculation = this.calculateInvoiceAmounts(options.amount);
    const metadata = this.buildMetadata(options, calculation);

    const handler = paystack.setup({
      key: environment.paystackPublicKey,
      email: options.email,
      amount: calculation.grossAmountInKobo,
      ref: options.reference,
      currency: this.currency,
      metadata,
      callback: (response: PaystackSuccessResponse) => options.onSuccess(response),
      onClose: () => {
        if (options.onClose) {
          options.onClose();
        }
      }
    });

    handler.openIframe();
  }

  async verifyTransaction(reference: string): Promise<PaystackVerificationResponse> {
    if (!environment.paystackSecretKey) {
      return {
        status: false,
        message: 'Missing Paystack secret key.'
      };
    }

    const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${environment.paystackSecretKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      return {
        status: false,
        message: `Verification failed with status ${response.status}.`
      };
    }

    return (await response.json()) as PaystackVerificationResponse;
  }

  isSuccessfulWebhook(event: PaystackWebhookEvent): boolean {
    return event.event === 'charge.success' && event.data.status === 'success';
  }

  private buildMetadata(
    options: PaystackInitializeOptions,
    calculation: InvoicePaymentCalculation
  ): PaystackTransactionMetadata {
    const customFields: PaystackMetadataField[] = [
      {
        display_name: 'WiseWorx Invoice Reference',
        variable_name: 'invoice_reference',
        value: options.reference
      },
      {
        display_name: 'Platform Fee',
        variable_name: 'platform_fee',
        value: calculation.platformFee.toFixed(2)
      },
      {
        display_name: 'Net Amount',
        variable_name: 'net_amount',
        value: calculation.netAmount.toFixed(2)
      }
    ];

    if (options.invoiceId) {
      customFields.push({
        display_name: 'Invoice ID',
        variable_name: 'invoice_id',
        value: options.invoiceId
      });
    }

    if (options.tenantId) {
      customFields.push({
        display_name: 'Tenant ID',
        variable_name: 'tenant_id',
        value: options.tenantId
      });
    }

    if (options.organizationId) {
      customFields.push({
        display_name: 'Organization ID',
        variable_name: 'organization_id',
        value: options.organizationId
      });
    }

    return {
      ...(options.metadata ?? {}),
      invoiceId: options.invoiceId,
      invoiceReference: options.reference,
      tenantId: options.tenantId,
      organizationId: options.organizationId,
      platformFee: calculation.platformFee,
      netAmount: calculation.netAmount,
      custom_fields: [
        ...(options.metadata?.custom_fields ?? []),
        ...customFields
      ]
    };
  }

  private normalizeAmount(amount: number): number {
    if (!Number.isFinite(amount) || amount < 0) {
      return 0;
    }

    return Number(amount.toFixed(2));
  }

  private toMinorUnit(amount: number): number {
    return Math.round(this.normalizeAmount(amount) * 100);
  }

  private sanitizeReferencePart(value: string): string {
    return value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 8).toUpperCase() || 'NA';
  }
}