// Simple mobile menu fix - runs immediately when loaded
(function() {
    console.log('Mobile menu fix loading...');

    function initMobileMenu() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');

        console.log('Hamburger:', hamburger);
        console.log('Nav menu:', navMenu);

        if (!hamburger || !navMenu) {
            console.log('Mobile menu elements not found, retrying...');
            setTimeout(initMobileMenu, 100);
            return;
        }

        // Remove existing listeners to prevent duplicates
        hamburger.removeEventListener('click', toggleMenu);
        hamburger.removeEventListener('touchstart', toggleMenu);

        function toggleMenu(e) {
            e.preventDefault();
            e.stopPropagation();

            console.log('Menu toggled');

            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');

            console.log('Hamburger classes:', hamburger.className);
            console.log('Nav menu classes:', navMenu.className);
        }

        // Add both click and touch events
        hamburger.addEventListener('click', toggleMenu);
        hamburger.addEventListener('touchstart', function(e) {
            e.preventDefault();
            toggleMenu(e);
        });

        // Close menu when clicking on links
        const links = navMenu.querySelectorAll('a');
        links.forEach(function(link) {
            link.addEventListener('click', function(e) {
                // Handle smooth scrolling for anchor links
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();

                    // Close mobile menu
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                    hamburger.setAttribute('aria-expanded', 'false');

                    // Smooth scroll to section
                    const target = document.querySelector(href);
                    if (target) {
                        const navbar = document.querySelector('.navbar');
                        const navbarHeight = navbar ? navbar.offsetHeight : 0;
                        const targetPosition = target.offsetTop - navbarHeight - 20;

                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                } else {
                    // For external links, close menu after short delay
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                    hamburger.setAttribute('aria-expanded', 'false');
                }
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });

        console.log('Mobile menu initialized successfully');
    }

    // Try to initialize immediately and also on DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileMenu);
    } else {
        initMobileMenu();
    }

    // Also try after a short delay to ensure everything is loaded
    setTimeout(initMobileMenu, 500);
})();