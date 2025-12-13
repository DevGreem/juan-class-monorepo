"use client";

import { deleteCookie, getCookie, setCookie } from "cookies-next";

type CartCookie = Array<{
  salable_product_id: number;
  quantity: number;
  taxes?: number;
}>;

export type CartItem = {
  salable_product_id: number;
  quantity: number;
  taxes?: number;
};

const CART_COOKIE_KEY = "cart_items";

const cookieOptions = {
  path: "/",
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
};

const notify = () => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("cart-change"));
};

const hasActiveSession = (): boolean => {
  if (typeof window === "undefined") {
    return false;
  }

  const rawUser = getCookie("auth_user");
  if (!rawUser || typeof rawUser !== "string") {
    return false;
  }

  try {
    const parsed = JSON.parse(rawUser);
    return typeof parsed === "object" && parsed !== null;
  } catch (error) {
    console.warn("No se pudo leer la sesion del usuario", error);
    return false;
  }
};

const readRawCookie = (): CartCookie => {
  if (typeof window === "undefined") return [];
  const value = getCookie(CART_COOKIE_KEY);
  if (!value || typeof value !== "string") return [];

  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed
        .filter((item) =>
          item &&
          typeof item.salable_product_id === "number" &&
          typeof item.quantity === "number"
        )
        .map((item) => ({
          salable_product_id: item.salable_product_id,
          quantity: Math.max(1, Math.trunc(item.quantity)),
          taxes: typeof item.taxes === "number" ? item.taxes : undefined,
        }));
    }
  } catch (error) {
    console.warn("No se pudo leer el carrito de la cookie", error);
  }

  return [];
};

const persist = (items: CartCookie) => {
  if (typeof window === "undefined") return;

  if (!items.length) {
    deleteCookie(CART_COOKIE_KEY, cookieOptions);
    notify();
    return;
  }

  setCookie(CART_COOKIE_KEY, JSON.stringify(items), {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60,
  });
  notify();
};

export const getCartItems = (): CartItem[] => readRawCookie();

export const setCartItems = (items: CartItem[]) => {
  persist(
    items.map((item) => ({
      salable_product_id: item.salable_product_id,
      quantity: Math.max(1, Math.trunc(item.quantity)),
      taxes: typeof item.taxes === "number" ? item.taxes : undefined,
    }))
  );
};

export const addItemToCart = (salableProductId: number, quantity = 1, taxes?: number): boolean => {
  if (!hasActiveSession()) {
    console.warn("Intento de agregar al carrito sin sesion activa");
    return false;
  }

  const items = readRawCookie();
  const existing = items.find((item) => item.salable_product_id === salableProductId);

  if (existing) {
    existing.quantity = Math.max(1, existing.quantity + quantity);
    if (typeof taxes === "number") {
      existing.taxes = taxes;
    }
  } else {
    items.push({ salable_product_id: salableProductId, quantity: Math.max(1, quantity), taxes });
  }

  persist(items);
  return true;
};

export const updateCartQuantity = (salableProductId: number, quantity: number) => {
  const items = readRawCookie();
  const existing = items.find((item) => item.salable_product_id === salableProductId);
  if (!existing) return;

  if (quantity <= 0) {
    persist(items.filter((item) => item.salable_product_id !== salableProductId));
    return;
  }

  existing.quantity = Math.max(1, Math.trunc(quantity));
  persist(items);
};

export const removeItemFromCart = (salableProductId: number) => {
  const items = readRawCookie().filter((item) => item.salable_product_id !== salableProductId);
  persist(items);
};

export const clearCart = () => {
  persist([]);
};

export const getCartCount = (): number => {
  return readRawCookie().reduce((acc, item) => acc + item.quantity, 0);
};
