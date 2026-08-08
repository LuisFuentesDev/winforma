-- Antes: cualquier usuario autenticado podía insertar/actualizar/borrar CUALQUIER
-- artículo, sin importar el sitio. Ahora que hay dos paneles de edición (Winforma
-- y Abajo e' la Línea) compartiendo el mismo backend, se restringe la escritura al
-- `site` que declare el usuario en su user_metadata (`{"site": "winforma"}` o
-- `{"site": "abajolalinea"}`). Las cuentas ya existentes, sin esa metadata, se
-- tratan como 'winforma' por retrocompatibilidad.
DROP POLICY IF EXISTS "Authenticated users can insert articles" ON public.articles;
CREATE POLICY "Authenticated users can insert their site's articles" ON public.articles
  FOR INSERT TO authenticated
  WITH CHECK (
    site = coalesce((auth.jwt() -> 'user_metadata' ->> 'site'), 'winforma')
  );

DROP POLICY IF EXISTS "Authenticated users can update articles" ON public.articles;
CREATE POLICY "Authenticated users can update their site's articles" ON public.articles
  FOR UPDATE TO authenticated
  USING (
    site = coalesce((auth.jwt() -> 'user_metadata' ->> 'site'), 'winforma')
  )
  WITH CHECK (
    site = coalesce((auth.jwt() -> 'user_metadata' ->> 'site'), 'winforma')
  );

DROP POLICY IF EXISTS "Authenticated users can delete articles" ON public.articles;
CREATE POLICY "Authenticated users can delete their site's articles" ON public.articles
  FOR DELETE TO authenticated
  USING (
    site = coalesce((auth.jwt() -> 'user_metadata' ->> 'site'), 'winforma')
  );
