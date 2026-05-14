import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Eye, FileText, TrendingUp, BarChart2, Users, MonitorSmartphone, Heart, Camera } from "lucide-react";
import type { AdminArticleRecord } from "@/lib/admin-articles";
import { useGA4Stats } from "@/hooks/useGA4Stats";
import { useInstagramStats } from "@/hooks/useInstagramStats";

type StatsTab = "web" | "instagram";
type GA4Period = "daily" | "monthly";

interface PageViewRow {
  page_slug: string;
  view_count: number;
}

interface AdminStatsProps {
  articles: AdminArticleRecord[];
}

function StatCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 flex items-start gap-3">
      <div className="mt-0.5 text-primary">{icon}</div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground font-sans">{label}</p>
        <p className="text-2xl font-black text-foreground leading-tight">{value.toLocaleString("es-CL")}</p>
        {sub && <p className="text-xs text-muted-foreground font-sans mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function MiniBar({ value, max, label }: { value: number; max: number; label: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-2">
      <span className="w-16 shrink-0 text-right text-xs font-sans text-muted-foreground tabular-nums">{value.toLocaleString("es-CL")}</span>
      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
      </div>
      <span className="w-32 shrink-0 text-xs font-sans text-foreground truncate">{label}</span>
    </div>
  );
}

function GA4Chart({
  rows,
  period,
}: {
  rows: { date: string; sessions: number; users: number; pageviews: number }[];
  period: GA4Period;
}) {
  const maxVal = Math.max(...rows.map((r) => r.pageviews), 1);

  const formatLabel = (d: string) => {
    if (period === "monthly") {
      // "202605" → "may 26"
      const months = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
      const m = parseInt(d.slice(4, 6), 10) - 1;
      return `${months[m]} ${d.slice(2, 4)}`;
    }
    // "20260512" → "12/05"
    return `${d.slice(6, 8)}/${d.slice(4, 6)}`;
  };

  const totSessions = rows.reduce((s, r) => s + r.sessions, 0);
  const totUsers = rows.reduce((s, r) => s + r.users, 0);
  const totPageviews = rows.reduce((s, r) => s + r.pageviews, 0);
  const title = period === "monthly" ? "Últimos 12 meses — Google Analytics" : "Últimos 30 días — Google Analytics";

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-black uppercase tracking-widest text-foreground font-sans">{title}</h3>
        <div className="flex gap-4 text-xs font-sans text-muted-foreground">
          <span><strong className="text-foreground">{totPageviews.toLocaleString("es-CL")}</strong> páginas vistas</span>
          <span><strong className="text-foreground">{totSessions.toLocaleString("es-CL")}</strong> sesiones</span>
          <span><strong className="text-foreground">{totUsers.toLocaleString("es-CL")}</strong> usuarios</span>
        </div>
      </div>

      <div className="flex items-end gap-0.5 h-28 w-full">
        {rows.map((r) => {
          const pct = Math.round((r.pageviews / maxVal) * 100);
          return (
            <div key={r.date} className="group relative flex-1 flex flex-col items-center justify-end h-full">
              <div className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col items-center z-10 pointer-events-none">
                <div className="rounded bg-foreground text-background text-[10px] font-sans px-2 py-1 whitespace-nowrap shadow">
                  <p className="font-bold">{formatLabel(r.date)}</p>
                  <p>{r.pageviews.toLocaleString("es-CL")} vistas</p>
                  <p>{r.sessions.toLocaleString("es-CL")} sesiones</p>
                </div>
                <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-foreground" />
              </div>
              <div
                className="w-full rounded-t bg-primary/70 hover:bg-primary transition-colors"
                style={{ height: `${Math.max(pct, 2)}%` }}
              />
            </div>
          );
        })}
      </div>

      <div className="flex justify-between text-[9px] font-sans text-muted-foreground px-0.5">
        {rows.filter((_, i) => i === 0 || i === Math.floor(rows.length / 2) || i === rows.length - 1).map((r) => (
          <span key={r.date}>{formatLabel(r.date)}</span>
        ))}
      </div>
    </div>
  );
}

export default function AdminStats({ articles }: AdminStatsProps) {
  const [pageViews, setPageViews] = useState<PageViewRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [statsTab, setStatsTab] = useState<StatsTab>("web");
  const [ga4Period, setGa4Period] = useState<GA4Period>("daily");
  const { data: ga4, loading: ga4Loading } = useGA4Stats(ga4Period);
  const { data: ig, loading: igLoading } = useInstagramStats();

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    const fetch = async () => {
      const { data } = await supabase
        .from("page_views")
        .select("page_slug, view_count")
        .order("view_count", { ascending: false });
      setPageViews((data ?? []) as PageViewRow[]);
      setLoading(false);
    };
    void fetch();
  }, []);

  const totalViews = pageViews.reduce((s, r) => s + Number(r.view_count), 0);
  const articleViews = pageViews.filter((r) => r.page_slug.startsWith("article-"));

  const published = articles.filter((a) => a.status === "published").length;
  const drafts = articles.filter((a) => a.status === "draft").length;
  const archived = articles.filter((a) => a.status === "archived").length;

  // Top 10 artículos por vistas
  const slugToArticle = new Map(articles.map((a) => [a.slug, a]));
  const topArticles = articleViews
    .slice(0, 10)
    .map((r) => {
      const slug = r.page_slug.replace(/^article-/, "");
      const article = slugToArticle.get(slug);
      return { slug, title: article?.title ?? slug, views: Number(r.view_count) };
    });
  const maxViews = topArticles[0]?.views ?? 1;

  // Distribución por categoría
  const byCategory = articles.reduce<Record<string, number>>((acc, a) => {
    acc[a.category] = (acc[a.category] ?? 0) + 1;
    return acc;
  }, {});
  const maxCat = Math.max(...Object.values(byCategory), 1);

  if (loading) {
    return <p className="text-sm text-muted-foreground font-sans py-8 text-center">Cargando estadísticas...</p>;
  }

  // KPIs GA4 de los últimos 30 días
  const ga4Rows = ga4?.rows ?? [];
  const ga4Sessions = ga4Rows.reduce((s, r) => s + r.sessions, 0);
  const ga4Users = ga4Rows.reduce((s, r) => s + r.users, 0);


  return (
    <div className="space-y-6">

      {/* Sub-pestañas */}
      <div className="flex rounded-xl border border-border bg-card overflow-hidden">
        {(["web", "instagram"] as StatsTab[]).map((t) => {
          const labels: Record<StatsTab, string> = { web: "Sitio web", instagram: "Instagram" };
          return (
            <button
              key={t}
              type="button"
              onClick={() => setStatsTab(t)}
              className={`flex-1 py-2.5 text-sm font-bold font-sans transition-colors ${
                statsTab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {labels[t]}
            </button>
          );
        })}
      </div>

      {/* ── INSTAGRAM ── */}
      {statsTab === "instagram" && (
        <div className="space-y-6">
          {igLoading && (
            <p className="text-sm text-muted-foreground font-sans py-8 text-center">Cargando datos de Instagram...</p>
          )}
          {!igLoading && !ig?.configured && (
            <div className="rounded-xl border border-dashed border-border bg-muted/20 px-5 py-5 space-y-2">
              <p className="text-sm font-bold text-foreground font-sans">Conectar Instagram</p>
              <p className="text-xs text-muted-foreground font-sans">
                Agrega la variable <code className="bg-muted px-1 rounded text-primary">INSTAGRAM_ACCESS_TOKEN</code> en Vercel con el token de acceso de tu cuenta Business.
              </p>
            </div>
          )}
          {!igLoading && ig?.error && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-5 py-4 text-sm text-destructive font-sans">
              Error Instagram: {ig.error}
            </div>
          )}
          {!igLoading && ig?.configured && !ig?.error && ig.profile && (
            <>
              {/* Perfil */}
              <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <Camera size={22} className="text-muted-foreground" />
                </div>
                <div>
                  <p className="font-black text-lg text-foreground leading-tight">@{ig.profile.username}</p>
                  <p className="text-xs text-muted-foreground font-sans">{ig.profile.mediaCount.toLocaleString("es-CL")} publicaciones · últimos 30 días</p>
                </div>
              </div>

              {/* KPIs principales */}
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <StatCard icon={<Users size={18} />} label="Seguidores" value={ig.profile.followers} />
                <StatCard icon={<Eye size={18} />} label="Impresiones" value={ig.insights?.impressions ?? 0} sub="Veces que se mostró el contenido" />
                <StatCard icon={<TrendingUp size={18} />} label="Alcance" value={ig.insights?.reach ?? 0} sub="Personas únicas que lo vieron" />
                <StatCard icon={<MonitorSmartphone size={18} />} label="Visitas al perfil" value={ig.insights?.profileViews ?? 0} />
                <StatCard icon={<BarChart2 size={18} />} label="Clics al sitio web" value={ig.insights?.websiteClicks ?? 0} sub="Desde el perfil de Instagram" />
                <StatCard icon={<Heart size={18} />} label="Guardados" value={ig.insights?.saves ?? 0} sub="Últimos 20 posts" />
              </div>
            </>
          )}
        </div>
      )}

      {/* ── WEB ── */}
      {statsTab === "web" && <>

      {/* Gráfico GA4 */}
      {ga4Loading && (
        <div className="rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground font-sans">
          Conectando con Google Analytics...
        </div>
      )}
      {!ga4Loading && ga4?.configured && !ga4?.error && ga4Rows.length > 0 && (
        <>
          <div className="flex items-center justify-between gap-3">
            <div className="grid flex-1 gap-3 sm:grid-cols-2">
              <StatCard
                icon={<Users size={18} />}
                label={ga4Period === "monthly" ? "Usuarios únicos (12m)" : "Usuarios únicos (30d)"}
                value={ga4Users}
                sub="Google Analytics"
              />
              <StatCard
                icon={<MonitorSmartphone size={18} />}
                label={ga4Period === "monthly" ? "Sesiones (12m)" : "Sesiones (30d)"}
                value={ga4Sessions}
                sub="Google Analytics"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <div className="inline-flex rounded-lg border border-border bg-card overflow-hidden text-xs font-sans">
              {(["daily", "monthly"] as GA4Period[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setGa4Period(p)}
                  className={`px-3 py-1.5 font-semibold transition-colors ${
                    ga4Period === p ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {p === "daily" ? "30 días" : "12 meses"}
                </button>
              ))}
            </div>
          </div>
          <GA4Chart rows={ga4Rows} period={ga4Period} />
        </>
      )}
      {!ga4Loading && ga4?.error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-5 py-4 text-sm text-destructive font-sans">
          Error GA4: {ga4.error}
        </div>
      )}
      {!ga4Loading && !ga4?.configured && (
        <div className="rounded-xl border border-dashed border-border bg-muted/20 px-5 py-5 space-y-2">
          <p className="text-sm font-bold text-foreground font-sans">Conectar Google Analytics 4</p>
          <p className="text-xs text-muted-foreground font-sans leading-relaxed">
            Agrega estas 3 variables de entorno en Vercel para activar el gráfico de visitas diarias:
          </p>
          <ul className="text-xs font-mono space-y-1 text-foreground bg-muted rounded-lg px-4 py-3">
            <li><span className="text-primary">GA4_PROPERTY_ID</span> — el ID numérico de tu propiedad GA4</li>
            <li><span className="text-primary">GA4_CLIENT_EMAIL</span> — correo de la cuenta de servicio</li>
            <li><span className="text-primary">GA4_PRIVATE_KEY</span> — clave privada de la cuenta de servicio</li>
          </ul>
          <p className="text-xs text-muted-foreground font-sans">
            Guía:{" "}
            <a href="https://developers.google.com/analytics/devguides/reporting/data/v1/quickstart-client-libraries" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              GA4 Data API — Quickstart
            </a>
          </p>
        </div>
      )}

      {/* KPIs Supabase */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={<Eye size={18} />} label="Vistas totales" value={totalViews} sub="Todas las páginas" />
        <StatCard icon={<TrendingUp size={18} />} label="Vistas artículos" value={articleViews.reduce((s, r) => s + Number(r.view_count), 0)} sub="Solo noticias" />
        <StatCard icon={<FileText size={18} />} label="Publicadas" value={published} sub={`${drafts} borrador · ${archived} archivadas`} />
        <StatCard icon={<BarChart2 size={18} />} label="Total noticias" value={articles.length} sub="En el sistema" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">

        {/* Top artículos */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-black uppercase tracking-widest text-foreground mb-4 font-sans">
            Top 10 — más leídas
          </h3>
          {topArticles.length === 0 ? (
            <p className="text-sm text-muted-foreground font-sans">Aún no hay datos de vistas.</p>
          ) : (
            <div className="space-y-2.5">
              {topArticles.map((a) => (
                <MiniBar key={a.slug} value={a.views} max={maxViews} label={a.title} />
              ))}
            </div>
          )}
        </div>

        {/* Por categoría */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-black uppercase tracking-widest text-foreground mb-4 font-sans">
            Noticias por categoría
          </h3>
          {Object.keys(byCategory).length === 0 ? (
            <p className="text-sm text-muted-foreground font-sans">Sin datos.</p>
          ) : (
            <div className="space-y-2.5">
              {Object.entries(byCategory)
                .sort((a, b) => b[1] - a[1])
                .map(([cat, count]) => (
                  <MiniBar key={cat} value={count} max={maxCat} label={cat} />
                ))}
            </div>
          )}
        </div>
      </div>

      </>}
    </div>
  );
}
