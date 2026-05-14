export default async function handler(req, res) {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;

  if (!token) {
    return res.status(200).json({ configured: false });
  }

  try {
    // Perfil básico
    const profileRes = await fetch(
      `https://graph.instagram.com/me?fields=id,username,followers_count,media_count&access_token=${token}`
    );
    const profile = await profileRes.json();

    if (profile.error) {
      return res.status(200).json({ configured: true, error: profile.error.message });
    }

    const since = Math.floor(Date.now() / 1000) - 30 * 86400;
    const until = Math.floor(Date.now() / 1000);

    // Insights del perfil — últimos 30 días
    const insightsRes = await fetch(
      `https://graph.instagram.com/${profile.id}/insights?metric=impressions,reach,profile_views,website_clicks&period=day&since=${since}&until=${until}&access_token=${token}`
    );
    const insightsData = await insightsRes.json();

    // Agrupa métricas por nombre y suma los valores diarios
    const totals = {};
    if (!insightsData.error && insightsData.data) {
      for (const metric of insightsData.data) {
        const sum = (metric.values ?? []).reduce((s, v) => s + (v.value ?? 0), 0);
        totals[metric.name] = sum;
      }
    }

    // Saves — se obtienen por post, sumamos los últimos 20
    const mediaRes = await fetch(
      `https://graph.instagram.com/me/media?fields=id&limit=20&access_token=${token}`
    );
    const mediaData = await mediaRes.json();
    const mediaIds = (mediaData.data ?? []).map((m) => m.id);

    let totalSaves = 0;
    for (const mediaId of mediaIds.slice(0, 20)) {
      const saveRes = await fetch(
        `https://graph.instagram.com/${mediaId}/insights?metric=saved&access_token=${token}`
      );
      const saveData = await saveRes.json();
      if (!saveData.error && saveData.data?.[0]?.values) {
        totalSaves += saveData.data[0].values.reduce((s, v) => s + (v.value ?? 0), 0);
      } else if (!saveData.error && saveData.data?.[0]?.value !== undefined) {
        totalSaves += saveData.data[0].value;
      }
    }

    return res.status(200).json({
      configured: true,
      profile: {
        username: profile.username,
        followers: profile.followers_count,
        mediaCount: profile.media_count,
      },
      insights: {
        impressions: totals.impressions ?? 0,
        reach: totals.reach ?? 0,
        profileViews: totals.profile_views ?? 0,
        websiteClicks: totals.website_clicks ?? 0,
        saves: totalSaves,
      },
    });
  } catch (err) {
    return res.status(200).json({ configured: true, error: err.message });
  }
}
