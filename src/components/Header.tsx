import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Search, Sun, Moon, Eye } from "lucide-react";
import { useAllPageViews } from "@/hooks/usePageViews";
import { useArticles } from "@/hooks/useArticles";

const categories = ["Regional", "Nacional", "Internacional", "Deportes", "Editorial"];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const totalViews = useAllPageViews();
  const { data: articles = [] } = useArticles();
  const currentDate = new Intl.DateTimeFormat("es-CL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return articles.filter(
      (a) => a.title.toLowerCase().includes(q) || a.summary.toLowerCase().includes(q) || a.category.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [articles, searchQuery]);

  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark" ||
        (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
    return false;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <header className="border-b border-border">
      {/* Top bar */}
      <div className="container mx-auto px-4 pt-3 pb-4 lg:hidden">
        <div className="relative flex items-center justify-between">
          <button
            className="text-foreground"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-2 text-center">
            <Link
              to="/"
              className="pointer-events-auto inline-block max-w-[220px] text-3xl font-black tracking-tight text-foreground hover:text-primary transition-colors"
            >
              WINFORMA
            </Link>
            <p className="absolute left-1/2 top-full z-10 w-max -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground font-sans">
              {currentDate}
            </p>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              className="text-foreground hover:text-primary transition-colors"
              onClick={() => setDark(!dark)}
              aria-label="Toggle theme"
            >
              {dark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              className="text-foreground hover:text-primary transition-colors"
              aria-label="Search"
              onClick={() => { setSearchOpen(!searchOpen); setSearchQuery(""); }}
            >
              <Search size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto hidden px-4 py-3 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center">
        <div />

        <div className="text-center lg:col-start-2">
          <Link to="/" className="text-3xl lg:text-4xl font-black tracking-tight text-foreground hover:text-primary transition-colors">
            WINFORMA
          </Link>
          <p className="text-xs text-muted-foreground font-sans mt-0.5">
            {currentDate}
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 lg:col-start-3">
          {totalViews !== null && (
            <span className="hidden sm:inline-flex items-center gap-1 text-xs text-muted-foreground font-sans">
              <Eye size={14} />
              {totalViews.toLocaleString()} visitas
            </span>
          )}
          <button
            className="text-foreground hover:text-primary transition-colors"
            onClick={() => setDark(!dark)}
            aria-label="Toggle theme"
          >
            {dark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            className="text-foreground hover:text-primary transition-colors"
            aria-label="Search"
            onClick={() => { setSearchOpen(!searchOpen); setSearchQuery(""); }}
          >
            <Search size={20} />
          </button>
        </div>
      </div>

      {/* Category nav - desktop */}
      <nav className="hidden lg:block border-t border-border">
        <div className="container mx-auto px-4">
          <ul className="flex gap-8 py-2.5">
            <li>
              <Link
                to="/"
                className="text-sm font-semibold font-sans text-foreground hover:text-primary transition-colors uppercase tracking-wide"
              >
                Inicio
              </Link>
            </li>
            {categories.map((cat) => (
              <li key={cat}>
                <Link
                  to={`/seccion/${encodeURIComponent(cat)}`}
                  className="text-sm font-semibold font-sans text-foreground hover:text-primary transition-colors uppercase tracking-wide"
                >
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>


      {/* Search overlay */}
      {searchOpen && (
        <div className="border-t border-border bg-card px-4 py-4">
          <div className="container mx-auto max-w-2xl">
            <div className="flex items-center gap-2 border border-border rounded-md px-3 py-2 bg-background">
              <Search size={16} className="text-muted-foreground shrink-0" />
              <input
                type="text"
                placeholder="Buscar noticias..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
                autoFocus
              />
              <button onClick={() => setSearchOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X size={16} />
              </button>
            </div>
            {searchResults.length > 0 && (
              <ul className="mt-2 divide-y divide-border">
                {searchResults.map((article) => (
                  <li key={article.slug}>
                    <button
                      className="w-full text-left py-2.5 hover:bg-muted/50 px-2 rounded-sm transition-colors"
                      onClick={() => {
                        setSearchOpen(false);
                        setSearchQuery("");
                        navigate(`/articulo/${article.slug}`);
                      }}
                    >
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">{article.category}</span>
                      <p className="text-sm font-bold text-foreground leading-snug">{article.title}</p>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {searchQuery.trim() && searchResults.length === 0 && (
              <p className="mt-3 text-sm text-muted-foreground text-center">No se encontraron resultados.</p>
            )}
          </div>
        </div>
      )}

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="lg:hidden border-t border-border bg-card px-4 py-4 space-y-3">
          <Link
            to="/"
            className="block text-base font-semibold font-sans text-foreground hover:text-primary uppercase tracking-wide"
            onClick={() => setMenuOpen(false)}
          >
            Inicio
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat}
              to={`/seccion/${encodeURIComponent(cat)}`}
              className="block text-base font-semibold font-sans text-foreground hover:text-primary uppercase tracking-wide"
              onClick={() => setMenuOpen(false)}
            >
              {cat}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;
