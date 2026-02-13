-- ============================================
-- CarePlus - Tabla de Consultas (visitas médicas)
-- ============================================

CREATE TABLE IF NOT EXISTS consultations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id      UUID            NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    
    -- Datos de la consulta
    consultation_date   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reason              TEXT        NOT NULL,
    symptoms            TEXT,
    notes               TEXT,
    
    -- Signos vitales
    weight_kg           DECIMAL(5,2),
    height_cm           DECIMAL(5,2),
    blood_pressure      VARCHAR(20),
    heart_rate          INTEGER,
    temperature_c       DECIMAL(4,1),
    
    -- Estado
    status              VARCHAR(30) NOT NULL DEFAULT 'completada' 
                        CHECK (status IN ('programada', 'en_curso', 'completada', 'cancelada')),
    
    -- Metadatos
    created_by      UUID            REFERENCES auth.users(id),
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);
