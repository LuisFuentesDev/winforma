import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border mt-12">
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
      <div className="flex gap-4">
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

export default Footer;
