# PropertyPro

PropertyPro is a production-oriented rent collection and reconciliation MVP for property managers. This scaffold is built around Next.js 14 App Router, Supabase, Tailwind CSS, and Paystack-first payment orchestration.

## What is included

- Multi-tenant data model for organizations, properties, units, leases, invoices, bank transactions, approvals, savings contributions, and audit logs
- Paystack transaction initialization route with invoice-linked references
- Webhook handler for payment confirmation
- CSV/manual bank transaction import endpoint
- Reconciliation engine for exact-reference and amount/date matching
- Approval workflow so owners can approve or decline outbound use of income
- R100 savings contribution tracking per tenant payment for Wiseworx administration
- Role-based onboarding flows for tenants, owners, and admins
- Installable app manifest for phone and desktop-style use

## Local setup

1. Install Node.js 20+ and npm.
2. Copy `.env.example` to `.env.local`.
3. Create a Supabase project and run `supabase/migrations/0001_initial_schema.sql`.
4. Optionally load `supabase/seed.sql`.
5. Install dependencies with `npm install`.
6. Start the app with `npm run dev`.

## Production notes

- Use Paystack webhooks as the source of truth for successful payments.
- Keep bank reconciliation on manual review mode during the first production month.
- Do not release funds until an owner-approved transaction request exists.
- Never store raw card data.
- Treat tenant onboarding as a compliance workflow: three-month statements, debit consent, and document review should be required before activation.

## Important implementation decision

Your prompt mentioned Angular, but the production blueprint you supplied is built around Next.js 14, Supabase, Tailwind, and Vercel. This repo follows that blueprint so the launch path matches the deployment plan.
