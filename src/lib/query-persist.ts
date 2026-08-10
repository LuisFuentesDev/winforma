import type { QueryClient } from "@tanstack/react-query";

// ponytail: solo persiste la query ["articles"] (la más pesada y la que golpea la home).
// No es un persister genérico para todo react-query — si más queries lo necesitan,
// generalizar a @tanstack/query-sync-storage-persister en vez de sumar más casos a mano.
const STORAGE_KEY = "wf:articles-cache";
const MAX_AGE_MS = 24 * 60 * 60 * 1000; // más viejo que esto, mejor pedirlo de nuevo

export function hydrateArticlesCache(queryClient: QueryClient) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const { data, savedAt } = JSON.parse(raw);
    if (!data || Date.now() - savedAt > MAX_AGE_MS) return;
    queryClient.setQueryData(["articles"], data, { updatedAt: savedAt });
  } catch {
    // localStorage no disponible o dato corrupto: seguimos sin caché, no es fatal.
  }
}

export function persistArticlesCache(queryClient: QueryClient) {
  queryClient.getQueryCache().subscribe((event) => {
    if (event.type !== "updated" || event.query.state.status !== "success") return;
    const key = event.query.queryKey;
    if (key.length !== 1 || key[0] !== "articles") return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ data: event.query.state.data, savedAt: Date.now() }));
    } catch {
      // cuota de localStorage llena u otro error: no persistimos, no bloqueamos la app.
    }
  });
}
