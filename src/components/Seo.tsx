import { useEffect } from "react";

const SITE_NAME = "WINFORMA";
const SITE_URL = "https://winforma.cl";
const DEFAULT_IMAGE = `${SITE_URL}/og-winforma.png`;
const MANAGED_ATTR = "data-seo-managed";

type SchemaValue = Record<string, unknown> | Array<Record<string, unknown>>;

interface SeoProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  author?: string;
  keywords?: string[];
  noIndex?: boolean;
  schema?: SchemaValue;
}

function toAbsoluteUrl(value?: string) {
  if (!value) return SITE_URL;
  if (/^https?:\/\//i.test(value)) return value;
  return `${SITE_URL}${value.startsWith("/") ? value : `/${value}`}`;
}

function setMeta(
  selector: string,
  create: () => HTMLMetaElement,
  content: string | undefined,
) {
  if (!content) return;

  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = create();
    element.setAttribute(MANAGED_ATTR, "true");
    document.head.appendChild(element);
  }

  element.content = content;
}

function setLink(rel: string, href: string) {
  let element = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement("link");
    element.rel = rel;
    element.setAttribute(MANAGED_ATTR, "true");
    document.head.appendChild(element);
  }

  element.href = href;
}

const Seo = ({
  title,
  description,
  path = "/",
  image = DEFAULT_IMAGE,
  type = "website",
  author,
  keywords,
  noIndex = false,
  schema,
}: SeoProps) => {
  useEffect(() => {
    const canonicalUrl = toAbsoluteUrl(path);
    const imageUrl = toAbsoluteUrl(image);
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
    const robots = noIndex ? "noindex, nofollow" : "index, follow";

    document.documentElement.lang = "es";
    document.title = fullTitle;

    setMeta('meta[name="description"]', () => {
      const meta = document.createElement("meta");
      meta.name = "description";
      return meta;
    }, description);

    setMeta('meta[name="author"]', () => {
      const meta = document.createElement("meta");
      meta.name = "author";
      return meta;
    }, author ?? SITE_NAME);

    setMeta('meta[name="robots"]', () => {
      const meta = document.createElement("meta");
      meta.name = "robots";
      return meta;
    }, robots);

    setMeta('meta[name="keywords"]', () => {
      const meta = document.createElement("meta");
      meta.name = "keywords";
      return meta;
    }, keywords?.join(", "));

    setMeta('meta[property="og:title"]', () => {
      const meta = document.createElement("meta");
      meta.setAttribute("property", "og:title");
      return meta;
    }, fullTitle);

    setMeta('meta[property="og:description"]', () => {
      const meta = document.createElement("meta");
      meta.setAttribute("property", "og:description");
      return meta;
    }, description);

    setMeta('meta[property="og:type"]', () => {
      const meta = document.createElement("meta");
      meta.setAttribute("property", "og:type");
      return meta;
    }, type);

    setMeta('meta[property="og:url"]', () => {
      const meta = document.createElement("meta");
      meta.setAttribute("property", "og:url");
      return meta;
    }, canonicalUrl);

    setMeta('meta[property="og:site_name"]', () => {
      const meta = document.createElement("meta");
      meta.setAttribute("property", "og:site_name");
      return meta;
    }, SITE_NAME);

    setMeta('meta[property="og:image"]', () => {
      const meta = document.createElement("meta");
      meta.setAttribute("property", "og:image");
      return meta;
    }, imageUrl);

    setMeta('meta[property="og:image:alt"]', () => {
      const meta = document.createElement("meta");
      meta.setAttribute("property", "og:image:alt");
      return meta;
    }, title);

    setMeta('meta[name="twitter:card"]', () => {
      const meta = document.createElement("meta");
      meta.name = "twitter:card";
      return meta;
    }, "summary_large_image");

    setMeta('meta[name="twitter:title"]', () => {
      const meta = document.createElement("meta");
      meta.name = "twitter:title";
      return meta;
    }, fullTitle);

    setMeta('meta[name="twitter:description"]', () => {
      const meta = document.createElement("meta");
      meta.name = "twitter:description";
      return meta;
    }, description);

    setMeta('meta[name="twitter:image"]', () => {
      const meta = document.createElement("meta");
      meta.name = "twitter:image";
      return meta;
    }, imageUrl);

    setLink("canonical", canonicalUrl);

    const existingSchemas = document.head.querySelectorAll(`script[type="application/ld+json"][${MANAGED_ATTR}="true"]`);
    existingSchemas.forEach((node) => node.remove());

    if (schema) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute(MANAGED_ATTR, "true");
      script.text = JSON.stringify(schema);
      document.head.appendChild(script);
    }
  }, [author, description, image, keywords, noIndex, path, schema, title, type]);

  return null;
};

export { SITE_NAME, SITE_URL, DEFAULT_IMAGE };
export default Seo;
