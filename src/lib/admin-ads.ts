import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type AdSlot = "leaderboard" | "banner" | "inline" | "sidebar";
export type AdRecord = Tables<"ads">;

export interface AdFormValues {
  id?: string;
  slot: AdSlot;
  title: string;
  imageUrl: string;
  targetUrl: string;
  isActive: boolean;
}

const STORAGE_BUCKET =
  import.meta.env.VITE_STORAGE_BUCKET ||
  import.meta.env.VITE_ARTICLE_IMAGES_BUCKET ||
  "article-images";

export const AD_SLOTS: { slot: AdSlot; label: string; description: string; size: string }[] = [
  {
    slot: "leaderboard",
    label: "Cabecera",
    description: "Banner bajo el header en home.",
    size: "1400 × 90 px",
  },
  {
    slot: "banner",
    label: "Sección media",
    description: "Banner grande entre bloques de portada.",
    size: "1400 × 250 px",
  },
  {
    slot: "inline",
    label: "Artículo",
    description: "Banner dentro del detalle de noticia.",
    size: "728 × 90 px",
  },
  {
    slot: "sidebar",
    label: "Lateral",
    description: "Espacio reservado para futuros módulos laterales.",
    size: "300 × 600 px",
  },
];

export function createEmptyAdForm(slot: AdSlot): AdFormValues {
  return {
    slot,
    title: "",
    imageUrl: "",
    targetUrl: "",
    isActive: false,
  };
}

export function mapAdToForm(ad: AdRecord): AdFormValues {
  return {
    id: ad.id,
    slot: ad.slot as AdSlot,
    title: ad.title,
    imageUrl: ad.image_url ?? "",
    targetUrl: ad.target_url ?? "",
    isActive: ad.is_active,
  };
}

export async function fetchAdminAds() {
  if (!supabase) {
    throw new Error("Supabase no está configurado.");
  }

  const { data, error } = await supabase
    .from("ads")
    .select("id,slot,title,image_url,target_url,is_active,created_at,updated_at")
    .order("slot");

  if (error) {
    throw error;
  }

  return (data ?? []) as AdRecord[];
}

export async function uploadAdImage(file: File, slot: AdSlot) {
  if (!supabase) {
    throw new Error("Supabase no está configurado.");
  }

  const extension = file.name.includes(".") ? file.name.split(".").pop()?.toLowerCase() : "jpg";
  const path = `ads/${slot}.${extension || "jpg"}`;

  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file, {
    upsert: true,
    cacheControl: "31536000",
    contentType: file.type || undefined,
  });

  if (error) {
    throw error;
  }

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function saveAdminAd(values: AdFormValues) {
  if (!supabase) {
    throw new Error("Supabase no está configurado.");
  }

  const payload = {
    slot: values.slot,
    title: values.title.trim() || AD_SLOTS.find((item) => item.slot === values.slot)?.label || "Publicidad",
    image_url: values.imageUrl.trim() || null,
    target_url: values.targetUrl.trim() || null,
    is_active: values.isActive,
    updated_at: new Date().toISOString(),
  };

  if (values.id) {
    const { data, error } = await supabase
      .from("ads")
      .update(payload)
      .eq("id", values.id)
      .select("id,slot,title,image_url,target_url,is_active,created_at,updated_at")
      .single();

    if (error) throw error;
    return data as AdRecord;
  }

  const { data, error } = await supabase
    .from("ads")
    .insert(payload)
    .select("id,slot,title,image_url,target_url,is_active,created_at,updated_at")
    .single();

  if (error) throw error;
  return data as AdRecord;
}
