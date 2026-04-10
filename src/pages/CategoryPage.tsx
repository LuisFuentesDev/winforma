import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useArticlesByCategory } from "@/hooks/useArticles";
import Seo from "@/components/Seo";
import ArticleImage from "@/components/ArticleImage";

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const decodedCategory = decodeURIComponent(category || "");
  const { data: articles = [], isLoading } = useArticlesByCategory(decodedCategory);
  const categoryPath = `/seccion/${encodeURIComponent(decodedCategory)}`;
  const description = decodedCategory
    ? `Ultimas noticias de ${decodedCategory} en WINFORMA, con cobertura actualizada y foco editorial en Chile y La Araucania.`
    : "Cobertura temática de noticias en WINFORMA.";

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title={decodedCategory ? `${decodedCategory} noticias` : "Seccion de noticias"}
        description={description}
        path={categoryPath}
        keywords={[decodedCategory, "noticias", "WINFORMA", "Chile"]}
        schema={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: decodedCategory || "Seccion",
          description,
        }}
      />
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-black font-serif text-foreground mb-1">{decodedCategory}</h2>
        <div className="w-16 h-1 bg-primary mb-8" />

        {isLoading ? (
          <p className="text-muted-foreground font-sans">Cargando noticias...</p>
        ) : articles.length === 0 ? (
          <p className="text-muted-foreground font-sans">No hay noticias en esta sección.</p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <Link
                key={article.slug}
                to={`/articulo/${article.slug}`}
                className="group"
              >
                <div className="overflow-hidden rounded-sm mb-3">
                  <ArticleImage
                    src={article.image}
                    alt={article.title}
                    category={article.category}
                    className="w-full h-48 object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <span className="text-[11px] font-semibold font-sans uppercase tracking-wider text-primary">
                  {article.category}
                </span>
                <h3 className="text-lg font-bold font-serif text-foreground leading-snug mt-1 group-hover:underline decoration-1 underline-offset-2">
                  {article.title}
                </h3>
                <p className="text-sm text-muted-foreground font-sans mt-1 line-clamp-2">
                  {article.summary}
                </p>
                <p className="text-xs text-muted-foreground font-sans mt-2">
                  {article.author} · {article.time}
                </p>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default CategoryPage;
