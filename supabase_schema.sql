-- Gita Gurukul Supabase Database Schema
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/qveazfhqgsiqurzlbkvr/sql/new

-- 1. PROFILES TABLE
create table if not exists public.profiles (
  id text primary key,
  name text,
  email text,
  phone text,
  address text,
  city text,
  state text,
  pincode text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. ORDERS TABLE (For book purchases & Gurukul donations)
create table if not exists public.orders (
  id text primary key,
  order_id text,
  razorpay_order_id text,
  razorpay_payment_id text,
  razorpay_signature text,
  user_id text,
  amount numeric not null,
  items text,
  quantity integer default 1,
  type text default 'order', -- 'order' or 'donation'
  donor_name text,
  donor_message text,
  customer jsonb default '{}'::jsonb,
  payment_status text default 'Paid',
  order_status text default 'Processing',
  status text default 'Processing',
  shiprocket jsonb default '{"status": "Pending"}'::jsonb,
  admin_notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. ENABLE ROW LEVEL SECURITY
alter table public.profiles enable row level security;
alter table public.orders enable row level security;

-- 4. POLICIES FOR ORDERS
-- Allow anyone to insert orders on payment completion
create policy "Allow insert orders" on public.orders
  for insert with check (true);

-- Allow reading orders (for dashboard and customer receipts)
create policy "Allow read orders" on public.orders
  for select using (true);

-- Allow updating orders (for Shiprocket status updates & admin fulfillment)
create policy "Allow update orders" on public.orders
  for update using (true);

-- 5. POLICIES FOR PROFILES
create policy "Allow read profiles" on public.profiles
  for select using (true);

create policy "Allow upsert profiles" on public.profiles
  for all using (true);

-- 6. ENABLE REALTIME ON ORDERS (For live updates in Admin Dashboard)
alter publication supabase_realtime add table public.orders;

-- 7. STORE & DISPATCH SETTINGS TABLE
create table if not exists public.store_settings (
  id text primary key default 'default',
  price numeric default 799,
  original_price numeric default 999,
  in_stock boolean default true,
  stock_badge text default 'In Stock',
  dispatch_time text default '24-48 hours',
  dispatch_days text default 'Mon - Sat',
  cutoff_time text default '2:00 PM',
  announcement_enabled boolean default false,
  announcement_text text default 'Special Gita Jayanti Edition — Free Delivery Across India',
  updated_at timestamptz default now()
);

alter table public.store_settings enable row level security;
create policy "Allow read store_settings" on public.store_settings for select using (true);
create policy "Allow upsert store_settings" on public.store_settings for all using (true);

insert into public.store_settings (id, price, original_price, in_stock, stock_badge, dispatch_time, dispatch_days, cutoff_time)
values ('default', 799, 999, true, 'In Stock', '24-48 hours', 'Mon - Sat', '2:00 PM')
on conflict (id) do nothing;
