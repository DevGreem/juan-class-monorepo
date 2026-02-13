"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getUsers, createUser, UserListItem } from "@/lib/api";

const ROLE_LABELS: Record<string, string> = {
  superadmin: "Superadmin",
  admin: "Administrador",
  medico: "Médico",
  enfermero: "Enfermero/a",
  recepcionista: "Recepcionista",
};

const ROLE_COLORS: Record<string, string> = {
  superadmin: "bg-red-100 text-red-800",
  admin: "bg-purple-100 text-purple-800",
  medico: "bg-blue-100 text-blue-800",
  enfermero: "bg-green-100 text-green-800",
  recepcionista: "bg-yellow-100 text-yellow-800",
};

export default function UsersPage() {
  const { isAuthenticated, token, canManageUsers, role } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [selectedRole, setSelectedRole] = useState("medico");
  const [specialty, setSpecialty] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (canManageUsers === false && role !== null) {
      router.push("/");
      return;
    }
    loadUsers();
  }, [isAuthenticated, canManageUsers, role]);

  async function loadUsers() {
    if (!token) return;
    try {
      const data = await getUsers(token);
      setUsers(data);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }

  function getAvailableRoles(): string[] {
    if (role === "superadmin") return ["medico", "enfermero", "recepcionista", "admin"];
    if (role === "admin") return ["medico", "enfermero", "recepcionista"];
    return [];
  }

  function resetForm() {
    setEmail("");
    setPassword("");
    setFullName("");
    setSelectedRole("medico");
    setSpecialty("");
    setLicenseNumber("");
    setPhone("");
    setError("");
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setFormLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await createUser(token, {
        email,
        password,
        full_name: fullName,
        role: selectedRole,
        specialty: specialty || undefined,
        license_number: licenseNumber || undefined,
        phone: phone || undefined,
      });
      setSuccess(result.message);
      resetForm();
      setShowForm(false);
      loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear usuario");
    } finally {
      setFormLoading(false);
    }
  }

  if (!isAuthenticated || !canManageUsers) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
          <p className="text-muted mt-1">Administra los usuarios del sistema</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
            setSuccess("");
          }}
          className="px-4 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors cursor-pointer"
        >
          {showForm ? "Cancelar" : "+ Agregar Usuario"}
        </button>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-300 text-green-700 rounded-lg p-3 mb-4 text-sm">
          {success}
        </div>
      )}

      {/* Create User Form */}
      {showForm && (
        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Crear Nuevo Usuario</h2>

          {error && (
            <div className="bg-danger/10 border border-danger/30 text-danger rounded-lg p-3 mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Correo Electrónico <span className="text-danger">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="correo@ejemplo.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Contraseña <span className="text-danger">*</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Mínimo 8 caracteres"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Nombre Completo <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Dr. Juan Pérez"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Rol <span className="text-danger">*</span>
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                {getAvailableRoles().map((r) => (
                  <option key={r} value={r}>
                    {ROLE_LABELS[r] || r}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Especialidad</label>
              <input
                type="text"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Medicina General"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">No. Licencia</label>
              <input
                type="text"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="MED-2026-001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Teléfono</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="809-555-0000"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={formLoading}
                className="w-full py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 cursor-pointer"
              >
                {formLoading ? "Creando..." : "Crear Usuario"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-muted">Cargando usuarios...</div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-muted">No se encontraron usuarios</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-background/50">
                  <th className="text-left px-4 py-3 text-sm font-medium text-muted">Nombre</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-muted">Correo</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-muted">Rol</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-muted">Especialidad</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-muted">Teléfono</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-muted">Estado</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.user_id} className="border-b border-border last:border-0 hover:bg-background/30">
                    <td className="px-4 py-3 font-medium">{user.full_name}</td>
                    <td className="px-4 py-3 text-sm text-muted">{user.email}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          ROLE_COLORS[user.role_name] || "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {ROLE_LABELS[user.role_name] || user.role_name}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">{user.specialty || "—"}</td>
                    <td className="px-4 py-3 text-sm">{user.phone || "—"}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.is_active ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
