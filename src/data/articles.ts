import type { Tables } from "@/integrations/supabase/types";
import heroImage from "@/assets/hero-news.jpg";
import sportImg from "@/assets/news-sports.jpg";
import politicsImg from "@/assets/news-politics.jpg";
import intlImg from "@/assets/news-international.jpg";
import regionalImg from "@/assets/news-regional.jpg";
import techImg from "@/assets/news-tech.jpg";

export interface Article {
  slug: string;
  image: string;
  category: string;
  title: string;
  summary: string;
  author: string;
  time: string;
  content: string;
  breaking?: boolean;
  publishedAt?: string;
}

export type SupabaseArticle = Tables<"articles">;

export const allArticles: Article[] = [
  {
    slug: "masiva-movilizacion-ciudadana",
    image: heroImage,
    category: "Nacional",
    title: "Masiva movilización ciudadana exige reformas estructurales en todo el país",
    summary: "Cientos de miles de personas salieron a las calles en las principales ciudades para demandar cambios profundos en la política económica y social del gobierno.",
    author: "María García",
    time: "Hace 2 horas",
    content: `<p>Cientos de miles de personas salieron a las calles en las principales ciudades del país para demandar cambios profundos en la política económica y social del gobierno. La movilización, considerada la más grande de la última década, reunió a sindicatos, organizaciones estudiantiles y colectivos ciudadanos bajo un mismo objetivo: exigir reformas estructurales que garanticen mayor equidad y transparencia.</p>
<p>Las marchas comenzaron desde las primeras horas de la mañana en al menos 15 ciudades. En la capital, la columna principal partió desde la Plaza de la República y recorrió más de cinco kilómetros hasta llegar al Congreso Nacional, donde los manifestantes entregaron un pliego petitorio con diez demandas concretas.</p>
<p>Entre las principales exigencias se encuentran la reforma al sistema de pensiones, el fortalecimiento del sistema de salud pública, una revisión integral de la política fiscal y mayor inversión en educación. Los organizadores también pidieron mecanismos de rendición de cuentas más estrictos para funcionarios públicos.</p>
<p>"No es una marcha contra un partido, es una marcha por el futuro del país", declaró una de las voceras del movimiento durante un discurso frente al Congreso. "Queremos un país donde las oportunidades no dependan del código postal donde naciste".</p>
<p>Las autoridades reportaron que la jornada transcurrió de manera pacífica, con presencia policial moderada y sin incidentes mayores. El gobierno emitió un comunicado señalando que "respeta el derecho a la manifestación" y que "estudiará las propuestas presentadas".</p>`,
  },
  {
    slug: "cumbre-climatica-acuerdo-historico",
    image: intlImg,
    category: "Internacional",
    title: "Cumbre climática alcanza acuerdo histórico sobre emisiones de carbono",
    summary: "Líderes de más de 190 países firmaron un pacto vinculante para reducir las emisiones de carbono en un 50% para 2035.",
    author: "Roberto Díaz",
    time: "Hace 25 min",
    content: `<p>En una sesión maratónica que se extendió hasta la madrugada, líderes de más de 190 países lograron un acuerdo histórico para reducir las emisiones de carbono en un 50% para 2035. El pacto, considerado el más ambicioso desde el Acuerdo de París, establece mecanismos vinculantes y sanciones comerciales para los países que no cumplan sus compromisos.</p>
<p>El acuerdo incluye un fondo de transición energética de 500 mil millones de dólares destinado a países en desarrollo, así como la eliminación gradual de subsidios a combustibles fósiles en economías avanzadas antes de 2030.</p>
<p>Expertos en cambio climático calificaron el resultado como "un punto de inflexión" en la lucha contra el calentamiento global, aunque algunos activistas señalaron que las metas aún son insuficientes para limitar el aumento de temperatura a 1.5 grados centígrados.</p>`,
    breaking: true,
  },
  {
    slug: "seleccion-clasifica-mundial",
    image: sportImg,
    category: "Deportes",
    title: "Selección nacional clasifica al Mundial tras victoria agónica en los descuentos",
    summary: "Un gol en el minuto 93 selló la clasificación del equipo nacional a la próxima Copa del Mundo.",
    author: "Carlos Mendoza",
    time: "Hace 1 hora",
    content: `<p>La selección nacional logró su boleto a la próxima Copa del Mundo de la manera más dramática posible: con un gol en el minuto 93 que desató la euforia en un estadio repleto con más de 70 mil aficionados.</p>
<p>El encuentro parecía destinado al empate cuando el delantero centro recibió un pase filtrado desde la media cancha y, con una definición precisa, venció al arquero rival para sellar el resultado 2-1.</p>
<p>El director técnico, visiblemente emocionado, declaró en la conferencia de prensa: "Este equipo tiene corazón. Nunca dejaron de creer, y eso se refleja en la cancha".</p>`,
  },
  {
    slug: "congreso-ley-transparencia",
    image: politicsImg,
    category: "Nacional",
    title: "El Congreso aprueba nueva ley de transparencia con amplio respaldo bipartidista",
    summary: "La legislación obliga a todos los organismos públicos a publicar información detallada sobre contratos y gastos.",
    author: "Ana López",
    time: "Hace 1 hora",
    content: `<p>Con 342 votos a favor y solo 28 en contra, el Congreso aprobó la nueva Ley de Transparencia y Acceso a la Información Pública, que establece estándares sin precedentes para la rendición de cuentas gubernamental.</p>
<p>La nueva legislación obliga a todos los organismos públicos a publicar información detallada sobre contratos, gastos operativos y salarios de funcionarios en plataformas digitales accesibles para cualquier ciudadano.</p>
<p>Además, se crea una Agencia Nacional de Transparencia con autonomía presupuestaria y capacidad sancionadora para investigar posibles irregularidades en el manejo de recursos públicos.</p>`,
  },
  {
    slug: "metro-moderno-region",
    image: regionalImg,
    category: "Regional",
    title: "Inauguran el sistema de metro más moderno de la región en la capital del estado",
    summary: "El nuevo sistema cuenta con trenes eléctricos de última generación y estaciones diseñadas con criterios de sostenibilidad.",
    author: "Lucía Herrera",
    time: "Hace 2 horas",
    content: `<p>La capital del estado inauguró oficialmente su nuevo sistema de metro, considerado el más moderno de la región. Con una inversión de más de 3 mil millones de dólares, el proyecto incluye tres líneas que conectan los principales corredores urbanos.</p>
<p>Los trenes, completamente eléctricos y fabricados con tecnología de última generación, tienen capacidad para transportar a más de 500 mil pasajeros diarios. Las estaciones fueron diseñadas bajo criterios de sostenibilidad, con paneles solares y sistemas de captación de agua pluvial.</p>`,
  },
  {
    slug: "democracia-ciudadanos-informados",
    image: techImg,
    category: "Editorial",
    title: "La democracia necesita ciudadanos informados, no espectadores pasivos",
    summary: "Una reflexión sobre el papel fundamental del periodismo independiente en la construcción de sociedades más justas.",
    author: "Fernando Ruiz",
    time: "Hace 3 horas",
    content: `<p>En tiempos donde la desinformación se propaga más rápido que la verdad, el papel del periodismo independiente cobra una relevancia que no puede ser subestimada. La democracia, como sistema de gobierno, solo funciona cuando los ciudadanos tienen acceso a información veraz y oportuna.</p>
<p>No basta con tener derecho al voto si ese voto se ejerce desde la ignorancia o la manipulación. La democracia real exige ciudadanos que cuestionen, que investiguen, que no se conformen con titulares sensacionalistas ni con narrativas prefabricadas.</p>
<p>El desafío no es solo para los medios de comunicación, sino para toda la sociedad. Cada uno de nosotros tiene la responsabilidad de buscar fuentes confiables, contrastar información y resistir la tentación de compartir contenido sin verificar.</p>`,
  },
  {
    slug: "clasico-polemica-arbitral",
    image: sportImg,
    category: "Deportes",
    title: "El clásico termina con polémica arbitral y un gol en el último minuto",
    summary: "La definición del torneo se pospone tras un partido cargado de tensión y controversia en el estadio nacional.",
    author: "Carlos Mendoza",
    time: "Hace 4 horas",
    content: `<p>El clásico del fútbol nacional dejó más controversia que fútbol. Un gol anulado por el VAR en el minuto 78 y un penal señalado en tiempo de descuento generaron protestas airadas de ambos equipos y sus respectivas aficiones.</p>
<p>El árbitro central fue escoltado fuera del estadio bajo protección policial, mientras las directivas de ambos clubes anunciaron que presentarán recursos ante la comisión disciplinaria.</p>`,
  },
  {
    slug: "infraestructura-transporte-publico",
    image: politicsImg,
    category: "Nacional",
    title: "Nuevo plan de infraestructura promete transformar el transporte público",
    summary: "El gobierno presentó un ambicioso proyecto que busca modernizar la red de transporte en las 10 ciudades más grandes.",
    author: "Ana López",
    time: "Hace 5 horas",
    content: `<p>El gobierno federal presentó un plan de infraestructura por 12 mil millones de dólares que promete transformar el transporte público en las 10 ciudades más pobladas del país en los próximos cinco años.</p>
<p>El proyecto incluye la construcción de nuevas líneas de metro y tranvía, la electrificación de las flotas de autobuses y la implementación de sistemas inteligentes de gestión de tráfico.</p>`,
  },
  {
    slug: "tensiones-comerciales-transporte-aereo",
    image: intlImg,
    category: "Internacional",
    title: "Tensiones comerciales elevan los precios del transporte aéreo global",
    summary: "Las nuevas tarifas y restricciones entre bloques económicos impactan directamente en el costo de los vuelos internacionales.",
    author: "Roberto Díaz",
    time: "Hace 6 horas",
    content: `<p>Las crecientes tensiones comerciales entre las principales potencias económicas están teniendo un impacto directo en el sector de la aviación civil. Los precios de los boletos de avión internacionales han aumentado en promedio un 23% en los últimos seis meses.</p>
<p>Las aerolíneas han tenido que absorber costos adicionales derivados de nuevas tarifas sobre combustible de aviación y restricciones de sobrevuelo, trasladando parte de estos incrementos a los pasajeros.</p>`,
  },
  {
    slug: "mercados-locales-agricultura-sostenible",
    image: regionalImg,
    category: "Regional",
    title: "Mercados locales se reinventan con agricultura sostenible y comercio justo",
    summary: "Productores rurales adoptan prácticas orgánicas que ya están transformando la economía de comunidades enteras.",
    author: "Lucía Herrera",
    time: "Hace 7 horas",
    content: `<p>En las comunidades rurales del sur del país, una revolución silenciosa está transformando la manera en que se produce y comercializa la comida. Más de 200 cooperativas agrícolas han adoptado prácticas de agricultura orgánica y comercio justo en los últimos dos años.</p>
<p>Los resultados son alentadores: los ingresos de los productores han aumentado en promedio un 40%, mientras que el uso de agroquímicos se ha reducido en un 60%. Los mercados locales, que antes luchaban por sobrevivir, ahora atraen a compradores de toda la región.</p>`,
  },
  {
    slug: "inteligencia-artificial-etica",
    image: techImg,
    category: "Editorial",
    title: "La inteligencia artificial plantea preguntas éticas que no podemos ignorar",
    summary: "Expertos debaten sobre los límites y regulaciones necesarias para el desarrollo responsable de la tecnología.",
    author: "Fernando Ruiz",
    time: "Hace 8 horas",
    content: `<p>El avance vertiginoso de la inteligencia artificial ha puesto sobre la mesa preguntas que la sociedad no puede seguir posponiendo. ¿Hasta dónde debe llegar la automatización? ¿Quién es responsable cuando un algoritmo toma una decisión que afecta la vida de las personas?</p>
<p>Un panel de expertos reunidos esta semana en el Foro Internacional de Tecnología y Sociedad coincidió en que la regulación no debe frenar la innovación, pero sí establecer límites claros para proteger los derechos fundamentales.</p>`,
  },
  {
    slug: "promesa-atletismo-record",
    image: sportImg,
    category: "Deportes",
    title: "Joven promesa del atletismo rompe récord nacional en los 100 metros planos",
    summary: "Con apenas 19 años, la velocista se posiciona como la favorita para representar al país en competencias internacionales.",
    author: "Paula Martín",
    time: "Hace 9 horas",
    content: `<p>Con un tiempo de 10.82 segundos, la velocista de 19 años rompió el récord nacional en los 100 metros planos durante el Campeonato Nacional de Atletismo. La marca anterior, que se mantenía vigente desde 2018, fue superada por tres centésimas de segundo.</p>
<p>"Todavía no me lo creo", declaró la atleta entre lágrimas tras cruzar la meta. "He trabajado toda mi vida para este momento y sé que aún puedo mejorar".</p>`,
  },
  {
    slug: "mercados-globales-politicas-comerciales",
    image: intlImg,
    category: "Internacional",
    title: "Mercados globales reaccionan a las nuevas políticas comerciales entre potencias",
    summary: "Las bolsas de valores registraron caídas significativas tras el anuncio de nuevos aranceles entre las principales economías.",
    author: "Roberto Díaz",
    time: "Hace 3 horas",
    content: `<p>Los mercados financieros globales experimentaron jornadas de alta volatilidad tras el anuncio de nuevos aranceles comerciales entre las principales potencias económicas. Las bolsas de valores en Asia, Europa y América registraron caídas de entre 2% y 4%.</p>
<p>Los analistas advierten que la escalada de tensiones comerciales podría prolongarse durante los próximos meses, afectando especialmente a los sectores tecnológico y manufacturero.</p>`,
  },
];

export const getArticleBySlug = (slug: string): Article | undefined => {
  return allArticles.find((a) => a.slug === slug);
};

const fallbackImageByCategory: Record<string, string> = {
  regional: regionalImg,
  nacional: politicsImg,
  internacional: intlImg,
  deportes: sportImg,
  editorial: techImg,
};

const normalizeCategory = (category?: string | null) =>
  (category ?? "").trim().toLowerCase();

export const getFallbackImageByCategory = (category?: string | null) =>
  fallbackImageByCategory[normalizeCategory(category)] ?? heroImage;

export const resolveArticleImage = (category?: string | null, imageUrl?: string | null) => {
  if (imageUrl) {
    if (imageUrl.startsWith("//")) return `https:${imageUrl}`;
    return imageUrl;
  }

  return getFallbackImageByCategory(category);
};

export const formatArticleTime = (publishedAt?: string | null) => {
  if (!publishedAt) return "Fecha no disponible";

  try {
    return new Intl.DateTimeFormat("es-CL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(publishedAt));
  } catch {
    return "Fecha no disponible";
  }
};

export const formatArticleDate = (publishedAt?: string | null) => {
  if (!publishedAt) return "Fecha no disponible";

  try {
    return new Intl.DateTimeFormat("es-CL", {
      dateStyle: "long",
    }).format(new Date(publishedAt));
  } catch {
    return "Fecha no disponible";
  }
};

export const displayAuthorName = (author?: string | null) => {
  if (!author) return "Equipo Winforma";
  return author.trim().toLowerCase() === "redacción" ? "Equipo Winforma" : author;
};

export const mapSupabaseArticle = (article: SupabaseArticle): Article => ({
  slug: article.slug,
  image: resolveArticleImage(article.category, article.image_url),
  category: article.category,
  title: article.title,
  summary: article.summary,
  author: displayAuthorName(article.author),
  time: formatArticleTime(article.published_at),
  content: article.content,
  breaking: article.breaking,
  publishedAt: article.published_at,
});
