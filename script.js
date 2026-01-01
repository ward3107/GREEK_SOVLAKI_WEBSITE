// Mobile menu toggle - runs immediately
(function() {
    let menuInitialized = false;
    let touchHandled = false;

    function initMobileMenu() {
        if (menuInitialized) return;

        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.main-nav-panel');

        if (!hamburger || !navMenu) {
            console.log('[MOBILE-MENU] Hamburger or mainNavPanel not found');
            return;
        }

          menuInitialized = true;
          console.log('[MOBILE-MENU] Found hamburger and mainNavPanel, initializing...');

        // Toggle function
        function toggleMenu() {
            const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
            console.log('[MOBILE-MENU] Toggle menu - currently open:', isOpen);

            if (!isOpen) {
                // Open menu
                hamburger.classList.add('active');
                hamburger.classList.add('mobile-open');
                hamburger.setAttribute('aria-expanded', 'true');

                navMenu.style.display = 'block';
                navMenu.setAttribute('aria-hidden', 'false');

                console.log('[MOBILE-MENU] Menu opened');
            } else {
                // Close menu
                hamburger.classList.remove('active');
                hamburger.classList.remove('mobile-open');
                hamburger.setAttribute('aria-expanded', 'false');
                navMenu.style.display = '';
                navMenu.setAttribute('aria-hidden', 'true');

                console.log('[MOBILE-MENU] Menu closed');
            }
        }

        // Handle touch events - prevent double firing with click
        hamburger.addEventListener('touchstart', function(e) {
            console.log('[MOBILE-MENU] touchstart fired');
            touchHandled = true;
        }, { passive: true });

        hamburger.addEventListener('touchend', function(e) {
            console.log('[MOBILE-MENU] touchend fired');
            e.preventDefault();
            if (touchHandled) {
                touchHandled = false;
                toggleMenu();
            }
        }, { passive: false });

        // Handle click for non-touch devices
        hamburger.addEventListener('click', function(e) {
            console.log('[MOBILE-MENU] click fired, touchHandled:', touchHandled);
            // Skip if touch already handled this interaction
            if (touchHandled) {
                touchHandled = false;
                return;
            }
            toggleMenu();
        });

        // Close menu when clicking a nav link
        const links = navMenu.querySelectorAll('a');
        links.forEach(function(link) {
            link.addEventListener('click', function() {
                console.log('[MOBILE-MENU] Nav link clicked, closing menu');
                hamburger.classList.remove('active');
                hamburger.classList.remove('mobile-open');
                hamburger.setAttribute('aria-expanded', 'false');
                navMenu.style.display = '';
                navMenu.setAttribute('aria-hidden', 'true');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
            if (isOpen && !hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                console.log('[MOBILE-MENU] Clicked outside, closing menu');
                hamburger.classList.remove('active');
                hamburger.classList.remove('mobile-open');
                hamburger.setAttribute('aria-expanded', 'false');
                navMenu.style.display = '';
                navMenu.setAttribute('aria-hidden', 'true');
            }
        });

        console.log('[MOBILE-MENU] Initialization complete!');
    }

    // Try to init now
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileMenu);
    } else {
        initMobileMenu();
    }

    // Also try on window load as backup
    window.addEventListener('load', initMobileMenu);
})();

document.addEventListener('DOMContentLoaded', function() {

    // Language dropdown functionality
    const langDropdownBtn = document.querySelector('.lang-dropdown-btn');
    const languageDropdown = document.querySelector('.language-dropdown');
    const currentLangSpan = document.querySelector('.current-lang');
    const langOptions = document.querySelectorAll('.lang-option');

    // Toggle dropdown
    if (langDropdownBtn && languageDropdown) {
        langDropdownBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const dropdown = this.closest('.language-dropdown') || languageDropdown;
            dropdown.classList.toggle('active');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!languageDropdown.contains(e.target)) {
                languageDropdown.classList.remove('active');
            }
        });

        // Handle language selection
        langOptions.forEach(option => {
            option.addEventListener('click', function(e) {
                e.stopPropagation();
                const lang = this.getAttribute('data-lang-switch');

                // Update current language display
                const langMap = {
                    'en': 'EN',
                    'he': '×¢×‘',
                    'ar': 'Ø¹',
                    'ru': 'Ð Ð£'
                };

                if (currentLangSpan) {
                    currentLangSpan.textContent = langMap[lang] || 'EN';
                }

                // Close dropdown
                languageDropdown.classList.remove('active');

                // Trigger language change (existing functionality from translations.js)
                if (typeof switchLanguage === 'function') {
                    switchLanguage(lang);
                }
            });
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                // Close mobile menu if open
                const navMenu = document.querySelector('.nav-menu');
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                }

                // Scroll to target with offset for fixed navbar
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.offsetTop - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Update active nav item
                document.querySelectorAll('.nav-menu a').forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });

    // Highlight active section on scroll
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-menu a');
        const navbarHeight = document.querySelector('.navbar').offsetHeight;

        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - navbarHeight - 10;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    // Order button functionality - scroll to menu
    const orderBtn = document.querySelector('.cta-btn');
    if (orderBtn) {
        orderBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const menuSection = document.querySelector('#menu');
            if (menuSection) {
                const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
                const targetPosition = menuSection.offsetTop - navbarHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', function () {
    // Normalize currency display (ILS) for prices
    (function normalizeCurrency() {
        const locale = document.documentElement.lang || 'he-IL';
        const nf = new Intl.NumberFormat(locale, { style: 'currency', currency: 'ILS', maximumFractionDigits: 0 });
        const cleanNum = (s) => {
            const m = String(s || '').replace(/[^0-9.\-]/g, '');
            const n = parseFloat(m);
            return isNaN(n) ? null : n;
        };
        const formatText = (t) => {
            const str = String(t || '').trim();
            if (!str) return str;
            if (str.includes('-')) {
                const parts = str.split('-').map(cleanNum).filter(v => v !== null);
                if (parts.length === 2) {
                    return nf.format(parts[0]) + 'â€“' + nf.format(parts[1]);
                }
            }
            const n = cleanNum(str);
            return n !== null ? nf.format(n) : str;
        };
        document.querySelectorAll('.item-price, .category-price').forEach(el => {
            el.textContent = formatText(el.textContent);
        });

        // Also format inline price ranges/numbers from translations
        const rangeRe = /(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)/g;
        const numRe = /(\d+(?:\.\d+)?)/g;
        const targets = document.querySelectorAll('[data-format-prices], [data-lang="events-contact"]');
        targets.forEach(el => {
            let txt = (el.textContent || '').replace(/\uFFFD/g, '');
            txt = txt.replace(rangeRe, (_, a, b) => nf.format(parseFloat(a)) + 'â€“' + nf.format(parseFloat(b)));
            txt = txt.replace(numRe, (m) => nf.format(parseFloat(m)));
            el.textContent = txt;
        });
    })();

    // Lazy-load non-hero images for performance
    (function enhanceImages() {
        document.querySelectorAll('img').forEach(img => {
            const isHero = img.closest('.hero');
            if (!isHero) {
                if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
                if (!img.hasAttribute('decoding')) img.setAttribute('decoding', 'async');
                if (!img.hasAttribute('fetchpriority')) img.setAttribute('fetchpriority', 'low');
            }
        });
    })();

    // Normalize phone display: clickable with non-breaking hyphens
    (function normalizePhones() {
        const el = document.querySelector('[data-lang="contact-phones"]');
        if (!el) return;
        const text = (el.textContent || '').replace(/\uFFFD/g, '');
        const nums = [];
        const re = /(0\d{1,2})[-\s]?(\d{3})[-\s]?(\d{4})/g;
        let m;
        while ((m = re.exec(text)) !== null) {
            nums.push(m[1] + '\u2011' + m[2] + '\u2011' + m[3]);
        }
        if (nums.length) {
            const parts = nums.map(n => `<a href="tel:${n.replace(/\u2011/g,'-')}">${n}</a>`);
            el.innerHTML = parts.join(' &nbsp;Â·&nbsp; ');
            el.setAttribute('dir', 'ltr');
        }
    })();
});
// Structured front-end helpers: nav, i18n UI, a11y, perf
document.addEventListener('DOMContentLoaded', () => {
  const qs = (s, r = document) => r.querySelector(s);
  const qsa = (s, r = document) => Array.from(r.querySelectorAll(s));

  function insertSkipLink() {
    if (qs('.skip-link')) return;
    const a = document.createElement('a');
    a.className = 'skip-link';
    a.href = '#menu';
    a.textContent = 'Skip to main content';
    document.body.prepend(a);
  }

  function enhanceNav() {
    const navbar = qs('.navbar');
    if (navbar) navbar.setAttribute('aria-label', 'Main navigation');

    // Use main-nav-panel instead of non-existent nav-menu
    const navMenu = qs('.main-nav-panel');
    if (navMenu && !navMenu.id) navMenu.id = 'primary-menu';

    // Make hamburger accessible (handlers are already attached in initMobileMenu above)
    const hamburger = qs('.hamburger');
    if (hamburger) {
      hamburger.setAttribute('role', 'button');
      hamburger.setAttribute('tabindex', '0');
      hamburger.setAttribute('aria-controls', 'primary-menu');
      if (!hamburger.getAttribute('aria-expanded')) {
        hamburger.setAttribute('aria-expanded', 'false');
      }

      // Only add keyboard handlers (click handlers are in initMobileMenu)
      hamburger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          // Trigger click to run through the same handler
          hamburger.click();
        }
        if (e.key === 'Escape') {
          const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
          if (isOpen) {
            hamburger.click(); // Close menu
          }
        }
      });
    }

    // Smooth scrolling for in-page links
    qsa('a[href^="#"]').forEach(a => {
      a.addEventListener('click', (e) => {
        const targetId = a.getAttribute('href');
        if (!targetId || targetId === '#') return;
        const target = qs(targetId);
        if (!target) return;
        e.preventDefault();

        // Close mobile menu if open
        const isMenuOpen = hamburger && hamburger.getAttribute('aria-expanded') === 'true';
        if (isMenuOpen && navMenu) {
          hamburger.classList.remove('active');
          hamburger.classList.remove('mobile-open');
          hamburger.setAttribute('aria-expanded', 'false');
          navMenu.style.display = '';
          navMenu.setAttribute('aria-hidden', 'true');
        }

        const navbarHeight = qs('.navbar')?.offsetHeight || 0;
        const top = Math.max(0, target.offsetTop - navbarHeight);
        window.scrollTo({ top, behavior: 'smooth' });

        // Update active state for nav links
        qsa('.main-nav-panel a').forEach(l => l.classList.remove('active'));
        a.classList.add('active');
      });
    });

    // Highlight active section on scroll (throttled)
    const sections = qsa('section[id]');
    const navLinks = qsa('.main-nav-panel a');
    const onScroll = () => {
      const navbarHeight = qs('.navbar')?.offsetHeight || 0;
      let current = '';
      sections.forEach(sec => {
        const top = sec.offsetTop - navbarHeight - 10;
        const h = sec.offsetHeight;
        if (window.scrollY >= top && window.scrollY < top + h) current = sec.id;
      });
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + current);
      });
    };
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => { onScroll(); ticking = false; });
        ticking = true;
      }
    }, { passive: true });
  }

  function enhanceLanguageDropdown() {
    const dropdown = qs('.language-dropdown');
    const btn = qs('.lang-dropdown-btn');
    const menu = qs('.language-dropdown-content');
    const currentLangSpan = qs('.current-lang');
    const options = qsa('.lang-option');
    if (!dropdown || !btn || !menu) return; if (dropdown.dataset.enhanced === '1') return; dropdown.dataset.enhanced = '1';

    if (!menu.id) menu.id = 'lang-menu';
    btn.setAttribute('aria-haspopup', 'listbox');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', menu.id);
    btn.setAttribute('aria-label', 'Language');

    const langMap = { en: 'EN', he: 'HE', ar: 'AR', ru: 'RU' };
    const setExpanded = (exp) => btn.setAttribute('aria-expanded', exp ? 'true' : 'false');

    btn.addEventListener('click', (e) => { e.stopPropagation(); const root = btn.closest('.language-dropdown') || dropdown; root.classList.toggle('active'); setExpanded(root.classList.contains('active')); });
    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target)) { dropdown.classList.remove('active'); setExpanded(false); }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { dropdown.classList.remove('active'); setExpanded(false); }
    });

    options.forEach(option => {
      option.addEventListener('click', (e) => {
        e.stopPropagation();
        const lang = option.getAttribute('data-lang-switch');

        // Update active state
        options.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');

        // Update display with flag emoji
        const displayMap = {
          en: '🇬🇧 EN',
          he: '🇮🇱 HE',
          ar: '🇸🇦 AR',
          ru: '🇷🇺 RU',
          el: '🇬🇷 GR'
        };
        if (currentLangSpan) currentLangSpan.textContent = displayMap[lang] || '🇮🇱 HE';

        dropdown.classList.remove('active');
        setExpanded(false);
        if (typeof switchLanguage === 'function') switchLanguage(lang);
      });
    });
  }

  function initCTA() {
    const btn = qs('.cta-btn');
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const menuSection = qs('#menu');
        if (menuSection) {
          const navbarHeight = qs('.navbar')?.offsetHeight || 0;
          const top = Math.max(0, menuSection.offsetTop - navbarHeight);
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    }
  }

  function normalizeCurrency() {
    const locale = document.documentElement.lang || 'he-IL';
    const nf = new Intl.NumberFormat(locale, { style: 'currency', currency: 'ILS', maximumFractionDigits: 0 });
    const cleanNum = (s) => {
      const m = String(s || '').replace(/[^0-9.\-]/g, '');
      const n = parseFloat(m);
      return isNaN(n) ? null : n;
    };
    const formatText = (t) => {
      const str = String(t || '').trim();
      if (!str) return str;
      if (str.includes('-')) {
        const parts = str.split('-').map(cleanNum).filter(v => v !== null);
        if (parts.length === 2) return nf.format(parts[0]) + 'â€“' + nf.format(parts[1]);
      }
      const n = cleanNum(str);
      return n !== null ? nf.format(n) : str;
    };
    qsa('.item-price, .category-price').forEach(el => { el.textContent = formatText(el.textContent); });

    // Inline ranges/numbers (events-contact, or data-format-prices anywhere)
    const rangeRe = /(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)/g;
    const numRe = /(\d+(?:\.\d+)?)/g;
    qsa('[data-format-prices], [data-lang="events-contact"]').forEach(el => {
      let txt = (el.textContent || '').replace(/\uFFFD/g, '');
      txt = txt.replace(rangeRe, (_, a, b) => nf.format(parseFloat(a)) + 'â€“' + nf.format(parseFloat(b)));
      txt = txt.replace(numRe, (m) => nf.format(parseFloat(m)));
      el.textContent = txt;
    });
  }

  function enhanceImages() {
    qsa('img').forEach(img => {
      const isHero = img.closest('.hero');
      if (!isHero) {
        if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
        if (!img.hasAttribute('decoding')) img.setAttribute('decoding', 'async');
        if (!img.hasAttribute('fetchpriority')) img.setAttribute('fetchpriority', 'low');
      }
    });
  }

  function normalizePhones() {
    const el = qs('[data-lang="contact-phones"]');
    if (!el) return;
    const text = (el.textContent || '').replace(/\uFFFD/g, '');
    const nums = [];
    const re = /(0\d{1,2})[-\s]?(\d{3})[-\s]?(\d{4})/g;
    let m;
    while ((m = re.exec(text)) !== null) {
      nums.push(m[1] + '\u2011' + m[2] + '\u2011' + m[3]);
    }
    if (nums.length) {
      const html = nums.map(n => `<a href="tel:${n.replace(/\u2011/g,'-')}">${n}</a>`).join(' &nbsp;Â·&nbsp; ');
      el.innerHTML = html;
      el.setAttribute('dir', 'ltr');
    }
  }

  // Initialize
  try { insertSkipLink(); } catch(e){}
  try { enhanceNav(); } catch(e){}
  try { enhanceLanguageDropdown(); } catch(e){}
  try { bindLanguageDropdownDelegated(); } catch(e){}
  try { initCTA(); } catch(e){}
  try { normalizeCurrency(); } catch(e){}
  try { enhanceImages(); } catch(e){}
  try { normalizePhones(); } catch(e){}
  // try { menuScrollArrow(); } catch(e){} // Disabled - scroll to top button removed
  // themeToggle handled by toggles.js
  
  function menuScrollArrow(){
    const btn = document.createElement('button');
    btn.className = 'menu-scroll-next';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Scroll to top');
    btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M7 14l5-5 5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    document.body.appendChild(btn);

    const navbar = qs('.navbar');
    const navH = () => (navbar?.offsetHeight || 0);

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    const updateVisibility = () => {
      const y = window.scrollY;
      const threshold = 100; // show after slight scroll
      btn.hidden = !(y > threshold);
    };

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => { updateVisibility(); ticking = false; });
        ticking = true;
      }
    }, { passive: true });
    updateVisibility();
  }

  // Robust delegated handler to ensure language dropdown toggles
  function bindLanguageDropdownDelegated(){
    document.addEventListener('click', function(e){
      const btn = e.target.closest && e.target.closest('.lang-dropdown-btn');
      const dropdown = btn && btn.closest('.language-dropdown');
      if (btn && dropdown) {
        e.stopPropagation();
        dropdown.classList.toggle('active');
        return;
      }
      // click outside closes any open dropdowns
      const anyOpen = document.querySelectorAll('.language-dropdown.active');
      anyOpen.forEach(el => el.classList.remove('active'));
    });
    document.addEventListener('keydown', function(e){
      if (e.key === 'Escape') {
        document.querySelectorAll('.language-dropdown.active').forEach(el => el.classList.remove('active'));
      }
    });
  }

  // Theme toggle is handled by toggles.js

  // Fade in & slide up animation for about section
  function initFadeSlideAnimation() {
    const fadeElements = document.querySelectorAll('.fade-slide-up');
    if (!fadeElements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    fadeElements.forEach(el => observer.observe(el));
  }

  try { initFadeSlideAnimation(); } catch(e) { console.error('Fade animation error:', e); }

  // Gallery flip animation on scroll
  function initGalleryFlipAnimation() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (!galleryItems.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Staggered delay based on position in viewport
          const delay = Array.from(galleryItems).indexOf(entry.target) % 6 * 100;
          setTimeout(() => {
            entry.target.classList.add('flip-in');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    galleryItems.forEach(el => observer.observe(el));
  }

  try { initGalleryFlipAnimation(); } catch(e) { console.error('Gallery flip animation error:', e); }

  // FAQ Accordion
  function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach((item, index) => {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');

      if (question && answer) {
        // Add keyboard navigation support
        question.addEventListener('click', () => {
          toggleFaqItem(item, question, answer);
        });

        // Keyboard navigation for FAQ questions
        question.addEventListener('keydown', (e) => {
          let targetQuestion = null;

          switch(e.key) {
            case 'ArrowDown':
              e.preventDefault();
              // Move to next question, wrap around if at end
              const nextItem = faqItems[index + 1] || faqItems[0];
              targetQuestion = nextItem.querySelector('.faq-question');
              break;
            case 'ArrowUp':
              e.preventDefault();
              // Move to previous question, wrap around if at start
              const prevItem = faqItems[index - 1] || faqItems[faqItems.length - 1];
              targetQuestion = prevItem.querySelector('.faq-question');
              break;
            case 'Home':
              e.preventDefault();
              targetQuestion = faqItems[0].querySelector('.faq-question');
              break;
            case 'End':
              e.preventDefault();
              targetQuestion = faqItems[faqItems.length - 1].querySelector('.faq-question');
              break;
            case 'Enter':
            case ' ':
              e.preventDefault();
              toggleFaqItem(item, question, answer);
              return;
          }

          if (targetQuestion) {
            targetQuestion.focus();
          }
        });
      }
    });

    function toggleFaqItem(item, question, answer) {
      const isActive = item.classList.contains('active');

      // Close all other items
      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('active');
          const otherQuestion = other.querySelector('.faq-question');
          const otherAnswer = other.querySelector('.faq-answer');

          if (otherQuestion && otherAnswer) {
            otherQuestion.setAttribute('aria-expanded', 'false');
            otherAnswer.setAttribute('hidden', '');
          }
        }
      });

      // Toggle current item
      if (isActive) {
        item.classList.remove('active');
        question.setAttribute('aria-expanded', 'false');
        answer.setAttribute('hidden', '');
      } else {
        item.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
        answer.removeAttribute('hidden');

        // Move focus to the answer content for screen readers after a short delay
        setTimeout(() => {
          answer.focus();
        }, 100);
      }
    }
  }

  try { initFaqAccordion(); } catch(e) { console.error('FAQ accordion error:', e); }

  // Mobile Menu Swipe Hints - Only show for categories with more than 1 item
  function initMenuSwipeHints() {
    // Only on mobile
    if (window.innerWidth > 768) return;

    const isRTL = document.documentElement.dir === 'rtl' || document.documentElement.lang === 'he';

    // Handle subcategories (Pizza, Salads, Sides, Drinks, Alcohol)
    const subcategories = document.querySelectorAll('.menu-subcategory');
    subcategories.forEach(subcategory => {
      const cards = subcategory.querySelectorAll('.menu-card');
      const title = subcategory.querySelector('.subcategory-title');

      if (cards.length > 1) {
        subcategory.classList.add('has-more-items');
        if (title && !title.querySelector('.swipe-hint')) {
          const hint = document.createElement('span');
          hint.className = 'swipe-hint';
          hint.textContent = isRTL ? '👆 החלק' : 'Swipe 👆';
          title.appendChild(hint);
        }
      }
    });

    // Handle main tab contents (Pita, Plates, Platters) - these don't have subcategory wrapper
    const tabContents = document.querySelectorAll('.menu-tab-content');
    tabContents.forEach(tabContent => {
      // Skip if this tab has subcategories (they're handled above)
      if (tabContent.querySelector('.menu-subcategory')) return;

      const cardGrid = tabContent.querySelector('.menu-card-grid');
      if (!cardGrid) return;

      const cards = cardGrid.querySelectorAll('.menu-card');
      if (cards.length > 1) {
        // Add class to tab content for fade gradient
        tabContent.classList.add('has-more-items');

        // Find the corresponding tab button text for the hint
        const tabId = tabContent.id;
        const tabButton = document.querySelector(`.menu-tab[data-tab="${tabId.replace('tab-', '')}"]`);

        // Add hint after the tab button text (inside tab content, before grid)
        if (!tabContent.querySelector('.swipe-hint-banner')) {
          const hintBanner = document.createElement('div');
          hintBanner.className = 'swipe-hint-banner';
          hintBanner.innerHTML = isRTL ? '<span class="swipe-hint">👆 החלק לצפות בעוד</span>' : '<span class="swipe-hint">Swipe for more 👆</span>';
          tabContent.insertBefore(hintBanner, cardGrid);
        }
      }
    });
  }

  try { initMenuSwipeHints(); } catch(e) { console.error('Menu swipe hints error:', e); }

  // Re-run on resize (desktop/mobile switch)
  let resizeTimeout;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
      // Remove existing hints first
      document.querySelectorAll('.menu-subcategory').forEach(el => el.classList.remove('has-more-items'));
      document.querySelectorAll('.menu-tab-content').forEach(el => el.classList.remove('has-more-items'));
      document.querySelectorAll('.swipe-hint').forEach(el => el.remove());
      document.querySelectorAll('.swipe-hint-banner').forEach(el => el.remove());
      // Re-initialize
      try { initMenuSwipeHints(); } catch(e) {}
    }, 250);
  });
});

// ===== PREMIUM SNOW EFFECT =====
// Added to script.js to ensure it loads properly

(function() {
    'use strict';

    // Snow configuration
    const CONFIG = {
        desktopDensity: 150,
        mobileDensity: 60,
        speedMultiplier: 0.8,
        opacity: 0.8,
        minSize: 2,
        maxSize: 6,
        disableOnMobile: false,
        mobileBreakpoint: 768
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
            this.y = Math.random() * window.innerHeight;
        }

        reset() {
            this.x = Math.random() * window.innerWidth;
            this.y = -10;
            this.size = Math.random() * (CONFIG.maxSize - CONFIG.minSize) + CONFIG.minSize;
            this.speed = Math.random() * 2 + 1;
            this.wind = Math.random() * 0.5 - 0.25;
            this.opacity = Math.random() * 0.5 + CONFIG.opacity * 0.5;
        }

        update() {
            this.y += this.speed * CONFIG.speedMultiplier;
            this.x += this.wind;
            this.x += Math.sin(this.y * 0.01) * 0.3;

            if (this.y > window.innerHeight + 10) {
                this.reset();
            }
            if (this.x > window.innerWidth + 10 || this.x < -10) {
                this.x = Math.random() * window.innerWidth;
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
            opacity: 1.0;
        `;

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
        createSnowflakes();
    }

    // Initialize snow effect
    function init() {
        if (isReducedMotion) {
            console.log('Snow effect disabled: prefers-reduced-motion');
            return;
        }

        if (isMobile && CONFIG.disableOnMobile) {
            console.log('Snow effect disabled: on mobile');
            return;
        }

        try {
            initCanvas();
            createSnowflakes();
            animate();
            document.body.appendChild(canvas);
            window.addEventListener('resize', handleResize);

            if (window.matchMedia) {
                const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
                motionQuery.addListener((e) => {
                    if (e.matches) {
                        if (animationId) {
                            cancelAnimationFrame(animationId);
                        }
                        if (canvas && canvas.parentNode) {
                            canvas.parentNode.removeChild(canvas);
                        }
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

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', ready);
    } else {
        ready();
    }

})();







