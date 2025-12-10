// ============================================
// SUPABASE USER SETTINGS HELPERS
// ============================================
// Phase 1: Migrate API key, calendar input, and preferences to Supabase

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get user settings from Supabase
 * Falls back to localStorage if offline or error occurs
 * NOTE: API key is now server-side only, not stored per-user
 */
async function getUserSettings() {
    if (!window.USE_SUPABASE || !window.supabaseClient || !window.supabaseClient.authToken) {
        // Not using Supabase or not authenticated - use localStorage
        return {
            calendarInput: JSON.parse(localStorage.getItem('ccCalendarInput') || '[]'),
            preferences: {}
        };
    }

    try {
        const userId = await getCurrentUserId();
        if (!userId) {
            throw new Error('No user ID available');
        }

        // Query user_settings table
        const settings = await window.supabaseClient
            .from('user_settings')
            .select('*')
            .eq('user_id', userId)
            .execute();

        if (settings && settings.length > 0) {
            const userSettings = settings[0];
            return {
                calendarInput: userSettings.calendar_input || [],
                preferences: userSettings.preferences || {}
            };
        } else {
            // No settings found - return defaults
            return {
                calendarInput: [],
                preferences: {}
            };
        }
    } catch (error) {
        console.error('Error loading settings from Supabase, using localStorage:', error);
        // Fallback to localStorage
        return {
            calendarInput: JSON.parse(localStorage.getItem('ccCalendarInput') || '[]'),
            preferences: {}
        };
    }
}

/**
 * Save user settings to Supabase
 * Also saves to localStorage as backup
 * NOTE: API key is now server-side only, not saved per-user
 */
async function saveUserSettings(settings) {
    const { calendarInput, preferences } = settings;

    // Always save to localStorage as backup
    if (calendarInput !== undefined) {
        localStorage.setItem('ccCalendarInput', JSON.stringify(calendarInput));
    }

    // If not using Supabase, just use localStorage
    if (!window.USE_SUPABASE || !window.supabaseClient || !window.supabaseClient.authToken) {
        return { success: true, source: 'localStorage' };
    }

    try {
        const userId = await getCurrentUserId();
        if (!userId) {
            throw new Error('No user ID available');
        }

        // Check if settings exist
        const existing = await window.supabaseClient
            .from('user_settings')
            .select('id')
            .eq('user_id', userId)
            .execute();

        const data = {};
        if (calendarInput !== undefined) data.calendar_input = calendarInput;
        if (preferences !== undefined) data.preferences = preferences;
        data.updated_at = new Date().toISOString();

        if (existing && existing.length > 0) {
            // Update existing settings
            await window.supabaseClient
                .from('user_settings')
                .update(data)
                .eq('user_id', userId)
                .execute();
        } else {
            // Insert new settings
            data.user_id = userId;
            await window.supabaseClient
                .from('user_settings')
                .insert([data])
                .execute();
        }

        return { success: true, source: 'supabase' };
    } catch (error) {
        console.error('Error saving settings to Supabase (localStorage backup succeeded):', error);
        return { success: true, source: 'localStorage', error: error.message };
    }
}

/**
 * Get current user ID from auth
 */
async function getCurrentUserId() {
    if (!window.supabaseClient || !window.supabaseClient.authToken) {
        return null;
    }

    try {
        const user = await window.getCurrentUser();
        return user ? user.id : null;
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
}

/**
 * Save calendar input
 */
async function saveCalendarInput(calendarInput) {
    return await saveUserSettings({ calendarInput });
}

/**
 * Get calendar input
 */
async function getCalendarInput() {
    const settings = await getUserSettings();
    return settings.calendarInput;
}

/**
 * Migrate existing localStorage data to Supabase
 * Call this once after user logs in for the first time
 * NOTE: Only migrates calendar input now (API key is server-side)
 */
async function migrateLocalStorageToSupabase() {
    if (!window.USE_SUPABASE || !window.supabaseClient || !window.supabaseClient.authToken) {
        return { success: false, reason: 'Not using Supabase or not authenticated' };
    }

    try {
        // Get existing localStorage data (only calendar now)
        const calendarInput = JSON.parse(localStorage.getItem('ccCalendarInput') || '[]');

        // Check if Supabase already has data
        const userId = await getCurrentUserId();
        const existing = await window.supabaseClient
            .from('user_settings')
            .select('*')
            .eq('user_id', userId)
            .execute();

        if (existing && existing.length > 0) {
            // Supabase already has data - don't overwrite
            console.log('✅ Settings already exist in Supabase');
            return { success: true, migrated: false, reason: 'Data already exists in Supabase' };
        }

        // Migrate to Supabase
        if (calendarInput.length > 0) {
            await saveUserSettings({ calendarInput, preferences: {} });
            console.log('✅ Migrated localStorage calendar input to Supabase');
            return { success: true, migrated: true };
        } else {
            console.log('ℹ️ No localStorage settings to migrate');
            return { success: true, migrated: false, reason: 'No data in localStorage' };
        }
    } catch (error) {
        console.error('Error migrating settings:', error);
        return { success: false, error: error.message };
    }
}

// ============================================
// EXPOSE TO GLOBAL SCOPE
// ============================================
window.getUserSettings = getUserSettings;
window.saveUserSettings = saveUserSettings;
window.saveCalendarInput = saveCalendarInput;
window.getCalendarInput = getCalendarInput;
window.migrateLocalStorageToSupabase = migrateLocalStorageToSupabase;

console.log('✅ Supabase settings helpers initialized (server-side API key mode)');
