"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

const NAV_ITEMS = [
  { href: "/", label: "Inicio", icon: "🏠" },
  { href: "/patients", label: "Pacientes", icon: "👥" },
  { href: "/consultations", label: "Consultas", icon: "📋" },
  { href: "/diagnostics", label: "Diagnósticos", icon: "🔬" },
  { href: "/treatments", label: "Tratamientos", icon: "💊" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) return null;

  return (
    <aside className="w-64 bg-card border-r border-border min-h-screen flex flex-col">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-2.5">
          <Image src="/favicon.svg" alt="CarePlus" width={32} height={32} />
          <Image src="/logo.svg" alt="CarePlus" width={100} height={30} priority />
        </div>
        <p className="text-sm text-muted mt-2">Seguimiento Médico</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium ${
                isActive
                  ? "bg-primary text-white"
                  : "text-foreground hover:bg-border/50"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-danger hover:bg-danger/10 transition-colors cursor-pointer"
        >
          <span className="text-lg">🚪</span>
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}
