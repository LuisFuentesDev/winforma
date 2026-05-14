import { useEffect, useState } from "react";

export interface GA4DayRow {
  date: string;       // "20260512" (daily) or "202605" (monthly)
  sessions: number;
  users: number;
  pageviews: number;
}

export interface GA4Stats {
  configured: boolean;
  rows?: GA4DayRow[];
  period?: "daily" | "monthly";
  error?: string;
}

export function useGA4Stats(period: "daily" | "monthly" = "daily") {
  const [data, setData] = useState<GA4Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setData(null);
    const fetchStats = async () => {
      try {
        const url = period === "monthly" ? "/api/ga4-stats?period=monthly" : "/api/ga4-stats";
        const res = await fetch(url);
        const json = await res.json() as GA4Stats;
        setData(json);
      } catch {
        setData({ configured: false });
      } finally {
        setLoading(false);
      }
    };
    void fetchStats();
  }, [period]);

  return { data, loading };
}
