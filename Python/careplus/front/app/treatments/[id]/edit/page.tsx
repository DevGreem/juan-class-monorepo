"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getTreatment, updateTreatment, Treatment } from "@/lib/api";

export default function EditTreatmentPage() {
  const { token, isAuthenticated } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [treatment, setTreatment] = useState<Treatment | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) { router.push("/login"); return; }
    if (token) getTreatment(token, id).then(setTreatment).catch(() => router.push("/treatments"));
    setLoading(false);
  }, [isAuthenticated, id, token]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const data = {
      name: form.get("name") as string,
      description: (form.get("description") as string) || undefined,
      treatment_type: form.get("treatment_type") as string,
      dosage: (form.get("dosage") as string) || undefined,
      frequency: (form.get("frequency") as string) || undefined,
      duration: (form.get("duration") as string) || undefined,
      start_date: (form.get("start_date") as string) || undefined,
      end_date: (form.get("end_date") as string) || undefined,
      status: form.get("status") as string,
    };

    try {
      await updateTreatment(token, id, data);
      router.push("/treatments");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar");
    }
    setSaving(false);
  }

  if (loading || !treatment) return <p className="text-muted text-center py-12">Cargando...</p>;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Editar Tratamiento</h1>

      {error && <div className="bg-danger/10 border border-danger/30 text-danger rounded-lg p-3 mb-4 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre *</label>
            <input name="name" defaultValue={treatment.name} required className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tipo</label>
            <select name="treatment_type" defaultValue={treatment.treatment_type} className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50">
              <option value="medicamento">Medicamento</option>
              <option value="terapia">Terapia</option>
              <option value="cirugia">Cirugía</option>
              <option value="procedimiento">Procedimiento</option>
              <option value="otro">Otro</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Descripción / Indicaciones</label>
          <textarea name="description" rows={3} defaultValue={treatment.description || ""} className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Dosis</label>
            <input name="dosage" defaultValue={treatment.dosage || ""} className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Frecuencia</label>
            <input name="frequency" defaultValue={treatment.frequency || ""} className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Duración</label>
            <input name="duration" defaultValue={treatment.duration || ""} className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Fecha Inicio</label>
            <input name="start_date" type="date" defaultValue={treatment.start_date || ""} className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Fecha Fin</label>
            <input name="end_date" type="date" defaultValue={treatment.end_date || ""} className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Estado</label>
            <select name="status" defaultValue={treatment.status} className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50">
              <option value="activo">Activo</option>
              <option value="completado">Completado</option>
              <option value="suspendido">Suspendido</option>
              <option value="cancelado">Cancelado</option>
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
