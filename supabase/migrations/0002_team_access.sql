create table if not exists team_member_access (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  owner_profile_id uuid references profiles(id) on delete set null,
  team_member_profile_id uuid not null references profiles(id) on delete cascade,
  access_role text not null check (access_role in ('building_manager', 'finance_officer', 'support', 'viewer')),
  can_manage_tenants boolean not null default false,
  can_manage_collections boolean not null default false,
  can_manage_reconciliation boolean not null default false,
  can_manage_payouts boolean not null default false,
  can_manage_team_access boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  unique (organization_id, team_member_profile_id)
);

alter table team_member_access enable row level security;

create policy "owners and admins manage team access"
on team_member_access for all
using (
  exists (
    select 1 from profiles
    where id = auth.uid()
      and organization_id = team_member_access.organization_id
      and role in ('admin', 'owner')
  )
)
with check (
  exists (
    select 1 from profiles
    where id = auth.uid()
      and organization_id = team_member_access.organization_id
      and role in ('admin', 'owner')
  )
);
