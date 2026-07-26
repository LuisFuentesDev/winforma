import { useEffect } from "react";
import Seo from "@/components/Seo";
import "./RedComunitariaApk.css";

const APK_URL = "/downloads/red-comunitaria.apk";
const FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Unbounded:wght@800&family=JetBrains+Mono:wght@400;500;700&display=swap";

const RedComunitariaApk = () => {
  useEffect(() => {
    let link = document.querySelector<HTMLLinkElement>(`link[href="${FONTS_HREF}"]`);
    if (!link) {
      link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = FONTS_HREF;
      document.head.appendChild(link);
    }

    window.location.href = APK_URL;
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

        <p className="rca-status">SEÑAL ENCONTRADA — DESCARGANDO</p>

        <a className="rca-cta" href={APK_URL}>
          Descargar APK
          <small>Si no comienza sola, toca aquí</small>
        </a>

        <div className="rca-lowerthird">
          <strong>Instrucciones de instalación —</strong> si tu TV pide habilitar{" "}
          <em>"orígenes desconocidos"</em>, actívalo y luego abre la app{" "}
          <strong>Descargas</strong> (o el explorador de archivos) de tu Smart TV: ahí vas a
          encontrar <strong>red-comunitaria.apk</strong> para tocarlo e instalarlo. El
          navegador no retoma la instalación solo después de ese paso.
        </div>
      </div>
    </div>
  );
};

export default RedComunitariaApk;
