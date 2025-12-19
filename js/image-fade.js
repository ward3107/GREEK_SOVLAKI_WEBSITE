// Image Fade-In Handler
(function() {
    'use strict';

    // Add fade-in effect when images load
    function handleImageLoad(img) {
        const galleryItem = img.closest('.gallery-item');

        if (img.complete) {
            img.classList.add('loaded');
            if (galleryItem) galleryItem.classList.add('loaded');
        } else {
            img.addEventListener('load', function() {
                this.classList.add('loaded');
                if (galleryItem) galleryItem.classList.add('loaded');
            }, { once: true });

            // Fallback in case load event doesn't fire
            img.addEventListener('error', function() {
                this.classList.add('loaded');
                if (galleryItem) galleryItem.classList.add('loaded');
            }, { once: true });
        }
    }

    // Apply to all gallery images
    const galleryImages = document.querySelectorAll('.gallery-item img');
    galleryImages.forEach(handleImageLoad);

    // Handle dynamically loaded images (if any)
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.tagName === 'IMG' && node.closest('.gallery-item')) {
                    handleImageLoad(node);
                }
            });
        });
    });

    const galleryGrid = document.querySelector('.gallery-grid');
    if (galleryGrid) {
        observer.observe(galleryGrid, { childList: true, subtree: true });
    }
})();