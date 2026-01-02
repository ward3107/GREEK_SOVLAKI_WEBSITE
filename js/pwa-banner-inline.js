// PWA Banner Script - External file to work with CSP
console.log('[PWA-BANNER] Script loaded!');

// Show banner after 1 second
setTimeout(function() {
    if (localStorage.getItem('pwa-installed') === 'true') {
        console.log('[PWA-BANNER] Already installed');
        return;
    }

    var banner = document.getElementById('pwa-install-banner-inline');
    if (banner) {
        banner.style.display = 'flex';
        console.log('[PWA-BANNER] Banner shown!');
    } else {
        console.error('[PWA-BANNER] Banner element not found!');
    }
}, 1000);

function pwaClose() {
    var banner = document.getElementById('pwa-install-banner-inline');
    if (banner) {
        banner.style.display = 'none';
    }
}

function pwaInstall() {
    var isAndroid = /android/i.test(navigator.userAgent);
    var isChrome = /chrome/i.test(navigator.userAgent) && !/edge|edg/i.test(navigator.userAgent);

    if (isAndroid && isChrome) {
        alert('📱 להתקנת האפליקציה ב-Android Chrome:\n\n1. לחצו על תפריט (⋮) בפינה הימנית העליונה\n2. בחרו "הוספה למסך הבית" או "Install app"\n3. לחצו "הוסף" כדי לסיים\n\n💡 טיפ: בקרו באתר מספר פעמים כדי לקבל את אפשרות ההתקנה המהירה!');
    } else {
        alert('📱 להתקנת האפליקציה:\n\nAndroid Chrome: תפריט (⋮) → "הוספה למסך הבית"');
    }
    pwaClose();
}

// Listen for beforeinstallprompt
window.addEventListener('beforeinstallprompt', function(e) {
    console.log('[PWA-BANNER] beforeinstallprompt fired!');
    window.deferredPrompt = e;
});

// Listen for appinstalled
window.addEventListener('appinstalled', function() {
    console.log('[PWA-BANNER] App installed!');
    localStorage.setItem('pwa-installed', 'true');
    pwaClose();
});

console.log('[PWA-BANNER] Setup complete');
