import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="Acerca de WINFORMA"
        description="Conoce a WINFORMA, el medio digital de noticias regionales, nacionales e internacionales comprometido con la información veraz y oportuna."
        path="/acerca-de"
        keywords={["WINFORMA", "quiénes somos", "medio digital", "noticias Chile"]}
      />
      <Header />

      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <p className="text-xs font-sans text-muted-foreground uppercase tracking-widest mb-3">El medio</p>
        <h1 className="text-3xl lg:text-4xl font-black font-serif mb-10">Acerca de WINFORMA</h1>

        <div className="space-y-10 text-foreground font-sans text-base leading-relaxed">

          <section>
            <p>
              <strong>WINFORMA</strong> es un medio de comunicación digital independiente dedicado a entregar noticias veraces, oportunas y de calidad sobre la realidad regional, nacional e internacional. Nació con la convicción de que la ciudadanía merece información rigurosa, accesible y libre de sesgos editoriales.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black font-serif mb-3 pb-2 border-b border-border">Nuestra misión</h2>
            <p>
              Informar con responsabilidad y transparencia, priorizando el interés público por sobre cualquier otro. Creemos en el periodismo como servicio a la comunidad: un espacio donde los hechos importan, las fuentes se verifican y las historias que moldean nuestra realidad encuentran un lugar para ser contadas.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black font-serif mb-3 pb-2 border-b border-border">Cobertura</h2>
            <p>
              Cubrimos las principales noticias de Chile y el mundo, con especial atención a la realidad regional. Nuestras secciones abarcan política, economía, deportes, cultura y reportajes de profundidad sobre los temas que más afectan a las personas.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black font-serif mb-3 pb-2 border-b border-border">Independencia editorial</h2>
            <p>
              WINFORMA es un medio independiente. Nuestras decisiones editoriales no están condicionadas por intereses políticos ni comerciales. La publicidad que aparece en el sitio contribuye a sostener el trabajo periodístico, pero no influye en los contenidos que publicamos.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black font-serif mb-3 pb-2 border-b border-border">Contacto</h2>
            <p>
              Si tienes una denuncia, una historia que contar o simplemente quieres comunicarte con nuestro equipo, puedes hacerlo a través de nuestra{" "}
              <a href="/contacto" className="text-primary font-semibold hover:underline">
                página de contacto
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

export default AboutPage;
