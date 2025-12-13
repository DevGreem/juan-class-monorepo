"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import PHPApi from "@/src/types/PHPApi";

type SaleSummary = {
  id: number;
  code: string;
  status: string;
  paid_at?: string | null;
  subtotal: number;
  total: number;
  tax_total: number;
  line_count?: number;
  units_count?: number;
  user_id: number;
  user_name?: string | null;
  user_email?: string | null;
};

export default function SalesClient() {
  const [sales, setSales] = useState<SaleSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await PHPApi.get("sales");
        setSales((data as SaleSummary[]) || []);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar las ventas.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredSales = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    if (!normalized) return sales;

    return sales.filter((sale) => {
      const code = sale.code?.toString().toLowerCase() ?? "";
      const status = sale.status?.toLowerCase() ?? "";
      const saleId = sale.id.toString();
      const userName = sale.user_name?.toLowerCase() ?? "";
      const userEmail = sale.user_email?.toLowerCase() ?? "";

      return (
        code.includes(normalized) ||
        status.includes(normalized) ||
        saleId.includes(normalized) ||
        userName.includes(normalized) ||
        userEmail.includes(normalized)
      );
    });
  }, [sales, search]);

  const totalTickets = filteredSales.length;
  const totalItems = useMemo(
    () => filteredSales.reduce((acc, sale) => acc + (sale.line_count ?? 0), 0),
    [filteredSales]
  );

  const totalRevenue = useMemo(
    () => filteredSales.reduce((acc, sale) => acc + (sale.total ?? 0), 0),
    [filteredSales]
  );

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  return (
    <>
      {loading && <p className="text-stone-700">Cargando ventas...</p>}
      {error && <p className="text-red-700">{error}</p>}

      {!loading && !error && (
        <>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full max-w-sm">
              <label htmlFor="sales-search" className="sr-only">
                Buscar ventas
              </label>
              <input
                id="sales-search"
                type="search"
                placeholder="Buscar por ID, codigo, usuario o estado"
                value={search}
                onChange={handleSearchChange}
                className="w-full rounded-full border border-amber-200 bg-white/80 px-4 py-2 text-sm text-stone-700 shadow-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-white/90 p-4 shadow-md ring-1 ring-amber-100">
              <p className="text-xs uppercase tracking-[0.2em] text-amber-800">Tickets</p>
              <p className="text-3xl font-semibold text-stone-950">{totalTickets}</p>
            </div>
            <div className="rounded-2xl bg-white/90 p-4 shadow-md ring-1 ring-amber-100">
              <p className="text-xs uppercase tracking-[0.2em] text-amber-800">Items totales</p>
              <p className="text-3xl font-semibold text-stone-950">{totalItems}</p>
            </div>
            <div className="rounded-2xl bg-white/90 p-4 shadow-md ring-1 ring-amber-100">
              <p className="text-xs uppercase tracking-[0.2em] text-amber-800">Ingresos</p>
              <p className="text-3xl font-semibold text-stone-950">${totalRevenue.toFixed(2)}</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-white/90 p-4 shadow-md ring-1 ring-amber-100">
              <p className="text-xs uppercase tracking-[0.2em] text-amber-800">Ultima venta</p>
              <p className="text-3xl font-semibold text-stone-950">
                {filteredSales[0]?.paid_at ? new Date(filteredSales[0].paid_at).toLocaleString() : "-"}
              </p>
            </div>
            <div className="rounded-2xl bg-white/90 p-4 shadow-md ring-1 ring-amber-100">
              <p className="text-xs uppercase tracking-[0.2em] text-amber-800">Subtotal ultimo ticket</p>
              <p className="text-3xl font-semibold text-stone-950">
                {filteredSales[0] ? `$${filteredSales[0].subtotal.toFixed(2)}` : "-"}
              </p>
            </div>
            <div className="rounded-2xl bg-white/90 p-4 shadow-md ring-1 ring-amber-100">
              <p className="text-xs uppercase tracking-[0.2em] text-amber-800">IVA ultimo ticket</p>
              <p className="text-3xl font-semibold text-stone-950">
                {filteredSales[0] ? `$${filteredSales[0].tax_total.toFixed(2)}` : "-"}
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl bg-white/90 shadow-md ring-1 ring-amber-100">
            <table className="min-w-full divide-y divide-amber-100">
              <thead className="bg-amber-50/80 text-left text-sm font-semibold text-amber-900">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Codigo</th>
                  <th className="px-4 py-3">Cliente</th>
                  <th className="px-4 py-3">Lineas</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3">Subtotal</th>
                  <th className="px-4 py-3">Impuestos</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Pagado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-50 text-sm text-stone-800">
                {filteredSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-amber-50/50">
                    <td className="px-4 py-3 font-mono text-xs text-stone-600">{sale.id}</td>
                    <td className="px-4 py-3">{sale.code}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="font-semibold text-stone-900">{sale.user_name ?? `Usuario #${sale.user_id}`}</span>
                        {sale.user_email && (
                          <span className="text-xs text-stone-500">{sale.user_email}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">{sale.line_count ?? 0}</td>
                    <td className="px-4 py-3">{sale.status}</td>
                    <td className="px-4 py-3">${sale.subtotal.toFixed(2)}</td>
                    <td className="px-4 py-3">${sale.tax_total.toFixed(2)}</td>
                    <td className="px-4 py-3">${sale.total.toFixed(2)}</td>
                    <td className="px-4 py-3">{sale.paid_at ? new Date(sale.paid_at).toLocaleString() : "-"}</td>
                  </tr>
                ))}
                {!filteredSales.length && sales.length > 0 && (
                  <tr>
                    <td colSpan={9} className="px-4 py-4 text-center text-stone-600">
                      No hay ventas que coincidan con tu busqueda.
                    </td>
                  </tr>
                )}
                {sales.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-4 py-4 text-center text-stone-600">
                      No hay ventas registradas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}
