// WOW Features - Making the website one-of-a-kind!
(function() {
    'use strict';

    // Initialize all wow features
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        initParallax();
        initScrollAnimations();
        init3DCardEffects();
        console.log('✨ WOW features activated!');
    }

    // 1. PARALLAX SCROLLING
    function initParallax() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        window.addEventListener('scroll', function() {
            const scrolled = window.scrollY;
            const parallaxSpeed = 0.5;
            hero.style.backgroundPositionY = (scrolled * parallaxSpeed) + 'px';
        }, { passive: true });

        console.log('✨ Parallax effect activated');
    }

    // 2. SCROLL ANIMATIONS (Fade-in, Slide-in)
    function initScrollAnimations() {
        // Add animation classes to elements
        const animatedElements = document.querySelectorAll(`
            .menu-card,
            .menu-category-modern,
            .feature,
            .gallery-item,
            .about-section p,
            .contact-info > div
        `);

        animatedElements.forEach((el, index) => {
            el.classList.add('animate-on-scroll');
            el.style.animationDelay = (index % 6) * 0.1 + 's';
        });

        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    // Optional: unobserve after animation
                    // observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animatedElements.forEach(el => observer.observe(el));

        console.log('✨ Scroll animations activated on', animatedElements.length, 'elements');
    }

    // 3. 3D CARD TILT EFFECT
    function init3DCardEffects() {
        const cards = document.querySelectorAll('.menu-card');

        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px) scale(1.02)';
            });

            card.addEventListener('mouseleave', function() {
                this.style.transform = '';
            });

            // Advanced 3D tilt on mouse move
            card.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;

                this.style.transform = `
                    perspective(1000px)
                    rotateX(${rotateX}deg)
                    rotateY(${rotateY}deg)
                    translateY(-8px)
                    scale(1.02)
                `;
            });

            card.addEventListener('mouseleave', function() {
                this.style.transform = '';
            });
        });

        console.log('✨ 3D card effects activated on', cards.length, 'cards');
    }

})();
