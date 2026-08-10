import { useMemo } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { mapSupabaseArticle, type Article, type SupabaseArticle } from "@/data/articles";
import { supabase } from "@/integrations/supabase/client";

// Sin "content": el listado no lo muestra (solo summary). Ahorra el grueso del payload.
const ARTICLES_LIST_SELECT =
  "id, slug, title, summary, author, category, image_url, source_url, breaking, status, published_at, created_at, updated_at";
const ARTICLE_DETAIL_SELECT = `${ARTICLES_LIST_SELECT}, content`;

// Cubre hero(7) + latest(8) + primer lote del grid secundario sin pedir una 2da página.
const PAGE_SIZE = 24;

async function fetchArticlesPage(page: number, category?: string): Promise<Article[]> {
  if (!supabase) {
    return [];
  }

  const from = page * PAGE_SIZE;
  let query = supabase
    .from("articles")
    .select(ARTICLES_LIST_SELECT)
    .eq("status", "published")
    .eq("site", "winforma");

  if (category) {
    query = query.ilike("category", category); // sin comodines = comparación exacta case-insensitive
  }

  const { data, error } = await query
    .order("published_at", { ascending: false })
    .range(from, from + PAGE_SIZE - 1);

  if (error || !data?.length) {
    return [];
  }

  return (data as SupabaseArticle[]).map((a) => mapSupabaseArticle({ ...a, content: a.content ?? "" }));
}

export async function fetchArticlesBySlugs(slugs: string[]): Promise<Article[]> {
  if (!supabase || !slugs.length) {
    return [];
  }

  const { data, error } = await supabase
    .from("articles")
    .select(ARTICLES_LIST_SELECT)
    .eq("status", "published")
    .eq("site", "winforma")
    .in("slug", slugs);

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

function useArticlesInfinite(queryKey: unknown[], category?: string, enabled = true) {
  const query = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) => fetchArticlesPage(pageParam, category),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => (lastPage.length === PAGE_SIZE ? pages.length : undefined),
    staleTime: 60_000,
    enabled,
  });

  const articles = useMemo(() => query.data?.pages.flat() ?? [], [query.data]);

  return { ...query, data: articles };
}

export function useArticles() {
  return useArticlesInfinite(["articles"]);
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
  return useArticlesInfinite(["articles", "category", category], category, Boolean(category));
}
