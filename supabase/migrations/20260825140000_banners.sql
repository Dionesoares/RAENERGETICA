-- Homepage banners managed from the admin panel

create table if not exists public.banners (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  caption text,
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_updated_at on public.banners;
create trigger set_updated_at
  before update on public.banners
  for each row execute function public.set_updated_at();

alter table public.banners enable row level security;

drop policy if exists "banners_public_read" on public.banners;
create policy "banners_public_read" on public.banners for select using (true);

drop policy if exists "banners_admin_write" on public.banners;
create policy "banners_admin_write"
  on public.banners for all
  using (public.is_admin())
  with check (public.is_admin());

grant select on table public.banners to anon, authenticated;
grant insert, update, delete on table public.banners to authenticated;

insert into public.banners (image_url, caption, sort_order, active)
select * from (
  values
    ('/banners/powerbox.jpg', 'Cansado de ficar sem energia? Chegou o Powerbox', 1, true),
    ('/banners/locacao.jpg', 'Locação de geradores para todos os segmentos — 11 anos entregando agilidade e confiança', 2, true)
) as seed(image_url, caption, sort_order, active)
where not exists (select 1 from public.banners);
