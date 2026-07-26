import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";

const APK_URL = "/downloads/red-comunitaria.apk";

const RedComunitariaApk = () => {
  useEffect(() => {
    window.location.href = APK_URL;
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="Descargar Red Comunitaria para Smart TV"
        description="Descarga el APK de Red Comunitaria: Señal Abierta Digital para instalar en tu Smart TV."
        path="/red-comunitaria-apk"
      />
      <Header />

      <main className="container mx-auto px-4 py-12 max-w-3xl text-center">
        <h1 className="text-2xl lg:text-3xl font-black font-serif mb-4">
          Descargando Red Comunitaria...
        </h1>
        <p className="text-muted-foreground font-sans mb-6">
          Si la descarga no comienza automáticamente,{" "}
          <a href={APK_URL} className="text-primary underline underline-offset-2 hover:opacity-80">
            haz clic aquí
          </a>
          .
        </p>
        <p className="text-sm text-muted-foreground font-sans">
          Instálalo desde el explorador de archivos de tu Smart TV. Si te pide habilitar "orígenes desconocidos", acepta para continuar.
        </p>
      </main>

      <Footer />
    </div>
  );
};

export default RedComunitariaApk;
