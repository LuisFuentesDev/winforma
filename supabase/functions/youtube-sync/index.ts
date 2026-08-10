import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

const BASE_URL = Deno.env.get("BASE_URL") ?? "";
const BASE_SERVICE_ROLE_KEY = Deno.env.get("BASE_SERVICE_ROLE_KEY") ?? "";

// Categorías por sitio, igual patrón que instagram-sync/index.ts. Los programas
// con nombre propio ("Caseta Femenina", "Ágora", etc.) se detectan primero por
// el propio título; el resto cae a keywords generales.
const NAMED_PROGRAMS: Record<string, Array<{ match: string; category: string }>> = {
  abajolalinea: [
    { match: "caseta", category: "Caseta Femenina" },
    { match: "ágora", category: "Ágora" },
    { match: "agora", category: "Ágora" },
    { match: "cine club", category: "Cine Club" },
    { match: "desde el pueblo", category: "Desde el Pueblo" },
  ],
};

const FALLBACK_KEYWORDS: Record<string, Record<string, string[]>> = {
  abajolalinea: {
    Deportes: [
      "fútbol", "liga femenina", "deportes temuco", "partido", "gol", "cancha",
      "estadio", "torneo", "campeonato", "selección chilena", "mundial",
    ],
    Cultura: [
      "cultural", "mapuche", "wallmapu", "memoria", "tradición", "taller",
      "festival", "danza", "música", "cine", "arte", "patrimonio",
    ],
    Comunidad: [
      "junta de vecinos", "agrupación", "organización social", "movimiento social",
      "seguridad", "barrio", "vecinos", "municipalidad", "estudiantes", "derechos humanos",
    ],
  },
};

const DEFAULT_CATEGORY: Record<string, string> = {
  abajolalinea: "Comunidad",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

async function getChannelId(supabase: SupabaseClient, site: string): Promise<string> {
  const { data } = await supabase
    .from("config")
    .select("value")
    .eq("key", `youtube_channel_id:${site}`)
    .maybeSingle();
  return data?.value || "";
}

type FeedEntry = { videoId: string; title: string; published: string };

function parseFeed(xml: string): FeedEntry[] {
  const entries: FeedEntry[] = [];
  const blocks = xml.split("<entry>").slice(1);
  for (const block of blocks) {
    const videoId = block.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1];
    const title = block.match(/<title>([^<]*)<\/title>/)?.[1];
    const published = block.match(/<published>([^<]+)<\/published>/)?.[1];
    if (videoId && title && published) {
      entries.push({ videoId, title: decodeXmlEntities(title), published });
    }
  }
  return entries;
}

function decodeXmlEntities(text: string) {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function guessCategory(title: string, site: string) {
  const lowered = title.toLowerCase();
  for (const named of NAMED_PROGRAMS[site] ?? []) {
    if (lowered.includes(named.match)) return named.category;
  }
  const keywordMap = FALLBACK_KEYWORDS[site] ?? {};
  const scores = Object.entries(keywordMap).map(([category, keywords]) => ({
    category,
    score: keywords.filter((keyword) => lowered.includes(keyword)).length,
  }));
  scores.sort((a, b) => b.score - a.score);
  return scores[0]?.score ? scores[0].category : (DEFAULT_CATEGORY[site] ?? "Comunidad");
}

Deno.serve(async (req) => {
  try {
    if (!BASE_URL || !BASE_SERVICE_ROLE_KEY) {
      return json({ error: "Missing required secrets" }, 500);
    }

    const url = new URL(req.url);
    const site = url.searchParams.get("site") || "abajolalinea";

    const supabase = createClient(BASE_URL, BASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const channelId = await getChannelId(supabase, site);
    if (!channelId) {
      return json({ error: `Missing youtube_channel_id for site "${site}"` }, 500);
    }

    const feedResponse = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`,
    );
    if (!feedResponse.ok) {
      throw new Error(`YouTube feed error ${feedResponse.status}`);
    }
    const entries = parseFeed(await feedResponse.text());

    let inserted = 0;
    const skippedExisting: string[] = [];

    for (const entry of entries) {
      const youtubeUrl = `https://www.youtube.com/watch?v=${entry.videoId}`;

      const { data: existing } = await supabase
        .from("programs")
        .select("id")
        .eq("site", site)
        .eq("youtube_url", youtubeUrl)
        .maybeSingle();

      if (existing) {
        skippedExisting.push(entry.videoId);
        continue;
      }

      const category = guessCategory(entry.title, site);

      const { error } = await supabase.from("programs").insert({
        site,
        title: entry.title,
        youtube_url: youtubeUrl,
        category,
        status: "published",
        published_at: entry.published,
      });

      if (error) throw error;
      inserted++;
    }

    return json({
      ok: true,
      site,
      checked: entries.length,
      inserted,
      alreadyExisted: skippedExisting.length,
    });
  } catch (error) {
    return json({
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    }, 500);
  }
});
