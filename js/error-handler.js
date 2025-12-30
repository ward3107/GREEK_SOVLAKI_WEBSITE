// Client-Side Error Handler - Logs frontend errors to console
(function() {
  'use strict';

  // Simple error logger (no external services, console only)
  const errorLogger = {
    logError(type, error, extra = {}) {
      const errorInfo = {
        timestamp: new Date().toISOString(),
        type: type,
        message: error.message || error,
        stack: error.stack,
        url: window.location.href,
        userAgent: navigator.userAgent,
        ...extra
      };

      // Log to console with clear formatting
      console.error(`[ERROR] ${type}:`, errorInfo);

      // Optionally send to server endpoint in the future
      // this.sendToServer('/api/errors', errorInfo);
    },

    logWarning(type, message, extra = {}) {
      const warningInfo = {
        timestamp: new Date().toISOString(),
        type: type,
        message: message,
        url: window.location.href,
        ...extra
      };

      console.warn(`[WARNING] ${type}:`, warningInfo);
    }
  };

  // 1. Global error handler (uncaught errors)
  window.addEventListener('error', function(event) {
    errorLogger.logError('uncaughtError', event.error, {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    });
  });

  // 2. Unhandled promise rejections
  window.addEventListener('unhandledrejection', function(event) {
    errorLogger.logError('unhandledRejection', event.reason, {
      promise: event.promise
    });

    // Prevent default browser error logging
    event.preventDefault();
  });

  // 3. Resource loading errors (images, scripts, styles)
  window.addEventListener('error', function(event) {
    if (event.target !== window) {
      // This is a resource loading error
      const tagName = event.target.tagName;
      const src = event.target.src || event.target.href;

      errorLogger.logWarning('resourceLoadError', `Failed to load ${tagName}`, {
        resource: src,
        tagName: tagName
      });
    }
  }, true);

  // 4. Image-specific error handling with fallbacks
  function setupImageErrorHandling() {
    const images = document.querySelectorAll('img');

    images.forEach(function(img) {
      // Add load timeout (10 seconds)
      const loadTimeout = setTimeout(function() {
        if (!img.complete) {
          errorLogger.logWarning('imageLoadTimeout', 'Image took too long to load', {
            src: img.src,
            alt: img.alt
          });
        }
      }, 10000);

      img.addEventListener('load', function() {
        clearTimeout(loadTimeout);
        img.classList.add('loaded');
      });

      img.addEventListener('error', function() {
        clearTimeout(loadTimeout);
        errorLogger.logWarning('imageLoadError', 'Image failed to load', {
          src: img.src,
          alt: img.alt
        });

        // Add error class for styling
        img.classList.add('image-error');
        img.alt = 'Image unavailable';

        // Optional: Set a placeholder
        // img.src = '/images/placeholder.webp';
      });
    });
  }

  // Run image error handling on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupImageErrorHandling);
  } else {
    setupImageErrorHandling();
  }

  // 5. Monitor long-running tasks (performance)
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver(function(list) {
        list.getEntries().forEach(function(entry) {
          if (entry.duration > 5000) { // 5 seconds threshold
            errorLogger.logWarning('longTask', 'Task took too long', {
              name: entry.name,
              duration: entry.duration + 'ms'
            });
          }
        });
      });

      observer.observe({ entryTypes: ['measure'] });
    } catch (e) {
      // PerformanceObserver not fully supported
    }
  }

  // 6. Network connectivity monitoring
  window.addEventListener('online', function() {
    console.info('[INFO] Network connection restored');
  });

  window.addEventListener('offline', function() {
    errorLogger.logWarning('networkOffline', 'Network connection lost');
  });

  // Expose logger globally for debugging (remove in production if desired)
  window.__errorLogger = errorLogger;

  console.info('[INFO] Client-side error handler initialized');
})();
