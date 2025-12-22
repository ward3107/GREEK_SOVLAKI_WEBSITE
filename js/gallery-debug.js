// Gallery Debug Script
(function() {
    console.log('[Gallery Debug] Starting gallery debugging...');

    function debugGallery() {
        // Check if gallery items exist
        const galleryItems = document.querySelectorAll('.gallery-item');
        const galleryImages = document.querySelectorAll('.gallery-item img');

        console.log('[Gallery Debug] Gallery items found:', galleryItems.length);
        console.log('[Gallery Debug] Gallery images found:', galleryImages.length);

        // Check if lightbox exists
        const lightbox = document.getElementById('lightbox');
        console.log('[Gallery Debug] Lightbox element exists:', !!lightbox);

        if (lightbox) {
            console.log('[Gallery Debug] Lightbox element:', lightbox);
            const lightboxImg = document.getElementById('lightbox-img');
            console.log('[Gallery Debug] Lightbox image exists:', !!lightboxImg);
        }

        // Test click events on gallery images
        galleryImages.forEach((img, index) => {
            console.log(`[Gallery Debug] Testing image ${index}:`, img.src);

            // Add test click listener
            img.addEventListener('click', function(e) {
                console.log(`[Gallery Debug] Image ${index} clicked! Event:`, e);
                console.log('[Gallery Debug] Event target:', e.target);
                console.log('[Gallery Debug] Prevent default worked:', e.defaultPrevented);
            });
        });

        // Check for any overlapping elements
        galleryItems.forEach((item, index) => {
            const rect = item.getBoundingClientRect();
            console.log(`[Gallery Debug] Gallery item ${index} rect:`, rect);

            // Check for elements covering the gallery item
            const elementAtPoint = document.elementFromPoint(
                rect.left + rect.width / 2,
                rect.top + rect.height / 2
            );
            console.log(`[Gallery Debug] Element at center of gallery item ${index}:`, elementAtPoint);
        });
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', debugGallery);
    } else {
        debugGallery();
    }

    // Also debug after a delay to ensure all scripts loaded
    setTimeout(debugGallery, 2000);
})();