import { useState } from "react";
import { Link } from "react-router-dom";
import type { Article } from "@/data/articles";
import { useArticles } from "@/hooks/useArticles";
import ArticleImage from "@/components/ArticleImage";
import { getCategoryColor } from "@/lib/category-colors";

const PAGE_SIZE = 9;

// Artículo destacado — ocupa 2 columnas en desktop
const FeaturedCard = ({ article }: { article: Article }) => (
  <Link to={`/articulo/${article.slug}`} className="md:col-span-2">
    <article className="group cursor-pointer border-t border-border pt-4 md:flex md:gap-6">
      <div className="overflow-hidden md:w-[55%] shrink-0">
        <ArticleImage
          src={article.image}
          alt={article.title}
          category={article.category}
          className="w-full h-52 md:h-64 object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
          loading="lazy"
        />
      </div>
      <div className="mt-3 md:mt-0 md:flex md:flex-col md:justify-center">
        <span className={`text-[11px] font-bold font-sans uppercase tracking-wider ${getCategoryColor(article.category)}`}>
          {article.category}
        </span>
        <h3 className="mt-1 text-xl md:text-2xl font-bold leading-snug text-foreground group-hover:underline decoration-1 underline-offset-2">
          {article.title}
        </h3>
        <p className="mt-2 text-sm font-sans leading-[1.6] text-muted-foreground line-clamp-3">
          {article.summary}
        </p>
        <p className="mt-2 text-xs text-muted-foreground font-sans">
          Por {article.author} · {article.time}
        </p>
      </div>
    </article>
  </Link>
);

const ArticleCard = ({ article }: { article: Article }) => (
  <Link to={`/articulo/${article.slug}`}>
    <article className="group cursor-pointer border-t border-border pt-4">
      <div className="overflow-hidden">
        <ArticleImage
          src={article.image}
          alt={article.title}
          category={article.category}
          className="w-full h-44 object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
          loading="lazy"
        />
      </div>
      <div className="mt-3">
        <span className={`text-[11px] font-bold font-sans uppercase tracking-wider ${getCategoryColor(article.category)}`}>
          {article.category}
        </span>
        <h3 className="mt-1 text-lg font-bold leading-snug text-foreground group-hover:underline decoration-1 underline-offset-2">
          {article.title}
        </h3>
        <p className="mt-2 text-sm font-sans leading-[1.6] text-muted-foreground line-clamp-2">
          {article.summary}
        </p>
        <p className="mt-2 text-xs text-muted-foreground font-sans">
          Por {article.author} · {article.time}
        </p>
      </div>
    </article>
  </Link>
);

const SecondaryGrid = () => {
  const { data: articles = [] } = useArticles();
  const [limit, setLimit] = useState(PAGE_SIZE);
  const pool = articles.slice(6);
  const visible = pool.slice(0, limit);
  const hasMore = limit < pool.length;

  if (!visible.length) return null;

  const [featured, ...rest] = visible;

  return (
    <section>
      <h3 className="text-lg font-bold text-foreground mb-4 pb-2 border-b-2 border-foreground">
        Más Noticias
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <FeaturedCard article={featured} />
        {rest.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
      {hasMore && (
        <div className="mt-10 text-center">
          <button
            onClick={() => setLimit((l) => l + PAGE_SIZE)}
            className="inline-flex items-center gap-2 border border-border rounded-sm px-6 py-2.5 text-sm font-semibold font-sans text-foreground hover:bg-muted transition-colors"
          >
            Cargar más noticias
          </button>
        </div>
      )}
    </section>
  );
};

export default SecondaryGrid;
