-- Videos de programas grabados (YouTube). Solo se guarda la URL/ID del video
-- de YouTube, nunca el archivo: el embed lo sirve YouTube, sin costo de
-- storage para nosotros.
create table public.programs (
  id uuid not null default gen_random_uuid() primary key,
  site text not null default 'winforma',
  title text not null,
  description text,
  youtube_url text not null,
  category text,
  status text not null default 'published' check (status in ('draft', 'published', 'archived')),
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index programs_site_status_published_at_idx
  on public.programs (site, status, published_at desc);

alter table public.programs enable row level security;

create policy "Anyone can read published programs" on public.programs
  for select using (status = 'published');

create policy "Authenticated users can read all their site's programs" on public.programs
  for select to authenticated
  using (site = coalesce((auth.jwt() -> 'app_metadata' ->> 'site'), 'winforma'));

create policy "Authenticated users can insert their site's programs" on public.programs
  for insert to authenticated
  with check (site = coalesce((auth.jwt() -> 'app_metadata' ->> 'site'), 'winforma'));

create policy "Authenticated users can update their site's programs" on public.programs
  for update to authenticated
  using (site = coalesce((auth.jwt() -> 'app_metadata' ->> 'site'), 'winforma'))
  with check (site = coalesce((auth.jwt() -> 'app_metadata' ->> 'site'), 'winforma'));

create policy "Authenticated users can delete their site's programs" on public.programs
  for delete to authenticated
  using (site = coalesce((auth.jwt() -> 'app_metadata' ->> 'site'), 'winforma'));
