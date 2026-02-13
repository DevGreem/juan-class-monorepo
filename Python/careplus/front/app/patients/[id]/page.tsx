"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getPatient, Patient, getConsultations, getDiagnostics, getTreatments, Consultation, Diagnostic, Treatment } from "@/lib/api";
import Link from "next/link";

export default function PatientDetailPage() {
  const { token, isAuthenticated } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [patient, setPatient] = useState<Patient | null>(null);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [diagnostics, setDiagnostics] = useState<Diagnostic[]>([]);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) { router.push("/login"); return; }
    loadData();
  }, [isAuthenticated, id]);

  async function loadData() {
    if (!token) return;
    try {
      const [p, c, d, t] = await Promise.all([
        getPatient(token, id),
        getConsultations(token, id),
        getDiagnostics(token, id),
        getTreatments(token, id),
      ]);
      setPatient(p);
      setConsultations(c);
      setDiagnostics(d);
      setTreatments(t);
    } catch { router.push("/patients"); }
    setLoading(false);
  }

  if (loading) return <p className="text-muted text-center py-12">Cargando...</p>;
  if (!patient) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">{patient.first_name} {patient.last_name}</h1>
          <p className="text-muted">Documento: {patient.document_number}</p>
        </div>
        <div className="flex gap-3">
          <Link href={`/patients/${id}/edit`} className="bg-warning text-white px-5 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity">
            Editar
          </Link>
          <button onClick={() => router.back()} className="px-5 py-2.5 rounded-lg border border-border hover:bg-border/30 transition-colors cursor-pointer">
            Volver
          </button>
        </div>
      </div>

      {/* Información del paciente */}
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Información Personal</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div><span className="text-muted">Género:</span> <span className="ml-2 font-medium capitalize">{patient.gender}</span></div>
          <div><span className="text-muted">Nacimiento:</span> <span className="ml-2 font-medium">{patient.date_of_birth}</span></div>
          <div><span className="text-muted">Tipo Sangre:</span> <span className="ml-2 font-medium">{patient.blood_type || "—"}</span></div>
          <div><span className="text-muted">Email:</span> <span className="ml-2 font-medium">{patient.email || "—"}</span></div>
          <div><span className="text-muted">Teléfono:</span> <span className="ml-2 font-medium">{patient.phone || "—"}</span></div>
          <div><span className="text-muted">Ciudad:</span> <span className="ml-2 font-medium">{patient.city || "—"}</span></div>
          <div className="md:col-span-3"><span className="text-muted">Dirección:</span> <span className="ml-2 font-medium">{patient.address || "—"}</span></div>
          <div className="md:col-span-3"><span className="text-muted">Alergias:</span> <span className="ml-2 font-medium">{patient.allergies || "Ninguna registrada"}</span></div>
          <div><span className="text-muted">Contacto Emergencia:</span> <span className="ml-2 font-medium">{patient.emergency_contact_name || "—"} {patient.emergency_contact_phone ? `(${patient.emergency_contact_phone})` : ""}</span></div>
        </div>
      </div>

      {/* Consultas */}
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Consultas ({consultations.length})</h2>
          <Link href={`/consultations/new?patient_id=${id}`} className="text-primary text-sm font-medium hover:underline">
            + Nueva Consulta
          </Link>
        </div>
        {consultations.length === 0 ? (
          <p className="text-muted text-sm">Sin consultas registradas</p>
        ) : (
          <div className="space-y-3">
            {consultations.slice(0, 5).map((c) => (
              <div key={c.id} className="flex items-center justify-between p-3 rounded-lg bg-border/20">
                <div>
                  <p className="font-medium text-sm">{c.reason}</p>
                  <p className="text-xs text-muted">{c.consultation_date ? new Date(c.consultation_date).toLocaleDateString() : "—"}</p>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${c.status === "completada" ? "bg-success/20 text-success" : c.status === "programada" ? "bg-primary/20 text-primary" : "bg-muted/20 text-muted"}`}>
                  {c.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Diagnósticos */}
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Diagnósticos ({diagnostics.length})</h2>
          <Link href={`/diagnostics/new?patient_id=${id}`} className="text-primary text-sm font-medium hover:underline">
            + Nuevo Diagnóstico
          </Link>
        </div>
        {diagnostics.length === 0 ? (
          <p className="text-muted text-sm">Sin diagnósticos registrados</p>
        ) : (
          <div className="space-y-3">
            {diagnostics.slice(0, 5).map((d) => (
              <div key={d.id} className="flex items-center justify-between p-3 rounded-lg bg-border/20">
                <div>
                  <p className="font-medium text-sm">{d.name}</p>
                  <p className="text-xs text-muted">{d.code ? `${d.code} — ` : ""}{d.diagnosis_date}</p>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${d.severity === "leve" ? "bg-success/20 text-success" : d.severity === "grave" ? "bg-danger/20 text-danger" : "bg-warning/20 text-warning"}`}>
                  {d.severity}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tratamientos */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Tratamientos ({treatments.length})</h2>
          <Link href={`/treatments/new?patient_id=${id}`} className="text-primary text-sm font-medium hover:underline">
            + Nuevo Tratamiento
          </Link>
        </div>
        {treatments.length === 0 ? (
          <p className="text-muted text-sm">Sin tratamientos registrados</p>
        ) : (
          <div className="space-y-3">
            {treatments.slice(0, 5).map((t) => (
              <div key={t.id} className="flex items-center justify-between p-3 rounded-lg bg-border/20">
                <div>
                  <p className="font-medium text-sm">{t.name}</p>
                  <p className="text-xs text-muted">{t.dosage ? `${t.dosage} — ` : ""}{t.treatment_type}</p>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${t.status === "activo" ? "bg-success/20 text-success" : t.status === "completado" ? "bg-primary/20 text-primary" : "bg-muted/20 text-muted"}`}>
                  {t.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
