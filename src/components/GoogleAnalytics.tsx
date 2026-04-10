import { useEffect } from "react";
import { useLocation } from "react-router-dom";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

const GoogleAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    if (!measurementId || typeof window === "undefined") return;

    const existingScript = document.querySelector(
      `script[src="https://www.googletagmanager.com/gtag/js?id=${measurementId}"]`,
    );

    if (!existingScript) {
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      document.head.appendChild(script);
    }

    window.dataLayer = window.dataLayer || [];
    window.gtag =
      window.gtag ||
      function gtag(...args: unknown[]) {
        window.dataLayer.push(args);
      };

    window.gtag("js", new Date());
    window.gtag("config", measurementId, { send_page_view: false });
  }, []);

  useEffect(() => {
    if (!measurementId || typeof window === "undefined" || !window.gtag) return;

    const pagePath = `${location.pathname}${location.search}${location.hash}`;
    window.gtag("event", "page_view", {
      page_title: document.title,
      page_location: window.location.href,
      page_path: pagePath,
      send_to: measurementId,
    });
  }, [location]);

  return null;
};

export default GoogleAnalytics;
