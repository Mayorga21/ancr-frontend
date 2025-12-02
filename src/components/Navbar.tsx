import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { profile, logout, loading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    const confirmed = window.confirm("¿Estás seguro de que deseas cerrar sesión?");

    if (confirmed) {
      try {
        setIsLoggingOut(true);
        await logout();
        // El logout ya maneja la redirección
      } catch (error) {
        console.error("Error al cerrar sesión:", error);
        alert("Hubo un error al cerrar sesión. Intenta de nuevo.");
        setIsLoggingOut(false);
      }
    }
  };

  return (
    <nav className="bg-[#0A2342] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-90 transition">
            <div className="text-2xl font-bold">ANCR</div>
            <div className="hidden md:block text-sm">
              Asociación Norte Costarricense
            </div>
          </Link>

          {/* Links Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="hover:text-blue-200 transition"
            >
              Inicio
            </Link>
            <Link
              to="/noticias"
              className="hover:text-blue-200 transition"
            >
              Noticias
            </Link>
            <Link
              to="/eventos"
              className="hover:text-blue-200 transition"
            >
              Eventos
            </Link>
            <Link
              to="/recursos"
              className="hover:text-blue-200 transition"
            >
              Recursos
            </Link>
            <Link
              to="/devocional"
              className="hover:text-blue-200 transition"
            >
              Devocional
            </Link>

            {/* Panel si está autenticado */}
            {!loading && profile && (
              <Link
                to="/panel"
                className="bg-blue-700 px-4 py-2 rounded hover:bg-blue-600 transition font-medium"
              >
                Panel
              </Link>
            )}

            {/* Login/Logout */}
            {loading ? (
              <div className="px-4 py-2 text-gray-300">...</div>
            ) : profile ? (
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="bg-red-600 px-4 py-2 rounded hover:bg-red-500 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isLoggingOut ? "Cerrando..." : "Cerrar sesión"}
              </button>
            ) : (
              <Link
                to="/login"
                className="bg-green-600 px-4 py-2 rounded hover:bg-green-500 transition font-medium"
              >
                Iniciar sesión
              </Link>
            )}
          </div>

          {/* Botón hamburguesa Mobile */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded hover:bg-[#12355B] transition"
            aria-label="Menú"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Menú Mobile */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link
              to="/"
              className="block py-2 hover:bg-[#12355B] px-3 rounded transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Inicio
            </Link>
            <Link
              to="/noticias"
              className="block py-2 hover:bg-[#12355B] px-3 rounded transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Noticias
            </Link>
            <Link
              to="/eventos"
              className="block py-2 hover:bg-[#12355B] px-3 rounded transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Eventos
            </Link>
            <Link
              to="/recursos"
              className="block py-2 hover:bg-[#12355B] px-3 rounded transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Recursos
            </Link>
            <Link
              to="/devocional"
              className="block py-2 hover:bg-[#12355B] px-3 rounded transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Devocional
            </Link>

            {!loading && profile && (
              <Link
                to="/panel"
                className="block py-2 bg-blue-700 hover:bg-blue-600 px-3 rounded transition font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Panel
              </Link>
            )}

            {loading ? (
              <div className="py-2 px-3 text-gray-300">Cargando...</div>
            ) : profile ? (
              <>
                <div className="py-2 px-3 text-sm text-gray-300">
                  {profile.full_name || "Usuario"}
                </div>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full text-left py-2 bg-red-600 hover:bg-red-500 px-3 rounded disabled:opacity-50 font-medium transition"
                >
                  {isLoggingOut ? "Cerrando..." : "Cerrar sesión"}
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block py-2 bg-green-600 hover:bg-green-500 px-3 rounded font-medium transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Iniciar sesión
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}