import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";

const RedComunitariaTerms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="Términos de uso — Red Comunitaria: Señal Abierta Digital"
        description="Términos de uso de la app Red Comunitaria: Señal Abierta Digital, directorio y reproductor de canales de TV comunitaria abierta de Chile."
        path="/red-comunitaria-terminos"
        keywords={["red comunitaria", "terminos de uso", "tv comunitaria", "tvd chile"]}
        noIndex
      />
      <Header />

      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <p className="text-xs font-sans text-muted-foreground uppercase tracking-widest mb-3">Legal</p>
        <h1 className="text-3xl lg:text-4xl font-black font-serif mb-2">
          Términos de uso — Red Comunitaria: Señal Abierta Digital
        </h1>
        <p className="text-sm text-muted-foreground font-sans mb-10">Última actualización: 25 de julio de 2026</p>

        <div className="space-y-10 text-foreground font-sans text-base leading-relaxed">

          <section>
            <p>
              Al usar <strong>Red Comunitaria: Señal Abierta Digital</strong> ("la app"), aceptas los siguientes términos.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black font-serif mb-3 pb-2 border-b border-border">1. Qué es la app</h2>
            <p>
              Red Comunitaria es un directorio que organiza y facilita el acceso a señales de streaming públicas de canales de televisión digital comunitaria (TVD) de Chile. La app no transmite contenido propio: solo enlaza a los streams que cada canal ya transmite abiertamente en internet.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black font-serif mb-3 pb-2 border-b border-border">2. Contenido de terceros</h2>
            <p>
              Los canales listados son operados por organizaciones independientes, ajenas a Red Comunitaria. No somos dueños de ese contenido, no lo alojamos ni lo moderamos, y no garantizamos su disponibilidad, continuidad ni calidad — dependen exclusivamente del canal emisor. La inclusión de un canal en el directorio no implica afiliación ni respaldo de esa organización hacia la app.
            </p>
            <p className="mt-3 text-sm">
              Si un canal deja de transmitir, cambia su URL de streaming o presenta contenido inapropiado, contáctanos (ver abajo) para revisar o retirar esa entrada del directorio.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black font-serif mb-3 pb-2 border-b border-border">3. Uso permitido</h2>
            <p>
              La app se ofrece gratuitamente para uso personal y no comercial. No está permitido redistribuir, revender ni reempaquetar la app o su directorio de canales sin autorización.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black font-serif mb-3 pb-2 border-b border-border">4. Sin garantías</h2>
            <p>
              La app se entrega "tal cual", sin garantías de funcionamiento ininterrumpido. La disponibilidad de cada señal puede variar o fallar por causas fuera de nuestro control.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black font-serif mb-3 pb-2 border-b border-border">5. Cambios a estos términos</h2>
            <p>
              Si estos términos cambian, la fecha de "última actualización" arriba se actualizará.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black font-serif mb-3 pb-2 border-b border-border">6. Contacto</h2>
            <p>
              Para preguntas sobre estos términos, contactar a{" "}
              <a
                href="mailto:winforma.cl@gmail.com"
                className="text-primary underline underline-offset-2 hover:opacity-80"
              >
                winforma.cl@gmail.com
              </a>.
            </p>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RedComunitariaTerms;
