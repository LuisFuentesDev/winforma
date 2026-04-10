import { buildShareHtml, getSiteUrl, supabaseRequest } from "./_lib/supabase.js";

export default async function handler(request, response) {
  const slug = String(request.query.slug || "").trim();

  if (!slug) {
    response.status(400).send("Missing slug");
    return;
  }

  try {
    const query = new URLSearchParams({
      select: "slug,title,summary,image_url,status",
      slug: `eq.${slug}`,
      status: "eq.published",
      limit: "1",
    });

    const result = await supabaseRequest(`/rest/v1/articles?${query.toString()}`);

    if (result.status < 200 || result.status >= 300 || !Array.isArray(result.json) || !result.json[0]) {
      response.status(404).send("Not found");
      return;
    }

    const article = result.json[0];
    const destinationUrl = `${getSiteUrl(request)}/articulo/${article.slug}`;

    response.setHeader("Content-Type", "text/html; charset=utf-8");
    response.status(200).send(
      buildShareHtml({
        title: article.title,
        description: article.summary,
        imageUrl: article.image_url,
        destinationUrl,
      }),
    );
  } catch (error) {
    response.status(500).send(`Share failed: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}
