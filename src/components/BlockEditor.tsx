import { useRef } from "react";
import { Image, Trash2, ArrowUp, ArrowDown, Plus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadArticleImage } from "@/lib/admin-articles";
import { toast } from "sonner";

export type TextBlock = { type: "text"; content: string };
export type ImageBlock = { type: "image"; url: string; caption: string };
export type Block = TextBlock | ImageBlock;

export function blocksToHtml(blocks: Block[]): string {
  return blocks
    .map((block) => {
      if (block.type === "text") {
        const paragraphs = block.content
          .split(/\n{2,}/)
          .map((p) => p.trim())
          .filter(Boolean);
        if (!paragraphs.length) return "";
        return paragraphs
          .map((p) => `<p>${p.replace(/\n/g, "<br />")}</p>`)
          .join("\n");
      }
      if (!block.url) return "";
      const cap = block.caption
        ? `<figcaption>${block.caption}</figcaption>`
        : "";
      return `<figure><img src="${block.url}" alt="${block.caption || ""}" style="width:100%;border-radius:8px;" />${cap}</figure>`;
    })
    .filter(Boolean)
    .join("\n");
}

export function htmlToBlocks(html: string): Block[] {
  if (!html.trim()) return [{ type: "text", content: "" }];

  if (!/<[a-z][\s\S]*>/i.test(html)) {
    const blocks: Block[] = html
      .split(/\n{2,}/)
      .map((p) => ({ type: "text" as const, content: p.trim() }))
      .filter((b) => b.content);
    return blocks.length ? blocks : [{ type: "text", content: html.trim() }];
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const blocks: Block[] = [];

  for (const node of Array.from(doc.body.childNodes)) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element;
      if (el.tagName === "FIGURE") {
        const img = el.querySelector("img");
        const caption = el.querySelector("figcaption")?.textContent ?? "";
        if (img) blocks.push({ type: "image", url: img.getAttribute("src") ?? "", caption });
      } else if (el.tagName === "IMG") {
        blocks.push({ type: "image", url: (el as HTMLImageElement).getAttribute("src") ?? "", caption: "" });
      } else {
        const text = el.textContent?.trim() ?? "";
        if (text) blocks.push({ type: "text", content: text });
      }
    } else if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim() ?? "";
      if (text) blocks.push({ type: "text", content: text });
    }
  }

  return blocks.length ? blocks : [{ type: "text", content: "" }];
}

interface BlockEditorProps {
  blocks: Block[];
  onChange: (blocks: Block[]) => void;
  articleSlug: string;
}

export default function BlockEditor({ blocks, onChange, articleSlug }: BlockEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const insertIndexRef = useRef<number>(0);

  const update = (index: number, patch: Partial<Block>) => {
    const next = blocks.map((b, i) => (i === index ? { ...b, ...patch } : b)) as Block[];
    onChange(next);
  };

  const remove = (index: number) => {
    const next = blocks.filter((_, i) => i !== index);
    onChange(next.length ? next : [{ type: "text", content: "" }]);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const next = [...blocks];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    onChange(next);
  };

  const moveDown = (index: number) => {
    if (index === blocks.length - 1) return;
    const next = [...blocks];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    onChange(next);
  };

  const insertAfter = (index: number, block: Block) => {
    const next = [...blocks];
    next.splice(index + 1, 0, block);
    onChange(next);
  };

  const handleImagePick = (afterIndex: number) => {
    insertIndexRef.current = afterIndex;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    try {
      const url = await uploadArticleImage(file, articleSlug || file.name);
      const afterIndex = insertIndexRef.current;
      insertAfter(afterIndex, { type: "image", url, caption: "" });
      toast.success("Imagen subida.");
    } catch {
      toast.error("No se pudo subir la imagen.");
    }
  };

  return (
    <div className="space-y-3">
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

      {blocks.map((block, index) => (
        <div key={index} className="group relative rounded-xl border border-border bg-muted/20 p-3">
          {/* Block controls */}
          <div className="absolute right-2 top-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button type="button" onClick={() => moveUp(index)} disabled={index === 0} className="p-1 rounded hover:bg-muted disabled:opacity-30" title="Subir">
              <ArrowUp size={13} />
            </button>
            <button type="button" onClick={() => moveDown(index)} disabled={index === blocks.length - 1} className="p-1 rounded hover:bg-muted disabled:opacity-30" title="Bajar">
              <ArrowDown size={13} />
            </button>
            <button type="button" onClick={() => remove(index)} className="p-1 rounded hover:bg-destructive/10 text-destructive" title="Eliminar bloque">
              <Trash2 size={13} />
            </button>
          </div>

          {block.type === "text" && (
            <Textarea
              value={block.content}
              onChange={(e) => update(index, { content: e.target.value })}
              placeholder="Escribe aquí el texto del párrafo..."
              rows={4}
              className="border-0 bg-transparent p-0 focus-visible:ring-0 resize-none pr-16"
            />
          )}

          {block.type === "image" && (
            <div className="space-y-2">
              {block.url ? (
                <img src={block.url} alt={block.caption || "Imagen"} className="w-full rounded-lg object-cover max-h-72" />
              ) : (
                <div className="flex h-24 items-center justify-center rounded-lg border border-dashed border-border text-muted-foreground text-sm">
                  Sin imagen
                </div>
              )}
              <Input
                value={block.caption}
                onChange={(e) => update(index, { caption: e.target.value })}
                placeholder="Pie de foto (opcional)"
                className="text-sm"
              />
              <Button type="button" variant="outline" size="sm" onClick={() => handleImagePick(index - 1 >= 0 ? index - 1 : 0)}>
                Cambiar imagen
              </Button>
            </div>
          )}

          {/* Insert buttons below this block */}
          <div className="mt-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={() => insertAfter(index, { type: "text", content: "" })}
              className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground hover:border-primary hover:text-primary transition-colors"
            >
              <Plus size={11} /> Párrafo
            </button>
            <button
              type="button"
              onClick={() => handleImagePick(index)}
              className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground hover:border-primary hover:text-primary transition-colors"
            >
              <Image size={11} /> Foto
            </button>
          </div>
        </div>
      ))}

      {/* Add first block if list is empty */}
      {blocks.length === 0 && (
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => onChange([{ type: "text", content: "" }])}>
            <Plus size={14} className="mr-1" /> Agregar párrafo
          </Button>
        </div>
      )}
    </div>
  );
}
