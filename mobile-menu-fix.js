// Mobile menu fix - SIMPLIFIED version that runs immediately
console.log('[MOBILE-MENU] Script loaded');

// Wait for elements to exist
function checkAndInit() {
    const hamburger = document.querySelector('.hamburger');
    const mainNavPanel = document.querySelector('.main-nav-panel');

    console.log('[MOBILE-MENU] Checking elements... hamburger:', !!hamburger, 'panel:', !!mainNavPanel);

    if (hamburger && mainNavPanel) {
        console.log('[MOBILE-MENU] Elements found! Adding click handler...');

        hamburger.addEventListener('click', function(e) {
            console.log('[MOBILE-MENU] HAMBURGER CLICKED!');
            e.preventDefault();
            e.stopPropagation();

            const isOpen = hamburger.classList.contains('mobile-open');
            console.log('[MOBILE-MENU] Current isOpen:', isOpen);

            if (!isOpen) {
                // Open menu
                hamburger.classList.add('mobile-open');
                hamburger.classList.add('active');
                hamburger.setAttribute('aria-expanded', 'true');

                mainNavPanel.style.display = 'block';
                mainNavPanel.style.position = 'fixed';
                mainNavPanel.style.top = '60px';
                mainNavPanel.style.left = '0';
                mainNavPanel.style.right = '0';
                mainNavPanel.style.width = '100%';
                mainNavPanel.style.background = 'rgba(30, 58, 138, 0.98)';
                mainNavPanel.style.padding = '30px 20px';
                mainNavPanel.style.zIndex = '9999';

                console.log('[MOBILE-MENU] MENU OPENED!');
            } else {
                // Close menu
                hamburger.classList.remove('mobile-open');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                mainNavPanel.style.display = '';

                console.log('[MOBILE-MENU] MENU CLOSED!');
            }
        }, true); // Use capture phase

        // Close when clicking links
        const links = mainNavPanel.querySelectorAll('a');
        links.forEach(function(link) {
            link.addEventListener('click', function() {
                console.log('[MOBILE-MENU] Link clicked, closing menu');
                hamburger.classList.remove('mobile-open');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                mainNavPanel.style.display = '';
            });
        });

        console.log('[MOBILE-MENU] Setup complete!');
        return true;
    }

    return false;
}

// Try multiple times
if (!checkAndInit()) {
    console.log('[MOBILE-MENU] Elements not ready, will retry...');

    // Try on DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            console.log('[MOBILE-MENU] DOMContentLoaded fired');
            checkAndInit();
        });
    }

    // Try after delay
    setTimeout(function() {
        console.log('[MOBILE-MENU] Timeout check');
        checkAndInit();
    }, 500);

    setTimeout(function() {
        console.log('[MOBILE-MENU] Final check');
        checkAndInit();
    }, 1000);
}
