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

    // impressions y reach — period=day, se suman los valores diarios
    const dailyRes = await fetch(
      `https://graph.instagram.com/${profile.id}/insights?metric=impressions,reach&period=day&since=${since}&until=${until}&access_token=${token}`
    );
    const dailyData = await dailyRes.json();

    const dailyTotals = {};
    if (!dailyData.error && dailyData.data) {
      for (const metric of dailyData.data) {
        const values = metric.values ?? [];
        dailyTotals[metric.name] = values.reduce((s, v) => s + Number(v.value ?? 0), 0);
      }
    }

    // profile_views y website_clicks — period=month
    const monthlyRes = await fetch(
      `https://graph.instagram.com/${profile.id}/insights?metric=profile_views,website_clicks&period=month&since=${since}&until=${until}&access_token=${token}`
    );
    const monthlyData = await monthlyRes.json();

    const monthlyTotals = {};
    if (!monthlyData.error && monthlyData.data) {
      for (const metric of monthlyData.data) {
        const values = metric.values ?? [];
        monthlyTotals[metric.name] = values.reduce((s, v) => s + Number(v.value ?? 0), 0);
      }
    }

    // Saves — suma de los últimos 20 posts
    const mediaRes = await fetch(
      `https://graph.instagram.com/me/media?fields=id&limit=20&access_token=${token}`
    );
    const mediaData = await mediaRes.json();
    const mediaIds = (mediaData.data ?? []).map((m) => m.id);

    let totalSaves = 0;
    for (const mediaId of mediaIds) {
      const saveRes = await fetch(
        `https://graph.instagram.com/${mediaId}/insights?metric=saved&access_token=${token}`
      );
      const saveData = await saveRes.json();
      if (!saveData.error && saveData.data?.[0]) {
        const metric = saveData.data[0];
        if (Array.isArray(metric.values)) {
          totalSaves += metric.values.reduce((s, v) => s + Number(v.value ?? 0), 0);
        } else if (metric.value !== undefined) {
          totalSaves += Number(metric.value);
        }
      }
    }

    // Debug — incluir raw para diagnóstico
    return res.status(200).json({
      configured: true,
      profile: {
        username: profile.username,
        followers: profile.followers_count,
        mediaCount: profile.media_count,
      },
      insights: {
        impressions: dailyTotals.impressions ?? 0,
        reach: dailyTotals.reach ?? 0,
        profileViews: monthlyTotals.profile_views ?? 0,
        websiteClicks: monthlyTotals.website_clicks ?? 0,
        saves: totalSaves,
      },
      _debug: {
        dailyRaw: dailyData.error ?? dailyTotals,
        monthlyRaw: monthlyData.error ?? monthlyTotals,
      },
    });
  } catch (err) {
    return res.status(200).json({ configured: true, error: err.message });
  }
}
