import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  const base = "px-3 py-2 text-sm md:text-base transition-colors";
  const active = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? `text-[#0A2342] font-semibold ${base}`
      : `text-[#0A2342] hover:text-[#F6A623] ${base}`;

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 py-3">
        <Link to="/" className="text-2xl font-bold text-[#0A2342] tracking-wide">
          ANCR
        </Link>

        <nav className="flex flex-wrap gap-2 items-center">
          <NavLink to="/" className={active}>Inicio</NavLink>
          <NavLink to="/nuestra-iglesia" className={active}>Nuestra Iglesia</NavLink>
          <NavLink to="/departamentos" className={active}>Departamentos</NavLink>
          <NavLink to="/recursos" className={active}>Recursos</NavLink>
          <NavLink to="/noticias" className={active}>Noticias</NavLink>
          <NavLink to="/eventos" className={active}>Eventos</NavLink>

          <NavLink
            to="/login"
            className="ml-2 px-4 py-2 rounded-lg border-2 
                       border-[#F6A623] text-[#F6A623] 
                       hover:bg-[#F6A623] hover:text-white 
                       font-semibold transition-all"
          >
            En vivo / Login
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
