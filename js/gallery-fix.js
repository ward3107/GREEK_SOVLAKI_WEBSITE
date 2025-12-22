// Simple Gallery Lightbox Fix
(function() {
    'use strict';

    console.log('[Gallery Fix] Initializing simple gallery lightbox...');

    // Get gallery images and lightbox elements
    const galleryImages = document.querySelectorAll('.gallery-item img');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = lightbox ? lightbox.querySelector('.lightbox-close') : null;
    const prevBtn = lightbox ? lightbox.querySelector('.lightbox-prev') : null;
    const nextBtn = lightbox ? lightbox.querySelector('.lightbox-next') : null;

    let currentIndex = 0;

    console.log('[Gallery Fix] Found images:', galleryImages.length);
    console.log('[Gallery Fix] Lightbox exists:', !!lightbox);

    if (!lightbox || !lightboxImg) {
        console.error('[Gallery Fix] Lightbox elements not found!');
        return;
    }

    // Add click handlers to gallery images
    galleryImages.forEach((img, index) => {
        console.log('[Gallery Fix] Setting up click for image:', img.src);

        // Make image clickable
        img.style.cursor = 'pointer';

        // Remove any existing click handlers
        img.removeEventListener('click', handleImageClick);

        // Add new click handler
        img.addEventListener('click', handleImageClick);

        function handleImageClick(e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            console.log('[Gallery Fix] Image clicked:', index);

            currentIndex = index;
            showLightbox();
        }
    });

    // Show lightbox
    function showLightbox() {
        const img = galleryImages[currentIndex];
        console.log('[Gallery Fix] Opening lightbox for:', img.src);

        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || 'Gallery image';
        lightbox.classList.add('active');

        // Prevent body scrolling when lightbox is open
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.top = `-${window.scrollY}px`;

        updateNavButtons();
    }

    // Hide lightbox
    function hideLightbox() {
        console.log('[Gallery Fix] Closing lightbox');
        lightbox.classList.remove('active');

        // Restore body scrolling and scroll position
        const scrollY = document.body.style.top;
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.top = '';

        if (scrollY) {
            window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }
    }

    // Update navigation buttons
    function updateNavButtons() {
        if (prevBtn) prevBtn.disabled = currentIndex === 0;
        if (nextBtn) nextBtn.disabled = currentIndex === galleryImages.length - 1;
    }

    // Navigation functions
    function showPrev() {
        if (currentIndex > 0) {
            currentIndex--;
            showLightbox();
        }
    }

    function showNext() {
        if (currentIndex < galleryImages.length - 1) {
            currentIndex++;
            showLightbox();
        }
    }

    // Event listeners
    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            hideLightbox();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            showPrev();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            showNext();
        });
    }

    // Close on backdrop click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
            e.preventDefault();
            e.stopPropagation();
            hideLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        switch(e.key) {
            case 'Escape':
                e.preventDefault();
                e.stopPropagation();
                hideLightbox();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                e.stopPropagation();
                showPrev();
                break;
            case 'ArrowRight':
                e.preventDefault();
                e.stopPropagation();
                showNext();
                break;
        }
    });

    console.log('[Gallery Fix] Gallery lightbox initialized successfully');
})();