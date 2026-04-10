import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Calendar, ChevronDown, Eye, EyeOff, Loader2, LogOut, Plus, RefreshCw, Upload } from "lucide-react";
import { toast } from "sonner";
import Seo from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAdminSession } from "@/hooks/useAdminSession";
import { useThemePreference } from "@/hooks/useThemePreference";
import {
  AD_SLOTS,
  createEmptyAdForm,
  fetchAdminAds,
  mapAdToForm,
  saveAdminAd,
  uploadAdImage,
  type AdFormValues,
  type AdRecord,
} from "@/lib/admin-ads";
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

interface AdminSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
}

const AdminSelect = ({ children, className = "", ...props }: AdminSelectProps) => (
  <div className="relative">
    <select
      {...props}
      className={`flex h-10 w-full appearance-none rounded-md border border-input bg-background px-3 py-2 pr-14 text-sm text-foreground ${className}`}
    >
      {children}
    </select>
    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
  </div>
);

const AdminPage = () => {
  const { session, user, isLoading } = useAdminSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [articles, setArticles] = useState<AdminArticleRecord[]>([]);
  const [isFetchingArticles, setIsFetchingArticles] = useState(false);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [form, setForm] = useState<AdminArticleFormValues>(createEmptyArticleForm());
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [ads, setAds] = useState<AdRecord[]>([]);
  const [selectedAdSlot, setSelectedAdSlot] = useState<AdFormValues["slot"]>("leaderboard");
  const [adForm, setAdForm] = useState<AdFormValues>(createEmptyAdForm("leaderboard"));
  const [isSavingAd, setIsSavingAd] = useState(false);
  const [isUploadingAdImage, setIsUploadingAdImage] = useState(false);
  useThemePreference();

  const selectedArticle = useMemo(
    () => articles.find((article) => article.id === selectedArticleId) ?? null,
    [articles, selectedArticleId],
  );
  const selectedAd = useMemo(
    () => ads.find((ad) => ad.slot === selectedAdSlot) ?? null,
    [ads, selectedAdSlot],
  );

  useEffect(() => {
    if (!session) return;

    const loadArticles = async () => {
      setIsFetchingArticles(true);

      try {
        const data = await fetchAdminArticles();
        setArticles(data);
        const adData = await fetchAdminAds();
        setAds(adData);

        if (!selectedArticleId && data.length > 0) {
          setSelectedArticleId(data[0].id);
          setForm(mapArticleToForm(data[0]));
        }
        const initialAd = adData.find((item) => item.slot === selectedAdSlot);
        setAdForm(initialAd ? mapAdToForm(initialAd) : createEmptyAdForm(selectedAdSlot));
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

  useEffect(() => {
    if (!selectedAd) {
      setAdForm(createEmptyAdForm(selectedAdSlot));
      return;
    }
    setAdForm(mapAdToForm(selectedAd));
  }, [selectedAd, selectedAdSlot]);

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
      const adData = await fetchAdminAds();
      setAds(adData);

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

  const updateAdForm = <K extends keyof AdFormValues>(key: K, value: AdFormValues[K]) => {
    setAdForm((current) => ({ ...current, [key]: value }));
  };

  const handleAdImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingAdImage(true);

    try {
      const publicUrl = await uploadAdImage(file, adForm.slot);
      updateAdForm("imageUrl", publicUrl);
      toast.success("Imagen publicitaria subida.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo subir la imagen.");
    } finally {
      setIsUploadingAdImage(false);
      event.target.value = "";
    }
  };

  const handleSaveAd = async () => {
    setIsSavingAd(true);

    try {
      const saved = await saveAdminAd(adForm);
      setAds((current) => {
        const next = current.filter((item) => item.slot !== saved.slot);
        return [...next, saved].sort((left, right) => left.slot.localeCompare(right.slot));
      });
      setAdForm(mapAdToForm(saved));
      toast.success("Banner actualizado.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo guardar el banner.");
    } finally {
      setIsSavingAd(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Seo title="Admin WINFORMA" description="Panel editorial de WINFORMA." path="/admin" noIndex />
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
        <main className="container mx-auto flex min-h-screen max-w-md items-center px-4 py-12">
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
                <div className="relative">
                  <Input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="pr-11"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
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

        <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)_360px]">
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
                  <AdminSelect
                    id="admin-category"
                    value={form.category}
                    onChange={(event) => updateForm("category", event.target.value)}
                  >
                    {ADMIN_CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </AdminSelect>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="admin-status">Estado</Label>
                  <AdminSelect
                    id="admin-status"
                    value={form.status}
                    onChange={(event) =>
                      updateForm("status", event.target.value as AdminArticleFormValues["status"])
                    }
                  >
                    {statusOptions.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </AdminSelect>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="admin-published-at">Fecha de publicación</Label>
                  <div className="relative">
                    <Input
                      id="admin-published-at"
                      type="datetime-local"
                      value={form.publishedAt}
                      onChange={(event) => updateForm("publishedAt", event.target.value)}
                      className="pr-14 [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0"
                      required
                    />
                    <Calendar className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground" />
                  </div>
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
                    className="inline-flex min-w-fit whitespace-nowrap cursor-pointer items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
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

          <aside className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-5">
              <h2 className="text-xl font-bold text-foreground">Publicidad</h2>
              <p className="text-sm text-muted-foreground">
                Administra las imágenes de los espacios publicitarios del sitio.
              </p>
            </div>

            <div className="grid gap-2">
              {AD_SLOTS.map((slotConfig) => (
                <button
                  key={slotConfig.slot}
                  type="button"
                  onClick={() => setSelectedAdSlot(slotConfig.slot)}
                  className={`rounded-xl border px-3 py-3 text-left transition-colors ${
                    selectedAdSlot === slotConfig.slot
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30 hover:bg-muted/30"
                  }`}
                >
                  <p className="text-sm font-semibold text-foreground">{slotConfig.label}</p>
                  <p className="text-xs text-muted-foreground">{slotConfig.description}</p>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary/80">
                    {slotConfig.size}
                  </p>
                </button>
              ))}
            </div>

            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ad-title">Título interno</Label>
                <Input
                  id="ad-title"
                  value={adForm.title}
                  onChange={(event) => updateAdForm("title", event.target.value)}
                  placeholder="Campaña otoño"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ad-target-url">Link de destino</Label>
                <Input
                  id="ad-target-url"
                  type="url"
                  value={adForm.targetUrl}
                  onChange={(event) => updateAdForm("targetUrl", event.target.value)}
                  placeholder="https://cliente.cl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ad-image-url">URL de imagen</Label>
                <Input
                  id="ad-image-url"
                  type="url"
                  value={adForm.imageUrl}
                  onChange={(event) => updateAdForm("imageUrl", event.target.value)}
                  placeholder="https://..."
                />
              </div>

              <div className="rounded-xl border border-dashed border-border p-4">
                <div className="flex flex-col gap-3">
                  <Label
                    htmlFor="ad-image-file"
                    className="inline-flex min-w-fit whitespace-nowrap cursor-pointer items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                  >
                    <Upload size={16} className="mr-2" />
                    {isUploadingAdImage ? "Subiendo..." : "Subir imagen del banner"}
                  </Label>
                  <Input
                    id="ad-image-file"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAdImageUpload}
                  />
                  {adForm.imageUrl && (
                    <img
                      src={adForm.imageUrl}
                      alt={adForm.title || "Preview banner"}
                      className="max-h-48 w-full rounded-lg object-contain"
                    />
                  )}
                </div>
              </div>

              <label className="flex items-center gap-3 rounded-xl border border-border px-4 py-3">
                <input
                  type="checkbox"
                  checked={adForm.isActive}
                  onChange={(event) => updateAdForm("isActive", event.target.checked)}
                  className="h-4 w-4"
                />
                <span className="text-sm text-foreground">Banner activo en el sitio</span>
              </label>

              <Button type="button" onClick={() => void handleSaveAd()} disabled={isSavingAd}>
                {isSavingAd ? "Guardando..." : "Guardar banner"}
              </Button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default AdminPage;
