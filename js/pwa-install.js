/**
 * PWA Install Handler
 *
 * Proper implementation using real browser beforeinstallprompt event
 * - Desktop/Android Chrome: Triggers real install prompt
 * - iOS Safari: Shows manual install instructions overlay
 */

console.log('[PWA-INSTALL] Script loaded');

(function() {
    'use strict';

    // ============== CONFIGURATION ==============
    const CONFIG = {
        // How long to hide banner after dismissal (in milliseconds)
        DISMISSAL_DURATION: 7 * 24 * 60 * 60 * 1000, // 7 days
        STORAGE_KEY_DISMISSED: 'pwa-banner-dismissed-until',
        STORAGE_KEY_INSTALLED: 'pwa-installed',
    };

    // ============== STATE ==============
    let deferredPrompt = null;      // Stores the beforeinstallprompt event
    let bannerElement = null;       // Reference to banner DOM element
    let iosOverlayElement = null;   // Reference to iOS overlay

    // ============== DETECTION FUNCTIONS ==============

    /**
     * Check if app is already installed (running in standalone mode)
     */
    function isAppInstalled() {
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
        const isIOSStandalone = navigator.standalone === true;
        const wasInstalled = localStorage.getItem(CONFIG.STORAGE_KEY_INSTALLED) === 'true';

        console.log('[PWA-INSTALL] Installation check:', {
            isStandalone,
            isIOSStandalone,
            wasInstalled,
            isInstalled: isStandalone || isIOSStandalone || wasInstalled
        });

        return isStandalone || isIOSStandalone || wasInstalled;
    }

    /**
     * Check if banner was recently dismissed
     */
    function wasRecentlyDismissed() {
        const dismissedUntil = localStorage.getItem(CONFIG.STORAGE_KEY_DISMISSED);
        if (!dismissedUntil) return false;

        const now = Date.now();
        const dismissedTime = parseInt(dismissedUntil, 10);

        // Clear if expired
        if (now > dismissedTime) {
            localStorage.removeItem(CONFIG.STORAGE_KEY_DISMISSED);
            return false;
        }

        return true;
    }

    /**
     * Detect iOS Safari (not Chrome iOS)
     */
    function isIOSSafari() {
        const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
        const isSafari = /safari/i.test(navigator.userAgent) && !/chrome|crios/i.test(navigator.userAgent);
        return isIOS && isSafari;
    }

    /**
     * Detect if the browser supports PWA installation
     */
    function supportsPWAInstall() {
        // Chrome, Edge, Opera on desktop/Android support beforeinstallprompt
        // iOS Safari does NOT support it
        return !isIOSSafari();
    }

    // ============== BANNER CREATION ==============

    /**
     * Create the install banner element
     */
    function createBanner() {
        const banner = document.createElement('div');
        banner.id = 'pwa-install-banner';
        banner.setAttribute('role', 'banner');
        banner.setAttribute('aria-label', 'התקנת אפליקציה');

        // Styling
        banner.style.cssText = `
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            background: linear-gradient(135deg, #1e40af, #3730a7) !important;
            color: #ffffff !important;
            z-index: 999999 !important;
            padding: 16px 20px !important;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3) !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            transform: translateY(0) !important;
            transition: transform 0.3s ease !important;
        `.trim().replace(/\s+/g, ' ');

        banner.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px; max-width: 1200px; width: 100%;">
                <span style="font-size: 32px; flex-shrink: 0;" aria-hidden="true">📱</span>
                <div style="flex: 1;">
                    <div style="font-weight: 700; font-size: 18px; margin-bottom: 2px;">
                        התקנו את Greek Souvlaki
                    </div>
                    <div style="font-size: 14px; opacity: 0.9;">
                        קבלו חוויה מהירה יותר!
                    </div>
                </div>
                <div style="display: flex; gap: 10px; flex-shrink: 0;">
                    <button
                        id="pwa-install-btn"
                        style="
                            background: #fbbf24;
                            color: #1e3a8a;
                            border: none;
                            padding: 12px 24px;
                            border-radius: 25px;
                            font-size: 15px;
                            font-weight: 700;
                            cursor: pointer;
                            white-space: nowrap;
                            transition: transform 0.2s, box-shadow 0.2s;
                        "
                        aria-label="התקן את האפליקציה"
                    >
                        התקנה
                    </button>
                    <button
                        id="pwa-dismiss-btn"
                        style="
                            background: rgba(255, 255, 255, 0.2);
                            color: #fff;
                            border: none;
                            padding: 8px 16px;
                            border-radius: 20px;
                            font-size: 14px;
                            cursor: pointer;
                            transition: background 0.2s;
                        "
                        aria-label="סגור הודעה זו"
                    >
                        ✕
                    </button>
                </div>
            </div>
        `;

        // Add hover effects for install button
        const installBtn = banner.querySelector('#pwa-install-btn');
        installBtn.addEventListener('mouseenter', () => {
            installBtn.style.transform = 'scale(1.05)';
            installBtn.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
        });
        installBtn.addEventListener('mouseleave', () => {
            installBtn.style.transform = 'scale(1)';
            installBtn.style.boxShadow = 'none';
        });

        // Add hover effects for dismiss button
        const dismissBtn = banner.querySelector('#pwa-dismiss-btn');
        dismissBtn.addEventListener('mouseenter', () => {
            dismissBtn.style.background = 'rgba(255, 255, 255, 0.3)';
        });
        dismissBtn.addEventListener('mouseleave', () => {
            dismissBtn.style.background = 'rgba(255, 255, 255, 0.2)';
        });

        return banner;
    }

    /**
     * Show the install banner
     */
    function showBanner() {
        if (bannerElement) return; // Already shown
        if (isAppInstalled()) {
            console.log('[PWA-INSTALL] App already installed, not showing banner');
            return;
        }
        if (wasRecentlyDismissed()) {
            console.log('[PWA-INSTALL] Banner recently dismissed, not showing');
            return;
        }

        console.log('[PWA-INSTALL] Showing install banner');

        bannerElement = createBanner();
        document.body.appendChild(bannerElement);

        // Add event listeners
        const installBtn = bannerElement.querySelector('#pwa-install-btn');
        const dismissBtn = bannerElement.querySelector('#pwa-dismiss-btn');

        installBtn.addEventListener('click', handleInstallClick);
        dismissBtn.addEventListener('click', handleDismissClick);

        // Keyboard accessibility
        installBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleInstallClick();
            }
        });
        dismissBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleDismissClick();
            }
        });

        // Focus trap helper - make buttons focusable
        installBtn.setAttribute('tabindex', '0');
        dismissBtn.setAttribute('tabindex', '0');
    }

    /**
     * Hide the install banner
     */
    function hideBanner() {
        if (!bannerElement) return;

        console.log('[PWA-INSTALL] Hiding banner');

        bannerElement.style.transform = 'translateY(-100%)';

        setTimeout(() => {
            if (bannerElement && bannerElement.parentNode) {
                bannerElement.parentNode.removeChild(bannerElement);
            }
            bannerElement = null;
        }, 300);
    }

    // ============== INSTALL HANDLERS ==============

    /**
     * Handle install button click
     */
    async function handleInstallClick() {
        console.log('[PWA-INSTALL] Install button clicked');
        console.log('[PWA-INSTALL] deferredPrompt available:', !!deferredPrompt);
        console.log('[PWA-INSTALL] isIOSSafari():', isIOSSafari());

        // iOS Safari - show manual instructions overlay
        if (isIOSSafari()) {
            showIOSOverlay();
            return;
        }

        // Chrome/Edge on Desktop/Android - use real install prompt
        if (deferredPrompt) {
            console.log('[PWA-INSTALL] Triggering real browser install prompt...');

            try {
                // Show the native browser install dialog
                const result = await deferredPrompt.prompt();

                console.log('[PWA-INSTALL] Install prompt result:', result.outcome);

                if (result.outcome === 'accepted') {
                    console.log('[PWA-INSTALL] User accepted install');
                    localStorage.setItem(CONFIG.STORAGE_KEY_INSTALLED, 'true');
                    hideBanner();
                } else {
                    console.log('[PWA-INSTALL] User dismissed install');
                    // Keep banner hidden for a while
                    dismissBanner();
                }

                // Clear the deferred prompt (can only be used once)
                deferredPrompt = null;

            } catch (error) {
                console.error('[PWA-INSTALL] Install prompt error:', error);
                // Fallback to manual instructions if prompt fails
                showManualInstructions();
            }
        } else {
            console.log('[PWA-INSTALL] No install prompt available, showing manual instructions');
            showManualInstructions();
        }
    }

    /**
     * Handle dismiss button click
     */
    function handleDismissClick() {
        console.log('[PWA-INSTALL] Dismiss button clicked');
        dismissBanner();
    }

    /**
     * Dismiss banner and remember not to show it for a while
     */
    function dismissBanner() {
        const dismissedUntil = Date.now() + CONFIG.DISMISSAL_DURATION;
        localStorage.setItem(CONFIG.STORAGE_KEY_DISMISSED, dismissedUntil.toString());
        hideBanner();
    }

    // ============== iOS OVERLAY ==============

    /**
     * Create iOS install instructions overlay
     */
    function createIOSOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'pwa-ios-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-label', 'הוראות התקנה ל-iPhone');

        overlay.style.cssText = `
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            background: rgba(0, 0, 0, 0.85) !important;
            z-index: 9999999 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            padding: 20px !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
        `.trim().replace(/\s+/g, ' ');

        overlay.innerHTML = `
            <div style="
                background: #ffffff;
                border-radius: 20px;
                padding: 30px;
                max-width: 400px;
                width: 100%;
                text-align: center;
                color: #1e3a8a;
                position: relative;
            ">
                <button
                    id="pwa-ios-close"
                    style="
                        position: absolute;
                        top: 15px;
                        left: 15px;
                        background: #f3f4f6;
                        border: none;
                        width: 36px;
                        height: 36px;
                        border-radius: 50%;
                        font-size: 20px;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: #374151;
                        transition: background 0.2s;
                    "
                    aria-label="סגור"
                >✕</button>

                <div style="font-size: 48px; margin-bottom: 16px;" aria-hidden="true">📱</div>

                <h2 style="margin: 0 0 12px 0; font-size: 22px; font-weight: 700;">
                    התקנה ב-iPhone/iPad
                </h2>

                <p style="margin: 0 0 24px 0; font-size: 15px; color: #6b7280; line-height: 1.5;">
                    הוסיפו את האפליקציה למסך הבית שלכם
                </p>

                <div style="text-align: right; direction: rtl; space-y: 16px;">
                    <div style="display: flex; align-items: flex-start; gap: 12px; margin-bottom: 16px;">
                        <span style="
                            background: #1e40af;
                            color: white;
                            width: 28px;
                            height: 28px;
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-weight: 700;
                            font-size: 14px;
                            flex-shrink: 0;
                        ">1</span>
                        <p style="margin: 0; font-size: 15px; line-height: 1.5;">
                            לחצו על כפתור <strong style="color: #1e3a8a;">"שתף"</strong>
                            <span style="font-size: 20px;" aria-hidden="true"> ↑</span>
                            בתחתית המסך
                        </p>
                    </div>

                    <div style="display: flex; align-items: flex-start; gap: 12px; margin-bottom: 16px;">
                        <span style="
                            background: #1e40af;
                            color: white;
                            width: 28px;
                            height: 28px;
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-weight: 700;
                            font-size: 14px;
                            flex-shrink: 0;
                        ">2</span>
                        <p style="margin: 0; font-size: 15px; line-height: 1.5;">
                            גללו למטה ובחרו <strong style="color: #1e3a8a;">"במסך הבית"</strong>
                        </p>
                    </div>

                    <div style="display: flex; align-items: flex-start; gap: 12px;">
                        <span style="
                            background: #1e40af;
                            color: white;
                            width: 28px;
                            height: 28px;
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-weight: 700;
                            font-size: 14px;
                            flex-shrink: 0;
                        ">3</span>
                        <p style="margin: 0; font-size: 15px; line-height: 1.5;">
                            לחצו <strong style="color: #1e3a8a;">"הוסף"</strong> בפינה הימנית העליונה
                        </p>
                    </div>
                </div>

                <div style="
                    margin-top: 24px;
                    padding: 12px;
                    background: #fef3c7;
                    border-radius: 10px;
                    font-size: 13px;
                    color: #92400e;
                    text-align: center;
                ">
                    💡 האפליקציה תעבוד במצב דפדפן
                </div>
            </div>
        `;

        // Close button handler
        const closeBtn = overlay.querySelector('#pwa-ios-close');
        closeBtn.addEventListener('click', hideIOSOverlay);
        closeBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                hideIOSOverlay();
            }
        });

        // Close on overlay background click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                hideIOSOverlay();
            }
        });

        // Close on Escape key
        overlay.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                hideIOSOverlay();
            }
        });

        return overlay;
    }

    /**
     * Show iOS install overlay
     */
    function showIOSOverlay() {
        if (iosOverlayElement) return;

        console.log('[PWA-INSTALL] Showing iOS install overlay');

        iosOverlayElement = createIOSOverlay();
        document.body.appendChild(iosOverlayElement);
        document.body.style.overflow = 'hidden'; // Prevent scrolling

        // Focus the close button for accessibility
        setTimeout(() => {
            const closeBtn = iosOverlayElement.querySelector('#pwa-ios-close');
            closeBtn.focus();
        }, 100);
    }

    /**
     * Hide iOS install overlay
     */
    function hideIOSOverlay() {
        if (!iosOverlayElement) return;

        console.log('[PWA-INSTALL] Hiding iOS overlay');

        if (iosOverlayElement.parentNode) {
            iosOverlayElement.parentNode.removeChild(iosOverlayElement);
        }
        iosOverlayElement = null;
        document.body.style.overflow = ''; // Restore scrolling
    }

    /**
     * Show fallback manual instructions (for non-iOS devices without prompt)
     */
    function showManualInstructions() {
        const isAndroid = /android/i.test(navigator.userAgent);
        const isDesktop = !isAndroid && !isIOSSafari();

        let message = '';

        if (isAndroid) {
            message = '📱 להתקנת האפליקציה ב-Android:\n\n' +
                     '1. לחצו על תפריט (⋮) בפינה הימנית העליונה\n' +
                     '2. בחרו "התקנה" או "הוספה למסך הבית"\n' +
                     '3. לחצו "התקנה" כדי לסיים';
        } else if (isDesktop) {
            message = '💻 להתקנת האפליקציה:\n\n' +
                     'ב-Chrome/Edge: חפשו את סמל ההתקנה (⊕ או ⤡)\n' +
                     'בשורת הכתובת, ליד הסימנייה';
        }

        alert(message);
    }

    // ============== EVENT LISTENERS ==============

    /**
     * Listen for beforeinstallprompt event
     * This is fired by Chrome/Edge when the app is installable
     */
    window.addEventListener('beforeinstallprompt', (e) => {
        console.log('[PWA-INSTALL] beforeinstallprompt event fired!');

        // Prevent the mini-infobar from showing automatically
        e.preventDefault();

        // Store the event for later use
        deferredPrompt = e;

        // Show our custom banner (only if not already installed/dismissed)
        showBanner();
    });

    /**
     * Listen for appinstalled event
     * This is fired when the app is successfully installed
     */
    window.addEventListener('appinstalled', () => {
        console.log('[PWA-INSTALL] appinstalled event fired! App was installed successfully');

        // Mark as installed
        localStorage.setItem(CONFIG.STORAGE_KEY_INSTALLED, 'true');

        // Hide banner and overlay
        hideBanner();
        hideIOSOverlay();

        // Clear dismissal timestamp since app is now installed
        localStorage.removeItem(CONFIG.STORAGE_KEY_DISMISSED);

        // Optional: Show success message
        // alert('🎉 האפליקציה הותקנה בהצלחה!');
    });

    // ============== INITIALIZATION ==============

    /**
     * Initialize PWA install handler
     */
    function init() {
        console.log('[PWA-INSTALL] Initializing...');

        // If app is already installed, do nothing
        if (isAppInstalled()) {
            console.log('[PWA-INSTALL] App already installed, skipping initialization');
            return;
        }

        // For iOS Safari, we can't use beforeinstallprompt
        // Show banner after a short delay if page is engaged
        if (isIOSSafari()) {
            console.log('[PWA-INSTALL] iOS Safari detected, will show banner after engagement');

            // Show banner after user interacts with the page
            const showAfterInteraction = () => {
                // Remove event listeners
                document.removeEventListener('scroll', onScroll);
                document.removeEventListener('click', onClick);

                // Show banner after a delay
                setTimeout(() => {
                    if (!isAppInstalled() && !wasRecentlyDismissed()) {
                        showBanner();
                    }
                }, 2000);
            };

            let hasScrolled = false;
            const onScroll = () => {
                if (!hasScrolled) {
                    hasScrolled = true;
                    showAfterInteraction();
                }
            };

            let hasClicked = false;
            const onClick = () => {
                if (!hasClicked) {
                    hasClicked = true;
                    showAfterInteraction();
                }
            };

            // Wait for user engagement
            document.addEventListener('scroll', onScroll, { once: true, passive: true });
            document.addEventListener('click', onClick, { once: true });

            // Fallback: show after 10 seconds regardless
            setTimeout(() => {
                if (!isAppInstalled() && !wasRecentlyDismissed() && !bannerElement) {
                    showBanner();
                }
            }, 10000);

            return;
        }

        // For Chrome/Edge, the banner will be shown when beforeinstallprompt fires
        // But also show a fallback after 30 seconds if the event hasn't fired
        setTimeout(() => {
            if (!deferredPrompt && !isAppInstalled() && !wasRecentlyDismissed() && !bannerElement) {
                console.log('[PWA-INSTALL] No beforeinstallprompt event, showing banner anyway');
                showBanner();
            }
        }, 30000);
    }

    // Start initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose functions for debugging
    window.PWAInstall = {
        showBanner: showBanner,
        hideBanner: hideBanner,
        showIOSOverlay: showIOSOverlay,
        isAppInstalled: isAppInstalled,
        wasRecentlyDismissed: wasRecentlyDismissed
    };

    console.log('[PWA-INSTALL] Setup complete');
})();
