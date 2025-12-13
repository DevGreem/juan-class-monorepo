import InventoryClient from "./InventoryClient";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCookie } from "cookies-next";

const ADMIN_ROLE_ID = 1;

export default async function InventoryAdminPage() {
  const rawUser = await getCookie("auth_user", { cookies });

  if (!rawUser || typeof rawUser !== "string") {
    redirect("/login?redirect=/admin/inventory");
  }

  let parsedUser: { role_id?: number | string } | null = null;
  try {
    parsedUser = JSON.parse(rawUser);
  } catch (error) {
    redirect("/login?redirect=/admin/inventory");
  }

  const roleId = Number(parsedUser?.role_id ?? 0);
  if (roleId !== ADMIN_ROLE_ID) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-stone-50 via-amber-50 to-white px-6 py-12 sm:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-800">Admin</p>
          <h1 className="text-4xl font-semibold text-stone-950 sm:text-5xl">Inventario</h1>
          <p className="max-w-3xl text-base leading-7 text-stone-700">
            Panel para administradores. Aqui se gestionan existencias y costos; lo que se marque activo se refleja en la tienda.
          </p>
        </div>

        <InventoryClient />
      </div>
    </div>
  );
}
