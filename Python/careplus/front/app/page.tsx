"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getPatients, getConsultations, getDiagnostics, getTreatments } from "@/lib/api";

export default function Home() {
  const { isAuthenticated, token } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({ patients: 0, consultations: 0, diagnostics: 0, treatments: 0 });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    loadStats();
  }, [isAuthenticated]);

  async function loadStats() {
    if (!token) return;
    try {
      const [p, c, d, t] = await Promise.all([
        getPatients(token),
        getConsultations(token),
        getDiagnostics(token),
        getTreatments(token),
      ]);
      setStats({
        patients: p.length,
        consultations: c.length,
        diagnostics: d.length,
        treatments: t.length,
      });
    } catch { /* ignore */ }
  }

  if (!isAuthenticated) return null;

  const cards = [
    { label: "Pacientes", value: stats.patients, icon: "👥", color: "bg-blue-500", href: "/patients" },
    { label: "Consultas", value: stats.consultations, icon: "📋", color: "bg-green-500", href: "/consultations" },
    { label: "Diagnósticos", value: stats.diagnostics, icon: "🔬", color: "bg-purple-500", href: "/diagnostics" },
    { label: "Tratamientos", value: stats.treatments, icon: "💊", color: "bg-orange-500", href: "/treatments" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-muted mb-8">Resumen general del sistema</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card) => (
          <a
            key={card.label}
            href={card.href}
            className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl">{card.icon}</span>
              <span className={`${card.color} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                {card.value}
              </span>
            </div>
            <h3 className="font-semibold text-lg">{card.label}</h3>
            <p className="text-muted text-sm">Total registrados</p>
          </a>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <a href="/patients/new" className="flex items-center gap-3 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
            <span className="text-2xl">➕</span>
            <div>
              <p className="font-medium text-sm">Nuevo Paciente</p>
              <p className="text-xs text-muted">Registrar paciente</p>
            </div>
          </a>
          <a href="/consultations/new" className="flex items-center gap-3 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
            <span className="text-2xl">📝</span>
            <div>
              <p className="font-medium text-sm">Nueva Consulta</p>
              <p className="text-xs text-muted">Agendar consulta</p>
            </div>
          </a>
          <a href="/diagnostics/new" className="flex items-center gap-3 p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
            <span className="text-2xl">🔍</span>
            <div>
              <p className="font-medium text-sm">Nuevo Diagnóstico</p>
              <p className="text-xs text-muted">Registrar diagnóstico</p>
            </div>
          </a>
          <a href="/treatments/new" className="flex items-center gap-3 p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors">
            <span className="text-2xl">💉</span>
            <div>
              <p className="font-medium text-sm">Nuevo Tratamiento</p>
              <p className="text-xs text-muted">Asignar tratamiento</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}