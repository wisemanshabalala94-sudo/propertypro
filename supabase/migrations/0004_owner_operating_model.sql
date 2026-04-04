create table if not exists owner_subscriptions (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null unique references organizations(id) on delete cascade,
  owner_profile_id uuid references profiles(id) on delete set null,
  monthly_fee numeric(12, 2) not null default 1170,
  currency text not null default 'ZAR',
  status text not null default 'active' check (status in ('active', 'past_due', 'paused', 'cancelled')),
  next_billing_date date,
  last_paid_at timestamptz,
  paystack_reference text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists property_directory_settings (
  id uuid primary key default uuid_generate_v4(),
  property_id uuid not null unique references properties(id) on delete cascade,
  organization_id uuid not null references organizations(id) on delete cascade,
  slug text unique not null,
  is_public_signup_enabled boolean not null default true,
  signup_notes text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists property_signup_requests (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  property_id uuid not null references properties(id) on delete cascade,
  requested_role text not null check (requested_role in ('tenant', 'owner')),
  applicant_name text not null,
  applicant_email text not null,
  applicant_phone text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'declined')),
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists team_invitations (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  invited_by_profile_id uuid references profiles(id) on delete set null,
  invited_email text not null,
  full_name text,
  role text not null check (role in ('admin', 'owner', 'tenant', 'vendor')),
  access_scope jsonb not null default '{}'::jsonb,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'revoked')),
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists worker_payouts (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  requested_by_profile_id uuid references profiles(id) on delete set null,
  worker_name text not null,
  worker_email text,
  role_label text not null,
  amount numeric(12, 2) not null,
  payout_cycle text not null default 'ad_hoc' check (payout_cycle in ('weekly', 'monthly', 'ad_hoc')),
  status text not null default 'pending_approval' check (status in ('pending_approval', 'approved', 'paid', 'declined')),
  bank_account_id uuid references bank_accounts(id) on delete set null,
  notes text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists in_app_messages (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  sender_profile_id uuid references profiles(id) on delete set null,
  recipient_profile_id uuid references profiles(id) on delete set null,
  subject text not null,
  body text not null,
  message_type text not null default 'general' check (message_type in ('general', 'payment', 'maintenance', 'dispute')),
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_property_directory_public on property_directory_settings (organization_id, is_public_signup_enabled);
create index if not exists idx_property_signup_requests_property on property_signup_requests (property_id, status);
create index if not exists idx_team_invitations_org_status on team_invitations (organization_id, status);
create index if not exists idx_worker_payouts_org_status on worker_payouts (organization_id, status);
create index if not exists idx_in_app_messages_org on in_app_messages (organization_id, created_at desc);

alter table owner_subscriptions enable row level security;
alter table property_directory_settings enable row level security;
alter table property_signup_requests enable row level security;
alter table team_invitations enable row level security;
alter table worker_payouts enable row level security;
alter table in_app_messages enable row level security;

create policy "owners and admins manage owner subscriptions"
on owner_subscriptions for all
using (
  exists (
    select 1 from profiles
    where id = auth.uid()
      and organization_id = owner_subscriptions.organization_id
      and role in ('owner', 'admin')
  )
)
with check (
  exists (
    select 1 from profiles
    where id = auth.uid()
      and organization_id = owner_subscriptions.organization_id
      and role in ('owner', 'admin')
  )
);

create policy "public property directory is readable"
on property_directory_settings for select
using (is_public_signup_enabled = true);

create policy "owners and admins manage property directory"
on property_directory_settings for all
using (
  exists (
    select 1 from profiles
    where id = auth.uid()
      and organization_id = property_directory_settings.organization_id
      and role in ('owner', 'admin')
  )
)
with check (
  exists (
    select 1 from profiles
    where id = auth.uid()
      and organization_id = property_directory_settings.organization_id
      and role in ('owner', 'admin')
  )
);

create policy "owners and admins manage signup requests"
on property_signup_requests for all
using (
  exists (
    select 1 from profiles
    where id = auth.uid()
      and organization_id = property_signup_requests.organization_id
      and role in ('owner', 'admin')
  )
)
with check (
  exists (
    select 1 from profiles
    where id = auth.uid()
      and organization_id = property_signup_requests.organization_id
      and role in ('owner', 'admin')
  )
);

create policy "owners and admins manage team invitations"
on team_invitations for all
using (
  exists (
    select 1 from profiles
    where id = auth.uid()
      and organization_id = team_invitations.organization_id
      and role in ('owner', 'admin')
  )
)
with check (
  exists (
    select 1 from profiles
    where id = auth.uid()
      and organization_id = team_invitations.organization_id
      and role in ('owner', 'admin')
  )
);

create policy "owners and admins manage worker payouts"
on worker_payouts for all
using (
  exists (
    select 1 from profiles
    where id = auth.uid()
      and organization_id = worker_payouts.organization_id
      and role in ('owner', 'admin')
  )
)
with check (
  exists (
    select 1 from profiles
    where id = auth.uid()
      and organization_id = worker_payouts.organization_id
      and role in ('owner', 'admin')
  )
);

create policy "organization users can view messages"
on in_app_messages for select
using (
  organization_id = (
    select organization_id from profiles where id = auth.uid()
  )
);

create policy "organization users can send messages"
on in_app_messages for insert
with check (
  organization_id = (
    select organization_id from profiles where id = auth.uid()
  )
);
