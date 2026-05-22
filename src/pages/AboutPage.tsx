import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";

const PRINCIPIOS = [
  {
    titulo: "Independencia",
    descripcion:
      "Winforma no tiene, ni tendrá, afiliación alguna con partidos políticos, corporaciones económicas o grupos de poder. El financiamiento es transparente y diversificado, priorizando fuentes comunitarias y evitando dependencia de un solo auspiciador.",
  },
  {
    titulo: "Enfoque de derechos humanos",
    descripcion:
      "La defensa de los derechos humanos, individuales y colectivos, será el lente que analiza la realidad. Se dará voz prioritaria a grupos históricamente vulnerados: pueblo mapuche, mujeres, disidencias y comunidades rurales.",
  },
  {
    titulo: "Rigor y verificación",
    descripcion:
      "Todo hecho noticioso es verificado con al menos dos fuentes contrastables. El estándar de prueba para investigaciones que involucren denuncias de corrupción es especialmente alto.",
  },
  {
    titulo: "Transparencia",
    descripcion:
      "Corregimos errores de forma clara, pública y pronta. Cuando corresponde, explicamos al público el porqué de la pauta editorial y las decisiones de cobertura.",
  },
  {
    titulo: "Vocación comunitaria",
    descripcion:
      "La agenda no la marcan solo las instituciones, sino las necesidades e inquietudes de las comunidades. El medio actúa como plataforma de amplificación de sus voces y reivindicaciones.",
  },
];


const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="Acerca de WINFORMA"
        description="Medio de comunicación independiente del sur de Chile comprometido con los derechos humanos, la transparencia y las comunidades de La Araucanía."
        path="/acerca-de"
        keywords={["WINFORMA", "quiénes somos", "medio digital", "La Araucanía", "independencia editorial"]}
      />
      <Header />

      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-3xl lg:text-4xl font-black font-serif mb-6">Acerca de WINFORMA</h1>

        <div className="space-y-12 text-foreground font-sans text-base leading-relaxed">

          {/* Misión */}
          <section>
            <h2 className="text-xl font-black font-serif mb-3 pb-2 border-b border-border">Misión</h2>
            <p>
              Winforma es un medio de comunicación independiente de partidos políticos y grupos económicos. Nuestro propósito fundamental es servir como una plataforma para las reivindicaciones sociales y comunitarias, defendiendo activamente los derechos humanos en la región de La Araucanía y el sur de Chile.
            </p>
          </section>

          {/* Visión */}
          <section>
            <h2 className="text-xl font-black font-serif mb-3 pb-2 border-b border-border">Visión</h2>
            <p>
              Aspiramos a ser el agente de cambio que rompa la cortina informativa conservadora y ultraderechista en La Araucanía. Para ello, nos comprometemos a entregar contenidos con una perspectiva crítica que enfrente la corrupción, el clientelismo y el patronazgo heredado por siglos en la región, cumpliendo así con nuestra misión de ser una voz alternativa y al servicio de la comunidad.
            </p>
          </section>

          {/* Principios */}
          <section>
            <h2 className="text-xl font-black font-serif mb-5 pb-2 border-b border-border">Principios editoriales</h2>
            <div className="space-y-5">
              {PRINCIPIOS.map((p) => (
                <div key={p.titulo} className="flex gap-4">
                  <div className="mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0" />
                  <div>
                    <p className="font-bold text-foreground mb-1">{p.titulo}</p>
                    <p className="text-muted-foreground">{p.descripcion}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Audiencia */}
          <section>
            <h2 className="text-xl font-black font-serif mb-3 pb-2 border-b border-border">A quién nos dirigimos</h2>
            <p>
              Winforma se dirige a un público del sur de Chile hastiado de la prensa tradicional y su alineamiento con el poder. A quienes buscan información verificada, con contexto y profundidad, se identifican con las luchas sociales, ambientales y de derechos humanos, y participan activamente en sus comunidades.
            </p>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
