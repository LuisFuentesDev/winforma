import { useEffect, useState } from "react";

export interface InstagramInsights {
  weeklyReach: number;
  reach: number;
  views: number;
  saves: number;
  likes: number;
  comments: number;
  shares: number;
}

export interface InstagramProfile {
  username: string;
  followers: number;
  mediaCount: number;
}

export interface InstagramStats {
  configured: boolean;
  profile?: InstagramProfile;
  insights?: InstagramInsights;
  error?: string;
}

export function useInstagramStats() {
  const [data, setData] = useState<InstagramStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const res = await fetch("/api/instagram-stats");
        const json = await res.json() as InstagramStats;
        setData(json);
      } catch {
        setData({ configured: false });
      } finally {
        setLoading(false);
      }
    };
    void fetch_();
  }, []);

  return { data, loading };
}
