// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        // Click event
        hamburger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Touch event for mobile
        hamburger.addEventListener('touchstart', function(e) {
            e.preventDefault();
            e.stopPropagation();
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        }, { passive: false });

        // Close menu when clicking a nav link
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

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

    const navMenu = qs('.nav-menu');
    if (navMenu && !navMenu.id) navMenu.id = 'primary-menu';

    // Make hamburger accessible
    const hamburger = qs('.hamburger');
    if (hamburger) {
      hamburger.setAttribute('role', 'button');
      hamburger.setAttribute('tabindex', '0');
      hamburger.setAttribute('aria-controls', 'primary-menu');
      hamburger.setAttribute('aria-expanded', 'false');

      const toggle = () => {
        if (!navMenu) return;
        const active = navMenu.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', active ? 'true' : 'false');
      };
      hamburger.addEventListener('click', toggle);
      hamburger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
        if (e.key === 'Escape') { navMenu?.classList.remove('active'); hamburger.setAttribute('aria-expanded', 'false'); }
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
        if (navMenu && navMenu.classList.contains('active')) {
          navMenu.classList.remove('active');
          hamburger?.setAttribute('aria-expanded', 'false');
        }

        const navbarHeight = qs('.navbar')?.offsetHeight || 0;
        const top = Math.max(0, target.offsetTop - navbarHeight);
        window.scrollTo({ top, behavior: 'smooth' });

        qsa('.nav-menu a').forEach(l => l.classList.remove('active'));
        a.classList.add('active');
      });
    });

    // Highlight active section on scroll (throttled)
    const sections = qsa('section[id]');
    const navLinks = qsa('.nav-menu a');
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
});







