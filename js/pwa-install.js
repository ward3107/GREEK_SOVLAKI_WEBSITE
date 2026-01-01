// PWA Install Manager - Simplified and more robust
console.log('[PWA] Script loaded!');

(function() {
    'use strict';

    console.log('[PWA] IIFE running...');

    // Check if DOM is ready
    function initPWA() {
        console.log('[PWA] initPWA called');

        try {
            // Don't show if already installed
            const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
            const hasAppInstalled = localStorage.getItem('pwa-installed') === 'true';

            console.log('[PWA] Install check:', { isStandalone, hasAppInstalled });

            if (isStandalone || hasAppInstalled) {
                console.log('[PWA] Already installed, skipping');
                return;
            }

            // Wait a bit and show banner
            setTimeout(() => {
                console.log('[PWA] Showing banner after delay');
                showInstallBanner();
            }, 3000);

        } catch (error) {
            console.error('[PWA] Init error:', error);
        }
    }

    function showInstallBanner() {
        console.log('[PWA] showInstallBanner called');

        // Check if already shown
        if (document.getElementById('pwa-install-banner') || document.getElementById('pwa-ios-install-banner')) {
            console.log('[PWA] Banner already exists');
            return;
        }

        const isIOS = /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase());
        console.log('[PWA] isIOS:', isIOS);

        if (isIOS) {
            showIOSBanner();
        } else {
            showAndroidBanner();
        }
    }

    function showAndroidBanner() {
        console.log('[PWA] Creating Android banner');

        const banner = document.createElement('div');
        banner.id = 'pwa-install-banner';
        banner.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; right: 0; background: linear-gradient(135deg, #1e40af 0%, #3730a7 100%); color: white; z-index: 2147483647; padding: 15px; display: flex; align-items: center; justify-content: center; gap: 15px; box-shadow: 0 4px 20px rgba(0,0,0,0.3);">
                <span style="font-size: 28px; animation: bounce 2s infinite;">📱</span>
                <div style="text-align: center;">
                    <div style="font-weight: 600; font-size: 16px; margin-bottom: 5px;">התקן את Greek Souvlaki</div>
                    <div style="font-size: 13px; opacity: 0.9; margin-bottom: 10px;">התקינו את האפליקציה לחוויה מהירה יותר</div>
                    <button id="pwa-install-btn" style="background: #fbbf24; color: #1e3a8a; border: none; padding: 10px 25px; border-radius: 25px; font-size: 14px; font-weight: 600; cursor: pointer; margin-right: 10px;">איך להתקין</button>
                    <button id="pwa-close-btn" style="background: rgba(255,255,255,0.2); color: white; border: none; padding: 8px 15px; border-radius: 20px; font-size: 13px; cursor: pointer;">סגור</button>
                </div>
            </div>
            <style>
                @keyframes bounce {
                    0%, 20%, 53%, 80%, 100% { transform: translateY(0); }
                    40%, 43% { transform: translateY(-3px); }
                    70% { transform: translateY(-2px); }
                }
                @media (max-width: 768px) {
                    #pwa-install-banner > div {
                        flex-direction: column !important;
                        text-align: center !important;
                        padding: 20px 15px !important;
                    }
                }
            </style>
        `;

        // Add to body
        document.body.appendChild(banner);
        console.log('[PWA] Android banner added to DOM');

        // Add event listeners
        document.getElementById('pwa-install-btn').addEventListener('click', showInstallInstructions);
        document.getElementById('pwa-close-btn').addEventListener('click', hideBanner);
    }

    function showIOSBanner() {
        console.log('[PWA] Creating iOS banner');

        const banner = document.createElement('div');
        banner.id = 'pwa-ios-install-banner';
        banner.innerHTML = `
            <div style="position: fixed; bottom: 0; left: 0; right: 0; background: linear-gradient(180deg, #1e40af 0%, #3730a7 100%); color: white; z-index: 2147483647; padding: 20px; text-align: center;">
                <div style="font-size: 32px; margin-bottom: 10px;">📱</div>
                <div style="font-weight: 600; font-size: 18px; margin-bottom: 10px;">התקינו את האפליקציה</div>
                <div style="font-size: 14px; margin-bottom: 15px;">לחצו על השתתף <span style="font-size: 18px;">⎋</span> ואז "למסך הבית"</div>
                <button id="pwa-ios-close-btn" style="background: rgba(255,255,255,0.2); color: white; border: none; padding: 8px 20px; border-radius: 20px; cursor: pointer;">סגור</button>
            </div>
        `;

        document.body.appendChild(banner);
        console.log('[PWA] iOS banner added to DOM');

        document.getElementById('pwa-ios-close-btn').addEventListener('click', hideBanner);
    }

    function showInstallInstructions() {
        const message = `📱 להתקנת האפליקציה ב-Android Chrome:

1. לחצו על תפריט (⋮) בפינה הימנית העליונה
2. בחרו "הוספה למסך הבית" או "Install app"
3. לחצו "הוסף" כדי לסיים

💡 טיפ: בקרו באתר מספר פעמים כדי לקבל התראה להתקנה מהירה יותר!`;

        alert(message);
    }

    function hideBanner() {
        const banner = document.getElementById('pwa-install-banner');
        const iosBanner = document.getElementById('pwa-ios-install-banner');
        if (banner) banner.remove();
        if (iosBanner) iosBanner.remove();
    }

    // Listen for beforeinstallprompt
    window.addEventListener('beforeinstallprompt', (e) => {
        console.log('[PWA] beforeinstallprompt fired!');
        // Don't prevent default - let Chrome show the native prompt
    });

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPWA);
    } else {
        initPWA();
    }

    // Global function for manual trigger
    window.showPWAInstallBanner = function() {
        console.log('[PWA] Manual trigger called');
        showInstallBanner();
    };

    console.log('[PWA] Setup complete');
})();
