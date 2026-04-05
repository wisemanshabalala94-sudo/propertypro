-- AI Assistant Tables
create table if not exists public.ai_conversations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id),
  organization_id uuid references public.organizations(id),
  message text not null,
  response text not null,
  context jsonb,
  sentiment text,
  action_taken text,
  feedback_score integer check (feedback_score between 1 and 5),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

create table if not exists public.ai_assistant_users (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) unique,
  qwen_api_key text,
  subscription_tier text check (subscription_tier in ('free', 'pro', 'enterprise')),
  monthly_queries_limit integer default 100,
  queries_used integer default 0,
  reset_date date default (CURRENT_DATE + interval '1 month'),
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.ai_conversations enable row level security;
alter table public.ai_assistant_users enable row level security;

create policy "Users view own conversations" on public.ai_conversations for select using (auth.uid() = user_id);
create policy "Users insert own conversations" on public.ai_conversations for insert with check (auth.uid() = user_id);
create policy "Users view own AI settings" on public.ai_assistant_users for select using (auth.uid() = user_id);
create policy "Users update own AI settings" on public.ai_assistant_users for update using (auth.uid() = user_id);

-- Auto-create AI user entry for new profiles
create or replace function public.create_ai_user() returns trigger as $$
begin
  insert into public.ai_assistant_users (user_id, subscription_tier) values (new.id, 'free');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_profile_created on public.profiles;
create trigger on_profile_created after insert on public.profiles for each row execute procedure public.create_ai_user();
