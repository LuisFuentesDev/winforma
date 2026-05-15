import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import Index from "./pages/Index.tsx";
import ArticlePage from "./pages/ArticlePage.tsx";
import CategoryPage from "./pages/CategoryPage.tsx";
import NotFound from "./pages/NotFound.tsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.tsx";
import TermsOfService from "./pages/TermsOfService.tsx";
import Tarifario from "./pages/Tarifario.tsx";
import AdminPage from "./pages/AdminPage.tsx";
import AboutPage from "./pages/AboutPage.tsx";
import ContactPage from "./pages/ContactPage.tsx";
import PreviewPage from "./pages/PreviewPage.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <GoogleAnalytics />
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
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
