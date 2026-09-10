create table if not exists public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company_name text,
  document text,
  phone text not null,
  email text not null,
  generator text not null,
  message text not null,
  status text not null default 'nova' check (status in ('nova', 'em_andamento', 'atendida')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_updated_at on public.quote_requests;
create trigger set_updated_at
  before update on public.quote_requests
  for each row execute function public.set_updated_at();

alter table public.quote_requests enable row level security;

drop policy if exists "quote_requests_public_insert" on public.quote_requests;
create policy "quote_requests_public_insert"
  on public.quote_requests for insert
  to anon, authenticated
  with check (true);

drop policy if exists "quote_requests_admin_select" on public.quote_requests;
create policy "quote_requests_admin_select"
  on public.quote_requests for select
  using (public.is_admin());

drop policy if exists "quote_requests_admin_update" on public.quote_requests;
create policy "quote_requests_admin_update"
  on public.quote_requests for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "quote_requests_admin_delete" on public.quote_requests;
create policy "quote_requests_admin_delete"
  on public.quote_requests for delete
  using (public.is_admin());

grant insert on public.quote_requests to anon, authenticated;
grant select, update, delete on public.quote_requests to authenticated;

alter table public.quote_requests replica identity full;

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'quote_requests'
  ) then
    alter publication supabase_realtime add table public.quote_requests;
  end if;
end $$;
