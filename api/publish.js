import { getSiteUrl, getSupabaseWriteKey, supabaseRequest } from "./_lib/supabase.js";

const requiredFields = [
  "slug",
  "title",
  "summary",
  "content",
  "author",
  "category",
  "status",
  "published_at",
];

export default async function handler(request, response) {
  if (request.method === "OPTIONS") {
    response.status(204).end();
    return;
  }

  if (request.method !== "POST") {
    response.status(405).json({ error: "Method not allowed" });
    return;
  }

  const authHeader = request.headers.authorization || "";
  const bearerToken = authHeader.toLowerCase().startsWith("bearer ")
    ? authHeader.slice(7).trim()
    : "";
  const token = bearerToken || request.headers["x-api-token"] || request.body?.token || "";

  if (!process.env.PUBLISH_API_TOKEN || token !== process.env.PUBLISH_API_TOKEN) {
    response.status(401).json({ error: "Unauthorized" });
    return;
  }

  const payload = typeof request.body === "string" ? JSON.parse(request.body || "{}") : request.body || {};

  if (payload.content_b64) {
    payload.content = Buffer.from(String(payload.content_b64), "base64").toString("utf-8");
  }

  if (payload.summary_b64) {
    payload.summary = Buffer.from(String(payload.summary_b64), "base64").toString("utf-8");
  }

  for (const field of requiredFields) {
    if (!payload[field] || String(payload[field]).trim() === "") {
      response.status(422).json({ error: `Missing required field: ${field}` });
      return;
    }
  }

  const upsertPayload = [
    {
      slug: payload.slug,
      title: payload.title,
      summary: payload.summary,
      content: payload.content,
      author: payload.author,
      category: payload.category,
      image_url: payload.image_url || null,
      source_url: payload.source_url || null,
      breaking: Boolean(payload.breaking),
      status: payload.status,
      published_at: payload.published_at,
      updated_at: new Date().toISOString(),
    },
  ];

  try {
    const result = await supabaseRequest("/rest/v1/articles?on_conflict=slug", {
      method: "POST",
      apiKey: getSupabaseWriteKey(),
      headers: {
        Prefer: "resolution=merge-duplicates,return=representation",
      },
      body: upsertPayload,
    });

    if (result.status < 200 || result.status >= 300 || !Array.isArray(result.json) || !result.json[0]) {
      throw new Error(`Supabase publish failed with status ${result.status}`);
    }

    const article = result.json[0];
    response.status(200).json({
      ok: true,
      id: article.id || null,
      slug: article.slug || payload.slug,
      url: `${getSiteUrl(request)}/articulo/${article.slug || payload.slug}`,
    });
  } catch (error) {
    response.status(500).json({
      error: "Publish failed",
      details: process.env.API_DEBUG === "true" ? String(error instanceof Error ? error.message : error) : null,
    });
  }
}
