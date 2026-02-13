-- ============================================
-- CarePlus - Tabla de Tratamientos
-- ============================================

CREATE TABLE IF NOT EXISTS treatments (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id      UUID            NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    diagnostic_id   UUID            REFERENCES diagnostics(id) ON DELETE SET NULL,
    consultation_id UUID            REFERENCES consultations(id) ON DELETE SET NULL,
    
    -- Datos del tratamiento
    name            VARCHAR(255)    NOT NULL,
    description     TEXT,
    treatment_type  VARCHAR(30)     NOT NULL DEFAULT 'medicamento'
                    CHECK (treatment_type IN ('medicamento', 'terapia', 'cirugia', 'procedimiento', 'otro')),
    
    -- Medicamento (si aplica)
    dosage          VARCHAR(100),
    frequency       VARCHAR(100),
    duration        VARCHAR(100),
    
    -- Fechas
    start_date      DATE            NOT NULL DEFAULT CURRENT_DATE,
    end_date        DATE,
    
    -- Estado
    status          VARCHAR(20)     NOT NULL DEFAULT 'activo'
                    CHECK (status IN ('activo', 'completado', 'suspendido', 'cancelado')),
    
    -- Metadatos
    created_by      UUID            REFERENCES auth.users(id),
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);
