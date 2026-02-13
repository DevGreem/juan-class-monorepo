"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getConsultations, deleteConsultation, Consultation } from "@/lib/api";
import Link from "next/link";

export default function ConsultationsPage() {
  const { token, isAuthenticated } = useAuth();
  const router = useRouter();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) { router.push("/login"); return; }
    loadData();
  }, [isAuthenticated]);

  async function loadData() {
    if (!token) return;
    try { setConsultations(await getConsultations(token)); } catch { /* ignore */ }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!token || !confirm("¿Eliminar esta consulta?")) return;
    try { await deleteConsultation(token, id); setConsultations(consultations.filter(c => c.id !== id)); } catch { /* ignore */ }
  }

  if (!isAuthenticated) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Consultas</h1>
          <p className="text-muted">Registro de consultas médicas</p>
        </div>
        <Link href="/consultations/new" className="bg-primary text-white px-5 py-2.5 rounded-lg font-medium hover:bg-primary-dark transition-colors">
          + Nueva Consulta
        </Link>
      </div>

      {loading ? (
        <p className="text-muted text-center py-12">Cargando...</p>
      ) : consultations.length === 0 ? (
        <div className="text-center py-12 bg-card border border-border rounded-xl">
          <p className="text-muted text-lg">No hay consultas registradas</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-border/30">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-semibold">Motivo</th>
                <th className="text-left px-6 py-3 text-sm font-semibold">Fecha</th>
                <th className="text-left px-6 py-3 text-sm font-semibold">Estado</th>
                <th className="text-left px-6 py-3 text-sm font-semibold">Signos Vitales</th>
                <th className="text-right px-6 py-3 text-sm font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {consultations.map((c) => (
                <tr key={c.id} className="hover:bg-border/20 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-sm">{c.reason}</p>
                    {c.symptoms && <p className="text-xs text-muted mt-1">{c.symptoms}</p>}
                  </td>
                  <td className="px-6 py-4 text-sm">{c.consultation_date ? new Date(c.consultation_date).toLocaleDateString() : "—"}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${c.status === "completada" ? "bg-success/20 text-success" : c.status === "programada" ? "bg-primary/20 text-primary" : "bg-muted/20 text-muted"}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-muted">
                    {c.blood_pressure && <span>PA: {c.blood_pressure} </span>}
                    {c.heart_rate && <span>FC: {c.heart_rate} </span>}
                    {c.temperature_c && <span>T: {c.temperature_c}°C</span>}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Link href={`/consultations/${c.id}/edit`} className="text-warning hover:underline text-sm">Editar</Link>
                    <button onClick={() => handleDelete(c.id)} className="text-danger hover:underline text-sm cursor-pointer">Eliminar</button>
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
