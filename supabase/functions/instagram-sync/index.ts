import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY") ?? "";
const BASE_URL = Deno.env.get("BASE_URL") ?? "";
const BASE_SERVICE_ROLE_KEY = Deno.env.get("BASE_SERVICE_ROLE_KEY") ?? "";
const STORAGE_BUCKET = Deno.env.get("STORAGE_BUCKET") ?? "article-images";
const INSTAGRAM_FETCH_LIMIT = Number(Deno.env.get("INSTAGRAM_FETCH_LIMIT") ?? "10");

// Nombre del autor mostrado por sitio; agrega uno aquí si se suma un tercer frontend.
const SITE_AUTHORS: Record<string, string> = {
  winforma: "Equipo Winforma",
  abajolalinea: "Abajo e' la Línea",
};

function tokenKey(site: string) {
  return `instagram_access_token:${site}`;
}

function tokenExpiryKey(site: string) {
  return `instagram_token_expires_at:${site}`;
}

async function getInstagramToken(supabase: SupabaseClient, site: string): Promise<string> {
  const { data } = await supabase
    .from("config")
    .select("value")
    .eq("key", tokenKey(site))
    .maybeSingle();

  // Fallback al token/env legacy (sin sufijo de sitio) para no romper Winforma
  // mientras se migran las keys de config.
  return (
    data?.value ||
    (site === "winforma" ? Deno.env.get("INSTAGRAM_ACCESS_TOKEN") ?? "" : "") ||
    ""
  );
}

async function refreshAndSaveToken(
  supabase: SupabaseClient,
  currentToken: string,
  site: string,
): Promise<string> {
  try {
    const { data: expiryRow } = await supabase
      .from("config")
      .select("value")
      .eq("key", tokenExpiryKey(site))
      .maybeSingle();

    if (expiryRow?.value) {
      const expiresAt = new Date(expiryRow.value);
      const daysLeft = (expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
      if (daysLeft > 30) return currentToken;
    }

    const url = new URL("https://graph.instagram.com/refresh_access_token");
    url.searchParams.set("grant_type", "ig_refresh_token");
    url.searchParams.set("access_token", currentToken);

    const response = await fetch(url);
    if (!response.ok) return currentToken;

    const data = await response.json();
    const newToken = data.access_token;
    if (!newToken) return currentToken;

    const expiresAt = new Date(Date.now() + (data.expires_in ?? 5184000) * 1000).toISOString();

    await supabase.from("config").upsert([
      { key: tokenKey(site), value: newToken, updated_at: new Date().toISOString() },
      { key: tokenExpiryKey(site), value: expiresAt, updated_at: new Date().toISOString() },
    ]);

    return newToken;
  } catch {
    return currentToken;
  }
}

// Cada sitio tiene sus propias secciones/páginas, así que la categorización por
// keywords se define por sitio en vez de una sola lista global.
const SITE_CATEGORY_KEYWORDS: Record<string, Record<string, string[]>> = {
  winforma: {
    Regional: [
      "temuco", "araucanía", "cautín", "malleco", "villarrica", "angol", "pucón",
      "padre las casas", "lautaro", "vilcún", "freire", "imperial", "cholchol",
    ],
    Nacional: [
      "gobierno", "presidente", "congreso", "senado", "diputados", "ministerio",
      "moneda", "carabineros", "pdi", "fiscalía", "contraloría", "hacienda", "chile",
    ],
    Internacional: [
      "españa", "eeuu", "estados unidos", "rusia", "china", "ucrania", "irán",
      "israel", "gaza", "otan", "onu", "unión europea", "bruselas", "méxico",
    ],
    Deportes: [
      "colo-colo", "universidad de chile", "universidad católica", "deportes temuco",
      "selección chilena", "fútbol", "copa libertadores", "primera b", "tenis",
      "nicolás jarry", "alejandro tabilo",
    ],
  },
  abajolalinea: {
    Deportes: [
      "caseta femenina", "fútbol femenino", "deportes temuco", "selección chilena",
      "fútbol", "copa libertadores", "primera b", "cuadro local", "liga femenina",
      "ascenso femenino", "descenso", "semifinal", "cuartos de final", "partido",
      "gol", "goles", "cancha", "estadio", "jugadoras", "jugador", "arquera",
      "torneo", "campeonato", "delantera", "mediocampista", "portería", "árbitro",
    ],
    Cultura: [
      "feria", "cultural", "mapuche", "wallmapu", "territorio", "memoria",
      "tradición", "taller", "encuentro cultural", "cine club", "película",
      "documental", "exposición", "artesanía", "música", "festival", "libro",
      "centro cultural", "muestra", "obra de teatro", "danza",
    ],
    Comunidad: [
      "junta de vecinos", "agrupación", "organización social", "movimiento social",
      "audiencia", "seguridad", "barrio", "vecinos", "municipalidad", "alcalde",
      "inundación", "crecida", "emergencia", "onemi", "senapred", "clima",
      "temporal", "nieve", "lluvia", "damnificados", "carabineros", "bomberos",
    ],
  },
};

const DEFAULT_CATEGORY: Record<string, string> = {
  winforma: "Nacional",
  abajolalinea: "Comunidad",
};

type InstagramMedia = {
  id: string;
  caption?: string;
  media_type?: string;
  media_url?: string;
  thumbnail_url?: string;
  permalink?: string;
  timestamp?: string;
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

function normalizeUrl(url: string) {
  if (!url) return url;
  const parsed = new URL(url);
  ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "fbclid"].forEach((key) => {
    parsed.searchParams.delete(key);
  });
  parsed.hash = "";
  return parsed.toString();
}

function cleanInstagramCaption(caption: string) {
  return caption
    .replace(/\ufeff/g, " ")
    .replace(/\ufffc/g, " ")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/@[A-Za-z0-9_.]+/g, "")
    .replace(/#[A-Za-z0-9_áéíóúÁÉÍÓÚñÑ]+/g, "")
    .replace(/[\t ]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function captionToParagraphs(caption: string) {
  const cleaned = cleanInstagramCaption(caption);
  if (!cleaned) return [] as string[];

  let blocks = cleaned
    .split(/\n\s*\n/g)
    .map((block) => block.trim().replace(/^[•\s-]+|[•\s-]+$/g, ""))
    .filter(Boolean);

  if (blocks.length === 1) {
    blocks = cleaned.split("\n").map((block) => block.trim()).filter(Boolean);
  }

  return blocks
    .map((block) => block.replace(/\s+/g, " ").trim())
    .filter((block) => block.length >= 12);
}

function normalizeCompareText(text: string) {
  return text
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function removeDuplicateLeadTitle(title: string, paragraphs: string[]) {
  if (!paragraphs.length) return paragraphs;
  return normalizeCompareText(paragraphs[0]) === normalizeCompareText(title)
    ? paragraphs.slice(1)
    : paragraphs;
}

function guessCategory(text: string, site: string) {
  const lowered = text.toLowerCase();
  const keywordMap = SITE_CATEGORY_KEYWORDS[site] ?? SITE_CATEGORY_KEYWORDS.winforma;
  const scores = Object.entries(keywordMap).map(([category, keywords]) => ({
    category,
    score: keywords.filter((keyword) => lowered.includes(keyword)).length,
  }));
  scores.sort((a, b) => b.score - a.score);
  return scores[0]?.score ? scores[0].category : (DEFAULT_CATEGORY[site] ?? "Nacional");
}

function makeMetaDescription(paragraphs: string[], maxLen = 120) {
  const base = paragraphs.slice(0, 2).join(" ").replace(/\s+/g, " ").trim();
  if (base.length <= maxLen) return base;
  const clipped = base.slice(0, maxLen).replace(/\s+\S*$/, "").trim();
  return clipped || base.slice(0, maxLen).trim();
}

function makeSeoTitle(title: string, maxLen = 160) {
  const normalized = title.replace(/\s+/g, " ").trim();
  return normalized.length <= maxLen
    ? normalized
    : `${normalized.slice(0, maxLen - 1).trim()}…`;
}

function slugify(text: string) {
  const normalized = text
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\- ]+/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");

  return (normalized.slice(0, 90).replace(/-+$/g, "") || "nota");
}

function buildPostHtml(paragraphs: string[]) {
  const blocks = paragraphs
    .filter(Boolean)
    .map((paragraph) => `<p style='text-align:justify; margin-top: 15px;'>${paragraph.trim()}</p>`)
    .join("");

  return `<div class='winf-body' style='padding-top:30px; font-size:18px; line-height:1.6;'>${blocks}</div>`;
}

async function fetchInstagramMedia(limit: number, token: string) {
  const url = new URL("https://graph.instagram.com/me/media");
  url.searchParams.set("fields", "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp");
  url.searchParams.set("access_token", token);
  url.searchParams.set("limit", String(limit));

  const response = await fetch(url, { method: "GET" });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Instagram API error ${response.status}: ${detail}`);
  }

  const payload = await response.json();
  return (payload.data ?? []) as InstagramMedia[];
}

async function rewriteWithOpenAI(paragraphs: string[], category: string, site: string) {
  const outlet = SITE_AUTHORS[site] ?? site;
  const prompt =
    `Eres editor de ${outlet}. Recibirás el texto completo de una publicación de Instagram y debes convertirlo ` +
    "en una nota periodística más desarrollada. No inventes datos ni agregues hechos no presentes en el texto fuente. " +
    "Devuelve JSON con las claves title, summary y body. El title debe ser un titular periodístico claro y breve. " +
    "El summary debe ser una bajada muy corta, coherente y autosuficiente, escrita en una sola oración, sin puntos suspensivos, " +
    "sin cortar la idea a la mitad y con un máximo aproximado de 110 caracteres. " +
    "El body debe venir en HTML simple con párrafos <p>, con una extensión aproximada de 4 a 6 párrafos cuando el material lo permita. " +
    "Debes desarrollar mejor los antecedentes ya presentes en el caption, ordenar la información y mantener un tono periodístico claro. " +
    `La categoría sugerida es ${category}.\n\nTexto fuente:\n${paragraphs.join("\n\n")}`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.4,
      max_tokens: 900,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: "Eres un editor periodístico riguroso. Respondes solo JSON válido." },
        { role: "user", content: prompt },
      ],
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`OpenAI error ${response.status}: ${detail}`);
  }

  const payload = await response.json();
  const content = payload.choices?.[0]?.message?.content ?? "{}";
  const data = JSON.parse(content);
  const rawSummary = String(data.summary || "").replace(/\s+/g, " ").trim();
  const summary = rawSummary
    ? rawSummary.replace(/\.\.\.+$/g, "").replace(/\s+\.\.\.$/g, "").trim()
    : makeMetaDescription(paragraphs, 110);

  return {
    title: makeSeoTitle(data.title || paragraphs[0] || "Nota de Instagram"),
    summary,
    body: (data.body || "").trim() || buildPostHtml(paragraphs),
  };
}

function guessFileExtension(contentType: string | null, url: string) {
  if (contentType?.includes("png")) return "png";
  if (contentType?.includes("webp")) return "webp";
  if (contentType?.includes("gif")) return "gif";
  if (contentType?.includes("jpeg") || contentType?.includes("jpg")) return "jpg";

  try {
    const pathname = new URL(url).pathname.toLowerCase();
    const match = pathname.match(/\.(jpg|jpeg|png|webp|gif)$/);
    if (match) {
      return match[1] === "jpeg" ? "jpg" : match[1];
    }
  } catch {
    // Ignore invalid URLs and fall back to jpg.
  }

  return "jpg";
}

async function uploadImageToStorage(
  supabase: SupabaseClient,
  remoteImageUrl: string,
  slug: string,
) {
  const response = await fetch(remoteImageUrl);
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Image download failed ${response.status}: ${detail}`);
  }

  const contentType = response.headers.get("content-type");
  const extension = guessFileExtension(contentType, remoteImageUrl);
  const path = `articles/${slug}.${extension}`;
  const blob = await response.blob();

  const { error: uploadError } = await supabase
    .storage
    .from(STORAGE_BUCKET)
    .upload(path, blob, {
      cacheControl: "31536000",
      contentType: contentType ?? `image/${extension}`,
      upsert: true,
    });

  if (uploadError) {
    throw new Error(`Storage upload failed: ${uploadError.message}`);
  }

  const { data } = supabase
    .storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(path);

  return data.publicUrl;
}

Deno.serve(async (req) => {
  try {
    if (!OPENAI_API_KEY || !BASE_URL || !BASE_SERVICE_ROLE_KEY) {
      return json({ error: "Missing required secrets" }, 500);
    }

    const url = new URL(req.url);
    let site = url.searchParams.get("site") || "";
    if (!site && req.method === "POST") {
      try {
        const body = await req.clone().json();
        site = body?.site || "";
      } catch {
        // body vacío o no-JSON, se usa el default
      }
    }
    site = site || "winforma";

    const supabase = createClient(BASE_URL, BASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const currentToken = await getInstagramToken(supabase, site);
    if (!currentToken) {
      return json({ error: `Missing Instagram access token for site "${site}"` }, 500);
    }

    const token = await refreshAndSaveToken(supabase, currentToken, site);

    const mediaItems = await fetchInstagramMedia(INSTAGRAM_FETCH_LIMIT, token);

    for (const media of mediaItems) {
      const permalink = normalizeUrl(media.permalink ?? "");
      if (!permalink) continue;

      const { data: existing } = await supabase
        .from("articles")
        .select("id, slug")
        .eq("source_url", permalink)
        .eq("site", site)
        .maybeSingle();

      if (existing) {
        continue;
      }

      const paragraphs = captionToParagraphs(media.caption ?? "");
      if (paragraphs.join(" ").length < 80) {
        continue;
      }

      const category = guessCategory(paragraphs.join(" "), site);
      const { title, summary, body } = await rewriteWithOpenAI(paragraphs, category, site);
      const finalSummary = summary || makeMetaDescription(removeDuplicateLeadTitle(title, paragraphs), 110);
      const slug = slugify(title || `instagram-${media.id || "post"}`);
      const remoteImageUrl = media.thumbnail_url || media.media_url || "";
      const imageUrl = remoteImageUrl
        ? await uploadImageToStorage(supabase, remoteImageUrl, slug)
        : null;
      const publishedAt = media.timestamp || new Date().toISOString();

      const { data, error } = await supabase
        .from("articles")
        .upsert({
          slug,
          title,
          summary: finalSummary,
          content: body,
          author: SITE_AUTHORS[site] ?? site,
          category,
          image_url: imageUrl,
          source_url: permalink,
          site,
          breaking: false,
          status: "published",
          published_at: publishedAt,
        }, {
          onConflict: "slug",
        })
        .select("id, slug")
        .single();

      if (error) {
        throw error;
      }

      if (!data) {
        throw new Error("Upsert returned no data");
      }

      return json({
        ok: true,
        source: "instagram",
        article: data,
        category,
        skipped: false,
      });
    }

    return json({
      ok: true,
      source: "instagram",
      skipped: true,
      reason: "No new eligible Instagram posts found",
    });
  } catch (error) {
    return json({
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    }, 500);
  }
});
