ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can read all articles" ON public.articles;
CREATE POLICY "Authenticated users can read all articles" ON public.articles
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert articles" ON public.articles;
CREATE POLICY "Authenticated users can insert articles" ON public.articles
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update articles" ON public.articles;
CREATE POLICY "Authenticated users can update articles" ON public.articles
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can delete articles" ON public.articles;
CREATE POLICY "Authenticated users can delete articles" ON public.articles
  FOR DELETE TO authenticated USING (true);

INSERT INTO storage.buckets (id, name, public)
VALUES ('article-images', 'article-images', true)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;

DROP POLICY IF EXISTS "Public can view article images" ON storage.objects;
CREATE POLICY "Public can view article images" ON storage.objects
  FOR SELECT USING (bucket_id = 'article-images');

DROP POLICY IF EXISTS "Authenticated users can upload article images" ON storage.objects;
CREATE POLICY "Authenticated users can upload article images" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'article-images');

DROP POLICY IF EXISTS "Authenticated users can update article images" ON storage.objects;
CREATE POLICY "Authenticated users can update article images" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'article-images') WITH CHECK (bucket_id = 'article-images');

DROP POLICY IF EXISTS "Authenticated users can delete article images" ON storage.objects;
CREATE POLICY "Authenticated users can delete article images" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'article-images');
