import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdPlaceholder from "@/components/AdPlaceholder";
import { ArrowLeft, Eye, Share2, ChevronRight } from "lucide-react";
import { formatArticleDate } from "@/data/articles";
import { usePageViews } from "@/hooks/usePageViews";
import { useArticle, useArticles } from "@/hooks/useArticles";
import { useState } from "react";
import Seo, { ORGANIZATION_ID, PUBLISHER, SITE_URL, WEBSITE_ID } from "@/components/Seo";
import ArticleImage from "@/components/ArticleImage";

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function sanitizeArticleContent(content: string, title: string) {
  if (typeof window === "undefined") return content;

  const parser = new DOMParser();
  const doc = parser.parseFromString(content, "text/html");
  const titleText = normalizeText(title);

  const removableNodes = Array.from(doc.body.querySelectorAll("p, h1, h2, h3, div")).filter(
    (node) => normalizeText(node.textContent ?? "") === titleText,
  );

  for (const node of removableNodes) {
    if (node.children.length === 0 || node.tagName !== "DIV") {
      node.remove();
    }
  }

  return doc.body.innerHTML;
}

const ArticlePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: article, isLoading, isError } = useArticle(slug);
  const { data: allArticles = [] } = useArticles();
  const viewCount = usePageViews(slug ? `article-${slug}` : "");
  const [shareLabel, setShareLabel] = useState("Compartir");

  const handleShare = async () => {
    if (!article || typeof window === "undefined") return;

    const shareUrl = `${window.location.origin}/share/${encodeURIComponent(article.slug)}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: article.title,
          text: article.summary,
          url: shareUrl,
        });
        return;
      }

      await navigator.clipboard.writeText(shareUrl);
      setShareLabel("Link copiado");
      window.setTimeout(() => setShareLabel("Compartir"), 2000);
    } catch {
      setShareLabel("No se pudo compartir");
      window.setTimeout(() => setShareLabel("Compartir"), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16 text-center">
          <p className="text-muted-foreground font-sans">Cargando artículo...</p>
        </main>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">No se pudo cargar el artículo</h2>
          <p className="text-muted-foreground font-sans mb-4">
            Intenta nuevamente en unos momentos.
          </p>
          <Link to="/" className="text-primary hover:underline font-sans">
            ← Volver al inicio
          </Link>
        </main>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Seo
          title="Artículo no encontrado"
          description="La noticia solicitada no está disponible en WINFORMA."
          path={slug ? `/articulo/${slug}` : "/articulo"}
          noIndex
        />
        <Header />
        <main className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Artículo no encontrado</h2>
          <Link to="/" className="text-primary hover:underline font-sans">
            ← Volver al inicio
          </Link>
        </main>
      </div>
    );
  }

  const articlePath = `/articulo/${article.slug}`;
  const articleTitle = `${article.title} | ${article.category}`;
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      PUBLISHER,
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: SITE_URL,
        name: "WINFORMA",
        inLanguage: "es-CL",
        publisher: {
          "@id": ORGANIZATION_ID,
        },
      },
      {
        "@type": "NewsArticle",
        headline: article.title,
        description: article.summary,
        image: [article.image.startsWith("http") ? article.image : `${SITE_URL}${article.image}`],
        datePublished: article.publishedAt,
        dateModified: article.publishedAt,
        articleSection: article.category,
        isAccessibleForFree: true,
        author: {
          "@type": "Person",
          name: article.author,
        },
        publisher: {
          "@id": ORGANIZATION_ID,
        },
        mainEntityOfPage: `${SITE_URL}${articlePath}`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title={articleTitle}
        description={article.summary}
        path={articlePath}
        image={article.image}
        type="article"
        author={article.author}
        keywords={[article.category, article.author, "noticias", "WINFORMA", "Chile"]}
        schema={schema}
      />
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs font-sans text-muted-foreground mb-6 flex-wrap">
          <Link to="/" className="hover:text-primary transition-colors">Inicio</Link>
          <ChevronRight size={12} className="shrink-0" />
          <Link
            to={`/seccion/${encodeURIComponent(article.category)}`}
            className="hover:text-primary transition-colors"
          >
            {article.category}
          </Link>
          <ChevronRight size={12} className="shrink-0" />
          <span className="text-foreground line-clamp-1">{article.title}</span>
        </nav>

        <span className="block text-xs font-semibold font-sans uppercase tracking-wider text-primary mb-2">
          {article.category}
        </span>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-foreground mb-4">
          {article.title}
        </h1>

        <p className="text-lg text-muted-foreground font-sans leading-relaxed mb-4">
          {article.summary}
        </p>

        <div className="mb-8 border-b border-border pb-6">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground font-sans">
            <span className="font-semibold text-foreground">Por {article.author}</span>
            <span className="hidden sm:inline">·</span>
            <span>{formatArticleDate(article.publishedAt)}</span>
          {viewCount !== null && (
            <>
              <span className="hidden sm:inline">·</span>
              <span className="inline-flex items-center gap-1">
                <Eye size={14} />
                {viewCount > 0 ? viewCount.toLocaleString() : "—"} visitas
              </span>
            </>
          )}
            <span className="hidden sm:inline">·</span>
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 text-primary hover:text-primary/80 transition-colors"
            >
              <Share2 size={14} />
              {shareLabel}
            </button>
          </div>
        </div>

        <div className="overflow-hidden mb-8">
          <ArticleImage
            src={article.image}
            alt={article.title}
            category={article.category}
            className="w-full h-64 object-cover object-top md:h-96"
          />
        </div>

        {/* Ad: Inline en artículo */}
        <div className="my-5 md:my-6">
          <AdPlaceholder size="inline" />
        </div>

        <div
          className="prose prose-lg max-w-none font-serif text-foreground
            [&>*:first-child]:mt-0 [&_p]:mb-5 [&_p]:leading-loose [&_p]:text-base
            [&_p:first-child]:mt-0 md:[&_p]:text-lg"
          dangerouslySetInnerHTML={{ __html: sanitizeArticleContent(article.content, article.title) }}
        />

        {/* Related articles */}
        {(() => {
          const related = allArticles
            .filter((a) => a.category === article.category && a.slug !== article.slug)
            .slice(0, 3);
          if (!related.length) return null;
          return (
            <section className="mt-12 pt-8 border-t border-border">
              <h3 className="text-lg font-bold font-serif text-foreground mb-6 pb-2 border-b-2 border-foreground">
                También en {article.category}
              </h3>
              <div className="grid gap-6 sm:grid-cols-3">
                {related.map((rel) => (
                  <Link key={rel.slug} to={`/articulo/${rel.slug}`} className="group">
                    <ArticleImage
                      src={rel.image}
                      alt={rel.title}
                      category={rel.category}
                      className="w-full h-36 object-cover object-top mb-3 transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                    <p className="text-sm font-bold font-serif text-foreground leading-snug group-hover:underline decoration-1 underline-offset-2">
                      {rel.title}
                    </p>
                    <p className="text-[11px] text-muted-foreground font-sans mt-1">{rel.time}</p>
                  </Link>
                ))}
              </div>
            </section>
          );
        })()}

        {/* Back to home */}
        <div className="mt-10 pt-6 border-t border-border">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-sans text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft size={16} />
            Volver al inicio
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ArticlePage;
