import { Link } from "react-router-dom";
import bannerHeaderPublicidad from "@/assets/banner-header.png";
import bannerEntrada from "@/assets/banner-entrada.png";
import bannerMedio from "@/assets/banner-medio.png";
import { useAds } from "@/hooks/useAds";

interface AdPlaceholderProps {
  size: "leaderboard" | "sidebar" | "box-top" | "box-bottom" | "banner" | "inline";
  className?: string;
}

const sizeMap = {
  leaderboard: { label: "728 × 90", className: "w-full aspect-[140/9] max-h-[90px]" },
  sidebar: { label: "300 × 600", className: "w-full h-[600px]" },
  "box-top": { label: "300 × 250", className: "w-full h-[250px]" },
  "box-bottom": { label: "300 × 250", className: "w-full h-[250px]" },
  banner: { label: "970 × 250", className: "w-full aspect-[28/5] max-h-[250px]" },
  inline: { label: "728 × 90", className: "w-full aspect-[364/45] max-h-[90px]" },
};

const defaultImages = {
  leaderboard: bannerHeaderPublicidad,
  banner: bannerMedio,
  inline: bannerEntrada,
};

// Placeholder visual cuando no hay imagen cargada
const AdEmptySlot = ({ size, label }: { size: AdPlaceholderProps["size"]; label: string }) => {
  const isHorizontal = size === "leaderboard" || size === "inline";

  if (isHorizontal) {
    return (
      <Link
        to="/tarifario"
        className={`${sizeMap[size].className} flex items-center justify-between gap-4 px-6
          border border-dashed border-border rounded-sm bg-muted/20
          hover:bg-muted/40 transition-colors group`}
      >
        <div className="flex items-center gap-3">
          <span className="text-base font-black tracking-tight text-foreground/30 font-serif select-none">
            W
          </span>
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/50 font-sans">
            Tu publicidad aquí
          </span>
        </div>
        <span className="text-[10px] font-semibold font-sans text-primary/50 group-hover:text-primary transition-colors whitespace-nowrap">
          Ver tarifario →
        </span>
      </Link>
    );
  }

  return (
    <Link
      to="/tarifario"
      className={`${sizeMap[size].className} flex flex-col items-center justify-center gap-3
        border border-dashed border-border rounded-sm bg-muted/20
        hover:bg-muted/40 transition-colors group`}
    >
      <span className="text-4xl font-black tracking-tight text-foreground/20 font-serif select-none">
        W
      </span>
      <div className="text-center px-4">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/50 font-sans">
          Tu publicidad aquí
        </p>
        <p className="text-[10px] text-muted-foreground/40 font-sans mt-1">
          {label}
        </p>
      </div>
      <span className="text-[11px] font-semibold font-sans text-primary/50 group-hover:text-primary transition-colors">
        Ver tarifario →
      </span>
    </Link>
  );
};

const AdPlaceholder = ({ size, className = "" }: AdPlaceholderProps) => {
  const config = sizeMap[size];
  const { data: ads = [] } = useAds();
  const ad = ads.find((item) => item.slot === size);
  const defaultImage = defaultImages[size as keyof typeof defaultImages];
  const imageUrl = ad?.image_url || defaultImage;
  const targetUrl = ad?.target_url || "/tarifario";
  const altText = ad?.title || "Banner publicitario";
  const isExternalTarget = targetUrl.startsWith("http://") || targetUrl.startsWith("https://");

  // Sin imagen → mostrar placeholder visual
  if (!imageUrl) {
    return <AdEmptySlot size={size} label={config.label} />;
  }

  const image = (
    <img
      src={imageUrl}
      alt={altText}
      className="h-full w-full object-cover object-center"
    />
  );

  if (isExternalTarget) {
    return (
      <a
        href={targetUrl}
        className={`block ${config.className} overflow-hidden rounded-sm bg-muted/20 ${className}`}
        aria-label={altText}
        target="_blank"
        rel="noreferrer"
      >
        {image}
      </a>
    );
  }

  return (
    <Link
      to={targetUrl}
      className={`block ${config.className} overflow-hidden rounded-sm bg-muted/20 ${className}`}
      aria-label={altText}
    >
      {image}
    </Link>
  );
};

export default AdPlaceholder;
