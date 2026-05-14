export default async function handler(req, res) {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;

  if (!token) {
    return res.status(200).json({ configured: false });
  }

  console.log("INSTAGRAM_ACCESS_TOKEN:", token);

  try {
    // Perfil básico
    const profileRes = await fetch(
      `https://graph.instagram.com/me?fields=id,username,followers_count,media_count&access_token=${token}`
    );
    const profile = await profileRes.json();

    if (profile.error) {
      return res.status(200).json({ configured: true, error: profile.error.message });
    }

    const since = Math.floor(Date.now() / 1000) - 28 * 86400;
    const until = Math.floor(Date.now() / 1000);

    // profile_views y website_clicks — period=day (más compatible que month)
    const accountRes = await fetch(
      `https://graph.instagram.com/${profile.id}/insights?metric=profile_views,website_clicks&period=day&since=${since}&until=${until}&access_token=${token}`
    );
    const accountData = await accountRes.json();

    const accountTotals = {};
    if (!accountData.error && accountData.data) {
      for (const metric of accountData.data) {
        const values = metric.values ?? [];
        accountTotals[metric.name] = values.reduce((s, v) => s + Number(v.value ?? 0), 0);
      }
    }

    // Últimos 20 posts — impressions, reach y saves por post
    const mediaRes = await fetch(
      `https://graph.instagram.com/me/media?fields=id,timestamp&limit=20&access_token=${token}`
    );
    const mediaData = await mediaRes.json();
    const mediaItems = mediaData.data ?? [];

    let totalImpressions = 0;
    let totalReach = 0;
    let totalSaves = 0;
    let totalLikes = 0;
    let totalComments = 0;

    for (const media of mediaItems) {
      const insRes = await fetch(
        `https://graph.instagram.com/${media.id}/insights?metric=impressions,reach,saved,likes,comments&access_token=${token}`
      );
      const insData = await insRes.json();

      if (!insData.error && insData.data) {
        for (const m of insData.data) {
          const val = Array.isArray(m.values)
            ? m.values.reduce((s, v) => s + Number(v.value ?? 0), 0)
            : Number(m.value ?? 0);

          if (m.name === "impressions") totalImpressions += val;
          else if (m.name === "reach") totalReach += val;
          else if (m.name === "saved") totalSaves += val;
          else if (m.name === "likes") totalLikes += val;
          else if (m.name === "comments") totalComments += val;
        }
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
        impressions: totalImpressions,
        reach: totalReach,
        profileViews: accountTotals.profile_views ?? 0,
        websiteClicks: accountTotals.website_clicks ?? 0,
        saves: totalSaves,
        likes: totalLikes,
        comments: totalComments,
      },
      _debug: {
        accountRaw: accountData.error ?? accountTotals,
        postsAnalyzed: mediaItems.length,
      },
    });
  } catch (err) {
    return res.status(200).json({ configured: true, error: err.message });
  }
}
