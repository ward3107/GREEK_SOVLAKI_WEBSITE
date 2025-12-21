// Simple gallery test script
console.log('[Gallery Test] Simple test script loaded');

document.addEventListener('DOMContentLoaded', function() {
    console.log('[Gallery Test] DOM loaded, looking for gallery images...');
    const galleryImages = document.querySelectorAll('.gallery-item img');
    console.log('[Gallery Test] Found images:', galleryImages.length);

    galleryImages.forEach((img, index) => {
        console.log('[Gallery Test] Setting up image:', img.src);
        img.style.cursor = 'pointer';
        img.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('[Gallery Test] Image clicked! Stopping navigation.');
            alert('Gallery image clicked! Lightbox should open here.');
            return false;
        });
    });
});