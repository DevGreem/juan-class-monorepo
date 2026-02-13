-- ============================================
-- CarePlus - Tabla de Roles de Usuario
-- ============================================

CREATE TABLE IF NOT EXISTS user_roles (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Relación con auth.users
    user_id     UUID            NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Relación con la tabla de roles
    role_id     UUID            NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
    
    -- Datos adicionales del perfil
    full_name   VARCHAR(200)    NOT NULL,
    specialty   VARCHAR(100),
    license_number VARCHAR(50),
    phone       VARCHAR(30),
    
    -- Estado
    is_active   BOOLEAN         NOT NULL DEFAULT TRUE,
    
    -- Metadatos
    created_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON user_roles(role_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
