/**
 * Image loading and optimization scripts extracted from inline HTML
 * This allows removing 'unsafe-inline' from Content Security Policy
 */

(function() {
    'use strict';

    // Preemptive Image Loading with Intersection Observer
    const lazyImageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                const img = entry.target;

                // Load the image if it has loading="lazy"
                if (img.loading === 'lazy') {
                    // Force immediate loading
                    img.loading = 'eager';

                    // If image hasn't started loading, trigger it
                    if (!img.src && img.dataset.src) {
                        img.src = img.dataset.src;
                    }
                }

                // Stop observing this image
                lazyImageObserver.unobserve(img);
            }
        });
    }, {
        // Load images 2000px before they enter viewport (much earlier)
        rootMargin: '2000px 0px',
        threshold: 0.01
    });

    // Observe all lazy-loaded images when DOM is ready
    function initializeLazyLoading() {
        document.querySelectorAll('.gallery-item img[loading="lazy"]').forEach(function(img) {
            lazyImageObserver.observe(img);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeLazyLoading);
    } else {
        initializeLazyLoading();
    }
})();