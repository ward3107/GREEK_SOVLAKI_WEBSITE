/**
 * Simple PWA Install Manager
 * Handles service worker registration and install prompts
 */

// PWA Install Manager
class PWAInstallManager {
    constructor() {
        this.installPrompt = null;
        this.init();
    }

    init() {
        console.log('[PWA] Initializing...');

        // Register service worker
        this.registerServiceWorker();

        // Set up install prompt
        globalThis.addEventListener('beforeinstallprompt', (e) => {
            console.log('[PWA] Install prompt detected!');
            e.preventDefault();
            this.installPrompt = e;
            this.showInstallButton();
        });

        // Handle app installed
        globalThis.addEventListener('appinstalled', () => {
            console.log('[PWA] App installed successfully');
            localStorage.setItem('pwa-installed', 'true');
            this.hideInstallButton();
        });

        // Show install banner after a delay for mobile users
        setTimeout(() => {
            console.log('[PWA] Checking installability...');

            // Check if PWA meets installability criteria
            const isInstallable = this.checkPWAInstallability();

            if (this.installPrompt || isInstallable) {
                console.log('[PWA] PWA is installable, showing banner');
                this.showInstallButton();
            } else {
                console.log('[PWA] PWA not installable yet, showing demo banner');
                this.showInstallButton();
            }
        }, 2000);
    }

    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js');
                console.log('Service Worker registered:', registration);
                return registration;
            } catch (error) {
                console.log('Service Worker registration failed:', error);
            }
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
            referrer: document.referrer
        });

        // If any installation indicator is true, don't show banner
        const isAlreadyInstalled = isStandalone || isInWebApp || navigatorStandalone || hasAppInstalled;

        if (isAlreadyInstalled) {
            console.log('[PWA] App already installed, hiding banner');
            return false;
        }

        return hasServiceWorker && hasManifest && isHTTPS;
    }

    showInstallButton() {
        console.log('[PWA] Showing install button...');

        // DEBUG: Check for existing banners
        const existingBanner = document.getElementById('pwa-install-banner');
        const allBanners = document.querySelectorAll('[id*="pwa-install"], [class*="pwa-install"]');

        console.log('[PWA] Existing banners found:', existingBanner);
        console.log('[PWA] All PWA-related elements:', allBanners.length);

              // Remove all existing PWA banners to prevent duplicates
        allBanners.forEach(banner => {
            console.log('[PWA] Removing existing banner:', banner);
            banner.remove();
        });

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

        // Add event listeners for buttons (CSP-safe)
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

        // Store reference for promptInstall method
        this.bannerElement = banner;
        document.body.appendChild(banner);

        // Make promptInstall available globally for other potential uses
        globalThis.pwaManager = this;

        console.log('[PWA] Install button banner added to page');
    }

    hideInstallButton() {
        const banner = document.getElementById('pwa-install-banner');
        if (banner) banner.remove();

        // Remove body spacing class
        document.body.classList.remove('has-pwa-banner');
    }

    async promptInstall() {
        if (!this.installPrompt) {
            alert('ההתקנה אינה זמינה כרגע');
            return;
        }

        const result = await this.installPrompt.prompt();
        this.installPrompt = null;
        // Don't hide immediately - let onAppInstalled handle it
        if (result.outcome === 'accepted') {
            console.log('User accepted the install prompt');
        } else {
            console.log('User dismissed the install prompt');
        }
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        ;
    });
} else { ;
}

// Global function for manual testing on mobile
window.showPWAInstallBanner = function() {
    if (window.pwaManager) {
        console.log('[PWA] Manual trigger - showing install banner');
        window.pwaManager.showInstallButton();
    }
};