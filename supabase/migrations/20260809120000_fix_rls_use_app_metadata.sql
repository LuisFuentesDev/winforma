-- El Security Advisor de Supabase marcó las policies anteriores: usaban
-- user_metadata, que el propio usuario puede editar desde el cliente
-- (supabase.auth.updateUser), permitiendo escalar de sitio. app_metadata solo
-- se puede escribir con la service role key, nunca desde el navegador.

-- Migra cualquier `site` que ya estuviera en user_metadata hacia app_metadata,
-- para no dejar a los editores existentes sin acceso.
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb)
  || jsonb_build_object('site', raw_user_meta_data ->> 'site')
where raw_user_meta_data ->> 'site' is not null;

DROP POLICY IF EXISTS "Authenticated users can insert their site's articles" ON public.articles;
CREATE POLICY "Authenticated users can insert their site's articles" ON public.articles
  FOR INSERT TO authenticated
  WITH CHECK (
    site = coalesce((auth.jwt() -> 'app_metadata' ->> 'site'), 'winforma')
  );

DROP POLICY IF EXISTS "Authenticated users can update their site's articles" ON public.articles;
CREATE POLICY "Authenticated users can update their site's articles" ON public.articles
  FOR UPDATE TO authenticated
  USING (
    site = coalesce((auth.jwt() -> 'app_metadata' ->> 'site'), 'winforma')
  )
  WITH CHECK (
    site = coalesce((auth.jwt() -> 'app_metadata' ->> 'site'), 'winforma')
  );

DROP POLICY IF EXISTS "Authenticated users can delete their site's articles" ON public.articles;
CREATE POLICY "Authenticated users can delete their site's articles" ON public.articles
  FOR DELETE TO authenticated
  USING (
    site = coalesce((auth.jwt() -> 'app_metadata' ->> 'site'), 'winforma')
  );
