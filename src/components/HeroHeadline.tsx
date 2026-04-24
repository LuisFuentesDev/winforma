import { Link } from "react-router-dom";
import { useArticles } from "@/hooks/useArticles";
import ArticleImage from "@/components/ArticleImage";
import { getCategoryColor } from "@/lib/category-colors";

const HeroHeadline = () => {
  const { data: articles = [] } = useArticles();
  const main = articles[0];
  const sub1 = articles[1];
  const sub2 = articles[2];
  const sub3 = articles[3];
  const sub4 = articles[4];

  if (!main) return null;

  return (
    <div>
      {/* ── FILA PRINCIPAL ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2px_1fr] gap-0 border-b border-border pb-6 mb-6">

        {/* Historia principal — izquierda */}
        <Link to={`/articulo/${main.slug}`} className="group pr-0 lg:pr-8">
          <div className="overflow-hidden mb-4">
            <ArticleImage
              src={main.image}
              alt={main.title}
              category={main.category}
              className="w-full h-[260px] md:h-[340px] lg:h-[420px] object-cover object-top transition-transform duration-700 group-hover:scale-[1.02]"
              loading="eager"
            />
          </div>
          <span className={`text-[10px] font-black font-sans uppercase tracking-[0.18em] ${getCategoryColor(main.category)}`}>
            {main.category}
          </span>
          <h2 className="mt-2 text-3xl md:text-4xl lg:text-5xl font-black font-serif leading-[1.1] text-foreground group-hover:text-primary transition-colors">
            {main.title}
          </h2>
          <p className="mt-3 text-base font-sans leading-relaxed text-muted-foreground">
            {main.summary}
          </p>
          <p className="mt-3 text-xs text-muted-foreground font-sans">
            Por <span className="font-semibold text-foreground">{main.author}</span> · {main.time}
          </p>
        </Link>

        {/* Divisor vertical */}
        <div className="hidden lg:block bg-border" />

        {/* Columna derecha — 3 historias secundarias */}
        <div className="lg:pl-8 space-y-0 divide-y divide-border">
          {[sub1, sub2, sub3, sub4].filter(Boolean).map((article) => (
            <Link key={article!.slug} to={`/articulo/${article!.slug}`} className="group flex gap-4 py-4 first:pt-0 last:pb-0">
              <div className="flex-1 min-w-0 order-1">
                <span className={`text-[10px] font-black font-sans uppercase tracking-[0.18em] ${getCategoryColor(article!.category)}`}>
                  {article!.category}
                </span>
                <h3 className="mt-1 text-base md:text-lg font-bold font-serif leading-snug text-foreground group-hover:text-primary transition-colors">
                  {article!.title}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground font-sans line-clamp-2 hidden sm:block">
                  {article!.summary}
                </p>
                <p className="mt-1.5 text-[11px] text-muted-foreground font-sans">{article!.time}</p>
              </div>
              <div className="w-20 h-20 md:w-24 md:h-24 shrink-0 overflow-hidden order-2">
                <ArticleImage
                  src={article!.image}
                  alt={article!.title}
                  category={article!.category}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  loading="eager"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroHeadline;
