import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AMOUNTS = [1000, 2500, 5000, 10000, 20000];

const fmt = (n: number) =>
  new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(n);

export default function DonatePage() {
  const [amount, setAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const finalAmount = showCustom ? (parseInt(customAmount.replace(/\D/g, "")) || null) : amount;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!finalAmount || finalAmount < 500) { setError("El monto mínimo es $500"); return; }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/flow-donate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: finalAmount, name, email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error desconocido");
      window.location.href = data.url;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <>
      <Header />
      <main className="max-w-lg mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
          Apoya a Winforma
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          El periodismo independiente en La Araucanía y Chile necesita de tu apoyo. En Winforma informamos sin ataduras políticas ni económicas, desde el territorio, para que las historias que importan no queden en silencio.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label className="text-base font-semibold mb-3 block">Elige un monto <span className="text-xs font-normal text-gray-400">* mínimo $500</span></Label>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-3">
              {AMOUNTS.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => { setAmount(a); setShowCustom(false); setCustomAmount(""); }}
                  className={`rounded-lg border-2 py-3 text-sm font-bold transition-colors ${
                    !showCustom && amount === a
                      ? "border-red-600 bg-red-600 text-white"
                      : "border-gray-200 hover:border-red-400"
                  }`}
                >
                  {fmt(a)}
                </button>
              ))}
              <button
                type="button"
                onClick={() => { setShowCustom(true); setAmount(null); }}
                className={`rounded-lg border-2 py-3 text-sm font-bold transition-colors ${
                  showCustom
                    ? "border-red-600 bg-red-600 text-white"
                    : "border-gray-200 hover:border-red-400"
                }`}
              >
                Otro monto
              </button>
            </div>
            {showCustom && (
              <div className="mt-3">
                <Input
                  autoFocus
                  type="number"
                  min={500}
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="Ingresa el monto en CLP"
                  className="text-center text-lg font-bold"
                />
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <Label htmlFor="name">Nombre (opcional)</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email">Email (opcional)</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.cl"
                className="mt-1"
              />
            </div>
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <Button
            type="submit"
            disabled={!finalAmount || loading}
            className="w-full text-base py-6"
            style={{ backgroundColor: "#FF1616" }}
          >
            {loading ? "Redirigiendo…" : finalAmount ? `Donar ${fmt(finalAmount)}` : "Selecciona un monto"}
          </Button>
        </form>

        <p className="text-xs text-gray-400 mt-6 text-center">
          Pago seguro procesado por Flow. Winforma no almacena datos de tarjeta.
        </p>
      </main>
      <Footer />
    </>
  );
}
