// Lightbox Gallery Functionality with Zoom, Rotate and Pan
(function() {
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

    // Open lightbox on image click
    galleryItems.forEach((img, index) => {
        img.addEventListener('click', () => {
            currentIndex = index;
            openLightbox();
        });
    });

    function updateTransform() {
        lightboxImg.style.transform = `translate(${posX}px, ${posY}px) scale(${currentZoom}) rotate(${currentRotation}deg)`;
        zoomLevelDisplay.textContent = Math.round(currentZoom * 100) + '%';

        // Update button states
        zoomOutBtn.disabled = currentZoom <= minZoom;
        zoomInBtn.disabled = currentZoom >= maxZoom;

        // Update cursor based on zoom level
        if (currentZoom > 1) {
            lightboxImg.style.cursor = isDragging ? 'grabbing' : 'grab';
        } else {
            lightboxImg.style.cursor = 'default';
        }
    }

    function openLightbox() {
        const img = galleryItems[currentIndex];
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || 'Gallery image';
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        resetView();
        updateNavButtons();
        updateAccessibilityAttributes();
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        resetView();
    }

    function updateNavButtons() {
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex === galleryItems.length - 1;
    }

    function updateAccessibilityAttributes() {
        lightboxImg.setAttribute('role', 'img');
        lightbox.setAttribute('aria-modal', 'true');
        lightbox.setAttribute('role', 'dialog');
        lightbox.setAttribute('aria-label', 'Image gallery lightbox');

        // Update navigation button accessibility
        prevBtn.setAttribute('aria-label', `Previous image (${currentIndex + 1}/${galleryItems.length})`);
        nextBtn.setAttribute('aria-label', `Next image (${currentIndex + 1}/${galleryItems.length})`);
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

    // Close button
    closeBtn.addEventListener('click', closeLightbox);

    // Navigation buttons
    prevBtn.addEventListener('click', showPrev);
    nextBtn.addEventListener('click', showNext);
    zoomInBtn.addEventListener('click', zoomIn);
    zoomOutBtn.addEventListener('click', zoomOut);
    rotateLeftBtn.addEventListener('click', rotateLeft);
    rotateRightBtn.addEventListener('click', rotateRight);
    resetBtn.addEventListener('click', resetView);

    // Click outside image to close (only when not zoomed)
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox && currentZoom <= 1) {
            closeLightbox();
        }
    });

    // Touch gestures for mobile
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartDistance = 0;

    lightboxImg.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            startX = e.touches[0].clientX - posX;
            startY = e.touches[0].clientY - posY;
            isDragging = currentZoom > 1;
        } else if (e.touches.length === 2) {
            touchStartDistance = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
        }
    }, { passive: true });

    lightboxImg.addEventListener('touchmove', (e) => {
        e.preventDefault();

        if (e.touches.length === 1 && isDragging) {
            // Pan with single finger when zoomed
            posX = e.touches[0].clientX - startX;
            posY = e.touches[0].clientY - startY;
            updateTransform();
        } else if (e.touches.length === 2) {
            // Zoom with pinch gesture
            const currentDistance = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );

            const scale = currentDistance / touchStartDistance;
            const newZoom = Math.max(minZoom, Math.min(maxZoom, currentZoom * scale));

            if (newZoom !== currentZoom) {
                currentZoom = newZoom;
                touchStartDistance = currentDistance;
                updateTransform();
            }
        }
    }, { passive: false });

    lightboxImg.addEventListener('touchend', () => {
        isDragging = false;
    });

    // Mouse drag functionality
    lightboxImg.addEventListener('mousedown', (e) => {
        if (currentZoom > 1) {
            isDragging = true;
            startX = e.clientX - posX;
            startY = e.clientY - posY;
            lightboxImg.style.cursor = 'grabbing';
            e.preventDefault();
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            posX = e.clientX - startX;
            posY = e.clientY - startY;
            updateTransform();
        }
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            lightboxImg.style.cursor = currentZoom > 1 ? 'grab' : 'default';
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        switch(e.key) {
            case 'Escape': closeLightbox(); break;
            case 'ArrowLeft': showPrev(); break;
            case 'ArrowRight': showNext(); break;
            case '+':
            case '=': zoomIn(); break;
            case '-': zoomOut(); break;
            case 'r': rotateRight(); break;
            case 'R': rotateLeft(); break;
            case '0': resetView(); break;
        }
    });

    // Swipe gestures for navigation (when not zoomed)
    const swipeThreshold = 50;
    let containerTouchStartX = 0;
    let containerTouchEndX = 0;

    lightbox.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1 && currentZoom <= 1) {
            containerTouchStartX = e.touches[0].clientX;
            containerTouchEndX = containerTouchStartX;
        }
    }, { passive: true });

    lightbox.addEventListener('touchmove', (e) => {
        if (e.touches.length === 1 && currentZoom <= 1) {
            containerTouchEndX = e.touches[0].clientX;
        }
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
        // Only process if not from the image itself (image has its own handler)
        if (e.target !== lightboxImg && currentZoom <= 1) {
            const deltaX = containerTouchEndX - containerTouchStartX;
            if (Math.abs(deltaX) > swipeThreshold) {
                if (deltaX > 0) {
                    showPrev();
                } else {
                    showNext();
                }
            }
        }
    });

    // Mouse wheel zoom
    lightbox.addEventListener('wheel', (e) => {
        if (!lightbox.classList.contains('active')) return;
        e.preventDefault();
        if (e.deltaY < 0) {
            zoomIn();
        } else {
            zoomOut();
        }
    }, { passive: false });
})();