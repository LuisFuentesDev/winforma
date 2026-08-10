import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { mapSupabaseArticle, type Article, type SupabaseArticle } from "@/data/articles";
import { supabase } from "@/integrations/supabase/client";

// Sin "content": el listado no lo muestra (solo summary). Ahorra el grueso del payload.
const ARTICLES_LIST_SELECT =
  "id, slug, title, summary, author, category, image_url, source_url, breaking, status, published_at, created_at, updated_at";
const ARTICLE_DETAIL_SELECT = `${ARTICLES_LIST_SELECT}, content`;

async function fetchArticles(): Promise<Article[]> {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("articles")
    .select(ARTICLES_LIST_SELECT)
    .eq("status", "published")
    .eq("site", "winforma")
    .order("published_at", { ascending: false });

  if (error || !data?.length) {
    return [];
  }

  return (data as SupabaseArticle[]).map((a) => mapSupabaseArticle({ ...a, content: a.content ?? "" }));
}

async function fetchArticleBySlug(slug?: string): Promise<Article | null> {
  if (!supabase || !slug) {
    return null;
  }

  const { data, error } = await supabase
    .from("articles")
    .select(ARTICLE_DETAIL_SELECT)
    .eq("status", "published")
    .eq("site", "winforma")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  return mapSupabaseArticle(data as SupabaseArticle);
}

export function useArticles() {
  return useQuery({
    queryKey: ["articles"],
    queryFn: fetchArticles,
    staleTime: 60_000,
  });
}

export function useArticle(slug?: string) {
  return useQuery({
    queryKey: ["article", slug],
    queryFn: () => fetchArticleBySlug(slug),
    enabled: Boolean(slug),
    staleTime: 60_000,
  });
}

export function useArticlesByCategory(category?: string) {
  const query = useArticles();

  const articles = useMemo(() => {
    if (!category) return [];

    return (query.data ?? []).filter(
      (article) => article.category.toLowerCase() === category.toLowerCase(),
    );
  }, [category, query.data]);

  return {
    ...query,
    data: articles,
  };
}
