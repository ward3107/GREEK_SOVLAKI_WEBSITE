// PWA Install Banner - Shows immediately, captures prompt for one-click install
console.log('[PWA] ===== SCRIPT LOADED =====');
console.log('[PWA] document.readyState:', document.readyState);

(function() {
    'use strict';

    let deferredPrompt = null;
    let bannerElement = null;

    // Check if already installed
    function isAlreadyInstalled() {
        return window.matchMedia('(display-mode: standalone)').matches ||
               localStorage.getItem('pwa-installed') === 'true';
    }

    // Create and show banner IMMEDIATELY
    function showBanner() {
        console.log('[PWA] ===== SHOW BANNER CALLED =====');

        if (isAlreadyInstalled()) {
            console.log('[PWA] Already installed, not showing banner');
            return;
        }

        // Check if banner already exists
        if (document.getElementById('pwa-install-banner')) {
            console.log('[PWA] Banner already exists, updating');
            updateBannerButton();
            return;
        }

        const isMobile = /android|iphone|ipad|ipod|mobile/i.test(navigator.userAgent);
        console.log('[PWA] isMobile:', isMobile);
        console.log('[PWA] navigator.userAgent:', navigator.userAgent);

        // Create banner
        bannerElement = document.createElement('div');
        bannerElement.id = 'pwa-install-banner';
        bannerElement.style.cssText = 'position:fixed!important;top:0!important;left:0!important;right:0!important;background:linear-gradient(135deg,#1e40af,#3730a7)!important;color:#fff!important;z-index:2147483647!important;padding:12px 20px!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:15px!important;box-shadow:0 4px 20px rgba(0,0,0,0.3)!important;font-family:sans-serif!important;';

        bannerElement.innerHTML = `
            <div style="display:flex;align-items:center;gap:12px;flex:1;max-width:1200px;margin:0 auto;">
                <span style="font-size:28px;animation:bounce 2s infinite;flex-shrink:0;">📱</span>
                <div style="flex:1;text-align:center;">
                    <div style="font-weight:600;font-size:16px;margin-bottom:3px;">התקן את Greek Souvlaki</div>
                    <div style="font-size:13px;opacity:0.9;" id="pwa-banner-subtitle">קבלו חוויה מהירה יותר!</div>
                </div>
                <div style="display:flex;gap:10px;flex-shrink:0;">
                    <button id="pwa-close-btn" style="background:rgba(255,255,255,0.2);color:#fff;border:none;padding:8px 15px;border-radius:20px;font-size:13px;cursor:pointer;">✕</button>
                    <button id="pwa-install-btn" style="background:#fbbf24;color:#1e3a8a;border:none;padding:10px 25px;border-radius:25px;font-size:14px;font-weight:600;cursor:pointer;">התקן עכשיו</button>
                </div>
            </div>
            <style>
                @keyframes bounce {0%,20%,53%,80%,100%{transform:translateY(0)}40%,43%{transform:translateY(-3px)}70%{transform:translateY(-2px)}}
                @media (max-width:768px) {
                    #pwa-install-banner{flex-direction:column!important;padding:20px 15px!important;}
                    #pwa-install-banner>div{flex-direction:column!important;text-align:center!important;}
                    #pwa-install-banner button{width:100%!important;max-width:250px!important;}
                }
            </style>
        `;

        // Add to body
        try {
            if (document.body) {
                document.body.appendChild(bannerElement);
                console.log('[PWA] ===== BANNER ADDED TO BODY =====');
            } else {
                console.error('[PWA] document.body is null!');
                // Try adding to documentElement
                document.documentElement.appendChild(bannerElement);
                console.log('[PWA] ===== BANNER ADDED TO DOCUMENT ELEMENT =====');
            }
        } catch (e) {
            console.error('[PWA] Error adding banner:', e);
        }

        // Add event listeners
        const installBtn = document.getElementById('pwa-install-btn');
        const closeBtn = document.getElementById('pwa-close-btn');

        if (installBtn) {
            installBtn.addEventListener('click', handleInstallClick);
            console.log('[PWA] Install button listener added');
        } else {
            console.error('[PWA] Install button not found!');
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', hideBanner);
        }

        updateBannerButton();
    }

    function updateBannerButton() {
        const btn = document.getElementById('pwa-install-btn');
        if (!btn) return;

        if (deferredPrompt) {
            btn.textContent = 'התקן עכשיו';
            btn.style.background = '#fff';
            btn.style.color = '#1e3a8a';
            console.log('[PWA] ===== BUTTON UPDATED FOR ONE-CLICK =====');
        } else {
            btn.textContent = 'התקן עכשיו';
            btn.style.background = '#fbbf24';
            btn.style.color = '#1e3a8a';
            console.log('[PWA] ===== BUTTON SET FOR INSTRUCTIONS =====');
        }
    }

    function handleInstallClick(e) {
        e.preventDefault();
        console.log('[PWA] ===== INSTALL BUTTON CLICKED =====');
        console.log('[PWA] deferredPrompt:', deferredPrompt);

        if (deferredPrompt) {
            // One-click install available!
            console.log('[PWA] Triggering one-click install...');
            deferredPrompt.prompt()
                .then((result) => {
                    console.log('[PWA] Install result:', result.outcome);
                    if (result.outcome === 'accepted') {
                        console.log('[PWA] User accepted install');
                        localStorage.setItem('pwa-installed', 'true');
                        hideBanner();
                    } else {
                        console.log('[PWA] User dismissed install');
                    }
                    deferredPrompt = null;
                    updateBannerButton();
                })
                .catch((err) => {
                    console.error('[PWA] Install error:', err);
                    deferredPrompt = null;
                    updateBannerButton();
                });
        } else {
            // Show manual instructions
            console.log('[PWA] No deferred prompt, showing manual instructions');
            const isAndroid = /android/i.test(navigator.userAgent);
            const isChrome = /chrome/i.test(navigator.userAgent) && !/edge|edg/i.test(navigator.userAgent);

            let message = '';
            if (isAndroid && isChrome) {
                message = `📱 להתקנת האפליקציה:

1. לחצו על תפריט (⋮) בפינה הימנית העליונה
2. בחרו "הוספה למסך הבית" או "Install app"
3. לחצו "הוסף" כדי לסיים

💡 טיפ: בקרו באתר מספר פעמים כדי לקבל את האפשרות להתקנה מהירה!`;
            } else {
                message = `📱 להתקנת האפליקציה:

Android Chrome: תפריט (⋮) → "הוספה למסך הבית"

Samsung: תפריט (⋮) → "הוספה למסך הבית"`;
            }
            alert(message);
        }
    }

    function hideBanner() {
        const banner = document.getElementById('pwa-install-banner');
        if (banner) {
            banner.remove();
            console.log('[PWA] Banner hidden');
        }
    }

    // CAPTURE the install prompt - don't prevent default, just store it
    window.addEventListener('beforeinstallprompt', (e) => {
        console.log('[PWA] ===== beforeinstallprompt FIRED! =====');
        console.log('[PWA] Event:', e);

        // Store the prompt for later use
        deferredPrompt = e;
        console.log('[PWA] Prompt stored, banner will be updated');

        // Update banner if already shown
        if (bannerElement) {
            updateBannerButton();
        }
    });

    // Track when app is installed
    window.addEventListener('appinstalled', () => {
        console.log('[PWA] ===== APP INSTALLED! =====');
        localStorage.setItem('pwa-installed', 'true');
        hideBanner();
    });

    // INIT function - show banner IMMEDIATELY (no delay)
    function init() {
        console.log('[PWA] ===== INIT CALLED =====');
        console.log('[PWA] document.body exists:', !!document.body);
        console.log('[PWA] Already installed:', isAlreadyInstalled());

        if (!isAlreadyInstalled()) {
            console.log('[PWA] ===== SHOWING BANNER IMMEDIATELY =====');
            showBanner();
        }
    }

    // Run init immediately if body exists, otherwise wait
    if (document.body) {
        console.log('[PWA] Body exists, calling init immediately...');
        init();
    } else {
        console.log('[PWA] Body not ready, waiting...');
        // Try multiple times to find body
        var attempts = 0;
        var maxAttempts = 50; // 5 seconds max
        var checkInterval = setInterval(function() {
            attempts++;
            console.log('[PWA] Checking for body, attempt', attempts);
            if (document.body) {
                clearInterval(checkInterval);
                console.log('[PWA] Body found! Calling init...');
                init();
            } else if (attempts >= maxAttempts) {
                clearInterval(checkInterval);
                console.error('[PWA] Body not found after', maxAttempts, 'attempts');
            }
        }, 100);
    }

    // Manual trigger
    window.showPWAInstallBanner = function() {
        console.log('[PWA] ===== MANUAL TRIGGER =====');
        showBanner();
    };

    console.log('[PWA] ===== SETUP COMPLETE =====');
})();
