export default async function handler(req, res) {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;

  if (!token) {
    return res.status(200).json({ configured: false });
  }

  try {
    // Perfil básico
    const profileRes = await fetch(
      `https://graph.instagram.com/me?fields=id,username,followers_count,media_count,profile_picture_url&access_token=${token}`
    );
    const profile = await profileRes.json();

    if (profile.error) {
      return res.status(200).json({ configured: true, error: profile.error.message });
    }

    // Últimos 12 posts con métricas
    const mediaRes = await fetch(
      `https://graph.instagram.com/me/media?fields=id,caption,media_type,thumbnail_url,media_url,timestamp,like_count,comments_count,permalink&limit=12&access_token=${token}`
    );
    const mediaData = await mediaRes.json();
    const media = mediaData.data ?? [];

    // Insights del perfil (últimos 30 días) — requiere permisos de insights
    let insights = null;
    const insightsRes = await fetch(
      `https://graph.instagram.com/me/insights?metric=impressions,reach,profile_views&period=day&since=${Math.floor(Date.now() / 1000) - 30 * 86400}&until=${Math.floor(Date.now() / 1000)}&access_token=${token}`
    );
    const insightsData = await insightsRes.json();
    if (!insightsData.error) {
      insights = insightsData.data ?? null;
    }

    return res.status(200).json({
      configured: true,
      profile: {
        username: profile.username,
        followers: profile.followers_count,
        mediaCount: profile.media_count,
        picture: profile.profile_picture_url,
      },
      media,
      insights,
    });
  } catch (err) {
    return res.status(200).json({ configured: true, error: err.message });
  }
}
