const requiredEnv = (name) => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing ${name}`);
  }
  return value;
};

export const getSupabaseUrl = () => requiredEnv("SUPABASE_URL").replace(/\/$/, "");

export const getSupabasePublishableKey = () => requiredEnv("SUPABASE_PUBLISHABLE_KEY");

export const getSupabaseWriteKey = () =>
  process.env.SUPABASE_SERVICE_ROLE_KEY || getSupabasePublishableKey();

export const getSiteUrl = (request) => {
  if (process.env.SITE_URL) {
    return process.env.SITE_URL.replace(/\/$/, "");
  }

  const proto = request.headers["x-forwarded-proto"] || "https";
  const host = request.headers.host || "winforma.cl";
  return `${proto}://${host}`;
};

export async function supabaseRequest(path, options = {}) {
  const response = await fetch(`${getSupabaseUrl()}${path}`, {
    method: options.method || "GET",
    headers: {
      apikey: options.apiKey || getSupabasePublishableKey(),
      Authorization: `Bearer ${options.apiKey || getSupabasePublishableKey()}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const text = await response.text();

  return {
    status: response.status,
    text,
    json: text ? safeJsonParse(text) : null,
  };
}

function safeJsonParse(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export function escapeHtml(value = "") {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function buildShareHtml({ title, description, imageUrl, destinationUrl }) {
  const safeTitle = escapeHtml(title || "WINFORMA");
  const safeDescription = escapeHtml(description || "Noticias de WINFORMA");
  const safeImage = escapeHtml(imageUrl || "");
  const safeDestination = escapeHtml(destinationUrl);

  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <title>${safeTitle}</title>
    <meta name="description" content="${safeDescription}" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content="${safeTitle}" />
    <meta property="og:description" content="${safeDescription}" />
    <meta property="og:url" content="${safeDestination}" />
    ${safeImage ? `<meta property="og:image" content="${safeImage}" />` : ""}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${safeTitle}" />
    <meta name="twitter:description" content="${safeDescription}" />
    ${safeImage ? `<meta name="twitter:image" content="${safeImage}" />` : ""}
    <link rel="canonical" href="${safeDestination}" />
    <meta http-equiv="refresh" content="0;url=${safeDestination}" />
  </head>
  <body>
    <p>Redirigiendo a <a href="${safeDestination}">${safeDestination}</a>...</p>
    <script>window.location.replace(${JSON.stringify(destinationUrl)});</script>
  </body>
</html>`;
}
