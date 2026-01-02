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
     * Check if device is mobile
     */
    function isMobile() {
        return /android|iphone|ipad|ipod|mobile/i.test(navigator.userAgent);
    }

    /**
     * Check if app is already installed (running in standalone mode)
     */
    function isAppInstalled() {
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
        const isIOSStandalone = navigator.standalone === true;
        const wasInstalled = localStorage.getItem(CONFIG.STORAGE_KEY_INSTALLED) === 'true';

        const result = {
            isStandalone,
            isIOSStandalone,
            wasInstalled,
            isInstalled: isStandalone || isIOSStandalone || wasInstalled
        };

        console.log('[PWA-INSTALL] Installation check:', result);
        console.log('[PWA-INSTALL] isMobile():', isMobile());
        console.log('[PWA-INSTALL] UserAgent:', navigator.userAgent);

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
        console.log('[PWA-INSTALL] showBanner() called');
        console.log('[PWA-INSTALL] bannerElement exists:', !!bannerElement);
        console.log('[PWA-INSTALL] document.body exists:', !!document.body);

        if (bannerElement) {
            console.log('[PWA-INSTALL] Banner already shown, returning');
            return;
        }

        const installed = isAppInstalled();
        console.log('[PWA-INSTALL] isAppInstalled():', installed);
        if (installed) {
            console.log('[PWA-INSTALL] App already installed, not showing banner');
            return;
        }

        const dismissed = wasRecentlyDismissed();
        console.log('[PWA-INSTALL] wasRecentlyDismissed():', dismissed);
        if (dismissed) {
            console.log('[PWA-INSTALL] Banner recently dismissed, not showing');
            return;
        }

        console.log('[PWA-INSTALL] Creating banner...');

        try {
            bannerElement = createBanner();
            console.log('[PWA-INSTALL] Banner element created:', !!bannerElement);
            console.log('[PWA-INSTALL] Banner HTML length:', bannerElement.innerHTML.length);

            document.body.appendChild(bannerElement);
            console.log('[PWA-INSTALL] Banner appended to body');
            console.log('[PWA-INSTALL] Banner in DOM:', document.getElementById('pwa-install-banner') !== null);

            // Add event listeners
            const installBtn = bannerElement.querySelector('#pwa-install-btn');
            const dismissBtn = bannerElement.querySelector('#pwa-dismiss-btn');
            console.log('[PWA-INSTALL] installBtn found:', !!installBtn);
            console.log('[PWA-INSTALL] dismissBtn found:', !!dismissBtn);

            if (installBtn) {
                installBtn.addEventListener('click', handleInstallClick);
                // Also add touch event for better mobile support
                installBtn.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    handleInstallClick();
                });
            }

            if (dismissBtn) {
                dismissBtn.addEventListener('click', handleDismissClick);
                dismissBtn.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    handleDismissClick();
                });
            }

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

            console.log('[PWA-INSTALL] Banner successfully created and attached!');

        } catch (error) {
            console.error('[PWA-INSTALL] Error creating banner:', error);
            console.error('[PWA-INSTALL] Error stack:', error.stack);
        }
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
     * Detect Firefox browser
     */
    function isFirefox() {
        return /firefox/i.test(navigator.userAgent) && !/seamonkey/i.test(navigator.userAgent);
    }

    /**
     * Show Firefox installation overlay
     */
    function showFirefoxOverlay() {
        if (iosOverlayElement) return;

        console.log('[PWA-INSTALL] Showing Firefox install overlay');

        iosOverlayElement = createFirefoxOverlay();
        document.body.appendChild(iosOverlayElement);
        document.body.style.overflow = 'hidden';

        setTimeout(() => {
            const closeBtn = iosOverlayElement.querySelector('#pwa-ff-close');
            if (closeBtn) closeBtn.focus();
        }, 100);
    }

    /**
     * Create Firefox install instructions overlay
     */
    function createFirefoxOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'pwa-ff-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-label', 'הוראות התקנה ל-Firefox');

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

        const isWindows = /win/i.test(navigator.platform);

        overlay.innerHTML = `
            <div style="
                background: #ffffff;
                border-radius: 20px;
                padding: 30px;
                max-width: 450px;
                width: 100%;
                text-align: center;
                color: #1e3a8a;
                position: relative;
                max-height: 90vh;
                overflow-y: auto;
            ">
                <button
                    id="pwa-ff-close"
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

                <div style="font-size: 48px; margin-bottom: 16px;" aria-hidden="true">🦊</div>

                <h2 style="margin: 0 0 12px 0; font-size: 22px; font-weight: 700;">
                    התקנה ב-Firefox
                </h2>

                <p style="margin: 0 0 24px 0; font-size: 15px; color: #6b7280; line-height: 1.5;">
                    Firefox דורש אפשרות מיוחדת להתקנת אפליקציות
                </p>

                ${isWindows ? `
                <div style="text-align: right; direction: rtl; margin-bottom: 20px;">
                    <div style="background: #fef3c7; padding: 16px; border-radius: 12px; margin-bottom: 16px;">
                        <div style="font-weight: 700; color: #92400e; margin-bottom: 8px; font-size: 16px;">
                            ⚙️ אפשרות ניסיונית ב-Windows
                        </div>
                        <div style="font-size: 14px; color: #92400e; line-height: 1.6;">
                            Firefox הוסיף תמיכה ב-PWA (ניסיוני)
                        </div>
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
                        ">1</span>
                        <p style="margin: 0; font-size: 15px; line-height: 1.5;">
                            הקלידו <strong style="color: #1e3a8a;">about:preferences#experimental</strong> בשורת הכתובת
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
                            גללו למטה ל-<strong style="color: #1e3a8a;">"Firefox Labs"</strong>
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
                        ">3</span>
                        <p style="margin: 0; font-size: 15px; line-height: 1.5;">
                            אפשרו את <strong style="color: #1e3a8a;">"Web App Support"</strong>
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
                        ">4</span>
                        <p style="margin: 0; font-size: 15px; line-height: 1.5;">
                            הפעילו מחדש את Firefox ותחזרו לאתר
                        </p>
                    </div>
                </div>

                <div style="border-top: 1px solid #e5e7eb; padding-top: 16px; margin-bottom: 16px;">
                    <div style="font-size: 13px; color: #6b7280; margin-bottom: 8px;">או נסו אלטרנטיבה:</div>
                </div>
                ` : ''}

                <div style="text-align: right; direction: rtl;">
                    <div style="background: #eff6ff; padding: 16px; border-radius: 12px; margin-bottom: 16px;">
                        <div style="font-weight: 700; color: #1e40af; margin-bottom: 8px; font-size: 16px;">
                            🔧 התוסף PWAsForFirefox
                        </div>
                        <p style="margin: 0 0 12px 0; font-size: 14px; color: #1e40af; line-height: 1.5;">
                            תוסף קהילתי שמאפשר התקנת PWA ב-Firefox
                        </p>
                        <a
                            href="https://addons.mozilla.org/en-US/firefox/addon/pwas-for-firefox/"
                            target="_blank"
                            rel="noopener noreferrer"
                            style="
                                display: inline-block;
                                background: #1e40af;
                                color: white;
                                text-decoration: none;
                                padding: 10px 20px;
                                border-radius: 8px;
                                font-size: 14px;
                                font-weight: 600;
                                transition: background 0.2s;
                            "
                        >
                            פתח חנות התוספים ↗
                        </a>
                    </div>

                    <div style="background: #f9fafb; padding: 16px; border-radius: 12px;">
                        <div style="font-weight: 700; color: #374151; margin-bottom: 8px; font-size: 15px;">
                            🌐 אפשרויות נוספות
                        </div>
                        <ul style="margin: 0; padding-right: 20px; font-size: 14px; color: #4b5563; line-height: 1.8;">
                            <li style="margin-bottom: 6px;">השתמשו ב-<strong>Chrome</strong> או <strong>Edge</strong> להתקנה</li>
                            <li style="margin-bottom: 6px;">האפליקציה תעבוד בכל הדפדפנים לאחר התקנה</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;

        // Close button handler
        const closeBtn = overlay.querySelector('#pwa-ff-close');
        closeBtn.addEventListener('click', () => {
            hideIOSOverlay();
            iosOverlayElement = null;
        });
        closeBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                hideIOSOverlay();
                iosOverlayElement = null;
            }
        });

        // Close on overlay background click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                hideIOSOverlay();
                iosOverlayElement = null;
            }
        });

        // Close on Escape key
        overlay.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                hideIOSOverlay();
                iosOverlayElement = null;
            }
        });

        return overlay;
    }

    /**
     * Show fallback manual instructions (for non-iOS devices without prompt)
     */
    function showManualInstructions() {
        // For Firefox, show the overlay
        if (isFirefox()) {
            showFirefoxOverlay();
            return;
        }

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
        console.log('[PWA-INSTALL] ===== INIT START =====');
        console.log('[PWA-INSTALL] document.readyState:', document.readyState);
        console.log('[PWA-INSTALL] UserAgent:', navigator.userAgent);

        // If app is already installed, do nothing
        const installed = isAppInstalled();
        console.log('[PWA-INSTALL] isAppInstalled():', installed);

        if (installed) {
            console.log('[PWA-INSTALL] App already installed, skipping initialization');
            return;
        }

        const dismissed = wasRecentlyDismissed();
        console.log('[PWA-INSTALL] wasRecentlyDismissed():', dismissed);

        if (dismissed) {
            console.log('[PWA-INSTALL] Banner was recently dismissed, not showing');
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

        // For Chrome/Edge Desktop/Android - show banner immediately
        console.log('[PWA-INSTALL] Chrome/Edge detected, showing banner in 2 seconds');
        setTimeout(() => {
            if (!isAppInstalled() && !wasRecentlyDismissed() && !bannerElement) {
                console.log('[PWA-INSTALL] Showing banner now (fallback mode)');
                showBanner();
            } else {
                console.log('[PWA-INSTALL] Banner not shown - conditions:', {
                    installed: isAppInstalled(),
                    dismissed: wasRecentlyDismissed(),
                    bannerExists: !!bannerElement
                });
            }
        }, 2000);
    }

    // Start initialization when DOM is ready
    console.log('[PWA-INSTALL] Checking DOM ready state:', document.readyState);
    if (document.readyState === 'loading') {
        console.log('[PWA-INSTALL] Waiting for DOMContentLoaded');
        document.addEventListener('DOMContentLoaded', () => {
            console.log('[PWA-INSTALL] DOMContentLoaded fired!');
            init();
        });
    } else {
        console.log('[PWA-INSTALL] DOM ready, calling init() directly');
        // Use setTimeout to ensure DOM is fully ready
        setTimeout(init, 100);
    }

    // IMMEDIATE FALLBACK: Try to show banner right away if body exists
    if (document.body && !isAppInstalled() && !wasRecentlyDismissed()) {
        console.log('[PWA-INSTALL] IMMEDIATE: Body exists, showing banner NOW');
        try {
            showBanner();
        } catch (e) {
            console.error('[PWA-INSTALL] IMMEDIATE error:', e);
        }
    } else {
        console.log('[PWA-INSTALL] IMMEDIATE check:', {
            hasBody: !!document.body,
            installed: isAppInstalled(),
            dismissed: wasRecentlyDismissed()
        });
    }

    // Fallback: force init after 1 second regardless of DOM state
    setTimeout(() => {
        console.log('[PWA-INSTALL] Fallback timeout check:', {
            bannerElement: !!bannerElement,
            isAppInstalled: isAppInstalled()
        });
        if (!bannerElement && !isAppInstalled()) {
            console.log('[PWA-INSTALL] Fallback timeout, forcing init');
            init();
        }
    }, 1000);

    // ULTIMATE FALLBACK: Show banner after 3 seconds no matter what
    setTimeout(() => {
        console.log('[PWA-INSTALL] ULTIMATE FALLBACK check:', {
            bannerElement: !!bannerElement,
            documentBody: !!document.body,
            isAppInstalled: isAppInstalled(),
            wasRecentlyDismissed: wasRecentlyDismissed()
        });

        if (!bannerElement && document.body) {
            console.log('[PWA-INSTALL] ULTIMATE FALLBACK: Force showing banner');
            try {
                showBanner();
                console.log('[PWA-INSTALL] ULTIMATE FALLBACK: showBanner() called successfully');
            } catch (e) {
                console.error('[PWA-INSTALL] Error in ultimate fallback:', e);
            }
        } else {
            console.log('[PWA-INSTALL] ULTIMATE FALLBACK: Banner already exists or no body');
        }
    }, 3000);

    // FOR MOBILE DEBUGGING: Add visual indicator after 5 seconds
    // DISABLED in production - only enable for debugging
    /*
    setTimeout(() => {
        console.log('[PWA-INSTALL] 5 second check:', { bannerElement: !!bannerElement });
        if (!bannerElement && document.body) {
            const debugDiv = document.createElement('div');
            debugDiv.style.cssText = 'position:fixed;top:10px;left:10px;background:red;color:white;padding:10px;z-index:9999999;font-size:12px;';
            debugDiv.innerHTML = 'PWA: No banner after 5s. Check console.';
            document.body.appendChild(debugDiv);
            console.error('[PWA-INSTALL] DEBUG: No banner after 5 seconds! Check logs above.');
        }
    }, 5000);
    */

    // Expose functions for debugging
    window.PWAInstall = {
        showBanner: showBanner,
        hideBanner: hideBanner,
        showIOSOverlay: showIOSOverlay,
        showFirefoxOverlay: showFirefoxOverlay,
        isAppInstalled: isAppInstalled,
        wasRecentlyDismissed: wasRecentlyDismissed,
        isFirefox: isFirefox,
        clearDismissed: function() {
            localStorage.removeItem(CONFIG.STORAGE_KEY_DISMISSED);
            localStorage.removeItem(CONFIG.STORAGE_KEY_INSTALLED);
            console.log('[PWA-INSTALL] Cleared dismissed and installed state. Refresh to see banner.');
        }
    };

    console.log('[PWA-INSTALL] Setup complete');
})();
