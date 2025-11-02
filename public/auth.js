// ============================================
// SUPABASE AUTHENTICATION
// ============================================
// Authentication functions using Supabase REST API
// Handles signup, login, logout, and session management

// ============================================
// AUTH API FUNCTIONS
// ============================================

// Sign up new user
async function signUp(email, password, metadata = {}) {
    const response = await fetch(`${SUPABASE_CONFIG.url}/auth/v1/signup`, {
        method: 'POST',
        headers: {
            'apikey': SUPABASE_CONFIG.anonKey,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email,
            password,
            data: metadata // optional user metadata
        })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error_description || data.message || 'Signup failed');
    }

    // Save session if auto-confirmed
    if (data.access_token) {
        supabaseClient.saveSession(data);
    }

    return data;
}

// Sign in existing user
async function signIn(email, password) {
    const response = await fetch(`${SUPABASE_CONFIG.url}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: {
            'apikey': SUPABASE_CONFIG.anonKey,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email,
            password
        })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error_description || data.message || 'Login failed');
    }

    // Save session
    supabaseClient.saveSession(data);

    return data;
}

// Sign out current user
async function signOut() {
    const token = supabaseClient.authToken;

    if (token) {
        // Call Supabase logout endpoint
        await fetch(`${SUPABASE_CONFIG.url}/auth/v1/logout`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_CONFIG.anonKey,
                'Authorization': `Bearer ${token}`
            }
        });
    }

    // Clear local session regardless of API call success
    supabaseClient.clearSession();
}

// Get current user
async function getCurrentUser() {
    const token = supabaseClient.authToken;

    if (!token) {
        return null;
    }

    try {
        const response = await fetch(`${SUPABASE_CONFIG.url}/auth/v1/user`, {
            method: 'GET',
            headers: {
                'apikey': SUPABASE_CONFIG.anonKey,
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            // Token expired or invalid
            supabaseClient.clearSession();
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error('Error getting current user:', error);
        supabaseClient.clearSession();
        return null;
    }
}

// Check if user is authenticated
function isAuthenticated() {
    return supabaseClient.authToken !== null;
}

// Get current session
function getSession() {
    return supabaseClient.loadSession();
}

// Request password reset
async function resetPassword(email) {
    const response = await fetch(`${SUPABASE_CONFIG.url}/auth/v1/recover`, {
        method: 'POST',
        headers: {
            'apikey': SUPABASE_CONFIG.anonKey,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error_description || data.message || 'Password reset failed');
    }

    return data;
}

// Update user password
async function updatePassword(newPassword) {
    const token = supabaseClient.authToken;

    if (!token) {
        throw new Error('Not authenticated');
    }

    const response = await fetch(`${SUPABASE_CONFIG.url}/auth/v1/user`, {
        method: 'PUT',
        headers: {
            'apikey': SUPABASE_CONFIG.anonKey,
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            password: newPassword
        })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error_description || data.message || 'Password update failed');
    }

    // Update session with new token if provided
    if (data.access_token) {
        supabaseClient.saveSession(data);
    }

    return data;
}

// Update user metadata
async function updateUserMetadata(metadata) {
    const token = supabaseClient.authToken;

    if (!token) {
        throw new Error('Not authenticated');
    }

    const response = await fetch(`${SUPABASE_CONFIG.url}/auth/v1/user`, {
        method: 'PUT',
        headers: {
            'apikey': SUPABASE_CONFIG.anonKey,
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            data: metadata
        })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error_description || data.message || 'Metadata update failed');
    }

    return data;
}

// ============================================
// AUTH STATE MANAGEMENT
// ============================================

// Initialize auth on page load
async function initializeAuth() {
    const session = supabaseClient.loadSession();

    if (session) {
        // Verify session is still valid
        const user = await getCurrentUser();
        if (user) {
            console.log('🔐 User authenticated:', user.email);
            return user;
        } else {
            console.log('🔓 Session expired, user logged out');
            return null;
        }
    }

    console.log('🔓 No active session');
    return null;
}

// Auth state change listeners
const authListeners = [];

function onAuthStateChange(callback) {
    authListeners.push(callback);

    // Return unsubscribe function
    return () => {
        const index = authListeners.indexOf(callback);
        if (index > -1) {
            authListeners.splice(index, 1);
        }
    };
}

function notifyAuthStateChange(user) {
    authListeners.forEach(callback => {
        try {
            callback(user);
        } catch (error) {
            console.error('Auth listener error:', error);
        }
    });
}

// Enhanced signIn that notifies listeners
async function signInWithNotify(email, password) {
    const data = await signIn(email, password);
    const user = await getCurrentUser();
    notifyAuthStateChange(user);
    return data;
}

// Enhanced signOut that notifies listeners
async function signOutWithNotify() {
    await signOut();
    notifyAuthStateChange(null);
}

console.log('✅ Supabase auth initialized');
