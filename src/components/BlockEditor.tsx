import { useRef, useEffect, useState } from "react";
import {
  Image, Trash2, ArrowUp, ArrowDown, Plus,
  Bold, Italic, Underline, Strikethrough,
  List, ListOrdered, Quote, Baseline,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { uploadArticleImage } from "@/lib/admin-articles";
import { toast } from "sonner";

export type TextBlock = { type: "text"; content: string };
export type ImageBlock = { type: "image"; url: string; caption: string };
export type Block = TextBlock | ImageBlock;

/* ── Serialization ────────────────────────────────────────────── */

export function blocksToHtml(blocks: Block[]): string {
  return blocks
    .map((block) => {
      if (block.type === "text") return block.content || "";
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

  // Plain text (no HTML tags) → single text block
  if (!/<[a-z][\s\S]*>/i.test(html)) {
    return [{ type: "text", content: `<p>${html.replace(/\n{2,}/g, "</p><p>").replace(/\n/g, "<br />")}</p>` }];
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const blocks: Block[] = [];
  let textBuffer = "";

  const flushText = () => {
    if (textBuffer.trim()) {
      blocks.push({ type: "text", content: textBuffer.trim() });
      textBuffer = "";
    }
  };

  for (const node of Array.from(doc.body.childNodes)) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element;
      if (el.tagName === "FIGURE") {
        flushText();
        const img = el.querySelector("img");
        const caption = el.querySelector("figcaption")?.textContent ?? "";
        if (img) blocks.push({ type: "image", url: img.getAttribute("src") ?? "", caption });
      } else if (el.tagName === "IMG") {
        flushText();
        blocks.push({ type: "image", url: (el as HTMLImageElement).getAttribute("src") ?? "", caption: "" });
      } else {
        textBuffer += (el as Element).outerHTML + "\n";
      }
    } else if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim() ?? "";
      if (text) textBuffer += `<p>${text}</p>\n`;
    }
  }

  flushText();
  return blocks.length ? blocks : [{ type: "text", content: "" }];
}

/* ── Rich text editor ─────────────────────────────────────────── */

interface ToolbarButtonProps {
  onMouseDown: (e: React.MouseEvent) => void;
  title: string;
  children: React.ReactNode;
  active?: boolean;
}

function ToolbarButton({ onMouseDown, title, children, active }: ToolbarButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onMouseDown={onMouseDown}
          className={`p-1.5 rounded transition-colors hover:bg-muted ${active ? "bg-muted text-primary" : "text-muted-foreground hover:text-foreground"}`}
        >
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="text-xs">
        {title}
      </TooltipContent>
    </Tooltip>
  );
}

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
}

const COLOR_PALETTE = [
  { label: "Por defecto",  value: "inherit" },
  { label: "Negro",        value: "#000000" },
  { label: "Gris oscuro",  value: "#374151" },
  { label: "Gris",         value: "#6B7280" },
  { label: "Rojo",         value: "#DC2626" },
  { label: "Naranja",      value: "#EA580C" },
  { label: "Amarillo",     value: "#CA8A04" },
  { label: "Verde",        value: "#16A34A" },
  { label: "Celeste",      value: "#0284C7" },
  { label: "Azul",         value: "#2563EB" },
  { label: "Morado",       value: "#7C3AED" },
  { label: "Rosa",         value: "#DB2777" },
];

function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const lastContent = useRef(content);
  const [showColors, setShowColors] = useState(false);
  const [activeColor, setActiveColor] = useState("inherit");

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = content;
      lastContent.current = content;
    }
  // Only on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync when content changes externally (e.g. loading a different article)
  useEffect(() => {
    if (editorRef.current && content !== lastContent.current) {
      editorRef.current.innerHTML = content;
      lastContent.current = content;
    }
  }, [content]);

  const exec = (e: React.MouseEvent, command: string, value?: string) => {
    e.preventDefault();
    editorRef.current?.focus();
    document.execCommand(command, false, value ?? undefined);
    if (editorRef.current) {
      lastContent.current = editorRef.current.innerHTML;
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      lastContent.current = editorRef.current.innerHTML;
      onChange(editorRef.current.innerHTML);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    const html = e.clipboardData.getData("text/html");

    let clean = "";
    if (html) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      // Eliminar estilos inline de todos los elementos
      doc.body.querySelectorAll("*").forEach((el) => {
        el.removeAttribute("style");
        el.removeAttribute("color");
        el.removeAttribute("bgcolor");
        el.removeAttribute("class");
        el.removeAttribute("id");
        el.removeAttribute("font");
      });
      // Eliminar etiquetas span vacías o de solo formato de color
      doc.body.querySelectorAll("span").forEach((span) => {
        if (!span.getAttribute("style") && span.children.length === 0) {
          span.replaceWith(...Array.from(span.childNodes));
        }
      });
      clean = doc.body.innerHTML;
    } else {
      // Sin HTML: convertir saltos de línea en párrafos
      clean = text
        .split(/\n{2,}/)
        .map((p) => `<p>${p.replace(/\n/g, "<br>")}</p>`)
        .join("");
    }

    document.execCommand("insertHTML", false, clean);
  };

  return (
    <div className="rounded-lg border border-border overflow-hidden focus-within:ring-1 focus-within:ring-primary/40">
      {/* Toolbar */}
      <TooltipProvider delayDuration={300}>
        <div className="flex flex-wrap items-center gap-0.5 border-b border-border bg-muted/30 px-2 py-1.5">
          <ToolbarButton title="Negrita" onMouseDown={(e) => exec(e, "bold")}>
            <Bold size={14} />
          </ToolbarButton>
          <ToolbarButton title="Cursiva" onMouseDown={(e) => exec(e, "italic")}>
            <Italic size={14} />
          </ToolbarButton>
          <ToolbarButton title="Subrayado" onMouseDown={(e) => exec(e, "underline")}>
            <Underline size={14} />
          </ToolbarButton>
          <ToolbarButton title="Tachado" onMouseDown={(e) => exec(e, "strikeThrough")}>
            <Strikethrough size={14} />
          </ToolbarButton>

          <div className="mx-1.5 h-4 w-px bg-border" />

          <ToolbarButton title="Título grande (H2)" onMouseDown={(e) => exec(e, "formatBlock", "H2")}>
            <span className="text-[11px] font-bold leading-none">H2</span>
          </ToolbarButton>
          <ToolbarButton title="Subtítulo (H3)" onMouseDown={(e) => exec(e, "formatBlock", "H3")}>
            <span className="text-[11px] font-bold leading-none">H3</span>
          </ToolbarButton>
          <ToolbarButton title="Párrafo normal" onMouseDown={(e) => exec(e, "formatBlock", "P")}>
            <span className="text-[11px] font-bold leading-none">P</span>
          </ToolbarButton>

          <div className="mx-1.5 h-4 w-px bg-border" />

          <ToolbarButton title="Lista con viñetas" onMouseDown={(e) => exec(e, "insertUnorderedList")}>
            <List size={14} />
          </ToolbarButton>
          <ToolbarButton title="Lista numerada" onMouseDown={(e) => exec(e, "insertOrderedList")}>
            <ListOrdered size={14} />
          </ToolbarButton>
          <ToolbarButton title="Cita destacada" onMouseDown={(e) => exec(e, "formatBlock", "BLOCKQUOTE")}>
            <Quote size={14} />
          </ToolbarButton>

          <div className="mx-1.5 h-4 w-px bg-border" />

          {/* Color de texto */}
          <div className="relative">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); setShowColors((v) => !v); }}
                  className="p-1.5 rounded transition-colors hover:bg-muted text-muted-foreground hover:text-foreground flex flex-col items-center gap-0.5"
                >
                  <Baseline size={14} />
                  <div
                    className="h-1 w-4 rounded-full"
                    style={{ backgroundColor: activeColor === "inherit" ? "currentColor" : activeColor }}
                  />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">Color de texto</TooltipContent>
            </Tooltip>

            {showColors && (
              <div className="absolute left-0 top-full mt-1 z-50 rounded-xl border border-border bg-card shadow-lg p-2 w-44">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 px-1">Color de texto</p>
                <div className="grid grid-cols-6 gap-1.5">
                  {COLOR_PALETTE.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      title={c.label}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        editorRef.current?.focus();
                        if (c.value === "inherit") {
                          document.execCommand("removeFormat", false, undefined);
                        } else {
                          document.execCommand("foreColor", false, c.value);
                        }
                        setActiveColor(c.value);
                        setShowColors(false);
                        if (editorRef.current) {
                          lastContent.current = editorRef.current.innerHTML;
                          onChange(editorRef.current.innerHTML);
                        }
                      }}
                      className={`w-6 h-6 rounded-md border-2 transition-transform hover:scale-110 ${
                        activeColor === c.value ? "border-primary" : "border-transparent"
                      }`}
                      style={{
                        backgroundColor: c.value === "inherit" ? "transparent" : c.value,
                        backgroundImage: c.value === "inherit"
                          ? "repeating-linear-gradient(45deg, #ccc 0, #ccc 2px, transparent 0, transparent 50%)"
                          : undefined,
                        backgroundSize: "6px 6px",
                        border: c.value === "inherit" ? "2px dashed #ccc" : undefined,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </TooltipProvider>

      {/* Editable area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onPaste={handlePaste}
        onFocus={() => setShowColors(false)}
        className="min-h-[140px] px-3 py-3 text-sm font-sans text-foreground outline-none
          [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-3 [&_h2]:mb-1
          [&_h3]:text-base [&_h3]:font-bold [&_h3]:mt-2 [&_h3]:mb-1
          [&_p]:mb-2 [&_p:last-child]:mb-0
          [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-2
          [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-2
          [&_blockquote]:border-l-4 [&_blockquote]:border-primary/40 [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_blockquote]:my-2"
      />
    </div>
  );
}

/* ── Block Editor ─────────────────────────────────────────────── */

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
      insertAfter(insertIndexRef.current, { type: "image", url, caption: "" });
      toast.success("Imagen subida.");
    } catch {
      toast.error("No se pudo subir la imagen.");
    }
  };

  return (
    <div className="space-y-3">
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

      {blocks.map((block, index) => (
        <div key={index} className="group relative">
          {/* Block controls */}
          <div className="absolute -right-1 -top-1 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button type="button" onClick={() => moveUp(index)} disabled={index === 0}
              className="p-1 rounded bg-background border border-border shadow-sm hover:bg-muted disabled:opacity-30" title="Subir bloque">
              <ArrowUp size={12} />
            </button>
            <button type="button" onClick={() => moveDown(index)} disabled={index === blocks.length - 1}
              className="p-1 rounded bg-background border border-border shadow-sm hover:bg-muted disabled:opacity-30" title="Bajar bloque">
              <ArrowDown size={12} />
            </button>
            <button type="button" onClick={() => remove(index)}
              className="p-1 rounded bg-background border border-border shadow-sm hover:bg-destructive/10 text-destructive" title="Eliminar bloque">
              <Trash2 size={12} />
            </button>
          </div>

          {block.type === "text" && (
            <RichTextEditor
              content={block.content}
              onChange={(html) => update(index, { content: html })}
            />
          )}

          {block.type === "image" && (
            <div className="rounded-xl border border-border bg-muted/20 p-3 space-y-2">
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
          <div className="mt-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={() => insertAfter(index, { type: "text", content: "" })}
              className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground hover:border-primary hover:text-primary transition-colors bg-background"
            >
              <Plus size={11} /> Párrafo
            </button>
            <button
              type="button"
              onClick={() => handleImagePick(index)}
              className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground hover:border-primary hover:text-primary transition-colors bg-background"
            >
              <Image size={11} /> Foto
            </button>
          </div>
        </div>
      ))}

      {blocks.length === 0 && (
        <Button type="button" variant="outline" onClick={() => onChange([{ type: "text", content: "" }])}>
          <Plus size={14} className="mr-1" /> Agregar párrafo
        </Button>
      )}
    </div>
  );
}
