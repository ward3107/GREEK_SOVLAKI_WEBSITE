/**
 * Hide Debug Content Script
 * Removes any unwanted debug or development content that might be displayed
 */

document.addEventListener('DOMContentLoaded', function() {
    // Hide any elements that might be showing debug content
    const debugSelectors = [
        '[id*="debug"]',
        '[id*="console"]',
        '[id*="output"]',
        '[id*="message"]:not(.error-message)',
        '[class*="debug"]',
        '[class*="console-output"]',
        '.developer-info',
        '.debug-panel'
    ];

    debugSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            // Only hide if it's not a legitimate element
            if (!isLegitimateElement(el)) {
                el.style.display = 'none';
                console.log('Hidden debug element:', selector);
            }
        });
    });

    // Remove any text nodes that might contain debug output
    function removeDebugTextNodes(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent.trim();
            // Check if text looks like debug output (contains common debug patterns)
            if (text.includes('===') || text.includes('---') ||
                text.includes('Theme Status') || text.includes('Console') ||
                text.includes('DEBUG') || text.includes('🔧')) {
                node.remove();
                console.log('Removed debug text node:', text.substring(0, 50) + '...');
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            Array.from(node.childNodes).forEach(removeDebugTextNodes);
        }
    }

    // Check body for debug text nodes (but don't disturb legitimate content)
    const bodyClone = document.body.cloneNode(true);
    removeDebugTextNodes(bodyClone);

    // Check for any elements with suspicious innerHTML
    document.querySelectorAll('*').forEach(el => {
        if (el.innerHTML && el.innerHTML.includes('console.log') &&
            el.tagName !== 'SCRIPT' && el.tagName !== 'STYLE') {
            console.warn('Found element with console content:', el.tagName, el.className);
        }
    });

    // Function to check if element is legitimate
    function isLegitimateElement(element) {
        const legitimateClasses = [
            'error-message',  // 404 page error message
            'menu-section',  // Menu sections
            'hero',         // Hero sections
            'footer',       // Footer
            'navbar',       // Navigation
            'gallery',      // Gallery
            'contact',      // Contact sections
            'pwa-install',  // PWA elements
            'whatsapp',     // WhatsApp elements
            'lang-switcher', // Language switcher
            'accessibility', // Accessibility elements
            'cookie-consent'  // Cookie consent
        ];

        const legitimateIds = [
            'pwa-install-prompt'
        ];

        // Check if element has legitimate class or ID
        for (let className of legitimateClasses) {
            if (element.classList && element.classList.contains(className)) {
                return true;
            }
        }

        for (let id of legitimateIds) {
            if (element.id && element.id.includes(id)) {
                return true;
            }
        }

        // Check if element is part of the main content structure
        const parent = element.parentElement;
        if (parent && (parent.classList.contains('legal-container') ||
                         parent.classList.contains('page-content') ||
                         parent.classList.contains('container'))) {
            return true;
        }

        return false;
    }

    console.log('Debug content cleanup completed');
});