CREATE TABLE public.config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.config ENABLE ROW LEVEL SECURITY;

-- Solo el service role puede leer y escribir
CREATE POLICY "Service role only" ON public.config
  USING (false);
