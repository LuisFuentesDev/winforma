import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type AdRecord = Tables<"ads">;

async function fetchActiveAds() {
  if (!supabase) {
    return [] as AdRecord[];
  }

  const { data, error } = await supabase
    .from("ads")
    .select("id,slot,title,image_url,target_url,is_active,created_at,updated_at")
    .eq("is_active", true);

  if (error) {
    return [] as AdRecord[];
  }

  return (data ?? []) as AdRecord[];
}

export function useAds() {
  return useQuery({
    queryKey: ["ads"],
    queryFn: fetchActiveAds,
    staleTime: 60_000,
  });
}
