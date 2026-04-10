import { Link } from "react-router-dom";
import bannerHeaderPublicidad from "@/assets/banner-header.png";
import bannerEntrada from "@/assets/banner-entrada.png";
import bannerMedio from "@/assets/banner-medio.png";

interface AdPlaceholderProps {
  size: "leaderboard" | "sidebar" | "banner" | "inline";
  className?: string;
}

const sizeMap = {
  leaderboard: { label: "728 × 90", className: "w-full aspect-[140/9] max-h-[90px]" },
  sidebar: { label: "300 × 600", className: "w-full max-w-[300px] h-[600px]" },
  banner: { label: "970 × 250", className: "w-full aspect-[28/5] max-h-[250px]" },
  inline: { label: "728 × 90", className: "w-full aspect-[364/45] max-h-[90px]" },
};

const AdPlaceholder = ({ size, className = "" }: AdPlaceholderProps) => {
  const config = sizeMap[size];

  if (size === "leaderboard") {
    return (
      <Link
        to="/tarifario"
        className={`block ${config.className} overflow-hidden rounded-md bg-muted/20 ${className}`}
        aria-label="Ver tarifario publicitario"
      >
        <img
          src={bannerHeaderPublicidad}
          alt="Banner publicitario"
          className="h-full w-full object-contain object-center"
        />
      </Link>
    );
  }

  if (size === "banner") {
    return (
      <Link
        to="/tarifario"
        className={`block ${config.className} overflow-hidden rounded-md bg-muted/20 ${className}`}
        aria-label="Ver tarifario publicitario"
      >
        <img
          src={bannerMedio}
          alt="Banner publicitario"
          className="h-full w-full object-contain object-center"
        />
      </Link>
    );
  }

  if (size === "inline") {
    return (
      <Link
        to="/tarifario"
        className={`block ${config.className} overflow-hidden rounded-md bg-muted/20 ${className}`}
        aria-label="Ver tarifario publicitario"
      >
        <img
          src={bannerEntrada}
          alt="Banner publicitario"
          className="h-full w-full object-contain object-center"
        />
      </Link>
    );
  }

  return (
    <div
      className={`${config.className} border-2 border-dashed border-border rounded-md flex items-center justify-center bg-muted/20 ${className}`}
    >
      <div className="text-center">
        <p className="text-xs font-semibold text-muted-foreground/50 uppercase tracking-wider font-sans">
          Espacio publicitario
        </p>
        <p className="text-[10px] text-muted-foreground/40 font-sans mt-0.5">
          {config.label}
        </p>
      </div>
    </div>
  );
};

export default AdPlaceholder;
