import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type ArticleStatus = "draft" | "published" | "archived";

export type AdminArticleRecord = Tables<"articles">;

export interface AdminArticleFormValues {
  id?: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  category: string;
  imageUrl: string;
  sourceUrl: string;
  breaking: boolean;
  status: ArticleStatus;
  publishedAt: string;
}

export const ADMIN_CATEGORIES = [
  "Regional",
  "Nacional",
  "Internacional",
  "Deportes",
  "Editorial",
] as const;

const STORAGE_BUCKET =
  import.meta.env.VITE_STORAGE_BUCKET ||
  import.meta.env.VITE_ARTICLE_IMAGES_BUCKET ||
  "article-images";

const ARTICLE_ADMIN_SELECT =
  "id, slug, title, summary, content, author, category, image_url, source_url, breaking, status, published_at, created_at, updated_at";

export function slugifyArticleTitle(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function toDatetimeLocalValue(value?: string | null) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60_000);
  return localDate.toISOString().slice(0, 16);
}

function toIsoDateTime(value: string) {
  if (!value) return new Date().toISOString();

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return new Date().toISOString();
  }

  return parsed.toISOString();
}

function normalizeManualContent(content: string) {
  if (/<[a-z][\s\S]*>/i.test(content)) {
    return content;
  }

  return content
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p>${paragraph.replace(/\n/g, "<br />")}</p>`)
    .join("\n");
}

export function createEmptyArticleForm(): AdminArticleFormValues {
  return {
    slug: "",
    title: "",
    summary: "",
    content: "",
    author: "Equipo Winforma",
    category: "Regional",
    imageUrl: "",
    sourceUrl: "",
    breaking: false,
    status: "published",
    publishedAt: toDatetimeLocalValue(new Date().toISOString()),
  };
}

export function mapArticleToForm(article: AdminArticleRecord): AdminArticleFormValues {
  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    summary: article.summary,
    content: article.content,
    author: article.author,
    category: article.category,
    imageUrl: article.image_url ?? "",
    sourceUrl: article.source_url ?? "",
    breaking: article.breaking,
    status: (article.status as ArticleStatus) ?? "draft",
    publishedAt: toDatetimeLocalValue(article.published_at),
  };
}

export async function fetchAdminArticles() {
  if (!supabase) {
    throw new Error("Supabase no está configurado.");
  }

  const { data, error } = await supabase
    .from("articles")
    .select(ARTICLE_ADMIN_SELECT)
    .order("published_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as AdminArticleRecord[];
}

export async function uploadArticleImage(file: File, slug: string) {
  if (!supabase) {
    throw new Error("Supabase no está configurado.");
  }

  const safeSlug = slugifyArticleTitle(slug || file.name || crypto.randomUUID()) || crypto.randomUUID();
  const extension = file.name.includes(".") ? file.name.split(".").pop()?.toLowerCase() : "jpg";
  const path = `articles/${safeSlug}.${extension || "jpg"}`;

  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file, {
    upsert: true,
    cacheControl: "31536000",
    contentType: file.type || undefined,
  });

  if (error) {
    throw error;
  }

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function deleteAdminArticle(id: string) {
  if (!supabase) {
    throw new Error("Supabase no está configurado.");
  }

  const { error } = await supabase.from("articles").delete().eq("id", id);

  if (error) {
    throw error;
  }
}

export async function saveAdminArticle(values: AdminArticleFormValues) {
  if (!supabase) {
    throw new Error("Supabase no está configurado.");
  }

  const slug = slugifyArticleTitle(values.slug || values.title);
  if (!slug) {
    throw new Error("Debes ingresar un título o slug válido.");
  }

  const payload = {
    slug,
    title: values.title.trim(),
    summary: values.summary.trim(),
    content: normalizeManualContent(values.content.trim()),
    author: values.author.trim() || "Equipo Winforma",
    category: values.category,
    image_url: values.imageUrl.trim() || null,
    source_url: values.sourceUrl.trim() || null,
    breaking: values.breaking,
    status: values.status,
    published_at: toIsoDateTime(values.publishedAt),
    updated_at: new Date().toISOString(),
  };

  if (values.id) {
    const { data, error } = await supabase
      .from("articles")
      .update(payload)
      .eq("id", values.id)
      .select(ARTICLE_ADMIN_SELECT)
      .single();

    if (error) {
      throw error;
    }

    return data as AdminArticleRecord;
  }

  const { data, error } = await supabase
    .from("articles")
    .insert(payload)
    .select(ARTICLE_ADMIN_SELECT)
    .single();

  if (error) {
    throw error;
  }

  return data as AdminArticleRecord;
}
