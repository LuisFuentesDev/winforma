import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="Términos del servicio"
        description="Consulta los términos del servicio de WINFORMA y las condiciones de uso del sitio."
        path="/terminos"
        keywords={["términos", "condiciones de uso", "WINFORMA"]}
      />
      <Header />

      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <p className="text-xs font-sans text-muted-foreground uppercase tracking-widest mb-3">Legal</p>
        <h1 className="text-3xl lg:text-4xl font-black font-serif mb-2">Términos del servicio</h1>
        <p className="text-sm text-muted-foreground font-sans mb-10">Última actualización: mayo de 2026</p>

        <div className="space-y-10 text-foreground font-sans text-base leading-relaxed">

          <section>
            <p>
              Bienvenido a <strong>WINFORMA</strong> (<strong>winforma.cl</strong>). Al acceder y utilizar este sitio web, aceptas cumplir con los presentes Términos del Servicio. Si no estás de acuerdo con alguna de estas condiciones, te pedimos que no utilices el sitio.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black font-serif mb-3 pb-2 border-b border-border">1. Uso del sitio</h2>
            <p className="mb-3">Al utilizar WINFORMA te comprometes a:</p>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>Hacer un uso lícito del sitio y de sus contenidos.</li>
              <li>No reproducir, distribuir ni explotar comercialmente los contenidos sin autorización expresa.</li>
              <li>No intentar interferir con el funcionamiento técnico del sitio.</li>
              <li>No suplantar identidades ni proporcionar información falsa.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-black font-serif mb-3 pb-2 border-b border-border">2. Propiedad intelectual</h2>
            <p>
              Todos los contenidos publicados en WINFORMA — incluyendo textos, imágenes, logotipos y diseño — son propiedad de WINFORMA o de sus respectivos autores y están protegidos por la legislación chilena de propiedad intelectual. Queda prohibida su reproducción total o parcial sin autorización previa y por escrito.
            </p>
            <p className="mt-3">
              Se permite citar fragmentos de noticias con fines informativos o periodísticos, siempre que se indique la fuente y se incluya un enlace a la publicación original en winforma.cl.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black font-serif mb-3 pb-2 border-b border-border">3. Contenido de terceros</h2>
            <p>
              WINFORMA puede incluir enlaces a sitios web de terceros. Estos enlaces se proporcionan únicamente como referencia informativa. No somos responsables del contenido, políticas de privacidad ni prácticas de dichos sitios externos.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black font-serif mb-3 pb-2 border-b border-border">4. Exactitud de la información</h2>
            <p>
              WINFORMA se esfuerza por publicar información veraz y actualizada. Sin embargo, no garantizamos la exactitud, integridad o vigencia de los contenidos en todo momento. Las noticias reflejan el estado de la información al momento de su publicación.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black font-serif mb-3 pb-2 border-b border-border">5. Limitación de responsabilidad</h2>
            <p>
              WINFORMA no será responsable por daños directos, indirectos o consecuentes derivados del uso o imposibilidad de uso del sitio, incluyendo pérdidas de datos o interrupciones del servicio. El acceso al sitio se ofrece "tal como está", sin garantías de disponibilidad continua.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black font-serif mb-3 pb-2 border-b border-border">6. Publicidad</h2>
            <p>
              WINFORMA puede mostrar publicidad de terceros a través de Google AdSense u otras plataformas. Los anunciantes son responsables del contenido de sus avisos. WINFORMA no avala los productos o servicios publicitados.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black font-serif mb-3 pb-2 border-b border-border">7. Modificaciones</h2>
            <p>
              Nos reservamos el derecho de modificar estos Términos del Servicio en cualquier momento. Los cambios serán efectivos desde su publicación en esta página. El uso continuado del sitio tras la actualización implica la aceptación de los nuevos términos.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black font-serif mb-3 pb-2 border-b border-border">8. Legislación aplicable</h2>
            <p>
              Estos términos se rigen por la legislación de la República de Chile. Cualquier controversia derivada del uso del sitio se someterá a los tribunales competentes de Chile.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black font-serif mb-3 pb-2 border-b border-border">9. Contacto</h2>
            <p>
              Para consultas relacionadas con estos términos, puedes contactarnos a través de Instagram{" "}
              <a href="https://instagram.com/winforma.cl" className="text-primary hover:underline font-medium" target="_blank" rel="noreferrer">
                @winforma.cl
              </a>{" "}
              o al correo{" "}
              <a href="mailto:winforma.cl@gmail.com" className="text-primary hover:underline font-medium">
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

export default TermsOfService;
