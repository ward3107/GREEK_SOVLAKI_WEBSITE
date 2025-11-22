// Modern translation system for Greek Souvlaki website
let currentLang = 'he'; // Default language
let translations = {};

// Load translation file
async function loadTranslations(lang) {
    try {
        const response = await fetch(`${lang}.json`);
        if (!response.ok) throw new Error(`Failed to load ${lang}.json`);
        return await response.json();
    } catch (error) {
        console.error('Error loading translations:', error);
        return null;
    }
}

// Get nested value from object using dot notation or flat key
function getNestedValue(obj, path) {
    // Try direct key first (for backward compatibility)
    if (obj[path] !== undefined) {
        return obj[path];
    }
    // Try nested path
    return path.split('.').reduce((current, key) => current?.[key], obj);
}

// Apply translations to the page
function applyTranslations(langData) {
    // Update all elements with data-lang attribute
    document.querySelectorAll('[data-lang]').forEach(element => {
        const key = element.getAttribute('data-lang');
        const value = getNestedValue(langData, key);

        if (value) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = value;
            } else {
                element.textContent = value;
            }
        }
    });

    // Update meta tags for SEO
    if (langData['meta-title']) {
        document.title = langData['meta-title'];
    }
    if (langData['meta-description']) {
        let metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute('content', langData['meta-description']);
        }
    }
}

// Update text direction based on language
function updateDirection(lang) {
    const rtlLanguages = ['he', 'ar'];
    const direction = rtlLanguages.includes(lang) ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', direction);
    document.body.setAttribute('dir', direction);
}

// Switch language
async function switchLanguage(lang) {
    if (translations[lang]) {
        currentLang = lang;
        applyTranslations(translations[lang]);
        updateDirection(lang);
        localStorage.setItem('preferredLanguage', lang);
        return;
    }

    // Load translations if not cached
    const langData = await loadTranslations(lang);
    if (langData) {
        translations[lang] = langData;
        currentLang = lang;
        applyTranslations(langData);
        updateDirection(lang);
        localStorage.setItem('preferredLanguage', lang);
    }
}

// Initialize translations on page load
async function initTranslations() {
    // Check for saved language preference
    const savedLang = localStorage.getItem('preferredLanguage') || 'he';

    // Load initial language
    const langData = await loadTranslations(savedLang);
    if (langData) {
        translations[savedLang] = langData;
        currentLang = savedLang;
        applyTranslations(langData);
        updateDirection(savedLang);
    }

    // Show content after translations are loaded
    document.getElementById('i18n-hide')?.remove();
    document.body.style.visibility = 'visible';
}

// Run on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTranslations);
} else {
    initTranslations();
}
