import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Loader2, LogOut, Plus, RefreshCw, Upload } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";
import Seo from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAdminSession } from "@/hooks/useAdminSession";
import {
  ADMIN_CATEGORIES,
  createEmptyArticleForm,
  fetchAdminArticles,
  mapArticleToForm,
  saveAdminArticle,
  slugifyArticleTitle,
  type AdminArticleFormValues,
  type AdminArticleRecord,
  uploadArticleImage,
} from "@/lib/admin-articles";

const statusOptions = [
  { value: "draft", label: "Borrador" },
  { value: "published", label: "Publicado" },
  { value: "archived", label: "Archivado" },
] as const;

const AdminPage = () => {
  const { session, user, isLoading } = useAdminSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [articles, setArticles] = useState<AdminArticleRecord[]>([]);
  const [isFetchingArticles, setIsFetchingArticles] = useState(false);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [form, setForm] = useState<AdminArticleFormValues>(createEmptyArticleForm());
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const selectedArticle = useMemo(
    () => articles.find((article) => article.id === selectedArticleId) ?? null,
    [articles, selectedArticleId],
  );

  useEffect(() => {
    if (!session) return;

    const loadArticles = async () => {
      setIsFetchingArticles(true);

      try {
        const data = await fetchAdminArticles();
        setArticles(data);

        if (!selectedArticleId && data.length > 0) {
          setSelectedArticleId(data[0].id);
          setForm(mapArticleToForm(data[0]));
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "No se pudo cargar el dashboard.";
        toast.error(message);
      } finally {
        setIsFetchingArticles(false);
      }
    };

    void loadArticles();
  }, [session]);

  useEffect(() => {
    if (!selectedArticle) return;
    setForm(mapArticleToForm(selectedArticle));
  }, [selectedArticle]);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!supabase) {
      toast.error("Supabase no está configurado.");
      return;
    }

    setIsAuthenticating(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setIsAuthenticating(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Sesión iniciada.");
    setPassword("");
  };

  const handleLogout = async () => {
    if (!supabase) return;

    await supabase.auth.signOut();
    setArticles([]);
    setSelectedArticleId(null);
    setForm(createEmptyArticleForm());
  };

  const handleRefresh = async () => {
    if (!session) return;

    setIsFetchingArticles(true);

    try {
      const data = await fetchAdminArticles();
      setArticles(data);

      if (selectedArticleId) {
        const refreshed = data.find((article) => article.id === selectedArticleId);
        if (refreshed) {
          setForm(mapArticleToForm(refreshed));
        }
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo refrescar.");
    } finally {
      setIsFetchingArticles(false);
    }
  };

  const updateForm = <K extends keyof AdminArticleFormValues>(
    key: K,
    value: AdminArticleFormValues[K],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleNewArticle = () => {
    setSelectedArticleId(null);
    setForm(createEmptyArticleForm());
  };

  const handleSlugSuggest = () => {
    updateForm("slug", slugifyArticleTitle(form.title));
  };

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);

    try {
      const publicUrl = await uploadArticleImage(file, form.slug || form.title || file.name);
      updateForm("imageUrl", publicUrl);
      toast.success("Imagen subida.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo subir la imagen.");
    } finally {
      setIsUploadingImage(false);
      event.target.value = "";
    }
  };

  const handleSave = async (status?: AdminArticleFormValues["status"]) => {
    setIsSaving(true);

    try {
      const saved = await saveAdminArticle({
        ...form,
        status: status ?? form.status,
      });

      setArticles((current) => {
        const next = current.filter((article) => article.id !== saved.id);
        return [saved, ...next].sort(
          (left, right) =>
            new Date(right.published_at).getTime() - new Date(left.published_at).getTime(),
        );
      });
      setSelectedArticleId(saved.id);
      setForm(mapArticleToForm(saved));
      toast.success(status === "published" ? "Noticia publicada." : "Cambios guardados.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo guardar la noticia.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Seo title="Admin WINFORMA" description="Panel editorial de WINFORMA." path="/admin" noIndex />
        <Header />
        <main className="container mx-auto px-4 py-16 text-center text-muted-foreground">
          Cargando panel editorial...
        </main>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background">
        <Seo title="Acceso Admin" description="Acceso editorial a WINFORMA." path="/admin" noIndex />
        <Header />
        <main className="container mx-auto max-w-md px-4 py-12">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Panel editorial
            </p>
            <h1 className="mt-2 text-3xl font-black text-foreground">Acceso al dashboard</h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Ingresa con una cuenta de Supabase Auth habilitada para el equipo editorial.
            </p>

            <form className="mt-6 space-y-4" onSubmit={handleLogin}>
              <div className="space-y-2">
                <Label htmlFor="admin-email">Correo</Label>
                <Input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="editor@winforma.cl"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-password">Contraseña</Label>
                <Input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
              </div>

              <Button className="w-full" type="submit" disabled={isAuthenticating}>
                {isAuthenticating ? "Ingresando..." : "Entrar"}
              </Button>
            </form>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Seo title="Dashboard WINFORMA" description="Panel editorial de WINFORMA." path="/admin" noIndex />
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Dashboard
            </p>
            <h1 className="text-3xl font-black text-foreground">Gestión manual de noticias</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Sesión activa como {user?.email ?? "editor"}.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={handleRefresh} disabled={isFetchingArticles}>
              <RefreshCw size={16} className="mr-2" />
              Actualizar
            </Button>
            <Button type="button" variant="outline" onClick={handleNewArticle}>
              <Plus size={16} className="mr-2" />
              Nueva noticia
            </Button>
            <Button type="button" variant="ghost" onClick={handleLogout}>
              <LogOut size={16} className="mr-2" />
              Salir
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="rounded-2xl border border-border bg-card p-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">Noticias</h2>
              {isFetchingArticles && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            </div>

            <div className="space-y-2">
              {articles.map((article) => (
                <button
                  key={article.id}
                  type="button"
                  onClick={() => {
                    setSelectedArticleId(article.id);
                    setForm(mapArticleToForm(article));
                  }}
                  className={`w-full rounded-xl border px-3 py-3 text-left transition-colors ${
                    selectedArticleId === article.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30 hover:bg-muted/30"
                  }`}
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                    {article.category} · {article.status}
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm font-semibold leading-5 text-foreground">
                    {article.title}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Intl.DateTimeFormat("es-CL", {
                      dateStyle: "short",
                      timeStyle: "short",
                    }).format(new Date(article.published_at))}
                  </p>
                </button>
              ))}

              {!articles.length && !isFetchingArticles && (
                <p className="rounded-xl border border-dashed border-border px-4 py-6 text-sm text-muted-foreground">
                  Aún no hay artículos cargados en el panel.
                </p>
              )}
            </div>
          </aside>

          <section className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  {form.id ? "Editar noticia" : "Nueva noticia"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Puedes guardar como borrador o publicar de inmediato.
                </p>
              </div>

              {form.slug && (
                <Link
                  to={`/articulo/${form.slug}`}
                  className="text-sm font-semibold text-primary hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  Ver noticia
                </Link>
              )}
            </div>

            <form
              className="grid gap-5"
              onSubmit={(event) => {
                event.preventDefault();
                void handleSave();
              }}
            >
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="admin-title">Título</Label>
                  <Input
                    id="admin-title"
                    value={form.title}
                    onChange={(event) => updateForm("title", event.target.value)}
                    placeholder="Título de la noticia"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="admin-slug">Slug</Label>
                    <button
                      type="button"
                      className="text-xs font-semibold text-primary hover:underline"
                      onClick={handleSlugSuggest}
                    >
                      Generar desde título
                    </button>
                  </div>
                  <Input
                    id="admin-slug"
                    value={form.slug}
                    onChange={(event) => updateForm("slug", event.target.value)}
                    placeholder="slug-de-la-noticia"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="admin-author">Autor</Label>
                  <Input
                    id="admin-author"
                    value={form.author}
                    onChange={(event) => updateForm("author", event.target.value)}
                    placeholder="Equipo Winforma"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="admin-category">Categoría</Label>
                  <select
                    id="admin-category"
                    value={form.category}
                    onChange={(event) => updateForm("category", event.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
                  >
                    {ADMIN_CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="admin-status">Estado</Label>
                  <select
                    id="admin-status"
                    value={form.status}
                    onChange={(event) =>
                      updateForm("status", event.target.value as AdminArticleFormValues["status"])
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
                  >
                    {statusOptions.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="admin-published-at">Fecha de publicación</Label>
                  <Input
                    id="admin-published-at"
                    type="datetime-local"
                    value={form.publishedAt}
                    onChange={(event) => updateForm("publishedAt", event.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-summary">Bajada</Label>
                <Textarea
                  id="admin-summary"
                  value={form.summary}
                  onChange={(event) => updateForm("summary", event.target.value)}
                  placeholder="Resumen de la noticia"
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-content">Contenido</Label>
                <Textarea
                  id="admin-content"
                  value={form.content}
                  onChange={(event) => updateForm("content", event.target.value)}
                  placeholder="Puedes pegar HTML o texto con párrafos separados por líneas en blanco."
                  rows={14}
                  required
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="admin-source-url">Fuente original</Label>
                  <Input
                    id="admin-source-url"
                    type="url"
                    value={form.sourceUrl}
                    onChange={(event) => updateForm("sourceUrl", event.target.value)}
                    placeholder="https://fuente.cl/noticia"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="admin-image-url">URL de imagen</Label>
                  <Input
                    id="admin-image-url"
                    type="url"
                    value={form.imageUrl}
                    onChange={(event) => updateForm("imageUrl", event.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="rounded-xl border border-dashed border-border p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-semibold text-foreground">Subir imagen al bucket</p>
                    <p className="text-sm text-muted-foreground">
                      La imagen se guarda en Supabase Storage y queda lista para la web.
                    </p>
                  </div>

                  <Label
                    htmlFor="admin-image-file"
                    className="inline-flex cursor-pointer items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                  >
                    <Upload size={16} className="mr-2" />
                    {isUploadingImage ? "Subiendo..." : "Elegir archivo"}
                  </Label>
                </div>

                <Input
                  id="admin-image-file"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />

                {form.imageUrl && (
                  <div className="mt-4 overflow-hidden rounded-xl border border-border">
                    <img
                      src={form.imageUrl}
                      alt="Vista previa"
                      className="h-56 w-full object-cover object-top"
                    />
                  </div>
                )}
              </div>

              <label className="flex items-center gap-3 rounded-xl border border-border px-4 py-3">
                <input
                  type="checkbox"
                  checked={form.breaking}
                  onChange={(event) => updateForm("breaking", event.target.checked)}
                  className="h-4 w-4"
                />
                <span className="text-sm text-foreground">Marcar como noticia destacada</span>
              </label>

              <div className="flex flex-wrap gap-3">
                <Button type="submit" variant="outline" disabled={isSaving}>
                  {isSaving ? "Guardando..." : "Guardar cambios"}
                </Button>
                <Button
                  type="button"
                  onClick={() => void handleSave("draft")}
                  disabled={isSaving}
                  variant="secondary"
                >
                  Guardar como borrador
                </Button>
                <Button
                  type="button"
                  onClick={() => void handleSave("published")}
                  disabled={isSaving}
                >
                  Publicar ahora
                </Button>
              </div>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AdminPage;
