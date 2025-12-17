/**
 * Storage Utilities & Debug Mode
 * ===============================
 * Safe localStorage wrapper with error handling
 * Set DEBUG_MODE to false for production
 */

(function() {
  'use strict';

  // ========================================
  // DEBUG MODE - Set to false for production
  // ========================================
  window.DEBUG_MODE = false;

  // Override console methods in production
  const originalConsole = {
    log: console.log,
    warn: console.warn,
    error: console.error
  };

  if (!window.DEBUG_MODE) {
    console.log = function() {};
    console.warn = function() {};
    // Keep console.error for critical issues
  }

  // Restore console for debugging
  window.enableDebug = function() {
    console.log = originalConsole.log;
    console.warn = originalConsole.warn;
    console.error = originalConsole.error;
    console.log('🔧 Debug mode enabled');
  };

  // Check if localStorage is available
  function isLocalStorageAvailable() {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  // In-memory fallback storage
  const memoryStorage = {};

  // Storage available flag
  const storageAvailable = isLocalStorageAvailable();

  if (!storageAvailable) {
    console.warn('localStorage is not available. Using in-memory storage as fallback.');
  }

  /**
   * Safely get item from storage
   * @param {string} key - Storage key
   * @param {*} defaultValue - Default value if not found
   * @returns {*} - Stored value or default
   */
  window.safeGetItem = function(key, defaultValue = null) {
    try {
      if (storageAvailable) {
        const item = localStorage.getItem(key);
        return item !== null ? item : defaultValue;
      } else {
        return memoryStorage[key] !== undefined ? memoryStorage[key] : defaultValue;
      }
    } catch (e) {
      console.warn(`Error reading from storage: ${key}`, e);
      return defaultValue;
    }
  };

  /**
   * Safely set item in storage
   * @param {string} key - Storage key
   * @param {string} value - Value to store
   * @returns {boolean} - Success status
   */
  window.safeSetItem = function(key, value) {
    try {
      if (storageAvailable) {
        localStorage.setItem(key, value);
      } else {
        memoryStorage[key] = value;
      }
      return true;
    } catch (e) {
      console.warn(`Error writing to storage: ${key}`, e);
      // Try to clear old data if quota exceeded
      if (e.name === 'QuotaExceededError') {
        try {
          localStorage.clear();
          localStorage.setItem(key, value);
          return true;
        } catch (e2) {
          memoryStorage[key] = value;
          return false;
        }
      }
      memoryStorage[key] = value;
      return false;
    }
  };

  /**
   * Safely remove item from storage
   * @param {string} key - Storage key
   * @returns {boolean} - Success status
   */
  window.safeRemoveItem = function(key) {
    try {
      if (storageAvailable) {
        localStorage.removeItem(key);
      } else {
        delete memoryStorage[key];
      }
      return true;
    } catch (e) {
      console.warn(`Error removing from storage: ${key}`, e);
      delete memoryStorage[key];
      return false;
    }
  };

  /**
   * Safely get JSON from storage
   * @param {string} key - Storage key
   * @param {*} defaultValue - Default value if not found or parse error
   * @returns {*} - Parsed object or default
   */
  window.safeGetJSON = function(key, defaultValue = null) {
    try {
      const item = window.safeGetItem(key);
      if (item === null) return defaultValue;
      return JSON.parse(item);
    } catch (e) {
      console.warn(`Error parsing JSON from storage: ${key}`, e);
      return defaultValue;
    }
  };

  /**
   * Safely set JSON in storage
   * @param {string} key - Storage key
   * @param {*} value - Object to store
   * @returns {boolean} - Success status
   */
  window.safeSetJSON = function(key, value) {
    try {
      return window.safeSetItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`Error stringifying JSON for storage: ${key}`, e);
      return false;
    }
  };

  // Log storage status
  console.log(`💾 Storage utilities loaded. localStorage available: ${storageAvailable}`);

})();
