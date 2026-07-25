import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";

const RedComunitariaSupport = () => {
  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="Soporte técnico — Red Comunitaria: Señal Abierta Digital"
        description="Soporte técnico de la app Red Comunitaria: Señal Abierta Digital, directorio y reproductor de canales de TV comunitaria abierta de Chile."
        path="/red-comunitaria-soporte"
        keywords={["red comunitaria", "soporte", "tv comunitaria", "tvd chile"]}
        noIndex
      />
      <Header />

      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <p className="text-xs font-sans text-muted-foreground uppercase tracking-widest mb-3">Legal</p>
        <h1 className="text-3xl lg:text-4xl font-black font-serif mb-2">
          Soporte técnico — Red Comunitaria: Señal Abierta Digital
        </h1>
        <p className="text-sm text-muted-foreground font-sans mb-10">Última actualización: 25 de julio de 2026</p>

        <div className="space-y-10 text-foreground font-sans text-base leading-relaxed">

          <section>
            <p>
              ¿Un canal no carga, la app se cierra o algo no funciona como esperabas? Escríbenos y te ayudamos a resolverlo.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black font-serif mb-3 pb-2 border-b border-border">Contacto</h2>
            <p>
              Para reportar problemas técnicos, canales caídos o cualquier consulta sobre la app, escribe a{" "}
              <a
                href="mailto:winforma.cl@gmail.com"
                className="text-primary underline underline-offset-2 hover:opacity-80"
              >
                winforma.cl@gmail.com
              </a>
              . Respondemos en un plazo de 1 a 3 días hábiles.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black font-serif mb-3 pb-2 border-b border-border">Antes de escribir</h2>
            <p className="mb-3">Para ayudarte más rápido, indícanos:</p>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>Qué canal presenta el problema (o si afecta a toda la app).</li>
              <li>Qué dispositivo/TV estás usando.</li>
              <li>Qué mensaje o comportamiento ves exactamente.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-black font-serif mb-3 pb-2 border-b border-border">Sobre las señales de los canales</h2>
            <p>
              Los canales listados son operados de forma independiente por cada organización comunitaria — si una señal está caída, suele deberse al servidor del propio canal, no a la app. Igual repórtanos el canal para que lo revisemos o lo marquemos como no disponible.
            </p>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RedComunitariaSupport;
