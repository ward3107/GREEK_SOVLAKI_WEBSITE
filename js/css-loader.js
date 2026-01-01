// CSS Loading Handler - replaces onload handlers for CSS files
(function() {
    'use strict';

    // Function to enable CSS media for specific links
    function enableCSSMedia() {
        const cssLinks = document.querySelectorAll('link[media="print"][rel="stylesheet"]');
        cssLinks.forEach(function(link) {
            // Only process the specific CSS files that had onload handlers
            if (link.href.includes('animations.css') ||
                link.href.includes('accessibility-widget.css') ||
                link.href.includes('cookie-consent.css') ||
                link.href.includes('fonts.googleapis.com')) {
                link.media = 'all';
            }
        });
    }

    // Run immediately and also as a fallback
    enableCSSMedia();

    // For browsers that might not process the above immediately
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', enableCSSMedia);
    }
})();