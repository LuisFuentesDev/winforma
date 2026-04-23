import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function usePageViews(pageSlug: string) {
  const [viewCount, setViewCount] = useState<number | null>(null);

  useEffect(() => {
    if (!supabase || !pageSlug) return;

    const trackView = async () => {
      // Try RPC increment first
      const { data, error } = await supabase.rpc("increment_page_view", {
        p_page_slug: pageSlug,
      });

      if (!error && data !== null) {
        setViewCount(data as number);
        return;
      }

      if (error) {
        console.warn("[usePageViews] RPC increment_page_view falló:", error.message);
      }

      // Fallback: read current count directly from the table
      const { data: row, error: readError } = await supabase
        .from("page_views")
        .select("view_count")
        .eq("page_slug", pageSlug)
        .maybeSingle();

      if (readError) {
        console.warn("[usePageViews] Fallback read falló:", readError.message);
        setViewCount(0);
        return;
      }

      setViewCount(row?.view_count ?? 0);
    };

    void trackView();
  }, [pageSlug]);

  return viewCount;
}

export function useAllPageViews() {
  const [totalViews, setTotalViews] = useState<number | null>(null);

  useEffect(() => {
    if (!supabase) return;

    const fetchTotal = async () => {
      const { data, error } = await supabase
        .from("page_views")
        .select("view_count");

      if (error) {
        console.warn("[useAllPageViews] Error al leer page_views:", error.message);
        setTotalViews(0);
        return;
      }

      if (data) {
        const total = data.reduce((sum, row) => sum + Number(row.view_count), 0);
        setTotalViews(total);
      }
    };

    void fetchTotal();
  }, []);

  return totalViews;
}
