import { useEffect, useState } from "react";

export interface GA4GeoRow {
  name: string;
  users: number;
  sessions: number;
}

export interface GA4Geo {
  configured: boolean;
  cities?: GA4GeoRow[];
  regions?: GA4GeoRow[];
  error?: string;
}

export function useGA4Geo() {
  const [data, setData] = useState<GA4Geo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGeo = async () => {
      try {
        const res = await fetch("/api/ga4-stats?type=geo");
        const json = await res.json() as GA4Geo;
        setData(json);
      } catch {
        setData({ configured: false });
      } finally {
        setLoading(false);
      }
    };
    void fetchGeo();
  }, []);

  return { data, loading };
}
