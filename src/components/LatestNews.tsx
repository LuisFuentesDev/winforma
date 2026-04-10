import { Link } from "react-router-dom";
import { useArticles } from "@/hooks/useArticles";

const LatestNews = () => {
  const { data: articles = [] } = useArticles();
  const latestItems = articles.slice(1, 7);

  return (
    <div>
      <h3 className="text-lg font-bold text-foreground mb-3 pb-2 border-b-2 border-foreground">
        Últimas Noticias
      </h3>
      <ul className="divide-y divide-border">
        {latestItems.map((item) => (
          <li key={item.slug} className="py-3 group cursor-pointer">
            <Link to={`/articulo/${item.slug}`}>
              <div className="flex items-center gap-2 mb-1">
                {item.breaking && (
                  <span className="text-[10px] font-bold font-sans uppercase tracking-wider text-accent bg-accent/10 px-1.5 py-0.5 rounded-sm">
                    En vivo
                  </span>
                )}
                <span className="text-[11px] font-semibold font-sans uppercase tracking-wider text-primary">
                  {item.category}
                </span>
              </div>
              <p className="text-sm font-serif font-bold text-foreground leading-snug group-hover:underline decoration-1 underline-offset-2">
                {item.title}
              </p>
              <p className="text-[11px] text-muted-foreground font-sans mt-1">{item.time}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LatestNews;
