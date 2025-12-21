// Force HTTP loading for local development
(function() {
    // Only run on local IP addresses
    if (window.location.hostname.includes('192.168.') ||
        window.location.hostname.includes('127.') ||
        window.location.hostname === 'localhost') {

        // Force all resources to use HTTP
        const forceHttp = function() {
            const elements = document.querySelectorAll('img, link, script');
            elements.forEach(function(element) {
                const src = element.src || element.href;
                if (src && src.startsWith('https://')) {
                    const httpSrc = src.replace('https://', 'http://');
                    if (element.src) element.src = httpSrc;
                    if (element.href) element.href = httpSrc;
                }
            });
        };

        // Run immediately and again after DOM is loaded
        forceHttp();
        document.addEventListener('DOMContentLoaded', forceHttp);

        // Intercept fetch requests
        const originalFetch = window.fetch;
        window.fetch = function(url, options) {
            if (typeof url === 'string' && url.startsWith('https://') &&
                url.includes('192.168.') || url.includes('127.') || url.includes('localhost')) {
                url = url.replace('https://', 'http://');
            }
            return originalFetch.call(this, url, options);
        };

        console.log('HTTP force loaded for local development');
    }
})();