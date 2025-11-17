import { useEffect, useState } from "react";

type VerseResponse = {
  reference: string;
  text: string;
};

const FALLBACK_VERSE: VerseResponse = {
  reference: "Salmo 23:1",
  text: "Jehová es mi pastor; nada me faltará.",
};

export default function Devocional() {
  const [verse, setVerse] = useState<VerseResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadVerse = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);

      // Endpoint que SÍ responde (inglés, pero podemos mostrarlo igual)
      // Docs: https://bible-api.com/
      const res = await fetch("https://bible-api.com/john%203:16");

      if (!res.ok) {
        throw new Error("No se pudo obtener el versículo (API respondió con error).");
      }

      const data = await res.json();

      const v: VerseResponse = {
        reference: data.reference ?? "John 3:16",
        text: (data.text ?? "").trim(),
      };

      setVerse(v);
    } catch (err) {
      console.error(err);
      setErrorMsg("No se pudo obtener el versículo en este momento.");
      // Usamos un versículo local de respaldo para no dejar la pantalla vacía
      setVerse(FALLBACK_VERSE);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadVerse();
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-[#0A2342] mb-4">
        Devocional del día
      </h1>
      <p className="text-sm text-gray-600 mb-6">
        Un versículo para iniciar el día enfocados en Dios.
      </p>

      {loading && <p>Cargando versículo...</p>}

      {errorMsg && !loading && (
        <p className="text-red-600 bg-red-50 px-3 py-2 rounded text-sm mb-4">
          {errorMsg}
        </p>
      )}

      {verse && !loading && (
        <article className="bg-white shadow rounded-lg p-5">
          <p className="text-lg text-gray-800 whitespace-pre-line">
            {verse.text}
          </p>
          <p className="mt-3 text-right font-semibold text-[#0A2342]">
            — {verse.reference}
          </p>
        </article>
      )}

      <button
        onClick={() => void loadVerse()}
        className="mt-6 px-4 py-2 rounded-lg bg-[#0A2342] text-white hover:bg-[#12355B]"
      >
        Volver a cargar
      </button>
    </div>
  );
}
