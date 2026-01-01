/**
 * Page-specific scripts extracted from inline HTML
 * This allows removing 'unsafe-inline' from Content Security Policy
 */

// Language switching functionality for legal pages
function switchPageLang(lang) {
    document.documentElement.lang = lang;
    document.documentElement.dir = (lang === 'ar' || lang === 'he') ? 'rtl' : 'ltr';

    // Update content based on language
    const translations = {
        he: {
            accessibilityTitle: 'הצהרת נגישות',
            privacyTitle: 'מדיניות פרטיות',
            termsTitle: 'תנאי שימוש',
            flag: '🇮🇱'
        },
        ar: {
            accessibilityTitle: 'بيان الوصول',
            privacyTitle: 'سياسة الخصوصية',
            termsTitle: 'شروط الاستخدام',
            flag: '🇸🇦'
        },
        en: {
            accessibilityTitle: 'Accessibility Statement',
            privacyTitle: 'Privacy Policy',
            termsTitle: 'Terms of Use',
            flag: '🇬🇧'
        },
        ru: {
            accessibilityTitle: 'Заявление о доступности',
            privacyTitle: 'Политика конфиденциальности',
            termsTitle: 'Условия использования',
            flag: '🇷🇺'
        }
    };

    // Update page title
    if (translations[lang]) {
        document.title = translations[lang][document.body.dataset.pageType + 'Title'] || document.title;
    }

    // Update language toggle button
    const langToggle = document.getElementById('langToggle');
    if (langToggle && translations[lang]) {
        langToggle.textContent = translations[lang].flag;
    }

    // Update active button states
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    // Save preference
    localStorage.setItem('preferredLanguage', lang);
}

// Language dropdown toggle
function toggleLangDropdown() {
    const dropdown = document.querySelector('.language-dropdown-content');
    if (dropdown) {
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    }
}

// Initialize language on page load
function initializePageLanguage() {
    const savedLang = localStorage.getItem('preferredLanguage') || 'he';
    switchPageLang(savedLang);

    const langFlags = { 'he': '🇮🇱', 'ar': '🇸🇦', 'en': '🇬🇧', 'ru': '🇷🇺' };
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
        langToggle.textContent = langFlags[savedLang] || '🇮🇱';
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const dropdown = document.querySelector('.language-dropdown-content');
    const langToggle = document.getElementById('langToggle');

    if (dropdown && langToggle && !langToggle.contains(event.target) && !dropdown.contains(event.target)) {
        dropdown.style.display = 'none';
    }
});

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePageLanguage);
} else {
    initializePageLanguage();
}