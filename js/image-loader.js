// Preemptive Image Loading with Intersection Observer
(function() {
    'use strict';

    // Custom lazy loading with early trigger (1000px before viewport)
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

    // Observe all lazy-loaded images
    document.querySelectorAll('.gallery-item img[loading="lazy"]').forEach(function(img) {
        lazyImageObserver.observe(img);
    });
})();