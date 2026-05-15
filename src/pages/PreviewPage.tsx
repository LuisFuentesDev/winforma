import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft, Eye } from "lucide-react";
import { getCategoryBadge } from "@/lib/category-colors";
import AdPlaceholder from "@/components/AdPlaceholder";

interface PreviewData {
  title: string;
  summary: string;
  content: string;
  author: string;
  category: string;
  imageUrl: string;
  publishedAt: string;
  slug: string;
}

function sanitizeContent(content: string, title: string) {
  if (typeof window === "undefined") return content;
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, "text/html");
  const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim().toLowerCase();
  const titleText = norm(title);
  Array.from(doc.body.querySelectorAll("p, h1, h2, h3, div"))
    .filter((n) => norm(n.textContent ?? "") === titleText)
    .forEach((n) => { if (n.children.length === 0 || n.tagName !== "DIV") n.remove(); });
  return doc.body.innerHTML;
}

export default function PreviewPage() {
  const [data, setData] = useState<PreviewData | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("winforma_preview");
      if (raw) setData(JSON.parse(raw) as PreviewData);
    } catch { /* noop */ }
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16 text-center">
          <p className="text-muted-foreground font-sans">Sin datos de vista previa.</p>
          <Link to="/admin" className="mt-4 inline-block text-sm text-primary hover:underline">← Volver al dashboard</Link>
        </main>
      </div>
    );
  }

  const formattedDate = new Intl.DateTimeFormat("es-CL", {
    day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
  }).format(new Date(data.publishedAt || Date.now()));

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Banner de vista previa */}
      <div className="sticky top-0 z-50 bg-amber-500 text-amber-950 px-4 py-2 flex items-center justify-between text-sm font-sans font-semibold shadow-md">
        <div className="flex items-center gap-2">
          <Eye size={15} />
          Vista previa — no publicada
        </div>
        <button
          type="button"
          onClick={() => window.close()}
          className="rounded bg-amber-950/15 px-3 py-1 text-xs font-bold hover:bg-amber-950/25 transition-colors"
        >
          Cerrar
        </button>
      </div>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <span className={`inline-block text-xs font-bold font-sans uppercase tracking-wider px-2 py-0.5 rounded-sm mb-2 ${getCategoryBadge(data.category)}`}>
          {data.category}
        </span>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-foreground mb-4">
          {data.title || <span className="text-muted-foreground italic">Sin título</span>}
        </h1>

        <p className="text-lg text-muted-foreground font-sans leading-relaxed mb-4">
          {data.summary}
        </p>

        <div className="mb-8 border-b border-border pb-6">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground font-sans">
            <span className="font-semibold text-foreground">Por {data.author || "—"}</span>
            <span className="hidden sm:inline">·</span>
            <span>{formattedDate}</span>
          </div>
        </div>

        {data.imageUrl && (
          <div className="overflow-hidden mb-8 rounded-lg">
            <img
              src={data.imageUrl}
              alt={data.title}
              className="w-full h-64 object-cover object-top md:h-96"
            />
          </div>
        )}

        <div className="my-5 md:my-6">
          <AdPlaceholder size="inline" />
        </div>

        <div
          className="prose prose-lg max-w-none font-serif text-foreground
            [&>*:first-child]:mt-0 [&_p]:mb-5 [&_p]:leading-loose [&_p]:text-base
            [&_p:first-child]:mt-0 md:[&_p]:text-lg
            [&_h2]:text-2xl [&_h2]:font-black [&_h2]:font-serif [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:leading-tight
            [&_h3]:text-xl [&_h3]:font-bold [&_h3]:font-serif [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:leading-tight
            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-5 [&_ul_li]:mb-1.5
            [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-5 [&_ol_li]:mb-1.5
            [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-5 [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_blockquote]:my-6 [&_blockquote]:font-sans
            [&_figure]:my-8 [&_figure]:mx-0
            [&_figure_img]:w-full [&_figure_img]:rounded-lg [&_figure_img]:mb-0
            [&_figcaption]:!mt-2 [&_figcaption]:!mb-0 [&_figcaption]:!text-xs [&_figcaption]:!leading-snug [&_figcaption]:!font-sans [&_figcaption]:!not-italic [&_figcaption]:!text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: sanitizeContent(data.content, data.title) }}
        />

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
}
