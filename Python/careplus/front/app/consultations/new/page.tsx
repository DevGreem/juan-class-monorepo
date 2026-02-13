"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createConsultation, getPatients, Patient, ConsultationCreate } from "@/lib/api";

export default function NewConsultationPage() {
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
    const data: ConsultationCreate = {
      patient_id: form.get("patient_id") as string,
      reason: form.get("reason") as string,
      symptoms: (form.get("symptoms") as string) || undefined,
      notes: (form.get("notes") as string) || undefined,
      weight_kg: form.get("weight_kg") ? Number(form.get("weight_kg")) : undefined,
      height_cm: form.get("height_cm") ? Number(form.get("height_cm")) : undefined,
      blood_pressure: (form.get("blood_pressure") as string) || undefined,
      heart_rate: form.get("heart_rate") ? Number(form.get("heart_rate")) : undefined,
      temperature_c: form.get("temperature_c") ? Number(form.get("temperature_c")) : undefined,
      status: (form.get("status") as string) || "completada",
    };

    try {
      await createConsultation(token, data);
      router.push("/consultations");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear consulta");
    }
    setLoading(false);
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Nueva Consulta</h1>

      {error && <div className="bg-danger/10 border border-danger/30 text-danger rounded-lg p-3 mb-4 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Paciente *</label>
          <select name="patient_id" required defaultValue={preselectedPatient || ""} className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50">
            <option value="">Seleccionar paciente</option>
            {patients.map(p => <option key={p.id} value={p.id}>{p.first_name} {p.last_name} — {p.document_number}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Motivo de Consulta *</label>
          <input name="reason" required className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Síntomas</label>
          <textarea name="symptoms" rows={2} className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Notas del Médico</label>
          <textarea name="notes" rows={3} className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50" />
        </div>

        <h3 className="font-semibold text-sm pt-2">Signos Vitales</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Peso (kg)</label>
            <input name="weight_kg" type="number" step="0.01" className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Altura (cm)</label>
            <input name="height_cm" type="number" step="0.01" className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Presión Arterial</label>
            <input name="blood_pressure" placeholder="120/80" className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Freq. Cardíaca</label>
            <input name="heart_rate" type="number" className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Temperatura (°C)</label>
            <input name="temperature_c" type="number" step="0.1" className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Estado</label>
            <select name="status" className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50">
              <option value="completada">Completada</option>
              <option value="programada">Programada</option>
              <option value="en_curso">En Curso</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button type="submit" disabled={loading} className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 cursor-pointer">
            {loading ? "Guardando..." : "Guardar Consulta"}
          </button>
          <button type="button" onClick={() => router.back()} className="px-6 py-2.5 rounded-lg border border-border hover:bg-border/30 transition-colors cursor-pointer">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
