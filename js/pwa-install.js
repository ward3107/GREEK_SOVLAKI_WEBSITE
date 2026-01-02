// PWA Install Banner - Mobile-first approach
console.log('[PWA-MOBILE] ===== SCRIPT LOADED =====');
console.log('[PWA-MOBILE] User Agent:', navigator.userAgent);
console.log('[PWA-MOBILE] document.readyState:', document.readyState);

(function() {
    'use strict';

    let deferredPrompt = null;
    let bannerShown = false;
    let initAttempts = 0;

    // Check if already installed
    function isAlreadyInstalled() {
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
        const hasAppInstalled = localStorage.getItem('pwa-installed') === 'true';
        return isStandalone || hasAppInstalled;
    }

    // Create and show banner
    function showBanner() {
        if (bannerShown) {
            console.log('[PWA-MOBILE] Banner already shown, skipping');
            return;
        }

        if (isAlreadyInstalled()) {
            console.log('[PWA-MOBILE] Already installed, not showing banner');
            return;
        }

        bannerShown = true;
        console.log('[PWA-MOBILE] ===== CREATING BANNER =====');

        try {
            const isMobile = /android|iphone|ipad|ipod|mobile/i.test(navigator.userAgent);
            console.log('[PWA-MOBILE] isMobile:', isMobile);

            // Create banner container
            const banner = document.createElement('div');
            banner.id = 'pwa-install-banner-mobile';

            // Use direct inline styles on the element
            banner.setAttribute('style',
                'position:fixed!important;' +
                'top:0!important;' +
                'left:0!important;' +
                'right:0!important;' +
                'background:linear-gradient(135deg,rgba(30,64,175,0.98),rgba(55,48,163,0.98))!important;' +
                'color:#ffffff!important;' +
                'z-index:999999!important;' +
                'padding:15px!important;' +
                'display:flex!important;' +
                'align-items:center!important;' +
                'justify-content:center!important;' +
                'box-shadow:0 4px 20px rgba(0,0,0,0.3)!important;' +
                'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif!important;' +
                'min-height:80px!important;'
            );

            // Mobile-specific adjustments
            if (isMobile) {
                banner.setAttribute('style', banner.getAttribute('style') +
                    'flex-direction:column!important;' +
                    'text-align:center!important;' +
                    'padding:20px 15px!important;'
                );
            }

            banner.innerHTML = `
                <div style="display:flex;align-items:center;gap:12px;flex:1;max-width:1200px;">
                    <span style="font-size:32px;flex-shrink:0;">📱</span>
                    <div style="flex:1;">
                        <div style="font-weight:700;font-size:18px;margin-bottom:4px;">התקן את Greek Souvlaki</div>
                        <div style="font-size:14px;opacity:0.9;">קבלו חוויה מהירה יותר!</div>
                    </div>
                    <div style="display:flex;gap:10px;flex-shrink:0;">
                        <button id="pwa-install-btn-mobile" style="background:#fbbf24;color:#1e3a8a;border:none;padding:12px 24px;border-radius:25px;font-size:15px;font-weight:700;cursor:pointer;white-space:nowrap;">התקן עכשיו</button>
                        <button id="pwa-close-btn-mobile" style="background:rgba(255,255,255,0.2);color:#fff;border:none;padding:8px 16px;border-radius:20px;font-size:14px;cursor:pointer;">✕</button>
                    </div>
                </div>
            `;

            // Add to document
            if (document.body) {
                document.body.appendChild(banner);
                console.log('[PWA-MOBILE] ===== BANNER ADDED TO BODY =====');
            } else {
                document.documentElement.appendChild(banner);
                console.log('[PWA-MOBILE] ===== BANNER ADDED TO DOCUMENT ELEMENT =====');
            }

            // Add event listeners after a small delay to ensure DOM is ready
            setTimeout(function() {
                const installBtn = document.getElementById('pwa-install-btn-mobile');
                const closeBtn = document.getElementById('pwa-close-btn-mobile');

                console.log('[PWA-MOBILE] installBtn found:', !!installBtn);
                console.log('[PWA-MOBILE] closeBtn found:', !!closeBtn);

                if (installBtn) {
                    installBtn.addEventListener('click', handleInstallClick);
                    // Also add touch event for mobile
                    installBtn.addEventListener('touchend', function(e) {
                        e.preventDefault();
                        handleInstallClick(e);
                    });
                    console.log('[PWA-MOBILE] Event listeners added');
                }

                if (closeBtn) {
                    closeBtn.addEventListener('click', hideBanner);
                    closeBtn.addEventListener('touchend', function(e) {
                        e.preventDefault();
                        hideBanner();
                    });
                }
            }, 100);

        } catch (e) {
            console.error('[PWA-MOBILE] Error creating banner:', e);
        }
    }

    function handleInstallClick(e) {
        if (e) e.preventDefault();
        console.log('[PWA-MOBILE] ===== INSTALL BUTTON CLICKED =====');
        console.log('[PWA-MOBILE] deferredPrompt:', deferredPrompt);

        if (deferredPrompt) {
            // One-click install!
            console.log('[PWA-MOBILE] Triggering Chrome install dialog...');
            deferredPrompt.prompt()
                .then(function(result) {
                    console.log('[PWA-MOBILE] Install result:', result.outcome);
                    if (result.outcome === 'accepted') {
                        console.log('[PWA-MOBILE] User accepted!');
                        localStorage.setItem('pwa-installed', 'true');
                        hideBanner();
                    } else {
                        console.log('[PWA-MOBILE] User dismissed');
                    }
                    deferredPrompt = null;
                })
                .catch(function(err) {
                    console.error('[PWA-MOBILE] Install error:', err);
                    deferredPrompt = null;
                });
        } else {
            // No prompt available - show manual instructions
            console.log('[PWA-MOBILE] No install prompt, showing manual instructions');
            showManualInstructions();
        }
    }

    function showManualInstructions() {
        var isAndroid = /android/i.test(navigator.userAgent);
        var isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
        var isChrome = /chrome/i.test(navigator.userAgent) && !/edge|edg/i.test(navigator.userAgent);
        var isDesktop = !isAndroid && !isIOS;

        var message = '';

        if (isAndroid && isChrome) {
            message = '📱 להתקנת האפליקציה ב-Android Chrome:\n\n' +
                   '1. לחצו על תפריט (⋮) בפינה הימנית העליונה\n' +
                   '2. בחרו "הוספה למסך הבית" או "Install app"\n' +
                   '3. לחצו "הוסף" כדי לסיים\n\n' +
                   '💡 טיפ: בקרו באתר מספר פעמים כדי לקבל את אפשרות ההתקנה המהירה!';
        } else if (isIOS) {
            message = '📱 להתקנת האפליקציה ב-iPhone/iPad:\n\n' +
                   '1. לחצו על כפתור "שתף" (↑) בתחתית המסך\n' +
                   '2. גללו למטה ובחרו "הוספה למסך הבית"\n' +
                   '3. לחצו "הוסף" כדי לסיים\n\n' +
                   '💡 טיפ: האפליקציה תעבוד במצב דפדפן!';
        } else if (isDesktop) {
            message = '💻 התקנת PWA במחשב:\n\n' +
                   'Chrome/Edge: הכפתור "התקנה" יופיע בשורת הכתובת (⊕)\n\n' +
                   'או שתשתמשו במכשיר הנייד שלכם להתקנה!\n\n' +
                   '📱 Android: תפריט (⋮) → "הוספה למסך הבית"\n' +
                   '📱 iPhone: שתף (↑) → "הוספה למסך הבית"';
        } else {
            message = '📱 להתקנת האפליקציה:\n\n' +
                   'Android Chrome: תפריט (⋮) → "הוספה למסך הבית"\n\n' +
                   'iPhone: שתף (↑) → "הוספה למסך הבית"\n\n' +
                   'Desktop: כפתור התקנה בשורת הכתובת';
        }

        alert(message);
    }

    function hideBanner() {
        var banner = document.getElementById('pwa-install-banner-mobile');
        if (banner) {
            banner.remove();
            console.log('[PWA-MOBILE] Banner removed');
        }
    }

    // Listen for beforeinstallprompt
    window.addEventListener('beforeinstallprompt', function(e) {
        console.log('[PWA-MOBILE] ===== beforeinstallprompt FIRED! =====');
        deferredPrompt = e;
        // Don't prevent default - let Chrome show its prompt too
    });

    // Listen for appinstalled
    window.addEventListener('appinstalled', function() {
        console.log('[PWA-MOBILE] ===== APP INSTALLED! =====');
        localStorage.setItem('pwa-installed', 'true');
        hideBanner();
    });

    // INIT function with multiple fallback strategies
    function tryInit() {
        initAttempts++;
        console.log('[PWA-MOBILE] ===== tryInit ATTEMPT ' + initAttempts + ' =====');
        console.log('[PWA-MOBILE] document.body:', !!document.body);
        console.log('[PWA-MOBILE] document.readyState:', document.readyState);
        console.log('[PWA-MOBILE] isAlreadyInstalled:', isAlreadyInstalled());

        if (document.body && !isAlreadyInstalled() && !bannerShown) {
            console.log('[PWA-MOBILE] ===== CONDITIONS MET, SHOWING BANNER =====');
            showBanner();
            return true;
        }

        if (initAttempts >= 20) {
            console.log('[PWA-MOBILE] ===== MAX ATTEMPTS REACHED =====');
            return true; // Stop trying
        }

        return false;
    }

    // Strategy 1: Try immediately
    if (!tryInit()) {
        // Strategy 2: Wait for DOMContentLoaded
        document.addEventListener('DOMContentLoaded', function() {
            console.log('[PWA-MOBILE] DOMContentLoaded fired');
            tryInit();
        });

        // Strategy 3: Wait for window load
        window.addEventListener('load', function() {
            console.log('[PWA-MOBILE] Window load fired');
            tryInit();
        });

        // Strategy 4: Poll every 200ms (up to 4 seconds)
        var pollInterval = setInterval(function() {
            if (tryInit()) {
                clearInterval(pollInterval);
                console.log('[PWA-MOBILE] ===== POLLING COMPLETE =====');
            }
        }, 200);

        // Stop polling after 4 seconds
        setTimeout(function() {
            clearInterval(pollInterval);
            console.log('[PWA-MOBILE] ===== POLLING TIMEOUT =====');
        }, 4000);
    }

    // Manual trigger
    window.showPWAInstallBanner = function() {
        console.log('[PWA-MOBILE] ===== MANUAL TRIGGER =====');
        showBanner();
    };

    console.log('[PWA-MOBILE] ===== SETUP COMPLETE =====');
})();
