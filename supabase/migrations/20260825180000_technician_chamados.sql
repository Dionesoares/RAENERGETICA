-- Chamados do administrativo para técnicos e relatórios editáveis

alter table public.tasks
  add column if not exists technician_id uuid references public.technicians (id) on delete set null,
  add column if not exists technician_email text,
  add column if not exists kind text not null default 'tarefa';

alter table public.service_reports
  add column if not exists technician_id uuid references public.technicians (id) on delete set null,
  add column if not exists technician_email text,
  add column if not exists task_id uuid references public.tasks (id) on delete set null;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    lower(coalesce(auth.jwt() ->> 'email', '')) in ('dione2010@gmail.com', 'prof-dione-soares@hotmail.com')
    or exists (
      select 1
      from public.profiles
      where id = auth.uid()
        and role = 'admin'
    );
$$;

update public.profiles
set role = 'admin'
where lower(email) in ('dione2010@gmail.com', 'prof-dione-soares@hotmail.com');

create or replace function public.is_technician()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.technicians
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

drop policy if exists "tech_select_assigned_tasks" on public.tasks;
create policy "tech_select_assigned_tasks"
  on public.tasks for select
  using (
    public.is_admin()
    or lower(coalesce(technician_email, '')) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );

drop policy if exists "tech_update_assigned_tasks" on public.tasks;
create policy "tech_update_assigned_tasks"
  on public.tasks for update
  using (lower(coalesce(technician_email, '')) = lower(coalesce(auth.jwt() ->> 'email', '')))
  with check (lower(coalesce(technician_email, '')) = lower(coalesce(auth.jwt() ->> 'email', '')));

drop policy if exists "reports_tech_select" on public.service_reports;
create policy "reports_tech_select"
  on public.service_reports for select
  using (
    public.is_admin()
    or lower(coalesce(technician_email, '')) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );

drop policy if exists "reports_insert_authenticated" on public.service_reports;
drop policy if exists "reports_insert_tech_or_admin" on public.service_reports;
create policy "reports_insert_tech_or_admin"
  on public.service_reports for insert
  to authenticated
  with check (public.is_admin() or public.is_technician());

drop policy if exists "reports_tech_update" on public.service_reports;
create policy "reports_tech_update"
  on public.service_reports for update
  using (
    public.is_admin()
    or lower(coalesce(technician_email, '')) = lower(coalesce(auth.jwt() ->> 'email', ''))
  )
  with check (
    public.is_admin()
    or lower(coalesce(technician_email, '')) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
