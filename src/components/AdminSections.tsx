import { useState } from "react";
import { Plus, Trash2, GripVertical, Eye, EyeOff, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  fetchSections,
  saveSection,
  deleteSection,
  slugifySection,
  type SectionRecord,
} from "@/lib/admin-sections";

interface AdminSectionsProps {
  sections: SectionRecord[];
  onUpdate: (sections: SectionRecord[]) => void;
}

interface EditingSection {
  id?: string;
  name: string;
  slug: string;
  position: number;
  visible: boolean;
}

export default function AdminSections({ sections, onUpdate }: AdminSectionsProps) {
  const [editing, setEditing] = useState<EditingSection | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const startNew = () => {
    setEditing({ name: "", slug: "", position: (sections.at(-1)?.position ?? 0) + 1, visible: true });
  };

  const startEdit = (s: SectionRecord) => {
    setEditing({ id: s.id, name: s.name, slug: s.slug, position: s.position, visible: s.visible });
  };

  const cancelEdit = () => setEditing(null);

  const handleSave = async () => {
    if (!editing) return;
    if (!editing.name.trim()) { toast.error("El nombre es obligatorio."); return; }
    setIsSaving(true);
    try {
      await saveSection(editing);
      const updated = await fetchSections();
      onUpdate(updated);
      setEditing(null);
      toast.success(editing.id ? "Sección actualizada." : "Sección creada.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al guardar.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (s: SectionRecord) => {
    if (!window.confirm(`¿Eliminar la sección "${s.name}"? Los artículos con esta categoría no se borran.`)) return;
    setDeletingId(s.id);
    try {
      await deleteSection(s.id);
      onUpdate(sections.filter((x) => x.id !== s.id));
      toast.success("Sección eliminada.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al eliminar.");
    } finally {
      setDeletingId(null);
    }
  };

  const toggleVisible = async (s: SectionRecord) => {
    try {
      const updated = await saveSection({ ...s, visible: !s.visible });
      onUpdate(sections.map((x) => (x.id === updated.id ? updated : x)));
    } catch {
      toast.error("No se pudo actualizar.");
    }
  };

  const movePosition = async (s: SectionRecord, dir: -1 | 1) => {
    const idx = sections.findIndex((x) => x.id === s.id);
    const swapIdx = idx + dir;
    if (swapIdx < 0 || swapIdx >= sections.length) return;

    const swap = sections[swapIdx];
    try {
      await Promise.all([
        saveSection({ ...s, position: swap.position }),
        saveSection({ ...swap, position: s.position }),
      ]);
      const updated = await fetchSections();
      onUpdate(updated);
    } catch {
      toast.error("No se pudo reordenar.");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Secciones</h2>
          <p className="text-sm text-muted-foreground">
            Administra las categorías que aparecen en el menú del sitio.
          </p>
        </div>
        <Button type="button" onClick={startNew} disabled={!!editing}>
          <Plus size={15} className="mr-1.5" /> Nueva sección
        </Button>
      </div>

      {/* Formulario de creación / edición */}
      {editing && (
        <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5 space-y-4">
          <h3 className="text-sm font-bold text-foreground">
            {editing.id ? "Editar sección" : "Nueva sección"}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Nombre</Label>
              <Input
                value={editing.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setEditing((prev) => prev ? ({
                    ...prev,
                    name,
                    slug: prev.id ? prev.slug : slugifySection(name),
                  }) : null);
                }}
                placeholder="Ej: Economía"
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Slug (URL)</Label>
                <button
                  type="button"
                  className="text-xs text-primary hover:underline"
                  onClick={() => setEditing((p) => p ? ({ ...p, slug: slugifySection(p.name) }) : null)}
                >
                  Generar desde nombre
                </button>
              </div>
              <Input
                value={editing.slug}
                onChange={(e) => setEditing((p) => p ? ({ ...p, slug: e.target.value }) : null)}
                placeholder="economia"
              />
            </div>
            <div className="space-y-2">
              <Label>Posición</Label>
              <Input
                type="number"
                min={1}
                value={editing.position}
                onChange={(e) => setEditing((p) => p ? ({ ...p, position: Number(e.target.value) }) : null)}
              />
            </div>
            <div className="flex items-end pb-0.5">
              <label className="flex items-center gap-3 rounded-xl border border-border px-4 py-2.5 w-full cursor-pointer">
                <input
                  type="checkbox"
                  checked={editing.visible}
                  onChange={(e) => setEditing((p) => p ? ({ ...p, visible: e.target.checked }) : null)}
                  className="h-4 w-4"
                />
                <span className="text-sm text-foreground">Visible en el menú</span>
              </label>
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="button" onClick={() => void handleSave()} disabled={isSaving}>
              <Check size={14} className="mr-1.5" />
              {isSaving ? "Guardando..." : "Guardar"}
            </Button>
            <Button type="button" variant="outline" onClick={cancelEdit} disabled={isSaving}>
              <X size={14} className="mr-1.5" /> Cancelar
            </Button>
          </div>
        </div>
      )}

      {/* Lista de secciones */}
      <div className="rounded-2xl border border-border bg-card divide-y divide-border overflow-hidden">
        {sections.length === 0 && (
          <p className="px-5 py-6 text-sm text-muted-foreground font-sans">No hay secciones.</p>
        )}
        {sections.map((s, idx) => (
          <div
            key={s.id}
            className={`flex items-center gap-3 px-4 py-3 transition-colors ${
              editing?.id === s.id ? "bg-primary/5" : "hover:bg-muted/30"
            }`}
          >
            {/* Orden */}
            <div className="flex flex-col gap-0.5 shrink-0">
              <button
                type="button"
                onClick={() => void movePosition(s, -1)}
                disabled={idx === 0}
                className="p-0.5 rounded hover:bg-muted disabled:opacity-20"
                title="Subir"
              >
                <GripVertical size={12} className="rotate-90" />
              </button>
              <button
                type="button"
                onClick={() => void movePosition(s, 1)}
                disabled={idx === sections.length - 1}
                className="p-0.5 rounded hover:bg-muted disabled:opacity-20"
                title="Bajar"
              >
                <GripVertical size={12} className="-rotate-90" />
              </button>
            </div>

            {/* Número de posición */}
            <span className="w-5 text-center text-xs font-bold text-muted-foreground/50 tabular-nums shrink-0">
              {s.position}
            </span>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold ${s.visible ? "text-foreground" : "text-muted-foreground line-through"}`}>
                {s.name}
              </p>
              <p className="text-xs text-muted-foreground font-sans">/seccion/{s.slug}</p>
            </div>

            {/* Badge visible */}
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold font-sans ${
              s.visible ? "bg-green-500/15 text-green-600" : "bg-muted text-muted-foreground"
            }`}>
              {s.visible ? "Visible" : "Oculta"}
            </span>

            {/* Acciones */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => void toggleVisible(s)}
                className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                title={s.visible ? "Ocultar" : "Mostrar"}
              >
                {s.visible ? <Eye size={14} /> : <EyeOff size={14} />}
              </button>
              <button
                type="button"
                onClick={() => startEdit(s)}
                disabled={!!editing}
                className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors text-xs font-semibold disabled:opacity-40"
                title="Editar"
              >
                Editar
              </button>
              <button
                type="button"
                onClick={() => void handleDelete(s)}
                disabled={deletingId === s.id}
                className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                title="Eliminar"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground font-sans">
        Las secciones ocultas no aparecen en el menú del sitio pero los artículos con esa categoría siguen siendo accesibles.
      </p>
    </div>
  );
}
