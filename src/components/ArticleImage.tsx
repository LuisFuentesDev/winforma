import { useState } from "react";
import { getFallbackImageByCategory } from "@/data/articles";
import { getOptimizedImageUrl } from "@/lib/image";

interface ArticleImageProps {
  src?: string | null;
  alt: string;
  category?: string | null;
  className?: string;
  loading?: "eager" | "lazy";
  fetchPriority?: "high" | "low" | "auto";
  /** Ancho aproximado en px al que se renderiza (para pedir la imagen a esa resolución, no la original). */
  width?: number;
}

const ArticleImage = ({ src, alt, category, className, loading = "lazy", fetchPriority, width }: ArticleImageProps) => {
  const fallbackSrc = getFallbackImageByCategory(category);
  const [currentSrc, setCurrentSrc] = useState(src || fallbackSrc);
  const displaySrc = width ? getOptimizedImageUrl(currentSrc, width) : currentSrc;

  return (
    <img
      src={displaySrc}
      alt={alt}
      className={className}
      loading={loading}
      fetchPriority={fetchPriority}
      onError={() => {
        if (currentSrc !== fallbackSrc) {
          setCurrentSrc(fallbackSrc);
        }
      }}
    />
  );
};

export default ArticleImage;
