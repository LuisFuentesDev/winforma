import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { fetchArticlesBySlugs } from "@/hooks/useArticles";
import type { Article } from "@/data/articles";

async function fetchMostRead(limit: number): Promise<Article[]> {
  if (!supabase) return [];

  const { data: views, error } = await supabase
    .from("page_views")
    .select("page_slug, view_count")
    .like("page_slug", "article-%")
    .order("view_count", { ascending: false })
    .limit(limit * 3); // margen: algunos slugs pueden no resolver a un artículo publicado

  if (error || !views?.length) return [];

  const slugsByViews = views.map((r) => r.page_slug.replace(/^article-/, ""));
  const articles = await fetchArticlesBySlugs(slugsByViews);
  const bySlug = new Map(articles.map((a) => [a.slug, a]));

  const result: Article[] = [];
  for (const slug of slugsByViews) {
    const article = bySlug.get(slug);
    if (article) result.push(article);
    if (result.length >= limit) break;
  }

  return result;
}

export function useMostRead(limit = 5): Article[] {
  const { data } = useQuery({
    queryKey: ["mostRead", limit],
    queryFn: () => fetchMostRead(limit),
    staleTime: 60_000,
  });

  return data ?? [];
}
