import { Link } from "react-router-dom";
import { useMostRead } from "@/hooks/useMostRead";
import { getCategoryColor } from "@/lib/category-colors";

const MostRead = () => {
  const articles = useMostRead(5);

  if (!articles.length) return null;

  return (
    <section>
      <div className="flex items-center gap-3 mb-4">
        <span className="block w-3 h-3 bg-primary rotate-45 shrink-0" />
        <h3 className="text-[11px] font-black font-sans uppercase tracking-[0.2em] text-foreground">
          Más Leídas
        </h3>
      </div>
      <ol className="space-y-0 divide-y divide-border">
        {articles.map((article, i) => (
          <li key={article.slug}>
            <Link to={`/articulo/${article.slug}`} className="group flex items-start gap-3 py-3">
              <span className="text-4xl font-black font-serif text-border leading-none w-8 shrink-0 select-none mt-0.5">
                {i + 1}
              </span>
              <div className="min-w-0">
                <span className={`text-[10px] font-black font-sans uppercase tracking-[0.12em] ${getCategoryColor(article.category)}`}>
                  {article.category}
                </span>
                <p className="mt-0.5 text-sm font-bold font-serif text-foreground leading-snug group-hover:text-primary transition-colors">
                  {article.title}
                </p>
                <p className="text-[10px] text-muted-foreground font-sans mt-1">{article.time}</p>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
};

export default MostRead;
