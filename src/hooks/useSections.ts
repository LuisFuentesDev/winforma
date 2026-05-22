import { useEffect, useState } from "react";
import { fetchSections, type SectionRecord } from "@/lib/admin-sections";

export function useSections() {
  const [sections, setSections] = useState<SectionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSections()
      .then(setSections)
      .catch(() => setSections([]))
      .finally(() => setLoading(false));
  }, []);

  return { sections, loading };
}
