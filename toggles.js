// Simple, working theme and language toggles
(function() {
    'use strict';

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        initThemeToggle();
        initLanguageToggle();
    }

    // THEME TOGGLE
    function initThemeToggle() {
        const themeBtn = document.getElementById('theme-toggle');
        if (!themeBtn) {
            console.error('Theme toggle button not found');
            return;
        }

        const sunIcon = themeBtn.querySelector('.sun-icon');
        const moonIcon = themeBtn.querySelector('.moon-icon');

        // Load saved theme or default to light
        const savedTheme = localStorage.getItem('a11y-darkMode') || 'off';
        applyTheme(savedTheme === 'on' ? 'dark' : 'light');

        function applyTheme(theme) {
            if (theme === 'dark') {
                document.body.classList.add('a11y-dark-mode');
                if (sunIcon) sunIcon.style.display = 'none';
                if (moonIcon) moonIcon.style.display = 'block';
                localStorage.setItem('a11y-darkMode', 'on');
            } else {
                document.body.classList.remove('a11y-dark-mode');
                if (sunIcon) sunIcon.style.display = 'block';
                if (moonIcon) moonIcon.style.display = 'none';
                localStorage.setItem('a11y-darkMode', 'off');
            }
        }

        themeBtn.addEventListener('click', function() {
            const isDark = document.body.classList.contains('a11y-dark-mode');
            applyTheme(isDark ? 'light' : 'dark');
        });

        console.log('Theme toggle initialized');
    }

    // LANGUAGE TOGGLE
    function initLanguageToggle() {
        const dropdown = document.querySelector('.language-dropdown');
        const btn = document.querySelector('.lang-dropdown-btn');
        const currentLangSpan = document.querySelector('.current-lang');
        const langOptions = document.querySelectorAll('.lang-option');

        if (!dropdown || !btn || langOptions.length === 0) {
            console.error('Language toggle elements not found');
            return;
        }

        // Toggle dropdown on button click
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const isActive = dropdown.classList.toggle('active');
            btn.setAttribute('aria-expanded', isActive);
            console.log('Dropdown toggled:', isActive);
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('active');
                btn.setAttribute('aria-expanded', 'false');
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && dropdown.classList.contains('active')) {
                dropdown.classList.remove('active');
                btn.setAttribute('aria-expanded', 'false');
            }
        });

        // Handle language selection
        langOptions.forEach(function(option) {
            option.addEventListener('click', function(e) {
                e.stopPropagation();
                const lang = this.getAttribute('data-lang-switch');

                console.log('Language selected:', lang);

                // Update active state
                langOptions.forEach(function(opt) {
                    opt.classList.remove('active');
                });
                this.classList.add('active');

                // Update display
                const flagMap = {
                    'en': '🇬🇧 EN',
                    'he': '🇮🇱 HE',
                    'ar': '🇸🇦 AR',
                    'ru': '🇷🇺 RU'
                };
                if (currentLangSpan) {
                    currentLangSpan.textContent = flagMap[lang] || '🇮🇱 HE';
                }

                // Close dropdown
                dropdown.classList.remove('active');
                btn.setAttribute('aria-expanded', 'false');

                // Trigger language change if switchLanguage function exists
                if (typeof window.switchLanguage === 'function') {
                    window.switchLanguage(lang);
                } else {
                    console.warn('switchLanguage function not found');
                }
            });
        });

        console.log('Language toggle initialized');
    }
})();
