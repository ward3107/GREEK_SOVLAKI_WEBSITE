// Scroll to top button - visible after scrolling past hero section
(function() {
    'use strict';

    function createScrollButton() {
        // Create the button with SVG arrow icon
        const scrollBtn = document.createElement('button');
        scrollBtn.id = 'scroll-to-top';
        scrollBtn.className = 'scroll-top-btn';
        scrollBtn.innerHTML = `
            <svg class="scroll-arrow" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
        `;
        scrollBtn.setAttribute('aria-label', 'Scroll to top');

        // Start hidden
        scrollBtn.style.opacity = '0';
        scrollBtn.style.visibility = 'hidden';

        // Add to page
        document.body.appendChild(scrollBtn);

        // Get hero section
        const heroSection = document.querySelector('.hero, #home');

        // Sections with dark/blue backgrounds where widgets need light color
        const darkSections = ['footer', '.footer-compact', '#contact'];

        // Check if element is over a dark section
        function isOverDarkSection() {
            const btnRect = scrollBtn.getBoundingClientRect();

            for (const selector of darkSections) {
                const section = document.querySelector(selector);
                if (section) {
                    const sectionRect = section.getBoundingClientRect();
                    // Check if button overlaps with this section (when button bottom reaches section top)
                    if (btnRect.bottom >= sectionRect.top && btnRect.top <= sectionRect.bottom) {
                        return true;
                    }
                }
            }
            return false;
        }

        // Show/hide based on scroll position and adjust color
        function checkScroll() {
            if (heroSection) {
                const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
                if (window.scrollY > heroBottom) {
                    scrollBtn.style.opacity = '1';
                    scrollBtn.style.visibility = 'visible';

                    // Update position to move with scroll
                    const scrollOffset = window.scrollY;
                    scrollBtn.style.transform = `translateY(${scrollOffset}px)`;

                    // Check background and adjust color
                    if (isOverDarkSection()) {
                        scrollBtn.classList.add('light-mode');
                    } else {
                        scrollBtn.classList.remove('light-mode');
                    }
                } else {
                    scrollBtn.style.opacity = '0';
                    scrollBtn.style.visibility = 'hidden';
                    scrollBtn.style.transform = 'translateY(0)';
                }
            }
        }

        // Listen for scroll events
        window.addEventListener('scroll', checkScroll, { passive: true });

        // Check initial position
        checkScroll();

        // Click handler with smooth scroll
        scrollBtn.addEventListener('click', function() {
            scrollBtn.classList.add('clicked');

            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });

            setTimeout(() => {
                scrollBtn.classList.remove('clicked');
            }, 600);
        });

        console.log('Scroll to top button created and ready!');
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createScrollButton);
    } else {
        createScrollButton();
    }
})();
