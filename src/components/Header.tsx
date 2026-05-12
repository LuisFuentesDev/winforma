import { useState, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, Search, Sun, Moon, Eye } from "lucide-react";
import { useAllPageViews } from "@/hooks/usePageViews";
import { useArticles } from "@/hooks/useArticles";
import { useThemePreference } from "@/hooks/useThemePreference";

const categories = ["Regional", "Nacional", "Internacional", "Deportes", "Reportajes", "Editorial"];
const extraLinks = [{ label: "Tarifario", href: "/tarifario" }];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const totalViews = useAllPageViews();
  const { data: articles = [] } = useArticles();
  const { dark, setDark } = useThemePreference();

  const currentDate = new Intl.DateTimeFormat("es-CL", {
    weekday: "long",
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

  return (
    <header>
      {/* ── TOP STRIP ── */}
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-1.5 flex items-center justify-between gap-4">
          <span className="text-[11px] font-sans font-medium capitalize tracking-wide opacity-90">
            {currentDate}
          </span>

          <span className="text-[11px] font-black font-sans uppercase tracking-[0.25em] opacity-70 hidden md:block">
            Noticias que importan
          </span>

          <div className="flex items-center gap-4 ml-auto sm:ml-0">
            {totalViews !== null && totalViews > 0 && (
              <span className="inline-flex items-center gap-1 text-[11px] font-sans opacity-75">
                <Eye size={11} />
                {totalViews.toLocaleString()}
              </span>
            )}
            <button onClick={() => setDark(!dark)} aria-label="Toggle theme" className="opacity-75 hover:opacity-100 transition-opacity">
              {dark ? <Sun size={14} /> : <Moon size={14} />}
            </button>
            <button aria-label="Search" onClick={() => { setSearchOpen(!searchOpen); setSearchQuery(""); }} className="opacity-75 hover:opacity-100 transition-opacity">
              <Search size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ── MASTHEAD ── */}
      <div className="border-b-4 border-foreground">
        <div className="container mx-auto px-4 py-5 flex items-center justify-between lg:justify-center">

          {/* Mobile: hamburger */}
          <button className="lg:hidden text-foreground" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Logotype */}
          <Link to="/" className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-[-0.03em] text-foreground hover:text-primary transition-colors font-serif">
            WINFORMA
          </Link>

          {/* Mobile: search shortcut */}
          <button className="lg:hidden text-foreground" onClick={() => { setSearchOpen(!searchOpen); setSearchQuery(""); }}>
            <Search size={20} />
          </button>
        </div>
      </div>

      {/* ── CATEGORY NAV — desktop ── */}
      <nav className="hidden lg:block border-b border-border bg-background sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4">
          <ul className="flex items-center gap-0 py-0">
            <li>
              <Link
                to="/"
                className={`inline-block px-4 py-3 text-[12px] font-bold font-sans uppercase tracking-[0.12em] transition-colors border-b-2 ${
                  location.pathname === "/"
                    ? "border-primary text-primary"
                    : "border-transparent text-foreground hover:text-primary"
                }`}
              >
                Inicio
              </Link>
            </li>
            {categories.map((cat) => {
              const href = `/seccion/${encodeURIComponent(cat)}`;
              const active = location.pathname === href;
              return (
                <li key={cat}>
                  <Link
                    to={href}
                    className={`inline-block px-4 py-3 text-[12px] font-bold font-sans uppercase tracking-[0.12em] transition-colors border-b-2 ${
                      active
                        ? "border-primary text-primary"
                        : "border-transparent text-foreground hover:text-primary"
                    }`}
                  >
                    {cat}
                  </Link>
                </li>
              );
            })}
            <li className="ml-auto">
              {extraLinks.map(({ label, href }) => {
                const active = location.pathname === href;
                return (
                  <Link
                    key={href}
                    to={href}
                    className={`inline-block px-4 py-3 text-[12px] font-bold font-sans uppercase tracking-[0.12em] transition-colors border-b-2 ${
                      active ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-primary"
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}
            </li>
          </ul>
        </div>
      </nav>

      {/* ── MOBILE MENU ── */}
      <div className={`lg:hidden bg-background border-b border-border overflow-hidden transition-all duration-200 ease-in-out ${menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="container mx-auto px-4 py-4 space-y-1">
          <Link to="/" className={`block py-2 text-sm font-bold font-sans uppercase tracking-widest ${location.pathname === "/" ? "text-primary" : "text-foreground"}`} onClick={() => setMenuOpen(false)}>
            Inicio
          </Link>
          {categories.map((cat) => {
            const href = `/seccion/${encodeURIComponent(cat)}`;
            return (
              <Link key={cat} to={href} className={`block py-2 text-sm font-bold font-sans uppercase tracking-widest ${location.pathname === href ? "text-primary" : "text-foreground"}`} onClick={() => setMenuOpen(false)}>
                {cat}
              </Link>
            );
          })}
          <div className="pt-2 border-t border-border">
            {extraLinks.map(({ label, href }) => (
              <Link key={href} to={href} className="block py-2 text-sm font-bold font-sans uppercase tracking-widest text-muted-foreground" onClick={() => setMenuOpen(false)}>
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── SEARCH OVERLAY ── */}
      {searchOpen && (
        <div className="border-b border-border bg-muted/30 px-4 py-4">
          <div className="container mx-auto max-w-2xl">
            <div className="flex items-center gap-2 border border-foreground/20 px-3 py-2 bg-background">
              <Search size={15} className="text-muted-foreground shrink-0" />
              <input
                type="text"
                placeholder="Buscar noticias..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground font-sans"
                autoFocus
              />
              <button onClick={() => setSearchOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X size={15} />
              </button>
            </div>
            {searchResults.length > 0 && (
              <ul className="mt-2 divide-y divide-border bg-background border border-border">
                {searchResults.map((article) => (
                  <li key={article.slug}>
                    <button
                      className="w-full text-left py-3 px-3 hover:bg-muted/50 transition-colors"
                      onClick={() => { setSearchOpen(false); setSearchQuery(""); navigate(`/articulo/${article.slug}`); }}
                    >
                      <span className="text-[10px] font-bold uppercase tracking-widest text-primary font-sans">{article.category}</span>
                      <p className="text-sm font-bold text-foreground leading-snug font-serif">{article.title}</p>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {searchQuery.trim() && searchResults.length === 0 && (
              <p className="mt-3 text-sm text-muted-foreground text-center font-sans">No se encontraron resultados.</p>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
