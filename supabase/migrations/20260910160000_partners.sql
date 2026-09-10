-- Homepage partners managed from the admin panel

create table if not exists public.partners (
  id uuid primary key default gen_random_uuid(),
  name text,
  logo_url text not null,
  message text,
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_updated_at on public.partners;
create trigger set_updated_at
  before update on public.partners
  for each row execute function public.set_updated_at();

alter table public.partners enable row level security;

drop policy if exists "partners_public_read" on public.partners;
create policy "partners_public_read" on public.partners for select using (true);

drop policy if exists "partners_admin_write" on public.partners;
create policy "partners_admin_write"
  on public.partners for all
  using (public.is_admin())
  with check (public.is_admin());

grant select on table public.partners to anon, authenticated;
grant insert, update, delete on table public.partners to authenticated;
