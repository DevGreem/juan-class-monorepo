-- ============================================
-- CarePlus - Tabla de Historial Médico (resumen)
-- ============================================

CREATE TABLE IF NOT EXISTS medical_history (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id      UUID            NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    
    -- Referencia a registros relacionados
    consultation_id UUID            REFERENCES consultations(id) ON DELETE SET NULL,
    diagnostic_id   UUID            REFERENCES diagnostics(id) ON DELETE SET NULL,
    treatment_id    UUID            REFERENCES treatments(id) ON DELETE SET NULL,
    
    -- Datos del evento
    event_type      VARCHAR(30)     NOT NULL 
                    CHECK (event_type IN ('consulta', 'diagnostico', 'tratamiento', 'nota')),
    title           VARCHAR(255)    NOT NULL,
    description     TEXT,
    event_date      DATE            NOT NULL DEFAULT CURRENT_DATE,
    
    -- Metadatos
    created_by      UUID            REFERENCES auth.users(id),
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);
