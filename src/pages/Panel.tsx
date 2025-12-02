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
  const [loadingChurches, setLoadingChurches] = useState(true);
  const [globalMsg, setGlobalMsg] = useState<string | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);

  // Estados formularios NOTICIAS
  const [newsTitle, setNewsTitle] = useState("");
  const [newsSummary, setNewsSummary] = useState("");
  const [newsChurchId, setNewsChurchId] = useState<string>("");

  // Estados formularios EVENTOS
  const [eventTitle, setEventTitle] = useState("");
  const [eventDesc, setEventDesc] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventPlace, setEventPlace] = useState("");
  const [eventChurchId, setEventChurchId] = useState<string>("");

  // Estados formularios RECURSOS
  const [resTitle, setResTitle] = useState("");
  const [resDesc, setResDesc] = useState("");
  const [resUrl, setResUrl] = useState("");
  const [resCategory, setResCategory] = useState("");
  const [resFile, setResFile] = useState<File | null>(null);

  // Estados de carga para cada formulario
  const [submittingNews, setSubmittingNews] = useState(false);
  const [submittingEvent, setSubmittingEvent] = useState(false);
  const [submittingResource, setSubmittingResource] = useState(false);

  // Cargar iglesias según rol del usuario
  useEffect(() => {
    const loadChurches = async () => {
      if (!profile) {
        setLoadingChurches(false);
        return;
      }

      try {
        setLoadingChurches(true);
        let query = supabase.from("churches").select("id, name");

        if (profile.role === "pastor" && profile.district_id) {
          query = query.eq("district_id", profile.district_id);
        } else if (profile.role === "iglesia" && profile.church_id) {
          query = query.eq("id", profile.church_id);
        }
        // admin: sin filtros, ve todas

        const { data, error } = await query.order("name", { ascending: true });

        if (error) {
          console.error("Error cargando iglesias:", error);
          setGlobalError("No se pudieron cargar las iglesias");
        } else if (data) {
          setChurches(data as Church[]);
          // Auto-seleccionar si solo hay una iglesia
          if (data.length === 1) {
            setNewsChurchId(String(data[0].id));
            setEventChurchId(String(data[0].id));
          }
        }
      } catch (err) {
        console.error("Error inesperado:", err);
        setGlobalError("Error inesperado al cargar iglesias");
      } finally {
        setLoadingChurches(false);
      }
    };

    void loadChurches();
  }, [profile]);

  const resetMessages = () => {
    setGlobalMsg(null);
    setGlobalError(null);
  };

  // Submit NOTICIA
  const handleNewsSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    resetMessages();
    if (!profile) return;

    setSubmittingNews(true);

    try {
      // Validaciones
      if (!newsTitle.trim()) {
        setGlobalError("El título es obligatorio");
        return;
      }

      if (!newsSummary.trim()) {
        setGlobalError("El resumen es obligatorio");
        return;
      }

      const church_id = newsChurchId === "" ? null : Number.parseInt(newsChurchId, 10);

      // Validar que se seleccionó una iglesia (excepto admin que puede dejar null)
      if (profile.role !== "admin" && !church_id) {
        setGlobalError("Debes seleccionar una iglesia");
        return;
      }

      const { error } = await supabase.from("news").insert({
        title: newsTitle.trim(),
        summary: newsSummary.trim(),
        church_id,
        created_by: profile.id,
      });

      if (error) {
        console.error("Error insertando noticia:", error);
        setGlobalError(`No se pudo crear la noticia: ${error.message}`);
      } else {
        setGlobalMsg("✅ Noticia creada exitosamente");
        // Limpiar formulario
        setNewsTitle("");
        setNewsSummary("");
        if (churches.length !== 1) {
          setNewsChurchId("");
        }
        // Auto-ocultar mensaje después de 5 segundos
        setTimeout(() => setGlobalMsg(null), 5000);
      }
    } catch (err) {
      console.error("Error inesperado:", err);
      setGlobalError("Error inesperado al crear la noticia");
    } finally {
      setSubmittingNews(false);
    }
  };

  // Submit EVENTO
  const handleEventSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    resetMessages();
    if (!profile) return;

    setSubmittingEvent(true);

    try {
      // Validaciones
      if (!eventTitle.trim()) {
        setGlobalError("El título del evento es obligatorio");
        return;
      }

      if (!eventDate) {
        setGlobalError("La fecha del evento es obligatoria");
        return;
      }

      if (!eventPlace.trim()) {
        setGlobalError("El lugar del evento es obligatorio");
        return;
      }

      const church_id = eventChurchId === "" ? null : Number.parseInt(eventChurchId, 10);

      // Validar que se seleccionó una iglesia (excepto admin que puede dejar null)
      if (profile.role !== "admin" && !church_id) {
        setGlobalError("Debes seleccionar una iglesia");
        return;
      }

      const { error } = await supabase.from("events").insert({
        title: eventTitle.trim(),
        description: eventDesc.trim() || null,
        date: eventDate,
        place: eventPlace.trim(),
        church_id,
        created_by: profile.id,
      });

      if (error) {
        console.error("Error insertando evento:", error);
        setGlobalError(`No se pudo crear el evento: ${error.message}`);
      } else {
        setGlobalMsg("✅ Evento creado exitosamente");
        // Limpiar formulario
        setEventTitle("");
        setEventDesc("");
        setEventDate("");
        setEventPlace("");
        if (churches.length !== 1) {
          setEventChurchId("");
        }
        setTimeout(() => setGlobalMsg(null), 5000);
      }
    } catch (err) {
      console.error("Error inesperado:", err);
      setGlobalError("Error inesperado al crear el evento");
    } finally {
      setSubmittingEvent(false);
    }
  };

  // Submit RECURSO (solo admin)
  const handleResourceSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    resetMessages();
    if (!profile || profile.role !== "admin") {
      setGlobalError("Solo los administradores pueden crear recursos");
      return;
    }

    setSubmittingResource(true);

    try {
      // Validaciones
      if (!resTitle.trim()) {
        setGlobalError("El título del recurso es obligatorio");
        return;
      }

      let finalUrl = resUrl.trim();

      // Si adjuntó archivo, subirlo
      if (resFile) {
        const fileExt = resFile.name.split(".").pop() ?? "file";
        const fileName = `${Date.now()}-${profile.id}.${fileExt}`;
        const filePath = `${profile.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("resources")
          .upload(filePath, resFile);

        if (uploadError) {
          console.error("Error subiendo archivo:", uploadError);
          setGlobalError(`No se pudo subir el archivo: ${uploadError.message}`);
          return;
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from("resources").getPublicUrl(filePath);

        finalUrl = publicUrl;
      }

      if (!finalUrl) {
        setGlobalError("Debes adjuntar un archivo o indicar una URL");
        return;
      }

      const { error } = await supabase.from("resources").insert({
        title: resTitle.trim(),
        description: resDesc.trim() || null,
        url: finalUrl,
        category: resCategory.trim() || null,
        created_by: profile.id,
      });

      if (error) {
        console.error("Error insertando recurso:", error);
        setGlobalError(`No se pudo crear el recurso: ${error.message}`);
      } else {
        setGlobalMsg("✅ Recurso creado exitosamente");
        // Limpiar formulario
        setResTitle("");
        setResDesc("");
        setResUrl("");
        setResCategory("");
        setResFile(null);
        // Resetear input de archivo
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) fileInput.value = "";
        setTimeout(() => setGlobalMsg(null), 5000);
      }
    } catch (err) {
      console.error("Error inesperado:", err);
      setGlobalError("Error inesperado al crear el recurso");
    } finally {
      setSubmittingResource(false);
    }
  };

  // UI - Loading de autenticación
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A2342] mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando sesión...</p>
          </div>
        </div>
      </div>
    );
  }

  // UI - No autenticado
  if (!profile) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h1 className="text-2xl font-bold text-[#0A2342] mb-4">
            Panel solo para líderes
          </h1>
          <p className="mb-4 text-gray-700">
            Para acceder al panel necesitas iniciar sesión como departamental,
            pastor de distrito o encargado de comunicaciones de una iglesia.
          </p>
          <a
            href="/login"
            className="inline-block px-6 py-3 rounded-lg bg-[#0A2342] text-white hover:bg-[#12355B] transition"
          >
            Ir a Login
          </a>
        </div>
      </div>
    );
  }

  const esAdmin = profile.role === "admin";
  const esIglesia = profile.role === "iglesia";

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-3xl font-bold text-[#0A2342] mb-2">
          Panel de líder
        </h1>
        <p className="text-gray-700">
          Sesión iniciada como{" "}
          <strong>{profile.full_name || "Usuario"}</strong> (
          <span className="uppercase font-medium text-[#0A2342]">
            {profile.role}
          </span>
          ).
        </p>
      </div>

      {/* Mensajes globales */}
      {globalMsg && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2">
          <span className="text-xl">✅</span>
          <span>{globalMsg}</span>
        </div>
      )}
      {globalError && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center gap-2">
          <span className="text-xl">⚠️</span>
          <span>{globalError}</span>
        </div>
      )}

      {/* Loading de iglesias */}
      {loadingChurches && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg">
          Cargando iglesias disponibles...
        </div>
      )}

      {/* FORM NOTICIAS */}
      <section className="bg-white shadow rounded-lg p-4 md:p-6">
        <h2 className="text-xl font-semibold text-[#0A2342] mb-4">
          📰 Crear noticia
        </h2>
        <form className="space-y-4" onSubmit={handleNewsSubmit}>
          <div>
            <label className="block text-sm font-medium mb-1">
              Título <span className="text-red-600">*</span>
            </label>
            <input
              className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0A2342] focus:border-transparent"
              value={newsTitle}
              onChange={(e) => setNewsTitle(e.target.value)}
              placeholder="Ej: Gran campaña evangelística este fin de semana"
              disabled={submittingNews}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Resumen <span className="text-red-600">*</span>
            </label>
            <textarea
              className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0A2342] focus:border-transparent"
              rows={4}
              value={newsSummary}
              onChange={(e) => setNewsSummary(e.target.value)}
              placeholder="Escribe un resumen de la noticia..."
              disabled={submittingNews}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Iglesia {profile.role !== "admin" && <span className="text-red-600">*</span>}
            </label>
            <select
              className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0A2342] focus:border-transparent"
              value={newsChurchId}
              onChange={(e) => setNewsChurchId(e.target.value)}
              disabled={submittingNews || churches.length === 1}
            >
              {esAdmin && <option value="">ANCR (general)</option>}
              {churches.length === 0 && <option value="">Cargando...</option>}
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
            disabled={submittingNews}
            className="px-6 py-2 bg-[#0A2342] text-white rounded-lg hover:bg-[#12355B] disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {submittingNews ? "Guardando..." : "Guardar noticia"}
          </button>
        </form>
      </section>

      {/* FORM EVENTOS */}
      <section className="bg-white shadow rounded-lg p-4 md:p-6">
        <h2 className="text-xl font-semibold text-[#0A2342] mb-4">
          📅 Crear evento
        </h2>
        <form className="space-y-4" onSubmit={handleEventSubmit}>
          <div>
            <label className="block text-sm font-medium mb-1">
              Título <span className="text-red-600">*</span>
            </label>
            <input
              className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0A2342] focus:border-transparent"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              placeholder="Ej: Culto de jóvenes"
              disabled={submittingEvent}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Descripción</label>
            <textarea
              className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0A2342] focus:border-transparent"
              rows={3}
              value={eventDesc}
              onChange={(e) => setEventDesc(e.target.value)}
              placeholder="Detalles del evento (opcional)"
              disabled={submittingEvent}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Fecha <span className="text-red-600">*</span>
              </label>
              <input
                type="date"
                className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0A2342] focus:border-transparent"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                disabled={submittingEvent}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Lugar <span className="text-red-600">*</span>
              </label>
              <input
                className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0A2342] focus:border-transparent"
                value={eventPlace}
                onChange={(e) => setEventPlace(e.target.value)}
                placeholder="Ej: Templo Central"
                disabled={submittingEvent}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Iglesia {profile.role !== "admin" && <span className="text-red-600">*</span>}
            </label>
            <select
              className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0A2342] focus:border-transparent"
              value={eventChurchId}
              onChange={(e) => setEventChurchId(e.target.value)}
              disabled={submittingEvent || churches.length === 1}
            >
              {esAdmin && <option value="">ANCR (general)</option>}
              {churches.length === 0 && <option value="">Cargando...</option>}
              {churches.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={submittingEvent}
            className="px-6 py-2 bg-[#0A2342] text-white rounded-lg hover:bg-[#12355B] disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {submittingEvent ? "Guardando..." : "Guardar evento"}
          </button>
        </form>
      </section>

      {/* FORM RECURSOS (solo admin) */}
      {esAdmin && (
        <section className="bg-white shadow rounded-lg p-4 md:p-6">
          <h2 className="text-xl font-semibold text-[#0A2342] mb-4">
            📚 Crear recurso (solo departamental)
          </h2>
          <form className="space-y-4" onSubmit={handleResourceSubmit}>
            <div>
              <label className="block text-sm font-medium mb-1">
                Título <span className="text-red-600">*</span>
              </label>
              <input
                className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0A2342] focus:border-transparent"
                value={resTitle}
                onChange={(e) => setResTitle(e.target.value)}
                placeholder="Ej: Guía de adoración infantil"
                disabled={submittingResource}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Descripción</label>
              <textarea
                className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0A2342] focus:border-transparent"
                rows={3}
                value={resDesc}
                onChange={(e) => setResDesc(e.target.value)}
                placeholder="Descripción del recurso (opcional)"
                disabled={submittingResource}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Archivo (PDF, Word, PowerPoint, etc.)
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.odt,.odp,.ods"
                className="mt-1 w-full border rounded-lg px-3 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#0A2342] file:text-white hover:file:bg-[#12355B]"
                onChange={(e) =>
                  setResFile(e.target.files ? e.target.files[0] : null)
                }
                disabled={submittingResource}
              />
              <p className="text-xs text-gray-500 mt-1">
                Puedes adjuntar un archivo, o dejarlo vacío y usar una URL externa.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                URL (opcional si adjuntas archivo)
              </label>
              <input
                type="url"
                className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0A2342] focus:border-transparent"
                value={resUrl}
                onChange={(e) => setResUrl(e.target.value)}
                placeholder="https://..."
                disabled={submittingResource}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Categoría</label>
              <input
                className="mt-1 w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0A2342] focus:border-transparent"
                value={resCategory}
                onChange={(e) => setResCategory(e.target.value)}
                placeholder="Guías, Recursos JA, Música..."
                disabled={submittingResource}
              />
            </div>

            <button
              type="submit"
              disabled={submittingResource}
              className="px-6 py-2 bg-[#0A2342] text-white rounded-lg hover:bg-[#12355B] disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {submittingResource ? "Guardando..." : "Guardar recurso"}
            </button>
          </form>
        </section>
      )}
    </div>
  );
}