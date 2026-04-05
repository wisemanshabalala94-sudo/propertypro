import { Injectable } from '@angular/core';
import { UserRole } from './auth.service';

export interface PayslipLineItem {
  description: string;
  amount: number;
  itemType: 'earnings' | 'deduction' | 'addition';
}

export interface Payslip {
  id: string;
  reference: string;
  role: UserRole;
  recipient: string;
  building: string;
  payPeriod: string;
  paymentDate: string;
  grossAmount: number;
  totalDeductions: number;
  netAmount: number;
  currency: 'ZAR';
  status: 'pending' | 'processed' | 'paid' | 'cancelled';
  notes: string;
  lineItems: PayslipLineItem[];
}

export interface PayrollSummary {
  totalStaff: number;
  nextPayment: string;
  totalPayroll: number;
  pendingActions: number;
}

@Injectable({ providedIn: 'root' })
export class PayrollService {
  private payslips: Payslip[] = [
    {
      id: 'payslip-001',
      reference: 'PS-2026-04-001',
      role: 'staff',
      recipient: 'Andre M.',
      building: 'Sunrise Apartments',
      payPeriod: '01 Apr 2026 - 30 Apr 2026',
      paymentDate: '05 May 2026',
      grossAmount: 13600,
      totalDeductions: 2340,
      netAmount: 11260,
      currency: 'ZAR',
      status: 'processed',
      notes: 'April salary processed with medical deduction.',
      lineItems: [
        { description: 'Base salary', amount: 12500, itemType: 'earnings' },
        { description: 'Overtime', amount: 1100, itemType: 'earnings' },
        { description: 'Tax deduction', amount: 1800, itemType: 'deduction' },
        { description: 'Medical contribution', amount: 540, itemType: 'deduction' }
      ]
    },
    {
      id: 'payslip-002',
      reference: 'PS-2026-04-002',
      role: 'staff',
      recipient: 'Nadia P.',
      building: 'Maple Ridge Towers',
      payPeriod: '01 Apr 2026 - 30 Apr 2026',
      paymentDate: '05 May 2026',
      grossAmount: 14400,
      totalDeductions: 2560,
      netAmount: 11840,
      currency: 'ZAR',
      status: 'pending',
      notes: 'Pending payment approval from operations manager.',
      lineItems: [
        { description: 'Base salary', amount: 13200, itemType: 'earnings' },
        { description: 'Night shift allowance', amount: 1200, itemType: 'earnings' },
        { description: 'Tax deduction', amount: 1960, itemType: 'deduction' },
        { description: 'Insurance', amount: 600, itemType: 'deduction' }
      ]
    },
    {
      id: 'payslip-003',
      reference: 'PS-2026-04-003',
      role: 'owner',
      recipient: 'Wiseworx Properties',
      building: 'Oakstone Residences',
      payPeriod: '01 Apr 2026 - 30 Apr 2026',
      paymentDate: '01 May 2026',
      grossAmount: 23600,
      totalDeductions: 4200,
      netAmount: 19400,
      currency: 'ZAR',
      status: 'paid',
      notes: 'Owner payout summary for the month of April.',
      lineItems: [
        { description: 'Unit revenue', amount: 25600, itemType: 'earnings' },
        { description: 'Platform fee', amount: 1200, itemType: 'deduction' },
        { description: 'Service charge', amount: 3000, itemType: 'deduction' }
      ]
    }
  ];

  getPayslipsForRole(role: UserRole): Payslip[] {
    return this.payslips.filter((payslip) => payslip.role === role);
  }

  getPayslipById(id: string): Payslip | undefined {
    return this.payslips.find((payslip) => payslip.id === id);
  }

  getSummaryForRole(role: UserRole): PayrollSummary {
    if (role === 'staff') {
      return {
        totalStaff: 18,
        nextPayment: '05 May 2026',
        totalPayroll: 276400,
        pendingActions: 2
      };
    }

    return {
      totalStaff: 0,
      nextPayment: '05 May 2026',
      totalPayroll: 452000,
      pendingActions: 1
    };
  }
}
