import { Link } from "react-router-dom";
import { useArticles } from "@/hooks/useArticles";
import { getCategoryColor } from "@/lib/category-colors";

interface LatestNewsProps {
  horizontal?: boolean;
}

const LatestNews = ({ horizontal = false }: LatestNewsProps) => {
  const { data: articles = [], isLoading } = useArticles();
  const items = articles.slice(1, horizontal ? 9 : 8);
  const skeletonCount = horizontal ? 7 : 7;

  if (isLoading) {
    return horizontal ? (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-x-4 gap-y-4 animate-pulse">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <div key={i} className="lg:px-4 lg:first:pl-0 py-1 space-y-1.5">
            <div className="h-2.5 w-16 bg-muted rounded" />
            <div className="h-3 w-full bg-muted rounded" />
            <div className="h-3 w-3/4 bg-muted rounded" />
          </div>
        ))}
      </div>
    ) : (
      <div className="animate-pulse">
        <div className="flex items-center gap-3 mb-4">
          <span className="block w-3 h-3 bg-muted rotate-45 shrink-0" />
          <div className="h-3 w-32 bg-muted rounded" />
          <div className="flex-1 border-t border-border" />
        </div>
        <ul className="divide-y divide-border">
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <li key={i} className="py-3 space-y-1.5">
              <div className="h-2.5 w-20 bg-muted rounded" />
              <div className="h-4 w-full bg-muted rounded" />
              <div className="h-2.5 w-16 bg-muted rounded" />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (horizontal) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-x-4 gap-y-4 lg:gap-y-0 lg:divide-x lg:divide-border [&>*:nth-child(n+5)]:border-t [&>*:nth-child(n+5)]:border-border [&>*:nth-child(n+5)]:pt-3 lg:[&>*:nth-child(n+5)]:border-t-0 lg:[&>*:nth-child(n+5)]:pt-0">
        {items.map((item, i) => (
          <Link key={item.slug} to={`/articulo/${item.slug}`} className={`group block lg:px-4 lg:first:pl-0 lg:last:pr-0 py-1 ${i === 7 ? "lg:hidden" : ""}`}>
            <div className="flex items-center gap-1.5 mb-1">
              {item.breaking && (
                <span className="text-[9px] font-black font-sans uppercase text-accent">● En vivo</span>
              )}
              <span className={`text-[9px] font-black font-sans uppercase tracking-[0.15em] ${getCategoryColor(item.category)}`}>
                {item.category}
              </span>
            </div>
            <p className="text-[12px] font-bold font-serif text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-3">
              {item.title}
            </p>
            <p className="text-[10px] text-muted-foreground font-sans mt-1">{item.time}</p>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <span className="block w-3 h-3 bg-primary rotate-45 shrink-0" />
        <h3 className="text-[11px] font-black font-sans uppercase tracking-[0.2em] text-foreground">
          Últimas Noticias
        </h3>
        <div className="flex-1 border-t border-border" />
      </div>
      <ul className="divide-y divide-border">
        {items.map((item) => (
          <li key={item.slug}>
            <Link to={`/articulo/${item.slug}`} className="group flex gap-3 py-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  {item.breaking && (
                    <span className="text-[9px] font-black font-sans uppercase text-accent">● En vivo</span>
                  )}
                  <span className={`text-[10px] font-black font-sans uppercase tracking-[0.12em] ${getCategoryColor(item.category)}`}>
                    {item.category}
                  </span>
                </div>
                <p className="text-sm font-bold font-serif text-foreground leading-snug group-hover:text-primary transition-colors">
                  {item.title}
                </p>
                <p className="text-[10px] text-muted-foreground font-sans mt-1">{item.time}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LatestNews;
