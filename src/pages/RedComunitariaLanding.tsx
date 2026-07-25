import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";

const RedComunitariaLanding = () => {
  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="Red Comunitaria: Señal Abierta Digital"
        description="Directorio y reproductor de canales de TV comunitaria abierta de Chile, ordenados de norte a sur, para ver en vivo desde tu TV."
        path="/red-comunitaria"
        keywords={["red comunitaria", "tv comunitaria", "tv digital", "tvd chile", "canales comunitarios", "streaming chile"]}
      />
      <Header />

      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <p className="text-xs font-sans text-muted-foreground uppercase tracking-widest mb-3">App para TV</p>
        <h1 className="text-3xl lg:text-4xl font-black font-serif mb-2">
          Red Comunitaria: Señal Abierta Digital
        </h1>
        <p className="text-muted-foreground font-sans mb-10 text-base leading-relaxed">
          Directorio y reproductor de canales de televisión digital comunitaria (TVD) de Chile, pensado para verse cómodamente desde el sillón con el control remoto de tu TV.
        </p>

        <div className="space-y-10 text-foreground font-sans text-base leading-relaxed">

          <section>
            <h2 className="text-lg font-black font-serif mb-3 pb-2 border-b border-border">Qué es</h2>
            <p>
              Red Comunitaria reúne, en un solo lugar, las señales públicas de canales de TV comunitaria de todo Chile: desde Arica hasta Magallanes. Navega la lista de canales verificados, mira la previsualización en vivo con audio, y entra a pantalla completa con un clic.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black font-serif mb-3 pb-2 border-b border-border">Características</h2>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>Lista de canales agrupada por región, de norte a sur.</li>
              <li>Previsualización en vivo con audio antes de entrar a pantalla completa.</li>
              <li>Navegación 100% con el control remoto — sin necesidad de mouse ni teclado.</li>
              <li>Indicador de estado en vivo / sin señal en tiempo real.</li>
              <li>Interfaz oscura pensada para verse bien en cualquier sala.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-black font-serif mb-3 pb-2 border-b border-border">Sobre los canales</h2>
            <p>
              Los canales listados son señales públicas y abiertas, operadas de forma independiente por cada organización comunitaria. Red Comunitaria no aloja ni es dueña de ese contenido — solo facilita el acceso a los streams que cada canal ya transmite abiertamente.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black font-serif mb-3 pb-2 border-b border-border">Más información</h2>
            <p>
              ¿Dudas, problemas técnicos o quieres sumar tu canal al directorio? Visita nuestra página de{" "}
              <a href="/red-comunitaria-soporte" className="text-primary underline underline-offset-2 hover:opacity-80">
                soporte técnico
              </a>
              , o revisa la{" "}
              <a href="/red-comunitaria-privacidad" className="text-primary underline underline-offset-2 hover:opacity-80">
                política de privacidad
              </a>
              {" "}y los{" "}
              <a href="/red-comunitaria-terminos" className="text-primary underline underline-offset-2 hover:opacity-80">
                términos de uso
              </a>
              .
            </p>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RedComunitariaLanding;
