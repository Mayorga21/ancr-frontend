import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

type EventItem = {
  id: number;
  title: string;
  description: string | null;
  date: string;
  place: string;
  church_id: number | null;
  churches?: {
    name: string;
  } | null;
};

export default function Eventos() {
  const [events, setEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("events")
        .select(
          `
          id,
          title,
          description,
          date,
          place,
          church_id,
          churches ( name )
        `
        )
        .returns<EventItem[]>() // 👈 aquí le decimos a TS qué viene
        .order("date", { ascending: true });

      if (error) {
        console.error(error);
        setEvents([]);
        return;
      }

      setEvents(data ?? []); // data es EventItem[] | null → lo forzamos a []
    };

    load();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-[#0A2342] mb-6">Eventos</h1>

      {events.length === 0 ? (
        <p>No hay eventos registrados.</p>
      ) : (
        <div className="space-y-5">
          {events.map((e) => (
            <article key={e.id} className="bg-white p-4 shadow rounded-lg">
              <h2 className="text-xl font-bold text-[#0A2342]">{e.title}</h2>

              <p className="text-sm text-gray-600 mt-1">
                {new Date(e.date).toLocaleDateString()} — {e.place}
                {e.churches?.name ? ` — ${e.churches.name}` : ""}
              </p>

              {e.description && (
                <p className="mt-2 text-gray-700">{e.description}</p>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
