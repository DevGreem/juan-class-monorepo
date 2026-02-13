"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getConsultation, updateConsultation, Consultation } from "@/lib/api";

export default function EditConsultationPage() {
  const { token, isAuthenticated } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) { router.push("/login"); return; }
    if (token) getConsultation(token, id).then(setConsultation).catch(() => router.push("/consultations"));
    setLoading(false);
  }, [isAuthenticated, id, token]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const data = {
      reason: form.get("reason") as string,
      symptoms: (form.get("symptoms") as string) || undefined,
      notes: (form.get("notes") as string) || undefined,
      weight_kg: form.get("weight_kg") ? Number(form.get("weight_kg")) : undefined,
      height_cm: form.get("height_cm") ? Number(form.get("height_cm")) : undefined,
      blood_pressure: (form.get("blood_pressure") as string) || undefined,
      heart_rate: form.get("heart_rate") ? Number(form.get("heart_rate")) : undefined,
      temperature_c: form.get("temperature_c") ? Number(form.get("temperature_c")) : undefined,
      status: form.get("status") as string,
    };

    try {
      await updateConsultation(token, id, data);
      router.push("/consultations");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar");
    }
    setSaving(false);
  }

  if (loading || !consultation) return <p className="text-muted text-center py-12">Cargando...</p>;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Editar Consulta</h1>

      {error && <div className="bg-danger/10 border border-danger/30 text-danger rounded-lg p-3 mb-4 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Motivo de Consulta *</label>
          <input name="reason" defaultValue={consultation.reason} required className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Síntomas</label>
          <textarea name="symptoms" rows={2} defaultValue={consultation.symptoms || ""} className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Notas</label>
          <textarea name="notes" rows={3} defaultValue={consultation.notes || ""} className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50" />
        </div>

        <h3 className="font-semibold text-sm pt-2">Signos Vitales</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Peso (kg)</label>
            <input name="weight_kg" type="number" step="0.01" defaultValue={consultation.weight_kg ?? ""} className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Altura (cm)</label>
            <input name="height_cm" type="number" step="0.01" defaultValue={consultation.height_cm ?? ""} className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Presión Arterial</label>
            <input name="blood_pressure" defaultValue={consultation.blood_pressure || ""} className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Freq. Cardíaca</label>
            <input name="heart_rate" type="number" defaultValue={consultation.heart_rate ?? ""} className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Temperatura (°C)</label>
            <input name="temperature_c" type="number" step="0.1" defaultValue={consultation.temperature_c ?? ""} className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Estado</label>
            <select name="status" defaultValue={consultation.status} className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50">
              <option value="completada">Completada</option>
              <option value="programada">Programada</option>
              <option value="en_curso">En Curso</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button type="submit" disabled={saving} className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 cursor-pointer">
            {saving ? "Guardando..." : "Guardar Cambios"}
          </button>
          <button type="button" onClick={() => router.back()} className="px-6 py-2.5 rounded-lg border border-border hover:bg-border/30 transition-colors cursor-pointer">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
