import { useState, type FormEvent } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const CONTACT_EMAIL = "winforma.cl@gmail.com";

const ContactPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const body = encodeURIComponent(`Nombre: ${name}\nCorreo: ${email}\n\n${message}`);
    const subjectEncoded = encodeURIComponent(subject || "Mensaje desde WINFORMA");
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subjectEncoded}&body=${body}`;
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="Contacto — WINFORMA"
        description="Contáctate con el equipo de WINFORMA. Envíanos tus consultas, denuncias o historias a través de nuestro formulario de contacto."
        path="/contacto"
        keywords={["contacto", "WINFORMA", "denuncias", "prensa"]}
      />
      <Header />

      <main className="container mx-auto px-4 py-12 max-w-2xl">
        <p className="text-xs font-sans text-muted-foreground uppercase tracking-widest mb-3">Escríbenos</p>
        <h1 className="text-3xl lg:text-4xl font-black font-serif mb-3">Contacto</h1>
        <p className="text-muted-foreground font-sans mb-10 text-base leading-relaxed">
          ¿Tienes una denuncia, una historia que contar o alguna consulta para nuestro equipo? Completa el formulario y te responderemos a la brevedad.
        </p>

        {sent ? (
          <div className="rounded-xl border border-border bg-muted/30 px-6 py-10 text-center">
            <p className="text-xl font-black font-serif mb-2">¡Mensaje enviado!</p>
            <p className="text-muted-foreground font-sans text-sm">
              Se abrió tu cliente de correo con el mensaje listo para enviar. Si no se abrió automáticamente, escríbenos directamente a{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary font-semibold hover:underline">
                {CONTACT_EMAIL}
              </a>
              .
            </p>
            <Button variant="outline" className="mt-6" onClick={() => setSent(false)}>
              Enviar otro mensaje
            </Button>
          </div>
        ) : (
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="contact-name">Nombre</Label>
                <Input
                  id="contact-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-email">Correo electrónico</Label>
                <Input
                  id="contact-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.cl"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-subject">Asunto</Label>
              <Input
                id="contact-subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="¿Sobre qué nos escribes?"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-message">Mensaje</Label>
              <Textarea
                id="contact-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Cuéntanos con detalle..."
                rows={6}
                required
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <p className="text-xs text-muted-foreground font-sans">
                También puedes escribirnos directamente a{" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary hover:underline">
                  {CONTACT_EMAIL}
                </a>
              </p>
              <Button type="submit">Enviar mensaje</Button>
            </div>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;
