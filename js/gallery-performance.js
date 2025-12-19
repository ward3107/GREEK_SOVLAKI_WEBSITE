// Gallery Performance Optimization
(function() {
    'use strict';

    // Fix duplicate loading attributes and optimize gallery loading
    function optimizeGalleryImages() {
        const galleryImages = document.querySelectorAll('.gallery-item img');

        galleryImages.forEach((img, index) => {
            // Remove duplicate loading attributes
            if (img.hasAttribute('loading') && img.getAttribute('loading').includes(' ')) {
                img.setAttribute('loading', 'lazy');
            }

            // Only load first 4 images immediately, rest are lazy
            if (index < 4) {
                img.setAttribute('loading', 'eager');
                img.setAttribute('fetchpriority', index < 2 ? 'high' : 'auto');
            } else {
                img.setAttribute('loading', 'lazy');
                img.removeAttribute('fetchpriority');
            }

            // Add content-visibility for images further down
            if (index > 8) {
                img.style.contentVisibility = 'auto';
                img.style.containIntrinsicSize = '800px 600px';
            }
        });
    }

    // Debounced scroll handler for gallery animations
    function optimizeScrollAnimations() {
        let ticking = false;

        function updateAnimations() {
            // Only process gallery items in viewport
            const galleryItems = document.querySelectorAll('.gallery-item');
            galleryItems.forEach(item => {
                const rect = item.getBoundingClientRect();
                if (rect.top < window.innerHeight + 200 && rect.bottom > -200) {
                    // Item is near viewport, enable animations
                    item.style.willChange = 'transform, opacity';
                } else {
                    // Item is far from viewport, disable animations
                    item.style.willChange = 'auto';
                }
            });
            ticking = false;
        }

        requestAnimationFrame(updateAnimations);

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateAnimations);
                ticking = true;
            }
        }, { passive: true });
    }

    // Initialize optimizations
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            optimizeGalleryImages();
            optimizeScrollAnimations();
        });
    } else {
        optimizeGalleryImages();
        optimizeScrollAnimations();
    }
})();