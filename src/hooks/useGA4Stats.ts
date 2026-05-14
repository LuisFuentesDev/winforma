import { useEffect, useState } from "react";

export interface GA4DayRow {
  date: string;       // "20260512"
  sessions: number;
  users: number;
  pageviews: number;
}

export interface GA4Stats {
  configured: boolean;
  rows?: GA4DayRow[];
  error?: string;
}

export function useGA4Stats() {
  const [data, setData] = useState<GA4Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/ga4-stats");
        const json = await res.json() as GA4Stats;
        setData(json);
      } catch {
        setData({ configured: false });
      } finally {
        setLoading(false);
      }
    };
    void fetchStats();
  }, []);

  return { data, loading };
}
