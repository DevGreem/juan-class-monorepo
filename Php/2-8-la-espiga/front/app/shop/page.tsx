"use client";

import { useEffect, useMemo, useState } from "react";
import PHPApi from "@/src/types/PHPApi";
import { addItemToCart, getCartItems } from "@/src/utils/cart";
import { SalableProduct } from "@/src/types/products";

export default function ShopPage() {
  const [items, setItems] = useState<SalableProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [feedback, setFeedback] = useState<
    | {
        message: string;
        variant: "success" | "warning";
      }
    | null
  >(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const syncCart = () => {
      const current = getCartItems();
      const map = current.reduce<Record<number, number>>((acc, item) => {
        acc[item.salable_product_id] = item.quantity;
        return acc;
      }, {});
      setQuantities(map);
    };

    const load = async () => {
      try {
        const data = await PHPApi.get("products/salable");
        setItems(data || []);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los productos.");
      } finally {
        setLoading(false);
      }
    };
    load();
    syncCart();

    const handleCartChange = () => {
      syncCart();
    };

    window.addEventListener("cart-change", handleCartChange);

    return () => {
      window.removeEventListener("cart-change", handleCartChange);
    };
  }, []);

  const filteredItems = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();
    if (!normalized) return items;

    return items.filter((item) => {
      const name = item.product.name.toLowerCase();
      const description = item.product.description?.toLowerCase() ?? "";
      return name.includes(normalized) || description.includes(normalized);
    });
  }, [items, searchTerm]);

  const handleAddToCart = (salableId: number) => {
    const added = addItemToCart(salableId, 1);
    if (!added) {
      setFeedback({
        message: "Necesitas iniciar sesion para usar el carrito.",
        variant: "warning",
      });
      setTimeout(() => setFeedback(null), 2500);
      return;
    }

    setFeedback({ message: "Producto agregado al carrito", variant: "success" });
    setTimeout(() => setFeedback(null), 2000);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 via-orange-50 to-amber-100 px-6 py-12 sm:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-800">Compra en linea</p>
          <h1 className="text-4xl font-semibold text-stone-950 sm:text-5xl">Elige tu pan y cafe.</h1>
          <p className="max-w-3xl text-base leading-7 text-stone-700">
            Productos disponibles hoy. Selecciona lo que quieras llevar y continua a pago en caja.
            (Integracion de pago no implementada, solo interfaz de seleccion.)
          </p>
        </div>

        {loading && <p className="text-stone-700">Cargando productos...</p>}
        {error && <p className="text-red-700">{error}</p>}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-sm">
            <label htmlFor="shop-search" className="sr-only">
              Buscar productos
            </label>
            <input
              id="shop-search"
              type="search"
              placeholder="Buscar por nombre o descripcion"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full rounded-full border border-amber-200 bg-white/80 px-4 py-2 text-sm text-stone-700 shadow-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200"
            />
          </div>

          {feedback && !error && (
            <p
              className={`rounded-full px-4 py-2 text-sm shadow-sm ${
                feedback.variant === "success"
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-amber-100 text-amber-900"
              }`}
            >
              {feedback.message}
            </p>
          )}
        </div>

        {!loading && !error && (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-3 rounded-2xl bg-white/90 p-5 shadow-md ring-1 ring-amber-100"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-stone-950">{item.product.name}</p>
                    <p className="text-sm text-stone-600">{item.product.description ?? "Disponible"}</p>
                    {item.product.categories && item.product.categories.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {item.product.categories.map((category) => (
                          <span
                            key={category.id}
                            className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800"
                          >
                            {category.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-900">
                    ${Number(item.price).toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs uppercase tracking-[0.2em] text-amber-700">
                    En carrito: {quantities[item.id] ?? 0}
                  </span>
                  <button
                    onClick={() => handleAddToCart(item.id)}
                    className="inline-flex items-center justify-center rounded-full bg-amber-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-amber-800"
                  >
                  Agregar al carrito
                  </button>
                </div>
              </div>
            ))}
            {!filteredItems.length && items.length > 0 && (
              <p className="text-stone-700">No hay productos que coincidan con tu busqueda.</p>
            )}
            {items.length === 0 && (
              <p className="text-stone-700">No hay productos vendibles disponibles.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
