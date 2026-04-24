import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroHeadline from "@/components/HeroHeadline";
import LatestNews from "@/components/LatestNews";
import SecondaryGrid from "@/components/SecondaryGrid";
import MostRead from "@/components/MostRead";
import AdPlaceholder from "@/components/AdPlaceholder";
import BreakingTicker from "@/components/BreakingTicker";
import CookieBanner from "@/components/CookieBanner";
import Seo, { ORGANIZATION_ID, PUBLISHER, SITE_URL, WEBSITE_ID } from "@/components/Seo";
import { usePageViews } from "@/hooks/usePageViews";
import { Separator } from "@/components/ui/separator";

const Index = () => {
  usePageViews("home");

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        ...PUBLISHER,
        sameAs: [
          "https://www.instagram.com/winforma.cl/",
          "https://www.facebook.com/winforma.cl",
        ],
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: SITE_URL,
        name: "WINFORMA",
        inLanguage: "es-CL",
        publisher: { "@id": ORGANIZATION_ID },
      },
    ],
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
      <BreakingTicker />

      {/* Leaderboard */}
      <div className="container mx-auto px-4 pt-4">
        <AdPlaceholder size="leaderboard" />
      </div>

      <main className="container mx-auto px-4 py-8">

        {/* ── HERO ── */}
        <HeroHeadline />

        {/* ── ÚLTIMAS: franja horizontal ── */}
        <div className="border border-border bg-muted/30 px-4 py-4 mb-8">
          <LatestNews horizontal />
        </div>

        {/* ── BANNER ── */}
        <div className="mb-8">
          <AdPlaceholder size="banner" />
        </div>

        {/* ── CUERPO PRINCIPAL + SIDEBAR ── */}
        <div className="lg:flex lg:gap-10 lg:items-start">
          <div className="lg:flex-1 min-w-0">
            <SecondaryGrid />
          </div>

          <aside className="hidden lg:flex lg:flex-col lg:w-[280px] shrink-0 gap-8 mt-1">
            <AdPlaceholder size="box-top" />
            <Separator />
            <MostRead />
            <Separator />
            <AdPlaceholder size="sidebar" />
            <AdPlaceholder size="box-bottom" />
          </aside>
        </div>

      </main>

      <Footer />
      <CookieBanner />
    </div>
  );
};

export default Index;
