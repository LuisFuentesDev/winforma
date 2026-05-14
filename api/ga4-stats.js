import crypto from "crypto";

function base64url(str) {
  return Buffer.from(str)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function getAccessToken(clientEmail, privateKey) {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = base64url(
    JSON.stringify({
      iss: clientEmail,
      scope: "https://www.googleapis.com/auth/analytics.readonly",
      aud: "https://oauth2.googleapis.com/token",
      exp: now + 3600,
      iat: now,
    })
  );

  const sign = crypto.createSign("RSA-SHA256");
  sign.update(`${header}.${payload}`);
  const signature = sign
    .sign(privateKey, "base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  const jwt = `${header}.${payload}.${signature}`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  const data = await res.json();
  if (!data.access_token) {
    throw new Error(`Token error: ${JSON.stringify(data)}`);
  }
  return data.access_token;
}

export default async function handler(req, res) {
  const propertyId = process.env.GA4_PROPERTY_ID;
  const clientEmail = process.env.GA4_CLIENT_EMAIL;
  const privateKey = (process.env.GA4_PRIVATE_KEY || "").replace(/\\n/g, "\n");

  if (!propertyId || !clientEmail || !privateKey) {
    return res.status(200).json({ configured: false });
  }

  const monthly = req.query?.period === "monthly";

  try {
    const accessToken = await getAccessToken(clientEmail, privateKey);

    const gaRes = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dimensions: [{ name: monthly ? "yearMonth" : "date" }],
          metrics: [
            { name: "sessions" },
            { name: "activeUsers" },
            { name: "screenPageViews" },
          ],
          dateRanges: [{ startDate: monthly ? "365daysAgo" : "30daysAgo", endDate: "today" }],
          orderBys: [{ dimension: { dimensionName: monthly ? "yearMonth" : "date" }, desc: false }],
        }),
      }
    );

    const gaData = await gaRes.json();

    if (gaData.error) {
      return res.status(200).json({ configured: true, error: gaData.error.message });
    }

    const rows = (gaData.rows || []).map((row) => ({
      date: row.dimensionValues[0].value,
      sessions: Number(row.metricValues[0].value),
      users: Number(row.metricValues[1].value),
      pageviews: Number(row.metricValues[2].value),
    }));

    return res.status(200).json({ configured: true, rows, period: monthly ? "monthly" : "daily" });
  } catch (err) {
    return res.status(200).json({ configured: true, error: err.message });
  }
}
