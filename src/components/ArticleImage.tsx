import { useState } from "react";
import { getFallbackImageByCategory } from "@/data/articles";

interface ArticleImageProps {
  src?: string | null;
  alt: string;
  category?: string | null;
  className?: string;
  loading?: "eager" | "lazy";
}

const ArticleImage = ({ src, alt, category, className, loading = "lazy" }: ArticleImageProps) => {
  const fallbackSrc = getFallbackImageByCategory(category);
  const [currentSrc, setCurrentSrc] = useState(src || fallbackSrc);

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      loading={loading}
      onError={() => {
        if (currentSrc !== fallbackSrc) {
          setCurrentSrc(fallbackSrc);
        }
      }}
    />
  );
};

export default ArticleImage;
