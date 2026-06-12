-- ==================================================
-- MIGRATION: REFACTOR PLANNING STAGES (ISSUE #6 Lanjutan)
-- ==================================================

-- 1. DROP TABEL LAMA (Karena data dummy boleh dihapus)
DROP TABLE IF EXISTS project_planning_stages CASCADE;

-- 2. CREATE TABEL BARU: project_planning_stages
-- Menggunakan translation_goal_id alih-alih project_plan_id
CREATE TABLE project_planning_stages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    translation_goal_id UUID NOT NULL REFERENCES project_translation_goals(id) ON DELETE CASCADE,
    step_id UUID NOT NULL REFERENCES steps(id) ON DELETE CASCADE,
    percentage NUMERIC NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    -- Memastikan tidak ada duplikasi step untuk satu kitab yang sama
    UNIQUE (translation_goal_id, step_id)
);

-- 3. Mengaktifkan RLS untuk tabel baru
ALTER TABLE project_planning_stages ENABLE ROW LEVEL SECURITY;

-- 4. Policy (Sesuaikan dengan kebutuhan, untuk sementara ALL untuk authenticated)
CREATE POLICY "Enable ALL for authenticated users" ON project_planning_stages FOR ALL TO authenticated USING (true) WITH CHECK (true);
