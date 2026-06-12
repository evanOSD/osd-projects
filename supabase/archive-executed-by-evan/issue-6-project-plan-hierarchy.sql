-- ==================================================
-- MIGRATION: PROJECT PLAN HIERARCHY (ISSUE #6)
-- ==================================================

-- 1. DROP TABEL LAMA (Data ujicoba dihapus)
DROP TABLE IF EXISTS project_yearly_capacity CASCADE;

-- 2. CREATE TABEL BARU: project_plans
CREATE TABLE project_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    fiscal_year INT NOT NULL,
    number_of_translators INT NOT NULL DEFAULT 0,
    team_verses_per_day NUMERIC NOT NULL DEFAULT 0,
    work_days_per_year INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (project_id, fiscal_year)
);

-- 3. ALTER TABEL: project_outcomes
-- Menghapus kolom lama jika diperlukan (opsional), dan menambahkan project_plan_id
ALTER TABLE project_outcomes
ADD COLUMN project_plan_id UUID REFERENCES project_plans(id) ON DELETE CASCADE,
ADD COLUMN year INT;

-- 4. ALTER TABEL: project_non_translation_goals
-- Pastikan project_outcome_id digunakan sebagai FK (kolom ini sudah ada, pastikan tidak dihapus)
-- Opsional: Jika ingin menambahkan constraint NOT NULL untuk memastikan hierarki
ALTER TABLE project_non_translation_goals
ALTER COLUMN project_outcome_id SET NOT NULL;

-- 5. ALTER TABEL: project_activities
-- Menambahkan output_goal_id
ALTER TABLE project_activities
ADD COLUMN output_goal_id UUID REFERENCES project_non_translation_goals(id) ON DELETE CASCADE;

-- 6. ALTER TABEL: project_translation_goals
-- Menghubungkan ke project_plans (opsional, karena saat ini terhubung ke project_language_id)
-- Menambahkan relasi ke project_plans
ALTER TABLE project_translation_goals
ADD COLUMN project_plan_id UUID REFERENCES project_plans(id) ON DELETE CASCADE;

-- 7. CREATE TABEL BARU: project_planning_stages
CREATE TABLE project_planning_stages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_plan_id UUID NOT NULL REFERENCES project_plans(id) ON DELETE CASCADE,
    step_id UUID NOT NULL REFERENCES steps(id) ON DELETE CASCADE,
    percentage NUMERIC NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. CREATE TABEL BARU: project_fiscal_breakdowns
CREATE TABLE project_fiscal_breakdowns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_plan_id UUID NOT NULL REFERENCES project_plans(id) ON DELETE CASCADE,
    fiscal_year INT NOT NULL,
    target_value NUMERIC NOT NULL DEFAULT 0,
    is_manual_override BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. CREATE TABEL BARU: project_schedules
CREATE TABLE project_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_plan_id UUID NOT NULL REFERENCES project_plans(id) ON DELETE CASCADE,
    start_date DATE,
    end_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Mengaktifkan RLS untuk tabel-tabel baru
ALTER TABLE project_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_planning_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_fiscal_breakdowns ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_schedules ENABLE ROW LEVEL SECURITY;

-- Contoh Policy (Sesuaikan dengan kebutuhan)
CREATE POLICY "Enable ALL for authenticated users" ON project_plans FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Enable ALL for authenticated users" ON project_planning_stages FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Enable ALL for authenticated users" ON project_fiscal_breakdowns FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Enable ALL for authenticated users" ON project_schedules FOR ALL TO authenticated USING (true) WITH CHECK (true);
