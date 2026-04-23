import { useState } from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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
    <footer className="border-t border-border mt-12">
      {/* Newsletter strip */}
      <div className="bg-muted border-b border-border">
        <div className="container mx-auto px-4 py-8 max-w-xl text-center">
          <p className="text-sm font-bold font-serif text-foreground mb-1">
            Recibe las noticias más importantes
          </p>
          <p className="text-xs text-muted-foreground font-sans mb-4">
            Suscríbete y mantente informado sin salir de tu bandeja de entrada.
          </p>
          {status === "success" ? (
            <p className="text-sm text-primary font-semibold font-sans">
              ¡Gracias! Revisa tu bandeja de entrada.
            </p>
          ) : (
            <form onSubmit={handleNewsletter} className="flex gap-2 justify-center">
              <input
                type="email"
                placeholder="tucorreo@ejemplo.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
                disabled={status === "loading"}
                className="flex-1 max-w-xs border border-border rounded-sm px-3 py-2 text-sm bg-background text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="bg-primary text-primary-foreground text-sm font-semibold font-sans px-4 py-2 rounded-sm hover:opacity-90 transition-opacity shrink-0 disabled:opacity-60"
              >
                {status === "loading" ? "Enviando..." : "Suscribirse"}
              </button>
            </form>
          )}
          {status === "error" && (
            <p className="text-xs text-destructive font-sans mt-2">
              {errorMsg}
            </p>
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="container mx-auto px-4 py-6 flex flex-col items-center gap-3 text-xs text-muted-foreground font-sans">
        <div className="flex gap-4 items-center">
          <a href="https://www.facebook.com/winforma.cl" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
            <Facebook size={20} />
          </a>
          <a href="https://www.instagram.com/winforma.cl/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
            <Instagram size={20} />
          </a>
          <a href="https://www.tiktok.com/@winforma" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
          </a>
          <a href="https://x.com/WinformaCL" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
            <Twitter size={20} />
          </a>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/tarifario" className="hover:text-primary transition-colors underline">
            Tarifario
          </Link>
          <Link to="/politica-de-privacidad" className="hover:text-primary transition-colors underline">
            Políticas de Privacidad
          </Link>
        </div>
        <span>© 2026 WINFORMA. Todos los derechos reservados.</span>
      </div>
    </footer>
  );
};

export default Footer;
