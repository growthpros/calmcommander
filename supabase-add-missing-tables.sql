-- ============================================
-- ADD MISSING TABLES TO EXISTING SUPABASE SCHEMA
-- ============================================
-- Run this in your Supabase SQL Editor
-- This adds only the tables that are missing from your existing schema

-- ============================================
-- 1. OVERRIDE LOG TABLE
-- ============================================
-- Critical for tracking weekly override limits and burnout prevention
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
-- 2. PATTERNS TABLE
-- ============================================
-- For pattern detection and behavioral insights
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

-- Create trigger for patterns updated_at
CREATE TRIGGER update_patterns_updated_at BEFORE UPDATE ON patterns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- COMPLETE!
-- ============================================
-- You should now have 10 tables total:
-- 1. user_settings (existing)
-- 2. tasks (existing)
-- 3. completed_tasks (existing)
-- 4. neuro_check_history (existing)
-- 5. messages (existing)
-- 6. spoon_debt (existing)
-- 7. crisis_mode (existing)
-- 8. daily_capacity (existing)
-- 9. override_log (NEW - just added)
-- 10. patterns (NEW - just added)

-- Next: Ready for Phase 1 - User Settings Migration!
