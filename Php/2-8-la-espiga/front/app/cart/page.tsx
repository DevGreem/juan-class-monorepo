"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import PHPApi from "@/src/types/PHPApi";
import {
  CartItem,
  clearCart,
  getCartItems,
  removeItemFromCart,
  updateCartQuantity,
} from "@/src/utils/cart";

type CartPreviewItem = {
  salable_product_id: number;
  quantity: number;
  tax_rate: number;
  unit_price: number;
  subtotal: number;
  tax_amount: number;
  total: number;
  product: {
    id: number;
    name: string;
    description?: string | null;
    stock?: number;
  };
};

type CartPreviewResponse = {
  items: CartPreviewItem[];
  summary: {
    subtotal: number;
    taxes: number;
    total: number;
  };
};

type SaleResponse = {
  sale: {
    id: number;
    user_id: number;
    status: string;
    paid_at?: string | null;
    code: string;
    subtotal: number;
    total: number;
    tax_total: number;
    line_count?: number;
    units_count?: number;
    created_at?: string;
    updated_at?: string;
  };
  items: Array<{
    id: number;
    sale_id: number;
    salable_product_id: number;
    quantity: number;
    taxes?: number | null;
    unit_price: number;
    subtotal: number;
    total: number;
    tax_amount: number;
    product: {
      id: number;
      name: string;
      description?: string | null;
    };
  }>;
};

export default function CartPage() {
  const router = useRouter();

  const [cartItems, setCartItemsState] = useState<CartItem[]>([]);
  const [preview, setPreview] = useState<CartPreviewResponse | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);

  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [checkoutResult, setCheckoutResult] = useState<SaleResponse | null>(null);

  const previewMap = useMemo(() => {
    const map = new Map<number, CartPreviewItem>();
    (preview?.items || []).forEach((item) => {
      map.set(item.salable_product_id, item);
    });
    return map;
  }, [preview]);

  const syncCartFromCookie = () => {
    const items = getCartItems();
    setCartItemsState(items);
  };

  useEffect(() => {
    syncCartFromCookie();
    const handleCartChange = () => {
      syncCartFromCookie();
    };

    window.addEventListener("cart-change", handleCartChange);
    window.addEventListener("focus", handleCartChange);

    return () => {
      window.removeEventListener("cart-change", handleCartChange);
      window.removeEventListener("focus", handleCartChange);
    };
  }, []);

  useEffect(() => {
    const runPreview = async () => {
      if (!cartItems.length) {
        setPreview(null);
        setPreviewError(null);
        return;
      }

      setPreviewLoading(true);
      setPreviewError(null);

      try {
        const response = await PHPApi.post("sales/preview", {}, {
          items: cartItems,
        });
        setPreview(response);
      } catch (error) {
        console.error(error);
        setPreviewError("No se pudo calcular el carrito. Intenta nuevamente.");
      } finally {
        setPreviewLoading(false);
      }
    };

    runPreview();
  }, [cartItems]);

  const handleQuantityChange = (salableProductId: number, quantity: number) => {
    updateCartQuantity(salableProductId, quantity);
  };

  const handleRemove = (salableProductId: number) => {
    removeItemFromCart(salableProductId);
  };

  const handleClearCart = () => {
    clearCart();
    setCartItemsState([]);
    setCheckoutResult(null);
  };

  const handleCheckout = async () => {
    if (!cartItems.length || checkoutLoading) return;

    const rawUser = getCookie("auth_user");
    if (!rawUser || typeof rawUser !== "string") {
      router.push("/login?redirect=/cart");
      return;
    }

    try {
      const parsedUser = JSON.parse(rawUser) as { id?: number };
      if (!parsedUser?.id) {
        throw new Error("Usuario invalido");
      }

      setCheckoutLoading(true);
      setCheckoutError(null);

      const payload = {
        user_id: parsedUser.id,
        items: cartItems.map((item) => ({
          salable_product_id: item.salable_product_id,
          quantity: item.quantity,
          taxes:
            previewMap.get(item.salable_product_id)?.tax_rate ??
            item.taxes ?? 0
        })),
      };

      const response = await PHPApi.post("sales", {}, payload);
      setCheckoutResult(response);
      clearCart();
      setCartItemsState([]);
    } catch (error) {
      console.error(error);
      setCheckoutError(
        "No se pudo procesar la venta. Revisa tu sesion o intentalo de nuevo."
      );
    } finally {
      setCheckoutLoading(false);
    }
  };

  const summary = preview?.summary ?? {
    subtotal: 0,
    taxes: 0,
    total: 0,
  };

  const hasItems = cartItems.length > 0;

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 via-orange-50 to-amber-100 px-6 py-12 sm:px-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-800">Carrito</p>
          <h1 className="text-4xl font-semibold text-stone-950 sm:text-5xl">Revisa tu pedido</h1>
          <p className="max-w-2xl text-base leading-7 text-stone-700">
            Los productos seleccionados se guardan en tu navegador. Al confirmar, se genera un folio para recoger en tienda.
          </p>
        </div>

        {!hasItems && !checkoutResult && (
          <div className="rounded-2xl bg-white/90 p-8 text-center text-stone-600 shadow-md ring-1 ring-amber-100">
            <p className="text-lg font-semibold text-stone-700">Tu carrito esta vacio.</p>
            <p className="mt-2 text-sm text-stone-500">
              Visita la tienda para agregar productos deliciosos.
            </p>
            <div className="mt-4">
              <button
                onClick={() => router.push("/shop")}
                className="rounded-full bg-amber-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-amber-800"
              >
                Ir a la tienda
              </button>
            </div>
          </div>
        )}

        {previewLoading && (
          <div className="rounded-2xl bg-white/90 p-4 text-stone-600 shadow-sm ring-1 ring-amber-100">
            Calculando totales...
          </div>
        )}

        {previewError && (
          <div className="rounded-2xl bg-red-100 p-4 text-sm text-red-700 ring-1 ring-red-200">
            {previewError}
          </div>
        )}

        {hasItems && preview && (
          <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
            <div className="flex flex-col gap-4">
              {preview.items.map((item) => (
                <div
                  key={item.salable_product_id}
                  className="rounded-2xl bg-white/90 p-5 shadow-md ring-1 ring-amber-100"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold text-stone-950">{item.product.name}</p>
                      <p className="text-sm text-stone-600">
                        {item.product.description ?? "Producto fresco del dia"}
                      </p>
                    </div>
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-900">
                      ${item.unit_price.toFixed(2)} c/u
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-stone-700">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQuantityChange(item.salable_product_id, item.quantity - 1)}
                        className="h-8 w-8 rounded-full border border-amber-200 text-lg leading-none text-amber-900 transition hover:bg-amber-50"
                        aria-label="Disminuir cantidad"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(event) =>
                          handleQuantityChange(
                            item.salable_product_id,
                            Number(event.target.value)
                          )
                        }
                        className="w-16 rounded-full border border-amber-200 px-3 py-2 text-center text-sm"
                      />
                      <button
                        onClick={() => handleQuantityChange(item.salable_product_id, item.quantity + 1)}
                        className="h-8 w-8 rounded-full border border-amber-200 text-lg leading-none text-amber-900 transition hover:bg-amber-50"
                        aria-label="Aumentar cantidad"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-semibold text-stone-900">
                        Subtotal: ${item.subtotal.toFixed(2)}
                      </p>
                      <p className="text-xs text-stone-500">
                        Impuestos: ${item.tax_amount.toFixed(2)} • Total linea: ${item.total.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-500">
                    <button
                      onClick={() => handleRemove(item.salable_product_id)}
                      className="text-red-600 underline-offset-4 hover:text-red-700 hover:underline"
                    >
                      Quitar del carrito
                    </button>
                    {typeof item.product.stock === "number" && (
                      <span>Disponible: {item.product.stock} en stock</span>
                    )}
                  </div>
                </div>
              ))}

              <div className="flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={handleClearCart}
                  className="rounded-full border border-amber-200 px-4 py-2 text-sm font-semibold text-stone-700 transition hover:-translate-y-0.5 hover:bg-amber-50"
                >
                  Vaciar carrito
                </button>
                <button
                  onClick={() => router.push("/shop")}
                  className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-amber-800 shadow-sm ring-1 ring-amber-200 transition hover:-translate-y-0.5 hover:bg-amber-50"
                >
                  Seguir comprando
                </button>
              </div>
            </div>

            <aside className="flex flex-col gap-4 rounded-2xl bg-white/90 p-5 shadow-lg ring-1 ring-amber-100">
              <h2 className="text-xl font-semibold text-stone-900">Resumen</h2>
              <div className="space-y-2 text-sm text-stone-700">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${summary.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Impuestos</span>
                  <span>${summary.taxes.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-semibold text-stone-900">
                  <span>Total</span>
                  <span>${summary.total.toFixed(2)}</span>
                </div>
              </div>

              {checkoutError && (
                <div className="rounded-xl bg-red-100 px-3 py-2 text-xs text-red-700 ring-1 ring-red-200">
                  {checkoutError}
                </div>
              )}

              <button
                onClick={handleCheckout}
                disabled={checkoutLoading}
                className="rounded-full bg-amber-700 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {checkoutLoading ? "Procesando..." : "Confirmar compra"}
              </button>
            </aside>
          </div>
        )}

        {checkoutResult && (
          <div className="rounded-3xl bg-emerald-100/70 p-6 text-sm text-emerald-900 shadow-md ring-1 ring-emerald-200">
            <h2 className="text-xl font-semibold text-emerald-900">¡Venta generada!</h2>
            <p className="mt-2 text-sm">
              Folio <span className="font-semibold">#{checkoutResult.sale.code}</span>. Muestra este codigo en caja para recoger tu pedido.
            </p>
            <div className="mt-4 grid gap-2 text-sm">
              <div className="flex justify-between">
                <span>Total de lineas</span>
                <span>{checkoutResult.sale.line_count ?? checkoutResult.items.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Importe</span>
                <span>${checkoutResult.sale.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Impuestos</span>
                <span>${checkoutResult.sale.tax_total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-base">
                <span>Total pagado</span>
                <span>${checkoutResult.sale.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
