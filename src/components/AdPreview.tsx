import type { AdSlot } from "@/lib/admin-ads";

interface AdPreviewProps {
  slot: AdSlot;
  imageUrl: string;
  title: string;
}

/* Bloque genérico de texto simulado */
const TextLines = ({ lines = 3, short = false }: { lines?: number; short?: boolean }) => (
  <div className="space-y-1.5">
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className="h-2 rounded-full bg-muted-foreground/15"
        style={{ width: short ? `${55 + (i % 3) * 15}%` : `${70 + (i % 3) * 10}%` }}
      />
    ))}
  </div>
);

/* Bloque de imagen simulada */
const ImgBlock = ({ h = 28 }: { h?: number }) => (
  <div className={`w-full rounded bg-muted-foreground/10`} style={{ height: h }} />
);

/* El banner real o placeholder */
const BannerSlot = ({
  imageUrl,
  title,
  className,
}: {
  imageUrl: string;
  title: string;
  className: string;
}) => (
  <div className={`overflow-hidden rounded border border-primary/30 bg-muted/30 ${className}`}>
    {imageUrl ? (
      <img src={imageUrl} alt={title || "Banner"} className="h-full w-full object-cover object-center" />
    ) : (
      <div className="flex h-full w-full items-center justify-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 font-sans">
          Tu imagen aquí
        </span>
      </div>
    )}
  </div>
);

/* Header simulado */
const MockHeader = () => (
  <div className="flex items-center justify-between border-b border-border pb-1.5 mb-1.5">
    <div className="h-3 w-16 rounded bg-foreground/20" />
    <div className="flex gap-1">
      {[40, 30, 35].map((w, i) => (
        <div key={i} className="h-1.5 rounded-full bg-muted-foreground/20" style={{ width: w }} />
      ))}
    </div>
  </div>
);

export default function AdPreview({ slot, imageUrl, title }: AdPreviewProps) {
  return (
    <div className="rounded-xl border border-border bg-muted/10 p-3">
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground font-sans mb-3">
        Vista previa — posición en el sitio
      </p>

      {/* ── LEADERBOARD: bajo el header ── */}
      {slot === "leaderboard" && (
        <div className="space-y-2 text-[0px]">
          <MockHeader />
          <BannerSlot imageUrl={imageUrl} title={title} className="w-full h-8" />
          <div className="grid grid-cols-3 gap-1.5 pt-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-1">
                <ImgBlock h={22} />
                <TextLines lines={2} short />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── BANNER: entre bloques de portada ── */}
      {slot === "banner" && (
        <div className="space-y-2">
          <MockHeader />
          <div className="grid grid-cols-3 gap-1.5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-1">
                <ImgBlock h={20} />
                <TextLines lines={2} short />
              </div>
            ))}
          </div>
          <BannerSlot imageUrl={imageUrl} title={title} className="w-full h-14" />
          <div className="grid grid-cols-2 gap-1.5">
            {[1, 2].map((i) => (
              <div key={i} className="space-y-1">
                <ImgBlock h={18} />
                <TextLines lines={2} short />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── INLINE: dentro de artículo ── */}
      {slot === "inline" && (
        <div className="space-y-2">
          <MockHeader />
          <div className="h-2.5 w-3/4 rounded-full bg-foreground/20" />
          <TextLines lines={3} />
          <BannerSlot imageUrl={imageUrl} title={title} className="w-full h-8" />
          <TextLines lines={3} />
        </div>
      )}

      {/* ── SIDEBAR: lateral junto al grid ── */}
      {slot === "sidebar" && (
        <div className="space-y-2">
          <MockHeader />
          <div className="flex gap-2">
            <div className="flex-1 space-y-1.5">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-1.5">
                  <ImgBlock h={18} />
                  <TextLines lines={2} short />
                </div>
              ))}
            </div>
            <div className="w-14 shrink-0">
              <BannerSlot imageUrl={imageUrl} title={title} className="w-full h-36" />
            </div>
          </div>
        </div>
      )}

      {/* ── BOX-TOP: caja superior del sidebar ── */}
      {slot === "box-top" && (
        <div className="space-y-2">
          <MockHeader />
          <div className="flex gap-2">
            <div className="flex-1 space-y-1.5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-1">
                  <ImgBlock h={18} />
                  <TextLines lines={2} short />
                </div>
              ))}
            </div>
            <div className="w-14 shrink-0 space-y-1.5">
              <BannerSlot imageUrl={imageUrl} title={title} className="w-full h-[52px]" />
              <div className="h-2 w-full rounded bg-muted-foreground/10" />
              <div className="h-2 w-3/4 rounded bg-muted-foreground/10" />
            </div>
          </div>
        </div>
      )}

      {/* ── BOX-BOTTOM: caja inferior del sidebar ── */}
      {slot === "box-bottom" && (
        <div className="space-y-2">
          <MockHeader />
          <div className="flex gap-2">
            <div className="flex-1 space-y-1.5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-1">
                  <ImgBlock h={18} />
                  <TextLines lines={2} short />
                </div>
              ))}
            </div>
            <div className="w-14 shrink-0 space-y-1.5">
              <div className="h-2 w-full rounded bg-muted-foreground/10" />
              <div className="h-2 w-3/4 rounded bg-muted-foreground/10" />
              <BannerSlot imageUrl={imageUrl} title={title} className="w-full h-[52px]" />
            </div>
          </div>
        </div>
      )}

      {/* Etiqueta de dimensiones */}
      <p className="mt-3 text-center text-[10px] font-sans text-muted-foreground/60">
        {{
          leaderboard: "728 × 90 px — Cabecera",
          banner: "970 × 250 px — Sección media",
          inline: "728 × 90 px — Artículo",
          sidebar: "300 × 600 px — Lateral",
          "box-top": "300 × 250 px — Caja superior",
          "box-bottom": "300 × 250 px — Caja inferior",
        }[slot]}
      </p>
    </div>
  );
}
