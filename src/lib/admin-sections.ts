import { supabase } from "@/integrations/supabase/client";

export interface SectionRecord {
  id: string;
  name: string;
  slug: string;
  position: number;
  visible: boolean;
}

export async function fetchSections(): Promise<SectionRecord[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("sections")
    .select("id, name, slug, position, visible")
    .order("position", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as SectionRecord[];
}

export async function saveSection(section: Omit<SectionRecord, "id"> & { id?: string }): Promise<SectionRecord> {
  if (!supabase) throw new Error("Supabase no configurado.");
  if (section.id) {
    const { data, error } = await supabase
      .from("sections")
      .update({ name: section.name, slug: section.slug, position: section.position, visible: section.visible })
      .eq("id", section.id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as SectionRecord;
  }
  const { data, error } = await supabase
    .from("sections")
    .insert({ name: section.name, slug: section.slug, position: section.position, visible: section.visible })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as SectionRecord;
}

export async function deleteSection(id: string): Promise<void> {
  if (!supabase) throw new Error("Supabase no configurado.");
  const { error } = await supabase.from("sections").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export function slugifySection(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
