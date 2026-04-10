import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroHeadline from "@/components/HeroHeadline";
import LatestNews from "@/components/LatestNews";
import SecondaryGrid from "@/components/SecondaryGrid";
import AdPlaceholder from "@/components/AdPlaceholder";
import Seo, { SITE_URL } from "@/components/Seo";
import { usePageViews } from "@/hooks/usePageViews";

const Index = () => {
  usePageViews("home");

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "WINFORMA",
    url: SITE_URL,
    inLanguage: "es-CL",
    publisher: {
      "@type": "Organization",
      name: "WINFORMA",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/favicon.png`,
      },
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="Noticias de Chile y La Araucania"
        description="WINFORMA publica noticias regionales, nacionales, internacionales, deportivas y editoriales con foco en Chile y La Araucania."
        path="/"
        keywords={["noticias", "Chile", "La Araucania", "actualidad", "regional", "nacional", "deportes"]}
        schema={schema}
      />
      <Header />

      {/* Ad: Leaderboard bajo header */}
      <div className="container mx-auto px-4 pt-4">
        <AdPlaceholder size="leaderboard" />
      </div>

      <main className="container mx-auto px-4 py-8">
        {/* Hero + Latest News: 65/35 split on desktop, stacked on mobile */}
        <div className="lg:flex lg:gap-8 mb-12">
          <div className="lg:w-[65%]">
            <HeroHeadline />
          </div>
          <div className="lg:w-[35%] mt-8 lg:mt-0 lg:border-l lg:border-border lg:pl-8">
            <LatestNews />
          </div>
        </div>

        {/* Ad: Banner entre secciones */}
        <div className="mb-12">
          <AdPlaceholder size="banner" />
        </div>

        {/* Secondary articles grid */}
        <SecondaryGrid />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
