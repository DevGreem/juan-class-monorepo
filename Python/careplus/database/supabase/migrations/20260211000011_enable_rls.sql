-- ============================================
-- CarePlus - Row Level Security (RLS)
-- ============================================

-- Habilitar RLS en todas las tablas
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnostics ENABLE ROW LEVEL SECURITY;
ALTER TABLE treatments ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Políticas: Pacientes
-- ============================================
DROP POLICY IF EXISTS "Authenticated users can read patients" ON patients;
CREATE POLICY "Authenticated users can read patients"
    ON patients FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert patients" ON patients;
CREATE POLICY "Authenticated users can insert patients"
    ON patients FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update patients" ON patients;
CREATE POLICY "Authenticated users can update patients"
    ON patients FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can delete patients" ON patients;
CREATE POLICY "Authenticated users can delete patients"
    ON patients FOR DELETE TO authenticated USING (true);

-- ============================================
-- Políticas: Consultas
-- ============================================
DROP POLICY IF EXISTS "Authenticated users can read consultations" ON consultations;
CREATE POLICY "Authenticated users can read consultations"
    ON consultations FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert consultations" ON consultations;
CREATE POLICY "Authenticated users can insert consultations"
    ON consultations FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update consultations" ON consultations;
CREATE POLICY "Authenticated users can update consultations"
    ON consultations FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can delete consultations" ON consultations;
CREATE POLICY "Authenticated users can delete consultations"
    ON consultations FOR DELETE TO authenticated USING (true);

-- ============================================
-- Políticas: Diagnósticos
-- ============================================
DROP POLICY IF EXISTS "Authenticated users can read diagnostics" ON diagnostics;
CREATE POLICY "Authenticated users can read diagnostics"
    ON diagnostics FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert diagnostics" ON diagnostics;
CREATE POLICY "Authenticated users can insert diagnostics"
    ON diagnostics FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update diagnostics" ON diagnostics;
CREATE POLICY "Authenticated users can update diagnostics"
    ON diagnostics FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can delete diagnostics" ON diagnostics;
CREATE POLICY "Authenticated users can delete diagnostics"
    ON diagnostics FOR DELETE TO authenticated USING (true);

-- ============================================
-- Políticas: Tratamientos
-- ============================================
DROP POLICY IF EXISTS "Authenticated users can read treatments" ON treatments;
CREATE POLICY "Authenticated users can read treatments"
    ON treatments FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert treatments" ON treatments;
CREATE POLICY "Authenticated users can insert treatments"
    ON treatments FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update treatments" ON treatments;
CREATE POLICY "Authenticated users can update treatments"
    ON treatments FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can delete treatments" ON treatments;
CREATE POLICY "Authenticated users can delete treatments"
    ON treatments FOR DELETE TO authenticated USING (true);

-- ============================================
-- Políticas: Historial Médico
-- ============================================
DROP POLICY IF EXISTS "Authenticated users can read medical_history" ON medical_history;
CREATE POLICY "Authenticated users can read medical_history"
    ON medical_history FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert medical_history" ON medical_history;
CREATE POLICY "Authenticated users can insert medical_history"
    ON medical_history FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update medical_history" ON medical_history;
CREATE POLICY "Authenticated users can update medical_history"
    ON medical_history FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can delete medical_history" ON medical_history;
CREATE POLICY "Authenticated users can delete medical_history"
    ON medical_history FOR DELETE TO authenticated USING (true);

-- ============================================
-- Políticas: Roles
-- ============================================
DROP POLICY IF EXISTS "Authenticated users can read roles" ON roles;
CREATE POLICY "Authenticated users can read roles"
    ON roles FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert roles" ON roles;
CREATE POLICY "Authenticated users can insert roles"
    ON roles FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update roles" ON roles;
CREATE POLICY "Authenticated users can update roles"
    ON roles FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can delete roles" ON roles;
CREATE POLICY "Authenticated users can delete roles"
    ON roles FOR DELETE TO authenticated USING (true);

-- ============================================
-- Políticas: Roles de Usuario
-- ============================================
DROP POLICY IF EXISTS "Authenticated users can read user_roles" ON user_roles;
CREATE POLICY "Authenticated users can read user_roles"
    ON user_roles FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert user_roles" ON user_roles;
CREATE POLICY "Authenticated users can insert user_roles"
    ON user_roles FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update user_roles" ON user_roles;
CREATE POLICY "Authenticated users can update user_roles"
    ON user_roles FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can delete user_roles" ON user_roles;
CREATE POLICY "Authenticated users can delete user_roles"
    ON user_roles FOR DELETE TO authenticated USING (true);
