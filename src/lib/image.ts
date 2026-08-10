// El proyecto de Supabase tiene habilitada la transformación de imágenes de Storage
// (endpoint /storage/v1/render/image/...). La usamos para no servir siempre el original
// a resolución completa cuando se muestra en un thumbnail o card pequeño.
const STORAGE_OBJECT_PATH = "/storage/v1/object/public/";
const STORAGE_RENDER_PATH = "/storage/v1/render/image/public/";

export function getOptimizedImageUrl(url: string, width: number, quality = 75): string {
  if (!url.includes(STORAGE_OBJECT_PATH)) return url; // no es una imagen de nuestro Storage (fallback local, URL externa, etc.)
  const rendered = url.replace(STORAGE_OBJECT_PATH, STORAGE_RENDER_PATH);
  return `${rendered}?width=${width}&quality=${quality}`;
}
