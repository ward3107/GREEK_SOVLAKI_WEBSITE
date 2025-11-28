// Simple scroll to top button - always visible
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

        // Add to page
        document.body.appendChild(scrollBtn);

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
