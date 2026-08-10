// El proyecto de Supabase tiene habilitada la transformación de imágenes de Storage
// (endpoint /storage/v1/render/image/...). La usamos para no servir siempre el original
// a resolución completa cuando se muestra en un thumbnail o card pequeño.
const STORAGE_OBJECT_PATH = "/storage/v1/object/public/";
const STORAGE_RENDER_PATH = "/storage/v1/render/image/public/";

export function getOptimizedImageUrl(url: string, width: number, quality = 80): string {
  if (!url.includes(STORAGE_OBJECT_PATH)) return url; // no es una imagen de nuestro Storage (fallback local, URL externa, etc.)

  // El "width" que llega es en px CSS; en pantallas retina (DPR 2-3x) hay que pedir más píxeles reales
  // o se ve pixeleada al estirarla. Cap en 2x: 3x apenas se nota y triplica el peso.
  const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 2;
  const targetWidth = Math.round(width * dpr);

  const rendered = url.replace(STORAGE_OBJECT_PATH, STORAGE_RENDER_PATH);
  // resize=contain: sin esto, Supabase deja el height igual al original (o lo deforma con "fill")
  // en vez de escalar proporcionalmente cuando solo se pide el width.
  return `${rendered}?width=${targetWidth}&quality=${quality}&resize=contain`;
}
