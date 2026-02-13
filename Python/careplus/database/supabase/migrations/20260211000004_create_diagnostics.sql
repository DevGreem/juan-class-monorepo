-- ============================================
-- CarePlus - Tabla de Diagnósticos
-- ============================================

CREATE TABLE IF NOT EXISTS diagnostics (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id      UUID            NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    consultation_id UUID            REFERENCES consultations(id) ON DELETE SET NULL,
    
    -- Datos del diagnóstico
    code            VARCHAR(20),
    name            VARCHAR(255)    NOT NULL,
    description     TEXT,
    severity        VARCHAR(20)     NOT NULL DEFAULT 'moderado'
                    CHECK (severity IN ('leve', 'moderado', 'grave', 'critico')),
    diagnosis_type  VARCHAR(30)     NOT NULL DEFAULT 'definitivo'
                    CHECK (diagnosis_type IN ('presuntivo', 'definitivo', 'diferencial')),
    diagnosis_date  DATE            NOT NULL DEFAULT CURRENT_DATE,
    
    -- Metadatos
    created_by      UUID            REFERENCES auth.users(id),
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);
