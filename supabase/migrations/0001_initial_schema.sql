create extension if not exists "uuid-ossp";

create table if not exists organizations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  subscription_status text default 'trial',
  base_currency text not null default 'ZAR',
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  organization_id uuid not null references organizations(id) on delete cascade,
  full_name text,
  email text unique not null,
  role text not null check (role in ('admin', 'owner', 'tenant', 'vendor')),
  is_verified boolean not null default false,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists properties (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  name text not null,
  address text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists units (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  property_id uuid not null references properties(id) on delete cascade,
  unit_number text not null,
  status text not null default 'vacant' check (status in ('occupied', 'vacant', 'maintenance')),
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists leases (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  unit_id uuid not null references units(id) on delete cascade,
  tenant_id uuid not null references profiles(id) on delete restrict,
  start_date date not null,
  end_date date,
  monthly_rent_amount numeric(12, 2) not null,
  currency text not null default 'ZAR',
  status text not null default 'active' check (status in ('active', 'terminated', 'pending')),
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists onboarding_applications (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  profile_id uuid references profiles(id) on delete set null,
  role text not null check (role in ('admin', 'owner', 'tenant')),
  status text not null default 'in_review' check (status in ('draft', 'in_review', 'approved', 'declined')),
  affordability_score integer,
  ai_summary text,
  preferred_payment_method text,
  debit_authorized boolean not null default false,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists onboarding_documents (
  id uuid primary key default uuid_generate_v4(),
  onboarding_application_id uuid not null references onboarding_applications(id) on delete cascade,
  organization_id uuid not null references organizations(id) on delete cascade,
  document_type text not null check (document_type in ('id_document', 'bank_statement', 'proof_of_address', 'debit_mandate')),
  file_url text not null,
  month_covered date,
  ai_status text not null default 'pending' check (ai_status in ('pending', 'accepted', 'rejected', 'needs_review')),
  ai_notes text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists invoices (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  lease_id uuid not null references leases(id) on delete restrict,
  tenant_id uuid not null references profiles(id) on delete restrict,
  invoice_number text unique not null,
  payment_reference_code text unique not null,
  amount_due numeric(12, 2) not null,
  amount_paid numeric(12, 2) not null default 0,
  currency text not null default 'ZAR',
  due_date date not null,
  paid_at timestamptz,
  payment_method text,
  status text not null default 'unpaid' check (status in ('unpaid', 'partial', 'paid', 'overdue', 'void')),
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_invoices_org_status on invoices (organization_id, status);
create index if not exists idx_invoices_reference on invoices (payment_reference_code);
create index if not exists idx_invoices_due_date on invoices (due_date);

create table if not exists bank_accounts (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  owner_profile_id uuid references profiles(id) on delete set null,
  account_name text not null,
  account_number_masked text not null,
  bank_provider text not null,
  bank_code text,
  paystack_recipient_code text,
  is_payout_target boolean not null default false,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists bank_transactions (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  bank_account_id uuid references bank_accounts(id) on delete set null,
  transaction_date date not null,
  amount numeric(12, 2) not null,
  description text,
  reference_code text,
  direction text not null default 'credit' check (direction in ('credit', 'debit')),
  channel text not null default 'manual_import',
  is_reconciled boolean not null default false,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_bank_transactions_org_reconciled on bank_transactions (organization_id, is_reconciled);
create index if not exists idx_bank_transactions_reference on bank_transactions (reference_code);
create index if not exists idx_bank_transactions_date on bank_transactions (transaction_date);

create table if not exists reconciliations (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  bank_transaction_id uuid not null unique references bank_transactions(id) on delete cascade,
  invoice_id uuid not null references invoices(id) on delete cascade,
  matched_amount numeric(12, 2) not null,
  match_method text not null check (match_method in ('EXACT_REF', 'FUZZY_AMOUNT_DATE', 'MANUAL')),
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists payment_events (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  invoice_id uuid not null references invoices(id) on delete cascade,
  gateway text not null,
  gateway_reference text not null,
  amount numeric(12, 2) not null,
  payload jsonb not null,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists notification_preferences (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  profile_id uuid not null references profiles(id) on delete cascade,
  receipt_email_enabled boolean not null default true,
  receipt_sms_enabled boolean not null default false,
  payment_alerts_enabled boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  unique (organization_id, profile_id)
);

create table if not exists transaction_approval_requests (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  requested_by_user_id uuid not null references profiles(id) on delete restrict,
  reviewed_by_user_id uuid references profiles(id) on delete restrict,
  amount numeric(12, 2) not null,
  currency text not null default 'ZAR',
  purpose text not null,
  source_account text,
  destination_account text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'declined')),
  review_notes text,
  reviewed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists savings_allocations (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  invoice_id uuid not null references invoices(id) on delete cascade,
  tenant_id uuid not null references profiles(id) on delete restrict,
  amount numeric(12, 2) not null default 100,
  beneficiary text not null default 'Wiseworx Team',
  status text not null default 'reserved' check (status in ('reserved', 'transferred', 'waived')),
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists audit_logs (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  user_id uuid references profiles(id) on delete set null,
  action text not null,
  table_affected text not null,
  record_id uuid,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

alter table profiles enable row level security;
alter table properties enable row level security;
alter table units enable row level security;
alter table leases enable row level security;
alter table onboarding_applications enable row level security;
alter table onboarding_documents enable row level security;
alter table invoices enable row level security;
alter table bank_transactions enable row level security;
alter table reconciliations enable row level security;
alter table transaction_approval_requests enable row level security;
alter table savings_allocations enable row level security;
alter table audit_logs enable row level security;

create policy "profiles are visible within organization"
on profiles for select
using (
  organization_id = (
    select organization_id from profiles where id = auth.uid()
  )
);

create policy "tenants and staff can view their organization invoices"
on invoices for select
using (
  organization_id = (
    select organization_id from profiles where id = auth.uid()
  )
);

create policy "organization users can view onboarding"
on onboarding_applications for select
using (
  organization_id = (
    select organization_id from profiles where id = auth.uid()
  )
);

create policy "admins can manage invoices"
on invoices for all
using (
  exists (
    select 1 from profiles
    where id = auth.uid()
      and organization_id = invoices.organization_id
      and role in ('admin', 'owner')
  )
)
with check (
  exists (
    select 1 from profiles
    where id = auth.uid()
      and organization_id = invoices.organization_id
      and role in ('admin', 'owner')
  )
);

create policy "owners and admins manage approvals"
on transaction_approval_requests for all
using (
  exists (
    select 1 from profiles
    where id = auth.uid()
      and organization_id = transaction_approval_requests.organization_id
      and role in ('admin', 'owner')
  )
)
with check (
  exists (
    select 1 from profiles
    where id = auth.uid()
      and organization_id = transaction_approval_requests.organization_id
      and role in ('admin', 'owner')
  )
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, organization_id, email, role)
  values (
    new.id,
    (new.raw_user_meta_data ->> 'organization_id')::uuid,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'role', 'tenant')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
