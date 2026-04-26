-- Run this in your Supabase dashboard → SQL Editor → New query

-- 1. Create user_data table
create table public.user_data (
  user_id uuid references auth.users(id) on delete cascade primary key,
  data    jsonb not null default '{}',
  updated_at timestamptz default now()
);

-- 2. Enable Row Level Security (users can only see their own data)
alter table public.user_data enable row level security;

-- 3. RLS policies
create policy "select own data"
  on public.user_data for select
  using (auth.uid() = user_id);

create policy "insert own data"
  on public.user_data for insert
  with check (auth.uid() = user_id);

create policy "update own data"
  on public.user_data for update
  using (auth.uid() = user_id);

create policy "delete own data"
  on public.user_data for delete
  using (auth.uid() = user_id);
