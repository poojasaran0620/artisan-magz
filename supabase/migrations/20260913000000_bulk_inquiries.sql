-- Create Bulk Inquiries Table
create table if not exists public.bulk_inquiries (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  phone text not null,
  occasion text not null,
  estimated_quantity text not null,
  kind_of_gifts text not null,
  special_requirements text,
  any_questions text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.bulk_inquiries enable row level security;

-- Anyone (including public visitors) can insert an inquiry
create policy "Anyone can insert bulk inquiry"
  on public.bulk_inquiries for insert
  with check (true);

-- Admins can view all bulk inquiries
create policy "Admins can view all bulk inquiries"
  on public.bulk_inquiries for select
  using (
    auth.jwt() ->> 'email' in (
      'poojasaran0620@gmail.com',
      'vijayrathod8422@gmail.com',
      'artisanmagz@gmail.com'
    )
  );

-- Admins can delete bulk inquiries
create policy "Admins can delete bulk inquiries"
  on public.bulk_inquiries for delete
  using (
    auth.jwt() ->> 'email' in (
      'poojasaran0620@gmail.com',
      'vijayrathod8422@gmail.com',
      'artisanmagz@gmail.com'
    )
  );
