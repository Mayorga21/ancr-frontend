import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

type ResourceItem = {
  id: number;
  title: string;
  description: string | null;
  url: string;
  category: string | null;
  created_at?: string;
};

export default function Recursos() {
  const [resources, setResources] = useState<ResourceItem[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("resources")
        .select("id, title, description, url, category, created_at")
        .returns<ResourceItem[]>() // 👈 tipamos lo que viene
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        setResources([]);
        return;
      }

      setResources(data ?? []);
    };

    load();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-[#0A2342] mb-6">Recursos</h1>

      {resources.length === 0 ? (
        <p>No hay recursos aún.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {resources.map((r) => (
            <article key={r.id} className="bg-white p-4 shadow rounded-lg">
              <h2 className="text-xl font-bold text-[#0A2342]">{r.title}</h2>

              {r.category && (
                <p className="text-xs uppercase text-gray-500">{r.category}</p>
              )}

              {r.description && (
                <p className="mt-2 text-gray-700">{r.description}</p>
              )}

              <a
                href={r.url}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block text-[#F6A623] font-semibold"
              >
                Abrir recurso →
              </a>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
