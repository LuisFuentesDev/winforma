import { Link } from "react-router-dom";
import { useMostRead } from "@/hooks/useMostRead";

const MostRead = () => {
  const articles = useMostRead(5);

  if (!articles.length) return null;

  return (
    <section>
      <h3 className="text-lg font-bold text-foreground mb-4 pb-2 border-b-2 border-foreground">
        Más Leídas
      </h3>
      <ol className="space-y-0 divide-y divide-border">
        {articles.map((article, i) => (
          <li key={article.slug}>
            <Link
              to={`/articulo/${article.slug}`}
              className="flex items-start gap-4 py-3 group"
            >
              <span className="text-3xl font-black text-border leading-none w-8 shrink-0 select-none">
                {i + 1}
              </span>
              <div className="min-w-0">
                <span className="text-[10px] font-semibold font-sans uppercase tracking-wider text-primary block mb-0.5">
                  {article.category}
                </span>
                <p className="text-sm font-bold font-serif text-foreground leading-snug group-hover:underline decoration-1 underline-offset-2">
                  {article.title}
                </p>
                <p className="text-[11px] text-muted-foreground font-sans mt-1">{article.time}</p>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
};

export default MostRead;
