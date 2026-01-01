// 404 page language detection and display
(function() {
    'use strict';

    // Detect language preference
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang === 'en') {
        document.documentElement.lang = 'en';
        document.documentElement.dir = 'ltr';
        document.querySelector('.error-title').textContent = 'Oops! Page Not Found';

        const errorMsg = document.querySelector('.error-message');
        if (errorMsg) {
            errorMsg.innerHTML = 'The page you\'re looking for doesn\'t exist. Please check the URL or <a href="/">return to the homepage</a>.';
        }

        const homeBtn = document.querySelector('.home-btn');
        if (homeBtn) {
            homeBtn.textContent = 'Go Home';
        }
    }
})();