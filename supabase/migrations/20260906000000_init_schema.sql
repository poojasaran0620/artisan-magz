-- 1. Create Profiles table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  email text,
  avatar_url text,
  phone text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create Saved Addresses table
create table if not exists public.saved_addresses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  label text default 'Home',
  recipient_name text not null,
  phone text not null,
  street_address text not null,
  city text not null,
  pincode text not null,
  is_default boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create Orders table
create table if not exists public.orders (
  id uuid default gen_random_uuid() primary key,
  order_number text unique not null,
  user_id uuid references auth.users on delete set null,
  status text default 'placed',
  items jsonb not null default '[]'::jsonb,
  total_amount numeric not null default 0,
  delivery_address jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.saved_addresses enable row level security;
alter table public.orders enable row level security;

-- Policies
do $$ begin
  if not exists (select 1 from pg_policies where policyname = 'Users can view own profile') then
    create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Users can update own profile') then
    create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Users can view own addresses') then
    create policy "Users can view own addresses" on public.saved_addresses for select using (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Users can insert own addresses') then
    create policy "Users can insert own addresses" on public.saved_addresses for insert with check (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Users can delete own addresses') then
    create policy "Users can delete own addresses" on public.saved_addresses for delete using (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Users can view own orders') then
    create policy "Users can view own orders" on public.orders for select using (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Users can insert orders') then
    create policy "Users can insert orders" on public.orders for insert with check (true);
  end if;
end $$;
