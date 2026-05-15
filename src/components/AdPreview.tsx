import type { AdSlot } from "@/lib/admin-ads";

interface AdPreviewProps {
  slot: AdSlot;
  imageUrl: string;
  title: string;
}

const slotMeta: Record<AdSlot, { label: string; size: string; ratio: string }> = {
  leaderboard: { label: "Cabecera del sitio", size: "728 × 90 px", ratio: "Horizontal largo" },
  banner:      { label: "Sección media",      size: "970 × 250 px", ratio: "Horizontal grande" },
  inline:      { label: "Dentro del artículo", size: "728 × 90 px", ratio: "Horizontal largo" },
  sidebar:     { label: "Columna lateral",    size: "300 × 600 px", ratio: "Vertical medio" },
  "box-top":   { label: "Caja lateral superior", size: "300 × 250 px", ratio: "Cuadrado" },
  "box-bottom":{ label: "Caja lateral inferior",  size: "300 × 250 px", ratio: "Cuadrado" },
};

/* Líneas de texto simuladas */
const Lines = ({ count = 3, widths }: { count?: number; widths?: number[] }) => (
  <div className="space-y-1.5">
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="h-1.5 rounded-full bg-foreground/10"
        style={{ width: `${widths?.[i] ?? 65 + (i % 4) * 9}%` }}
      />
    ))}
  </div>
);

/* Tarjeta de noticia simulada */
const NewsCard = ({ imgH = 32, lines = 2 }: { imgH?: number; lines?: number }) => (
  <div className="space-y-1.5">
    <div className="w-full rounded-md bg-foreground/8" style={{ height: imgH }} />
    <div className="h-1.5 w-16 rounded-full bg-primary/30" />
    <Lines count={lines} />
  </div>
);

/* Chrome del navegador */
const BrowserChrome = () => (
  <div className="flex items-center gap-1.5 px-2 py-1.5 border-b border-border bg-muted/40 rounded-t-xl">
    <div className="flex gap-1">
      <div className="h-2 w-2 rounded-full bg-red-400/60" />
      <div className="h-2 w-2 rounded-full bg-yellow-400/60" />
      <div className="h-2 w-2 rounded-full bg-green-400/60" />
    </div>
    <div className="flex-1 mx-2 h-3 rounded-full bg-foreground/8 flex items-center px-2">
      <div className="h-1 w-24 rounded-full bg-foreground/15" />
    </div>
  </div>
);

/* Header simulado del sitio */
const SiteHeader = () => (
  <div className="flex items-center justify-between px-3 py-2 border-b border-border">
    <div className="h-3 w-14 rounded bg-foreground/25 font-bold" />
    <div className="flex gap-2">
      {[28, 22, 26, 20].map((w, i) => (
        <div key={i} className="h-1.5 rounded-full bg-foreground/12" style={{ width: w }} />
      ))}
    </div>
  </div>
);

/* El banner real */
const Banner = ({
  imageUrl, title, className,
}: { imageUrl: string; title: string; className: string }) => (
  <div className={`relative overflow-hidden rounded-md border-2 border-primary/40 bg-muted/20 shadow-sm ${className}`}>
    {imageUrl ? (
      <img src={imageUrl} alt={title || "Banner"} className="h-full w-full object-cover object-center" />
    ) : (
      <div className="flex h-full w-full flex-col items-center justify-center gap-1">
        <div className="h-4 w-4 rounded-full border-2 border-dashed border-muted-foreground/30" />
        <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40 font-sans">
          Tu banner aquí
        </span>
      </div>
    )}
    {/* Etiqueta "AD" */}
    <div className="absolute top-1 right-1 rounded bg-primary/80 px-1 py-0.5">
      <span className="text-[8px] font-bold text-primary-foreground font-sans">AD</span>
    </div>
  </div>
);

export default function AdPreview({ slot, imageUrl, title }: AdPreviewProps) {
  const meta = slotMeta[slot];

  return (
    <div className="space-y-3">
      {/* Info del slot */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-foreground font-sans">{meta.label}</p>
          <p className="text-[11px] text-muted-foreground font-sans">{meta.size} · {meta.ratio}</p>
        </div>
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold font-sans ${
          imageUrl ? "bg-green-500/15 text-green-600" : "bg-muted text-muted-foreground"
        }`}>
          {imageUrl ? "Con imagen" : "Sin imagen"}
        </span>
      </div>

      {/* Mock del sitio */}
      <div className="rounded-xl border border-border overflow-hidden bg-background shadow-sm">
        <BrowserChrome />
        <SiteHeader />

        <div className="p-2 space-y-2 text-[0px]">

          {/* LEADERBOARD — banner horizontal bajo el header */}
          {slot === "leaderboard" && (
            <>
              <Banner imageUrl={imageUrl} title={title} className="w-full h-10" />
              <div className="grid grid-cols-3 gap-2 pt-1">
                {[1,2,3].map(i => <NewsCard key={i} imgH={36} lines={2} />)}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[1,2].map(i => <NewsCard key={i} imgH={28} lines={2} />)}
              </div>
            </>
          )}

          {/* BANNER — horizontal grande entre secciones */}
          {slot === "banner" && (
            <>
              <div className="grid grid-cols-3 gap-2">
                {[1,2,3].map(i => <NewsCard key={i} imgH={30} lines={2} />)}
              </div>
              <div className="py-1">
                <div className="text-[9px] font-sans text-muted-foreground/50 mb-1 text-center">— Publicidad —</div>
                <Banner imageUrl={imageUrl} title={title} className="w-full h-16" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[1,2].map(i => <NewsCard key={i} imgH={28} lines={2} />)}
              </div>
            </>
          )}

          {/* INLINE — dentro del cuerpo del artículo */}
          {slot === "inline" && (
            <>
              <div className="px-1 space-y-2">
                <div className="h-2.5 w-2/3 rounded bg-foreground/20" />
                <div className="h-1.5 w-24 rounded-full bg-primary/25" />
                <div className="w-full h-28 rounded-md bg-foreground/8" />
                <Lines count={4} />
                <Lines count={3} widths={[90, 75, 50]} />
              </div>
              <div className="text-[9px] font-sans text-muted-foreground/50 text-center">— Publicidad —</div>
              <Banner imageUrl={imageUrl} title={title} className="w-full h-10" />
              <div className="px-1 space-y-2 pt-1">
                <Lines count={4} />
                <Lines count={3} widths={[85, 70, 40]} />
              </div>
            </>
          )}

          {/* SIDEBAR — columna lateral derecha */}
          {slot === "sidebar" && (
            <div className="flex gap-2">
              <div className="flex-1 space-y-2">
                <div className="h-2.5 w-2/3 rounded bg-foreground/20" />
                <div className="w-full h-32 rounded-md bg-foreground/8" />
                <Lines count={3} />
                <Lines count={3} widths={[80, 65, 45]} />
                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  {[1,2].map(i => <NewsCard key={i} imgH={22} lines={2} />)}
                </div>
              </div>
              <div className="w-16 shrink-0 space-y-1.5">
                <div className="text-[8px] font-sans text-muted-foreground/40 text-center">Publicidad</div>
                <Banner imageUrl={imageUrl} title={title} className="w-full h-40" />
              </div>
            </div>
          )}

          {/* BOX-TOP — caja cuadrada arriba del sidebar */}
          {slot === "box-top" && (
            <div className="flex gap-2">
              <div className="flex-1 space-y-2">
                <div className="h-2.5 w-2/3 rounded bg-foreground/20" />
                <div className="w-full h-28 rounded-md bg-foreground/8" />
                <Lines count={3} />
              </div>
              <div className="w-20 shrink-0 space-y-1.5">
                <div className="text-[8px] font-sans text-muted-foreground/40 text-center">Publicidad</div>
                <Banner imageUrl={imageUrl} title={title} className="w-full h-16" />
                <Lines count={3} widths={[100, 80, 60]} />
                <Lines count={2} widths={[90, 70]} />
              </div>
            </div>
          )}

          {/* BOX-BOTTOM — caja cuadrada abajo del sidebar */}
          {slot === "box-bottom" && (
            <div className="flex gap-2">
              <div className="flex-1 space-y-2">
                <div className="h-2.5 w-2/3 rounded bg-foreground/20" />
                <div className="w-full h-28 rounded-md bg-foreground/8" />
                <Lines count={3} />
              </div>
              <div className="w-20 shrink-0 space-y-1.5">
                <Lines count={3} widths={[100, 80, 60]} />
                <Lines count={2} widths={[90, 70]} />
                <div className="text-[8px] font-sans text-muted-foreground/40 text-center">Publicidad</div>
                <Banner imageUrl={imageUrl} title={title} className="w-full h-16" />
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Imagen real ampliada si existe */}
      {imageUrl && (
        <div className="rounded-xl overflow-hidden border border-border">
          <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground font-sans border-b border-border bg-muted/30">
            Imagen del banner
          </p>
          <img src={imageUrl} alt={title || "Banner"} className="w-full object-cover max-h-40 object-center" />
        </div>
      )}
    </div>
  );
}
