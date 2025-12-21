// Lightbox Gallery Functionality with Zoom, Rotate and Pan
(function() {
    function initLightbox() {
        console.log('[Lightbox] Initializing lightbox script...');

        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        const zoomLevelDisplay = document.getElementById('zoom-level');

        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        const zoomInBtn = document.getElementById('zoom-in');
        const zoomOutBtn = document.getElementById('zoom-out');
        const rotateLeftBtn = document.getElementById('rotate-left');
        const rotateRightBtn = document.getElementById('rotate-right');
        const resetBtn = document.getElementById('reset-view');

        const galleryItems = document.querySelectorAll('.gallery-item img');
        console.log('[Lightbox] Found gallery items:', galleryItems.length);

        let currentIndex = 0;
        let currentZoom = 1;
        let currentRotation = 0;
        let posX = 0;
        let posY = 0;
        const minZoom = 0.5;
        const maxZoom = 4;
        const zoomStep = 0.25;

        // Drag/Pan variables
        let isDragging = false;
        let startX = 0;
        let startY = 0;
        let dragStartX = 0;
        let dragStartY = 0;

        // Focus management variables
        let previouslyFocusedElement = null;
        let focusableElements = [];
        let firstFocusableElement = null;
        let lastFocusableElement = null;

        // Open lightbox on image click
        galleryItems.forEach((img, index) => {
            console.log('[Lightbox] Found gallery image:', img.src);
            img.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('[Lightbox] Image clicked, opening lightbox for index:', index);
                currentIndex = index;
                openLightbox();
            });

            // Also handle touch events for mobile
            img.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('[Lightbox] Image touched, opening lightbox for index:', index);
                currentIndex = index;
                openLightbox();
            });
        });

        function updateTransform() {
            lightboxImg.style.transform = `translate(${posX}px, ${posY}px) scale(${currentZoom}) rotate(${currentRotation}deg)`;
            zoomLevelDisplay.textContent = Math.round(currentZoom * 100) + '%';
        }

        function openLightbox() {
            // Store current focus
            previouslyFocusedElement = document.activeElement;

            const img = galleryItems[currentIndex];
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt || 'Gallery image';
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';

            // Initialize focus management
            setupFocusTrap();
            resetView();
            updateNavButtons();
            updateAccessibilityAttributes();

            // Set focus to close button for keyboard users
            setTimeout(() => {
                closeBtn.focus();
            }, 100);
        }

        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';

            // Restore focus to previously focused element
            if (previouslyFocusedElement && previouslyFocusedElement.focus) {
                previouslyFocusedElement.focus();
            }

            resetView();
        }

        function updateNavButtons() {
            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex === galleryItems.length - 1;
        }

        function setupFocusTrap() {
            // Get all focusable elements within the lightbox
            const focusableSelectors = [
                'button:not([disabled])',
                '[href]',
                'input:not([disabled])',
                'select:not([disabled])',
                'textarea:not([disabled])',
                '[tabindex]:not([tabindex="-1"])'
            ];

            focusableElements = Array.from(lightbox.querySelectorAll(focusableSelectors.join(', ')));
            firstFocusableElement = focusableElements[0];
            lastFocusableElement = focusableElements[focusableElements.length - 1];
        }

        function updateAccessibilityAttributes() {
            lightbox.setAttribute('aria-hidden', 'false');
            lightboxImg.setAttribute('src', galleryItems[currentIndex].src);
            lightboxImg.setAttribute('alt', galleryItems[currentIndex].alt || 'Gallery image ' + (currentIndex + 1));
        }

        function resetView() {
            currentZoom = 1;
            currentRotation = 0;
            posX = 0;
            posY = 0;
            updateTransform();
        }

        function zoomIn() {
            if (currentZoom < maxZoom) {
                currentZoom = Math.min(currentZoom + zoomStep, maxZoom);
                updateTransform();
            }
        }

        function zoomOut() {
            if (currentZoom > minZoom) {
                currentZoom = Math.max(currentZoom - zoomStep, minZoom);
                updateTransform();
            }
        }

        function rotateLeft() {
            currentRotation -= 90;
            updateTransform();
        }

        function rotateRight() {
            currentRotation += 90;
            updateTransform();
        }

        function showPrev() {
            if (currentIndex > 0) {
                currentIndex--;
                const img = galleryItems[currentIndex];
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt || 'Gallery image';
                resetView();
                updateNavButtons();
                updateAccessibilityAttributes();
            }
        }

        function showNext() {
            if (currentIndex < galleryItems.length - 1) {
                currentIndex++;
                const img = galleryItems[currentIndex];
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt || 'Gallery image';
                resetView();
                updateNavButtons();
                updateAccessibilityAttributes();
            }
        }

        // Event listeners
        closeBtn.addEventListener('click', closeLightbox);

        prevBtn.addEventListener('click', showPrev);
        nextBtn.addEventListener('click', showNext);

        if (zoomInBtn) zoomInBtn.addEventListener('click', zoomIn);
        if (zoomOutBtn) zoomOutBtn.addEventListener('click', zoomOut);
        if (rotateLeftBtn) rotateLeftBtn.addEventListener('click', rotateLeft);
        if (rotateRightBtn) rotateRightBtn.addEventListener('click', rotateRight);
        if (resetBtn) resetBtn.addEventListener('click', resetView);

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;

            switch (e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    showPrev();
                    break;
                case 'ArrowRight':
                    showNext();
                    break;
                case '+':
                case '=':
                    zoomIn();
                    break;
                case '-':
                case '_':
                    zoomOut();
                    break;
            }
        });

        // Drag to pan
        let dragStartPosX = 0;
        let dragStartPosY = 0;
        let startPosX = 0;
        let startPosY = 0;

        lightboxImg.addEventListener('mousedown', (e) => {
            if (currentZoom > 1) {
                isDragging = true;
                dragStartPosX = e.clientX;
                dragStartPosY = e.clientY;
                startPosX = posX;
                startPosY = posY;
                lightboxImg.style.cursor = 'grabbing';
                e.preventDefault();
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const deltaX = e.clientX - dragStartPosX;
                const deltaY = e.clientY - dragStartPosY;
                posX = startPosX + deltaX;
                posY = startPosY + deltaY;
                updateTransform();
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            lightboxImg.style.cursor = 'grab';
        });

        // Touch events for mobile
        let touchStartX = 0;
        let touchStartY = 0;

        lightboxImg.addEventListener('touchstart', (e) => {
            if (currentZoom > 1 && e.touches.length === 1) {
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
                startPosX = posX;
                startPosY = posY;
            }
        }, { passive: true });

        lightboxImg.addEventListener('touchmove', (e) => {
            if (currentZoom > 1 && e.touches.length === 1) {
                const deltaX = e.touches[0].clientX - touchStartX;
                const deltaY = e.touches[0].clientY - touchStartY;
                posX = startPosX + deltaX;
                posY = startPosY + deltaY;
                updateTransform();
                e.preventDefault();
            }
        });

        // Click outside to close
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        console.log('[Lightbox] Lightbox initialized successfully');
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLightbox);
    } else {
        initLightbox();
    }
})();