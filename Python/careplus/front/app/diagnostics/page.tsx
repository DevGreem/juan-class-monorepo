"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getDiagnostics, deleteDiagnostic, Diagnostic } from "@/lib/api";
import Link from "next/link";

export default function DiagnosticsPage() {
  const { token, isAuthenticated } = useAuth();
  const router = useRouter();
  const [diagnostics, setDiagnostics] = useState<Diagnostic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) { router.push("/login"); return; }
    loadData();
  }, [isAuthenticated]);

  async function loadData() {
    if (!token) return;
    try { setDiagnostics(await getDiagnostics(token)); } catch { /* ignore */ }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!token || !confirm("¿Eliminar este diagnóstico?")) return;
    try { await deleteDiagnostic(token, id); setDiagnostics(diagnostics.filter(d => d.id !== id)); } catch { /* ignore */ }
  }

  if (!isAuthenticated) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Diagnósticos</h1>
          <p className="text-muted">Registro de diagnósticos médicos</p>
        </div>
        <Link href="/diagnostics/new" className="bg-primary text-white px-5 py-2.5 rounded-lg font-medium hover:bg-primary-dark transition-colors">
          + Nuevo Diagnóstico
        </Link>
      </div>

      {loading ? (
        <p className="text-muted text-center py-12">Cargando...</p>
      ) : diagnostics.length === 0 ? (
        <div className="text-center py-12 bg-card border border-border rounded-xl">
          <p className="text-muted text-lg">No hay diagnósticos registrados</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-border/30">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-semibold">Diagnóstico</th>
                <th className="text-left px-6 py-3 text-sm font-semibold">Código</th>
                <th className="text-left px-6 py-3 text-sm font-semibold">Severidad</th>
                <th className="text-left px-6 py-3 text-sm font-semibold">Tipo</th>
                <th className="text-left px-6 py-3 text-sm font-semibold">Fecha</th>
                <th className="text-right px-6 py-3 text-sm font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {diagnostics.map((d) => (
                <tr key={d.id} className="hover:bg-border/20 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-sm">{d.name}</p>
                    {d.description && <p className="text-xs text-muted mt-1 truncate max-w-xs">{d.description}</p>}
                  </td>
                  <td className="px-6 py-4 text-sm font-mono">{d.code || "—"}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${d.severity === "leve" ? "bg-success/20 text-success" : d.severity === "grave" || d.severity === "critico" ? "bg-danger/20 text-danger" : "bg-warning/20 text-warning"}`}>
                      {d.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm capitalize">{d.diagnosis_type}</td>
                  <td className="px-6 py-4 text-sm">{d.diagnosis_date || "—"}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Link href={`/diagnostics/${d.id}/edit`} className="text-warning hover:underline text-sm">Editar</Link>
                    <button onClick={() => handleDelete(d.id)} className="text-danger hover:underline text-sm cursor-pointer">Eliminar</button>
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
