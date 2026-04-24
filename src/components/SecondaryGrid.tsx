import { useState } from "react";
import { Link } from "react-router-dom";
import type { Article } from "@/data/articles";
import { useArticles } from "@/hooks/useArticles";
import ArticleImage from "@/components/ArticleImage";
import { getCategoryColor } from "@/lib/category-colors";

const PAGE_SIZE = 9;

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-3 mb-5">
    <span className="block w-3 h-3 bg-primary rotate-45 shrink-0" />
    <h3 className="text-[11px] font-black font-sans uppercase tracking-[0.2em] text-foreground">
      {children}
    </h3>
    <div className="flex-1 border-t border-border" />
  </div>
);

// Card con imagen arriba
const CardVertical = ({ article }: { article: Article }) => (
  <Link to={`/articulo/${article.slug}`} className="group block">
    <div className="overflow-hidden mb-3">
      <ArticleImage
        src={article.image}
        alt={article.title}
        category={article.category}
        className="w-full h-44 object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
        loading="lazy"
      />
    </div>
    <span className={`text-[10px] font-black font-sans uppercase tracking-[0.15em] ${getCategoryColor(article.category)}`}>
      {article.category}
    </span>
    <h3 className="mt-1 text-[15px] font-bold font-serif leading-snug text-foreground group-hover:text-primary transition-colors">
      {article.title}
    </h3>
    <p className="mt-1.5 text-xs font-sans leading-relaxed text-muted-foreground line-clamp-2">
      {article.summary}
    </p>
    <p className="mt-1.5 text-[10px] text-muted-foreground font-sans">
      {article.author} · {article.time}
    </p>
  </Link>
);

// Card horizontal compacta
const CardHorizontal = ({ article }: { article: Article }) => (
  <Link to={`/articulo/${article.slug}`} className="group flex gap-3 py-3 border-b border-border last:border-0">
    <div className="w-[72px] h-[72px] shrink-0 overflow-hidden">
      <ArticleImage
        src={article.image}
        alt={article.title}
        category={article.category}
        className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />
    </div>
    <div className="min-w-0">
      <span className={`text-[10px] font-black font-sans uppercase tracking-[0.15em] ${getCategoryColor(article.category)}`}>
        {article.category}
      </span>
      <h3 className="mt-0.5 text-sm font-bold font-serif leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2">
        {article.title}
      </h3>
      <p className="text-[10px] text-muted-foreground font-sans mt-0.5">{article.time}</p>
    </div>
  </Link>
);

// Card destacada — imagen grande con titular grande
const CardFeatured = ({ article }: { article: Article }) => (
  <Link to={`/articulo/${article.slug}`} className="group block">
    <div className="overflow-hidden mb-4">
      <ArticleImage
        src={article.image}
        alt={article.title}
        category={article.category}
        className="w-full h-56 md:h-72 object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
        loading="lazy"
      />
    </div>
    <span className={`text-[10px] font-black font-sans uppercase tracking-[0.15em] ${getCategoryColor(article.category)}`}>
      {article.category}
    </span>
    <h3 className="mt-1.5 text-xl md:text-2xl font-black font-serif leading-tight text-foreground group-hover:text-primary transition-colors">
      {article.title}
    </h3>
    <p className="mt-2 text-sm font-sans leading-relaxed text-muted-foreground line-clamp-3">
      {article.summary}
    </p>
    <p className="mt-2 text-[10px] text-muted-foreground font-sans">
      {article.author} · {article.time}
    </p>
  </Link>
);

const SecondaryGrid = () => {
  const { data: articles = [] } = useArticles();
  const [limit, setLimit] = useState(PAGE_SIZE);
  const pool = articles.slice(4); // hero usa 0-3
  const visible = pool.slice(0, limit);
  const hasMore = limit < pool.length;

  if (!visible.length) return null;

  const row1 = visible.slice(0, 4);     // 4 columnas iguales
  const featured = visible[4];           // 1 destacada
  const row2list = visible.slice(5, 9); // lista a la derecha de featured
  const row3 = visible.slice(9);        // horizontales finales

  return (
    <section>
      {/* ── FILA 1: 4 columnas tipo periódico ── */}
      {row1.length > 0 && (
        <div className="mb-8">
          <SectionLabel>Más noticias</SectionLabel>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 col-rule">
            {row1.map((a) => (
              <div key={a.slug} className="pr-6 first:pl-0">
                <CardVertical article={a} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── FILA 2: Destacada + lista ── */}
      {featured && (
        <div className="mb-8 pt-8 border-t border-border grid grid-cols-1 md:grid-cols-[1.4fr_2px_1fr] gap-0">
          <div className="pr-0 md:pr-8 mb-6 md:mb-0">
            <CardFeatured article={featured} />
          </div>
          <div className="hidden md:block bg-border" />
          {row2list.length > 0 && (
            <div className="md:pl-8">
              <SectionLabel>También hoy</SectionLabel>
              <div>
                {row2list.map((a) => (
                  <CardHorizontal key={a.slug} article={a} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── FILA 3: Lista horizontal 2 columnas ── */}
      {row3.length > 0 && (
        <div className="pt-8 border-t border-border mb-6">
          <SectionLabel>Más recientes</SectionLabel>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            {row3.map((a) => (
              <CardHorizontal key={a.slug} article={a} />
            ))}
          </div>
        </div>
      )}

      {hasMore && (
        <div className="mt-8 text-center border-t border-border pt-8">
          <button
            onClick={() => setLimit((l) => l + PAGE_SIZE)}
            className="inline-flex items-center gap-2 bg-foreground text-background px-8 py-3 text-[11px] font-black font-sans uppercase tracking-[0.2em] hover:bg-primary transition-colors"
          >
            Cargar más
          </button>
        </div>
      )}
    </section>
  );
};

export default SecondaryGrid;
