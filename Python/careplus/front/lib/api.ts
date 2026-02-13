const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface FetchOptions extends RequestInit {
  token?: string;
}

async function fetchAPI<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { token, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (res.status === 204) return null as T;

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Error desconocido" }));
    throw new Error(error.detail || `Error ${res.status}`);
  }

  return res.json();
}

// ── Auth ──
export async function login(email: string, password: string) {
  return fetchAPI<{
    token: string | null;
    success: boolean;
    requires_verification: boolean;
    user_id: string | null;
    message: string | null;
  }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function verifyOtp(userId: string, code: string) {
  return fetchAPI<{
    token: string | null;
    success: boolean;
    requires_verification: boolean;
    message: string | null;
  }>("/auth/verify-otp", {
    method: "POST",
    body: JSON.stringify({ user_id: userId, code }),
  });
}

export async function getMe(token: string) {
  return fetchAPI<UserMe>("/auth/me", { token });
}

export async function getUsers(token: string) {
  return fetchAPI<UserListItem[]>("/auth/users", { token });
}

export async function createUser(token: string, data: CreateUserRequest) {
  return fetchAPI<{ success: boolean; message: string; user_id: string | null }>(
    "/auth/sign_up",
    { method: "POST", body: JSON.stringify(data), token }
  );
}

// ── Patients ──
export async function getPatients(token: string, search?: string) {
  const params = search ? `?search=${encodeURIComponent(search)}` : "";
  return fetchAPI<Patient[]>(`/patients/${params}`, { token });
}

export async function getPatient(token: string, id: string) {
  return fetchAPI<Patient>(`/patients/${id}`, { token });
}

export async function createPatient(token: string, data: PatientCreate) {
  return fetchAPI<Patient>("/patients/", { method: "POST", body: JSON.stringify(data), token });
}

export async function updatePatient(token: string, id: string, data: Partial<PatientCreate>) {
  return fetchAPI<Patient>(`/patients/${id}`, { method: "PUT", body: JSON.stringify(data), token });
}

export async function deletePatient(token: string, id: string) {
  return fetchAPI<null>(`/patients/${id}`, { method: "DELETE", token });
}

// ── Consultations ──
export async function getConsultations(token: string, patientId?: string) {
  const params = patientId ? `?patient_id=${patientId}` : "";
  return fetchAPI<Consultation[]>(`/consultations/${params}`, { token });
}

export async function getConsultation(token: string, id: string) {
  return fetchAPI<Consultation>(`/consultations/${id}`, { token });
}

export async function createConsultation(token: string, data: ConsultationCreate) {
  return fetchAPI<Consultation>("/consultations/", { method: "POST", body: JSON.stringify(data), token });
}

export async function updateConsultation(token: string, id: string, data: Partial<ConsultationCreate>) {
  return fetchAPI<Consultation>(`/consultations/${id}`, { method: "PUT", body: JSON.stringify(data), token });
}

export async function deleteConsultation(token: string, id: string) {
  return fetchAPI<null>(`/consultations/${id}`, { method: "DELETE", token });
}

// ── Diagnostics ──
export async function getDiagnostics(token: string, patientId?: string) {
  const params = patientId ? `?patient_id=${patientId}` : "";
  return fetchAPI<Diagnostic[]>(`/diagnostics/${params}`, { token });
}

export async function getDiagnostic(token: string, id: string) {
  return fetchAPI<Diagnostic>(`/diagnostics/${id}`, { token });
}

export async function createDiagnostic(token: string, data: DiagnosticCreate) {
  return fetchAPI<Diagnostic>("/diagnostics/", { method: "POST", body: JSON.stringify(data), token });
}

export async function updateDiagnostic(token: string, id: string, data: Partial<DiagnosticCreate>) {
  return fetchAPI<Diagnostic>(`/diagnostics/${id}`, { method: "PUT", body: JSON.stringify(data), token });
}

export async function deleteDiagnostic(token: string, id: string) {
  return fetchAPI<null>(`/diagnostics/${id}`, { method: "DELETE", token });
}

// ── Treatments ──
export async function getTreatments(token: string, patientId?: string) {
  const params = patientId ? `?patient_id=${patientId}` : "";
  return fetchAPI<Treatment[]>(`/treatments/${params}`, { token });
}

export async function getTreatment(token: string, id: string) {
  return fetchAPI<Treatment>(`/treatments/${id}`, { token });
}

export async function createTreatment(token: string, data: TreatmentCreate) {
  return fetchAPI<Treatment>("/treatments/", { method: "POST", body: JSON.stringify(data), token });
}

export async function updateTreatment(token: string, id: string, data: Partial<TreatmentCreate>) {
  return fetchAPI<Treatment>(`/treatments/${id}`, { method: "PUT", body: JSON.stringify(data), token });
}

export async function deleteTreatment(token: string, id: string) {
  return fetchAPI<null>(`/treatments/${id}`, { method: "DELETE", token });
}

// ── Types ──
export interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  document_type: string;
  document_number: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  blood_type?: string;
  allergies?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  created_at?: string;
  updated_at?: string;
  is_active: boolean;
}

export interface PatientCreate {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  document_type?: string;
  document_number: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  blood_type?: string;
  allergies?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
}

export interface Consultation {
  id: string;
  patient_id: string;
  consultation_date?: string;
  reason: string;
  symptoms?: string;
  notes?: string;
  weight_kg?: number;
  height_cm?: number;
  blood_pressure?: string;
  heart_rate?: number;
  temperature_c?: number;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export interface ConsultationCreate {
  patient_id: string;
  reason: string;
  consultation_date?: string;
  symptoms?: string;
  notes?: string;
  weight_kg?: number;
  height_cm?: number;
  blood_pressure?: string;
  heart_rate?: number;
  temperature_c?: number;
  status?: string;
}

export interface Diagnostic {
  id: string;
  patient_id: string;
  consultation_id?: string;
  code?: string;
  name: string;
  description?: string;
  severity: string;
  diagnosis_type: string;
  diagnosis_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DiagnosticCreate {
  patient_id: string;
  consultation_id?: string;
  code?: string;
  name: string;
  description?: string;
  severity?: string;
  diagnosis_type?: string;
  diagnosis_date?: string;
}

export interface Treatment {
  id: string;
  patient_id: string;
  diagnostic_id?: string;
  consultation_id?: string;
  name: string;
  description?: string;
  treatment_type: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
  start_date?: string;
  end_date?: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export interface TreatmentCreate {
  patient_id: string;
  diagnostic_id?: string;
  consultation_id?: string;
  name: string;
  description?: string;
  treatment_type?: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
  start_date?: string;
  end_date?: string;
  status?: string;
}

export interface UserMe {
  user_id: string;
  email: string;
  role_name: string;
  full_name: string;
  specialty?: string;
  license_number?: string;
  phone?: string;
  is_active: boolean;
  can_manage_users: boolean;
}

export interface UserListItem {
  user_id: string;
  email: string;
  role_name: string;
  full_name: string;
  specialty?: string;
  license_number?: string;
  phone?: string;
  is_active: boolean;
  created_at?: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  full_name: string;
  role: string;
  specialty?: string;
  license_number?: string;
  phone?: string;
}
