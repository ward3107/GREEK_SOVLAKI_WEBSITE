// WOW Animations & Effects
(function() {
    'use strict';

    // ============================================
    // SCROLL REVEAL ANIMATIONS
    // ============================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    function initScrollAnimations() {
        const elements = document.querySelectorAll(
            '.fade-in, .slide-in-left, .slide-in-right, .scale-in, .curtain-reveal, ' +
            '.section-reveal, .section-tilt, .section-zoom, .slide-rotate-left, .slide-rotate-right, ' +
            '.elastic-pop, .flip-reveal, .blur-reveal, .cascade-wave, .swirl-in, .bounce-in, .slide-up-content'
        );
        elements.forEach(el => observer.observe(el));
    }

    // ============================================
    // PARALLAX SCROLLING
    // ============================================
    function initParallax() {
        const parallaxElements = document.querySelectorAll('.parallax-layer');

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;

            parallaxElements.forEach((element, index) => {
                const speed = element.dataset.speed || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        }, { passive: true });
    }

    // ============================================
    // FLOATING PARTICLES
    // ============================================
    function createParticles() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles-container';
        hero.appendChild(particlesContainer);

        // Create Greek-themed particles (circles representing olives, stars, etc.)
        const particleCount = 30;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';

            // Random size between 3-8px
            const size = Math.random() * 5 + 3;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';

            // Random starting position
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';

            // Random animation delay
            particle.style.animationDelay = Math.random() * 15 + 's';

            // Random movement direction
            particle.style.setProperty('--tx', (Math.random() - 0.5) * 200 + 'px');
            particle.style.setProperty('--ty', -(Math.random() * 300 + 200) + 'px');

            particlesContainer.appendChild(particle);
        }
    }

    // ============================================
    // CURSOR TRAIL EFFECT
    // ============================================
    function initCursorTrail() {
        let trails = [];
        const maxTrails = 10;

        document.addEventListener('mousemove', (e) => {
            // Don't add trails if over interactive elements
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A') return;

            const trail = document.createElement('div');
            trail.className = 'cursor-trail';
            trail.style.left = e.pageX + 'px';
            trail.style.top = e.pageY + 'px';

            document.body.appendChild(trail);
            trails.push(trail);

            // Remove trail after animation
            setTimeout(() => {
                trail.remove();
                trails.shift();
            }, 800);

            // Limit number of trails
            if (trails.length > maxTrails) {
                const oldTrail = trails.shift();
                oldTrail.remove();
            }
        });
    }

    // ============================================
    // COLOR SHIFT ON SCROLL
    // ============================================
    function initColorShift() {
        const sections = document.querySelectorAll('section');

        window.addEventListener('scroll', () => {
            const scrollPos = window.scrollY + window.innerHeight / 2;

            sections.forEach((section, index) => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;

                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    section.classList.add('color-shift');
                }
            });
        }, { passive: true });
    }

    // ============================================
    // TYPEWRITER EFFECT
    // ============================================
    function initTypewriter() {
        const typewriterElements = document.querySelectorAll('.typewriter-text');

        typewriterElements.forEach(element => {
            const text = element.textContent;
            element.textContent = '';
            element.style.display = 'inline-block';

            let charIndex = 0;
            const speed = 100; // milliseconds per character

            function type() {
                if (charIndex < text.length) {
                    element.textContent += text.charAt(charIndex);
                    charIndex++;
                    setTimeout(type, speed);
                } else {
                    // Remove cursor after typing is done
                    setTimeout(() => {
                        element.style.borderRight = 'none';
                    }, 500);
                }
            }

            // Start typing after a delay
            setTimeout(type, 1000);
        });
    }

    // ============================================
    // MENU CARD INTERACTIONS & FLOW ANIMATIONS
    // ============================================
    function initMenuCardEffects() {
        // Process each menu grid separately
        const menuGrids = document.querySelectorAll('.menu-card-grid');

        menuGrids.forEach(grid => {
            const cards = grid.querySelectorAll('.menu-card');

            cards.forEach((card, index) => {
                // Remove any existing flow/stagger classes
                card.classList.remove('flow-from-left', 'flow-from-right', 'flow-from-top', 'flow-from-bottom');
                card.classList.remove('stagger-1', 'stagger-2', 'stagger-3', 'stagger-4', 'stagger-5', 'stagger-6');

                // Add base class
                card.classList.add('menu-item-wow');

                // Alternating pattern: odd index from right, even index from left
                const direction = index % 2 === 0 ? 'flow-from-right' : 'flow-from-left';
                card.classList.add(direction);

                // Add stagger delay
                const staggerClass = `stagger-${(index % 3) + 1}`;
                card.classList.add(staggerClass);

                // Add shine effect on hover
                card.addEventListener('mouseenter', function() {
                    this.classList.add('shine-effect');
                });

                card.addEventListener('mouseleave', function() {
                    this.classList.remove('shine-effect');
                });
            });
        });

        // Observe menu cards for scroll animation - only once
        const menuObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Stop observing after animation plays once
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        document.querySelectorAll('.menu-card').forEach(card => menuObserver.observe(card));
    }

    // ============================================
    // IMAGE GALLERY HOVER EFFECTS
    // ============================================
    function initGalleryEffects() {
        const galleryItems = document.querySelectorAll('.gallery-item');

        galleryItems.forEach(item => {
            item.classList.add('zoom-hover');
        });
    }

    // ============================================
    // NUMBER COUNTER ANIMATION
    // ============================================
    function animateCounter(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16); // 60fps
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }

    function initCounters() {
        const counters = document.querySelectorAll('.counter');

        counters.forEach(counter => {
            const target = parseInt(counter.dataset.target);

            const counterObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateCounter(counter, target);
                        counterObserver.unobserve(counter);
                    }
                });
            }, { threshold: 0.5 });

            counterObserver.observe(counter);
        });
    }

    // ============================================
    // SMOOTH SCROLL TO SECTIONS
    // ============================================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href === '#') return;

                e.preventDefault();
                const target = document.querySelector(href);

                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // ============================================
    // GREEK FLAG GLOW EFFECT
    // ============================================
    function initFlagGlow() {
        const flag = document.querySelector('.greek-flag');
        if (flag) {
            flag.classList.add('glow-effect', 'float-animation');
        }
    }

    // ============================================
    // LAZY LOAD IMAGES WITH FADE
    // ============================================
    function initLazyLoad() {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.add('fade-in');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // ============================================
    // VIEW MENU BUTTON SCROLL
    // ============================================
    function initViewMenuButton() {
        const viewMenuBtn = document.querySelector('[data-lang="view-menu"]');
        if (viewMenuBtn) {
            viewMenuBtn.addEventListener('click', () => {
                const menuSection = document.querySelector('#menu');
                if (menuSection) {
                    menuSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    }

    // ============================================
    // INITIALIZE ALL EFFECTS
    // ============================================
    function init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        console.log('🎨 Initializing WOW animations...');

        // Initialize all effects
        initScrollAnimations();
        initParallax();
        createParticles();
        initCursorTrail();
        initColorShift();
        initTypewriter();
        initMenuCardEffects();
        initGalleryEffects();
        initCounters();
        initSmoothScroll();
        initFlagGlow();
        initLazyLoad();
        initViewMenuButton();

        console.log('✨ WOW animations ready!');
    }

    // Start initialization
    init();
})();
