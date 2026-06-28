import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function GraciasPage() {
  return (
    <>
      <Header />
      <main className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-6">❤️</div>
        <h1 className="text-3xl font-bold mb-3 text-gray-900 dark:text-white">
          ¡Gracias por tu apoyo!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Tu aporte hace posible que Winforma siga ejerciendo periodismo independiente en La Araucanía. Cada donación financia reportajes que el poder preferiría ignorar, voces que merecen ser escuchadas y territorios que la prensa tradicional no cubre.
        </p>
        <Link
          to="/"
          className="inline-block rounded-lg px-6 py-3 font-semibold text-white"
          style={{ backgroundColor: "#FF1616" }}
        >
          Volver al inicio
        </Link>
      </main>
      <Footer />
    </>
  );
}
