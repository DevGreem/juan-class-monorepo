"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PHPApi from "@/src/types/PHPApi";
import { deleteCookie, setCookie } from "cookies-next";

const CUSTOMER_ROLE_ID =  Number(process.env.NEXT_PUBLIC_CUSTOMER_ROLE_ID || 2);

type ApiUser = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role_id: number;
};

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cookieBaseOptions = {
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  };

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams?.get("redirect") || "/";

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "").trim();

    try {
      const response = await PHPApi.post("auth/login", {}, { email, password });
      persistSession(response.user, response.token);
      router.push(redirectTo);
      window.dispatchEvent(new Event("auth-change"));
    } catch (err: unknown) {
      console.error(err);
      setError("Credenciales invalidas. Revisa tu correo y contrasena.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const password = String(formData.get("password") || "").trim();

    try {
      const response = await PHPApi.post("auth/register", {}, {
        name,
        email,
        phone,
        password,
        role_id: CUSTOMER_ROLE_ID,
      });
      persistSession(response.user, response.token);
      router.push(redirectTo);
      window.dispatchEvent(new Event("auth-change"));
    } catch (err: unknown) {
      console.error(err);
      setError("No se pudo registrar. Verifica la informacion e intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const persistSession = (user: ApiUser, token: string) => {
    const serializedUser = JSON.stringify(user);
    const options = { ...cookieBaseOptions, maxAge: 7 * 86400 };
    setCookie("auth_user", serializedUser, options);
    setCookie("auth_token", token, options);
  };

  const switchMode = () => {
    setMode((prev) => (prev === "login" ? "register" : "login"));
    setError(null);
  };

  const clearSession = () => {
    const options = { ...cookieBaseOptions };
    deleteCookie("auth_user", options);
    deleteCookie("auth_token", options);
    window.dispatchEvent(new Event("auth-change"));
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 via-orange-50 to-amber-100 px-6 py-12 sm:px-10">
      <div className="mx-auto flex w-full max-w-md flex-col gap-6 rounded-3xl bg-white/90 p-8 shadow-xl ring-1 ring-amber-100">
        <div className="flex flex-col gap-2 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-800">La Espiga</p>
          <h1 className="text-3xl font-semibold text-stone-950">
            {mode === "login" ? "Inicia sesion" : "Crea tu cuenta"}
          </h1>
          <p className="text-sm text-stone-600">
            {mode === "login"
              ? "Ingresa con tus credenciales para administrar tus pedidos."
              : "Registrate para comprar y recibir novedades."}
          </p>
        </div>

        {error && (
          <div className="rounded-xl bg-red-100 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
            {error}
          </div>
        )}

        {mode === "login" ? (
          <form className="flex flex-col gap-4" onSubmit={handleLogin}>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-semibold text-stone-700">Correo electronico</span>
              <input
                type="email"
                name="email"
                required
                className="rounded-xl border border-amber-100 bg-white px-4 py-3 text-sm focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-200"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-semibold text-stone-700">Contrasena</span>
              <input
                type="password"
                name="password"
                required
                className="rounded-xl border border-amber-100 bg-white px-4 py-3 text-sm focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-200"
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-amber-700 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Procesando..." : "Entrar"}
            </button>
          </form>
        ) : (
          <form className="flex flex-col gap-4" onSubmit={handleRegister}>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-semibold text-stone-700">Nombre completo</span>
              <input
                type="text"
                name="name"
                required
                className="rounded-xl border border-amber-100 bg-white px-4 py-3 text-sm focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-200"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-semibold text-stone-700">Correo electronico</span>
              <input
                type="email"
                name="email"
                required
                className="rounded-xl border border-amber-100 bg-white px-4 py-3 text-sm focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-200"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-semibold text-stone-700">Telefono</span>
              <input
                type="tel"
                name="phone"
                required
                className="rounded-xl border border-amber-100 bg-white px-4 py-3 text-sm focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-200"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-semibold text-stone-700">Contrasena</span>
              <input
                type="password"
                name="password"
                required
                minLength={6}
                className="rounded-xl border border-amber-100 bg-white px-4 py-3 text-sm focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-200"
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-amber-700 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Procesando..." : "Crear cuenta"}
            </button>
          </form>
        )}

        <div className="flex flex-col gap-3 text-sm">
          <button
            onClick={switchMode}
            className="text-amber-800 underline-offset-4 transition hover:text-amber-900 hover:underline"
          >
            {mode === "login"
              ? "¿No tienes cuenta? Registrate"
              : "¿Ya tienes cuenta? Inicia sesion"}
          </button>
          <button
            onClick={clearSession}
            className="text-xs text-stone-500 underline-offset-4 transition hover:text-stone-700 hover:underline"
          >
            Limpiar cookies de sesion
          </button>
        </div>
      </div>
    </div>
  );
}
