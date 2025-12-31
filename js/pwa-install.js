/**
 * Simple PWA Install Manager
 * Handles service worker registration and install prompts
 *
 * Updated to work with pwa-early-capture.js for better Android Chrome support
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

            // Show banner if user is engaged
            if (this.userEngaged && !this.bannerShown) {
                this.showInstallBanner();
            }
        });

        // Listen for user engagement
        window.addEventListener('pwa-user-engaged', () => {
            console.log('[PWA] User engaged (from early capture)');
            this.userEngaged = true;

            // Show banner if we have the prompt
            if (this.installPrompt && !this.bannerShown) {
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

            if (this.userEngaged && !this.bannerShown) {
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
    }

    showInstallBanner() {
        console.log('[PWA] Checking if we should show install banner...');

        // CRITICAL: Only show if we actually have the install prompt
        if (!this.installPrompt) {
            console.log('[PWA] No install prompt available, not showing banner');
            return;
        }

        // Check if PWA meets installability criteria
        const isInstallable = this.checkPWAInstallability();
        if (!isInstallable) {
            console.log('[PWA] PWA not installable yet');
            return;
        }

        const isIOS = /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase());

        if (isIOS) {
            console.log('[PWA] iOS detected - showing iOS install banner');
            this.showIOSInstallBanner();
        } else {
            console.log('[PWA] Android/Chrome detected with install prompt - showing install banner');
            this.showInstallButton();
        }
    }

    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js', {
                    scope: '/'
                });
                console.log('[PWA] Service Worker registered:', registration);

                // Check if service worker is active
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

    checkPWAInstallability() {
        // Check basic PWA requirements
        const hasServiceWorker = 'serviceWorker' in navigator;
        const hasManifest = document.querySelector('link[rel="manifest"]');
        const isHTTPS = location.protocol === 'https:' || location.hostname === 'localhost';

        // Check if the site is already installed
        const isStandalone = globalThis.matchMedia('(display-mode: standalone)').matches;
        const isInWebApp = globalThis.matchMedia('(display-mode: standalone)').matches || globalThis.matchMedia('(display-mode: minimal-ui)').matches;
        const navigatorStandalone = navigator.standalone;
        const hasAppInstalled = localStorage.getItem('pwa-installed') === 'true';

        console.log('[PWA] Installability Check:', {
            hasServiceWorker,
            hasManifest,
            isHTTPS,
            isStandalone,
            isInWebApp,
            navigatorStandalone,
            hasAppInstalled,
            userAgent: navigator.userAgent,
            referrer: document.referrer,
            protocol: location.protocol,
            hostname: location.hostname
        });

        // If any installation indicator is true, don't show banner
        const isAlreadyInstalled = isStandalone || isInWebApp || navigatorStandalone || hasAppInstalled;

        if (isAlreadyInstalled) {
            console.log('[PWA] App already installed, hiding banner');
            return false;
        }

        const isInstallable = hasServiceWorker && hasManifest && isHTTPS;
        console.log('[PWA] Can be installed:', isInstallable);

        return isInstallable;
    }

    showInstallButton() {
        // Don't show if already shown
        if (this.bannerShown) {
            console.log('[PWA] Banner already shown, skipping');
            return;
        }

        console.log('[PWA] Showing install button...');
        this.bannerShown = true;

        // Remove any existing banners
        const existingBanner = document.getElementById('pwa-install-banner');
        if (existingBanner) {
            existingBanner.remove();
        }

        const banner = document.createElement('div');
        banner.id = 'pwa-install-banner';
        banner.className = 'pwa-install-banner';
        banner.innerHTML = `
            <div class="pwa-banner-content">
                <div class="pwa-banner-left">
                    <span class="pwa-banner-icon">📱</span>
                    <div class="pwa-banner-text">
                        <strong>התקן את Greek Souvlaki</strong>
                        <span>קבלו חוויה מהירה ונוחה יותר!</span>
                    </div>
                </div>
                <div class="pwa-banner-actions">
                    <button class="pwa-banner-btn-close" id="pwa-close-btn">
                        ✕
                    </button>
                    <button class="pwa-banner-btn-install" id="pwa-install-btn">
                        התקן עכשיו
                    </button>
                </div>
            </div>
        `;

        // Add comprehensive styles
        const style = document.createElement('style');
        style.textContent = `
            .pwa-install-banner {
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                right: 0 !important;
                background: linear-gradient(135deg, rgba(30, 64, 175, 0.97) 0%, rgba(55, 48, 163, 0.97) 100%) !important;
                color: white !important;
                z-index: 999999 !important;
                box-shadow: 0 4px 20px rgba(30, 58, 138, 0.3) !important;
                animation: slideDown 0.6s cubic-bezier(0.23, 1, 0.32, 1) !important;
                font-family: 'Inter', 'Poppins', sans-serif !important;
                backdrop-filter: blur(10px) !important;
                min-height: 90px !important;
                border-bottom: 3px solid rgba(255, 255, 255, 0.5) !important;
                display: block !important;
                visibility: visible !important;
                font-size: 14px !important;
                font-weight: 500 !important;
            }

            .pwa-banner-content {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 12px 20px;
                max-width: 1200px;
                margin: 0 auto;
                gap: 20px;
            }

            .pwa-banner-left {
                display: flex;
                align-items: center;
                gap: 12px;
                flex: 1;
            }

            .pwa-banner-icon {
                font-size: 24px;
                animation: bounce 2s infinite;
            }

            .pwa-banner-text {
                display: flex;
                flex-direction: column;
                line-height: 1.3;
            }

            .pwa-banner-text strong {
                font-size: 16px;
                font-weight: 600;
            }

            .pwa-banner-text span {
                font-size: 14px;
                opacity: 0.9;
            }

            .pwa-banner-actions {
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .pwa-banner-btn-close {
                background: rgba(255, 255, 255, 0.1);
                border: none;
                color: white;
                width: 36px;
                height: 36px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 18px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }

            .pwa-banner-btn-close:hover {
                background: rgba(255, 255, 255, 0.2);
                transform: scale(1.1);
            }

            .pwa-banner-btn-install {
                background: white;
                color: #1e40af;
                border: none;
                padding: 10px 20px;
                border-radius: 25px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                white-space: nowrap;
            }

            .pwa-banner-btn-install:hover {
                background: #f0f0f0;
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            }

            @keyframes slideDown {
                from {
                    transform: translateY(-100%);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }

            @keyframes bounce {
                0%, 20%, 53%, 80%, 100% {
                    transform: translateY(0);
                }
                40%, 43% {
                    transform: translateY(-3px);
                }
                70% {
                    transform: translateY(-2px);
                }
                90% {
                    transform: translateY(-1px);
                }
            }

            /* Mobile responsiveness */
            @media (max-width: 768px) {
                .pwa-install-banner {
                    min-height: 120px !important;
                    font-size: 16px !important;
                }

                .pwa-banner-content {
                    flex-direction: column;
                    text-align: center;
                    padding: 20px 15px;
                    gap: 15px;
                }

                .pwa-banner-left {
                    flex-direction: column;
                    gap: 10px;
                }

                .pwa-banner-icon {
                    font-size: 28px !important;
                }

                .pwa-banner-text strong {
                    font-size: 16px !important;
                }

                .pwa-banner-text span {
                    font-size: 14px !important;
                }

                .pwa-banner-actions {
                    width: 100%;
                    justify-content: center;
                    gap: 15px;
                }

                .pwa-banner-btn-close {
                    width: 40px !important;
                    height: 40px !important;
                    font-size: 20px !important;
                }

                .pwa-banner-btn-install {
                    flex: 1;
                    max-width: 250px !important;
                    padding: 12px 24px !important;
                    font-size: 16px !important;
                }
            }

            /* Extra small mobile devices */
            @media (max-width: 480px) {
                .pwa-install-banner {
                    min-height: 140px !important;
                }

                .pwa-banner-content {
                    padding: 25px 10px;
                }
            }

            /* Add space for banner on body */
            body {
                padding-top: 0 !important;
            }

            body.has-pwa-banner {
                padding-top: 70px !important;
            }

            @media (max-width: 768px) {
                body.has-pwa-banner {
                    padding-top: 110px !important;
                }
            }
        `;
        document.head.appendChild(style);

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
        document.body.appendChild(banner);

        // Make available globally
        globalThis.pwaManager = this;

        console.log('[PWA] Install button banner added to page');
    }

    showIOSInstallBanner() {
        // Don't show if already shown
        if (this.bannerShown) {
            console.log('[PWA] Banner already shown, skipping');
            return;
        }

        console.log('[PWA] Showing iOS install instructions...');
        this.bannerShown = true;

        const banner = document.createElement('div');
        banner.id = 'pwa-ios-install-banner';
        banner.className = 'pwa-ios-install-banner';
        banner.innerHTML = `
            <div class="pwa-ios-banner-content">
                <div class="pwa-ios-banner-header">
                    <span class="pwa-ios-banner-icon">📱</span>
                    <div class="pwa-ios-banner-text">
                        <strong>התקינו את האפליקציה שלנו</strong>
                        <span>לחצו על השתתף ואז "למסך הבית"</span>
                    </div>
                    <button class="pwa-ios-banner-btn-close" id="pwa-ios-close-btn">
                        ✕
                    </button>
                </div>
                <div class="pwa-ios-banner-steps">
                    <div class="pwa-ios-step">
                        <div class="pwa-ios-step-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="4" y="4" width="16" height="16" rx="2"/>
                                <circle cx="12" cy="12" r="3"/>
                            </svg>
                        </div>
                        <span>לחצו על כפתור השתתף</span>
                    </div>
                    <div class="pwa-ios-step">
                        <div class="pwa-ios-step-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="4" y="4" width="16" height="16" rx="2"/>
                                <rect x="9" y="9" width="6" height="6"/>
                            </svg>
                        </div>
                        <span>גללו למטה ובחרו "למסך הבית"</span>
                    </div>
                    <div class="pwa-ios-step">
                        <div class="pwa-ios-step-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M5 12l5 5l10 -10"/>
                            </svg>
                        </div>
                        <span>לחצו "הוסף" וסיימתם!</span>
                    </div>
                </div>
            </div>
        `;

        const style = document.createElement('style');
        style.textContent = `
            .pwa-ios-install-banner {
                position: fixed !important;
                bottom: 0 !important;
                left: 0 !important;
                right: 0 !important;
                background: linear-gradient(180deg, rgba(30, 64, 175, 0.98) 0%, rgba(55, 48, 163, 0.98) 100%) !important;
                color: white !important;
                z-index: 999999 !important;
                box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.2) !important;
                animation: slideUp 0.5s cubic-bezier(0.23, 1, 0.32, 1) !important;
                font-family: 'Inter', 'Poppins', sans-serif !important;
                border-top: 2px solid rgba(255, 255, 255, 0.3) !important;
            }

            .pwa-ios-banner-content {
                padding: 20px 20px 30px;
                max-width: 500px;
                margin: 0 auto;
            }

            .pwa-ios-banner-header {
                display: flex;
                align-items: center;
                gap: 15px;
                margin-bottom: 20px;
            }

            .pwa-ios-banner-icon {
                font-size: 32px;
                flex-shrink: 0;
            }

            .pwa-ios-banner-text {
                flex: 1;
                display: flex;
                flex-direction: column;
                line-height: 1.3;
            }

            .pwa-ios-banner-text strong {
                font-size: 18px;
                font-weight: 600;
            }

            .pwa-ios-banner-text span {
                font-size: 14px;
                opacity: 0.9;
            }

            .pwa-ios-banner-btn-close {
                background: rgba(255, 255, 255, 0.1);
                border: none;
                color: white;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
                flex-shrink: 0;
            }

            .pwa-ios-banner-btn-close:hover {
                background: rgba(255, 255, 255, 0.2);
            }

            .pwa-ios-banner-steps {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }

            .pwa-ios-step {
                display: flex;
                align-items: center;
                gap: 15px;
                background: rgba(255, 255, 255, 0.1);
                padding: 12px 15px;
                border-radius: 12px;
                font-size: 14px;
            }

            .pwa-ios-step-icon {
                width: 36px;
                height: 36px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
            }

            .pwa-ios-step-icon svg {
                width: 20px;
                height: 20px;
            }

            @keyframes slideUp {
                from {
                    transform: translateY(100%);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }

            @media (max-width: 480px) {
                .pwa-ios-banner-content {
                    padding: 15px 15px 25px;
                }
                .pwa-ios-banner-text strong {
                    font-size: 16px;
                }
                .pwa-ios-banner-text span {
                    font-size: 13px;
                }
            }
        `;
        document.head.appendChild(style);

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
        // Check if we have the install prompt
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

        // Fallback: This shouldn't happen with the new implementation
        console.error('[PWA] Install prompt not available - this should not happen!');
        console.log('[PWA] Debug info:', {
            hasPrompt: !!this.installPrompt,
            userEngaged: this.userEngaged,
            bannerShown: this.bannerShown,
            earlyCapturePrompt: !!window._pwaInstallPrompt,
            earlyCaptureCaptured: window._pwaInstallPromptCaptured
        });
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

// Global function for manual testing on mobile
window.showPWAInstallBanner = function() {
    if (window.pwaManager) {
        console.log('[PWA] Manual trigger - showing install banner');
        window.pwaManager.showInstallBanner();
    }
};
