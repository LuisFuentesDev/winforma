-- Permite que un mismo backend/tabla sirva a varios frontends (Winforma, Abajo e' la Línea, ...).
alter table public.articles
  add column if not exists site text not null default 'winforma';

create index if not exists articles_site_status_published_at_idx
  on public.articles (site, status, published_at desc);
