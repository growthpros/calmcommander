# Supabase Migration Guide - Phase 0

## Phase 0: Database Setup (CURRENT)

### Step 1: Run the SQL Schema

1. Go to your Supabase dashboard: https://app.supabase.com
2. Select your project: `cbeyohwwatpgzwbrhtxp`
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy the contents of `supabase-schema.sql` and paste into the editor
6. Click **Run** (or press Cmd/Ctrl + Enter)

### Step 2: Verify Tables Were Created

1. Click **Table Editor** in the left sidebar
2. You should see these 9 tables:
   - `user_settings`
   - `tasks`
   - `completed_tasks`
   - `neuro_checks`
   - `override_log`
   - `spoon_debt`
   - `crisis_mode`
   - `chat_messages`
   - `patterns`

### Step 3: Test Row Level Security

1. The app is already configured with RLS policies
2. Each user can only see/edit their own data
3. No additional configuration needed

### Step 4: Verify Supabase Connection

1. Open the app in your browser
2. Open browser console (F12)
3. Look for these messages:
   ```
   ✅ Supabase REST client initialized: https://cbeyohwwatpgzwbrhtxp.supabase.co
   ✅ Supabase auth initialized
   🚀 USE_SUPABASE: true
   ```

## Phase 0 Complete! ✅

**What we did:**
- Created 9 database tables
- Set up Row Level Security (RLS) policies
- Added indexes for performance
- Created automatic `updated_at` triggers
- Everything still using localStorage (nothing breaks)

**Next:** Phase 1 - Migrate User Settings & API Key

---

## Migration Progress Tracker

- [x] **Phase 0:** Database Setup
- [ ] **Phase 1:** User Settings & API Key (2-3 days)
- [ ] **Phase 2:** Completed Tasks & Billing (2 days)
- [ ] **Phase 3:** Active Tasks (3 days) **CRITICAL**
- [ ] **Phase 4:** Neuro-Check & Daily Capacity (2 days)
- [ ] **Phase 5:** Override Log & Spoon Debt (2 days)
- [ ] **Phase 6:** Crisis Mode (1 day)
- [ ] **Phase 7:** Chat Messages & Patterns (1 day)
- [ ] **Phase 8:** Polish & Optimization (2 days)

**Current Status:** Ready to start Phase 1
**Estimated Completion:** 15-20 days
