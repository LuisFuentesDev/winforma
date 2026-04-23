import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useArticles } from "@/hooks/useArticles";
import type { Article } from "@/data/articles";

export function useMostRead(limit = 5): Article[] {
  const { data: articles = [] } = useArticles();
  const [slugsByViews, setSlugsByViews] = useState<string[]>([]);

  useEffect(() => {
    if (!supabase) return;

    const fetch = async () => {
      const { data, error } = await supabase
        .from("page_views")
        .select("page_slug, view_count")
        .like("page_slug", "article-%")
        .order("view_count", { ascending: false })
        .limit(limit * 3);

      if (!error && data) {
        setSlugsByViews(data.map((r) => r.page_slug.replace(/^article-/, "")));
      }
    };
    void fetch();
  }, [limit]);

  if (!slugsByViews.length || !articles.length) return [];

  const bySlug = new Map(articles.map((a) => [a.slug, a]));
  const result: Article[] = [];

  for (const slug of slugsByViews) {
    const article = bySlug.get(slug);
    if (article) result.push(article);
    if (result.length >= limit) break;
  }

  // fallback: if page_views are empty just return first N articles
  if (!result.length) return articles.slice(0, limit);

  return result;
}
