import { useEffect } from "react";
import Seo from "@/components/Seo";
import "./RedComunitariaApk.css";

const FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Unbounded:wght@800&family=JetBrains+Mono:wght@400;500;700&display=swap";

const PLATFORMS = [
  {
    key: "android",
    num: "01",
    label: "Android TV / Fire TV / Celular",
    file: "/downloads/red-comunitaria.apk",
    fileName: "red-comunitaria.apk",
    instructions: (
      <>
        Si tu TV pide habilitar <em>"orígenes desconocidos"</em>, actívalo y luego abre la
        app <strong>Descargas</strong> (o el explorador de archivos): ahí vas a encontrar{" "}
        <strong>red-comunitaria.apk</strong> para tocarlo e instalarlo. El navegador no
        retoma la instalación solo después de ese paso.
      </>
    ),
  },
  {
    key: "webos",
    num: "02",
    label: "LG webOS",
    file: "/downloads/red-comunitaria.ipk",
    fileName: "red-comunitaria.ipk",
    instructions: (
      <>
        1. Busca e instala la app <strong>Developer Mode</strong> en el LG Content Store de
        tu TV. 2. Ábrela, crea una cuenta LG gratis si te la pide, y actívala. 3. Desde ahí
        mismo puedes instalar este archivo <strong>.ipk</strong> directo en tu TV.
      </>
    ),
  },
] as const;

const RedComunitariaApk = () => {
  useEffect(() => {
    let link = document.querySelector<HTMLLinkElement>(`link[href="${FONTS_HREF}"]`);
    if (!link) {
      link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = FONTS_HREF;
      document.head.appendChild(link);
    }
  }, []);

  return (
    <div className="rca">
      <Seo
        title="Descargar Red Comunitaria para Smart TV"
        description="Descarga el instalador de Red Comunitaria: Señal Abierta Digital para Android TV, Fire TV o LG webOS."
        path="/apk"
      />

      <div className="rca-panel">
        <div className="rca-channel">
          <span className="rca-dot" /> SEÑAL ABIERTA DIGITAL — ELEGIR PLATAFORMA
        </div>

        <h1 className="rca-title">Red Comunitaria</h1>
        <p className="rca-sub">
          Directorio de televisión comunitaria de Chile, de Arica a Magallanes. Elige tu
          plataforma para descargar el instalador.
        </p>

        <div className="rca-cards">
          {PLATFORMS.map((p) => (
            <a key={p.key} className="rca-card" href={p.file}>
              <span className="rca-card-num">{p.num}</span>
              <span className="rca-card-body">
                <span className="rca-card-label">{p.label}</span>
                <span className="rca-card-instructions">{p.instructions}</span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RedComunitariaApk;
