-- ============================================
-- CarePlus - Vistas para Consultas Rápidas
-- ============================================

-- ============================================
-- Vista: Usuarios con su rol
-- Muestra los datos del usuario de auth + su rol y perfil
-- ============================================
CREATE OR REPLACE VIEW v_users AS
SELECT
    u.id              AS user_id,
    u.email,
    r.name            AS role_name,
    r.description     AS role_description,
    ur.full_name,
    ur.specialty,
    ur.license_number,
    ur.phone,
    ur.is_active,
    r.can_manage_users,
    r.can_manage_patients,
    r.can_manage_consultations,
    r.can_manage_diagnostics,
    r.can_manage_treatments,
    ur.created_at,
    ur.updated_at
FROM auth.users u
JOIN user_roles ur ON ur.user_id = u.id
JOIN roles r       ON r.id = ur.role_id;

-- ============================================
-- Vista: Resumen de pacientes
-- Paciente + cantidad de consultas, diagnósticos y tratamientos
-- ============================================
CREATE OR REPLACE VIEW v_patient_summary AS
SELECT
    p.id              AS patient_id,
    p.first_name,
    p.last_name,
    p.first_name || ' ' || p.last_name AS full_name,
    p.document_type,
    p.document_number,
    p.email,
    p.phone,
    p.city,
    p.blood_type,
    p.allergies,
    p.date_of_birth,
    EXTRACT(YEAR FROM AGE(p.date_of_birth))::INT AS age,
    p.gender,
    p.is_active,
    p.created_at,
    COUNT(DISTINCT c.id)  AS total_consultations,
    COUNT(DISTINCT d.id)  AS total_diagnostics,
    COUNT(DISTINCT t.id)  AS total_treatments
FROM patients p
LEFT JOIN consultations c ON c.patient_id = p.id
LEFT JOIN diagnostics d   ON d.patient_id = p.id
LEFT JOIN treatments t    ON t.patient_id = p.id
GROUP BY p.id;

-- ============================================
-- Vista: Consultas con datos del paciente
-- ============================================
CREATE OR REPLACE VIEW v_consultations AS
SELECT
    c.id              AS consultation_id,
    c.consultation_date,
    c.reason,
    c.symptoms,
    c.notes,
    c.weight_kg,
    c.height_cm,
    c.blood_pressure,
    c.heart_rate,
    c.temperature_c,
    c.status,
    c.created_at,
    c.updated_at,
    -- Paciente
    p.id              AS patient_id,
    p.first_name || ' ' || p.last_name AS patient_name,
    p.document_number,
    -- Médico que creó la consulta
    ur.full_name      AS created_by_name
FROM consultations c
JOIN patients p   ON p.id = c.patient_id
LEFT JOIN user_roles ur ON ur.user_id = c.created_by;

-- ============================================
-- Vista: Diagnósticos con paciente y consulta
-- ============================================
CREATE OR REPLACE VIEW v_diagnostics AS
SELECT
    d.id              AS diagnostic_id,
    d.code,
    d.name            AS diagnostic_name,
    d.description,
    d.severity,
    d.diagnosis_type,
    d.diagnosis_date,
    d.created_at,
    -- Paciente
    p.id              AS patient_id,
    p.first_name || ' ' || p.last_name AS patient_name,
    p.document_number,
    -- Consulta
    c.id              AS consultation_id,
    c.reason          AS consultation_reason,
    c.consultation_date,
    -- Médico
    ur.full_name      AS created_by_name
FROM diagnostics d
JOIN patients p       ON p.id = d.patient_id
LEFT JOIN consultations c ON c.id = d.consultation_id
LEFT JOIN user_roles ur   ON ur.user_id = d.created_by;

-- ============================================
-- Vista: Tratamientos con diagnóstico y paciente
-- ============================================
CREATE OR REPLACE VIEW v_treatments AS
SELECT
    t.id              AS treatment_id,
    t.name            AS treatment_name,
    t.description,
    t.treatment_type,
    t.dosage,
    t.frequency,
    t.duration,
    t.start_date,
    t.end_date,
    t.status,
    t.created_at,
    -- Paciente
    p.id              AS patient_id,
    p.first_name || ' ' || p.last_name AS patient_name,
    p.document_number,
    -- Diagnóstico
    d.id              AS diagnostic_id,
    d.name            AS diagnostic_name,
    d.code            AS diagnostic_code,
    -- Consulta
    c.id              AS consultation_id,
    c.reason          AS consultation_reason,
    -- Médico
    ur.full_name      AS created_by_name
FROM treatments t
JOIN patients p           ON p.id = t.patient_id
LEFT JOIN diagnostics d   ON d.id = t.diagnostic_id
LEFT JOIN consultations c ON c.id = t.consultation_id
LEFT JOIN user_roles ur   ON ur.user_id = t.created_by;

-- ============================================
-- Vista: Historial médico completo del paciente
-- ============================================
CREATE OR REPLACE VIEW v_medical_history AS
SELECT
    mh.id             AS history_id,
    mh.event_type,
    mh.title,
    mh.description    AS history_description,
    mh.event_date,
    mh.created_at,
    -- Paciente
    p.id              AS patient_id,
    p.first_name || ' ' || p.last_name AS patient_name,
    p.document_number,
    -- Consulta (si aplica)
    c.id              AS consultation_id,
    c.reason          AS consultation_reason,
    c.consultation_date,
    -- Diagnóstico (si aplica)
    d.id              AS diagnostic_id,
    d.name            AS diagnostic_name,
    d.code            AS diagnostic_code,
    -- Tratamiento (si aplica)
    t.id              AS treatment_id,
    t.name            AS treatment_name,
    -- Quien registró
    ur.full_name      AS created_by_name
FROM medical_history mh
JOIN patients p           ON p.id = mh.patient_id
LEFT JOIN consultations c ON c.id = mh.consultation_id
LEFT JOIN diagnostics d   ON d.id = mh.diagnostic_id
LEFT JOIN treatments t    ON t.id = mh.treatment_id
LEFT JOIN user_roles ur   ON ur.user_id = mh.created_by;

-- ============================================
-- Vista: Tratamientos activos
-- Para ver rápidamente qué tratamientos están en curso
-- ============================================
CREATE OR REPLACE VIEW v_active_treatments AS
SELECT
    t.id              AS treatment_id,
    t.name            AS treatment_name,
    t.treatment_type,
    t.dosage,
    t.frequency,
    t.duration,
    t.start_date,
    t.status,
    p.id              AS patient_id,
    p.first_name || ' ' || p.last_name AS patient_name,
    p.document_number,
    d.name            AS diagnostic_name,
    d.code            AS diagnostic_code
FROM treatments t
JOIN patients p         ON p.id = t.patient_id
LEFT JOIN diagnostics d ON d.id = t.diagnostic_id
WHERE t.status = 'activo';

-- ============================================
-- Vista: Consultas recientes (últimos 30 días)
-- ============================================
CREATE OR REPLACE VIEW v_recent_consultations AS
SELECT
    c.id              AS consultation_id,
    c.consultation_date,
    c.reason,
    c.status,
    p.id              AS patient_id,
    p.first_name || ' ' || p.last_name AS patient_name,
    p.document_number,
    ur.full_name      AS created_by_name
FROM consultations c
JOIN patients p       ON p.id = c.patient_id
LEFT JOIN user_roles ur ON ur.user_id = c.created_by
WHERE c.consultation_date >= NOW() - INTERVAL '30 days'
ORDER BY c.consultation_date DESC;
