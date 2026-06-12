-- ==========================================
-- MIGRATION: RESTRIKTURISASI PROJECT MEMBERS
-- ==========================================

-- 1. Buat tipe Enum baru untuk peran proyek
CREATE TYPE project_role AS ENUM ('project_manager', 'field_coordinator', 'cluster_leader', 'language_facilitator');

-- 2. Buat tabel project_members
CREATE TABLE project_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role project_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (project_id, user_id, role)
);

-- 3. Aktifkan Row Level Security (RLS)
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;

-- 4. Buat RLS Policies
-- Kebijakan Membaca (Read) - Semua user terautentikasi dapat membaca anggota proyek
CREATE POLICY "Enable read access for authenticated users"
ON project_members
FOR SELECT
TO authenticated
USING (true);

-- Kebijakan Menulis (Insert/Update/Delete) - Semua user terautentikasi dapat mengelola anggota proyek
CREATE POLICY "Enable write access for authenticated users"
ON project_members
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 5. Migrasi Data dari tabel lama `project_managers` ke `project_members`
INSERT INTO project_members (project_id, user_id, role)
SELECT project_id, user_id, 'project_manager'::project_role
FROM project_managers
ON CONFLICT (project_id, user_id, role) DO NOTHING;

-- 6. Hapus tabel pivot lama `project_managers`
DROP TABLE IF EXISTS project_managers;

-- 7. Hapus kolom statis (teks) dari tabel `projects`
ALTER TABLE projects DROP COLUMN IF EXISTS field_coordinator;
ALTER TABLE projects DROP COLUMN IF EXISTS cluster_leader;
