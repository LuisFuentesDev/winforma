import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";

const RedComunitariaPrivacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="Política de privacidad — Red Comunitaria: Señal Abierta Digital"
        description="Política de privacidad de la app Red Comunitaria: Señal Abierta Digital, directorio y reproductor de canales de TV comunitaria abierta de Chile."
        path="/red-comunitaria-privacidad"
        keywords={["red comunitaria", "privacidad", "tv comunitaria", "tvd chile"]}
        noIndex
      />
      <Header />

      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <p className="text-xs font-sans text-muted-foreground uppercase tracking-widest mb-3">Legal</p>
        <h1 className="text-3xl lg:text-4xl font-black font-serif mb-2">
          Política de privacidad — Red Comunitaria: Señal Abierta Digital
        </h1>
        <p className="text-sm text-muted-foreground font-sans mb-10">Última actualización: 25 de julio de 2026</p>

        <div className="space-y-10 text-foreground font-sans text-base leading-relaxed">

          <section>
            <p>
              <strong>Red Comunitaria: Señal Abierta Digital</strong> ("la app") es una aplicación para televisores que permite ver, en un solo lugar, las señales de streaming públicas de canales de televisión digital comunitaria (TVD) de Chile.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black font-serif mb-3 pb-2 border-b border-border">1. Datos que recopilamos</h2>
            <p>
              <strong>Ninguno.</strong> La app no tiene cuentas de usuario, no usa analíticas, no usa rastreadores de terceros y no recopila, almacena ni transmite ningún dato personal del usuario.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black font-serif mb-3 pb-2 border-b border-border">2. Conexión a internet</h2>
            <p className="mb-3">La app usa internet únicamente para:</p>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>Cargar la lista de canales incluida en la propia app.</li>
              <li>Reproducir el stream de video/audio del canal que el usuario elige ver, conectándose directamente al servidor del canal correspondiente (o a su iframe embebido).</li>
            </ul>
            <p className="mt-3 text-sm">
              Esa conexión de streaming es entre el dispositivo del usuario y el servidor del canal de TV — Red Comunitaria no actúa como intermediario, no registra qué canales ve el usuario ni por cuánto tiempo.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black font-serif mb-3 pb-2 border-b border-border">3. Contenido de terceros</h2>
            <p>
              Los canales listados son señales públicas y abiertas de televisión comunitaria chilena, operadas por terceros independientes. Red Comunitaria no es dueña de ese contenido ni lo aloja — solo facilita el acceso a las URLs públicas de streaming que cada canal ya transmite abiertamente. La disponibilidad y calidad de cada señal depende del canal emisor, no de esta app.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black font-serif mb-3 pb-2 border-b border-border">4. Permisos de la app</h2>
            <p>
              La app solicita únicamente el permiso de <strong>Internet</strong>, necesario para cargar y reproducir los streams. No solicita acceso a cámara, micrófono, contactos, ubicación ni almacenamiento.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black font-serif mb-3 pb-2 border-b border-border">5. Menores de edad</h2>
            <p>
              La app no está dirigida específicamente a menores de edad y no recopila datos de ningún usuario, sin importar su edad.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black font-serif mb-3 pb-2 border-b border-border">6. Cambios a esta política</h2>
            <p>
              Si esta política cambia, la fecha de "última actualización" arriba se actualizará. Los cambios se reflejarán en esta misma página.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black font-serif mb-3 pb-2 border-b border-border">7. Contacto</h2>
            <p>
              Para preguntas sobre esta política, contactar a{" "}
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

export default RedComunitariaPrivacy;
