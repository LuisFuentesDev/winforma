import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let email: string;
  try {
    const body = await req.json();
    email = (body.email ?? "").trim().toLowerCase();
  } catch {
    return new Response(JSON.stringify({ error: "JSON inválido" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (!email || !email.includes("@")) {
    return new Response(JSON.stringify({ error: "Email inválido" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Guardar en Supabase
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const { error: dbError } = await supabase
    .from("subscribers")
    .insert({ email });

  if (dbError) {
    if (dbError.code === "23505") {
      // Ya estaba suscrito — respondemos OK igual para no revelar emails existentes
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    console.error("[newsletter-subscribe] DB error:", dbError.message);
    return new Response(JSON.stringify({ error: "Error al guardar" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Enviar email de bienvenida con Resend
  const resendRes = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "WINFORMA <noticias@winforma.cl>",
      to: [email],
      subject: "Bienvenido a WINFORMA",
      html: `
        <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; color: #1a1a2e;">
          <h1 style="font-size: 28px; font-weight: 900; letter-spacing: -0.5px; margin-bottom: 4px;">WINFORMA</h1>
          <p style="font-size: 12px; color: #666; margin-top: 0; font-family: sans-serif;">Noticias que importan</p>
          <hr style="border: none; border-top: 2px solid #1a1a2e; margin: 16px 0;" />
          <p style="font-size: 16px; line-height: 1.7;">
            Hola, gracias por suscribirte a <strong>WINFORMA</strong>.
          </p>
          <p style="font-size: 16px; line-height: 1.7;">
            A partir de ahora recibirás las noticias más importantes de Chile y La Araucanía
            directamente en tu bandeja de entrada.
          </p>
          <p style="font-size: 16px; line-height: 1.7;">
            Mientras tanto, visita el sitio para estar al día:
          </p>
          <a href="https://winforma.cl"
             style="display: inline-block; margin-top: 8px; background: #1e3a8a; color: #fff;
                    padding: 12px 24px; text-decoration: none; font-family: sans-serif;
                    font-size: 14px; font-weight: 600; border-radius: 2px;">
            Ver últimas noticias
          </a>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0 16px;" />
          <p style="font-size: 11px; color: #999; font-family: sans-serif;">
            Recibiste este mensaje porque te suscribiste en winforma.cl.
          </p>
        </div>
      `,
    }),
  });

  if (!resendRes.ok) {
    const resendError = await resendRes.text();
    console.error("[newsletter-subscribe] Resend error:", resendError);
    // El email se guardó OK, solo falló el envío — no es error crítico
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
