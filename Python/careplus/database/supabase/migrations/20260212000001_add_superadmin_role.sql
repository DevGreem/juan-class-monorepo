-- ============================================
-- CarePlus - Agregar rol de Superadmin
-- ============================================

INSERT INTO roles (id, name, description, can_manage_users, can_manage_patients, can_manage_consultations, can_manage_diagnostics, can_manage_treatments)
VALUES
    ('00000000-0000-0000-0000-000000000050', 'superadmin', 'Superadministrador con control total del sistema', TRUE, TRUE, TRUE, TRUE, TRUE)
ON CONFLICT (name) DO NOTHING;
