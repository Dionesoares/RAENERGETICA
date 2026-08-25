-- RA Energética schema, RLS and storage

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  role text not null default 'user' check (role in ('admin', 'user')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  type text not null default 'pf' check (type in ('pf', 'pj')),
  name text not null,
  trade_name text,
  document text,
  state_registration text,
  contact_person text,
  email text,
  phone text,
  address text,
  city text,
  state text,
  zip_code text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contracts (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients (id) on delete set null,
  contract_number text not null,
  equipment text,
  value numeric,
  start_date date,
  end_date date,
  payment_terms text,
  status text not null default 'rascunho' check (status in ('rascunho', 'assinado')),
  notes text,
  content_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  image_url text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.technicians (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  phone text,
  cpf text,
  address text,
  city text,
  state text,
  cnh text,
  resume_url text,
  courses text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  date date not null,
  time text,
  status text not null default 'pendente' check (status in ('pendente', 'concluida')),
  priority text not null default 'media' check (priority in ('baixa', 'media', 'alta')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  type text not null default 'entrada' check (type in ('entrada', 'saida')),
  description text not null,
  category text,
  amount numeric not null,
  date date not null,
  payment_method text,
  client_id uuid references public.clients (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.service_reports (
  id uuid primary key default gen_random_uuid(),
  technician_name text,
  report_text text not null,
  photos jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare
  t text;
begin
  foreach t in array array['profiles', 'clients', 'contracts', 'products', 'technicians', 'tasks', 'transactions', 'service_reports']
  loop
    execute format('drop trigger if exists set_updated_at on public.%I', t);
    execute format('create trigger set_updated_at before update on public.%I for each row execute function public.set_updated_at()', t);
  end loop;
end $$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    coalesce(new.raw_user_meta_data->>'role', 'user')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.clients enable row level security;
alter table public.contracts enable row level security;
alter table public.products enable row level security;
alter table public.technicians enable row level security;
alter table public.tasks enable row level security;
alter table public.transactions enable row level security;
alter table public.service_reports enable row level security;

drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin"
  on public.profiles for select
  using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

drop policy if exists "admin_all_clients" on public.clients;
create policy "admin_all_clients" on public.clients for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin_all_contracts" on public.contracts;
create policy "admin_all_contracts" on public.contracts for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin_all_tasks" on public.tasks;
create policy "admin_all_tasks" on public.tasks for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin_all_transactions" on public.transactions;
create policy "admin_all_transactions" on public.transactions for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "products_public_read" on public.products;
create policy "products_public_read" on public.products for select using (true);

drop policy if exists "products_admin_write" on public.products;
create policy "products_admin_write" on public.products for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "technicians_select" on public.technicians;
create policy "technicians_select"
  on public.technicians for select
  using (public.is_admin() or lower(email) = lower(coalesce(auth.jwt()->>'email', '')));

drop policy if exists "technicians_admin_write" on public.technicians;
create policy "technicians_admin_write"
  on public.technicians for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "reports_admin_select" on public.service_reports;
create policy "reports_admin_select" on public.service_reports for select using (public.is_admin());

drop policy if exists "reports_insert_authenticated" on public.service_reports;
create policy "reports_insert_authenticated"
  on public.service_reports for insert
  to authenticated
  with check (true);

drop policy if exists "reports_admin_update" on public.service_reports;
create policy "reports_admin_update" on public.service_reports for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "reports_admin_delete" on public.service_reports;
create policy "reports_admin_delete" on public.service_reports for delete using (public.is_admin());

insert into storage.buckets (id, name, public)
values ('uploads', 'uploads', true)
on conflict (id) do nothing;

drop policy if exists "uploads_public_read" on storage.objects;
create policy "uploads_public_read"
  on storage.objects for select
  using (bucket_id = 'uploads');

drop policy if exists "uploads_auth_insert" on storage.objects;
create policy "uploads_auth_insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'uploads');

drop policy if exists "uploads_admin_delete" on storage.objects;
create policy "uploads_admin_delete"
  on storage.objects for delete
  using (bucket_id = 'uploads' and public.is_admin());
