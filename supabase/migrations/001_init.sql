create extension if not exists "pgcrypto";

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id),
  name text not null,
  type text not null,
  zone text,
  status text default 'draft',
  region text,
  raw_json jsonb,
  created_at timestamptz default now()
);

create table if not exists targets (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  density_kg_m3 numeric,
  strength_mpa numeric
);

create table if not exists constraints (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  eps_policy text,
  min_pull_off_mpa numeric
);

create table if not exists process (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  steps jsonb
);

create table if not exists components (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id),
  name text not null,
  type text,
  is_eps boolean default false
);

create table if not exists prices (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id),
  region text not null,
  component_name text not null,
  price_per_ton numeric not null
);

create table if not exists recipe_items (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  component_name text not null,
  ratio numeric not null
);

create table if not exists variants (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  name text not null,
  summary text,
  raw_json jsonb
);

create table if not exists doe_plans (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  runs jsonb,
  created_at timestamptz default now()
);

create table if not exists lab_results (
  id uuid primary key default gen_random_uuid(),
  doe_plan_id uuid references doe_plans(id) on delete cascade,
  sample_id text,
  results jsonb,
  photo_url text
);

create table if not exists qc_plans (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  plan jsonb,
  created_at timestamptz default now()
);

create table if not exists sop_docs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  doc jsonb,
  created_at timestamptz default now()
);

create table if not exists economics (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  cost_per_ton numeric,
  margin_pct numeric
);

create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  title text,
  storage_path text,
  created_at timestamptz default now()
);

create table if not exists images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  variant_name text,
  image_type text,
  storage_path text,
  created_at timestamptz default now()
);

create table if not exists translations (
  id uuid primary key default gen_random_uuid(),
  locale text not null,
  key text not null,
  value text not null
);

alter table projects enable row level security;
alter table components enable row level security;
alter table prices enable row level security;
alter table translations enable row level security;

create policy "Projects are viewable by owner" on projects
  for select using (auth.uid() = owner_id);

create policy "Projects are insertable by owner" on projects
  for insert with check (auth.uid() = owner_id);

create policy "Components by owner" on components
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

create policy "Prices by owner" on prices
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

create policy "Translations readable" on translations
  for select using (auth.role() = 'authenticated');

insert into storage.buckets (id, name, public)
  values ('rd-docs', 'rd-docs', false)
  on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
  values ('rd-images', 'rd-images', true)
  on conflict (id) do nothing;
