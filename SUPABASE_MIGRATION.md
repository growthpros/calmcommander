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

- [x] **Phase 0:** Database Setup ✅
- [x] **Phase 1:** User Settings & API Key ✅ (NEEDS TESTING)
- [ ] **Phase 2:** Completed Tasks & Billing (2 days)
- [ ] **Phase 3:** Active Tasks (3 days) **CRITICAL**
- [ ] **Phase 4:** Neuro-Check & Daily Capacity (2 days)
- [ ] **Phase 5:** Override Log & Spoon Debt (2 days)
- [ ] **Phase 6:** Crisis Mode (1 day)
- [ ] **Phase 7:** Chat Messages & Patterns (1 day)
- [ ] **Phase 8:** Polish & Optimization (2 days)

**Current Status:** Phase 1 complete - needs testing before Phase 2
**Estimated Completion:** 15-20 days

---

## Phase 1 Complete! ✅

**What was migrated:**
- API key storage
- Calendar input storage
- User preferences structure

**What's still in localStorage:**
- Tasks (active & completed)
- Neuro-checks
- Override log
- Spoon debt
- Crisis mode
- Chat messages

**How it works:**
- When user logs in → localStorage data auto-migrates to Supabase
- When user saves API key or calendar → Saved to both Supabase AND localStorage (backup)
- If Supabase fails → Falls back to localStorage automatically
- If offline → Uses localStorage, syncs to Supabase when online

---

## Testing Phase 1 (REQUIRED before Phase 2)

### Test 1: New User Sign Up
1. Open app in browser
2. Sign up with new account
3. Enter API key
4. Enter calendar input (e.g., "2h meeting")
5. **Check Supabase:** Table Editor → user_settings → Should see your API key and calendar

### Test 2: Cross-Device Sync
1. Log in on Device 1 (computer)
2. Enter API key "test-key-123"
3. Enter calendar input "1h call"
4. Log in on Device 2 (phone/another browser)
5. **Expected:** API key and calendar should load automatically

### Test 3: localStorage Migration
1. Before logging in, manually add to localStorage:
   ```javascript
   localStorage.setItem('calmCommanderApiKey', 'old-key-from-local');
   localStorage.setItem('ccCalendarInput', JSON.stringify({date: new Date().toDateString(), input: '3h meeting'}));
   ```
2. Log in with Supabase account
3. Check browser console → Should see "✅ Successfully migrated localStorage data to Supabase"
4. **Check Supabase:** user_settings table should have the old data

### Test 4: Offline Fallback
1. Log in normally
2. Open DevTools → Network tab → Set to "Offline"
3. Refresh page
4. **Expected:** App loads API key from localStorage, no errors
5. Go back online
6. **Expected:** Next save syncs to Supabase

### Test 5: Error Handling
1. Log in normally
2. Open DevTools → Console
3. Check for errors
4. **Expected:** No errors, only success messages

### Success Criteria
- ✅ API key persists across devices
- ✅ Calendar input persists across devices
- ✅ localStorage data migrates on first login
- ✅ Works offline (loads from localStorage)
- ✅ No console errors
- ✅ Data visible in Supabase Table Editor

**If ALL tests pass → Proceed to Phase 2**
**If ANY test fails → Report issue, fix before continuing**
