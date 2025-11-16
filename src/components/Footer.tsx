export default function Footer() {
  return (
    <footer className="bg-[#12355B] text-gray-100">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 grid md:grid-cols-3 gap-8">
        <div>
          <h4 className="text-lg font-semibold text-white">ANCR</h4>
          <p className="text-sm opacity-80">
            Iglesia Adventista del Séptimo Día<br />
            Asociación Norte de Costa Rica
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-white">Enlaces</h4>
          <ul className="space-y-2 mt-2 text-sm">
            <li><a href="/noticias" className="hover:text-[#F6A623]">Noticias</a></li>
            <li><a href="/eventos" className="hover:text-[#F6A623]">Eventos</a></li>
            <li><a href="/recursos" className="hover:text-[#F6A623]">Recursos</a></li>
          </ul>
        </div>
        <div className="text-sm md:text-right">
          <p className="text-gray-300">
            © {new Date().getFullYear()} ANCR<br />
            Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

