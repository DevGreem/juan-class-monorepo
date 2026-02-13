-- ============================================
-- CarePlus - Tabla de Roles
-- ============================================

CREATE TABLE IF NOT EXISTS roles (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Datos del rol
    name        VARCHAR(30)     NOT NULL UNIQUE,
    description VARCHAR(255),
    
    -- Permisos generales del rol
    can_manage_users    BOOLEAN NOT NULL DEFAULT FALSE,
    can_manage_patients BOOLEAN NOT NULL DEFAULT TRUE,
    can_manage_consultations BOOLEAN NOT NULL DEFAULT TRUE,
    can_manage_diagnostics   BOOLEAN NOT NULL DEFAULT TRUE,
    can_manage_treatments    BOOLEAN NOT NULL DEFAULT TRUE,
    
    -- Estado
    is_active   BOOLEAN         NOT NULL DEFAULT TRUE,
    
    -- Metadatos
    created_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);
