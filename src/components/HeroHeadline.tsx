import { Link } from "react-router-dom";
import { useArticles } from "@/hooks/useArticles";
import ArticleImage from "@/components/ArticleImage";

const HeroHeadline = () => {
  const { data: articles = [] } = useArticles();
  const heroArticle = articles[0];

  if (!heroArticle) return null;

  return (
    <Link to={`/articulo/${heroArticle.slug}`}>
      <article className="group cursor-pointer">
        <div className="overflow-hidden">
          <ArticleImage
            src={heroArticle.image}
            alt={heroArticle.title}
            category={heroArticle.category}
            className="w-full h-64 object-cover object-top transition-transform duration-500 group-hover:scale-[1.03] md:h-80 lg:h-[420px]"
            loading="eager"
          />
        </div>
        <div className="mt-4">
          <span className="text-xs font-semibold font-sans uppercase tracking-wider text-primary">
            {heroArticle.category}
          </span>
          <h2 className="mt-1.5 text-2xl md:text-3xl lg:text-4xl font-bold leading-tight text-foreground group-hover:underline decoration-2 underline-offset-4">
            {heroArticle.title}
          </h2>
          <p className="mt-3 text-base font-sans leading-[1.6] text-muted-foreground">
            {heroArticle.summary}
          </p>
          <p className="mt-2 text-xs text-muted-foreground font-sans">
            Por {heroArticle.author} · {heroArticle.time}
          </p>
        </div>
      </article>
    </Link>
  );
};

export default HeroHeadline;
