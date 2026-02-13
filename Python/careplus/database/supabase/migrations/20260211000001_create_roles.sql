-- ============================================
-- CarePlus - Roles y Permisos Base
-- ============================================

-- Rol para usuarios autenticados (Supabase lo gestiona automáticamente,
-- pero lo definimos explícitamente por claridad)

-- Dar permisos al rol authenticated sobre el schema public
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO authenticated;

-- Permisos por defecto para futuras tablas
ALTER DEFAULT PRIVILEGES IN SCHEMA public
    GRANT ALL ON TABLES TO authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
    GRANT ALL ON SEQUENCES TO authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
    GRANT ALL ON ROUTINES TO authenticated;

-- Dar permisos al rol anon (solo lectura limitada si se necesita en el futuro)
GRANT USAGE ON SCHEMA public TO anon;
