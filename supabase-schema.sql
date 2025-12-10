-- ============================================
-- CALM COMMANDER - SUPABASE DATABASE SCHEMA
-- ============================================
-- Run this in your Supabase SQL Editor
-- This creates all tables and Row Level Security policies

-- ============================================
-- 1. USER SETTINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS user_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    api_key TEXT,
    calendar_input JSONB DEFAULT '[]'::jsonb,
    preferences JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- RLS Policies for user_settings
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own settings"
    ON user_settings FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings"
    ON user_settings FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings"
    ON user_settings FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own settings"
    ON user_settings FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- 2. TASKS TABLE (Active Tasks)
-- ============================================
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    category TEXT DEFAULT 'today',
    energy_level INTEGER DEFAULT 2,
    spoon_cost INTEGER DEFAULT 2,
    urgency TEXT DEFAULT 'normal',
    focus_level TEXT DEFAULT 'medium',
    due_date DATE,
    waiting_for TEXT,
    time_estimate_hours NUMERIC(5,2),
    time_estimate_minutes INTEGER,
    client TEXT,
    billable BOOLEAN DEFAULT false,
    parent_task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    notes TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_category ON tasks(user_id, category);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(user_id, due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_parent ON tasks(parent_task_id);

-- RLS Policies for tasks
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tasks"
    ON tasks FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tasks"
    ON tasks FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks"
    ON tasks FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks"
    ON tasks FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- 3. COMPLETED TASKS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS completed_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    category TEXT,
    energy_level INTEGER,
    spoon_cost INTEGER,
    urgency TEXT,
    focus_level TEXT,
    time_estimate_hours NUMERIC(5,2),
    time_estimate_minutes INTEGER,
    client TEXT,
    billable BOOLEAN DEFAULT false,
    completion_date DATE NOT NULL,
    completion_time TIMESTAMPTZ DEFAULT NOW(),
    task_data JSONB, -- Store full original task data
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_completed_tasks_user_id ON completed_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_completed_tasks_date ON completed_tasks(user_id, completion_date);
CREATE INDEX IF NOT EXISTS idx_completed_tasks_client ON completed_tasks(user_id, client, billable);

-- RLS Policies for completed_tasks
ALTER TABLE completed_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own completed tasks"
    ON completed_tasks FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own completed tasks"
    ON completed_tasks FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own completed tasks"
    ON completed_tasks FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own completed tasks"
    ON completed_tasks FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- 4. NEURO CHECKS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS neuro_checks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    check_date DATE NOT NULL,
    mood INTEGER NOT NULL CHECK (mood >= 1 AND mood <= 5),
    sleep INTEGER NOT NULL CHECK (sleep >= 1 AND sleep <= 5),
    energy INTEGER NOT NULL CHECK (energy >= 1 AND energy <= 5),
    brain_mode TEXT NOT NULL CHECK (brain_mode IN ('adhd', 'autism', 'balanced')),
    burnout_indicators JSONB DEFAULT '[]'::jsonb,
    quick_boosters JSONB DEFAULT '{}'::jsonb,
    daily_capacity INTEGER,
    spoons_remaining INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, check_date)
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_neuro_checks_user_date ON neuro_checks(user_id, check_date DESC);

-- RLS Policies for neuro_checks
ALTER TABLE neuro_checks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own neuro checks"
    ON neuro_checks FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own neuro checks"
    ON neuro_checks FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own neuro checks"
    ON neuro_checks FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own neuro checks"
    ON neuro_checks FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- 5. OVERRIDE LOG TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS override_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    override_date DATE NOT NULL,
    override_time TIMESTAMPTZ DEFAULT NOW(),
    task_title TEXT NOT NULL,
    spoon_cost INTEGER NOT NULL,
    reason TEXT NOT NULL,
    texted_accountability BOOLEAN DEFAULT false,
    week_start DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_override_log_user_week ON override_log(user_id, week_start DESC);
CREATE INDEX IF NOT EXISTS idx_override_log_user_date ON override_log(user_id, override_date DESC);

-- RLS Policies for override_log
ALTER TABLE override_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own override log"
    ON override_log FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own override log"
    ON override_log FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own override log"
    ON override_log FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- 6. SPOON DEBT TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS spoon_debt (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    debt_date DATE NOT NULL,
    debt_amount INTEGER NOT NULL DEFAULT 0,
    consecutive_days INTEGER DEFAULT 0,
    alert_level TEXT CHECK (alert_level IN ('none', '48hour', '5day')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, debt_date)
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_spoon_debt_user_date ON spoon_debt(user_id, debt_date DESC);

-- RLS Policies for spoon_debt
ALTER TABLE spoon_debt ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own spoon debt"
    ON spoon_debt FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own spoon debt"
    ON spoon_debt FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own spoon debt"
    ON spoon_debt FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own spoon debt"
    ON spoon_debt FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- 7. CRISIS MODE TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS crisis_mode (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    is_active BOOLEAN DEFAULT false,
    reason TEXT,
    started_at TIMESTAMPTZ,
    ends_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- RLS Policies for crisis_mode
ALTER TABLE crisis_mode ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own crisis mode"
    ON crisis_mode FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own crisis mode"
    ON crisis_mode FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own crisis mode"
    ON crisis_mode FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own crisis mode"
    ON crisis_mode FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- 8. CHAT MESSAGES TABLE (Optional - for AI chat history)
-- ============================================
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_chat_messages_user ON chat_messages(user_id, created_at DESC);

-- RLS Policies for chat_messages
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own chat messages"
    ON chat_messages FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chat messages"
    ON chat_messages FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own chat messages"
    ON chat_messages FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- 9. PATTERNS TABLE (Optional - for pattern detection)
-- ============================================
CREATE TABLE IF NOT EXISTS patterns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    pattern_type TEXT NOT NULL,
    pattern_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies for patterns
ALTER TABLE patterns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own patterns"
    ON patterns FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own patterns"
    ON patterns FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own patterns"
    ON patterns FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own patterns"
    ON patterns FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to all relevant tables
CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_completed_tasks_updated_at BEFORE UPDATE ON completed_tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_neuro_checks_updated_at BEFORE UPDATE ON neuro_checks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_spoon_debt_updated_at BEFORE UPDATE ON spoon_debt
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_crisis_mode_updated_at BEFORE UPDATE ON crisis_mode
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patterns_updated_at BEFORE UPDATE ON patterns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SCHEMA COMPLETE
-- ============================================
-- Next steps:
-- 1. Run this script in your Supabase SQL Editor
-- 2. Verify all tables were created (check Tables in dashboard)
-- 3. Test RLS policies by creating a test user and trying to access data
-- 4. Ready for Phase 1 migration!
