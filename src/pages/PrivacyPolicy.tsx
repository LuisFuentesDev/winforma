import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="Política de privacidad"
        description="Consulta la política de privacidad de WINFORMA y el tratamiento de datos personales del sitio."
        path="/politica-de-privacidad"
        keywords={["privacidad", "cookies", "datos personales", "WINFORMA"]}
      />
      <Header />

      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <p className="text-xs font-sans text-muted-foreground uppercase tracking-widest mb-3">Legal</p>
        <h1 className="text-3xl lg:text-4xl font-black font-serif mb-2">Política de privacidad</h1>
        <p className="text-sm text-muted-foreground font-sans mb-10">Última actualización: abril de 2026</p>

        <div className="space-y-10 text-foreground font-sans text-base leading-relaxed">

          <section>
            <p>
              En <strong>WINFORMA</strong> nos tomamos en serio la privacidad de nuestros usuarios. Esta política describe qué información recopilamos, cómo la usamos y de qué manera la protegemos cuando visitas nuestro sitio web <strong>winforma.cl</strong>. Te recomendamos leerla detenidamente y revisarla periódicamente, ya que puede actualizarse para reflejar cambios en nuestras prácticas o en la legislación aplicable.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black font-serif mb-3 pb-2 border-b border-border">1. Información que recopilamos</h2>
            <p className="mb-3">Podemos recopilar los siguientes tipos de información:</p>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li><strong>Datos de navegación:</strong> páginas visitadas, tiempo de permanencia, frecuencia de visitas y datos estadísticos de uso, procesados de forma anónima por Google Analytics.</li>
              <li><strong>Dirección de correo electrónico:</strong> únicamente cuando te suscribes voluntariamente a nuestro boletín de noticias.</li>
              <li><strong>Datos técnicos:</strong> tipo de navegador, sistema operativo, dirección IP aproximada y resolución de pantalla, utilizados exclusivamente para análisis estadístico.</li>
            </ul>
            <p className="mt-3 text-sm">
              Los datos de navegación solo se recopilan si aceptas las cookies analíticas. Si las rechazas, Google Analytics no se ejecuta y no se recoge ningún dato de tu visita.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black font-serif mb-3 pb-2 border-b border-border">2. Uso de la información</h2>
            <p className="mb-3">La información recopilada se utiliza exclusivamente para:</p>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>Generar estadísticas internas de audiencia y rendimiento del sitio.</li>
              <li>Enviar el boletín diario de noticias a quienes se hayan suscrito voluntariamente.</li>
              <li>Mejorar los contenidos y la experiencia de navegación.</li>
              <li>Detectar y corregir errores técnicos.</li>
            </ul>
            <p className="mt-3 text-sm">
              <strong>WINFORMA no vende, cede ni comparte información personal de sus usuarios con terceros</strong> con fines comerciales.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black font-serif mb-3 pb-2 border-b border-border">3. Cookies</h2>
            <p className="mb-3">
              Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas un sitio web. WINFORMA utiliza dos tipos de cookies:
            </p>
            <ul className="list-disc pl-5 space-y-3 text-sm">
              <li>
                <strong>Cookies esenciales (siempre activas):</strong> necesarias para el correcto funcionamiento del sitio, como recordar tus preferencias de cookies. No pueden desactivarse porque el sitio no funcionaría correctamente sin ellas.
              </li>
              <li>
                <strong>Cookies analíticas (opcionales):</strong> utilizadas por <strong>Google Analytics</strong> para medir el tráfico, las páginas más visitadas y el comportamiento de navegación de forma anónima y agregada. Estos datos nos ayudan a mejorar nuestros contenidos. Google procesa esta información en sus servidores de acuerdo con su propia{" "}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-2 hover:opacity-80"
                >
                  política de privacidad
                </a>
                .
              </li>
            </ul>
            <p className="mt-4 text-sm">
              Al ingresar al sitio por primera vez, verás un banner donde puedes <strong>aceptar todas las cookies</strong>, <strong>rechazarlas</strong> o <strong>configurarlas</strong> de forma individual. Tu elección se guarda en tu navegador y puedes cambiarla en cualquier momento eliminando los datos de navegación de winforma.cl.
            </p>
            <p className="mt-3 text-sm">
              Si rechazas las cookies analíticas, Google Analytics no se ejecutará y no se recogerá ningún dato de tu visita. Las cookies esenciales seguirán activas.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black font-serif mb-3 pb-2 border-b border-border">4. Boletín de noticias</h2>
            <p>
              Si te suscribes a nuestro boletín, tu correo electrónico se almacena de forma segura y se utiliza exclusivamente para enviarte el resumen diario de noticias. Puedes cancelar tu suscripción en cualquier momento haciendo clic en el enlace de baja que aparece al pie de cada correo. Procesamos estos datos en cumplimiento de la Ley N° 19.628 sobre Protección de la Vida Privada de Chile.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black font-serif mb-3 pb-2 border-b border-border">5. Seguridad</h2>
            <p>
              Adoptamos medidas técnicas y organizativas razonables para proteger tu información frente a accesos no autorizados, pérdida o divulgación indebida. No obstante, ningún sistema de transmisión de datos por internet es completamente seguro, por lo que no podemos garantizar una seguridad absoluta.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black font-serif mb-3 pb-2 border-b border-border">6. Enlaces a sitios de terceros</h2>
            <p>
              Nuestros artículos pueden contener enlaces a sitios web externos. WINFORMA no se hace responsable de las prácticas de privacidad ni del contenido de esos sitios. Te recomendamos revisar sus respectivas políticas antes de proporcionarles cualquier dato personal.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black font-serif mb-3 pb-2 border-b border-border">7. Tus derechos</h2>
            <p className="mb-3">
              De acuerdo con la Ley N° 19.628 y sus modificaciones, tienes derecho a:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>Conocer qué datos tuyos tenemos almacenados.</li>
              <li>Solicitar la rectificación de datos inexactos.</li>
              <li>Solicitar la eliminación de tus datos cuando ya no sean necesarios.</li>
              <li>Oponerte al tratamiento de tus datos con fines distintos a los declarados.</li>
            </ul>
            <p className="mt-3 text-sm">
              Para ejercer cualquiera de estos derechos, puedes contactarnos a través de nuestras redes sociales o enviarnos un mensaje directo en Instagram{" "}
              <a
                href="https://www.instagram.com/winforma.cl/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-2 hover:opacity-80"
              >
                @winforma.cl
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black font-serif mb-3 pb-2 border-b border-border">8. Cambios en esta política</h2>
            <p>
              WINFORMA se reserva el derecho de modificar esta política de privacidad en cualquier momento. Los cambios entrarán en vigor desde el momento de su publicación en esta página. Te recomendamos revisarla periódicamente.
            </p>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
