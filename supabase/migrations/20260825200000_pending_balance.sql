alter table public.transactions
  add column if not exists status text not null default 'pago';

alter table public.transactions drop constraint if exists transactions_status_check;
alter table public.transactions
  add constraint transactions_status_check check (status in ('pago', 'pendente'));
