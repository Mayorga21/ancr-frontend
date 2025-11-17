import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

type NewsItem = {
  id: number;
  title: string;
  summary: string;
  created_at: string;
  church_id: number | null;
  churches?: {
    name: string;
  } | null;
};

export default function Noticias() {
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("news")
        .select(
          `
          id,
          title,
          summary,
          created_at,
          church_id,
          churches ( name )
        `
        )
        .returns<NewsItem[]>() // 👈 le decimos a TS qué viene
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        setNews([]);
        return;
      }

      setNews(data ?? []);
    };

    load();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-[#0A2342] mb-6">Noticias</h1>

      {news.length === 0 ? (
        <p>No hay noticias todavía.</p>
      ) : (
        <div className="space-y-5">
          {news.map((n) => (
            <article key={n.id} className="bg-white p-4 shadow rounded-lg">
              <h2 className="text-xl font-bold text-[#0A2342]">{n.title}</h2>
              <p className="text-sm text-gray-600 mt-1">
                {new Date(n.created_at).toLocaleDateString()}
                {n.churches?.name ? ` — ${n.churches.name}` : ""}
              </p>
              <p className="mt-2 text-gray-700">{n.summary}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
