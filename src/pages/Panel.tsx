import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";

type Church = {
  id: number;
  name: string;
};

export default function Panel() {
  const { profile, loading } = useAuth();

  const [churches, setChurches] = useState<Church[]>([]);
  const [globalMsg, setGlobalMsg] = useState<string | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);

  // ---- estados formularios NOTICIAS ----
  const [newsTitle, setNewsTitle] = useState("");
  const [newsSummary, setNewsSummary] = useState("");
  const [newsChurchId, setNewsChurchId] = useState<string>("");

  // ---- estados formularios EVENTOS ----
  const [eventTitle, setEventTitle] = useState("");
  const [eventDesc, setEventDesc] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventPlace, setEventPlace] = useState("");
  const [eventChurchId, setEventChurchId] = useState<string>("");

  // ---- estados formularios RECURSOS ----
  const [resTitle, setResTitle] = useState("");
  const [resDesc, setResDesc] = useState("");
  const [resUrl, setResUrl] = useState("");
  const [resCategory, setResCategory] = useState("");
  const [resFile, setResFile] = useState<File | null>(null);

  // ------------------- cargar iglesias que puede usar este usuario -------------------
  useEffect(() => {
    const loadChurches = async () => {
      if (!profile) return;

      let query = supabase.from("churches").select("id, name");

      if (profile.role === "pastor" && profile.district_id) {
        query = query.eq("district_id", profile.district_id);
      } else if (profile.role === "iglesia" && profile.church_id) {
        query = query.eq("id", profile.church_id);
      }
      // admin: sin filtros, ve todas

      const { data, error } = await query.order("name", { ascending: true });

      if (error) {
        console.error(error);
      } else if (data) {
        setChurches(data as Church[]);
      }
    };

    void loadChurches();
  }, [profile]);

  // ------------------- helpers -------------------
  const resetMessages = () => {
    setGlobalMsg(null);
    setGlobalError(null);
  };

  // ------------------- submit NOTICIA -------------------
  const handleNewsSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    resetMessages();
    if (!profile) return;

    const church_id =
      newsChurchId === "" ? null : Number.parseInt(newsChurchId, 10);

    const { error } = await supabase.from("news").insert({
      title: newsTitle,
      summary: newsSummary,
      church_id,
      created_by: profile.id,
    });

if (error) {
  console.error(error);
  const msg = "No se pudo crear la noticia: " + (error.message ?? "");
  setGlobalError(msg);
  alert(msg);
} else {
  // ...
}

  };

  // ------------------- submit EVENTO -------------------
  const handleEventSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    resetMessages();
    if (!profile) return;

    const church_id =
      eventChurchId === "" ? null : Number.parseInt(eventChurchId, 10);

    const { error } = await supabase.from("events").insert({
      title: eventTitle,
      description: eventDesc || null,
      date: eventDate,
      place: eventPlace,
      church_id,
      created_by: profile.id,
    });

if (error) {
  console.error(error);
  const msg = "No se pudo crear el evento: " + (error.message ?? "");
  setGlobalError(msg);
  alert(msg);
} else {
  // ...
}

  };

  // ------------------- submit RECURSO (solo admin) -------------------
  const handleResourceSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    resetMessages();
    if (!profile) return;

    try {
      let finalUrl = resUrl.trim();

      // Si el usuario adjuntó archivo, lo subimos al bucket "resources"
      if (resFile) {
        const fileExt = resFile.name.split(".").pop() ?? "file";
        const fileName = `${Date.now()}-${profile.id}.${fileExt}`;
        const filePath = `${profile.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("resources")
          .upload(filePath, resFile);

        if (uploadError) {
          console.error(uploadError);
          setGlobalError(
            "No se pudo subir el archivo del recurso: " + uploadError.message
          );
          return;
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from("resources").getPublicUrl(filePath);

        finalUrl = publicUrl;
      }

      if (!finalUrl) {
        setGlobalError(
          "Debes adjuntar un archivo o indicar una URL para el recurso."
        );
        return;
      }

      const { error } = await supabase.from("resources").insert({
        title: resTitle,
        description: resDesc || null,
        url: finalUrl,
        category: resCategory || null,
        created_by: profile.id,
      });

if (error) {
  console.error(error);
  const msg = "No se pudo crear el recurso: " + (error.message ?? "");
  setGlobalError(msg);
  alert(msg);
} else {
  // ...
}

    } catch (err) {
      console.error(err);
      setGlobalError("Error inesperado al crear el recurso.");
    }
  };

  // ------------------- UI -------------------

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <p>Cargando sesión...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-[#0A2342] mb-4">
          Panel solo para líderes
        </h1>
        <p className="mb-3">
          Para acceder al panel necesitas iniciar sesión como departamental,
          pastor de distrito o encargado de comunicaciones de una iglesia.
        </p>
        <a
          href="/login"
          className="inline-block px-4 py-2 rounded-lg bg-[#0A2342] text-white"
        >
          Ir a Login
        </a>
      </div>
    );
  }

  const esAdmin = profile.role === "admin";
  const esIglesia = profile.role === "iglesia";

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">
      <h1 className="text-3xl font-bold text-[#0A2342] mb-2">
        Panel de líder
      </h1>
      <p className="text-gray-700">
        Sesión iniciada como{" "}
        <strong>{profile.full_name || "Usuario"}</strong> (
        <span className="uppercase">{profile.role}</span>).
      </p>

      {globalMsg && (
        <p className="text-sm text-green-700 bg-green-100 px-3 py-2 rounded">
          {globalMsg}
        </p>
      )}
      {globalError && (
        <p className="text-sm text-red-700 bg-red-100 px-3 py-2 rounded">
          {globalError}
        </p>
      )}

      {/* ------------------- FORM NOTICIAS ------------------- */}
      <section className="bg-white shadow rounded-lg p-4 md:p-6">
        <h2 className="text-xl font-semibold text-[#0A2342] mb-4">
          Crear noticia
        </h2>
        <form className="space-y-4" onSubmit={handleNewsSubmit}>
          <div>
            <label className="block text-sm font-medium">Título</label>
            <input
              className="mt-1 w-full border rounded-lg px-3 py-2"
              value={newsTitle}
              onChange={(e) => setNewsTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Resumen</label>
            <textarea
              className="mt-1 w-full border rounded-lg px-3 py-2"
              rows={3}
              value={newsSummary}
              onChange={(e) => setNewsSummary(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Iglesia</label>
            <select
              className="mt-1 w-full border rounded-lg px-3 py-2"
              value={newsChurchId}
              onChange={(e) => setNewsChurchId(e.target.value)}
            >
              {esAdmin && <option value="">ANCR (general)</option>}
              {churches.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {esIglesia && (
              <p className="text-xs text-gray-500 mt-1">
                Solo puedes publicar para tu iglesia local.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-[#0A2342] text-white rounded-lg hover:bg-[#12355B]"
          >
            Guardar noticia
          </button>
        </form>
      </section>

      {/* ------------------- FORM EVENTOS ------------------- */}
      <section className="bg-white shadow rounded-lg p-4 md:p-6">
        <h2 className="text-xl font-semibold text-[#0A2342] mb-4">
          Crear evento
        </h2>
        <form className="space-y-4" onSubmit={handleEventSubmit}>
          <div>
            <label className="block text-sm font-medium">Título</label>
            <input
              className="mt-1 w-full border rounded-lg px-3 py-2"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Descripción</label>
            <textarea
              className="mt-1 w-full border rounded-lg px-3 py-2"
              rows={3}
              value={eventDesc}
              onChange={(e) => setEventDesc(e.target.value)}
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Fecha</label>
              <input
                type="date"
                className="mt-1 w-full border rounded-lg px-3 py-2"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Lugar</label>
              <input
                className="mt-1 w-full border rounded-lg px-3 py-2"
                value={eventPlace}
                onChange={(e) => setEventPlace(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Iglesia</label>
            <select
              className="mt-1 w-full border rounded-lg px-3 py-2"
              value={eventChurchId}
              onChange={(e) => setEventChurchId(e.target.value)}
            >
              {esAdmin && <option value="">ANCR (general)</option>}
              {churches.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-[#0A2342] text-white rounded-lg hover:bg-[#12355B]"
          >
            Guardar evento
          </button>
        </form>
      </section>

      {/* ------------------- FORM RECURSOS (solo admin) ------------------- */}
      {esAdmin && (
        <section className="bg-white shadow rounded-lg p-4 md:p-6">
          <h2 className="text-xl font-semibold text-[#0A2342] mb-4">
            Crear recurso (solo departamental)
          </h2>
          <form className="space-y-4" onSubmit={handleResourceSubmit}>
            <div>
              <label className="block text-sm font-medium">Título</label>
              <input
                className="mt-1 w-full border rounded-lg px-3 py-2"
                value={resTitle}
                onChange={(e) => setResTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Descripción</label>
              <textarea
                className="mt-1 w-full border rounded-lg px-3 py-2"
                rows={3}
                value={resDesc}
                onChange={(e) => setResDesc(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium">
                Archivo (PDF, Word, PowerPoint, etc.)
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.odt,.odp,.ods"
                className="mt-1 w-full border rounded-lg px-3 py-2"
                onChange={(e) =>
                  setResFile(e.target.files ? e.target.files[0] : null)
                }
              />
              <p className="text-xs text-gray-500 mt-1">
                Puedes adjuntar un archivo, o dejarlo vacío y usar una URL
                externa.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium">
                URL (opcional si adjuntas archivo)
              </label>
              <input
                type="url"
                className="mt-1 w-full border rounded-lg px-3 py-2"
                value={resUrl}
                onChange={(e) => setResUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Categoría</label>
              <input
                className="mt-1 w-full border rounded-lg px-3 py-2"
                value={resCategory}
                onChange={(e) => setResCategory(e.target.value)}
                placeholder="Guías, Recursos JA, Música..."
              />
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-[#0A2342] text-white rounded-lg hover:bg-[#12355B]"
            >
              Guardar recurso
            </button>
          </form>
        </section>
      )}
    </div>
  );
}
