// Mobile menu - CSS-only checkbox hack (no JS clicks needed)
console.log('[MOBILE-MENU] Setting up CSS-only mobile menu');

function setupCheckboxMenu() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) {
        console.log('[MOBILE-MENU] Navbar not found, retrying...');
        return false;
    }

    // Create checkbox for toggle state
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = 'mobile-menu-toggle';
    checkbox.style.cssText = 'display: none;';

    // Create hamburger label
    const label = document.createElement('label');
    label.htmlFor = 'mobile-menu-toggle';
    label.className = 'hamburger-css';
    label.innerHTML = '<span></span><span></span><span></span>';
    label.setAttribute('aria-label', 'Toggle menu');
    label.style.cssText = `
        display: flex;
        flex-direction: column;
        cursor: pointer;
        gap: 5px;
        position: fixed;
        top: 15px;
        right: 15px;
        z-index: 999999;
        padding: 10px;
        background: rgba(30, 58, 138, 0.9);
        border-radius: 8px;
        border: 2px solid white;
    `;

    // Style spans
    label.querySelectorAll('span').forEach((span, i) => {
        span.style.cssText = `
            width: 25px;
            height: 3px;
            background: white;
            border-radius: 3px;
            transition: all 0.3s;
        `;
    });

    // Add to navbar
    navbar.insertBefore(checkbox, navbar.firstChild);
    navbar.appendChild(label);

    // Add CSS for panel visibility based on checkbox
    const style = document.createElement('style');
    style.textContent = `
        /* Hide panel by default on mobile */
        @media (max-width: 768px) {
            .main-nav-panel {
                display: none !important;
                opacity: 0 !important;
                visibility: hidden !important;
            }

            /* Show panel when checkbox is checked */
            #mobile-menu-toggle:checked ~ .container .main-nav-panel,
            #mobile-menu-toggle:checked ~ * .main-nav-panel {
                display: block !important;
                opacity: 1 !important;
                visibility: visible !important;
                position: fixed !important;
                top: 70px !important;
                left: 0 !important;
                right: 0 !important;
                bottom: 0 !important;
                min-height: calc(100vh - 70px) !important;
                background: rgba(30, 58, 138, 0.98) !important;
                z-index: 999998 !important;
                padding: 20px !important;
                overflow-y: auto !important;
            }

            /* Hide original hamburger */
            .hamburger {
                display: none !important;
            }

            /* Transform hamburger to X when checked */
            #mobile-menu-toggle:checked ~ label.hamburger-css span:nth-child(1) {
                transform: rotate(45deg) translate(6px, 6px);
            }
            #mobile-menu-toggle:checked ~ label.hamburger-css span:nth-child(2) {
                opacity: 0;
            }
            #mobile-menu-toggle:checked ~ label.hamburger-css span:nth-child(3) {
                transform: rotate(-45deg) translate(6px, -6px);
            }
        }
    `;
    document.head.appendChild(style);

    console.log('[MOBILE-MENU] CSS-only menu setup complete!');
    return true;
}

// Try to setup immediately
if (!setupCheckboxMenu()) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupCheckboxMenu);
    }
    setTimeout(setupCheckboxMenu, 100);
    setTimeout(setupCheckboxMenu, 500);
}
