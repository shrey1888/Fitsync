-- FITSYNC DATABASE SCHEMA (SUPABASE POSTGRESQL)
-- Production ready with Row Level Security (RLS) & Multi-Brand Fashion Tech Data

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- 2. ENUMS
do $$ begin
  create type gender_category as enum ('menswear', 'womenswear', 'unisex');
exception when duplicate_object then null; end $$;

do $$ begin
  create type fit_preference as enum ('slim', 'regular', 'relaxed', 'oversized');
exception when duplicate_object then null; end $$;

do $$ begin
  create type clothing_category as enum ('tops', 'bottoms', 'outerwear', 'dresses');
exception when duplicate_object then null; end $$;

do $$ begin
  create type confidence_level as enum ('High', 'Moderate', 'Low');
exception when duplicate_object then null; end $$;

-- 3. USERS / PROFILES TABLE
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique,
  full_name text,
  avatar_url text,
  unit_preference text default 'cm' check (unit_preference in ('cm', 'inch')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. BODY MEASUREMENTS TABLE (Private to the authenticated user)
create table if not exists public.body_measurements (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  height numeric(5,2) not null, -- stored in cm
  weight numeric(5,2), -- stored in kg
  chest numeric(5,2) not null,
  waist numeric(5,2) not null,
  shoulder numeric(5,2),
  hip numeric(5,2),
  inseam numeric(5,2),
  gender gender_category default 'menswear' not null,
  fit_preference fit_preference default 'regular' not null,
  unit text default 'cm' check (unit in ('cm', 'inch')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_user_measurement unique (user_id)
);

-- 5. BRANDS TABLE
create table if not exists public.brands (
  id text primary key, -- e.g. 'zara', 'uniqlo', 'levis'
  name text not null,
  country text not null,
  tagline text,
  sizing_philosophy text,
  sizing_tendency text default 'true_to_size',
  sizing_note text,
  hero_image text,
  website text,
  founded int,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. CATEGORIES TABLE
create table if not exists public.categories (
  id text primary key, -- 'tops', 'bottoms', 'outerwear', 'dresses'
  name text not null,
  description text,
  primary_measurements text[] not null -- ['chest', 'shoulder']
);

-- 7. PRODUCTS TABLE
create table if not exists public.products (
  id text primary key,
  brand_id text references public.brands(id) on delete cascade not null,
  slug text not null,
  name text not null,
  category clothing_category not null,
  gender gender_category default 'menswear' not null,
  fit_cut fit_preference default 'regular' not null,
  fabric text,
  description text,
  image text,
  price text,
  has_product_specific_chart boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. SIZE CHARTS TABLE
create table if not exists public.size_charts (
  id uuid default uuid_generate_v4() primary key,
  brand_id text references public.brands(id) on delete cascade not null,
  category clothing_category not null,
  gender gender_category default 'menswear' not null,
  product_id text references public.products(id) on delete cascade,
  is_product_specific boolean default false,
  is_verified boolean default true,
  source_note text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 9. SIZE CHART MEASUREMENTS (Entries per size)
create table if not exists public.size_chart_measurements (
  id uuid default uuid_generate_v4() primary key,
  size_chart_id uuid references public.size_charts(id) on delete cascade not null,
  size_label text not null, -- 'XS', 'S', 'M', 'L', 'XL' or '30', '32', '34'
  chest_min numeric(5,2),
  chest_max numeric(5,2),
  waist_min numeric(5,2),
  waist_max numeric(5,2),
  hip_min numeric(5,2),
  hip_max numeric(5,2),
  shoulder_min numeric(5,2),
  shoulder_max numeric(5,2),
  inseam_min numeric(5,2),
  inseam_max numeric(5,2),
  garment_chest numeric(5,2),
  garment_waist numeric(5,2),
  garment_length numeric(5,2)
);

-- 10. RECOMMENDATIONS TABLE (User recommendation history)
create table if not exists public.recommendations (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  brand_id text references public.brands(id) on delete cascade not null,
  product_id text references public.products(id) on delete set null,
  category clothing_category not null,
  recommended_size text not null,
  confidence_score int not null,
  confidence_level confidence_level not null,
  fit_assessment text not null,
  reasoning text,
  dimension_breakdowns jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 11. ROW LEVEL SECURITY (RLS) POLICIES

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.body_measurements enable row level security;
alter table public.brands enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.size_charts enable row level security;
alter table public.size_chart_measurements enable row level security;
alter table public.recommendations enable row level security;

-- PROFILES: Users can read and update only their own profile
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- BODY MEASUREMENTS: Strictly private to user
create policy "Users can view own measurements" on public.body_measurements
  for select using (auth.uid() = user_id);

create policy "Users can insert own measurements" on public.body_measurements
  for insert with check (auth.uid() = user_id);

create policy "Users can update own measurements" on public.body_measurements
  for update using (auth.uid() = user_id);

create policy "Users can delete own measurements" on public.body_measurements
  for delete using (auth.uid() = user_id);

-- PUBLIC BRAND DATA: Anyone can read brands, categories, products, and size charts
create policy "Public read brands" on public.brands for select using (true);
create policy "Public read categories" on public.categories for select using (true);
create policy "Public read products" on public.products for select using (true);
create policy "Public read size_charts" on public.size_charts for select using (true);
create policy "Public read size_chart_measurements" on public.size_chart_measurements for select using (true);

-- RECOMMENDATIONS: User can only view, insert, and delete their own recommendation logs
create policy "Users can view own recommendations" on public.recommendations
  for select using (auth.uid() = user_id);

create policy "Users can insert own recommendations" on public.recommendations
  for insert with check (auth.uid() = user_id);

create policy "Users can delete own recommendations" on public.recommendations
  for delete using (auth.uid() = user_id);
