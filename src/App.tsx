import { Suspense, lazy } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import GoogleAnalytics from "@/components/GoogleAnalytics";
// Rutas del flujo principal (home/artículo/categoría): estáticas, deben cargar de inmediato.
import Index from "./pages/Index.tsx";
import ArticlePage from "./pages/ArticlePage.tsx";
import CategoryPage from "./pages/CategoryPage.tsx";
import NotFound from "./pages/NotFound.tsx";

// Rutas secundarias: lazy para no sumar su peso al bundle inicial de las noticias.
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy.tsx"));
const TermsOfService = lazy(() => import("./pages/TermsOfService.tsx"));
const Tarifario = lazy(() => import("./pages/Tarifario.tsx"));
const AdminPage = lazy(() => import("./pages/AdminPage.tsx"));
const AboutPage = lazy(() => import("./pages/AboutPage.tsx"));
const ContactPage = lazy(() => import("./pages/ContactPage.tsx"));
const PreviewPage = lazy(() => import("./pages/PreviewPage.tsx"));
const DonatePage = lazy(() => import("./pages/DonatePage.tsx"));
const GraciasPage = lazy(() => import("./pages/GraciasPage.tsx"));
const RedComunitariaPrivacy = lazy(() => import("./pages/RedComunitariaPrivacy.tsx"));
const RedComunitariaTerms = lazy(() => import("./pages/RedComunitariaTerms.tsx"));
const RedComunitariaSupport = lazy(() => import("./pages/RedComunitariaSupport.tsx"));
const RedComunitariaLanding = lazy(() => import("./pages/RedComunitariaLanding.tsx"));
const RedComunitariaApk = lazy(() => import("./pages/RedComunitariaApk.tsx"));

const queryClient = new QueryClient({
  defaultOptions: {
    // Piso para toda query que no fije su propio staleTime (evita refetch en cada foco/montaje).
    queries: { staleTime: 30_000, refetchOnWindowFocus: false },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <GoogleAnalytics />
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/articulo/:slug" element={<ArticlePage />} />
            <Route path="/seccion/:category" element={<CategoryPage />} />
            <Route path="/politica-de-privacidad" element={<PrivacyPolicy />} />
            <Route path="/terminos" element={<TermsOfService />} />
            <Route path="/tarifario" element={<Tarifario />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/acerca-de" element={<AboutPage />} />
            <Route path="/contacto" element={<ContactPage />} />
            <Route path="/preview" element={<PreviewPage />} />
            <Route path="/donar" element={<DonatePage />} />
            <Route path="/gracias" element={<GraciasPage />} />
            <Route path="/red-comunitaria-privacidad" element={<RedComunitariaPrivacy />} />
            <Route path="/red-comunitaria-terminos" element={<RedComunitariaTerms />} />
            <Route path="/red-comunitaria-soporte" element={<RedComunitariaSupport />} />
            <Route path="/red-comunitaria" element={<RedComunitariaLanding />} />
            <Route path="/apk" element={<RedComunitariaApk />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
