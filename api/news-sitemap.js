import { getSiteUrl, supabaseRequest, escapeHtml } from "./_lib/supabase.js";

// Google News only indexes articles published in the last 2 days
const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000;

export default async function handler(request, response) {
  try {
    const query = new URLSearchParams({
      select: "slug,title,category,published_at",
      status: "eq.published",
      order: "published_at.desc",
      limit: "1000",
    });

    const result = await supabaseRequest(`/rest/v1/articles?${query.toString()}`);

    if (result.status < 200 || result.status >= 300 || !Array.isArray(result.json)) {
      throw new Error(`Supabase news sitemap lookup failed with status ${result.status}`);
    }

    const siteUrl = getSiteUrl(request);
    const cutoff = Date.now() - TWO_DAYS_MS;

    const recentArticles = result.json.filter((article) => {
      const published = new Date(article.published_at).getTime();
      return !isNaN(published) && published >= cutoff;
    });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${recentArticles
  .map((article) => {
    const pubDate = new Date(article.published_at).toISOString();
    return `  <url>
    <loc>${escapeHtml(`${siteUrl}/articulo/${article.slug}`)}</loc>
    <news:news>
      <news:publication>
        <news:name>WINFORMA</news:name>
        <news:language>es</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title>${escapeHtml(article.title)}</news:title>
    </news:news>
  </url>`;
  })
  .join("\n")}
</urlset>`;

    response.setHeader("Content-Type", "application/xml; charset=utf-8");
    response.setHeader("Cache-Control", "public, max-age=300");
    response.status(200).send(xml);
  } catch (error) {
    response.status(500).send(`News sitemap failed: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}
