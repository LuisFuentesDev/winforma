-- Remove permissive INSERT and UPDATE policies since we use the SECURITY DEFINER function
DROP POLICY "Anyone can insert page views" ON public.page_views;
DROP POLICY "Anyone can update page views" ON public.page_views;