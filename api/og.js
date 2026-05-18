const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const SITE_URL = "https://www.winforma.cl";

const BOT_AGENTS = [
  "facebookexternalhit", "twitterbot", "whatsapp", "linkedinbot",
  "telegrambot", "slackbot", "discordbot", "googlebot", "bingbot",
  "applebot", "pinterest", "embedly", "outbrain", "quora",
  "vkshare", "rogerbot", "msnbot", "iframely",
];

export default async function handler(req, res) {
  const slug = req.query?.slug;
  if (!slug) return res.redirect(302, "/");

  const ua = (req.headers["user-agent"] || "").toLowerCase();
  const isBot = BOT_AGENTS.some((b) => ua.includes(b));

  // Si no es bot, redirigir al artículo normalmente
  if (!isBot) {
    return res.redirect(302, `/articulo/${slug}`);
  }

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return res.redirect(302, `/articulo/${slug}`);
  }

  try {
    const apiRes = await fetch(
      `${SUPABASE_URL}/rest/v1/articles?slug=eq.${encodeURIComponent(slug)}&select=title,summary,image_url,author,category,published_at&limit=1`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
    );
    const rows = await apiRes.json();
    const article = rows?.[0];

    if (!article) return res.redirect(302, `/articulo/${slug}`);

    const title = `${article.title} | WINFORMA`;
    const description = article.summary || "Noticias regionales, nacionales e internacionales desde La Araucanía.";
    const image = article.image_url?.startsWith("http")
      ? article.image_url
      : `${SITE_URL}${article.image_url}`;
    const url = `${SITE_URL}/articulo/${slug}`;

    const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}" />

  <!-- Open Graph -->
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="WINFORMA" />
  <meta property="og:locale" content="es_CL" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:image" content="${esc(image)}" />
  <meta property="og:image:secure_url" content="${esc(image)}" />
  <meta property="og:image:type" content="image/jpeg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="${esc(article.title)}" />
  <meta property="og:url" content="${esc(url)}" />
  <meta property="article:author" content="${esc(article.author || "WINFORMA")}" />
  <meta property="article:section" content="${esc(article.category || "")}" />
  <meta property="article:published_time" content="${article.published_at || ""}" />

  <!-- Twitter / X Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@winforma_cl" />
  <meta name="twitter:title" content="${esc(title)}" />
  <meta name="twitter:description" content="${esc(description)}" />
  <meta name="twitter:image" content="${esc(image)}" />
  <meta name="twitter:image:alt" content="${esc(article.title)}" />
</head>
<body>
  <a href="${esc(url)}">${esc(title)}</a>
</body>
</html>`;

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=86400");
    return res.status(200).send(html);
  } catch {
    return res.redirect(302, `/articulo/${slug}`);
  }
}

function esc(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
