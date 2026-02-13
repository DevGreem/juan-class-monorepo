"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createDiagnostic, getPatients, Patient, DiagnosticCreate } from "@/lib/api";

export default function NewDiagnosticPage() {
  const { token, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedPatient = searchParams.get("patient_id");

  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) { router.push("/login"); return; }
    if (token) getPatients(token).then(setPatients).catch(() => {});
  }, [isAuthenticated, token]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!token) return;
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const data: DiagnosticCreate = {
      patient_id: form.get("patient_id") as string,
      name: form.get("name") as string,
      code: (form.get("code") as string) || undefined,
      description: (form.get("description") as string) || undefined,
      severity: (form.get("severity") as string) || "moderado",
      diagnosis_type: (form.get("diagnosis_type") as string) || "definitivo",
      diagnosis_date: (form.get("diagnosis_date") as string) || undefined,
    };

    try {
      await createDiagnostic(token, data);
      router.push("/diagnostics");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear diagnóstico");
    }
    setLoading(false);
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Nuevo Diagnóstico</h1>

      {error && <div className="bg-danger/10 border border-danger/30 text-danger rounded-lg p-3 mb-4 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Paciente *</label>
          <select name="patient_id" required defaultValue={preselectedPatient || ""} className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50">
            <option value="">Seleccionar paciente</option>
            {patients.map(p => <option key={p.id} value={p.id}>{p.first_name} {p.last_name} — {p.document_number}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre del Diagnóstico *</label>
            <input name="name" required className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Código CIE-10</label>
            <input name="code" placeholder="Ej: J06.9" className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Descripción</label>
          <textarea name="description" rows={3} className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Severidad</label>
            <select name="severity" className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50">
              <option value="leve">Leve</option>
              <option value="moderado" selected>Moderado</option>
              <option value="grave">Grave</option>
              <option value="critico">Crítico</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tipo</label>
            <select name="diagnosis_type" className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50">
              <option value="definitivo">Definitivo</option>
              <option value="presuntivo">Presuntivo</option>
              <option value="diferencial">Diferencial</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Fecha</label>
            <input name="diagnosis_date" type="date" className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button type="submit" disabled={loading} className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 cursor-pointer">
            {loading ? "Guardando..." : "Guardar Diagnóstico"}
          </button>
          <button type="button" onClick={() => router.back()} className="px-6 py-2.5 rounded-lg border border-border hover:bg-border/30 transition-colors cursor-pointer">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
