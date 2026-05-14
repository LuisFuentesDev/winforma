import { useEffect, useState } from "react";

export interface InstagramMedia {
  id: string;
  caption?: string;
  media_type?: string;
  media_url?: string;
  thumbnail_url?: string;
  timestamp?: string;
  like_count?: number;
  comments_count?: number;
  permalink?: string;
}

export interface InstagramProfile {
  username: string;
  followers: number;
  mediaCount: number;
  picture?: string;
}

export interface InstagramStats {
  configured: boolean;
  profile?: InstagramProfile;
  media?: InstagramMedia[];
  insights?: unknown;
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
