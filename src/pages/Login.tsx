import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { profile, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Si ya hay sesión, mandamos al panel
  useEffect(() => {
    if (!loading && profile) {
      navigate("/panel", { replace: true });
    }
  }, [loading, profile, navigate]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message || "No se pudo iniciar sesión.");
      setSubmitting(false);
      return;
    }

    // El AuthContext escuchará el cambio y cargará el profile
    setSubmitting(false);
    navigate("/panel", { replace: true });
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto px-4 py-10">
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-[#0A2342] mb-4">Iniciar sesión</h1>
      <p className="text-sm text-gray-600 mb-6">
        Panel para departamental de jóvenes, pastores de distrito y encargados
        de comunicaciones de iglesia.
      </p>

      {errorMsg && (
        <div className="mb-4 rounded bg-red-100 text-red-700 px-3 py-2 text-sm">
          {errorMsg}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium">Correo electrónico</label>
          <input
            type="email"
            className="mt-1 w-full border rounded-lg px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Contraseña</label>
          <input
            type="password"
            className="mt-1 w-full border rounded-lg px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full mt-2 px-4 py-2 bg-[#0A2342] text-white rounded-lg hover:bg-[#12355B] disabled:opacity-60"
        >
          {submitting ? "Ingresando..." : "Ingresar"}
        </button>
      </form>

      <p className="mt-4 text-xs text-gray-500">
        Si tienes problemas para acceder, contacta al departamental de jóvenes
        de ANCR.
      </p>

      <div className="mt-6 text-center">
        <Link to="/" className="text-sm text-[#0A2342] underline">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
