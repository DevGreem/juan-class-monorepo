"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCartCount } from "@/src/utils/cart";

export default function CartLink() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const syncCount = () => {
      setCount(getCartCount());
    };

    syncCount();
    window.addEventListener("cart-change", syncCount);
    window.addEventListener("focus", syncCount);

    return () => {
      window.removeEventListener("cart-change", syncCount);
      window.removeEventListener("focus", syncCount);
    };
  }, []);

  return (
    <Link
      href="/cart"
      className="relative inline-flex items-center gap-2 rounded-full px-3 py-2 font-semibold text-stone-800 transition hover:bg-amber-50 hover:text-amber-900"
    >
      <span>Carrito</span>
      {count > 0 && (
        <span className="min-w-7 rounded-full bg-amber-700 px-2 py-0.5 text-center text-xs font-bold text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
