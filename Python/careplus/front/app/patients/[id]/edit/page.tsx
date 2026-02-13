"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getPatient, updatePatient, Patient } from "@/lib/api";

export default function EditPatientPage() {
  const { token, isAuthenticated } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) { router.push("/login"); return; }
    loadPatient();
  }, [isAuthenticated, id]);

  async function loadPatient() {
    if (!token) return;
    try {
      const p = await getPatient(token, id);
      setPatient(p);
    } catch { router.push("/patients"); }
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!token || !patient) return;
    setSaving(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const data: Record<string, string | undefined> = {
      first_name: form.get("first_name") as string,
      last_name: form.get("last_name") as string,
      date_of_birth: form.get("date_of_birth") as string,
      gender: form.get("gender") as string,
      document_type: form.get("document_type") as string,
      document_number: form.get("document_number") as string,
      email: (form.get("email") as string) || undefined,
      phone: (form.get("phone") as string) || undefined,
      address: (form.get("address") as string) || undefined,
      city: (form.get("city") as string) || undefined,
      blood_type: (form.get("blood_type") as string) || undefined,
      allergies: (form.get("allergies") as string) || undefined,
      emergency_contact_name: (form.get("emergency_contact_name") as string) || undefined,
      emergency_contact_phone: (form.get("emergency_contact_phone") as string) || undefined,
    };

    try {
      await updatePatient(token, id, data);
      router.push(`/patients/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar");
    }
    setSaving(false);
  }

  if (loading) return <p className="text-muted text-center py-12">Cargando...</p>;
  if (!patient) return null;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Editar Paciente</h1>

      {error && (
        <div className="bg-danger/10 border border-danger/30 text-danger rounded-lg p-3 mb-4 text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre *</label>
            <input name="first_name" defaultValue={patient.first_name} required className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Apellido *</label>
            <input name="last_name" defaultValue={patient.last_name} required className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Fecha de Nacimiento *</label>
            <input name="date_of_birth" type="date" defaultValue={patient.date_of_birth} required className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Género *</label>
            <select name="gender" defaultValue={patient.gender} required className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50">
              <option value="masculino">Masculino</option>
              <option value="femenino">Femenino</option>
              <option value="otro">Otro</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tipo de Documento</label>
            <select name="document_type" defaultValue={patient.document_type} className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50">
              <option value="cedula">Cédula</option>
              <option value="pasaporte">Pasaporte</option>
              <option value="otro">Otro</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Número de Documento *</label>
            <input name="document_number" defaultValue={patient.document_number} required className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input name="email" type="email" defaultValue={patient.email || ""} className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Teléfono</label>
            <input name="phone" defaultValue={patient.phone || ""} className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Ciudad</label>
            <input name="city" defaultValue={patient.city || ""} className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tipo de Sangre</label>
            <select name="blood_type" defaultValue={patient.blood_type || ""} className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50">
              <option value="">Seleccionar</option>
              <option value="A+">A+</option><option value="A-">A-</option>
              <option value="B+">B+</option><option value="B-">B-</option>
              <option value="AB+">AB+</option><option value="AB-">AB-</option>
              <option value="O+">O+</option><option value="O-">O-</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Dirección</label>
          <input name="address" defaultValue={patient.address || ""} className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Alergias</label>
          <textarea name="allergies" rows={2} defaultValue={patient.allergies || ""} className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Contacto de Emergencia</label>
            <input name="emergency_contact_name" defaultValue={patient.emergency_contact_name || ""} className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tel. Emergencia</label>
            <input name="emergency_contact_phone" defaultValue={patient.emergency_contact_phone || ""} className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50" />
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
