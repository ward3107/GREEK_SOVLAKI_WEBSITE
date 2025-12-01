// Modern translation system for Greek Souvlaki website
let currentLang = 'he'; // Default language
let translations = {
    // Embedded Hebrew translations for file:// protocol compatibility
    'he': {
        "logo": "סובלאקי יווני",
        "nav-home": "בית",
        "nav-menu": "תפריט",
        "nav-about": "אודות",
        "nav-gallery": "גלריה",
        "nav-contact": "צור קשר",
        "hero-title": "סובלאקי יווני כפר יאסיף",
        "hero-subtitle": "טעמים יווניים אותנטיים בלב כפר יאסיף",
        "hero-description": "חווית קולינרית יוונית אמיתית עם מתכונים מסורתיים, חומרי גלם טריים ואווירה ים תיכונית חמה",
        "view-menu": "צפה בתפריט",
        "call-reservations": "התקשר להזמנות",
        "menu-title": "התפריט שלנו",
        "menu-subtitle": "מבחר עשיר של מנות יווניות מסורתיות",
        "cat-pita-title": "סובלאקי בפיתה",
        "cat-plates-title": "צלחות סובלאקי",
        "cat-platters-title": "מגשי בשרים",
        "cat-pizza-title": "פיצה גירוס",
        "cat-salad-title": "סלטים",
        "cat-drinks-title": "משקאות",
        "cat-alcohol-title": "אלכוהול",
        "cat-sides-title": "תוספות",
        "item-pita-chicken": "סובלאקי עוף",
        "desc-pita-chicken": "פיתה יוונית, שיפוד עוף, רוטב צזיקי/חריף, כרוב, בצל, עגבניה, חסה, צ'יפס",
        "item-pita-pork": "סובלאקי חזיר",
        "desc-pita-pork": "פיתה יוונית, שיפוד לבן, רוטב צזיקי/חריף, כרוב, בצל, עגבניה, חסה, צ'יפס",
        "item-pita-gyros": "סובלאקי גירוס חזיר",
        "desc-pita-gyros": "פיתה יוונית, גירוס לבן (שווארמה), רוטב צזיקי/חריף, כרוב, בצל, עגבניה, חסה, צ'יפס",
        "item-pita-kebab": "סובלאקי קבב",
        "desc-pita-kebab": "פיתה יוונית, קבב רגל טלה, רוטב צזיקי/חריף, כרוב, בצל, עגבניה, חסה, צ'יפס",
        "item-pita-sausage": "סובלאקי נקניקיה",
        "desc-pita-sausage": "פיתה יוונית, נקניקיות, רוטב צזיקי/חריף, כרוב, בצל, עגבניה, חסה, צ'יפס",
        "item-pita-vegan": "סובלאקי טבעוני",
        "desc-pita-vegan": "פיתה יוונית, שיפוד טבעוני, רוטב צזיקי/חריף, כרוב, בצל, עגבניה, חסה, צ'יפס",
        "item-pita-steak": "סובלאקי סטייק חזיר",
        "desc-pita-steak": "פיתה יוונית, סטייק לבן סינטה, רוטב צזיקי/חריף, כרוב, בצל, עגבניה, חסה, צ'יפס",
        "item-pita-glutenfree": "סובלאקי ללא גלוטן",
        "desc-pita-glutenfree": "פיתה ללא גלוטן, שיפוד לבחירה, רוטב צזיקי/חריף, כרוב, בצל, עגבניה, חסה, צ'יפס",
        "item-double-skewer": "שיפוד כפול",
        "desc-double-skewer": "תוספת שיפוד נוסף",
        "item-plate-souvlaki": "צלחת סובלאקי",
        "desc-plate-souvlaki": "שיפודים לבחירה, רוטב צזיקי/חריף, כרוב, בצל, עגבניה, חסה, צ'יפס",
        "item-plate-gyros": "צלחת סובלאקי גירוס",
        "desc-plate-gyros": "שווארמה לבן, רוטב צזיקי/חריף, כרוב, בצל, עגבניה, חסה, צ'יפס",
        "item-platter-two": "מגש בשרים לשניים",
        "desc-platter-two": "3 שיפודים (לבן/עוף/קבב), נקניקה, רוטב מיוחד, 2 סטייק לבן סינטה",
        "item-platter-four": "מגש בשרים לארבעה",
        "desc-platter-four": "6 שיפודים, שווארמה לבן, נקניקה, רוטב מיוחד, 3 סטייק לבן סינטה",
        "item-pizza-small": "פיצה גירוס (קטנה)",
        "desc-pizza-small": "פיצה עם שווארמה לבן וצ'יפס",
        "item-pizza-large": "פיצה גירוס (גדולה)",
        "desc-pizza-large": "פיצה עם שווארמה לבן וצ'יפס",
        "item-greek-salad": "סלט יווני",
        "desc-greek-salad": "עגבניות, מלפפון, פלפל מחוק, בצל, זיתים שחורים קלמטה, גבינת פטה",
        "item-soft-drinks": "משקאות קלים",
        "desc-soft-drinks": "קוקה קולה, קולה זירו, פנטה, ספרייט, ענבים",
        "item-water": "מים",
        "desc-water": "מים",
        "item-beer": "בירה דראפט (1/3)",
        "desc-beer": "בירה הבית",
        "item-wine-glass": "יין (כוס)",
        "desc-wine-glass": "יין אדום/לבן/רוזה",
        "item-wine-bottle": "בקבוק יין",
        "desc-wine-bottle": "בקבוק יין",
        "item-whiskey": "וויסקי",
        "desc-whiskey": "וויסקי",
        "item-ouzo": "אוזו פלומרי",
        "desc-ouzo": "בקבוק אוזו פלומרי 200 מ\"ל",
        "item-fries": "צ'יפס",
        "desc-fries": "צלחת צ'יפס",
        "contact-call": "התקשרו אלינו",
        "contact-social": "עקבו אחרינו",
        "contact-phones": "טלפון: 04-8122980, 052-8921454, 054-2001235",
        "contact-instagram": "אינסטגרם: @GREEK.SOUVLAKII",
        "contact-name": "מסעדת GREEK SOUVLAKI",
        "contact-slogan": "אהבתם? תייגו אותנו!",
        "about-title": "אודותינו",
        "about-text": "חווית קולינרית יוונית אמיתית בלב כפר יאסיף. אנו מביאים את הטעמים האותנטיים של יוון עם מתכונים מסורתיים שעוברים במשפחה מדור לדור. המסעדה שלנו מציעה אווירה חמה ומזמינה, שירות מעולה וחומרי גלם טריים ואיכותיים.",
        "quality-title": "בשרים איכותיים",
        "quality-desc": "בשרים טריים ואיכותיים מספקים מובחרים",
        "fresh-title": "חומרי גלם טריים",
        "fresh-desc": "ירקות ותבלינים טריים מדי יום",
        "chef-title": "מתכונים מסורתיים",
        "chef-desc": "שיטות בישול יווניות אותנטיות",
        "atmosphere-title": "אווירה יוונית",
        "atmosphere-desc": "עיצוב ים תיכוני ומוזיקה יוונית",
        "gallery-title": "גלריה",
        "gallery-subtitle": "טעימה מהאווירה והמנות שלנו",
        "contact-title": "צור קשר",
        "reservation-title": "הזמנות ופרטים",
        "reservation-text": "להזמנת מקום, אירועים מיוחדים או פרטים נוספים",
        "call-now": "התקשר עכשיו",
        "whatsapp": "WhatsApp",
        "location-title": "מיקום",
        "location-text": "כביש 70, כפר יאסיף",
        "get-directions": "קבל הוראות הגעה",
        "hours-title": "שעות פתיחה",
        "hours-text": "ראשון-רביעי: סגור<br>חמישי-שבת: 13:00-01:00",
        "hours-note": "מומלץ להזמין מקום מראש",
        "events-title": "אירועים",
        "events-text": "אנו מארחים אירועים פרטיים וקבוצתיים",
        "events-contact": "ליועץ אירועים: 052-8921454",
        "social-title": "עקבו אחרינו",
        "phone-text": "052-8921454 / 04-8122980",
        "footer": "© 2024 סובלאקי יווני - מסעדה יוונית אותנטית בכפר יאסיף",
        "meta-description": "מסעדה יוונית אותנטית בכפר יאסיף. סובלאקי, גירוס ומטעמים יווניים מסורתיים עם חומרי גלם טריים ואווירה חמה. פתוח חמישי-שבת 13:00-01:00.",
        "meta-title": "סובלאקי יווני - כפר יאסיף | מסעדה יוונית אותנטית"
    }
};

// Load translation file (with fallback to embedded translations)
async function loadTranslations(lang) {
    // Return embedded translation if available
    if (translations[lang]) {
        return translations[lang];
    }

    // Try to fetch from JSON file (works on HTTP servers)
    try {
        const response = await fetch(`${lang}.json`);
        if (!response.ok) throw new Error(`Failed to load ${lang}.json`);
        return await response.json();
    } catch (error) {
        console.warn('Using embedded translations (file:// protocol or fetch failed)');
        return translations['he'] || null; // Fallback to Hebrew
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
        let value = getNestedValue(langData, key);

        // Fallback to Hebrew if translation missing
        if (!value && translations['he']) {
            value = getNestedValue(translations['he'], key);
            if (value) {
                console.warn(`Missing translation for key "${key}" in current language, using Hebrew fallback`);
            }
        }

        // Fallback to English if still missing
        if (!value && translations['en']) {
            value = getNestedValue(translations['en'], key);
            if (value) {
                console.warn(`Missing translation for key "${key}", using English fallback`);
            }
        }

        if (value) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = value;
            } else {
                element.textContent = value;
            }
        } else {
            // Log missing translation but keep existing content
            console.warn(`No translation found for key: "${key}"`);
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
