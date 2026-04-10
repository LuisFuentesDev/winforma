import { getSiteUrl, supabaseRequest } from "./_lib/supabase.js";

const staticPaths = ["/", "/seccion/Regional", "/seccion/Nacional", "/seccion/Internacional", "/seccion/Deportes", "/seccion/Editorial", "/politica-de-privacidad", "/tarifario"];

function formatLastmod(value) {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

export default async function handler(request, response) {
  try {
    const query = new URLSearchParams({
      select: "slug,published_at,updated_at",
      status: "eq.published",
      order: "published_at.desc",
    });

    const result = await supabaseRequest(`/rest/v1/articles?${query.toString()}`);

    if (result.status < 200 || result.status >= 300 || !Array.isArray(result.json)) {
      throw new Error(`Supabase sitemap lookup failed with status ${result.status}`);
    }

    const siteUrl = getSiteUrl(request);
    const urls = [
      ...staticPaths.map((path) => ({ loc: `${siteUrl}${path}`, lastmod: null })),
      ...result.json.map((article) => ({
        loc: `${siteUrl}/articulo/${article.slug}`,
        lastmod: formatLastmod(article.updated_at || article.published_at),
      })),
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>${url.lastmod ? `\n    <lastmod>${url.lastmod}</lastmod>` : ""}
  </url>`,
  )
  .join("\n")}
</urlset>`;

    response.setHeader("Content-Type", "application/xml; charset=utf-8");
    response.status(200).send(xml);
  } catch (error) {
    response.status(500).send(`Sitemap failed: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}
