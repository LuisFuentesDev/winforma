import { useEffect, useState } from "react";
import Seo from "@/components/Seo";
import "./RedComunitariaApk.css";

const APK_URL = "/downloads/red-comunitaria.apk";
const FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Unbounded:wght@800&family=JetBrains+Mono:wght@400;500;700&display=swap";

const RedComunitariaApk = () => {
  const [status, setStatus] = useState("SINTONIZANDO...");

  useEffect(() => {
    let link = document.querySelector<HTMLLinkElement>(`link[href="${FONTS_HREF}"]`);
    if (!link) {
      link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = FONTS_HREF;
      document.head.appendChild(link);
    }

    const found = setTimeout(() => {
      setStatus("SEÑAL ENCONTRADA — INICIANDO DESCARGA");
      window.location.href = APK_URL;
    }, 1400);

    return () => clearTimeout(found);
  }, []);

  return (
    <div className="rca">
      <Seo
        title="Descargar Red Comunitaria para Smart TV"
        description="Descarga el APK de Red Comunitaria: Señal Abierta Digital para instalar en tu Smart TV."
        path="/apk"
      />

      <div className="rca-panel">
        <div className="rca-channel">
          <span className="rca-dot" /> CANAL <b>TVD · 00</b> — SEÑAL ABIERTA DIGITAL
        </div>

        <h1 className="rca-title">Red Comunitaria</h1>
        <p className="rca-sub">
          Instalador para Smart TV. Directorio de televisión comunitaria de Chile,
          de Arica a Magallanes.
        </p>

        <div className="rca-tuning" aria-hidden="true">
          {Array.from({ length: 9 }).map((_, i) => (
            <span key={i} />
          ))}
        </div>

        <p className="rca-status">{status}</p>

        <a className="rca-cta" href={APK_URL}>
          Descargar APK
          <small>Si no comienza sola, toca aquí</small>
        </a>

        <div className="rca-lowerthird">
          <strong>Instrucciones de instalación —</strong> abre el archivo descargado desde
          el explorador de tu Smart TV. Si pide habilitar <em>"orígenes desconocidos"</em>,
          acepta para continuar con la instalación.
        </div>

        <a className="rca-back" href="/red-comunitaria">
          ← Volver a la ficha de la app
        </a>
      </div>
    </div>
  );
};

export default RedComunitariaApk;
