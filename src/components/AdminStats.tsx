import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Eye, FileText, TrendingUp, BarChart2, Users, MonitorSmartphone } from "lucide-react";
import type { AdminArticleRecord } from "@/lib/admin-articles";
import { useGA4Stats } from "@/hooks/useGA4Stats";

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

function DailyChart({ rows }: { rows: { date: string; sessions: number; users: number; pageviews: number }[] }) {
  const maxVal = Math.max(...rows.map((r) => r.pageviews), 1);

  const formatDate = (d: string) => {
    // d = "20260512" → "12/05"
    return `${d.slice(6, 8)}/${d.slice(4, 6)}`;
  };

  const totSessions = rows.reduce((s, r) => s + r.sessions, 0);
  const totUsers = rows.reduce((s, r) => s + r.users, 0);
  const totPageviews = rows.reduce((s, r) => s + r.pageviews, 0);

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-black uppercase tracking-widest text-foreground font-sans">
          Últimos 30 días — Google Analytics
        </h3>
        <div className="flex gap-4 text-xs font-sans text-muted-foreground">
          <span><strong className="text-foreground">{totPageviews.toLocaleString("es-CL")}</strong> páginas vistas</span>
          <span><strong className="text-foreground">{totSessions.toLocaleString("es-CL")}</strong> sesiones</span>
          <span><strong className="text-foreground">{totUsers.toLocaleString("es-CL")}</strong> usuarios</span>
        </div>
      </div>

      {/* Gráfico de barras */}
      <div className="flex items-end gap-0.5 h-28 w-full">
        {rows.map((r) => {
          const pct = Math.round((r.pageviews / maxVal) * 100);
          return (
            <div key={r.date} className="group relative flex-1 flex flex-col items-center justify-end h-full">
              {/* Tooltip */}
              <div className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col items-center z-10 pointer-events-none">
                <div className="rounded bg-foreground text-background text-[10px] font-sans px-2 py-1 whitespace-nowrap shadow">
                  <p className="font-bold">{formatDate(r.date)}</p>
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

      {/* Eje x — solo mostrar algunos labels */}
      <div className="flex justify-between text-[9px] font-sans text-muted-foreground px-0.5">
        {rows.filter((_, i) => i === 0 || i === Math.floor(rows.length / 2) || i === rows.length - 1).map((r) => (
          <span key={r.date}>{formatDate(r.date)}</span>
        ))}
      </div>
    </div>
  );
}

export default function AdminStats({ articles }: AdminStatsProps) {
  const [pageViews, setPageViews] = useState<PageViewRow[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: ga4, loading: ga4Loading } = useGA4Stats();

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

      {/* Gráfico GA4 */}
      {ga4Loading && (
        <div className="rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground font-sans">
          Conectando con Google Analytics...
        </div>
      )}
      {!ga4Loading && ga4?.configured && !ga4?.error && ga4Rows.length > 0 && (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            <StatCard icon={<Users size={18} />} label="Usuarios únicos (30d)" value={ga4Users} sub="Google Analytics" />
            <StatCard icon={<MonitorSmartphone size={18} />} label="Sesiones (30d)" value={ga4Sessions} sub="Google Analytics" />
          </div>
          <DailyChart rows={ga4Rows} />
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

    </div>
  );
}
