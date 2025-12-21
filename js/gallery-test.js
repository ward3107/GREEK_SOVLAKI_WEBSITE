// Working gallery lightbox script
console.log('[Gallery] Lightbox script loading...');

// Simple lightbox implementation
(function() {
    let currentIndex = 0;
    const galleryImages = document.querySelectorAll('.gallery-item img');
    console.log('[Gallery] Found images:', galleryImages.length);

    // Create lightbox elements
    function createLightbox() {
        const lightbox = document.createElement('div');
        lightbox.id = 'gallery-lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-backdrop">
                <div class="lightbox-content">
                    <button class="lightbox-close" aria-label="Close">&times;</button>
                    <img class="lightbox-image" src="" alt="">
                    <div class="lightbox-nav">
                        <button class="lightbox-prev" aria-label="Previous">‹</button>
                        <button class="lightbox-next" aria-label="Next">›</button>
                    </div>
                </div>
            </div>
        `;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            #gallery-lightbox {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 999999;
                background: rgba(0, 0, 0, 0.9);
            }
            .lightbox-backdrop {
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }
            .lightbox-content {
                position: relative;
                max-width: 90vw;
                max-height: 90vh;
                background: white;
                border-radius: 8px;
                overflow: hidden;
            }
            .lightbox-close {
                position: absolute;
                top: 10px;
                right: 15px;
                background: rgba(220, 38, 38, 0.95);
                color: white;
                border: none;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                font-size: 32px;
                cursor: pointer;
                z-index: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
            }
            .lightbox-close:hover {
                background: rgba(220, 38, 38, 1);
            }
            .lightbox-image {
                max-width: 100%;
                max-height: 80vh;
                object-fit: contain;
            }
            .lightbox-nav {
                position: absolute;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                display: flex;
                gap: 20px;
            }
            .lightbox-prev, .lightbox-next {
                background: rgba(30, 64, 175, 0.9);
                color: white;
                border: none;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                font-size: 24px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }
            .lightbox-prev:hover, .lightbox-next:hover {
                background: rgba(30, 64, 175, 1);
                transform: scale(1.1);
            }
            .lightbox-prev:disabled, .lightbox-next:disabled {
                opacity: 0.5;
                cursor: not-allowed;
                transform: scale(1);
            }
            @media (max-width: 768px) {
                .lightbox-nav {
                    bottom: 10px;
                }
                .lightbox-close {
                    top: 5px;
                    right: 10px;
                    width: 40px;
                    height: 40px;
                    font-size: 24px;
                }
                .lightbox-prev, .lightbox-next {
                    width: 40px;
                    height: 40px;
                    font-size: 20px;
                }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(lightbox);

        return lightbox;
    }

    // Initialize lightbox
    const lightbox = createLightbox();
    const lightboxImg = lightbox.querySelector('.lightbox-image');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');

    // Open lightbox
    function openLightbox(index) {
        currentIndex = index;
        const img = galleryImages[index];
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || 'Gallery image';
        lightbox.style.display = 'block';
        document.body.style.overflow = 'hidden';

        // Update navigation buttons
        prevBtn.disabled = index === 0;
        nextBtn.disabled = index === galleryImages.length - 1;

        console.log('[Gallery] Lightbox opened for image:', index);
    }

    // Close lightbox
    function closeLightbox() {
        lightbox.style.display = 'none';
        document.body.style.overflow = '';
        console.log('[Gallery] Lightbox closed');
    }

    // Navigation functions
    function showPrev() {
        if (currentIndex > 0) {
            openLightbox(currentIndex - 1);
        }
    }

    function showNext() {
        if (currentIndex < galleryImages.length - 1) {
            openLightbox(currentIndex + 1);
        }
    }

    // Set up click listeners
    galleryImages.forEach((img, index) => {
        console.log('[Gallery] Setting up image:', img.src);
        img.style.cursor = 'pointer';
        img.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('[Gallery] Image clicked:', index, '- Opening lightbox');
            openLightbox(index);
            return false;
        });
    });

    // Event listeners
    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', showPrev);
    nextBtn.addEventListener('click', showNext);

    // Close on backdrop click
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox || e.target.classList.contains('lightbox-backdrop')) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (lightbox.style.display === 'block') {
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                showPrev();
            } else if (e.key === 'ArrowRight') {
                showNext();
            }
        }
    });

    console.log('[Gallery] Lightbox initialized successfully');
})();