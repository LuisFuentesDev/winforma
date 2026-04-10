import { Link } from "react-router-dom";
import type { Article } from "@/data/articles";
import { useArticles } from "@/hooks/useArticles";
import ArticleImage from "@/components/ArticleImage";

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
        <span className="text-[11px] font-semibold font-sans uppercase tracking-wider text-primary">
          {article.category}
        </span>
        <h3 className="mt-1 text-lg font-bold leading-snug text-foreground group-hover:underline decoration-1 underline-offset-2">
          {article.title}
        </h3>
        <p className="mt-2 text-sm font-sans leading-[1.6] text-muted-foreground">
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
  const secondaryArticles = articles.slice(6);

  return (
    <section>
      <h3 className="text-lg font-bold text-foreground mb-4 pb-2 border-b-2 border-foreground">
        Más Noticias
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {secondaryArticles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </section>
  );
};

export default SecondaryGrid;
