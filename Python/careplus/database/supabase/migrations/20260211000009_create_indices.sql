-- ============================================
-- CarePlus - Índices para Rendimiento
-- ============================================

CREATE INDEX IF NOT EXISTS idx_consultations_patient      ON consultations(patient_id);
CREATE INDEX IF NOT EXISTS idx_consultations_date         ON consultations(consultation_date);
CREATE INDEX IF NOT EXISTS idx_diagnostics_patient        ON diagnostics(patient_id);
CREATE INDEX IF NOT EXISTS idx_diagnostics_consultation   ON diagnostics(consultation_id);
CREATE INDEX IF NOT EXISTS idx_treatments_patient         ON treatments(patient_id);
CREATE INDEX IF NOT EXISTS idx_treatments_diagnostic      ON treatments(diagnostic_id);
CREATE INDEX IF NOT EXISTS idx_medical_history_patient    ON medical_history(patient_id);
CREATE INDEX IF NOT EXISTS idx_patients_document          ON patients(document_number);
CREATE INDEX IF NOT EXISTS idx_roles_name                 ON roles(name);
