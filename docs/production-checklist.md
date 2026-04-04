# Production Checklist

## Before launch

1. Install Node.js, npm, Git, and the Supabase CLI on the deployment workstation.
2. Replace the placeholder Paystack link with your confirmed production checkout flow.
3. Configure Paystack webhook URL and rotate live secret keys.
4. Add Vercel environment variables from `.env.example`.
5. Create owner users and verify the approval workflow end to end.
6. Verify tenant onboarding requires 3 months of bank statements and debit authorization before activation.
7. Test the installable app manifest on Android Chrome and iPhone Safari add-to-home-screen flow.

## Security guardrails

- Treat webhook verification as mandatory.
- Keep RLS enabled on all multi-tenant tables.
- Require approval records before any debit from business income is executed.
- Log invoice, reconciliation, approval, and payout actions into `audit_logs`.

## Manual QA scenarios

1. Generate invoices for active leases.
2. Start a Paystack payment and confirm invoice status changes after webhook verification.
3. Import a bank transfer row with the tenant reference and confirm reconciliation.
4. Import an ATM deposit and confirm it lands in the unmatched queue when the reference is missing.
5. Create a debit request and ensure it stays blocked until an owner approves it.
6. Confirm each reconciled tenant payment creates a R100 savings allocation.
7. Submit a tenant onboarding case with statement uploads and verify AI notes plus manual review status are captured.
