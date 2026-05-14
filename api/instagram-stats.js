export default async function handler(_req, res) {
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

    // Alcance semanal de la cuenta
    const accountRes = await fetch(
      `https://graph.instagram.com/${profile.id}/insights?metric=reach&period=week&access_token=${token}`
    );
    const accountData = await accountRes.json();

    let weeklyReach = 0;
    if (!accountData.error && accountData.data?.[0]?.values) {
      const values = accountData.data[0].values;
      // Tomar el valor más reciente
      weeklyReach = Number(values[values.length - 1]?.value ?? 0);
    }

    // Últimos 20 posts — reach/views, saves, likes, comments, shares
    const mediaRes = await fetch(
      `https://graph.instagram.com/me/media?fields=id,media_type&limit=20&access_token=${token}`
    );
    const mediaData = await mediaRes.json();
    const mediaItems = mediaData.data ?? [];

    let totalReach = 0;
    let totalViews = 0;
    let totalSaves = 0;
    let totalLikes = 0;
    let totalComments = 0;
    let totalShares = 0;

    for (const media of mediaItems) {
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
        weeklyReach,
        reach: totalReach,
        views: totalViews,
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
