/**
 * Secure Logger Utility
 * Logs only in development mode or when debug is explicitly enabled
 */

// Determine if we're in development mode
const DEBUG = (
    typeof location !== 'undefined' && (
        location.hostname === 'localhost' ||
        location.hostname === '127.0.0.1' ||
        location.hostname === '' ||
        location.hostname.startsWith('192.168.') ||
        location.hostname.startsWith('10.') ||
        location.hostname.startsWith('172.')
    )
) || (
    typeof localStorage !== 'undefined' && localStorage.getItem('debug') === '1'
);

const Logger = {
    log: function(...args) {
        if (DEBUG) {
            console.log(...args);
        }
    },

    info: function(...args) {
        if (DEBUG) {
            console.info(...args);
        }
    },

    warn: function(...args) {
        if (DEBUG) {
            console.warn(...args);
        }
    },

    error: function(...args) {
        // Always log errors, even in production
        console.error(...args);
    },

    debug: function(...args) {
        if (DEBUG) {
            console.debug(...args);
        }
    },

    group: function(label) {
        if (DEBUG) {
            console.group(label);
        }
    },

    groupEnd: function() {
        if (DEBUG) {
            console.groupEnd();
        }
    },

    // Method to enable debug mode manually
    enableDebug: function() {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('debug', '1');
        }
    },

    // Method to disable debug mode
    disableDebug: function() {
        if (typeof localStorage !== 'undefined') {
            localStorage.removeItem('debug');
        }
    }
};

// Export for both CommonJS and browsers
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Logger;
} else if (typeof window !== 'undefined') {
    window.Logger = Logger;
}

// Auto-expose global debug methods for convenience
if (typeof window !== 'undefined' && !window.DEBUG) {
    window.DEBUG = DEBUG;
}