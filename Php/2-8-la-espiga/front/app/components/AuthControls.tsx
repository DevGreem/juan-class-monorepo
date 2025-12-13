"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { deleteCookie, getCookie } from "cookies-next";
import { clearCart } from "@/src/utils/cart";
import { AuthUser } from "@/src/types/auth";

export default function AuthControls() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const router = useRouter();

  const readUserFromCookie = () => {
    const cookieValue = getCookie("auth_user");
    if (!cookieValue) {
      setUser(null);
      clearCart();
      return;
    }

    try {
      const parsed = JSON.parse(cookieValue.toString()) as AuthUser;
      setUser(parsed);
    } catch (error) {
      console.error("No se pudo leer el usuario de la cookie", error);
      setUser(null);
      clearCart();
    }
  };

  useEffect(() => {
    readUserFromCookie();
    const handleAuthChange = () => {
      readUserFromCookie();
    };

    window.addEventListener("auth-change", handleAuthChange);
    window.addEventListener("focus", handleAuthChange);

    return () => {
      window.removeEventListener("auth-change", handleAuthChange);
      window.removeEventListener("focus", handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    const options = {
      path: "/",
      sameSite: "lax" as const,
      secure: process.env.NODE_ENV === "production",
    };
    deleteCookie("auth_user", options);
    deleteCookie("auth_token", options);
    setUser(null);
    clearCart();
    window.dispatchEvent(new Event("auth-change"));
    router.push("/");
  };

  if (!user) {
    return (
      <Link
        href="/login"
        className="rounded-full bg-amber-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-amber-800"
      >
        Inicia / Registra
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="hidden text-sm font-semibold text-amber-900 sm:inline">
        Hola, {user.name.split(" ")[0]}
      </span>
      <button
        onClick={handleLogout}
        className="rounded-full border border-amber-200 px-4 py-2 text-xs font-semibold text-amber-900 transition hover:-translate-y-0.5 hover:bg-amber-50"
      >
        Cerrar sesion
      </button>
    </div>
  );
}
