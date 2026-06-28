import crypto from "crypto";
import { getSupabaseWriteKey, supabaseRequest } from "./_lib/supabase.js";

const FLOW_BASE = process.env.FLOW_ENV === "production"
  ? "https://www.flow.cl/api"
  : "https://sandbox.flow.cl/api";

function flowSign(params, secret) {
  const keys = Object.keys(params).sort();
  const str = keys.map((k) => k + params[k]).join("");
  return crypto.createHmac("sha256", secret).update(str).digest("hex");
}

async function getPaymentStatus(token) {
  const apiKey = process.env.FLOW_API_KEY;
  const secret = process.env.FLOW_SECRET_KEY;
  const params = { apiKey, token };
  params.s = flowSign(params, secret);
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${FLOW_BASE}/payment/getStatus?${qs}`);
  return res.json();
}

export default async function handler(request, response) {
  if (request.method !== "POST") { response.status(405).end(); return; }

  const body = typeof request.body === "string"
    ? Object.fromEntries(new URLSearchParams(request.body))
    : request.body || {};

  const token = body.token;
  if (!token) { response.status(400).json({ error: "Missing token" }); return; }

  try {
    const payment = await getPaymentStatus(token);

    // status 2 = pagado en Flow
    const status = payment.status === 2 ? "paid" : "rejected";

    await supabaseRequest(
      `/rest/v1/donations?flow_order=eq.${encodeURIComponent(payment.commerceOrder)}`,
      {
        method: "PATCH",
        apiKey: getSupabaseWriteKey(),
        headers: { Prefer: "return=minimal" },
        body: { status, flow_payment_id: String(payment.flowOrder || "") },
      }
    );

    response.status(200).json({ ok: true });
  } catch (err) {
    response.status(500).json({ error: String(err.message) });
  }
}
