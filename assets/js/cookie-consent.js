// Cookie Consent Banner for Greek Souvlaki Website
(function() {
  'use strict';

  const STORAGE_KEY = 'greek-souvlaki-cookie-consent';
  const PREFERENCES_KEY = 'greek-souvlaki-cookie-preferences';

  const DEFAULT_PREFERENCES = {
    necessary: true,      // Always true, cannot be disabled
    functional: true,     // Preferences, language, UI settings
    analytics: false,     // Usage tracking
    marketing: false,     // Personalization
  };

  const translations = {
    he: {
      title: 'אנו משתמשים בעוגיות',
      description: 'אתר זה משתמש בעוגיות כדי לשפר את חוויית הגלישה שלך ולספק תוכן מותאם אישית.',
      acceptAll: 'אשר הכל',
      declineAll: 'דחה הכל',
      customize: 'התאמה אישית',
      savePreferences: 'שמור העדפות',
      privacyLink: 'מדיניות פרטיות',
      necessary: 'עוגיות הכרחיות',
      necessaryDesc: 'נדרשות לתפקוד בסיסי של האתר',
      functional: 'עוגיות פונקציונליות',
      functionalDesc: 'זוכרות את ההעדפות שלך',
      analytics: 'עוגיות אנליטיקה',
      analyticsDesc: 'עוזרות לנו להבין כיצד משתמשים באתר',
      marketing: 'עוגיות שיווקיות',
      marketingDesc: 'תוכן מותאם אישית והמלצות',
      alwaysOn: 'תמיד פעיל',
    },
    en: {
      title: 'We use cookies',
      description: 'This website uses cookies to enhance your browsing experience and provide personalized content.',
      acceptAll: 'Accept All',
      declineAll: 'Decline All',
      customize: 'Customize',
      savePreferences: 'Save Preferences',
      privacyLink: 'Privacy Policy',
      necessary: 'Necessary Cookies',
      necessaryDesc: 'Required for basic site functionality',
      functional: 'Functional Cookies',
      functionalDesc: 'Remember your preferences',
      analytics: 'Analytics Cookies',
      analyticsDesc: 'Help us understand how the site is used',
      marketing: 'Marketing Cookies',
      marketingDesc: 'Personalized content and recommendations',
      alwaysOn: 'Always On',
    },
    ar: {
      title: 'نحن نستخدم ملفات تعريف الارتباط',
      description: 'يستخدم هذا الموقع ملفات تعريف الارتباط لتحسين تجربة التصفح وتقديم محتوى مخصص.',
      acceptAll: 'قبول الكل',
      declineAll: 'رفض الكل',
      customize: 'تخصيص',
      savePreferences: 'حفظ التفضيلات',
      privacyLink: 'سياسة الخصوصية',
      necessary: 'ملفات تعريف الارتباط الضرورية',
      necessaryDesc: 'مطلوبة لوظائف الموقع الأساسية',
      functional: 'ملفات تعريف الارتباط الوظيفية',
      functionalDesc: 'تذكر تفضيلاتك',
      analytics: 'ملفات تعريف الارتباط التحليلية',
      analyticsDesc: 'تساعدنا على فهم كيفية استخدام الموقع',
      marketing: 'ملفات تعريف الارتباط التسويقية',
      marketingDesc: 'محتوى مخصص وتوصيات',
      alwaysOn: 'دائماً مفعل',
    },
    ru: {
      title: 'Мы используем файлы cookie',
      description: 'Этот сайт использует файлы cookie для улучшения вашего опыта просмотра и предоставления персонализированного контента.',
      acceptAll: 'Принять все',
      declineAll: 'Отклонить все',
      customize: 'Настроить',
      savePreferences: 'Сохранить настройки',
      privacyLink: 'Политика конфиденциальности',
      necessary: 'Необходимые файлы cookie',
      necessaryDesc: 'Требуются для базовой работы сайта',
      functional: 'Функциональные файлы cookie',
      functionalDesc: 'Запоминают ваши предпочтения',
      analytics: 'Аналитические файлы cookie',
      analyticsDesc: 'Помогают понять, как используется сайт',
      marketing: 'Маркетинговые файлы cookie',
      marketingDesc: 'Персонализированный контент и рекомендации',
      alwaysOn: 'Всегда включено',
    }
  };

  const cookieConsent = {
    preferences: { ...DEFAULT_PREFERENCES },
    isVisible: false,
    showSettings: false,

    init() {
      // Check if user already made a choice
      const hasConsent = localStorage.getItem(STORAGE_KEY);

      if (!hasConsent) {
        // Delay showing banner by 1 second
        setTimeout(() => this.showBanner(), 1000);
      } else {
        // Load saved preferences
        const saved = localStorage.getItem(PREFERENCES_KEY);
        if (saved) {
          this.preferences = JSON.parse(saved);
        }
      }
    },

    getCurrentLang() {
      return localStorage.getItem('preferredLanguage') || 'he';
    },

    t(key) {
      const lang = this.getCurrentLang();
      return translations[lang]?.[key] || translations['en'][key];
    },

    showBanner() {
      this.isVisible = true;
      this.createBanner();
    },

    createBanner() {
      const banner = document.createElement('div');
      banner.id = 'cookie-consent-banner';
      banner.className = 'cookie-consent-banner';
      banner.setAttribute('role', 'dialog');
      banner.setAttribute('aria-label', this.t('title'));
      banner.setAttribute('aria-modal', 'true');

      banner.innerHTML = `
        <div class="cookie-consent-overlay"></div>
        <div class="cookie-consent-modal">
          <div class="cookie-consent-content">
            <div class="cookie-consent-header">
              <span class="cookie-icon">🍪</span>
              <h2>${this.t('title')}</h2>
            </div>
            <p class="cookie-consent-description">${this.t('description')}</p>
            <a href="privacy.html" class="cookie-privacy-link">${this.t('privacyLink')}</a>

            <div class="cookie-consent-settings" id="cookie-settings" style="display: none;">
              <div class="cookie-category">
                <div class="cookie-category-header">
                  <div class="cookie-category-info">
                    <span class="cookie-category-name">${this.t('necessary')}</span>
                    <span class="cookie-category-desc">${this.t('necessaryDesc')}</span>
                  </div>
                  <span class="cookie-always-on">${this.t('alwaysOn')}</span>
                </div>
              </div>

              <div class="cookie-category">
                <div class="cookie-category-header">
                  <div class="cookie-category-info">
                    <span class="cookie-category-name">${this.t('functional')}</span>
                    <span class="cookie-category-desc">${this.t('functionalDesc')}</span>
                  </div>
                  <label class="cookie-toggle">
                    <input type="checkbox" id="cookie-functional" ${this.preferences.functional ? 'checked' : ''}>
                    <span class="cookie-toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div class="cookie-category">
                <div class="cookie-category-header">
                  <div class="cookie-category-info">
                    <span class="cookie-category-name">${this.t('analytics')}</span>
                    <span class="cookie-category-desc">${this.t('analyticsDesc')}</span>
                  </div>
                  <label class="cookie-toggle">
                    <input type="checkbox" id="cookie-analytics" ${this.preferences.analytics ? 'checked' : ''}>
                    <span class="cookie-toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div class="cookie-category">
                <div class="cookie-category-header">
                  <div class="cookie-category-info">
                    <span class="cookie-category-name">${this.t('marketing')}</span>
                    <span class="cookie-category-desc">${this.t('marketingDesc')}</span>
                  </div>
                  <label class="cookie-toggle">
                    <input type="checkbox" id="cookie-marketing" ${this.preferences.marketing ? 'checked' : ''}>
                    <span class="cookie-toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>

            <div class="cookie-consent-buttons">
              <button class="cookie-btn cookie-btn-accept" id="cookie-accept-all">${this.t('acceptAll')}</button>
              <button class="cookie-btn cookie-btn-customize" id="cookie-customize">${this.t('customize')}</button>
              <button class="cookie-btn cookie-btn-decline" id="cookie-decline-all">${this.t('declineAll')}</button>
            </div>

            <div class="cookie-consent-buttons cookie-save-buttons" id="cookie-save-buttons" style="display: none;">
              <button class="cookie-btn cookie-btn-save" id="cookie-save">${this.t('savePreferences')}</button>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(banner);
      this.attachEventListeners();

      // Focus trap
      setTimeout(() => {
        const firstButton = banner.querySelector('.cookie-btn-accept');
        if (firstButton) firstButton.focus();
      }, 100);
    },

    attachEventListeners() {
      const acceptBtn = document.getElementById('cookie-accept-all');
      const declineBtn = document.getElementById('cookie-decline-all');
      const customizeBtn = document.getElementById('cookie-customize');
      const saveBtn = document.getElementById('cookie-save');

      acceptBtn?.addEventListener('click', () => this.acceptAll());
      declineBtn?.addEventListener('click', () => this.declineAll());
      customizeBtn?.addEventListener('click', () => this.toggleSettings());
      saveBtn?.addEventListener('click', () => this.saveCustomPreferences());

      // Escape key to close
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isVisible) {
          this.declineAll();
        }
      });
    },

    toggleSettings() {
      this.showSettings = !this.showSettings;
      const settings = document.getElementById('cookie-settings');
      const mainButtons = document.querySelector('.cookie-consent-buttons:not(.cookie-save-buttons)');
      const saveButtons = document.getElementById('cookie-save-buttons');
      const customizeBtn = document.getElementById('cookie-customize');

      if (this.showSettings) {
        settings.style.display = 'block';
        saveButtons.style.display = 'flex';
        customizeBtn.style.display = 'none';
      } else {
        settings.style.display = 'none';
        saveButtons.style.display = 'none';
        customizeBtn.style.display = 'block';
      }
    },

    acceptAll() {
      this.preferences = {
        necessary: true,
        functional: true,
        analytics: true,
        marketing: true,
      };
      this.saveAndClose();
    },

    declineAll() {
      this.preferences = {
        necessary: true,
        functional: false,
        analytics: false,
        marketing: false,
      };
      this.saveAndClose();
    },

    saveCustomPreferences() {
      this.preferences = {
        necessary: true,
        functional: document.getElementById('cookie-functional')?.checked || false,
        analytics: document.getElementById('cookie-analytics')?.checked || false,
        marketing: document.getElementById('cookie-marketing')?.checked || false,
      };
      this.saveAndClose();
    },

    saveAndClose() {
      localStorage.setItem(STORAGE_KEY, 'true');
      localStorage.setItem(PREFERENCES_KEY, JSON.stringify(this.preferences));

      // Dispatch event for other parts of app
      window.dispatchEvent(new CustomEvent('cookieConsentChanged', {
        detail: this.preferences
      }));

      this.closeBanner();
      console.log('Cookie preferences saved:', this.preferences);
    },

    closeBanner() {
      const banner = document.getElementById('cookie-consent-banner');
      if (banner) {
        banner.classList.add('cookie-consent-closing');
        setTimeout(() => banner.remove(), 300);
      }
      this.isVisible = false;
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => cookieConsent.init());
  } else {
    cookieConsent.init();
  }

  // Expose for external use
  window.cookieConsent = cookieConsent;
})();
