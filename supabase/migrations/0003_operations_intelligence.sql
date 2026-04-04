create table if not exists maintenance_requests (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  property_id uuid references properties(id) on delete set null,
  unit_id uuid references units(id) on delete set null,
  tenant_id uuid references profiles(id) on delete set null,
  assigned_owner_id uuid references profiles(id) on delete set null,
  category text not null check (category in ('plumbing', 'electrical', 'security', 'cleaning', 'structural', 'other')),
  priority text not null default 'standard' check (priority in ('low', 'standard', 'high', 'critical')),
  status text not null default 'submitted' check (status in ('submitted', 'triaged', 'in_progress', 'awaiting_vendor', 'resolved', 'cancelled')),
  title text not null,
  description text not null,
  ai_triage_summary text,
  ai_trade_required text,
  ai_estimated_cost numeric(12, 2),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  resolved_at timestamptz
);

create index if not exists idx_maintenance_requests_org_status on maintenance_requests (organization_id, status);
create index if not exists idx_maintenance_requests_tenant on maintenance_requests (tenant_id, created_at desc);

create table if not exists maintenance_updates (
  id uuid primary key default uuid_generate_v4(),
  maintenance_request_id uuid not null references maintenance_requests(id) on delete cascade,
  organization_id uuid not null references organizations(id) on delete cascade,
  author_profile_id uuid references profiles(id) on delete set null,
  update_type text not null check (update_type in ('comment', 'status_change', 'assignment', 'vendor_note', 'resolution')),
  message text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists tenant_screening_checks (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  applicant_profile_id uuid references profiles(id) on delete set null,
  reviewed_by_profile_id uuid references profiles(id) on delete set null,
  provider text not null default 'manual_review',
  status text not null default 'pending' check (status in ('pending', 'in_review', 'approved', 'declined', 'needs_more_info')),
  affordability_score integer,
  risk_band text check (risk_band in ('low', 'moderate', 'high')),
  employment_verified boolean not null default false,
  identity_verified boolean not null default false,
  ai_summary text,
  raw_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_tenant_screening_org_status on tenant_screening_checks (organization_id, status);

create table if not exists report_snapshots (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  owner_profile_id uuid references profiles(id) on delete set null,
  report_type text not null check (report_type in ('collections', 'occupancy', 'maintenance', 'screening', 'cash_integrity')),
  period_label text not null,
  metrics jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_report_snapshots_org_type on report_snapshots (organization_id, report_type, created_at desc);

create table if not exists collection_runs (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  invoice_id uuid not null references invoices(id) on delete cascade,
  tenant_id uuid not null references profiles(id) on delete cascade,
  method text not null check (method in ('paystack_checkout', 'bank_transfer', 'atm_deposit', 'card_debit')),
  status text not null default 'scheduled' check (status in ('scheduled', 'processing', 'paid', 'failed', 'manual_follow_up')),
  next_attempt_at timestamptz,
  last_attempt_at timestamptz,
  notes text,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_collection_runs_org_status on collection_runs (organization_id, status);

alter table maintenance_requests enable row level security;
alter table maintenance_updates enable row level security;
alter table tenant_screening_checks enable row level security;
alter table report_snapshots enable row level security;
alter table collection_runs enable row level security;

create policy "organization users can view maintenance requests"
on maintenance_requests for select
using (
  organization_id = (
    select organization_id from profiles where id = auth.uid()
  )
);

create policy "organization staff can manage maintenance requests"
on maintenance_requests for all
using (
  exists (
    select 1 from profiles
    where id = auth.uid()
      and organization_id = maintenance_requests.organization_id
      and role in ('admin', 'owner', 'tenant')
  )
)
with check (
  exists (
    select 1 from profiles
    where id = auth.uid()
      and organization_id = maintenance_requests.organization_id
      and role in ('admin', 'owner', 'tenant')
  )
);

create policy "admins and owners manage screening checks"
on tenant_screening_checks for all
using (
  exists (
    select 1 from profiles
    where id = auth.uid()
      and organization_id = tenant_screening_checks.organization_id
      and role in ('admin', 'owner')
  )
)
with check (
  exists (
    select 1 from profiles
    where id = auth.uid()
      and organization_id = tenant_screening_checks.organization_id
      and role in ('admin', 'owner')
  )
);

create policy "organization users can view report snapshots"
on report_snapshots for select
using (
  organization_id = (
    select organization_id from profiles where id = auth.uid()
  )
);

create policy "admins and owners manage collection runs"
on collection_runs for all
using (
  exists (
    select 1 from profiles
    where id = auth.uid()
      and organization_id = collection_runs.organization_id
      and role in ('admin', 'owner')
  )
)
with check (
  exists (
    select 1 from profiles
    where id = auth.uid()
      and organization_id = collection_runs.organization_id
      and role in ('admin', 'owner')
  )
);
