// Final Simple Lightbox - Fixed positioning with scroll offset
console.log('[SL-FINAL] Loading final lightbox...');

(function() {
    'use strict';

    let currentIndex = 0;
    let currentZoom = 1;
    let currentRotation = 0;
    let originalBodyStyle = '';

    // Get scroll position from body.top (set by mobile-menu-fix.js)
    function getScrollY() {
        const bodyTop = document.body.style.top;
        if (bodyTop) {
            return Math.abs(parseInt(bodyTop) || 0);
        }
        return window.scrollY || 0;
    }

    // Get all gallery images
    const galleryImages = Array.from(document.querySelectorAll('.gallery-item img'));
    console.log('[SL-FINAL] Found', galleryImages.length, 'gallery images');

    // If no images found yet, wait for them to load
    if (galleryImages.length === 0) {
        console.log('[SL-FINAL] No images found, waiting for gallery to load...');
        setTimeout(initLightbox, 500);
        setTimeout(initLightbox, 1000);
        setTimeout(initLightbox, 2000);
        return;
    }

    // Force images to be visible and load them
    galleryImages.forEach((img, index) => {
        // Check if image is visible
        const rect = img.getBoundingClientRect();
        const isVisible = rect.width > 0 && rect.height > 0;

        if (!isVisible) {
            console.log('[SL-FINAL] Image', index, 'is not visible, forcing display...');
            img.style.display = 'block';
            img.style.visibility = 'visible';
            img.style.opacity = '1';
        }

        // Ensure image has src and loads
        if (!img.src && img.dataset.src) {
            img.src = img.dataset.src;
        }

        // Remove loading="lazy" to force immediate load
        if (img.loading === 'lazy') {
            img.loading = 'eager';
        }
    });

    console.log('[SL-FINAL] Images processed and made visible');

    // Create lightbox wrapper - positioned at current scroll
    const lightbox = document.createElement('div');
    lightbox.id = 'lightbox-wrapper';
    Object.assign(lightbox.style, {
        display: 'none',
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        minHeight: '100vh',
        background: 'rgba(0, 0, 0, 0.95)',
        zIndex: '999999',
        overflow: 'hidden'
    });

    // Lightbox content container - uses flex to center everything
    const content = document.createElement('div');
    Object.assign(content.style, {
        position: 'relative',
        width: '100%',
        height: '100vh',
        maxHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    });
    lightbox.appendChild(content);

    // Image - with max size to leave room for controls
    const img = document.createElement('img');
    img.id = 'lightbox-image';
    Object.assign(img.style, {
        maxWidth: '85vw',
        maxHeight: '70vh',
        width: 'auto',
        height: 'auto',
        objectFit: 'contain',
        display: 'block',
        transition: 'transform 0.3s ease',
        background: 'white',
        padding: '10px',
        borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        flexShrink: '0'
    });
    content.appendChild(img);

    // Close button - top right, always visible
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '×';
    closeBtn.setAttribute('aria-label', 'Close');
    Object.assign(closeBtn.style, {
        position: 'absolute',
        top: '15px',
        right: '15px',
        width: '50px',
        height: '50px',
        fontSize: '40px',
        lineHeight: '1',
        background: 'white',
        color: 'black',
        border: '3px solid #333',
        borderRadius: '50%',
        cursor: 'pointer',
        zIndex: '1000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: '0'
    });
    content.appendChild(closeBtn);

    // Navigation buttons - vertically centered
    const prevBtn = document.createElement('button');
    prevBtn.innerHTML = '❮';
    prevBtn.setAttribute('aria-label', 'Previous');
    Object.assign(prevBtn.style, {
        position: 'absolute',
        top: '50%',
        left: '15px',
        transform: 'translateY(-50%)',
        width: '50px',
        height: '50px',
        fontSize: '30px',
        lineHeight: '1',
        background: 'rgba(255,255,255,0.95)',
        color: 'black',
        border: '2px solid #333',
        borderRadius: '50%',
        cursor: 'pointer',
        zIndex: '999',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: '0'
    });
    content.appendChild(prevBtn);

    const nextBtn = document.createElement('button');
    nextBtn.innerHTML = '❯';
    nextBtn.setAttribute('aria-label', 'Next');
    Object.assign(nextBtn.style, {
        position: 'absolute',
        top: '50%',
        right: '15px',
        transform: 'translateY(-50%)',
        width: '50px',
        height: '50px',
        fontSize: '30px',
        lineHeight: '1',
        background: 'rgba(255,255,255,0.95)',
        color: 'black',
        border: '2px solid #333',
        borderRadius: '50%',
        cursor: 'pointer',
        zIndex: '999',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: '0'
    });
    content.appendChild(nextBtn);

    // Toolbar at bottom - compact and visible
    const toolbar = document.createElement('div');
    Object.assign(toolbar.style, {
        position: 'absolute',
        bottom: '15px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '8px',
        background: 'rgba(0,0,0,0.85)',
        padding: '10px 15px',
        borderRadius: '25px',
        zIndex: '1000',
        flexShrink: '0'
    });

    // Zoom controls
    const zoomOutBtn = document.createElement('button');
    zoomOutBtn.innerHTML = '−';
    zoomOutBtn.setAttribute('aria-label', 'Zoom out');
    Object.assign(zoomOutBtn.style, {
        width: '38px',
        height: '38px',
        fontSize: '22px',
        background: 'white',
        color: 'black',
        border: 'none',
        borderRadius: '50%',
        cursor: 'pointer',
        flexShrink: '0'
    });

    const zoomLevel = document.createElement('span');
    zoomLevel.id = 'zoom-level';
    zoomLevel.textContent = '100%';
    Object.assign(zoomLevel.style, {
        color: 'white',
        fontSize: '13px',
        minWidth: '45px',
        textAlign: 'center',
        lineHeight: '38px'
    });

    const zoomInBtn = document.createElement('button');
    zoomInBtn.innerHTML = '+';
    zoomInBtn.setAttribute('aria-label', 'Zoom in');
    Object.assign(zoomInBtn.style, {
        width: '38px',
        height: '38px',
        fontSize: '22px',
        background: 'white',
        color: 'black',
        border: 'none',
        borderRadius: '50%',
        cursor: 'pointer',
        flexShrink: '0'
    });

    // Rotate controls
    const rotateLeftBtn = document.createElement('button');
    rotateLeftBtn.innerHTML = '↺';
    rotateLeftBtn.setAttribute('aria-label', 'Rotate left');
    Object.assign(rotateLeftBtn.style, {
        width: '38px',
        height: '38px',
        fontSize: '16px',
        background: 'white',
        color: 'black',
        border: 'none',
        borderRadius: '50%',
        cursor: 'pointer',
        flexShrink: '0'
    });

    const rotateRightBtn = document.createElement('button');
    rotateRightBtn.innerHTML = '↻';
    rotateRightBtn.setAttribute('aria-label', 'Rotate right');
    Object.assign(rotateRightBtn.style, {
        width: '38px',
        height: '38px',
        fontSize: '16px',
        background: 'white',
        color: 'black',
        border: 'none',
        borderRadius: '50%',
        cursor: 'pointer',
        flexShrink: '0'
    });

    // Reset button
    const resetBtn = document.createElement('button');
    resetBtn.innerHTML = '↺↻';
    resetBtn.setAttribute('aria-label', 'Reset view');
    Object.assign(resetBtn.style, {
        width: '38px',
        height: '38px',
        fontSize: '11px',
        background: 'white',
        color: 'black',
        border: 'none',
        borderRadius: '50%',
        cursor: 'pointer',
        flexShrink: '0'
    });

    toolbar.appendChild(zoomOutBtn);
    toolbar.appendChild(zoomLevel);
    toolbar.appendChild(zoomInBtn);
    toolbar.appendChild(rotateLeftBtn);
    toolbar.appendChild(rotateRightBtn);
    toolbar.appendChild(resetBtn);
    content.appendChild(toolbar);

    // Add to body
    document.body.appendChild(lightbox);
    console.log('[SL-FINAL] Lightbox added to DOM');

    // Update transform function
    function updateTransform() {
        img.style.transform = `rotate(${currentRotation}deg) scale(${currentZoom})`;
    }

    // Show image function
    function showImage(index) {
        if (index < 0) index = galleryImages.length - 1;
        if (index >= galleryImages.length) index = 0;
        currentIndex = index;

        const sourceImg = galleryImages[currentIndex];
        console.log('[SL-FINAL] Showing image', currentIndex, ':', sourceImg.src);

        img.src = sourceImg.src;
        img.alt = sourceImg.alt || 'Gallery image';

        // Update navigation buttons
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex === galleryImages.length - 1;
        prevBtn.style.opacity = prevBtn.disabled ? '0.3' : '1';
        nextBtn.style.opacity = nextBtn.disabled ? '0.3' : '1';
    }

    // Open lightbox - position at current scroll
    function openLightbox(index) {
        console.log('[SL-FINAL] Opening lightbox for image', index);

        // Save original body style
        originalBodyStyle = document.body.style.cssText || '';

        // Get current scroll position
        const scrollY = getScrollY();
        console.log('[SL-FINAL] Current scroll position:', scrollY);

        // Position lightbox at scroll position
        lightbox.style.top = scrollY + 'px';
        lightbox.style.display = 'block';
        document.body.style.overflow = 'hidden';

        showImage(index);
    }

    // Close lightbox
    function closeLightbox() {
        console.log('[SL-FINAL] Closing lightbox');
        lightbox.style.display = 'none';

        // Restore original body style
        if (originalBodyStyle) {
            document.body.style.cssText = originalBodyStyle;
        } else {
            document.body.style.overflow = '';
        }
    }

    // Event handlers
    closeBtn.addEventListener('click', closeLightbox);

    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showImage(currentIndex - 1);
    });

    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showImage(currentIndex + 1);
    });

    zoomOutBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentZoom = Math.max(0.5, currentZoom - 0.25);
        zoomLevel.textContent = Math.round(currentZoom * 100) + '%';
        updateTransform();
    });

    zoomInBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentZoom = Math.min(4, currentZoom + 0.25);
        zoomLevel.textContent = Math.round(currentZoom * 100) + '%';
        updateTransform();
    });

    rotateLeftBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentRotation -= 90;
        updateTransform();
    });

    rotateRightBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentRotation += 90;
        updateTransform();
    });

    resetBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentZoom = 1;
        currentRotation = 0;
        zoomLevel.textContent = '100%';
        updateTransform();
    });

    // Click background to close
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target === content) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (lightbox.style.display === 'none') return;

        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                showImage(currentIndex - 1);
                break;
            case 'ArrowRight':
                showImage(currentIndex + 1);
                break;
        }
    });

    // Set cursor on gallery images
    galleryImages.forEach((sourceImg) => {
        sourceImg.style.cursor = 'pointer';
    });

    // Add click handlers using event delegation
    // Debug: log all clicks to diagnose issues
    document.addEventListener('click', (e) => {
        console.log('[SL-DEBUG] Click on:', e.target.tagName, e.target.className);
    }, true);

    document.addEventListener('click', (e) => {
        const clickedImg = e.target.closest('.gallery-item img');
        if (clickedImg) {
            console.log('[SL-FINAL] Gallery image clicked! Opening lightbox...');
            e.preventDefault();
            e.stopPropagation();
            const index = galleryImages.indexOf(clickedImg);
            if (index !== -1) {
                openLightbox(index);
            }
        }
    }, true);

    console.log('[SL-FINAL] Lightbox initialized! Gallery images:', galleryImages.length);

})();

