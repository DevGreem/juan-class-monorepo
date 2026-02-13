"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getTreatments, deleteTreatment, Treatment } from "@/lib/api";
import Link from "next/link";

export default function TreatmentsPage() {
  const { token, isAuthenticated } = useAuth();
  const router = useRouter();
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) { router.push("/login"); return; }
    loadData();
  }, [isAuthenticated]);

  async function loadData() {
    if (!token) return;
    try { setTreatments(await getTreatments(token)); } catch { /* ignore */ }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!token || !confirm("¿Eliminar este tratamiento?")) return;
    try { await deleteTreatment(token, id); setTreatments(treatments.filter(t => t.id !== id)); } catch { /* ignore */ }
  }

  if (!isAuthenticated) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Tratamientos</h1>
          <p className="text-muted">Registro de tratamientos médicos</p>
        </div>
        <Link href="/treatments/new" className="bg-primary text-white px-5 py-2.5 rounded-lg font-medium hover:bg-primary-dark transition-colors">
          + Nuevo Tratamiento
        </Link>
      </div>

      {loading ? (
        <p className="text-muted text-center py-12">Cargando...</p>
      ) : treatments.length === 0 ? (
        <div className="text-center py-12 bg-card border border-border rounded-xl">
          <p className="text-muted text-lg">No hay tratamientos registrados</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-border/30">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-semibold">Tratamiento</th>
                <th className="text-left px-6 py-3 text-sm font-semibold">Tipo</th>
                <th className="text-left px-6 py-3 text-sm font-semibold">Dosis</th>
                <th className="text-left px-6 py-3 text-sm font-semibold">Estado</th>
                <th className="text-left px-6 py-3 text-sm font-semibold">Período</th>
                <th className="text-right px-6 py-3 text-sm font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {treatments.map((t) => (
                <tr key={t.id} className="hover:bg-border/20 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-sm">{t.name}</p>
                    {t.description && <p className="text-xs text-muted mt-1 truncate max-w-xs">{t.description}</p>}
                  </td>
                  <td className="px-6 py-4 text-sm capitalize">{t.treatment_type}</td>
                  <td className="px-6 py-4 text-sm">{t.dosage || "—"}{t.frequency ? ` (${t.frequency})` : ""}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${t.status === "activo" ? "bg-success/20 text-success" : t.status === "completado" ? "bg-primary/20 text-primary" : "bg-muted/20 text-muted"}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-muted">
                    {t.start_date || "—"} {t.end_date ? `→ ${t.end_date}` : ""}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Link href={`/treatments/${t.id}/edit`} className="text-warning hover:underline text-sm">Editar</Link>
                    <button onClick={() => handleDelete(t.id)} className="text-danger hover:underline text-sm cursor-pointer">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
