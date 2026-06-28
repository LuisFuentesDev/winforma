import crypto from "crypto";
import { getSiteUrl, getSupabaseWriteKey, supabaseRequest } from "./_lib/supabase.js";

const FLOW_BASE = process.env.FLOW_ENV === "production"
  ? "https://www.flow.cl/api"
  : "https://sandbox.flow.cl/api";

const MIN_AMOUNT = 500;

function flowSign(params, secret) {
  const keys = Object.keys(params).sort();
  const str = keys.map((k) => k + params[k]).join("");
  return crypto.createHmac("sha256", secret).update(str).digest("hex");
}

async function flowRequest(endpoint, params) {
  const apiKey = process.env.FLOW_API_KEY;
  const secret = process.env.FLOW_SECRET_KEY;
  if (!apiKey || !secret) throw new Error("Missing FLOW_API_KEY or FLOW_SECRET_KEY");

  const allParams = { ...params, apiKey };
  allParams.s = flowSign(allParams, secret);

  const body = new URLSearchParams(allParams).toString();
  const res = await fetch(`${FLOW_BASE}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || `Flow error ${res.status}`);
  return json;
}

export default async function handler(request, response) {
  if (request.method === "OPTIONS") { response.status(204).end(); return; }
  if (request.method !== "POST") { response.status(405).json({ error: "Method not allowed" }); return; }

  const body = typeof request.body === "string" ? JSON.parse(request.body || "{}") : request.body || {};
  const amount = Number(body.amount);
  const name = String(body.name || "").trim().slice(0, 100);
  const email = String(body.email || "").trim().slice(0, 200);

  if (!amount || amount < MIN_AMOUNT) {
    response.status(422).json({ error: "El monto mínimo es $500" });
    return;
  }

  const siteUrl = getSiteUrl(request);
  const orderId = `WIN-${Date.now()}`;

  try {
    // Guardar donación en Supabase con status pending
    await supabaseRequest("/rest/v1/donations", {
      method: "POST",
      apiKey: getSupabaseWriteKey(),
      headers: { Prefer: "return=minimal" },
      body: { email: email || null, name: name || null, amount, flow_order: orderId, status: "pending" },
    });

    // Crear pago en Flow
    const flowData = await flowRequest("/payment/create", {
      commerceOrder: orderId,
      subject: "Donación Winforma",
      amount: String(amount),
      email: email || "donante@winforma.cl",
      urlConfirmation: `${siteUrl}/api/flow-webhook`,
      urlReturn: `${siteUrl}/gracias`,
      ...(name ? { name } : {}),
    });

    response.status(200).json({ url: `${flowData.url}?token=${flowData.token}` });
  } catch (err) {
    response.status(500).json({ error: "Error al crear donación", details: String(err.message) });
  }
}
