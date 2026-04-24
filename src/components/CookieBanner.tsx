import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";

const STORAGE_KEY = "winforma_cookie_consent";

interface CookiePrefs {
  analytics: boolean;
}

const loadPrefs = (): CookiePrefs | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const savePrefs = (prefs: CookiePrefs) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
};

const applyAnalytics = (enabled: boolean) => {
  if (typeof window === "undefined") return;
  (window as any).gtag?.("consent", "update", {
    analytics_storage: enabled ? "granted" : "denied",
  });
};

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    // Set default consent to denied until user chooses
    (window as any).gtag?.("consent", "default", {
      analytics_storage: "denied",
    });

    const prefs = loadPrefs();
    if (!prefs) {
      setVisible(true);
    } else {
      applyAnalytics(prefs.analytics);
    }
  }, []);

  const acceptAll = () => {
    const prefs = { analytics: true };
    savePrefs(prefs);
    applyAnalytics(true);
    setVisible(false);
    setShowModal(false);
  };

  const rejectAll = () => {
    const prefs = { analytics: false };
    savePrefs(prefs);
    applyAnalytics(false);
    setVisible(false);
    setShowModal(false);
  };

  const saveCustom = () => {
    const prefs = { analytics };
    savePrefs(prefs);
    applyAnalytics(analytics);
    setVisible(false);
    setShowModal(false);
  };

  const openModal = () => {
    setAnalytics(false);
    setShowModal(true);
  };

  if (!visible) return null;

  return (
    <>
      {/* Banner */}
      {!showModal && (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t-2 border-foreground bg-background shadow-2xl">
          <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-sans text-foreground leading-relaxed">
                Usamos cookies propias (esenciales) y analíticas (Google Analytics) para mejorar tu experiencia y medir el tráfico.{" "}
                <Link
                  to="/politica-de-privacidad"
                  className="underline underline-offset-2 hover:text-primary transition-colors"
                >
                  Más información
                </Link>
                .
              </p>
            </div>
            <div className="flex flex-wrap gap-2 shrink-0">
              <button
                onClick={openModal}
                className="px-4 py-2 text-[11px] font-black font-sans uppercase tracking-[0.15em] border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
              >
                Configurar
              </button>
              <button
                onClick={rejectAll}
                className="px-4 py-2 text-[11px] font-black font-sans uppercase tracking-[0.15em] border border-foreground text-foreground hover:bg-muted transition-colors"
              >
                Solo esenciales
              </button>
              <button
                onClick={acceptAll}
                className="px-5 py-2 text-[11px] font-black font-sans uppercase tracking-[0.15em] bg-foreground text-background hover:opacity-80 transition-opacity"
              >
                Aceptar todo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de configuración */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />
          <div className="relative bg-background border-2 border-foreground w-full sm:max-w-lg mx-0 sm:mx-4">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="text-base font-black font-serif">Configuración de cookies</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Opciones */}
            <div className="px-6 py-5 space-y-5">

              {/* Esenciales — siempre activas */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold font-sans">Cookies esenciales</p>
                  <p className="text-xs text-muted-foreground font-sans mt-1 leading-relaxed">
                    Necesarias para el funcionamiento básico del sitio. No pueden desactivarse.
                  </p>
                </div>
                <div className="shrink-0 px-3 py-1 text-[10px] font-black font-sans uppercase tracking-widest bg-muted text-muted-foreground border border-border">
                  Siempre activas
                </div>
              </div>

              <div className="border-t border-border" />

              {/* Analíticas — configurables */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold font-sans">Cookies analíticas</p>
                  <p className="text-xs text-muted-foreground font-sans mt-1 leading-relaxed">
                    Google Analytics mide el tráfico y las páginas más leídas de forma anónima. Nos ayuda a mejorar los contenidos.
                  </p>
                </div>
                <button
                  onClick={() => setAnalytics(!analytics)}
                  className={`shrink-0 w-16 h-7 relative overflow-hidden transition-colors duration-200 ${analytics ? "bg-green-500" : "bg-red-500"}`}
                  role="switch"
                  aria-checked={analytics}
                >
                  {/* Texto ON a la izquierda */}
                  <span className="absolute left-2 inset-y-0 flex items-center">
                    <span className="text-[9px] font-black text-white uppercase tracking-wider">ON</span>
                  </span>
                  {/* Texto OFF a la derecha */}
                  <span className="absolute right-2 inset-y-0 flex items-center">
                    <span className="text-[9px] font-black text-white uppercase tracking-wider">OFF</span>
                  </span>
                  {/* Cuadro blanco: tapa OFF cuando está en OFF (izq), tapa ON cuando está en ON (der) */}
                  <span
                    className={`absolute top-1 bottom-1 w-6 bg-white shadow transition-all duration-200 ${analytics ? "right-1" : "left-1"}`}
                  />
                </button>
              </div>
            </div>

            {/* Acciones */}
            <div className="flex gap-2 px-6 pb-6">
              <button
                onClick={rejectAll}
                className="flex-1 py-2.5 text-[11px] font-black font-sans uppercase tracking-[0.15em] border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
              >
                Solo esenciales
              </button>
              <button
                onClick={saveCustom}
                className="flex-1 py-2.5 text-[11px] font-black font-sans uppercase tracking-[0.15em] border border-foreground text-foreground hover:bg-muted transition-colors"
              >
                Guardar selección
              </button>
              <button
                onClick={acceptAll}
                className="flex-1 py-2.5 text-[11px] font-black font-sans uppercase tracking-[0.15em] bg-foreground text-background hover:opacity-80 transition-opacity"
              >
                Aceptar todo
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CookieBanner;
