"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getUsers, createUser, updateUser, deleteUser, UserListItem } from "@/lib/api";

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

  // Create form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [selectedRole, setSelectedRole] = useState("medico");
  const [specialty, setSpecialty] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [phone, setPhone] = useState("");

  // Edit state
  const [editingUser, setEditingUser] = useState<UserListItem | null>(null);
  const [editFullName, setEditFullName] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editSpecialty, setEditSpecialty] = useState("");
  const [editLicenseNumber, setEditLicenseNumber] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editIsActive, setEditIsActive] = useState(true);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");

  // Delete state
  const [deletingUser, setDeletingUser] = useState<UserListItem | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

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

  function canEditUser(targetRole: string): boolean {
    if (role === "superadmin") return targetRole !== "superadmin";
    if (role === "admin") return ["medico", "enfermero", "recepcionista"].includes(targetRole);
    return false;
  }

  function getEditableRoles(): string[] {
    if (role === "superadmin") return ["medico", "enfermero", "recepcionista", "admin"];
    if (role === "admin") return ["medico", "enfermero", "recepcionista"];
    return [];
  }

  function startEditing(user: UserListItem) {
    setEditingUser(user);
    setEditFullName(user.full_name);
    setEditRole(user.role_name);
    setEditSpecialty(user.specialty || "");
    setEditLicenseNumber(user.license_number || "");
    setEditPhone(user.phone || "");
    setEditIsActive(user.is_active);
    setEditError("");
    setShowForm(false);
  }

  function cancelEditing() {
    setEditingUser(null);
    setEditError("");
  }

  function canDeleteUser(targetRole: string): boolean {
    if (role === "superadmin") return targetRole !== "superadmin";
    if (role === "admin") return ["medico", "enfermero", "recepcionista"].includes(targetRole);
    return false;
  }

  async function handleDelete() {
    if (!token || !deletingUser) return;
    setDeleteLoading(true);
    setSuccess("");

    try {
      const result = await deleteUser(token, deletingUser.user_id);
      setSuccess(result.message);
      setDeletingUser(null);
      loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al eliminar usuario");
      setDeletingUser(null);
    } finally {
      setDeleteLoading(false);
    }
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !editingUser) return;
    setEditLoading(true);
    setEditError("");
    setSuccess("");

    try {
      const result = await updateUser(token, editingUser.user_id, {
        full_name: editFullName !== editingUser.full_name ? editFullName : undefined,
        role: editRole !== editingUser.role_name ? editRole : undefined,
        specialty: editSpecialty !== (editingUser.specialty || "") ? editSpecialty : undefined,
        license_number: editLicenseNumber !== (editingUser.license_number || "") ? editLicenseNumber : undefined,
        phone: editPhone !== (editingUser.phone || "") ? editPhone : undefined,
        is_active: editIsActive !== editingUser.is_active ? editIsActive : undefined,
      });
      setSuccess(result.message);
      cancelEditing();
      loadUsers();
    } catch (err) {
      setEditError(err instanceof Error ? err.message : "Error al actualizar usuario");
    } finally {
      setEditLoading(false);
    }
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

      {/* Edit User Form */}
      {editingUser && (
        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">
            Editar Usuario: {editingUser.full_name}
          </h2>

          {editError && (
            <div className="bg-danger/10 border border-danger/30 text-danger rounded-lg p-3 mb-4 text-sm">
              {editError}
            </div>
          )}

          <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Correo Electrónico</label>
              <input
                type="email"
                value={editingUser.email}
                disabled
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background/50 text-muted cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Nombre Completo <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                value={editFullName}
                onChange={(e) => setEditFullName(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Rol</label>
              <select
                value={editRole}
                onChange={(e) => setEditRole(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                {getEditableRoles().map((r) => (
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
                value={editSpecialty}
                onChange={(e) => setEditSpecialty(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Medicina General"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">No. Licencia</label>
              <input
                type="text"
                value={editLicenseNumber}
                onChange={(e) => setEditLicenseNumber(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="MED-2026-001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Teléfono</label>
              <input
                type="text"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="809-555-0000"
              />
            </div>

            <div className="flex items-center gap-3">
              <label className="block text-sm font-medium">Estado</label>
              <button
                type="button"
                onClick={() => setEditIsActive(!editIsActive)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                  editIsActive ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    editIsActive ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              <span className="text-sm">{editIsActive ? "Activo" : "Inactivo"}</span>
            </div>

            <div className="flex items-end gap-2">
              <button
                type="submit"
                disabled={editLoading}
                className="flex-1 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 cursor-pointer"
              >
                {editLoading ? "Guardando..." : "Guardar Cambios"}
              </button>
              <button
                type="button"
                onClick={cancelEditing}
                className="px-4 py-2.5 border border-border rounded-lg font-medium hover:bg-background/50 transition-colors cursor-pointer"
              >
                Cancelar
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
                  <th className="text-left px-4 py-3 text-sm font-medium text-muted">Acciones</th>
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
                    <td className="px-4 py-3 flex gap-2">
                      {canEditUser(user.role_name) && (
                        <button
                          onClick={() => startEditing(user)}
                          className="text-sm text-primary hover:underline cursor-pointer"
                        >
                          Editar
                        </button>
                      )}
                      {canDeleteUser(user.role_name) && (
                        <button
                          onClick={() => setDeletingUser(user)}
                          className="text-sm text-red-600 hover:underline cursor-pointer"
                        >
                          Eliminar
                        </button>
                      )}
                      {!canEditUser(user.role_name) && !canDeleteUser(user.role_name) && (
                        <span className="text-sm text-muted">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* Delete Confirmation Modal */}
      {deletingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-2">Confirmar Eliminación</h3>
            <p className="text-sm text-muted mb-4">
              ¿Estás seguro de que deseas eliminar al usuario{" "}
              <strong>{deletingUser.full_name}</strong> ({deletingUser.email})?{" "}
              Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setDeletingUser(null)}
                disabled={deleteLoading}
                className="px-4 py-2 border border-border rounded-lg font-medium hover:bg-background/50 transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors cursor-pointer disabled:opacity-50"
              >
                {deleteLoading ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
