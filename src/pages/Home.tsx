export default function Home() {
  return (
    <div className="w-full">
      {/* HERO */}
      <section
        className="relative h-[55vh] w-full bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1545243424-0ce743321e11?auto=format&fit=crop&w=1400&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A2342]/90 via-[#0A2342]/70 to-[#0A2342]/30" />
        <div className="relative z-10 max-w-7xl mx-auto h-full flex flex-col justify-center px-4 md:px-8 text-white">
          <p className="uppercase text-sm tracking-[0.25em] text-[#F6A623] mb-2">
            Ministerio Joven · ANCR
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Jóvenes en misión
          </h1>
          <p className="max-w-xl text-base md:text-lg text-gray-100">
            Sirviendo con fe y compromiso en la Asociación Norte de Costa Rica.
            Descubre noticias, recursos y actividades para tu club y tu distrito.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="/noticias"
              className="px-5 py-2.5 rounded-lg bg-[#F6A623] text-[#0A2342] font-semibold hover:bg-white hover:text-[#0A2342] transition-all"
            >
              Ver noticias
            </a>
            <a
              href="/eventos"
              className="px-5 py-2.5 rounded-lg border border-white/70 text-white hover:bg-white hover:text-[#0A2342] transition-all"
            >
              Próximos eventos
            </a>
          </div>
        </div>
      </section>

      {/* FRANJA DORADA */}
      <section className="bg-[#F6A623] text-[#0A2342]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-sm md:text-base font-medium">
            “La Biblia nos inspira cada día. ¡Queremos que la descubras con nosotros!”
          </p>
          <a
            href="/recursos"
            className="px-4 py-2 border border-[#0A2342] rounded-lg text-sm md:text-base font-semibold hover:bg-[#0A2342] hover:text-white transition-all"
          >
            Comienza aquí
          </a>
        </div>
      </section>

      {/* BLOQUE PRINCIPAL */}
      <section className="bg-[#F3F4F6]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
          <h2 className="text-2xl md:text-3xl font-bold text-[#0A2342] mb-4">
            Bienvenido
          </h2>
          <p className="text-gray-700 max-w-2xl">
            Bienvenido al sitio oficial de la <strong>Asociación Norte de Costa Rica</strong>,
            Iglesia Adventista del Séptimo Día. Aquí encontrarás recursos, noticias y
            actividades del Ministerio Joven y otros departamentos.
          </p>
        </div>
      </section>
    </div>
  );
}
