"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import CartLink from "./CartLink";

export default function HeaderNav() {
  return (
    <nav className="flex flex-wrap items-center gap-4 text-base font-semibold text-stone-800">
      <Link href="/" className="rounded-full px-4 py-2.5 hover:bg-amber-50 hover:text-amber-900">
        Inicio
      </Link>
      <Link href="/shop" className="rounded-full px-4 py-2.5 hover:bg-amber-50 hover:text-amber-900">
        Tienda
      </Link>
      <CartLink />
      <Link href="/admin/inventory" className="rounded-full px-4 py-2.5 hover:bg-amber-50 hover:text-amber-900">
        Inventario
      </Link>
      <Link href="/admin/sales" className="rounded-full px-4 py-2.5 hover:bg-amber-50 hover:text-amber-900">
        Ventas
      </Link>
    </nav>
  );
}
