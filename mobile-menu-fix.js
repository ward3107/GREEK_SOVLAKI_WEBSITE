// Mobile menu fix - works with actual HTML structure
(function() {
    'use strict';
    console.log('[MOBILE-MENU-FIX] Loading...');

    function initMobileMenu() {
        const hamburger = document.querySelector('.hamburger');
        const mainNavPanel = document.querySelector('.main-nav-panel');
        const mainNavDropdown = document.querySelector('.main-nav-dropdown');

        console.log('[MOBILE-MENU-FIX] hamburger:', hamburger);
        console.log('[MOBILE-MENU-FIX] mainNavPanel:', mainNavPanel);
        console.log('[MOBILE-MENU-FIX] mainNavDropdown:', mainNavDropdown);

        if (!hamburger || !mainNavPanel) {
            console.log('[MOBILE-MENU-FIX] Elements not found, retrying...');
            setTimeout(initMobileMenu, 100);
            return;
        }

        let isOpen = false;

        function toggleMenu(e) {
            e.preventDefault();
            e.stopPropagation();

            console.log('[MOBILE-MENU-FIX] Toggle menu! Current state:', isOpen);

            isOpen = !isOpen;

            // Toggle hamburger active state
            hamburger.classList.toggle('active', isOpen);
            hamburger.setAttribute('aria-expanded', isOpen);

            // Show/hide the nav panel
            if (isOpen) {
                mainNavPanel.style.display = 'block';
                mainNavPanel.style.position = 'fixed';
                mainNavPanel.style.top = '60px';
                mainNavPanel.style.left = '0';
                mainNavPanel.style.right = '0';
                mainNavPanel.style.background = 'rgba(30, 58, 138, 0.98)';
                mainNavPanel.style.padding = '20px';
                mainNavPanel.style.zIndex = '9998';
                console.log('[MOBILE-MENU-FIX] Menu OPENED');
            } else {
                mainNavPanel.style.display = '';
                console.log('[MOBILE-MENU-FIX] Menu CLOSED');
            }
        }

        // Remove old listeners
        hamburger.removeEventListener('click', toggleMenu);

        // Add click handler
        hamburger.addEventListener('click', toggleMenu);
        hamburger.addEventListener('touchstart', function(e) {
            e.preventDefault();
            toggleMenu(e);
        }, { passive: false });

        // Close menu when clicking links
        const links = mainNavPanel.querySelectorAll('.nav-dropdown-item');
        console.log('[MOBILE-MENU-FIX] Found', links.length, 'nav links');

        links.forEach(function(link) {
            link.addEventListener('click', function(e) {
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    // Close menu
                    isOpen = false;
                    hamburger.classList.remove('active');
                    hamburger.setAttribute('aria-expanded', 'false');
                    mainNavPanel.style.display = '';
                }
            });
        });

        // Close when clicking outside
        document.addEventListener('click', function(e) {
            if (isOpen && !hamburger.contains(e.target) && !mainNavPanel.contains(e.target)) {
                isOpen = false;
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                mainNavPanel.style.display = '';
            }
        });

        console.log('[MOBILE-MENU-FIX] Initialized successfully!');
    }

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileMenu);
    } else {
        initMobileMenu();
    }

    // Fallback
    setTimeout(initMobileMenu, 500);
})();
