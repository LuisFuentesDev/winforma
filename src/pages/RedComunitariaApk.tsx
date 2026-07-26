import { useEffect, useState } from "react";
import Seo from "@/components/Seo";
import "./RedComunitariaApk.css";

const FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Unbounded:wght@800&family=JetBrains+Mono:wght@400;500;700&display=swap";

type PlatformKey = "android" | "webos";

const PLATFORMS: Record<
  PlatformKey,
  { label: string; num: string; file: string; fileName: string; instructions: JSX.Element }
> = {
  android: {
    label: "Android TV / Fire TV / Celular",
    num: "01",
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
  webos: {
    label: "LG webOS",
    num: "02",
    file: "/downloads/red-comunitaria.ipk",
    fileName: "red-comunitaria.ipk",
    instructions: (
      <>
        Este instalador (<strong>.ipk</strong>) requiere <strong>Developer Mode</strong>{" "}
        activado en tu TV LG y subirlo desde el navegador del propio TV apuntando a{" "}
        <strong>http://[IP-de-tu-TV]:9998</strong>, o instalarlo vía{" "}
        <strong>ares-install</strong> desde un computador con LG webOS CLI.
      </>
    ),
  },
};

const RedComunitariaApk = () => {
  const [platform, setPlatform] = useState<PlatformKey>("android");
  const current = PLATFORMS[platform];

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

        <div className="rca-channels" role="tablist" aria-label="Plataforma">
          {(Object.keys(PLATFORMS) as PlatformKey[]).map((key) => {
            const p = PLATFORMS[key];
            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={platform === key}
                className={`rca-channel-btn${platform === key ? " active" : ""}`}
                onClick={() => setPlatform(key)}
              >
                <span className="rca-channel-num">{p.num}</span>
                {p.label}
              </button>
            );
          })}
        </div>

        <a className="rca-cta" href={current.file} key={platform}>
          Descargar {current.fileName}
          <small>Si no comienza sola, toca aquí</small>
        </a>

        <div className="rca-lowerthird">
          <strong>Instrucciones de instalación —</strong> {current.instructions}
        </div>
      </div>
    </div>
  );
};

export default RedComunitariaApk;
