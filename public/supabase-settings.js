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
    if (
        !window.USE_SUPABASE ||
        !window.supabaseClient ||
        !window.supabaseClient.authToken
    ) {
        // Not using Supabase or not authenticated - use localStorage
        return {
            calendarInput: JSON.parse(
                localStorage.getItem("ccCalendarInput") || "[]",
            ),
            preferences: {},
        };
    }

    try {
        const userId = await getCurrentUserId();
        if (!userId) {
            throw new Error("No user ID available");
        }

        // Query user_settings table
        const settings = await window.supabaseClient
            .from("user_settings")
            .select("*")
            .eq("user_id", userId)
            .execute();

        if (settings && settings.length > 0) {
            const userSettings = settings[0];
            return {
                calendarInput: userSettings.calendar_input || [],
                preferences: userSettings.preferences || {},
            };
        } else {
            // No settings found - return defaults
            return {
                calendarInput: [],
                preferences: {},
            };
        }
    } catch (error) {
        console.error(
            "Error loading settings from Supabase, using localStorage:",
            error,
        );
        // Fallback to localStorage
        return {
            calendarInput: JSON.parse(
                localStorage.getItem("ccCalendarInput") || "[]",
            ),
            preferences: {},
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
        localStorage.setItem("ccCalendarInput", JSON.stringify(calendarInput));
    }

    // If not using Supabase, just use localStorage
    if (
        !window.USE_SUPABASE ||
        !window.supabaseClient ||
        !window.supabaseClient.authToken
    ) {
        return { success: true, source: "localStorage" };
    }

    try {
        const userId = await getCurrentUserId();
        if (!userId) {
            throw new Error("No user ID available");
        }

        // Check if settings exist
        const existing = await window.supabaseClient
            .from("user_settings")
            .select("id")
            .eq("user_id", userId)
            .execute();

        const data = {};
        if (calendarInput !== undefined) data.calendar_input = calendarInput;
        if (preferences !== undefined) data.preferences = preferences;
        data.updated_at = new Date().toISOString();

        if (existing && existing.length > 0) {
            // Update existing settings
            await window.supabaseClient
                .from("user_settings")
                .update(data)
                .eq("user_id", userId)
                .execute();
        } else {
            // Insert new settings
            data.user_id = userId;
            await window.supabaseClient
                .from("user_settings")
                .insert([data])
                .execute();
        }

        return { success: true, source: "supabase" };
    } catch (error) {
        console.error(
            "Error saving settings to Supabase (localStorage backup succeeded):",
            error,
        );
        return { success: true, source: "localStorage", error: error.message };
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
        console.error("Error getting current user:", error);
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
    if (
        !window.USE_SUPABASE ||
        !window.supabaseClient ||
        !window.supabaseClient.authToken
    ) {
        return {
            success: false,
            reason: "Not using Supabase or not authenticated",
        };
    }

    try {
        // Get existing localStorage data (only calendar now)
        const calendarInput = JSON.parse(
            localStorage.getItem("ccCalendarInput") || "[]",
        );

        // Check if Supabase already has data
        const userId = await getCurrentUserId();
        const existing = await window.supabaseClient
            .from("user_settings")
            .select("*")
            .eq("user_id", userId)
            .execute();

        if (existing && existing.length > 0) {
            // Supabase already has data - don't overwrite
            console.log("✅ Settings already exist in Supabase");
            return {
                success: true,
                migrated: false,
                reason: "Data already exists in Supabase",
            };
        }

        // Migrate to Supabase
        if (calendarInput.length > 0) {
            await saveUserSettings({ calendarInput, preferences: {} });
            console.log("✅ Migrated localStorage calendar input to Supabase");
            return { success: true, migrated: true };
        } else {
            console.log("ℹ️ No localStorage settings to migrate");
            return {
                success: true,
                migrated: false,
                reason: "No data in localStorage",
            };
        }
    } catch (error) {
        console.error("Error migrating settings:", error);
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

console.log(
    "✅ Supabase settings helpers initialized (server-side API key mode)",
);

// ============================================
// TASK MANAGEMENT WITH SYNC QUEUE
// ============================================

// Sync queue for offline operations
let taskSyncQueue = [];
let isSyncing = false;

/**
 * Load sync queue from localStorage
 */
function loadSyncQueue() {
    try {
        const saved = localStorage.getItem("ccTaskSyncQueue");
        if (saved) {
            taskSyncQueue = JSON.parse(saved);
            console.log(`📦 Loaded ${taskSyncQueue.length} queued operations`);
        }
    } catch (error) {
        console.error("Error loading sync queue:", error);
        taskSyncQueue = [];
    }
}

/**
 * Save sync queue to localStorage
 */
function saveSyncQueue() {
    try {
        localStorage.setItem("ccTaskSyncQueue", JSON.stringify(taskSyncQueue));
    } catch (error) {
        console.error("Error saving sync queue:", error);
    }
}

/**
 * Add operation to sync queue
 */
function queueOperation(operation) {
    taskSyncQueue.push({
        ...operation,
        timestamp: new Date().toISOString(),
    });
    saveSyncQueue();
    console.log(
        "📝 Queued operation:",
        operation.type,
        operation.data?.title || operation.data?.id,
    );
}

/**
 * Process sync queue - upload all pending operations
 */
async function processSyncQueue() {
    if (isSyncing || taskSyncQueue.length === 0) return;

    if (
        !window.USE_SUPABASE ||
        !window.supabaseClient ||
        !window.supabaseClient.authToken
    ) {
        console.log("⏸️ Sync paused - Supabase not available");
        return;
    }

    isSyncing = true;
    console.log(`🔄 Processing ${taskSyncQueue.length} queued operations...`);

    const failedOperations = [];

    for (const operation of taskSyncQueue) {
        try {
            switch (operation.type) {
                case "create":
                    await saveUserTask(operation.data, true);
                    break;
                case "update":
                    await updateUserTask(
                        operation.data.id,
                        operation.data,
                        true,
                    );
                    break;
                case "delete":
                    await deleteUserTask(operation.data.id, true);
                    break;
            }
            console.log(
                "✅ Synced:",
                operation.type,
                operation.data?.title || operation.data?.id,
            );
        } catch (error) {
            console.error("❌ Failed to sync:", operation.type, error);
            failedOperations.push(operation);
        }
    }

    // Keep only failed operations in queue
    taskSyncQueue = failedOperations;
    saveSyncQueue();

    if (taskSyncQueue.length === 0) {
        console.log("✅ All operations synced successfully!");
    } else {
        console.log(
            `⚠️ ${taskSyncQueue.length} operations failed, will retry later`,
        );
    }

    isSyncing = false;
}

/**
 * Get all tasks for current user
 */
async function getUserTasks() {
    // Always load from localStorage first
    const localTasks = localStorage.getItem("calmCommanderTasks");
    const fallbackTasks = localTasks ? JSON.parse(localTasks) : [];

    // If not using Supabase, just return localStorage
    if (
        !window.USE_SUPABASE ||
        !window.supabaseClient ||
        !window.supabaseClient.authToken
    ) {
        return fallbackTasks;
    }

    try {
        const userId = await getCurrentUserId();
        if (!userId) {
            throw new Error("No user ID available");
        }

        // Fetch from Supabase
        const result = await window.supabaseClient
            .from("tasks")
            .select("*")
            .eq("user_id", userId)
            .eq("status", "active")
            .execute();

        if (result && result.length > 0) {
            // Save to localStorage as cache
            localStorage.setItem("calmCommanderTasks", JSON.stringify(result));
            console.log(`✅ Loaded ${result.length} tasks from Supabase`);

            // Try to process any queued operations
            processSyncQueue().catch((e) =>
                console.error("Error processing sync queue:", e),
            );

            return result;
        }

        return fallbackTasks;
    } catch (error) {
        console.error(
            "Error loading tasks from Supabase, using localStorage:",
            error,
        );
        return fallbackTasks;
    }
}

/**
 * Save a single task (create or update)
 * @param {Object} task - Task data
 * @param {Boolean} skipQueue - Skip queueing (used when processing queue)
 */
async function saveUserTask(task, skipQueue = false) {
    // Always save to localStorage
    const localTasks = localStorage.getItem("calmCommanderTasks");
    let tasks = localTasks ? JSON.parse(localTasks) : [];

    // Update or add task
    const existingIndex = tasks.findIndex((t) => t.id === task.id);
    if (existingIndex >= 0) {
        tasks[existingIndex] = task;
    } else {
        tasks.push(task);
    }

    localStorage.setItem("calmCommanderTasks", JSON.stringify(tasks));

    // If not using Supabase, just return localStorage success
    if (
        !window.USE_SUPABASE ||
        !window.supabaseClient ||
        !window.supabaseClient.authToken
    ) {
        if (!skipQueue) {
            queueOperation({ type: "create", data: task });
        }
        return { success: true, source: "localStorage" };
    }

    try {
        const userId = await getCurrentUserId();
        if (!userId) {
            throw new Error("No user ID available");
        }

        // Prepare task data for Supabase
        const taskData = {
            id: task.id,
            user_id: userId,
            title: task.title,
            description: task.description || null,
            category: task.category || null,
            priority: task.priority || "normal",
            focus_level: task.focusLevel || "medium",
            spoons_required: task.spoonsRequired || 2,
            estimated_time_minutes: task.estimatedTime || 60,
            due_date: task.dueDate || null,
            time_block: task.timeBlock || null,
            status: "active",
            client: task.client || null,
            billable: task.billable || false,
            subtasks: task.subtasks || [],
            created_date: task.createdDate || new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        // Check if task exists in Supabase
        const existing = await window.supabaseClient
            .from("tasks")
            .select("id")
            .eq("id", task.id)
            .eq("user_id", userId)
            .execute();

        if (existing && existing.length > 0) {
            // Update
            await window.supabaseClient
                .from("tasks")
                .update(taskData)
                .eq("id", task.id)
                .eq("user_id", userId)
                .execute();
        } else {
            // Insert
            await window.supabaseClient
                .from("tasks")
                .insert([taskData])
                .execute();
        }

        console.log("✅ Task saved to Supabase:", task.title);
        return { success: true, source: "supabase" };
    } catch (error) {
        console.error("Error saving task to Supabase:", error);
        if (!skipQueue) {
            queueOperation({ type: "create", data: task });
        }
        return { success: true, source: "localStorage", queued: true };
    }
}

/**
 * Update a task
 */
async function updateUserTask(taskId, updates, skipQueue = false) {
    // Update localStorage
    const localTasks = localStorage.getItem("calmCommanderTasks");
    let tasks = localTasks ? JSON.parse(localTasks) : [];

    const taskIndex = tasks.findIndex((t) => t.id === taskId);
    if (taskIndex >= 0) {
        tasks[taskIndex] = { ...tasks[taskIndex], ...updates };
        localStorage.setItem("calmCommanderTasks", JSON.stringify(tasks));
    }

    // If not using Supabase, queue for later
    if (
        !window.USE_SUPABASE ||
        !window.supabaseClient ||
        !window.supabaseClient.authToken
    ) {
        if (!skipQueue) {
            queueOperation({
                type: "update",
                data: { id: taskId, ...updates },
            });
        }
        return { success: true, source: "localStorage" };
    }

    try {
        const userId = await getCurrentUserId();
        if (!userId) {
            throw new Error("No user ID available");
        }

        await window.supabaseClient
            .from("tasks")
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq("id", taskId)
            .eq("user_id", userId)
            .execute();

        console.log("✅ Task updated in Supabase");
        return { success: true, source: "supabase" };
    } catch (error) {
        console.error("Error updating task in Supabase:", error);
        if (!skipQueue) {
            queueOperation({
                type: "update",
                data: { id: taskId, ...updates },
            });
        }
        return { success: true, source: "localStorage", queued: true };
    }
}

/**
 * Delete a task
 */
async function deleteUserTask(taskId, skipQueue = false) {
    // Delete from localStorage
    const localTasks = localStorage.getItem("calmCommanderTasks");
    let tasks = localTasks ? JSON.parse(localTasks) : [];

    tasks = tasks.filter((t) => t.id !== taskId);
    localStorage.setItem("calmCommanderTasks", JSON.stringify(tasks));

    // If not using Supabase, queue for later
    if (
        !window.USE_SUPABASE ||
        !window.supabaseClient ||
        !window.supabaseClient.authToken
    ) {
        if (!skipQueue) {
            queueOperation({ type: "delete", data: { id: taskId } });
        }
        return { success: true, source: "localStorage" };
    }

    try {
        const userId = await getCurrentUserId();
        if (!userId) {
            throw new Error("No user ID available");
        }

        await window.supabaseClient
            .from("tasks")
            .delete()
            .eq("id", taskId)
            .eq("user_id", userId)
            .execute();

        console.log("✅ Task deleted from Supabase");
        return { success: true, source: "supabase" };
    } catch (error) {
        console.error("Error deleting task from Supabase:", error);
        if (!skipQueue) {
            queueOperation({ type: "delete", data: { id: taskId } });
        }
        return { success: true, source: "localStorage", queued: true };
    }
}

// Initialize sync queue on load
loadSyncQueue();

// Try to sync every 30 seconds if online
setInterval(() => {
    if (navigator.onLine) {
        processSyncQueue().catch((e) =>
            console.error("Error in sync interval:", e),
        );
    }
}, 30000);

// Sync when coming back online
window.addEventListener("online", () => {
    console.log("🌐 Back online! Processing sync queue...");
    processSyncQueue().catch((e) =>
        console.error("Error syncing on reconnect:", e),
    );
});

// ============================================
// EXPOSE TO GLOBAL SCOPE
// ============================================

window.getUserTasks = getUserTasks;
window.saveUserTask = saveUserTask;
window.updateUserTask = updateUserTask;
window.deleteUserTask = deleteUserTask;
window.processSyncQueue = processSyncQueue;

console.log("✅ Task management functions initialized (with sync queue)");
