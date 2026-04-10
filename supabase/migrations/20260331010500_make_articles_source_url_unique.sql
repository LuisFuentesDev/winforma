CREATE UNIQUE INDEX IF NOT EXISTS articles_source_url_unique_idx
  ON public.articles (source_url)
  WHERE source_url IS NOT NULL;

ALTER TABLE public.articles
  ALTER COLUMN author SET DEFAULT 'Equipo Winforma';
