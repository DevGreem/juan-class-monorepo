-- ============================================
-- CarePlus - Tabla de Códigos de Verificación (2FA)
-- ============================================

CREATE TABLE IF NOT EXISTS verification_codes (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Usuario que solicita la verificación
    user_id     UUID            NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    email       VARCHAR(255)    NOT NULL,
    
    -- Código OTP
    code        VARCHAR(6)      NOT NULL,
    
    -- Token de sesión almacenado temporalmente hasta verificar OTP
    access_token TEXT           NOT NULL,
    
    -- Control de expiración y uso
    expires_at  TIMESTAMPTZ     NOT NULL,
    used        BOOLEAN         NOT NULL DEFAULT FALSE,
    attempts    INT             NOT NULL DEFAULT 0,
    max_attempts INT            NOT NULL DEFAULT 5,
    
    -- Metadatos
    created_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- Índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_verification_codes_user_id ON verification_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_verification_codes_email ON verification_codes(email);
CREATE INDEX IF NOT EXISTS idx_verification_codes_expires ON verification_codes(expires_at);

-- Limpiar códigos expirados automáticamente (función + trigger)
CREATE OR REPLACE FUNCTION cleanup_expired_verification_codes()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM verification_codes
    WHERE expires_at < NOW() OR used = TRUE;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_cleanup_verification_codes ON verification_codes;
CREATE TRIGGER trg_cleanup_verification_codes
    AFTER INSERT ON verification_codes
    FOR EACH STATEMENT EXECUTE FUNCTION cleanup_expired_verification_codes();

-- ============================================
-- RLS para Códigos de Verificación
-- ============================================
ALTER TABLE verification_codes ENABLE ROW LEVEL SECURITY;

-- Usuarios autenticados pueden gestionar sus propios códigos
DROP POLICY IF EXISTS "Users can read own verification codes" ON verification_codes;
CREATE POLICY "Users can read own verification codes"
    ON verification_codes FOR SELECT TO authenticated
    USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert own verification codes" ON verification_codes;
CREATE POLICY "Users can insert own verification codes"
    ON verification_codes FOR INSERT TO authenticated
    WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update own verification codes" ON verification_codes;
CREATE POLICY "Users can update own verification codes"
    ON verification_codes FOR UPDATE TO authenticated
    USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Acceso anónimo para el paso de verificación OTP
-- (el frontend aún no tiene el token, usa el anon key)
DROP POLICY IF EXISTS "Anon can read verification codes" ON verification_codes;
CREATE POLICY "Anon can read verification codes"
    ON verification_codes FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Anon can update verification codes" ON verification_codes;
CREATE POLICY "Anon can update verification codes"
    ON verification_codes FOR UPDATE TO anon USING (true) WITH CHECK (true);
