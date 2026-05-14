import { useState } from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const categories = ["Regional", "Nacional", "Internacional", "Deportes", "Editorial"];

const Footer = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("Ingresa un correo válido.");

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      setErrorMsg("Ingresa un correo válido.");
      setStatus("error");
      return;
    }
    if (!supabase) {
      setErrorMsg("Error de conexión. Intenta más tarde.");
      setStatus("error");
      return;
    }
    setStatus("loading");
    try {
      const { error } = await supabase.functions.invoke("newsletter-subscribe", {
        body: { email: email.trim().toLowerCase() },
      });
      if (error) throw error;
      setStatus("success");
      setEmail("");
    } catch (err) {
      console.error("[newsletter] Error:", err);
      setErrorMsg("Ocurrió un error. Intenta nuevamente.");
      setStatus("error");
    }
  };

  return (
    <footer className="mt-16 border-t-4 border-foreground">

      {/* ── BANDA SUPERIOR: newsletter ── */}
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <p className="text-lg font-black font-serif leading-tight">
              Las noticias más importantes,<br />directo en tu correo.
            </p>
            <p className="text-sm opacity-75 font-sans mt-1">
              Recibe el resumen diario de WINFORMA cada mañana.
            </p>
          </div>
          {status === "success" ? (
            <p className="text-sm font-semibold font-sans opacity-90">
              ✓ Suscrito correctamente. Revisa tu bandeja.
            </p>
          ) : (
            <div>
              <form onSubmit={handleNewsletter} className="flex gap-0">
                <input
                  type="email"
                  placeholder="tucorreo@ejemplo.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
                  disabled={status === "loading"}
                  className="flex-1 bg-primary-foreground/10 border border-primary-foreground/30 text-primary-foreground placeholder:text-primary-foreground/50 px-4 py-2.5 text-sm font-sans outline-none focus:bg-primary-foreground/15 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="bg-primary-foreground text-primary px-5 py-2.5 text-[11px] font-black font-sans uppercase tracking-[0.15em] hover:opacity-90 transition-opacity disabled:opacity-60 shrink-0"
                >
                  {status === "loading" ? "..." : "Suscribirse"}
                </button>
              </form>
              {status === "error" && (
                <p className="text-xs opacity-75 font-sans mt-2">{errorMsg}</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── CUERPO DEL FOOTER ── */}
      <div className="bg-foreground text-background">
        <div className="container mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Columna 1: identidad */}
          <div>
            <p className="text-2xl font-black font-serif tracking-tight mb-2">WINFORMA</p>
            <p className="text-[11px] font-sans uppercase tracking-[0.2em] opacity-50 mb-4">
              Noticias que importan
            </p>
            <p className="text-xs font-sans opacity-60 leading-relaxed">
              Medio de comunicación digital con foco en Chile y La Araucanía.
              Cobertura regional, nacional e internacional.
            </p>
            <div className="flex gap-4 mt-5">
              <a href="https://www.facebook.com/winforma.cl" target="_blank" rel="noopener noreferrer" className="opacity-50 hover:opacity-100 transition-opacity">
                <Facebook size={18} />
              </a>
              <a href="https://www.instagram.com/winforma.cl/" target="_blank" rel="noopener noreferrer" className="opacity-50 hover:opacity-100 transition-opacity">
                <Instagram size={18} />
              </a>
              <a href="https://www.tiktok.com/@winforma" target="_blank" rel="noopener noreferrer" className="opacity-50 hover:opacity-100 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
              </a>
              <a href="https://x.com/WinformaCL" target="_blank" rel="noopener noreferrer" className="opacity-50 hover:opacity-100 transition-opacity">
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Columna 2: secciones */}
          <div>
            <p className="text-[10px] font-black font-sans uppercase tracking-[0.2em] opacity-40 mb-4">
              Secciones
            </p>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/seccion/${encodeURIComponent(cat)}`}
                    className="text-sm font-sans opacity-60 hover:opacity-100 transition-opacity"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 3: el medio + legal */}
          <div>
            <p className="text-[10px] font-black font-sans uppercase tracking-[0.2em] opacity-40 mb-4">
              El medio
            </p>
            <ul className="space-y-2 mb-6">
              <li>
                <Link to="/acerca-de" className="text-sm font-sans opacity-60 hover:opacity-100 transition-opacity">
                  Acerca de WINFORMA
                </Link>
              </li>
              <li>
                <Link to="/contacto" className="text-sm font-sans opacity-60 hover:opacity-100 transition-opacity">
                  Contacto
                </Link>
              </li>
              <li>
                <Link to="/tarifario" className="text-sm font-sans opacity-60 hover:opacity-100 transition-opacity">
                  Tarifario publicitario
                </Link>
              </li>
            </ul>
            <p className="text-[10px] font-black font-sans uppercase tracking-[0.2em] opacity-40 mb-4">
              Legal
            </p>
            <ul className="space-y-2">
              <li>
                <Link to="/politica-de-privacidad" className="text-sm font-sans opacity-60 hover:opacity-100 transition-opacity">
                  Política de privacidad
                </Link>
              </li>
              <li>
                <Link to="/terminos" className="text-sm font-sans opacity-60 hover:opacity-100 transition-opacity">
                  Términos del servicio
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="container mx-auto px-4 pb-6 border-t border-background/10 pt-4">
          <p className="text-[11px] font-sans opacity-30">
            © 2026 WINFORMA. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
