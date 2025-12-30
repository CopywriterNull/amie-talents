-- MailTail Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- PROFILES TABLE
-- ============================================
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  first_name text,
  last_name text,
  brand_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;

-- Drop existing policies if they exist, then recreate
drop policy if exists "Users can view own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Users can insert own profile" on public.profiles;

create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

-- ============================================
-- TEAMS TABLE
-- ============================================
create table if not exists public.teams (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  owner_id uuid references auth.users on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.teams enable row level security;

drop policy if exists "Team owners can manage their teams" on public.teams;
drop policy if exists "Team members can view their teams" on public.teams;

create policy "Team owners can manage their teams" on public.teams
  for all using (auth.uid() = owner_id);

create policy "Team members can view their teams" on public.teams
  for select using (
    exists (
      select 1 from public.team_members
      where team_members.team_id = teams.id
      and team_members.user_id = auth.uid()
    )
  );

-- ============================================
-- TEAM MEMBERS TABLE
-- ============================================
create table if not exists public.team_members (
  id uuid default uuid_generate_v4() primary key,
  team_id uuid references public.teams on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  role text not null default 'member' check (role in ('owner', 'admin', 'member')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(team_id, user_id)
);

alter table public.team_members enable row level security;

drop policy if exists "Team members can view members of their teams" on public.team_members;
drop policy if exists "Team owners and admins can manage members" on public.team_members;

create policy "Team members can view members of their teams" on public.team_members
  for select using (
    exists (
      select 1 from public.team_members as tm
      where tm.team_id = team_members.team_id
      and tm.user_id = auth.uid()
    )
  );

create policy "Team owners and admins can manage members" on public.team_members
  for all using (
    exists (
      select 1 from public.team_members as tm
      where tm.team_id = team_members.team_id
      and tm.user_id = auth.uid()
      and tm.role in ('owner', 'admin')
    )
  );

-- ============================================
-- TEAM INVITES TABLE
-- ============================================
create table if not exists public.team_invites (
  id uuid default uuid_generate_v4() primary key,
  team_id uuid references public.teams on delete cascade not null,
  email text not null,
  role text not null default 'member' check (role in ('admin', 'member')),
  invited_by uuid references auth.users on delete cascade not null,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined', 'expired')),
  token text unique not null default encode(gen_random_bytes(32), 'hex'),
  expires_at timestamp with time zone default (timezone('utc'::text, now()) + interval '7 days') not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(team_id, email)
);

alter table public.team_invites enable row level security;

drop policy if exists "Team owners and admins can view invites" on public.team_invites;
drop policy if exists "Team owners and admins can create invites" on public.team_invites;
drop policy if exists "Team owners and admins can delete invites" on public.team_invites;

create policy "Team owners and admins can view invites" on public.team_invites
  for select using (
    exists (
      select 1 from public.team_members as tm
      where tm.team_id = team_invites.team_id
      and tm.user_id = auth.uid()
      and tm.role in ('owner', 'admin')
    )
  );

create policy "Team owners and admins can create invites" on public.team_invites
  for insert with check (
    exists (
      select 1 from public.team_members as tm
      where tm.team_id = team_invites.team_id
      and tm.user_id = auth.uid()
      and tm.role in ('owner', 'admin')
    )
  );

create policy "Team owners and admins can delete invites" on public.team_invites
  for delete using (
    exists (
      select 1 from public.team_members as tm
      where tm.team_id = team_invites.team_id
      and tm.user_id = auth.uid()
      and tm.role in ('owner', 'admin')
    )
  );

-- ============================================
-- KLAVIYO CONNECTIONS TABLE
-- ============================================
-- Add team_id column if it doesn't exist
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_name = 'klaviyo_connections' and column_name = 'team_id'
  ) then
    alter table public.klaviyo_connections add column team_id uuid references public.teams on delete cascade;
  end if;
end $$;

-- Drop and recreate policy
drop policy if exists "Users can manage own connections" on public.klaviyo_connections;

create policy "Users can manage own connections" on public.klaviyo_connections
  for all using (auth.uid() = user_id);

-- ============================================
-- PROCESSED TEMPLATES TABLE
-- ============================================
-- Add team_id column if it doesn't exist
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_name = 'processed_templates' and column_name = 'team_id'
  ) then
    alter table public.processed_templates add column team_id uuid references public.teams on delete cascade;
  end if;
end $$;

-- Drop and recreate policies
drop policy if exists "Users can view own processed templates" on public.processed_templates;
drop policy if exists "Users can insert own processed templates" on public.processed_templates;

create policy "Users can view own processed templates" on public.processed_templates
  for select using (auth.uid() = user_id);

create policy "Users can insert own processed templates" on public.processed_templates
  for insert with check (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================

-- Function to create a profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to auto-create profile on signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to update updated_at timestamp
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Trigger for profiles updated_at
drop trigger if exists update_profiles_updated_at on public.profiles;
create trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.update_updated_at_column();

-- Trigger for klaviyo_connections updated_at (only if table exists)
do $$
begin
  if exists (select 1 from information_schema.tables where table_name = 'klaviyo_connections') then
    drop trigger if exists update_klaviyo_connections_updated_at on public.klaviyo_connections;
    create trigger update_klaviyo_connections_updated_at
      before update on public.klaviyo_connections
      for each row execute procedure public.update_updated_at_column();
  end if;
end $$;
