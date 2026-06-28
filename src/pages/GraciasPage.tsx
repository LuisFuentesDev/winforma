import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function GraciasPage() {
  return (
    <>
      <Header />
      <main className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-6">❤️</div>
        <h1 className="text-3xl font-bold mb-3" style={{ color: "#061450" }}>
          ¡Gracias por tu apoyo!
        </h1>
        <p className="text-gray-600 mb-8">
          Tu donación ayuda a Winforma a seguir siendo un medio independiente en La Araucanía.
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
