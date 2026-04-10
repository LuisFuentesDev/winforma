import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="Politica de privacidad"
        description="Consulta la politica de privacidad de WINFORMA y el tratamiento de datos del sitio."
        path="/politica-de-privacidad"
        keywords={["privacidad", "cookies", "datos personales", "WINFORMA"]}
      />
      <Header />

      <main className="container mx-auto px-4 py-10 max-w-3xl">
        <h1 className="text-3xl lg:text-4xl font-black mb-8">Política de privacidad</h1>

        <div className="prose prose-sm max-w-none space-y-6 text-foreground font-sans text-base leading-relaxed">
          <p>
            El presente Política de Privacidad establece los términos en que W Informa usa y protege la información de los usuarios al momento de utilizar su sitio web. Este medio está comprometida con la seguridad de los datos de sus usuarios. Sin embargo esta Política de Privacidad puede cambiar con el tiempo o ser actualizada por lo que le recomendamos y enfatizamos revisar continuamente esta página para asegurarse que está de acuerdo con dichos cambios.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-3">Cookies</h2>
          <p>
            Una cookie se refiere a un fichero que es enviado con la finalidad de solicitar permiso para almacenarse en su ordenador, al aceptar dicho fichero se crea y la cookie sirve entonces para tener información respecto al tráfico web, y también facilita las futuras visitas a una web recurrente. Otra función que tienen las cookies es que con ellas las web pueden reconocerte individualmente y por tanto brindarte el mejor servicio personalizado de su web.
          </p>
          <p>
            Nuestro sitio web emplea las cookies para poder identificar las páginas que son visitadas y su frecuencia. Esta información es empleada únicamente para análisis estadístico y después la información se elimina de forma permanente. Usted puede eliminar las cookies en cualquier momento desde su ordenador. Sin embargo las cookies ayudan a proporcionar un mejor servicio de los sitios web, estás no dan acceso a información de su ordenador ni de usted, a menos de que usted así lo quiera y la proporcione directamente, visitas a una web. Usted puede aceptar o negar el uso de cookies, sin embargo la mayoría de navegadores aceptan cookies automáticamente pues sirve para tener un mejor servicio web. También usted puede cambiar la configuración de su ordenador para declinar las cookies. Si se declinan es posible que no pueda utilizar algunos de nuestros servicios.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-3">Enlaces a Terceros</h2>
          <p>
            Este sitio web pudiera contener enlaces a otros sitios que pudieran ser de su interés. Una vez que usted de clic en estos enlaces y abandone nuestra página, ya no tenemos control sobre al sitio al que es redirigido y por lo tanto no somos responsables de los términos o privacidad ni de la protección de sus datos en esos otros sitios terceros. Dichos sitios están sujetos a sus propias políticas de privacidad por lo cual es recomendable que los consulte para confirmar que usted está de acuerdo con estas.
          </p>
          <p>
            El desarrollador de esta web se reserva el derecho de cambiar los términos de la presente Política de Privacidad en cualquier momento.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
