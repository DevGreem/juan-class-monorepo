# CarePlus - Esquema de Base de Datos

## Descripción

Este esquema SQL define la base de datos para el sistema de seguimiento médico **CarePlus**, diseñado para ejecutarse en **Supabase (PostgreSQL)**.

## Tablas

### 1. `patients` - Pacientes
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID (PK) | Identificador único |
| `first_name` | VARCHAR(100) | Nombre |
| `last_name` | VARCHAR(100) | Apellido |
| `date_of_birth` | DATE | Fecha de nacimiento |
| `gender` | VARCHAR(20) | Género (masculino, femenino, otro) |
| `document_type` | VARCHAR(30) | Tipo de documento (cedula, pasaporte, otro) |
| `document_number` | VARCHAR(30) | Número de documento (único) |
| `email` | VARCHAR(255) | Correo electrónico |
| `phone` | VARCHAR(30) | Teléfono |
| `address` | TEXT | Dirección |
| `city` | VARCHAR(100) | Ciudad |
| `blood_type` | VARCHAR(5) | Tipo de sangre |
| `allergies` | TEXT | Alergias |
| `emergency_contact_name` | VARCHAR(200) | Nombre del contacto de emergencia |
| `emergency_contact_phone` | VARCHAR(30) | Teléfono del contacto de emergencia |
| `created_by` | UUID (FK) | Usuario que creó el registro |
| `created_at` | TIMESTAMPTZ | Fecha de creación |
| `updated_at` | TIMESTAMPTZ | Última actualización |
| `is_active` | BOOLEAN | Estado activo/inactivo |

### 2. `consultations` - Consultas Médicas
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID (PK) | Identificador único |
| `patient_id` | UUID (FK) | Paciente |
| `consultation_date` | TIMESTAMPTZ | Fecha de la consulta |
| `reason` | TEXT | Motivo de consulta |
| `symptoms` | TEXT | Síntomas |
| `notes` | TEXT | Notas del médico |
| `weight_kg` | DECIMAL(5,2) | Peso en kg |
| `height_cm` | DECIMAL(5,2) | Altura en cm |
| `blood_pressure` | VARCHAR(20) | Presión arterial |
| `heart_rate` | INTEGER | Frecuencia cardíaca |
| `temperature_c` | DECIMAL(4,1) | Temperatura en °C |
| `status` | VARCHAR(30) | Estado (programada, en_curso, completada, cancelada) |

### 3. `diagnostics` - Diagnósticos
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID (PK) | Identificador único |
| `patient_id` | UUID (FK) | Paciente |
| `consultation_id` | UUID (FK) | Consulta asociada (opcional) |
| `code` | VARCHAR(20) | Código CIE-10 |
| `name` | VARCHAR(255) | Nombre del diagnóstico |
| `description` | TEXT | Descripción detallada |
| `severity` | VARCHAR(20) | Severidad (leve, moderado, grave, crítico) |
| `diagnosis_type` | VARCHAR(30) | Tipo (presuntivo, definitivo, diferencial) |
| `diagnosis_date` | DATE | Fecha del diagnóstico |

### 4. `treatments` - Tratamientos
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID (PK) | Identificador único |
| `patient_id` | UUID (FK) | Paciente |
| `diagnostic_id` | UUID (FK) | Diagnóstico asociado (opcional) |
| `consultation_id` | UUID (FK) | Consulta asociada (opcional) |
| `name` | VARCHAR(255) | Nombre del tratamiento/medicamento |
| `description` | TEXT | Descripción/indicaciones |
| `treatment_type` | VARCHAR(30) | Tipo (medicamento, terapia, cirugía, procedimiento, otro) |
| `dosage` | VARCHAR(100) | Dosis |
| `frequency` | VARCHAR(100) | Frecuencia |
| `duration` | VARCHAR(100) | Duración |
| `start_date` | DATE | Fecha de inicio |
| `end_date` | DATE | Fecha de fin |
| `status` | VARCHAR(20) | Estado (activo, completado, suspendido, cancelado) |

### 5. `medical_history` - Historial Médico
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID (PK) | Identificador único |
| `patient_id` | UUID (FK) | Paciente |
| `consultation_id` | UUID (FK) | Consulta (opcional) |
| `diagnostic_id` | UUID (FK) | Diagnóstico (opcional) |
| `treatment_id` | UUID (FK) | Tratamiento (opcional) |
| `event_type` | VARCHAR(30) | Tipo de evento (consulta, diagnostico, tratamiento, nota) |
| `title` | VARCHAR(255) | Título del evento |
| `description` | TEXT | Descripción |
| `event_date` | DATE | Fecha del evento |

## Relaciones

```
patients ──< consultations
patients ──< diagnostics
patients ──< treatments
patients ──< medical_history
consultations ──< diagnostics
consultations ──< treatments
diagnostics ──< treatments
```

## Seguridad

- **Row Level Security (RLS)** habilitado en todas las tablas
- Solo usuarios autenticados pueden realizar operaciones CRUD
- Trigger `updated_at` automático en todas las tablas

## Uso

Ejecuta `schema.sql` en el SQL Editor de Supabase para crear todas las tablas, índices, triggers y políticas de seguridad.
