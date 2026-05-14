import jsPDF from "jspdf";
import type { GA4Stats } from "@/hooks/useGA4Stats";
import type { InstagramStats } from "@/hooks/useInstagramStats";
import type { AdminArticleRecord } from "@/lib/admin-articles";

function fmt(n: number) {
  return n.toLocaleString("es-CL");
}

function monthName(date: Date) {
  return date.toLocaleDateString("es-CL", { month: "long", year: "numeric" });
}

function sectionHeader(doc: jsPDF, text: string, y: number, pageW: number) {
  doc.setFillColor(20, 20, 20);
  doc.rect(14, y, pageW - 28, 7, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text(text.toUpperCase(), 18, y + 5);
  doc.setTextColor(30, 30, 30);
  return y + 13;
}

function kpiRow(doc: jsPDF, label: string, value: string, y: number, pageW: number) {
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(90, 90, 90);
  doc.text(label, 18, y);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(20, 20, 20);
  doc.text(value, pageW - 14, y, { align: "right" });
  doc.setDrawColor(220, 220, 220);
  doc.line(18, y + 2, pageW - 14, y + 2);
  return y + 8;
}

function miniBarChart(
  doc: jsPDF,
  rows: { label: string; value: number }[],
  x: number,
  y: number,
  w: number,
  h: number
) {
  const max = Math.max(...rows.map((r) => r.value), 1);
  const barW = (w - (rows.length - 1) * 1) / rows.length;

  rows.forEach((r, i) => {
    const barH = Math.max((r.value / max) * h, 1);
    const bx = x + i * (barW + 1);
    const by = y + h - barH;
    doc.setFillColor(20, 120, 255);
    doc.rect(bx, by, barW, barH, "F");
  });

  // Eje x — solo primero, medio y último
  doc.setFontSize(6);
  doc.setTextColor(130, 130, 130);
  const indices = [0, Math.floor(rows.length / 2), rows.length - 1];
  indices.forEach((i) => {
    const bx = x + i * (barW + 1) + barW / 2;
    doc.text(rows[i].label, bx, y + h + 5, { align: "center" });
  });
}

export function generateReport(
  ga4: GA4Stats | null,
  ig: InstagramStats | null,
  articles: AdminArticleRecord[]
) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const now = new Date();

  // ── Encabezado ──────────────────────────────────────────────
  doc.setFillColor(10, 10, 10);
  doc.rect(0, 0, pageW, 28, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("WINFORMA", 14, 14);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Informe de estadísticas", 14, 21);
  doc.text(monthName(now), pageW - 14, 21, { align: "right" });

  doc.setTextColor(30, 30, 30);
  let y = 36;

  // ── SITIO WEB ────────────────────────────────────────────────
  y = sectionHeader(doc, "Sitio web — Google Analytics (últimos 30 días)", y, pageW);

  if (ga4?.configured && ga4.rows && ga4.rows.length > 0) {
    const rows = ga4.rows;
    const totSessions = rows.reduce((s, r) => s + r.sessions, 0);
    const totUsers = rows.reduce((s, r) => s + r.users, 0);
    const totPageviews = rows.reduce((s, r) => s + r.pageviews, 0);
    const avgDaily = Math.round(totPageviews / rows.length);

    y = kpiRow(doc, "Usuarios únicos", fmt(totUsers), y, pageW);
    y = kpiRow(doc, "Sesiones", fmt(totSessions), y, pageW);
    y = kpiRow(doc, "Páginas vistas", fmt(totPageviews), y, pageW);
    y = kpiRow(doc, "Promedio diario de vistas", fmt(avgDaily), y, pageW);

    // Gráfico de barras diario
    y += 4;
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(60, 60, 60);
    doc.text("Páginas vistas por día", 18, y);
    y += 4;

    const chartRows = rows.map((r) => ({
      label: `${r.date.slice(6, 8)}/${r.date.slice(4, 6)}`,
      value: r.pageviews,
    }));
    miniBarChart(doc, chartRows, 18, y, pageW - 32, 28);
    y += 42;
  } else {
    doc.setFontSize(9);
    doc.setTextColor(130, 130, 130);
    doc.text("Sin datos de Google Analytics configurados.", 18, y);
    y += 10;
  }

  // ── Top artículos ────────────────────────────────────────────
  y = sectionHeader(doc, "Artículos publicados", y, pageW);

  const published = articles.filter((a) => a.status === "published");
  const drafts = articles.filter((a) => a.status === "draft");

  y = kpiRow(doc, "Publicados", fmt(published.length), y, pageW);
  y = kpiRow(doc, "Borradores", fmt(drafts.length), y, pageW);
  y = kpiRow(doc, "Total en el sistema", fmt(articles.length), y, pageW);

  // Distribución por categoría
  y += 4;
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(60, 60, 60);
  doc.text("Por categoría", 18, y);
  y += 6;

  const byCategory = articles.reduce<Record<string, number>>((acc, a) => {
    acc[a.category] = (acc[a.category] ?? 0) + 1;
    return acc;
  }, {});
  const sorted = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);
  const maxCat = sorted[0]?.[1] ?? 1;
  const barTotalW = pageW - 60;

  sorted.forEach(([cat, count]) => {
    const bw = (count / maxCat) * barTotalW;
    doc.setFillColor(200, 220, 255);
    doc.rect(18, y - 4, bw, 5, "F");
    doc.setFillColor(20, 120, 255);
    doc.rect(18, y - 4, Math.min(bw, 3), 5, "F");
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(30, 30, 30);
    doc.text(cat, 20, y);
    doc.setTextColor(90, 90, 90);
    doc.text(String(count), pageW - 14, y, { align: "right" });
    y += 7;
  });

  y += 4;

  // ── INSTAGRAM ────────────────────────────────────────────────
  // Nueva página si no queda espacio
  if (y > 230) {
    doc.addPage();
    y = 20;
  }

  y = sectionHeader(doc, "Instagram", y, pageW);

  if (ig?.configured && ig.profile && !ig.error) {
    y = kpiRow(doc, "Cuenta", `@${ig.profile.username}`, y, pageW);
    y = kpiRow(doc, "Seguidores", fmt(ig.profile.followers), y, pageW);
    y = kpiRow(doc, "Publicaciones totales", fmt(ig.profile.mediaCount), y, pageW);

    if (ig.insights) {
      y = kpiRow(doc, "Alcance semanal", fmt(ig.insights.weeklyReach ?? 0), y, pageW);

      y += 4;
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(60, 60, 60);
      doc.text("Últimos 20 posts", 18, y);
      y += 6;

      y = kpiRow(doc, "Alcance", fmt(ig.insights.reach), y, pageW);
      y = kpiRow(doc, "Reproducciones (Reels)", fmt(ig.insights.views ?? 0), y, pageW);
      y = kpiRow(doc, "Me gusta", fmt(ig.insights.likes ?? 0), y, pageW);
      y = kpiRow(doc, "Comentarios", fmt(ig.insights.comments ?? 0), y, pageW);
      y = kpiRow(doc, "Guardados", fmt(ig.insights.saves), y, pageW);
      y = kpiRow(doc, "Compartidos", fmt(ig.insights.shares ?? 0), y, pageW);
    }
  } else {
    doc.setFontSize(9);
    doc.setTextColor(130, 130, 130);
    doc.text("Sin datos de Instagram configurados.", 18, y);
    y += 10;
  }

  // ── Pie de página — al final del contenido ───────────────────
  y += 10;
  doc.setFontSize(7);
  doc.setTextColor(160, 160, 160);
  doc.text(`Generado el ${now.toLocaleDateString("es-CL")} · winforma.cl`, 14, y);

  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(160, 160, 160);
    doc.text(`${i} / ${totalPages}`, pageW - 14, doc.internal.pageSize.getHeight() - 6, { align: "right" });
  }

  const filename = `winforma-informe-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}.pdf`;
  doc.save(filename);
}
