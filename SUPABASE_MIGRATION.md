# Supabase Migration Guide - UPDATED January 9, 2026

## Migration Progress Tracker

| Phase | Description | Status | Notes |
|-------|-------------|--------|-------|
| Phase 0 | Database Setup | ✅ COMPLETE | All 10 tables created with RLS policies |
| Phase 1 | User Settings & Auth | ✅ COMPLETE | Supabase auth working, users can log in |
| Phase 2 | Completed Tasks | ❌ NOT STARTED | Next priority |
| Phase 3 | Active Tasks | ✅ COMPLETE | Tasks save/load from Supabase with sync queue |
| Phase 4 | Neuro-Check & Daily Capacity | ❌ NOT STARTED | |
| Phase 5 | Override Log & Spoon Debt | ❌ NOT STARTED | |
| Phase 6 | Crisis Mode | ❌ NOT STARTED | |
| Phase 7 | Chat Messages & Patterns | ❌ NOT STARTED | |
| Phase 8 | Polish & Optimization | ❌ NOT STARTED | |

---

## ✅ Phase 0: Database Setup - COMPLETE

**What was done:**
- Created all database tables in Supabase
- Set up Row Level Security (RLS) policies
- Added indexes for performance
- Created automatic `updated_at` triggers

**Tables created:**
- `user_settings`
- `tasks`
- `completed_tasks`
- `neuro_check_history` (note: may be named `neuro_checks` in code)
- `override_log`
- `spoon_debt`
- `crisis_mode`
- `messages` (note: may be named `chat_messages` in code)
- `patterns`
- `daily_capacity`

**Supabase Project:** `cbeyohwwatpgzwbrhtxp`
**Dashboard:** https://app.supabase.com/project/cbeyohwwatpgzwbrhtxp

---

## ✅ Phase 1: User Settings & Auth - COMPLETE

**What was done:**
- Supabase authentication integrated
- Users can sign up and log in
- API key stored server-side (ANTHROPIC_API_KEY environment variable)
- Calendar input syncs to Supabase

**How it works:**
- API key: Server-side only, no user setup required
- User auth: Supabase handles login/signup
- Calendar input: Saved to both Supabase AND localStorage (backup)

---

## ✅ Phase 3: Active Tasks - COMPLETE

**What was done:**
- Created comprehensive helper functions in `supabase-settings.js`:
  - `getUserTasks()` - Fetch tasks from Supabase
  - `saveUserTask(task)` - Save/update task to Supabase
  - `updateUserTask(taskId, updates)` - Update existing task
  - `deleteUserTask(taskId)` - Delete task from Supabase
- Implemented **Option 1: Sync Queue** for offline reliability
- Updated `index.html` to use Supabase instead of localStorage
- Fixed all schema mismatches between code and database

**Sync Queue Features:**
- Operations queue when offline
- Auto-sync when back online
- Retry every 30 seconds
- localStorage backup always maintained

**Files modified:**
- `public/supabase-settings.js` - Added task helper functions
- `public/index.html` - Updated addTask(), deleteTask(), loadUserData()

---

## ❌ Phase 2: Completed Tasks - NOT STARTED

**Goal:** When a task is marked complete, save it to `completed_tasks` table

**Requirements:**
1. Check `completed_tasks` table schema in Supabase first
2. Create helper functions:
   - `getCompletedTasks()` - Fetch completed tasks
   - `saveCompletedTask(task)` - Save completed task
   - `deleteCompletedTask(taskId)` - Delete from history
3. Update task completion logic in `index.html`
4. Use same sync queue pattern as active tasks
5. Keep localStorage as backup

**Table:** `completed_tasks`

---

## ❌ Phase 4: Neuro-Check & Daily Capacity - NOT STARTED

**Goal:** Sync daily energy/mood check-ins to Supabase

**Requirements:**
1. Check `neuro_check_history` table schema (verify actual name)
2. Create helper functions:
   - `getNeuroChecks()` - Fetch check-in history
   - `saveNeuroCheck(checkData)` - Save daily check-in
   - `getTodayNeuroCheck()` - Get today's check-in
3. Update neuro-check UI logic in `index.html`
4. Sync daily capacity data

**Tables:** `neuro_check_history`, `daily_capacity`

---

## ❌ Phase 5: Override Log & Spoon Debt - NOT STARTED

**Goal:** Track when users push past their limits

**Requirements:**
1. Check table schemas: `override_log`, `spoon_debt`
2. Create helper functions for both tables
3. Update override tracking logic
4. Sync spoon debt calculations

**Tables:** `override_log`, `spoon_debt`

---

## ❌ Phase 6: Crisis Mode - NOT STARTED

**Goal:** Sync crisis mode state across devices

**Requirements:**
1. Check `crisis_mode` table schema
2. Create helper functions:
   - `getCrisisMode()` - Get current crisis state
   - `saveCrisisMode(state)` - Update crisis state
3. Update crisis mode toggle logic

**Table:** `crisis_mode`

---

## ❌ Phase 7: Chat Messages & Patterns - NOT STARTED

**Goal:** Sync AI chat history and detected patterns

**Requirements:**
1. Check table schemas: `messages`, `patterns`
2. Create helper functions for chat history
3. Create helper functions for patterns
4. Update chat and pattern detection logic

**Tables:** `messages`, `patterns`

---

## ❌ Phase 8: Polish & Optimization - NOT STARTED

**Goal:** Final cleanup and performance optimization

**Requirements:**
1. Remove all remaining localStorage-only code
2. Add loading states for Supabase operations
3. Improve error messages for users
4. Test all features end-to-end
5. Performance optimization
6. Update migration doc to reflect completion

---

## Development Notes

### Key Files
- `public/supabase-client.js` - REST API client for Supabase
- `public/supabase-settings.js` - Helper functions for all Supabase operations
- `public/auth.js` - Authentication logic
- `public/index.html` - Main app (React components)

### Important Lessons Learned
1. **Always check Supabase table schema first** before writing code
2. **Column names must match exactly** - we hit multiple schema mismatches
3. **Supabase v2 syntax** - Don't use `.execute()` on INSERT/UPDATE/DELETE
4. **Test in incognito** to avoid cached JavaScript issues

### Sync Queue Pattern (Option 1)
All Supabase operations should follow this pattern:
1. Try Supabase first
2. On failure, save to localStorage AND add to sync queue
3. On app load, process sync queue
4. Retry queued operations every 30 seconds
5. Sync immediately when connection restored

### URLs
- **Development Preview:** Check Replit webview
- **Production:** https://calmcommander-1-caroline70.replit.app/
- **Supabase Dashboard:** https://app.supabase.com/project/cbeyohwwatpgzwbrhtxp

---

## Estimated Remaining Time

| Phase | Estimate |
|-------|----------|
| Phase 2: Completed Tasks | 1-2 hours |
| Phase 4: Neuro-Check | 1-2 hours |
| Phase 5: Override Log & Spoon Debt | 1-2 hours |
| Phase 6: Crisis Mode | 30 min - 1 hour |
| Phase 7: Chat Messages & Patterns | 1-2 hours |
| Phase 8: Polish | 2-3 hours |

**Total Remaining:** ~8-12 hours of development time

---

*Last updated: January 9, 2026*