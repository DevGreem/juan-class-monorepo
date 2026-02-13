-- ============================================
-- CarePlus - Datos de Prueba (Seed)
-- ============================================

-- ============================================
-- Usuarios y Roles (Supabase Auth)
-- ============================================
-- Contraseña para todos los usuarios de prueba: Password123!

-- Admin
INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    'a1b2c3d4-0000-0000-0000-000000000001',
    'authenticated', 'authenticated',
    'admin@careplus.com',
    extensions.crypt('Password123!', extensions.gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Carlos Administrador"}',
    NOW(), NOW(), '', '', '', ''
);

INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    'a1b2c3d4-0000-0000-0000-000000000001',
    '{"sub":"a1b2c3d4-0000-0000-0000-000000000001","email":"admin@careplus.com"}',
    'email', 'a1b2c3d4-0000-0000-0000-000000000001',
    NOW(), NOW(), NOW()
);

-- Médico 1
INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    'a1b2c3d4-0000-0000-0000-000000000002',
    'authenticated', 'authenticated',
    'dr.ramirez@careplus.com',
    extensions.crypt('Password123!', extensions.gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Dr. Luis Ramírez"}',
    NOW(), NOW(), '', '', '', ''
);

INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    'a1b2c3d4-0000-0000-0000-000000000002',
    '{"sub":"a1b2c3d4-0000-0000-0000-000000000002","email":"dr.ramirez@careplus.com"}',
    'email', 'a1b2c3d4-0000-0000-0000-000000000002',
    NOW(), NOW(), NOW()
);

-- Médico 2
INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    'a1b2c3d4-0000-0000-0000-000000000003',
    'authenticated', 'authenticated',
    'dra.santos@careplus.com',
    extensions.crypt('Password123!', extensions.gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Dra. María Santos"}',
    NOW(), NOW(), '', '', '', ''
);

INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    'a1b2c3d4-0000-0000-0000-000000000003',
    '{"sub":"a1b2c3d4-0000-0000-0000-000000000003","email":"dra.santos@careplus.com"}',
    'email', 'a1b2c3d4-0000-0000-0000-000000000003',
    NOW(), NOW(), NOW()
);

-- Enfermero/a
INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    'a1b2c3d4-0000-0000-0000-000000000004',
    'authenticated', 'authenticated',
    'enf.lopez@careplus.com',
    extensions.crypt('Password123!', extensions.gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Rosa López"}',
    NOW(), NOW(), '', '', '', ''
);

INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    'a1b2c3d4-0000-0000-0000-000000000004',
    '{"sub":"a1b2c3d4-0000-0000-0000-000000000004","email":"enf.lopez@careplus.com"}',
    'email', 'a1b2c3d4-0000-0000-0000-000000000004',
    NOW(), NOW(), NOW()
);

-- ============================================
-- Asignación de Roles (tabla roles + user_roles)
-- ============================================

-- Insertar roles disponibles en el sistema
INSERT INTO roles (id, name, description, can_manage_users, can_manage_patients, can_manage_consultations, can_manage_diagnostics, can_manage_treatments)
VALUES
    ('00000000-0000-0000-0000-000000000010', 'admin',         'Administrador del sistema con acceso total',         TRUE,  TRUE, TRUE, TRUE, TRUE),
    ('00000000-0000-0000-0000-000000000020', 'medico',        'Médico con acceso a gestión clínica completa',       FALSE, TRUE, TRUE, TRUE, TRUE),
    ('00000000-0000-0000-0000-000000000030', 'enfermero',     'Enfermero/a con acceso a consultas y tratamientos',  FALSE, TRUE, TRUE, FALSE, TRUE),
    ('00000000-0000-0000-0000-000000000040', 'recepcionista', 'Recepcionista con acceso a pacientes y citas',       FALSE, TRUE, TRUE, FALSE, FALSE);

-- Asignar roles a los usuarios
INSERT INTO user_roles (user_id, role_id, full_name, specialty, license_number, phone)
VALUES
    ('a1b2c3d4-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', 'Carlos Administrador', NULL, NULL, '809-555-9001'),
    ('a1b2c3d4-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000020', 'Dr. Luis Ramírez', 'Medicina General', 'MED-2024-001', '809-555-9002'),
    ('a1b2c3d4-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000020', 'Dra. María Santos', 'Gastroenterología', 'MED-2024-002', '809-555-9003'),
    ('a1b2c3d4-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000030', 'Rosa López', 'Enfermería General', 'ENF-2024-001', '809-555-9004');

-- ============================================
-- Datos Clínicos
-- ============================================

-- Paciente de ejemplo 1
INSERT INTO patients (first_name, last_name, date_of_birth, gender, document_type, document_number, email, phone, address, city, blood_type, allergies, emergency_contact_name, emergency_contact_phone, created_by)
VALUES
    ('Juan', 'García López', '1985-03-15', 'masculino', 'cedula', '001-1234567-8', 'juan.garcia@email.com', '809-555-0101', 'Calle Principal #45', 'Santo Domingo', 'O+', 'Penicilina', 'María López', '809-555-0102', 'a1b2c3d4-0000-0000-0000-000000000002'),
    ('Ana', 'Martínez Ruiz', '1990-07-22', 'femenino', 'cedula', '002-7654321-0', 'ana.martinez@email.com', '809-555-0201', 'Av. Independencia #120', 'Santiago', 'A+', NULL, 'Pedro Martínez', '809-555-0202', 'a1b2c3d4-0000-0000-0000-000000000002'),
    ('Carlos', 'Rodríguez Peña', '1978-11-05', 'masculino', 'pasaporte', 'PA1234567', 'carlos.rodriguez@email.com', '809-555-0301', 'Calle Las Flores #78', 'La Vega', 'B-', 'Aspirina, Mariscos', 'Laura Peña', '809-555-0302', 'a1b2c3d4-0000-0000-0000-000000000003');

-- Consultas de ejemplo
INSERT INTO consultations (patient_id, reason, symptoms, notes, weight_kg, height_cm, blood_pressure, heart_rate, temperature_c, status)
SELECT 
    p.id,
    'Chequeo general de rutina',
    'Dolor de cabeza leve, fatiga',
    'Paciente en buen estado general. Se recomienda descanso y seguimiento.',
    78.5, 175.0, '120/80', 72, 36.5,
    'completada'
FROM patients p WHERE p.document_number = '001-1234567-8';

INSERT INTO consultations (patient_id, reason, symptoms, notes, weight_kg, height_cm, blood_pressure, heart_rate, temperature_c, status)
SELECT 
    p.id,
    'Dolor abdominal persistente',
    'Dolor en zona epigástrica, náuseas',
    'Se solicitan estudios de laboratorio y ecografía abdominal.',
    62.0, 163.0, '110/70', 68, 36.8,
    'completada'
FROM patients p WHERE p.document_number = '002-7654321-0';

-- Diagnósticos de ejemplo
INSERT INTO diagnostics (patient_id, consultation_id, code, name, description, severity, diagnosis_type)
SELECT 
    p.id,
    c.id,
    'R51',
    'Cefalea tensional',
    'Cefalea de tipo tensional episódica. Sin signos de alarma.',
    'leve',
    'definitivo'
FROM patients p
JOIN consultations c ON c.patient_id = p.id
WHERE p.document_number = '001-1234567-8';

INSERT INTO diagnostics (patient_id, consultation_id, code, name, description, severity, diagnosis_type)
SELECT 
    p.id,
    c.id,
    'K29.7',
    'Gastritis no especificada',
    'Inflamación de la mucosa gástrica. Pendiente confirmación con endoscopia.',
    'moderado',
    'presuntivo'
FROM patients p
JOIN consultations c ON c.patient_id = p.id
WHERE p.document_number = '002-7654321-0';

-- Tratamientos de ejemplo
INSERT INTO treatments (patient_id, diagnostic_id, consultation_id, name, description, treatment_type, dosage, frequency, duration, status)
SELECT 
    p.id,
    d.id,
    c.id,
    'Acetaminofén',
    'Analgésico para el manejo del dolor de cabeza',
    'medicamento',
    '500mg',
    'Cada 8 horas',
    '5 días',
    'activo'
FROM patients p
JOIN consultations c ON c.patient_id = p.id
JOIN diagnostics d ON d.consultation_id = c.id
WHERE p.document_number = '001-1234567-8';

INSERT INTO treatments (patient_id, diagnostic_id, consultation_id, name, description, treatment_type, dosage, frequency, duration, status)
SELECT 
    p.id,
    d.id,
    c.id,
    'Omeprazol',
    'Inhibidor de bomba de protones para protección gástrica',
    'medicamento',
    '20mg',
    'Una vez al día en ayunas',
    '14 días',
    'activo'
FROM patients p
JOIN consultations c ON c.patient_id = p.id
JOIN diagnostics d ON d.consultation_id = c.id
WHERE p.document_number = '002-7654321-0';

-- Historial médico de ejemplo
INSERT INTO medical_history (patient_id, consultation_id, diagnostic_id, treatment_id, event_type, title, description)
SELECT 
    p.id,
    c.id,
    d.id,
    t.id,
    'consulta',
    'Consulta por cefalea tensional',
    'Paciente acude por dolor de cabeza. Se diagnostica cefalea tensional y se indica tratamiento con Acetaminofén.'
FROM patients p
JOIN consultations c ON c.patient_id = p.id
JOIN diagnostics d ON d.consultation_id = c.id
JOIN treatments t ON t.diagnostic_id = d.id
WHERE p.document_number = '001-1234567-8';

INSERT INTO medical_history (patient_id, consultation_id, diagnostic_id, treatment_id, event_type, title, description)
SELECT 
    p.id,
    c.id,
    d.id,
    t.id,
    'consulta',
    'Consulta por dolor abdominal - Gastritis',
    'Paciente presenta dolor epigástrico. Diagnóstico presuntivo de gastritis. Se inicia tratamiento con Omeprazol.'
FROM patients p
JOIN consultations c ON c.patient_id = p.id
JOIN diagnostics d ON d.consultation_id = c.id
JOIN treatments t ON t.diagnostic_id = d.id
WHERE p.document_number = '002-7654321-0';
