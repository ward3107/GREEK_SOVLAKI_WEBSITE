// Language switching functionality for static pages
(function() {
    'use strict';

    // Language flags
    const langFlags = {
        'he': '🇮🇱',
        'ar': '🇸🇦',
        'en': '🇬🇧',
        'ru': '🇷🇺'
    };

    // Language switching functions
    window.toggleLangDropdown = function() {
        const switcher = document.getElementById('langSwitcher');
        if (switcher) {
            switcher.classList.toggle('open');
        }
    };

    window.switchPageLang = function(lang) {
        // Store preference
        localStorage.setItem('preferredLanguage', lang);

        // Update language flag
        const langToggle = document.getElementById('langToggle');
        if (langToggle) {
            langToggle.textContent = langFlags[lang] || '🇮🇱';
        }

        // Update active button
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.lang === lang) {
                btn.classList.add('active');
            }
        });

        // Close dropdown
        const switcher = document.getElementById('langSwitcher');
        if (switcher) {
            switcher.classList.remove('open');
        }

        // Update "Back to site" text if it exists
        const backTexts = {
            'he': 'חזרה לאתר',
            'ar': 'العودة إلى الموقع',
            'en': 'Back to site',
            'ru': 'Вернуться на сайт'
        };
        const backTextElement = document.querySelector('.back-text');
        if (backTextElement) {
            backTextElement.textContent = backTexts[lang] || backTexts['he'];
        }
    };

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        const switcher = document.getElementById('langSwitcher');
        if (switcher && !switcher.contains(e.target)) {
            switcher.classList.remove('open');
        }
    });

    // Initialize language based on stored preference
    const savedLang = localStorage.getItem('preferredLanguage') || 'he';

    // Set initial language flag
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
        langToggle.textContent = langFlags[savedLang] || '🇮🇱';
    }

    // Set active button
    const activeBtn = document.querySelector(`.lang-btn[data-lang="${savedLang}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
})();