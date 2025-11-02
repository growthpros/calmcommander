// ============================================
// SUPABASE REST API CLIENT
// ============================================
// Lightweight REST API wrapper for Supabase
// No external dependencies - uses native fetch()

const SUPABASE_CONFIG = {
    url: 'https://cbeyohwwatpgzwbrhtxp.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNiZXlvaHd3YXRwZ3p3YnJodHhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwNTA0NjQsImV4cCI6MjA3NzYyNjQ2NH0.y9uvDXOlmtWoI1gw6qkxgWEgKj9iv5jeIhu1KvKz-Kk'
};

// ============================================
// SUPABASE CLIENT CLASS
// ============================================
class SupabaseClient {
    constructor(url, anonKey) {
        this.url = url;
        this.anonKey = anonKey;
        this.authToken = null;

        // Load saved session
        this.loadSession();
    }

    // Get auth headers
    getHeaders(includeAuth = true) {
        const headers = {
            'apikey': this.anonKey,
            'Content-Type': 'application/json'
        };

        if (includeAuth && this.authToken) {
            headers['Authorization'] = `Bearer ${this.authToken}`;
        }

        return headers;
    }

    // Save session to localStorage
    saveSession(session) {
        if (session && session.access_token) {
            this.authToken = session.access_token;
            localStorage.setItem('supabase.auth.token', JSON.stringify(session));
        }
    }

    // Load session from localStorage
    loadSession() {
        const saved = localStorage.getItem('supabase.auth.token');
        if (saved) {
            try {
                const session = JSON.parse(saved);
                this.authToken = session.access_token;
                return session;
            } catch (e) {
                console.error('Error loading session:', e);
            }
        }
        return null;
    }

    // Clear session
    clearSession() {
        this.authToken = null;
        localStorage.removeItem('supabase.auth.token');
    }

    // ============================================
    // DATABASE OPERATIONS
    // ============================================

    // SELECT query
    async select(table, options = {}) {
        const {
            columns = '*',
            filters = {},
            order = null,
            limit = null,
            single = false
        } = options;

        let url = `${this.url}/rest/v1/${table}?select=${columns}`;

        // Add filters
        Object.keys(filters).forEach(key => {
            const value = filters[key];
            if (typeof value === 'object' && value.operator) {
                // Advanced filter: { operator: 'eq', value: 'something' }
                url += `&${key}=${value.operator}.${value.value}`;
            } else {
                // Simple equality filter
                url += `&${key}=eq.${value}`;
            }
        });

        // Add order
        if (order) {
            url += `&order=${order}`;
        }

        // Add limit
        if (limit) {
            url += `&limit=${limit}`;
        }

        const headers = this.getHeaders();
        if (single) {
            headers['Accept'] = 'application/vnd.pgrst.object+json';
        }

        const response = await fetch(url, {
            method: 'GET',
            headers: headers
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Query failed');
        }

        return await response.json();
    }

    // INSERT query
    async insert(table, data, options = {}) {
        const { returning = true } = options;

        const url = `${this.url}/rest/v1/${table}`;
        const headers = this.getHeaders();

        if (returning) {
            headers['Prefer'] = 'return=representation';
        }

        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Insert failed');
        }

        if (returning) {
            return await response.json();
        }

        return { success: true };
    }

    // UPDATE query
    async update(table, data, filters = {}) {
        let url = `${this.url}/rest/v1/${table}?`;

        // Add filters
        Object.keys(filters).forEach((key, index) => {
            if (index > 0) url += '&';
            url += `${key}=eq.${filters[key]}`;
        });

        const headers = this.getHeaders();
        headers['Prefer'] = 'return=representation';

        const response = await fetch(url, {
            method: 'PATCH',
            headers: headers,
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Update failed');
        }

        return await response.json();
    }

    // DELETE query
    async delete(table, filters = {}) {
        let url = `${this.url}/rest/v1/${table}?`;

        // Add filters
        Object.keys(filters).forEach((key, index) => {
            if (index > 0) url += '&';
            url += `${key}=eq.${filters[key]}`;
        });

        const response = await fetch(url, {
            method: 'DELETE',
            headers: this.getHeaders()
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Delete failed');
        }

        return { success: true };
    }

    // ============================================
    // CONVENIENCE METHODS (QUERY BUILDER STYLE)
    // ============================================

    // Start a query chain
    from(table) {
        return new QueryBuilder(this, table);
    }
}

// ============================================
// QUERY BUILDER CLASS
// ============================================
class QueryBuilder {
    constructor(client, table) {
        this.client = client;
        this.table = table;
        this.queryOptions = {
            columns: '*',
            filters: {},
            order: null,
            limit: null
        };
    }

    // Select specific columns
    select(columns = '*') {
        this.queryOptions.columns = columns;
        return this;
    }

    // Add filter
    eq(column, value) {
        this.queryOptions.filters[column] = { operator: 'eq', value };
        return this;
    }

    // Order by
    order(column, options = {}) {
        const { ascending = true } = options;
        this.queryOptions.order = `${column}.${ascending ? 'asc' : 'desc'}`;
        return this;
    }

    // Limit results
    limit(count) {
        this.queryOptions.limit = count;
        return this;
    }

    // Execute SELECT
    async execute() {
        return await this.client.select(this.table, this.queryOptions);
    }

    // INSERT
    async insert(data) {
        return await this.client.insert(this.table, data);
    }

    // UPDATE
    async update(data) {
        return await this.client.update(this.table, data, this.queryOptions.filters);
    }

    // DELETE
    async delete() {
        return await this.client.delete(this.table, this.queryOptions.filters);
    }
}

// ============================================
// INITIALIZE & EXPORT
// ============================================
const supabaseClient = new SupabaseClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);

console.log('✅ Supabase REST client initialized:', SUPABASE_CONFIG.url);
