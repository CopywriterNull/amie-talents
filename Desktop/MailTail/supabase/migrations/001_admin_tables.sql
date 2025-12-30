-- MailTail Admin Panel Database Migration
-- Run this in your Supabase SQL Editor after the main schema

-- ============================================
-- PLANS TABLE
-- ============================================
create table if not exists public.plans (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  type text not null check (type in ('trial_time', 'trial_usage', 'paid')),
  template_limit integer,  -- null = unlimited
  trial_days integer,      -- for time-based trials
  is_default boolean default false,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Only allow one default plan
create unique index if not exists plans_single_default
  on public.plans (is_default)
  where is_default = true;

-- ============================================
-- TEAM SUBSCRIPTIONS TABLE
-- ============================================
create table if not exists public.team_subscriptions (
  id uuid default uuid_generate_v4() primary key,
  team_id uuid references public.teams on delete cascade not null unique,
  plan_id uuid references public.plans on delete set null,
  status text not null default 'trial' check (status in ('trial', 'active', 'expired', 'suspended')),

  -- Trial tracking (either/or - usage overrides time)
  trial_type text check (trial_type in ('time', 'usage')),
  trial_ends_at timestamp with time zone,
  trial_template_limit integer,
  trial_templates_used integer default 0,

  -- Admin overrides
  custom_template_limit integer,
  custom_ends_at timestamp with time zone,
  admin_notes text,

  started_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================
-- ADMINS TABLE
-- ============================================
create table if not exists public.admins (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null unique,
  role text not null default 'support' check (role in ('super_admin', 'admin', 'support')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================
-- ADMIN AUDIT LOG TABLE
-- ============================================
create table if not exists public.admin_audit_log (
  id uuid default uuid_generate_v4() primary key,
  admin_id uuid references public.admins on delete set null,
  action text not null,
  target_type text,
  target_id uuid,
  details jsonb default '{}',
  ip_address text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================
-- ACTIVITY LOG TABLE
-- ============================================
create table if not exists public.activity_log (
  id uuid default uuid_generate_v4() primary key,
  team_id uuid references public.teams on delete cascade,
  user_id uuid references auth.users on delete cascade,
  action text not null,
  details jsonb default '{}',
  ip_address text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================
-- INDEXES
-- ============================================
create index if not exists idx_team_subscriptions_team_id on public.team_subscriptions(team_id);
create index if not exists idx_team_subscriptions_status on public.team_subscriptions(status);
create index if not exists idx_admin_audit_log_admin_id on public.admin_audit_log(admin_id);
create index if not exists idx_admin_audit_log_created_at on public.admin_audit_log(created_at desc);
create index if not exists idx_activity_log_team_id on public.activity_log(team_id);
create index if not exists idx_activity_log_user_id on public.activity_log(user_id);
create index if not exists idx_activity_log_created_at on public.activity_log(created_at desc);
create index if not exists idx_activity_log_action on public.activity_log(action);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Plans: Readable by all authenticated users, writable by admins only
alter table public.plans enable row level security;

create policy "Anyone can view active plans" on public.plans
  for select using (is_active = true);

create policy "Admins can manage plans" on public.plans
  for all using (
    exists (
      select 1 from public.admins
      where admins.user_id = auth.uid()
      and admins.role in ('super_admin', 'admin')
    )
  );

-- Team Subscriptions: Team members can view, admins can manage
alter table public.team_subscriptions enable row level security;

create policy "Team members can view their subscription" on public.team_subscriptions
  for select using (
    exists (
      select 1 from public.team_members
      where team_members.team_id = team_subscriptions.team_id
      and team_members.user_id = auth.uid()
    )
  );

create policy "Admins can manage all subscriptions" on public.team_subscriptions
  for all using (
    exists (
      select 1 from public.admins
      where admins.user_id = auth.uid()
      and admins.role in ('super_admin', 'admin')
    )
  );

-- Admins: Only super_admins can manage, admins can view
alter table public.admins enable row level security;

create policy "Admins can view admin list" on public.admins
  for select using (
    exists (
      select 1 from public.admins as a
      where a.user_id = auth.uid()
    )
  );

create policy "Super admins can manage admins" on public.admins
  for all using (
    exists (
      select 1 from public.admins as a
      where a.user_id = auth.uid()
      and a.role = 'super_admin'
    )
  );

-- Admin Audit Log: Admins can view, system inserts
alter table public.admin_audit_log enable row level security;

create policy "Admins can view audit log" on public.admin_audit_log
  for select using (
    exists (
      select 1 from public.admins
      where admins.user_id = auth.uid()
    )
  );

create policy "Admins can insert audit log" on public.admin_audit_log
  for insert with check (
    exists (
      select 1 from public.admins
      where admins.user_id = auth.uid()
    )
  );

-- Activity Log: Team members can view their own, admins can view all
alter table public.activity_log enable row level security;

create policy "Team members can view their activity" on public.activity_log
  for select using (
    exists (
      select 1 from public.team_members
      where team_members.team_id = activity_log.team_id
      and team_members.user_id = auth.uid()
    )
    or auth.uid() = user_id
  );

create policy "Admins can view all activity" on public.activity_log
  for select using (
    exists (
      select 1 from public.admins
      where admins.user_id = auth.uid()
    )
  );

create policy "System can insert activity" on public.activity_log
  for insert with check (true);

-- ============================================
-- TRIGGERS
-- ============================================

-- Updated_at trigger for plans
drop trigger if exists update_plans_updated_at on public.plans;
create trigger update_plans_updated_at
  before update on public.plans
  for each row execute procedure public.update_updated_at_column();

-- Updated_at trigger for team_subscriptions
drop trigger if exists update_team_subscriptions_updated_at on public.team_subscriptions;
create trigger update_team_subscriptions_updated_at
  before update on public.team_subscriptions
  for each row execute procedure public.update_updated_at_column();

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to check if a team can process templates
create or replace function public.can_team_process_template(p_team_id uuid)
returns jsonb as $$
declare
  v_subscription record;
  v_monthly_usage integer;
begin
  -- Get subscription
  select * into v_subscription
  from public.team_subscriptions
  where team_id = p_team_id;

  -- No subscription found
  if v_subscription is null then
    return jsonb_build_object('allowed', false, 'reason', 'No subscription found');
  end if;

  -- Check suspended
  if v_subscription.status = 'suspended' then
    return jsonb_build_object('allowed', false, 'reason', 'Account suspended');
  end if;

  -- Check usage-based trial first (takes priority)
  if v_subscription.trial_type = 'usage' and v_subscription.trial_template_limit is not null then
    if v_subscription.trial_templates_used >= v_subscription.trial_template_limit then
      return jsonb_build_object('allowed', false, 'reason', 'Trial template limit reached');
    end if;
    return jsonb_build_object('allowed', true, 'remaining', v_subscription.trial_template_limit - v_subscription.trial_templates_used);
  end if;

  -- Check time-based trial
  if v_subscription.trial_type = 'time' and v_subscription.trial_ends_at is not null then
    if now() > v_subscription.trial_ends_at then
      return jsonb_build_object('allowed', false, 'reason', 'Trial expired');
    end if;
    return jsonb_build_object('allowed', true, 'expires_at', v_subscription.trial_ends_at);
  end if;

  -- Check active paid plan with custom limit
  if v_subscription.status = 'active' then
    if v_subscription.custom_template_limit is not null then
      -- Get monthly usage
      select count(*) into v_monthly_usage
      from public.processed_templates
      where team_id = p_team_id
      and processed_at >= date_trunc('month', now());

      if v_monthly_usage >= v_subscription.custom_template_limit then
        return jsonb_build_object('allowed', false, 'reason', 'Monthly limit reached');
      end if;
      return jsonb_build_object('allowed', true, 'remaining', v_subscription.custom_template_limit - v_monthly_usage);
    end if;
    -- Unlimited
    return jsonb_build_object('allowed', true, 'remaining', null);
  end if;

  -- Default: expired
  return jsonb_build_object('allowed', false, 'reason', 'Subscription expired');
end;
$$ language plpgsql security definer;

-- Function to increment trial usage
create or replace function public.increment_trial_usage(p_team_id uuid)
returns void as $$
begin
  update public.team_subscriptions
  set trial_templates_used = coalesce(trial_templates_used, 0) + 1,
      updated_at = now()
  where team_id = p_team_id;
end;
$$ language plpgsql security definer;

-- ============================================
-- DEFAULT DATA
-- ============================================

-- Insert default trial plan (14 days)
insert into public.plans (name, type, trial_days, is_default, is_active)
values ('Free Trial (14 days)', 'trial_time', 14, true, true)
on conflict do nothing;
