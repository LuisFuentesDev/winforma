-- Create page_views table for tracking visits
CREATE TABLE public.page_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_slug TEXT NOT NULL UNIQUE,
  view_count BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- Anyone can read view counts
CREATE POLICY "Anyone can read page views" ON public.page_views
  FOR SELECT USING (true);

-- Anyone can insert page views
CREATE POLICY "Anyone can insert page views" ON public.page_views
  FOR INSERT WITH CHECK (true);

-- Anyone can update view counts
CREATE POLICY "Anyone can update page views" ON public.page_views
  FOR UPDATE USING (true);

-- Function to increment view count (upsert)
CREATE OR REPLACE FUNCTION public.increment_page_view(p_page_slug TEXT)
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_count BIGINT;
BEGIN
  INSERT INTO public.page_views (page_slug, view_count)
  VALUES (p_page_slug, 1)
  ON CONFLICT (page_slug)
  DO UPDATE SET view_count = page_views.view_count + 1, updated_at = now()
  RETURNING view_count INTO current_count;
  
  RETURN current_count;
END;
$$;