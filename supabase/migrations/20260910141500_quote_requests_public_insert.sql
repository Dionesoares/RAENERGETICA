drop policy if exists "quote_requests_public_insert" on public.quote_requests;
create policy "quote_requests_public_insert"
  on public.quote_requests for insert
  with check (true);

grant insert on public.quote_requests to anon, authenticated, public;

notify pgrst, 'reload schema';
