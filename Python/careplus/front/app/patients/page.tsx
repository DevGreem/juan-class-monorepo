"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getPatients, deletePatient, Patient } from "@/lib/api";
import Link from "next/link";

export default function PatientsPage() {
  const { token, isAuthenticated } = useAuth();
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) { router.push("/login"); return; }
    loadPatients();
  }, [isAuthenticated]);

  async function loadPatients() {
    if (!token) return;
    setLoading(true);
    try {
      const data = await getPatients(token, search || undefined);
      setPatients(data);
    } catch { /* ignore */ }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!token || !confirm("¿Está seguro de eliminar este paciente?")) return;
    try {
      await deletePatient(token, id);
      setPatients(patients.filter((p) => p.id !== id));
    } catch { /* ignore */ }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    loadPatients();
  }

  if (!isAuthenticated) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Pacientes</h1>
          <p className="text-muted">Gestión de pacientes registrados</p>
        </div>
        <Link
          href="/patients/new"
          className="bg-primary text-white px-5 py-2.5 rounded-lg font-medium hover:bg-primary-dark transition-colors"
        >
          + Nuevo Paciente
        </Link>
      </div>

      <form onSubmit={handleSearch} className="mb-6 flex gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre o documento..."
          className="flex-1 px-4 py-2.5 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        <button type="submit" className="bg-primary text-white px-5 py-2.5 rounded-lg hover:bg-primary-dark transition-colors cursor-pointer">
          Buscar
        </button>
      </form>

      {loading ? (
        <p className="text-muted text-center py-12">Cargando...</p>
      ) : patients.length === 0 ? (
        <div className="text-center py-12 bg-card border border-border rounded-xl">
          <p className="text-muted text-lg">No hay pacientes registrados</p>
          <Link href="/patients/new" className="text-primary font-medium mt-2 inline-block">
            Registrar primer paciente
          </Link>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-border/30">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-semibold">Paciente</th>
                <th className="text-left px-6 py-3 text-sm font-semibold">Documento</th>
                <th className="text-left px-6 py-3 text-sm font-semibold">Teléfono</th>
                <th className="text-left px-6 py-3 text-sm font-semibold">Tipo Sangre</th>
                <th className="text-right px-6 py-3 text-sm font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {patients.map((p) => (
                <tr key={p.id} className="hover:bg-border/20 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium">{p.first_name} {p.last_name}</p>
                      <p className="text-xs text-muted">{p.email || "Sin email"}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">{p.document_number}</td>
                  <td className="px-6 py-4 text-sm">{p.phone || "—"}</td>
                  <td className="px-6 py-4 text-sm">{p.blood_type || "—"}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Link href={`/patients/${p.id}`} className="text-primary hover:underline text-sm">
                      Ver
                    </Link>
                    <Link href={`/patients/${p.id}/edit`} className="text-warning hover:underline text-sm">
                      Editar
                    </Link>
                    <button onClick={() => handleDelete(p.id)} className="text-danger hover:underline text-sm cursor-pointer">
                      Eliminar
                    </button>
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
