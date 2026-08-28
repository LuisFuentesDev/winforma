-- El sync de Instagram detectaba duplicados con un SELECT previo al INSERT
-- (sin lock ni constraint), así que invocaciones concurrentes de la misma
-- función (cron solapado, invocación manual + cron) creaban varios artículos
-- para el mismo post: el slug siempre difiere porque el título lo reescribe
-- OpenAI cada vez, así que nunca chocaba con el UNIQUE(slug) existente.
--
-- 1) Deja solo el artículo más antiguo por (site, source_url).
-- 2) Agrega un índice único que hace imposible la repetición a nivel de BD.

delete from public.articles a
using public.articles b
where a.source_url is not null
  and a.source_url = b.source_url
  and a.site = b.site
  and (a.created_at, a.id) > (b.created_at, b.id);

create unique index articles_site_source_url_key
  on public.articles (site, source_url)
  where source_url is not null;
