import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function buildEmailHtml(articles: Article[], dateLabel: string): string {
  const articleRows = articles
    .map(
      (a) => `
      <tr>
        <td style="padding: 16px 0; border-bottom: 1px solid #e5e7eb;">
          <p style="margin: 0 0 4px 0; font-size: 11px; font-weight: 700; text-transform: uppercase;
                     letter-spacing: 0.08em; color: #1e3a8a; font-family: sans-serif;">
            ${a.category}
          </p>
          <a href="https://winforma.cl/articulo/${a.slug}"
             style="font-size: 17px; font-weight: 700; color: #1a1a2e; text-decoration: none;
                    font-family: Georgia, serif; line-height: 1.4; display: block; margin-bottom: 6px;">
            ${a.title}
          </a>
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #6b7280; font-family: sans-serif; line-height: 1.6;">
            ${a.summary}
          </p>
          <a href="https://winforma.cl/articulo/${a.slug}"
             style="font-size: 12px; color: #1e3a8a; font-family: sans-serif; font-weight: 600;">
            Leer más →
          </a>
        </td>
      </tr>
    `
    )
    .join("");

  return `
    <div style="font-family: Georgia, serif; max-width: 580px; margin: 0 auto; color: #1a1a2e; background: #ffffff;">
      <!-- Header -->
      <div style="padding: 24px 0 12px 0; border-bottom: 3px solid #1a1a2e;">
        <h1 style="font-size: 32px; font-weight: 900; letter-spacing: -0.5px; margin: 0 0 2px 0;">
          WINFORMA
        </h1>
        <p style="font-size: 12px; color: #6b7280; margin: 0; font-family: sans-serif;">
          Noticias que importan · ${dateLabel}
        </p>
      </div>

      <!-- Intro -->
      <p style="font-size: 15px; color: #374151; font-family: sans-serif; line-height: 1.6;
                margin: 20px 0 4px 0;">
        Aquí tienes las últimas noticias de Chile y La Araucanía:
      </p>

      <!-- Articles -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 8px;">
        ${articleRows}
      </table>

      <!-- CTA -->
      <div style="text-align: center; margin: 28px 0;">
        <a href="https://winforma.cl"
           style="display: inline-block; background: #1e3a8a; color: #ffffff;
                  padding: 12px 28px; text-decoration: none; font-family: sans-serif;
                  font-size: 14px; font-weight: 600; border-radius: 2px;">
          Ver todas las noticias
        </a>
      </div>

      <!-- Footer -->
      <div style="border-top: 1px solid #e5e7eb; padding-top: 16px; margin-top: 8px;">
        <p style="font-size: 11px; color: #9ca3af; font-family: sans-serif; margin: 0;">
          Recibiste este correo porque te suscribiste en winforma.cl.<br/>
          © 2026 WINFORMA. Todos los derechos reservados.
        </p>
      </div>
    </div>
  `;
}

type Article = {
  slug: string;
  title: string;
  summary: string;
  category: string;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  // Rango: ayer 00:00:00 → ayer 23:59:59 (hora Chile = UTC-3)
  const now = new Date();
  const chileOffset = -3 * 60; // minutos
  const chileNow = new Date(now.getTime() + chileOffset * 60 * 1000);

  const yesterday = new Date(chileNow);
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  const from = new Date(Date.UTC(yesterday.getUTCFullYear(), yesterday.getUTCMonth(), yesterday.getUTCDate(), 3, 0, 0)); // 00:00 Chile = 03:00 UTC
  const to = new Date(Date.UTC(yesterday.getUTCFullYear(), yesterday.getUTCMonth(), yesterday.getUTCDate(), 26, 59, 59)); // 23:59 Chile = 26:59 UTC → siguiente día 02:59 UTC

  // Forma correcta: from = ayer 03:00 UTC, to = hoy 02:59:59 UTC
  const fromISO = new Date(Date.UTC(yesterday.getUTCFullYear(), yesterday.getUTCMonth(), yesterday.getUTCDate(), 3, 0, 0)).toISOString();
  const toISO = new Date(Date.UTC(chileNow.getUTCFullYear(), chileNow.getUTCMonth(), chileNow.getUTCDate(), 2, 59, 59)).toISOString();

  // Buscar artículos publicados ayer
  const { data: articles, error: articlesError } = await supabase
    .from("articles")
    .select("slug, title, summary, category")
    .eq("status", "published")
    .gte("published_at", fromISO)
    .lte("published_at", toISO)
    .order("published_at", { ascending: false });

  if (articlesError) {
    console.error("[newsletter-digest] Error fetching articles:", articlesError.message);
    return new Response(JSON.stringify({ error: "Error al obtener artículos" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (!articles || articles.length === 0) {
    console.log("[newsletter-digest] No hay artículos de ayer, no se envía digest.");
    return new Response(JSON.stringify({ ok: true, sent: 0, reason: "no_articles" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Obtener todos los suscriptores
  const { data: subscribers, error: subsError } = await supabase
    .from("subscribers")
    .select("email");

  if (subsError) {
    console.error("[newsletter-digest] Error fetching subscribers:", subsError.message);
    return new Response(JSON.stringify({ error: "Error al obtener suscriptores" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (!subscribers || subscribers.length === 0) {
    console.log("[newsletter-digest] No hay suscriptores.");
    return new Response(JSON.stringify({ ok: true, sent: 0, reason: "no_subscribers" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const dateLabel = yesterday.toLocaleDateString("es-CL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "America/Santiago",
  });

  const html = buildEmailHtml(articles as Article[], dateLabel);
  const subject = `WINFORMA · Noticias del ${dateLabel}`;
  const toEmails = subscribers.map((s) => s.email);

  // Resend permite hasta 50 destinatarios por llamada — si hay más, enviamos en lotes
  const BATCH_SIZE = 50;
  let totalSent = 0;

  for (let i = 0; i < toEmails.length; i += BATCH_SIZE) {
    const batch = toEmails.slice(i, i + BATCH_SIZE);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "WINFORMA <noticias@winforma.cl>",
        to: batch,
        subject,
        html,
      }),
    });

    clearTimeout(timeout);

    if (!res.ok) {
      const err = await res.text();
      console.error(`[newsletter-digest] Resend error (batch ${i}):`, err);
    } else {
      totalSent += batch.length;
    }
  }

  console.log(`[newsletter-digest] Digest enviado a ${totalSent} suscriptores. Artículos: ${articles.length}`);

  return new Response(JSON.stringify({ ok: true, sent: totalSent, articles: articles.length }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
