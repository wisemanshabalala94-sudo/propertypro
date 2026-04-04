-- Staff Salary Management Schema
-- Tracks staff members, salaries, payslips, and deductions

create table if not exists staff_members (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  profile_id uuid not null references profiles(id) on delete cascade,
  job_title text not null,
  department text,
  salary_amount numeric(12, 2) not null,
  currency text not null default 'ZAR',
  salary_frequency text not null check (salary_frequency in ('monthly', 'weekly', 'biweekly')),
  employment_status text not null default 'active' check (employment_status in ('active', 'inactive', 'on_leave', 'terminated')),
  start_date date not null,
  end_date date,
  bank_account_id uuid references bank_accounts(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists salary_deductions (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  staff_member_id uuid not null references staff_members(id) on delete cascade,
  deduction_type text not null check (deduction_type in ('tax', 'insurance', 'pension', 'garnishment', 'loan', 'other')),
  deduction_name text not null,
  amount numeric(12, 2) not null,
  percentage numeric(5, 2),
  is_fixed boolean not null default true,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists payslips (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  staff_member_id uuid not null references staff_members(id) on delete cascade,
  payslip_number text unique not null,
  pay_period_start date not null,
  pay_period_end date not null,
  payment_date date not null,
  gross_amount numeric(12, 2) not null,
  total_deductions numeric(12, 2) not null default 0,
  net_amount numeric(12, 2) not null,
  currency text not null default 'ZAR',
  status text not null default 'pending' check (status in ('pending', 'processed', 'paid', 'cancelled')),
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists payslip_line_items (
  id uuid primary key default uuid_generate_v4(),
  payslip_id uuid not null references payslips(id) on delete cascade,
  description text not null,
  amount numeric(12, 2) not null,
  item_type text not null check (item_type in ('earnings', 'deduction', 'addition')),
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists salary_payments (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  payslip_id uuid not null references payslips(id) on delete cascade,
  staff_member_id uuid not null references staff_members(id) on delete cascade,
  amount numeric(12, 2) not null,
  payment_method text not null,
  reference_code text unique not null,
  status text not null default 'pending' check (status in ('pending', 'processing', 'completed', 'failed')),
  paid_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists staff_attendance (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  staff_member_id uuid not null references staff_members(id) on delete cascade,
  attendance_date date not null,
  check_in_time timestamptz,
  check_out_time timestamptz,
  hours_worked numeric(4, 2),
  status text not null default 'present' check (status in ('present', 'absent', 'late', 'leave', 'holiday')),
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  unique(organization_id, staff_member_id, attendance_date)
);

create table if not exists staff_leave_requests (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  staff_member_id uuid not null references staff_members(id) on delete cascade,
  leave_type text not null check (leave_type in ('annual', 'sick', 'personal', 'parental', 'bereavement', 'other')),
  start_date date not null,
  end_date date not null,
  num_days integer not null,
  reason text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  approved_by uuid references profiles(id) on delete set null,
  approved_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

-- Indexes for performance
create index if not exists idx_staff_org_status on staff_members(organization_id, employment_status);
create index if not exists idx_payslips_staff on payslips(staff_member_id, payment_date);
create index if not exists idx_payslips_org_date on payslips(organization_id, pay_period_start);
create index if not exists idx_attendance_staff_date on staff_attendance(staff_member_id, attendance_date);
create index if not exists idx_leave_requests_staff on staff_leave_requests(staff_member_id, status);

-- Enable RLS
alter table staff_members enable row level security;
alter table salary_deductions enable row level security;
alter table payslips enable row level security;
alter table payslip_line_items enable row level security;
alter table salary_payments enable row level security;
alter table staff_attendance enable row level security;
alter table staff_leave_requests enable row level security;

-- RLS Policies
create policy "staff members visible within organization"
on staff_members for select
using (
  organization_id = (
    select organization_id from profiles where id = auth.uid()
  )
);

create policy "staff can view own payslips"
on payslips for select
using (
  organization_id = (
    select organization_id from profiles where id = auth.uid()
  )
  and (
    staff_member_id = (
      select id from staff_members where profile_id = auth.uid()
    )
    or exists (
      select 1 from profiles
      where id = auth.uid()
        and role in ('admin', 'owner')
        and organization_id = payslips.organization_id
    )
  )
);

create policy "admins can manage payslips"
on payslips for all
using (
  exists (
    select 1 from profiles
    where id = auth.uid()
      and organization_id = payslips.organization_id
      and role in ('admin', 'owner')
  )
)
with check (
  exists (
    select 1 from profiles
    where id = auth.uid()
      and organization_id = payslips.organization_id
      and role in ('admin', 'owner')
  )
);
