import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useArticles } from "@/hooks/useArticles";

const BreakingTicker = () => {
  const { data: articles = [] } = useArticles();
  const breaking = articles.filter((a) => a.breaking).slice(0, 6);
  const tickerRef = useRef<HTMLDivElement>(null);

  // Duplicate items for seamless loop
  const items = breaking.length >= 2 ? [...breaking, ...breaking] : breaking;

  useEffect(() => {
    const el = tickerRef.current;
    if (!el || items.length < 2) return;

    let animFrame: number;
    let pos = 0;
    const speed = 0.5;

    const half = el.scrollWidth / 2;

    const tick = () => {
      pos += speed;
      if (pos >= half) pos = 0;
      el.style.transform = `translateX(-${pos}px)`;
      animFrame = requestAnimationFrame(tick);
    };

    animFrame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrame);
  }, [items.length]);

  if (!breaking.length) return null;

  return (
    <div className="bg-accent text-accent-foreground overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-stretch">
          {/* Label */}
          <div className="shrink-0 flex items-center gap-1.5 pr-4 py-2 border-r border-accent-foreground/20 mr-4">
            <span className="inline-block w-2 h-2 rounded-full bg-accent-foreground animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-widest font-sans whitespace-nowrap">
              En vivo
            </span>
          </div>

          {/* Scrolling ticker */}
          <div className="flex-1 overflow-hidden py-2">
            <div ref={tickerRef} className="flex gap-12 whitespace-nowrap will-change-transform">
              {items.map((article, i) => (
                <Link
                  key={`${article.slug}-${i}`}
                  to={`/articulo/${article.slug}`}
                  className="text-[12px] font-semibold font-sans hover:underline underline-offset-2 shrink-0"
                >
                  <span className="opacity-60 mr-2">·</span>
                  {article.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreakingTicker;
