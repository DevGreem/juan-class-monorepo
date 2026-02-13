-- ============================================
-- CarePlus - Tabla de Pacientes
-- ============================================

CREATE TABLE IF NOT EXISTS patients (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Datos personales
    first_name      VARCHAR(100)    NOT NULL,
    last_name       VARCHAR(100)    NOT NULL,
    date_of_birth   DATE            NOT NULL,
    gender          VARCHAR(20)     NOT NULL CHECK (gender IN ('masculino', 'femenino', 'otro')),
    
    -- Identificación
    document_type   VARCHAR(30)     NOT NULL DEFAULT 'cedula' CHECK (document_type IN ('cedula', 'pasaporte', 'otro')),
    document_number VARCHAR(30)     NOT NULL UNIQUE,
    
    -- Contacto
    email           VARCHAR(255),
    phone           VARCHAR(30),
    address         TEXT,
    city            VARCHAR(100),
    
    -- Información médica básica
    blood_type      VARCHAR(5)      CHECK (blood_type IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    allergies       TEXT,
    emergency_contact_name  VARCHAR(200),
    emergency_contact_phone VARCHAR(30),
    
    -- Metadatos
    created_by      UUID            REFERENCES auth.users(id),
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE
);
