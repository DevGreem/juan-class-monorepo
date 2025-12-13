"use client";

import Link from "next/link";

const FOOTER_LINKS = [
  { href: "/shop", label: "Tienda" },
  { href: "/admin/inventory", label: "Inventario" },
  { href: "/admin/sales", label: "Ventas" },
];

export default function Footer() {
  return (
    <footer className="mt-16 bg-linear-to-b from-amber-100/80 via-amber-50 to-white text-sm text-stone-600">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:grid-cols-[2fr,1fr] sm:px-10">
        <div className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-amber-700">La Espiga</p>
            <p className="mt-2 text-2xl font-semibold text-stone-900">Pan recien horneado desde 1998</p>
          </div>
          <p className="max-w-md text-sm leading-6 text-stone-600">
            Visitanos en Calle El Conde #245, Zona Colonial, Santo Domingo, República Dominicana. Abierto todos los días de 7am a 9pm.
          </p>
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-amber-800">
            <span className="rounded-full bg-white/80 px-3 py-1 ring-1 ring-amber-200">Panaderia</span>
            <span className="rounded-full bg-white/80 px-3 py-1 ring-1 ring-amber-200">Cafeteria</span>
            <span className="rounded-full bg-white/80 px-3 py-1 ring-1 ring-amber-200">República Dominicana</span>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <p className="text-xs uppercase tracking-[0.25em] text-amber-700">Explora</p>
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex items-center justify-between rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-stone-700 shadow-sm ring-1 ring-amber-100 transition hover:-translate-y-0.5 hover:bg-white"
            >
              <span>{link.label}</span>
              <span aria-hidden>→</span>
            </Link>
          ))}
        </div>
      </div>
      <div className="border-t border-amber-100 bg-white/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-5 text-xs text-stone-500 sm:flex-row sm:px-10">
          <p>© {new Date().getFullYear()} La Espiga. Todos los derechos reservados.</p>
          <p className="flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.3em] text-amber-800">
            Hecho con <span aria-hidden>🧡</span> en Santo Domingo, República Dominicana
          </p>
        </div>
      </div>
    </footer>
  );
}
