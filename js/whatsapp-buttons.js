/**
 * WhatsApp Floating Buttons Handler
 * Manages the WhatsApp circle buttons functionality and interactions
 */

(function() {
    'use strict';

    class WhatsAppButtons {
        constructor() {
            this.container = null;
            this.buttons = null;
            this.init();
        }

        init() {
            // Get WhatsApp elements
            this.container = document.querySelector('.whatsapp-floating');
            this.buttons = document.querySelectorAll('.whatsapp-circle');

            console.log('WhatsApp Debug - Container:', this.container);
            console.log('WhatsApp Debug - Buttons found:', this.buttons.length);

            if (!this.container || this.buttons.length === 0) {
                console.error('WhatsApp buttons not found - container:', this.container, 'buttons:', this.buttons.length);
                return;
            }

            // CRITICAL FIX: Move widgets to documentElement to escape any containing block issues
            document.documentElement.appendChild(this.container);

            this.setupButtons();
            this.setupPositioning();
            this.setupAccessibility();

            console.log('WhatsApp buttons initialized successfully - moved to documentElement');
        }

        setupButtons() {
            this.buttons.forEach((button, index) => {
                // Add click tracking
                button.addEventListener('click', (e) => {
                    this.trackWhatsAppClick(button.getAttribute('href'), index);
                });

                // Add keyboard support
                button.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        button.click();
                    }
                });
            });
        }

        setupPositioning() {
            // Adjust position based on accessibility widget presence
            this.adjustForAccessibilityWidget();

            // Monitor accessibility widget visibility changes
            this.observeAccessibilityWidget();

            // Setup scroll behavior - buttons follow user scroll
            this.setupScrollBehavior();

            // Staggered entrance animation
            this.animateEntrance();
        }

        adjustForAccessibilityWidget() {
            const accessibilityWidget = document.getElementById('accessibility-badge-container');

            if (accessibilityWidget) {
                // Check if accessibility widget is visible
                const isVisible = !accessibilityWidget.classList.contains('hidden');

                if (isVisible) {
                    this.container.style.bottom = '140px'; // Move up more
                } else {
                    this.container.style.bottom = '120px'; // Default position
                }
            }
        }

        observeAccessibilityWidget() {
            const accessibilityWidget = document.getElementById('accessibility-badge-container');

            if (accessibilityWidget && window.MutationObserver) {
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.type === 'attributes' &&
                            mutation.attributeName === 'class') {
                            this.adjustForAccessibilityWidget();
                        }
                    });
                });

                observer.observe(accessibilityWidget, {
                    attributes: true,
                    attributeFilter: ['class']
                });
            }
        }

        setupScrollBehavior() {
            let lastScrollY = window.scrollY;
            let scrollTimeout;
            let currentScrollDirection = 'down';
            let scrollVelocity = 0;

            console.log('WhatsApp Debug - Setting up scroll behavior');

            // Add scroll listener with debouncing
            window.addEventListener('scroll', () => {
                const currentScrollY = window.scrollY;
                const scrollDiff = currentScrollY - lastScrollY;

                console.log('WhatsApp Debug - Scroll detected, diff:', scrollDiff, 'currentY:', currentScrollY);

                // Calculate scroll velocity
                scrollVelocity = scrollDiff;

                // Determine scroll direction
                currentScrollDirection = scrollDiff > 0 ? 'down' : 'up';

                // Simplified and reliable scroll behavior
                if (Math.abs(scrollDiff) > 2) {
                    const scrollPercentage = Math.min(currentScrollY / 300, 1); // More sensitive
                    const moveAmount = Math.min(scrollPercentage * 15, 20); // Gentle movement

                    console.log('WhatsApp Debug - Scroll: currentY=', currentScrollY, 'moveAmount=', moveAmount);

                    // Apply transform - widgets should float up slightly when scrolling down
                    this.container.style.transform = `translateY(-${moveAmount}px)`;
                    // Start from 0.5 base opacity, go up to 0.8 when scrolling
                    this.container.style.opacity = Math.max(0.5, Math.min(0.8, 0.5 + scrollPercentage * 0.3));

                    // Clear existing timeout
                    clearTimeout(scrollTimeout);

                    // Smooth reset after scroll stops
                    scrollTimeout = setTimeout(() => {
                        console.log('WhatsApp Debug - Resetting position to origin');
                        this.container.style.transform = 'translateY(0)';
                        this.container.style.opacity = '0.5'; // Reset to 50% transparency
                    }, 150);
                }

                lastScrollY = currentScrollY;
            }, { passive: true });

            // Add parallax effect on horizontal scroll (if any)
            this.setupHorizontalScrollEffect();
        }

        setupHorizontalScrollEffect() {
            // Optional: Add subtle horizontal parallax effect
            let lastScrollX = window.scrollX || window.pageXOffset;

            window.addEventListener('scroll', () => {
                const currentScrollX = window.scrollX || window.pageXOffset;
                const scrollXDiff = currentScrollX - lastScrollX;

                if (Math.abs(scrollXDiff) > 2) {
                    const horizontalOffset = scrollXDiff * 0.1; // Subtle horizontal effect
                    this.container.style.transform += ` translateX(${horizontalOffset}px)`;

                    // Reset horizontal position after animation
                    setTimeout(() => {
                        this.resetTransform();
                    }, 100);
                }

                lastScrollX = currentScrollX;
            }, { passive: true });
        }

        resetTransform() {
            const currentTransform = this.container.style.transform;
            if (currentTransform) {
                // Only reset horizontal translation, keep the base position
                const match = currentTransform.match(/translateY\([^)]+\)/);
                if (match) {
                    this.container.style.transform = match[1];
                }
            }
        }

        animateEntrance() {
            // Staggered entrance animation
            this.buttons.forEach((button, index) => {
                button.style.opacity = '0';
                button.style.transform = 'translateY(20px) scale(0.8)';

                setTimeout(() => {
                    button.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                    button.style.opacity = '1';
                    button.style.transform = 'translateY(0) scale(1)';
                }, 500 + (index * 150));
            });
        }

        trackWhatsAppClick(url, buttonIndex) {
            // Simple console tracking
            console.log(`WhatsApp clicked: Button ${buttonIndex + 1}, URL: ${url}`);

            // Store interaction locally
            try {
                const interactions = JSON.parse(localStorage.getItem('whatsapp_interactions') || '[]');
                interactions.push({
                    timestamp: Date.now(),
                    buttonIndex: buttonIndex,
                    url: url,
                    page: window.location.pathname
                });
                // Keep only last 50 interactions
                if (interactions.length > 50) {
                    interactions.splice(0, interactions.length - 50);
                }
                localStorage.setItem('whatsapp_interactions', JSON.stringify(interactions));
            } catch (error) {
                // Ignore localStorage errors
            }
        }

        setupAccessibility() {
            // Ensure proper focus management
            this.buttons.forEach(button => {
                button.setAttribute('role', 'button');
                button.setAttribute('tabindex', '0');
            });
        }
    }

    // Initialize when DOM is ready
    function initWhatsAppButtons() {
        try {
            new WhatsAppButtons();
        } catch (error) {
            console.error('Error initializing WhatsApp buttons:', error);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWhatsAppButtons);
    } else {
        initWhatsAppButtons();
    }

    // Expose a simple global method for debugging
    window.WhatsAppButtons = {
        getStats: function() {
            try {
                const interactions = JSON.parse(localStorage.getItem('whatsapp_interactions') || '[]');
                return {
                    totalClicks: interactions.length,
                    lastClick: interactions.length > 0 ? interactions[interactions.length - 1] : null
                };
            } catch (error) {
                return { totalClicks: 0, lastClick: null };
            }
        },
        testMovement: function() {
            const container = document.querySelector('.whatsapp-floating');
            if (container) {
                console.log('Testing WhatsApp movement...');
                container.style.transform = 'translateY(-30px) scale(0.9)';
                container.style.opacity = '0.8';
                setTimeout(() => {
                    container.style.transform = 'translateY(0) scale(1)';
                    container.style.opacity = '0.5'; // Reset to 50% transparency
                }, 1000);
            }
        }
    };
})();