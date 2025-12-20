/**
 * Premium Falling Snow Effect
 * Lightweight, performant Canvas-based snow overlay for restaurant website
 */

(function() {
    'use strict';

    // Configuration: Adjust these values to customize snow effect
    const CONFIG = {
        // Snow density: Number of snowflakes (lower = better performance)
        desktopDensity: 150,    // Desktop snowflake count - increased for more snow
        mobileDensity: 60,     // Mobile snowflake count (reduced for performance)

        // Animation speed: Higher = faster falling
        speedMultiplier: 0.8,  // Slower for more natural falling

        // Visual settings
        opacity: 0.8,          // Snowflake opacity (0.1 to 1.0) - more visible
        minSize: 2,           // Minimum snowflake size - larger flakes
        maxSize: 6,           // Maximum snowflake size - larger flakes

        // Performance settings
        reduceMotionOnMobile: true,  // Further reduce motion on small screens
        disableOnMobile: false,      // Set to true to completely disable on mobile
        mobileBreakpoint: 768        // Mobile breakpoint in pixels
    };

    let canvas, ctx, snowflakes = [];
    let animationId;
    let isReducedMotion = false;
    let isMobile = false;

    // Check for accessibility preference
    function checkAccessibility() {
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            isReducedMotion = true;
        }
    }

    // Check if mobile device
    function checkMobile() {
        isMobile = window.innerWidth <= CONFIG.mobileBreakpoint;
    }

    // Snowflake class
    class Snowflake {
        constructor() {
            this.reset();
            this.y = Math.random() * canvas.height; // Start at random position initially
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = -10;
            this.size = Math.random() * (CONFIG.maxSize - CONFIG.minSize) + CONFIG.minSize;
            this.speed = Math.random() * 2 + 1;
            this.wind = Math.random() * 0.5 - 0.25; // Wind effect (-0.25 to 0.25)
            this.opacity = Math.random() * 0.5 + CONFIG.opacity * 0.5; // Vary opacity
        }

        update() {
            // Apply movement
            this.y += this.speed * CONFIG.speedMultiplier;
            this.x += this.wind;

            // Add slight swaying motion
            this.x += Math.sin(this.y * 0.01) * 0.3;

            // Reset if out of bounds
            if (this.y > canvas.height + 10) {
                this.reset();
            }
            if (this.x > canvas.width + 10 || this.x < -10) {
                this.x = Math.random() * canvas.width;
            }
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    // Initialize canvas
    function initCanvas() {
        canvas = document.createElement('canvas');
        canvas.id = 'snow-canvas';
        canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            pointer-events: none;
            z-index: 1000;
            opacity: 0.9;
        `;

        // Set canvas resolution for crisp rendering on high-DPI displays
        const dpr = window.devicePixelRatio || 1;
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        canvas.style.width = window.innerWidth + 'px';
        canvas.style.height = window.innerHeight + 'px';

        ctx = canvas.getContext('2d');
        ctx.scale(dpr, dpr);
    }

    // Create snowflakes
    function createSnowflakes() {
        const density = isMobile ? CONFIG.mobileDensity : CONFIG.desktopDensity;
        const count = isReducedMotion ? Math.floor(density * 0.3) : density;

        snowflakes = [];
        for (let i = 0; i < count; i++) {
            snowflakes.push(new Snowflake());
        }
    }

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        snowflakes.forEach(snowflake => {
            snowflake.update();
            snowflake.draw();
        });

        animationId = requestAnimationFrame(animate);
    }

    // Handle window resize
    function handleResize() {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        canvas.style.width = window.innerWidth + 'px';
        canvas.style.height = window.innerHeight + 'px';
        ctx.scale(dpr, dpr);

        checkMobile();
        createSnowflakes(); // Recreate for new screen size
    }

    // Cleanup function
    function cleanup() {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        if (canvas && canvas.parentNode) {
            canvas.parentNode.removeChild(canvas);
        }
        snowflakes = [];
    }

    // Initialize snow effect
    function init() {
        // Skip if reduced motion is preferred
        if (isReducedMotion) {
            console.log('Snow effect disabled: prefers-reduced-motion');
            return;
        }

        // Skip on mobile if configured
        if (isMobile && CONFIG.disableOnMobile) {
            console.log('Snow effect disabled: on mobile');
            return;
        }

        try {
            initCanvas();
            createSnowflakes();
            animate();

            // Add to page
            document.body.appendChild(canvas);

            // Set up event listeners
            window.addEventListener('resize', handleResize);

            // Listen for accessibility preference changes
            if (window.matchMedia) {
                const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
                motionQuery.addListener((e) => {
                    if (e.matches) {
                        cleanup();
                    } else {
                        init();
                    }
                });
            }

        } catch (error) {
            console.warn('Snow effect initialization failed:', error);
        }
    }

    // Start when DOM is ready
    function ready() {
        checkAccessibility();
        checkMobile();
        init();
    }

    // DOM ready check
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', ready);
    } else {
        ready();
    }

})();