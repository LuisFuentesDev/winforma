import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function usePageViews(pageSlug: string) {
  const [viewCount, setViewCount] = useState<number | null>(null);

  useEffect(() => {
    if (!supabase || !pageSlug) return;

    const trackView = async () => {
      const { data, error } = await supabase.rpc("increment_page_view", {
        p_page_slug: pageSlug,
      });
      if (!error && data !== null) {
        setViewCount(data as number);
      }
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
      if (!error && data) {
        const total = data.reduce((sum, row) => sum + Number(row.view_count), 0);
        setTotalViews(total);
      }
    };
    void fetchTotal();
  }, []);

  return totalViews;
}
