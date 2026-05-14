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

    // Métricas de cuenta — period=day sin since/until (últimos días disponibles)
    const accountRes = await fetch(
      `https://graph.instagram.com/${profile.id}/insights?metric=reach,profile_views,website_clicks,accounts_engaged,total_interactions,follows_and_unfollows&period=day&access_token=${token}`
    );
    const accountData = await accountRes.json();

    const accountTotals = {};
    if (!accountData.error && accountData.data) {
      for (const metric of accountData.data) {
        const values = metric.values ?? [];
        accountTotals[metric.name] = values.reduce((s, v) => s + Number(v.value ?? 0), 0);
      }
    }

    // Últimos 20 posts — reach, saves, likes, comments, shares por post
    const mediaRes = await fetch(
      `https://graph.instagram.com/me/media?fields=id,media_type&limit=20&access_token=${token}`
    );
    const mediaData = await mediaRes.json();
    const mediaItems = mediaData.data ?? [];

    let totalReach = 0;
    let totalSaves = 0;
    let totalLikes = 0;
    let totalComments = 0;
    let totalShares = 0;
    let totalViews = 0;

    for (const media of mediaItems) {
      // Reels usan "views", el resto usa "reach"
      const metrics = media.media_type === "VIDEO"
        ? "views,saved,likes,comments,shares"
        : "reach,saved,likes,comments,shares";

      const insRes = await fetch(
        `https://graph.instagram.com/${media.id}/insights?metric=${metrics}&access_token=${token}`
      );
      const insData = await insRes.json();

      if (!insData.error && insData.data) {
        for (const m of insData.data) {
          const val = Array.isArray(m.values)
            ? m.values.reduce((s, v) => s + Number(v.value ?? 0), 0)
            : Number(m.value ?? 0);

          if (m.name === "reach") totalReach += val;
          else if (m.name === "views") totalViews += val;
          else if (m.name === "saved") totalSaves += val;
          else if (m.name === "likes") totalLikes += val;
          else if (m.name === "comments") totalComments += val;
          else if (m.name === "shares") totalShares += val;
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
        reach: totalReach,
        views: totalViews,
        profileViews: accountTotals.profile_views ?? 0,
        websiteClicks: accountTotals.website_clicks ?? 0,
        accountsEngaged: accountTotals.accounts_engaged ?? 0,
        totalInteractions: accountTotals.total_interactions ?? 0,
        followsUnfollows: accountTotals.follows_and_unfollows ?? 0,
        saves: totalSaves,
        likes: totalLikes,
        comments: totalComments,
        shares: totalShares,
      },
    });
  } catch (err) {
    return res.status(200).json({ configured: true, error: err.message });
  }
}
