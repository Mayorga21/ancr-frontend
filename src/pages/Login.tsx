import { FormEvent, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) setErrorMsg("Credenciales incorrectas o usuario no autorizado.");
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (user) {
    return (
      <div className="max-w-lg mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-[#0A2342] mb-4">
          Panel de líder
        </h1>
        <p className="mb-2">
          Bienvenido, <strong>{user.full_name || "Usuario"}</strong>.
        </p>
        <p className="mb-4">
          Rol: <strong>{user.role}</strong>
        </p>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-lg"
        >
          Cerrar sesión
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-[#0A2342] mb-4">
        En vivo / Login de líderes
      </h1>
      <p className="text-sm text-gray-600 mb-4">
        Solo el departamental de jóvenes, pastores y encargados de comunicación
        de iglesia pueden iniciar sesión.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Correo</label>
          <input
            type="email"
            className="mt-1 w-full border rounded-lg px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            required
          />
        </div>
        {errorMsg && <p className="text-red-600 text-sm">{errorMsg}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#0A2342] text-white py-2 rounded-lg hover:bg-[#12355B]"
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </div>
  );
}
