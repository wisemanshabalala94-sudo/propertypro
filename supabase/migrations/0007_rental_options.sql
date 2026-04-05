-- Rental options and tenant profile management

create table if not exists rental_options (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  name text not null,
  description text,
  price numeric(12, 2) not null,
  currency text not null default 'ZAR',
  max_accounts integer not null,
  features jsonb not null default '[]'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists property_rental_options (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  property_id uuid not null references properties(id) on delete cascade,
  rental_option_id uuid not null references rental_options(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  unique (property_id, rental_option_id)
);

alter table property_signup_requests
  add column if not exists rental_option_id uuid references rental_options(id) on delete set null;

create table if not exists tenant_bank_details (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null references profiles(id) on delete cascade,
  organization_id uuid not null references organizations(id) on delete cascade,
  bank_name text,
  account_number_masked text,
  account_type text,
  branch text,
  currency text not null default 'ZAR',
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists tenant_change_requests (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  profile_id uuid not null references profiles(id) on delete cascade,
  request_type text not null check (request_type in ('room_change', 'bank_update', 'subscription_change', 'cancellation')),
  payload jsonb not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'declined')),
  review_notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_rental_options_org on rental_options (organization_id, is_active);
create index if not exists idx_property_rental_options_property on property_rental_options (property_id);
create index if not exists idx_tenant_bank_details_profile on tenant_bank_details (profile_id);
create index if not exists idx_tenant_change_requests_profile on tenant_change_requests (profile_id, status);

alter table rental_options enable row level security;
alter table property_rental_options enable row level security;
alter table tenant_bank_details enable row level security;
alter table tenant_change_requests enable row level security;

create policy "active rental options are visible publicly"
on rental_options for select
using (is_active = true);

create policy "owners and admins manage rental options"
on rental_options for all
using (
  exists (
    select 1 from profiles
    where id = auth.uid()
      and organization_id = rental_options.organization_id
      and role in ('owner', 'admin')
  )
)
with check (
  exists (
    select 1 from profiles
    where id = auth.uid()
      and organization_id = rental_options.organization_id
      and role in ('owner', 'admin')
  )
);

create policy "organization users can view property rental options"
on property_rental_options for select
using (
  exists (
    select 1 from profiles
    where id = auth.uid()
      and organization_id = property_rental_options.organization_id
  )
);

create policy "owners and admins manage property rental options"
on property_rental_options for all
using (
  exists (
    select 1 from profiles
    where id = auth.uid()
      and organization_id = property_rental_options.organization_id
      and role in ('owner', 'admin')
  )
)
with check (
  exists (
    select 1 from profiles
    where id = auth.uid()
      and organization_id = property_rental_options.organization_id
      and role in ('owner', 'admin')
  )
);

create policy "tenant bank details visible to owner and tenant"
on tenant_bank_details for select
using (
  exists (
    select 1 from profiles
    where id = auth.uid()
      and (profiles.id = tenant_bank_details.profile_id or profiles.organization_id = tenant_bank_details.organization_id)
  )
);

create policy "tenant can manage own bank details"
on tenant_bank_details for all
using (
  profile_id = auth.uid()
)
with check (
  profile_id = auth.uid()
);

create policy "tenant requests visible to profile or organization admin"
on tenant_change_requests for select
using (
  profile_id = auth.uid()
  or exists (
    select 1 from profiles
    where id = auth.uid()
      and organization_id = tenant_change_requests.organization_id
      and role in ('owner', 'admin')
  )
);

create policy "admins manage tenant requests"
on tenant_change_requests for update
using (
  exists (
    select 1 from profiles
    where id = auth.uid()
      and organization_id = tenant_change_requests.organization_id
      and role in ('owner', 'admin')
  )
)
with check (
  exists (
    select 1 from profiles
    where id = auth.uid()
      and organization_id = tenant_change_requests.organization_id
      and role in ('owner', 'admin')
  )
);

create policy "tenants create their own requests"
on tenant_change_requests for insert
with check (
  profile_id = auth.uid()
);
