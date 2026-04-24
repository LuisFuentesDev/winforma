import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Mail } from "lucide-react";
import Seo from "@/components/Seo";

const tarifas = [
  { formato: "Banner Web Principal", plataforma: "Web (Inicio)", tamano: "728 x 90", duracion: "7 días", valor: "$140.000" },
  { formato: "Banner Web Medio", plataforma: "Web (Inicio)", tamano: "970 x 250", duracion: "7 días", valor: "$110.000" },
  { formato: "Banner Entrada Nota", plataforma: "Web (Artículo)", tamano: "728 x 90", duracion: "7 días", valor: "$80.000" },
  { formato: "Banner Lateral Web", plataforma: "Web (Sidebar)", tamano: "300 x 600", duracion: "7 días", valor: "$65.000" },
  { formato: "Paquete RRSS", plataforma: "Facebook + Instagram (Feed + Stories)", tamano: "Variable", duracion: "7 días", valor: "$200.000" },
  { formato: "Reel Publicitario", plataforma: "Instagram (Feed/Reels)", tamano: "1080 x 1920", duracion: "1 día", valor: "$90.000" },
  { formato: "Story Publicitaria", plataforma: "Instagram (Historias)", tamano: "1080 x 1920", duracion: "1 día", valor: "$35.000" },
  { formato: "Post Anclado en Feed", plataforma: "Instagram (Feed)", tamano: "1080 x 1080 / 1080 x 1350", duracion: "1 día", valor: "$50.000" },
];

const Tarifario = () => {
  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="Tarifario publicitario"
        description="Revisa el tarifario publicitario de WINFORMA para campañas en web, Facebook e Instagram."
        path="/tarifario"
        keywords={["tarifario", "publicidad", "medios", "WINFORMA", "Instagram", "Facebook"]}
      />
      <Header />

      <main className="container mx-auto px-4 py-10 max-w-4xl">
        <h1 className="text-3xl lg:text-4xl font-black mb-8">Tarifario</h1>

        <div className="space-y-8 text-foreground font-sans text-base leading-relaxed">
          <p>
            En Winforma ofrecemos espacios publicitarios en página web, Facebook e Instagram, diseñados para maximizar el alcance de tu marca en audiencias locales, regionales y nacionales. Nuestro tarifario es claro, transparente y estandarizado, con valores competitivos y formatos flexibles para todo tipo de campañas.
          </p>

          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-bold text-foreground">Formato Producto</TableHead>
                  <TableHead className="font-bold text-foreground">Plataforma</TableHead>
                  <TableHead className="font-bold text-foreground">Tamaño (px)</TableHead>
                  <TableHead className="font-bold text-foreground">Duración</TableHead>
                  <TableHead className="font-bold text-foreground">Valor (CLP)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tarifas.map((t, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{t.formato}</TableCell>
                    <TableCell>{t.plataforma}</TableCell>
                    <TableCell>{t.tamano}</TableCell>
                    <TableCell>{t.duracion}</TableCell>
                    <TableCell className="font-semibold">{t.valor}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="bg-muted/30 rounded-lg p-6 border border-border">
            <p className="flex items-center gap-2 text-lg font-bold mb-3">
              <Mail className="w-5 h-5 text-primary" />
              📩 Contáctanos para cotizar tu campaña
            </p>
            <p>
              Correo:{" "}
              <a href="mailto:winforma.cl@gmail.com" className="text-primary hover:underline font-medium">
                winforma.cl@gmail.com
              </a>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Tarifario;
