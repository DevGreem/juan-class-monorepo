type Feature = {
  title: string;
  description: string;
  detail: string;
};

type Product = {
  name: string;
  note: string;
  price: string;
};

const features: Feature[] = [
  {
    title: "Masa madre viva",
    description: "Fermentacion lenta 36 horas para sabor profundo y corteza dorada.",
    detail: "Sin aditivos, solo harina de trigo seleccionada, agua y sal marina.",
  },
  {
    title: "Horneos del dia",
    description: "Sacamos bandejas recien hechas a las 7:30, 12:00 y 17:00.",
    detail: "Si llegas y ya no hay, te apartamos la siguiente tanda.",
  },
  {
    title: "Cafe y mesa",
    description: "Extraccion cuidada con granos de tostadores locales.",
    detail: "Capuchino con canela, espresso clasico o cold brew segun el clima.",
  },
];

const products: Product[] = [
  { name: "Baguette rustica", note: "corteza crujiente, miga aireada", price: "$3.20" },
  { name: "Hogaza de campo", note: "masa madre, 1 kg", price: "$5.80" },
  { name: "Pan de semillas", note: "linaza, girasol y avena", price: "$4.90" },
  { name: "Rol de canela", note: "glaseado de vainilla", price: "$2.40" },
  { name: "Focaccia mediterranea", note: "tomate confitado y romero", price: "$4.60" },
  { name: "Croissant de mantequilla", note: "laminado a mano", price: "$2.80" },
];

const badges = [
  "Panaderia de barrio",
  "Hecho a mano",
  "Cafe de especialidad",
];

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 via-orange-50 to-amber-100 text-stone-900">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-amber-200 blur-3xl opacity-60" />
        <div className="absolute right-0 bottom-10 h-72 w-72 rounded-full bg-orange-300 blur-3xl opacity-50" />
      </div>

      <main className="mx-auto flex max-w-6xl flex-col gap-16 px-6 py-14 sm:px-10 lg:py-20">
        <section className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap gap-2">
              {badges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-full bg-white/70 px-3 py-1 text-sm font-medium text-amber-900 shadow-sm ring-1 ring-amber-100 backdrop-blur"
                >
                  {badge}
                </span>
              ))}
            </div>
            <div className="flex flex-col gap-4">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-800">
                La Espiga
              </p>
              <h1 className="text-4xl font-semibold leading-tight text-stone-950 sm:text-5xl lg:text-6xl">
                Pan recien horneado, aroma a mantequilla y mesa para quedarse.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-stone-700">
                Somos la panaderia de la esquina donde la masa madre no duerme, el cafe
                se sirve con calma y los vecinos pasan a saludar. Ven por tus clasicos
                o pide que apartemos tu hogaza favorita.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="/shop"
                className="rounded-full bg-amber-700 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-amber-200 transition hover:-translate-y-0.5 hover:bg-amber-800"
              >
                Ver menu
              </a>
              <a
                href="tel:+34999999999"
                className="rounded-full border border-amber-800/40 bg-white/80 px-6 py-3 text-base font-semibold text-amber-900 shadow-sm transition hover:-translate-y-0.5 hover:border-amber-800"
              >
                Llamar y apartar
              </a>
              <span className="text-sm text-stone-600">Pedidos con 2 horas de anticipacion.</span>
            </div>

            <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
              <div className="rounded-xl bg-white/80 p-4 shadow-sm ring-1 ring-amber-100">
                <p className="font-semibold text-amber-900">Horneamos</p>
                <p className="text-stone-600">7:30 / 12:00 / 17:00</p>
              </div>
              <div className="rounded-xl bg-white/80 p-4 shadow-sm ring-1 ring-amber-100">
                <p className="font-semibold text-amber-900">Cafe</p>
                <p className="text-stone-600">Blend de tostadores locales</p>
              </div>
              <div className="rounded-xl bg-white/80 p-4 shadow-sm ring-1 ring-amber-100">
                <p className="font-semibold text-amber-900">Direccion</p>
                <p className="text-stone-600">Calle del trigo 123, barrio centro</p>
              </div>
            </div>
          </div>

          <div className="relative h-full rounded-3xl bg-linear-to-br from-white via-amber-50 to-white p-8 shadow-xl ring-1 ring-amber-100">
            <div className="absolute inset-4 rounded-2xl border border-dashed border-amber-200/70" />
            <div className="relative flex h-full flex-col justify-between gap-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-amber-800">Desde 1998</p>
                  <p className="text-2xl font-semibold text-stone-950">La Espiga</p>
                </div>
                <div className="rounded-full bg-amber-700 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
                  Artesanal
                </div>
              </div>
              <p className="text-base leading-7 text-stone-700">
                Nuestro obrador arranca antes del amanecer con la misma receta: masa madre
                alimentada a diario, mantequilla de origen local y paciencia. Si quieres ver
                el horneado, asomate por la ventana del taller.
              </p>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="rounded-xl bg-amber-900 text-amber-50 p-4 shadow-md">
                  <p className="text-xs uppercase tracking-[0.2em] opacity-80">Hidratacion</p>
                  <p className="text-2xl font-semibold">78%</p>
                </div>
                <div className="rounded-xl bg-white/90 p-4 shadow-sm ring-1 ring-amber-100">
                  <p className="text-xs uppercase tracking-[0.2em] text-amber-800">Refrigerada</p>
                  <p className="text-2xl font-semibold text-stone-950">14h</p>
                </div>
                <div className="rounded-xl bg-white/90 p-4 shadow-sm ring-1 ring-amber-100">
                  <p className="text-xs uppercase tracking-[0.2em] text-amber-800">Temperatura</p>
                  <p className="text-2xl font-semibold text-stone-950">245C</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="menu" className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <div className="flex flex-col gap-4">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-800">Menu</p>
            <h2 className="text-3xl font-semibold text-stone-950 sm:text-4xl">
              Panes diarios y dulces que vuelan temprano.
            </h2>
            <p className="text-base leading-7 text-stone-700">
              Ven por tu clasico o llama para apartar la siguiente tanda. Si buscas algo
              especial para brunch o mesa grande, avisa con 24 horas.
            </p>
            <div className="flex items-center gap-3 text-sm text-stone-700">
              <span className="rounded-full bg-white/80 px-3 py-1 font-semibold text-amber-900 ring-1 ring-amber-100">
                Pedido minimo a domicilio $18
              </span>
              <span>Repartimos en bici en 3 km.</span>
            </div>
          </div>

        </section>

        <section className="grid gap-6 rounded-3xl bg-white/90 p-8 shadow-xl ring-1 ring-amber-100 lg:grid-cols-3">
          {features.map((item) => (
            <div key={item.title} className="flex flex-col gap-3">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-800">
                {item.title}
              </p>
              <p className="text-lg font-semibold text-stone-950">{item.description}</p>
              <p className="text-sm text-stone-700">{item.detail}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div className="rounded-3xl bg-linear-to-br from-amber-800 via-amber-700 to-amber-600 p-8 text-amber-50 shadow-xl">
            <div className="flex items-center justify-between">
              <p className="text-sm uppercase tracking-[0.25em]">Sabado y domingo</p>
              <span className="rounded-full bg-amber-50/15 px-3 py-1 text-xs font-semibold">Brunch</span>
            </div>
            <h3 className="mt-4 text-3xl font-semibold">Mesa larga compartida</h3>
            <p className="mt-3 text-base leading-7 text-amber-50/80">
              Bandejas de panes, mantequilla batida, mermeladas de temporada, cafe filtrado y
              huevos de corral. Reserva con 24 horas para garantizar sitio.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl bg-amber-50/10 p-4 ring-1 ring-amber-50/20">
                <p className="text-xs uppercase tracking-[0.2em] opacity-80">Horario</p>
                <p className="text-lg font-semibold">9:00 a 13:00</p>
              </div>
              <div className="rounded-2xl bg-amber-50/10 p-4 ring-1 ring-amber-50/20">
                <p className="text-xs uppercase tracking-[0.2em] opacity-80">Precio</p>
                <p className="text-lg font-semibold">$18 por persona</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 rounded-3xl bg-white/90 p-8 shadow-xl ring-1 ring-amber-100">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-800">
                Vecinos opinan
              </p>
              <span className="text-sm text-amber-900">4.9/5</span>
            </div>
            <div className="grid gap-3 text-sm text-stone-700">
              <blockquote className="rounded-2xl bg-amber-50/70 p-4 ring-1 ring-amber-100">
                "La hogaza de campo dura toda la semana y el aroma llena la cocina." — Clara, cuadra 3
              </blockquote>
              <blockquote className="rounded-2xl bg-amber-50/70 p-4 ring-1 ring-amber-100">
                "El cafe con leche y un croissant es mi ritual antes del trabajo." — Luis, oficina cercana
              </blockquote>
              <blockquote className="rounded-2xl bg-amber-50/70 p-4 ring-1 ring-amber-100">
                "Apartan el pan sin problema y siempre sale a la hora." — Camila, cliente diaria
              </blockquote>
            </div>
          </div>
        </section>

        <section className="grid gap-6 rounded-3xl bg-white/90 p-8 shadow-xl ring-1 ring-amber-100 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-800">Visitanos</p>
            <h3 className="text-3xl font-semibold text-stone-950">Cerca, facil y con estacionamiento.</h3>
            <p className="text-base leading-7 text-stone-700">
              Estamos a 5 minutos andando del mercado central. Hay espacio para dejar la bici
              y dos plazas de coche breves frente al local. Si necesitas recogida rapida,
              llama al llegar y te sacamos la bolsa.
            </p>
            <div className="grid gap-3 text-sm sm:grid-cols-2">
              <div className="rounded-2xl bg-amber-50 p-4 ring-1 ring-amber-100">
                <p className="text-xs uppercase tracking-[0.2em] text-amber-800">Horario</p>
                <p className="font-semibold text-stone-950">Lun - Vie 7:00 a 19:30</p>
                <p className="text-stone-600">Sab 8:00 a 14:00</p>
              </div>
              <div className="rounded-2xl bg-amber-50 p-4 ring-1 ring-amber-100">
                <p className="text-xs uppercase tracking-[0.2em] text-amber-800">Contacto</p>
                <p className="font-semibold text-stone-950">+34 999 999 999</p>
                <p className="text-stone-600">pedidos@laespiga.com</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 rounded-2xl bg-amber-900 text-amber-50 p-6 shadow-xl">
            <p className="text-sm uppercase tracking-[0.2em]">Consejo del panadero</p>
            <p className="text-lg font-semibold">Para que tu hogaza siga crujiente</p>
            <ul className="grid gap-2 text-sm text-amber-50/90">
              <li>Dejala respirar en rejilla los primeros 30 minutos.</li>
              <li>Guarda en bolsa de algodon, nunca en plastico.</li>
              <li>Reanima 8 minutos a 180C para recuperar la corteza.</li>
            </ul>
            <a
              href="mailto:pedidos@laespiga.com"
              className="mt-4 inline-flex w-fit items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-900 shadow-md transition hover:-translate-y-0.5"
            >
              Agenda tu pedido
              <span aria-hidden>-&gt;</span>
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
