/**
 * Index page specific scripts extracted from inline HTML
 * This allows removing 'unsafe-inline' from Content Security Policy
 */

// Service Worker Registration (CSP-safe, no inline scripts)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log("Service Worker registered successfully:", registration.scope);
      })
      .catch((error) => {
        console.log("Service Worker registration failed:", error);
      });
}

// Image Fade-In Handler
function initializeImageFadeIn() {
    'use strict';

    // Add fade-in effect when images load
    function handleImageLoad(img) {
        img.classList.add('loaded');
    }

    // Handle existing images
    document.querySelectorAll('img').forEach(img => {
        if (img.complete) {
            handleImageLoad(img);
        } else {
            img.addEventListener('load', () => handleImageLoad(img));
            img.addEventListener('error', () => {
                img.classList.add('error');
            });
        }
    });

    // Handle dynamically loaded images
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    if (node.tagName === 'IMG') {
                        if (node.complete) {
                            handleImageLoad(node);
                        } else {
                            node.addEventListener('load', () => handleImageLoad(node));
                        }
                    } else {
                        const images = node.querySelectorAll && node.querySelectorAll('img');
                        if (images) {
                            images.forEach(img => {
                                if (img.complete) {
                                    handleImageLoad(img);
                                } else {
                                    img.addEventListener('load', () => handleImageLoad(img));
                                }
                            });
                        }
                    }
                }
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// Initialize all index page scripts
document.addEventListener('DOMContentLoaded', function() {

    initializeImageFadeIn();
});


