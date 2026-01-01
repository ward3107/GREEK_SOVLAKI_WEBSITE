/**
 * Early PWA Install Prompt Capture Script
 * MUST be loaded in the <head> BEFORE any other scripts
 *
 * This script captures the beforeinstallprompt event as early as possible
 * to ensure we don't miss Chrome's install prompt on Android
 */

(function() {
    'use strict';

    console.log('[PWA-Early] Early capture script loaded');

    // Store the install prompt event globally
    window._pwaInstallPrompt = null;
    window._pwaInstallPromptCaptured = false;

    // CRITICAL: Capture the beforeinstallprompt event IMMEDIATELY
    // This must be done before DOMContentLoaded to catch Chrome's early event
    window.addEventListener('beforeinstallprompt', function(e) {
        console.log('[PWA-Early] beforeinstallprompt event captured!');

        // Prevent Chrome's default mini-infobar
        e.preventDefault();

        // Store the event for later use
        window._pwaInstallPrompt = e;
        window._pwaInstallPromptCaptured = true;

        // Dispatch custom event for the main PWA manager
        window.dispatchEvent(new CustomEvent('pwa-install-prompt-captured', {
            detail: { prompt: e }
        }));

        console.log('[PWA-Early] Install prompt stored and event dispatched');
    });

    // Also listen for appinstalled to clean up
    window.addEventListener('appinstalled', function() {
        console.log('[PWA-Early] App was installed');
        window._pwaInstallPrompt = null;
        window._pwaInstallPromptCaptured = false;
        localStorage.setItem('pwa-installed', 'true');

        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('pwa-app-installed'));
    });

    // Track user engagement
    window._pwaUserEngaged = false;

    // Simple engagement tracking - after 5 seconds OR user interaction
    const engagementTimer = setTimeout(function() {
        window._pwaUserEngaged = true;
        console.log('[PWA-Early] User engaged (time-based)');
        window.dispatchEvent(new CustomEvent('pwa-user-engaged'));
    }, 5000);

    // Engagement through interaction
    function markEngaged() {
        if (!window._pwaUserEngaged) {
            window._pwaUserEngaged = true;
            console.log('[PWA-Early] User engaged (interaction-based)');
            window.dispatchEvent(new CustomEvent('pwa-user-engaged'));
            clearTimeout(engagementTimer);
        }
    }

    // Track interactions
    document.addEventListener('click', markEngaged, { once: true, passive: true });
    document.addEventListener('scroll', markEngaged, { once: true, passive: true });
    document.addEventListener('touchstart', markEngaged, { once: true, passive: true });

    console.log('[PWA-Early] Early capture initialized, waiting for beforeinstallprompt...');
})();
