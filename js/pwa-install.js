/**
 * Simple PWA Install Manager
 * Handles service worker registration and install prompts
 *
 * Shows install banner with one-click install if available,
 * or manual install instructions otherwise.
 */

class PWAInstallManager {
    constructor() {
        this.installPrompt = null;
        this.userEngaged = false;
        this.bannerShown = false;
        this.init();
    }

    init() {
        console.log('[PWA] Initializing...');
        console.log('[PWA] User Agent:', navigator.userAgent);
        console.log('[PWA] Platform:', navigator.platform);

        // Detect device type
        const isIOS = /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase());
        const isAndroid = /android/.test(navigator.userAgent.toLowerCase());
        const isMobile = /mobile|android|iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase());

        console.log('[PWA] Device detection:', {
            isIOS,
            isAndroid,
            isMobile,
            userAgent: navigator.userAgent,
            platform: navigator.platform
        });

        // Check if early capture already caught the prompt
        if (window._pwaInstallPrompt) {
            console.log('[PWA] Early capture already has the install prompt!');
            this.installPrompt = window._pwaInstallPrompt;
        }

        // Check if user is already engaged
        if (window._pwaUserEngaged) {
            console.log('[PWA] User already engaged (from early capture)');
            this.userEngaged = true;
        }

        // Listen for early capture events
        window.addEventListener('pwa-install-prompt-captured', (e) => {
            console.log('[PWA] Received install prompt from early capture');
            this.installPrompt = e.detail.prompt;

            // Update banner if already shown
            if (this.bannerShown) {
                this.updateBannerForAutoInstall();
            } else if (this.userEngaged) {
                this.showInstallBanner();
            }
        });

        // Listen for user engagement
        window.addEventListener('pwa-user-engaged', () => {
            console.log('[PWA] User engaged (from early capture)');
            this.userEngaged = true;

            // Show banner after engagement
            if (!this.bannerShown) {
                this.showInstallBanner();
            }
        });

        // Listen for app installed
        window.addEventListener('pwa-app-installed', () => {
            console.log('[PWA] App installed (from early capture)');
            this.hideInstallButton();
        });

        // Also set up the regular event listener (backup)
        window.addEventListener('beforeinstallprompt', (e) => {
            console.log('[PWA] Install prompt detected (backup listener)!');
            e.preventDefault();
            this.installPrompt = e;

            // Update banner if already shown
            if (this.bannerShown) {
                this.updateBannerForAutoInstall();
            } else if (this.userEngaged) {
                this.showInstallBanner();
            }
        });

        // Handle app installed (backup)
        window.addEventListener('appinstalled', () => {
            console.log('[PWA] App installed successfully (backup listener)');
            localStorage.setItem('pwa-installed', 'true');
            this.hideInstallButton();
        });

        // Register service worker
        this.registerServiceWorker();

        // Auto-show banner after a delay regardless of prompt availability
        // This ensures users see install instructions even if Chrome won't fire beforeinstallprompt
        setTimeout(() => {
            if (!this.bannerShown && !this.isAlreadyInstalled()) {
                console.log('[PWA] Auto-showing banner after delay');
                this.showInstallBanner();
            }
        }, 3000);
    }

    showInstallBanner() {
        console.log('[PWA] Checking if we should show install banner...');

        // Don't show if already installed
        if (this.isAlreadyInstalled()) {
            console.log('[PWA] App already installed, not showing banner');
            return;
        }

        // Don't show if already shown
        if (this.bannerShown) {
            console.log('[PWA] Banner already shown, skipping');
            return;
        }

        const isIOS = /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase());

        if (isIOS) {
            console.log('[PWA] iOS detected - showing iOS install banner');
            this.showIOSInstallBanner();
        } else {
            console.log('[PWA] Android/Desktop detected - showing install banner');
            this.showInstallButton();
        }
    }

    isAlreadyInstalled() {
        const isStandalone = globalThis.matchMedia('(display-mode: standalone)').matches;
        const navigatorStandalone = navigator.standalone;
        const hasAppInstalled = localStorage.getItem('pwa-installed') === 'true';

        console.log('[PWA] Already installed check:', {
            isStandalone,
            navigatorStandalone,
            hasAppInstalled
        });

        return isStandalone || navigatorStandalone || hasAppInstalled;
    }

    updateBannerForAutoInstall() {
        const installBtn = document.getElementById('pwa-install-btn');
        if (installBtn) {
            installBtn.textContent = 'התקן עכשיו';
            installBtn.disabled = false;
            installBtn.style.background = 'white';
            installBtn.style.color = '#1e40af';
            console.log('[PWA] Banner updated for auto-install');
        }
    }

    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js', {
                    scope: '/'
                });
                console.log('[PWA] Service Worker registered:', registration);

                if (registration.active) {
                    console.log('[PWA] Service Worker is active');
                } else if (registration.installing) {
                    console.log('[PWA] Service Worker is installing');
                    registration.installing.addEventListener('statechange', () => {
                        console.log('[PWA] Service Worker state changed to:', registration.active?.state);
                    });
                } else if (registration.waiting) {
                    console.log('[PWA] Service Worker is waiting');
                }

                return registration;
            } catch (error) {
                console.error('[PWA] Service Worker registration failed:', error);
            }
        } else {
            console.warn('[PWA] Service Worker not supported in this browser');
        }
        return null;
    }

    showInstallButton() {
        console.log('[PWA] Showing install button...');
        this.bannerShown = true;

        // Remove any existing banners
        const existingBanner = document.getElementById('pwa-install-banner');
        if (existingBanner) {
            existingBanner.remove();
        }

        const hasAutoInstall = !!this.installPrompt;
        const buttonText = hasAutoInstall ? 'התקן עכשיו' : 'איך להתקין';
        const buttonStyle = hasAutoInstall ? '' : 'background: #fbbf24 !important; color: #1e3a8a !important;';

        console.log('[PWA] Creating banner with auto-install:', hasAutoInstall);

        const banner = document.createElement('div');
        banner.id = 'pwa-install-banner';
        banner.className = 'pwa-install-banner';

        // Use inline styles to ensure they're applied
        banner.style.cssText = `
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            background: linear-gradient(135deg, rgba(30, 64, 175, 0.97) 0%, rgba(55, 48, 163, 0.97) 100%) !important;
            color: white !important;
            z-index: 2147483647 !important;
            box-shadow: 0 4px 20px rgba(30, 58, 138, 0.3) !important;
            font-family: 'Inter', 'Poppins', sans-serif !important;
            backdrop-filter: blur(10px) !important;
            min-height: 90px !important;
            border-bottom: 3px solid rgba(255, 255, 255, 0.5) !important;
            display: block !important;
            visibility: visible !important;
            font-size: 14px !important;
            font-weight: 500 !important;
            animation: slideDown 0.6s cubic-bezier(0.23, 1, 0.32, 1) !important;
        `;

        banner.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 20px; max-width: 1200px; margin: 0 auto; gap: 20px;">
                <div style="display: flex; align-items: center; gap: 12px; flex: 1;">
                    <span style="font-size: 24px; animation: bounce 2s infinite;">📱</span>
                    <div style="display: flex; flex-direction: column; line-height: 1.3;">
                        <strong style="font-size: 16px; font-weight: 600;">התקן את Greek Souvlaki</strong>
                        <span style="font-size: 14px; opacity: 0.9;">${hasAutoInstall ? 'קבלו חוויה מהירה ונוחה יותר!' : 'התקינו את האפליקציה לחוויה מהירה יותר'}</span>
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: 12px;">
                    <button id="pwa-close-btn" style="background: rgba(255, 255, 255, 0.1); border: none; color: white; width: 36px; height: 36px; border-radius: 50%; cursor: pointer; font-size: 18px; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease;">
                        ✕
                    </button>
                    <button id="pwa-install-btn" style="${buttonStyle} background: white; color: #1e40af; border: none; padding: 10px 20px; border-radius: 25px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; white-space: nowrap;">
                        ${buttonText}
                    </button>
                </div>
            </div>
            <style>
                @keyframes slideDown {
                    from { transform: translateY(-100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                @keyframes bounce {
                    0%, 20%, 53%, 80%, 100% { transform: translateY(0); }
                    40%, 43% { transform: translateY(-3px); }
                    70% { transform: translateY(-2px); }
                    90% { transform: translateY(-1px); }
                }
                @media (max-width: 768px) {
                    #pwa-install-banner {
                        min-height: 120px !important;
                    }
                    #pwa-install-banner > div {
                        flex-direction: column !important;
                        text-align: center !important;
                        padding: 20px 15px !important;
                    }
                    #pwa-install-banner > div > div:first-child {
                        flex-direction: column !important;
                    }
                    #pwa-install-btn {
                        flex: 1 !important;
                        max-width: 250px !important;
                        padding: 12px 24px !important;
                        font-size: 16px !important;
                    }
                }
            </style>
        `;

        // Add class to body for spacing
        document.body.classList.add('has-pwa-banner');

        // Add event listeners for buttons
        const closeBtn = banner.querySelector('#pwa-close-btn');
        const installBtn = banner.querySelector('#pwa-install-btn');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hideInstallButton();
            });
        }

        if (installBtn) {
            installBtn.addEventListener('click', () => {
                this.promptInstall();
            });
        }

        // Store reference
        this.bannerElement = banner;

        // Append to document - use document.body first, fallback to document.documentElement
        try {
            document.body.appendChild(banner);
            console.log('[PWA] Banner added to body');
        } catch (e) {
            console.error('[PWA] Failed to add banner to body:', e);
            try {
                document.documentElement.appendChild(banner);
                console.log('[PWA] Banner added to documentElement');
            } catch (e2) {
                console.error('[PWA] Failed to add banner to documentElement:', e2);
            }
        }

        // Make available globally
        globalThis.pwaManager = this;

        console.log('[PWA] Install button banner added to page (auto-install:', hasAutoInstall, ')');
        console.log('[PWA] Banner element:', banner);
        console.log('[PWA] Banner visible:', banner.style.display, banner.style.visibility);
    }

    showIOSInstallBanner() {
        console.log('[PWA] Showing iOS install instructions...');
        this.bannerShown = true;

        const banner = document.createElement('div');
        banner.id = 'pwa-ios-install-banner';
        banner.className = 'pwa-ios-install-banner';

        // Use inline styles
        banner.style.cssText = `
            position: fixed !important;
            bottom: 0 !important;
            left: 0 !important;
            right: 0 !important;
            background: linear-gradient(180deg, rgba(30, 64, 175, 0.98) 0%, rgba(55, 48, 163, 0.98) 100%) !important;
            color: white !important;
            z-index: 2147483647 !important;
            box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.2) !important;
            font-family: 'Inter', 'Poppins', sans-serif !important;
            border-top: 2px solid rgba(255, 255, 255, 0.3) !important;
            display: block !important;
            visibility: visible !important;
            animation: slideUp 0.5s cubic-bezier(0.23, 1, 0.32, 1) !important;
        `;

        banner.innerHTML = `
            <div style="padding: 20px 20px 30px; max-width: 500px; margin: 0 auto;">
                <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 20px;">
                    <span style="font-size: 32px; flex-shrink: 0;">📱</span>
                    <div style="flex: 1; display: flex; flex-direction: column; line-height: 1.3;">
                        <strong style="font-size: 18px; font-weight: 600;">התקינו את האפליקציה שלנו</strong>
                        <span style="font-size: 14px; opacity: 0.9;">לחצו על השתתף ואז "למסך הבית"</span>
                    </div>
                    <button id="pwa-ios-close-btn" style="background: rgba(255, 255, 255, 0.1); border: none; color: white; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease; flex-shrink: 0;">
                        ✕
                    </button>
                </div>
                <div style="display: flex; flex-direction: column; gap: 12px;">
                    <div style="display: flex; align-items: center; gap: 15px; background: rgba(255, 255, 255, 0.1); padding: 12px 15px; border-radius: 12px; font-size: 14px;">
                        <div style="width: 36px; height: 36px; background: rgba(255, 255, 255, 0.2); border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="4" y="4" width="16" height="16" rx="2"/>
                                <circle cx="12" cy="12" r="3"/>
                            </svg>
                        </div>
                        <span>לחצו על כפתור השתתף</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 15px; background: rgba(255, 255, 255, 0.1); padding: 12px 15px; border-radius: 12px; font-size: 14px;">
                        <div style="width: 36px; height: 36px; background: rgba(255, 255, 255, 0.2); border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="4" y="4" width="16" height="16" rx="2"/>
                                <rect x="9" y="9" width="6" height="6"/>
                            </svg>
                        </div>
                        <span>גללו למטה ובחרו "למסך הבית"</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 15px; background: rgba(255, 255, 255, 0.1); padding: 12px 15px; border-radius: 12px; font-size: 14px;">
                        <div style="width: 36px; height: 36px; background: rgba(255, 255, 255, 0.2); border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M5 12l5 5l10 -10"/>
                            </svg>
                        </div>
                        <span>לחצו "הוסף" וסיימתם!</span>
                    </div>
                </div>
            </div>
            <style>
                @keyframes slideUp {
                    from { transform: translateY(100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            </style>
        `;

        const closeBtn = banner.querySelector('#pwa-ios-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hideIOSInstallBanner();
            });
        }

        this.iosBannerElement = banner;
        document.body.appendChild(banner);

        console.log('[PWA] iOS install banner added to page');
    }

    hideIOSInstallBanner() {
        const banner = document.getElementById('pwa-ios-install-banner');
        if (banner) banner.remove();
    }

    hideInstallButton() {
        const banner = document.getElementById('pwa-install-banner');
        if (banner) banner.remove();

        document.body.classList.remove('has-pwa-banner');
    }

    async promptInstall() {
        // Check if we have the install prompt for one-click install
        if (this.installPrompt) {
            console.log('[PWA] Prompting user to install...');

            const result = await this.installPrompt.prompt();
            this.installPrompt = null;

            if (result.outcome === 'accepted') {
                console.log('[PWA] User accepted the install prompt');
            } else {
                console.log('[PWA] User dismissed the install prompt');
            }
            return;
        }

        // Manual install instructions
        console.log('[PWA] Showing manual install instructions');

        const isAndroid = /android/.test(navigator.userAgent.toLowerCase());
        const isChrome = /chrome/.test(navigator.userAgent.toLowerCase()) && !/edge|edg/.test(navigator.userAgent.toLowerCase());
        const isSamsung = /samsung/.test(navigator.userAgent.toLowerCase());

        let message = '';

        if (isAndroid && isChrome) {
            message = `📱 להתקנת האפליקציה ב-Android Chrome:

1. לחצו על תפריט (⋮) בפינה הימנית העליונה
2. בחרו "הוספה למסך הבית" או "Install app"
3. לחצו "הוסף" כדי לסיים

💡 טיפ: בקרו באתר מספר פעמים כדי לקבל התראה להתקנה מהירה יותר!`;
        } else if (isSamsung) {
            message = `📱 להתקנת האפליקציה ב-Samsung Internet:

1. לחצו על תפריט (⋮)
2. בחרו "הוספה למסך הבית"
3. לחצו "הוסף"`;
        } else {
            message = `📱 להתקנת האפליקציה:

Android Chrome:
1. תפריט (⋮) → "הוספה למסך הבית"

Samsung Internet:
1. תפריט (⋮) → "הוספה למסך הבית"

Firefox:
1. תפריט (⋮) → "Install"

💡 בקרו באתר מספר פעמים להתקנה אוטומטית!`;
        }

        alert(message);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new PWAInstallManager();
    });
} else {
    new PWAInstallManager();
}

// Global function for manual testing
window.showPWAInstallBanner = function() {
    if (window.pwaManager) {
        console.log('[PWA] Manual trigger - showing install banner');
        window.pwaManager.showInstallBanner();
    }
};
