CREATE TABLE IF NOT EXISTS public.ads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slot TEXT NOT NULL UNIQUE CHECK (slot IN ('leaderboard', 'banner', 'inline', 'sidebar')),
  title TEXT NOT NULL DEFAULT 'Publicidad WINFORMA',
  image_url TEXT,
  target_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.ads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read active ads" ON public.ads;
CREATE POLICY "Anyone can read active ads" ON public.ads
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Authenticated users can read all ads" ON public.ads;
CREATE POLICY "Authenticated users can read all ads" ON public.ads
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert ads" ON public.ads;
CREATE POLICY "Authenticated users can insert ads" ON public.ads
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update ads" ON public.ads;
CREATE POLICY "Authenticated users can update ads" ON public.ads
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can delete ads" ON public.ads;
CREATE POLICY "Authenticated users can delete ads" ON public.ads
  FOR DELETE TO authenticated USING (true);

INSERT INTO public.ads (slot, title, is_active)
VALUES
  ('leaderboard', 'Banner cabecera', false),
  ('banner', 'Banner medio', false),
  ('inline', 'Banner artículo', false),
  ('sidebar', 'Banner lateral', false)
ON CONFLICT (slot) DO NOTHING;
