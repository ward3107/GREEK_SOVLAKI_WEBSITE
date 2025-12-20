// Cookie Consent Banner for Greek Souvlaki Website - Enhanced for GDPR & Israeli Privacy Law Compliance
(function() {
  'use strict';

  const STORAGE_KEY = 'greek-souvlaki-cookie-consent';
  const PREFERENCES_KEY = 'greek-souvlaki-cookie-preferences';
  const CONSENT_TIMESTAMP_KEY = 'greek-souvlaki-consent-timestamp';
  const CONSENT_VERSION_KEY = 'greek-souvlaki-consent-version';

  const CURRENT_CONSENT_VERSION = '2.0';
  const MAX_CONSENT_AGE = 365 * 24 * 60 * 60 * 1000; // 1 year in milliseconds

  const DEFAULT_PREFERENCES = {
    necessary: true,      // Always true, cannot be disabled
    functional: false,    // Preferences, language, UI settings - opt-in
    analytics: false,     // Usage tracking - opt-in
    marketing: false,     // Personalization - opt-in
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
      close: 'סגור',
      cookieActions: 'פעולות עוגיות',
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
      close: 'Close',
      cookieActions: 'Cookie Actions',
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
      close: 'إغلاق',
      cookieActions: 'إجراءات ملفات تعريف الارتباط',
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
      close: 'Закрыть',
      cookieActions: 'Действия с файлами cookie',
    }
  };

  const cookieConsent = {
    preferences: { ...DEFAULT_PREFERENCES },
    isVisible: false,
    showSettings: false,

    init() {
      // Check if user already made a choice
      const hasConsent = localStorage.getItem(STORAGE_KEY);
      const consentTimestamp = localStorage.getItem(CONSENT_TIMESTAMP_KEY);
      const consentVersion = localStorage.getItem(CONSENT_VERSION_KEY);

      // Check if consent needs to be refreshed
      const needsRefresh = this.shouldRefreshConsent(consentTimestamp, consentVersion);

      if (!hasConsent || needsRefresh) {
        // Clear old consent if version changed or expired
        if (needsRefresh) {
          this.clearConsent();
        }
        // Show banner after short delay (improved UX)
        setTimeout(() => this.showBanner(), 500);
      } else {
        // Load saved preferences
        const saved = localStorage.getItem(PREFERENCES_KEY);
        if (saved) {
          this.preferences = JSON.parse(saved);
          // Emit consent change event for scripts that depend on consent
          window.dispatchEvent(new CustomEvent('cookieConsentLoaded', {
            detail: this.preferences
          }));
        }
      }
    },

    shouldRefreshConsent(timestamp, version) {
      if (!timestamp || !version) return true;

      // Check if version changed
      if (version !== CURRENT_CONSENT_VERSION) return true;

      // Check if consent is older than 1 year
      const consentAge = Date.now() - parseInt(timestamp);
      return consentAge > MAX_CONSENT_AGE;
    },

    clearConsent() {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(PREFERENCES_KEY);
      localStorage.removeItem(CONSENT_TIMESTAMP_KEY);
      localStorage.removeItem(CONSENT_VERSION_KEY);
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
      banner.setAttribute('aria-labelledby', 'cookie-consent-title');
      banner.setAttribute('aria-describedby', 'cookie-consent-description');
      banner.setAttribute('aria-modal', 'true');

      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';

      // Store focus element for restoration
      this.previousFocus = document.activeElement;

      const lang = this.getCurrentLang();
      const isRTL = ['he', 'ar'].includes(lang);

      banner.innerHTML = `
        <div class="cookie-consent-overlay" aria-hidden="true"></div>
        <div class="cookie-consent-modal" dir="${isRTL ? 'rtl' : 'ltr'}">
          <div class="cookie-consent-content">
            <div class="cookie-consent-header">
              <span class="cookie-icon" aria-hidden="true">🍪</span>
              <h2 id="cookie-consent-title">${this.t('title')}</h2>
              <button class="cookie-btn-close" id="cookie-close" aria-label="${this.t('close') || 'Close'}" tabindex="0">×</button>
            </div>
            <p id="cookie-consent-description" class="cookie-consent-description">${this.t('description')}</p>
            <a href="privacy.html" class="cookie-privacy-link" target="_blank" rel="noopener noreferrer">${this.t('privacyLink')}</a>

            <div class="cookie-consent-settings" id="cookie-settings" role="group" aria-labelledby="cookie-settings-title" style="display: none;">
              <h3 id="cookie-settings-title">${this.t('customize')}</h3>

              <div class="cookie-category">
                <div class="cookie-category-header">
                  <div class="cookie-category-info">
                    <span class="cookie-category-name">${this.t('necessary')}</span>
                    <span class="cookie-category-desc">${this.t('necessaryDesc')}</span>
                  </div>
                  <span class="cookie-always-on" aria-label="${this.t('alwaysOn')}">${this.t('alwaysOn')}</span>
                </div>
              </div>

              <div class="cookie-category">
                <div class="cookie-category-header">
                  <div class="cookie-category-info">
                    <span class="cookie-category-name">${this.t('functional')}</span>
                    <span class="cookie-category-desc">${this.t('functionalDesc')}</span>
                  </div>
                  <label class="cookie-toggle">
                    <input type="checkbox" id="cookie-functional" ${this.preferences.functional ? 'checked' : ''}
                           aria-describedby="functional-desc">
                    <span class="cookie-toggle-slider" aria-hidden="true"></span>
                    <span class="sr-only">${this.t('functional')}: ${this.preferences.functional ? 'Enabled' : 'Disabled'}</span>
                  </label>
                </div>
              </div>

              <div class="cookie-category">
                <div class="cookie-category-header">
                  <div class="cookie-category-info">
                    <span class="cookie-category-name">${this.t('analytics')}</span>
                    <span class="cookie-category-desc" id="analytics-desc">${this.t('analyticsDesc')}</span>
                  </div>
                  <label class="cookie-toggle">
                    <input type="checkbox" id="cookie-analytics" ${this.preferences.analytics ? 'checked' : ''}
                           aria-describedby="analytics-desc">
                    <span class="cookie-toggle-slider" aria-hidden="true"></span>
                    <span class="sr-only">${this.t('analytics')}: ${this.preferences.analytics ? 'Enabled' : 'Disabled'}</span>
                  </label>
                </div>
              </div>

              <div class="cookie-category">
                <div class="cookie-category-header">
                  <div class="cookie-category-info">
                    <span class="cookie-category-name">${this.t('marketing')}</span>
                    <span class="cookie-category-desc" id="marketing-desc">${this.t('marketingDesc')}</span>
                  </div>
                  <label class="cookie-toggle">
                    <input type="checkbox" id="cookie-marketing" ${this.preferences.marketing ? 'checked' : ''}
                           aria-describedby="marketing-desc">
                    <span class="cookie-toggle-slider" aria-hidden="true"></span>
                    <span class="sr-only">${this.t('marketing')}: ${this.preferences.marketing ? 'Enabled' : 'Disabled'}</span>
                  </label>
                </div>
              </div>
            </div>

            <div class="cookie-consent-buttons" role="group" aria-label="${this.t('cookieActions') || 'Cookie Actions'}">
              <button class="cookie-btn cookie-btn-primary" id="cookie-accept-all">${this.t('acceptAll')}</button>
              <button class="cookie-btn cookie-btn-secondary" id="cookie-customize">${this.t('customize')}</button>
              <button class="cookie-btn cookie-btn-tertiary" id="cookie-decline-all">${this.t('declineAll')}</button>
            </div>

            <div class="cookie-consent-buttons cookie-save-buttons" id="cookie-save-buttons" style="display: none;">
              <button class="cookie-btn cookie-btn-primary" id="cookie-save">${this.t('savePreferences')}</button>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(banner);
      this.attachEventListeners();

      // Focus trap and initial focus
      setTimeout(() => {
        this.setupFocusTrap();
        const firstButton = banner.querySelector('#cookie-accept-all');
        if (firstButton) {
          firstButton.focus();
        }
      }, 100);
    },

    setupFocusTrap() {
      const banner = document.getElementById('cookie-consent-banner');
      if (!banner) return;

      const focusableElements = banner.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      this.focusableElements = Array.from(focusableElements);
      this.firstFocusableElement = this.focusableElements[0];
      this.lastFocusableElement = this.focusableElements[this.focusableElements.length - 1];
    },

    attachEventListeners() {
      const acceptBtn = document.getElementById('cookie-accept-all');
      const declineBtn = document.getElementById('cookie-decline-all');
      const customizeBtn = document.getElementById('cookie-customize');
      const saveBtn = document.getElementById('cookie-save');
      const closeBtn = document.getElementById('cookie-close');

      // Button click handlers
      acceptBtn?.addEventListener('click', () => this.acceptAll());
      declineBtn?.addEventListener('click', () => this.declineAll());
      customizeBtn?.addEventListener('click', () => this.toggleSettings());
      saveBtn?.addEventListener('click', () => this.saveCustomPreferences());
      closeBtn?.addEventListener('click', () => this.declineAll());

      // Checkbox change handlers for screen reader updates
      const checkboxes = ['cookie-functional', 'cookie-analytics', 'cookie-marketing'];
      checkboxes.forEach(id => {
        const checkbox = document.getElementById(id);
        if (checkbox) {
          checkbox.addEventListener('change', (e) => {
            const srText = checkbox.parentElement.querySelector('.sr-only');
            if (srText) {
              const name = this.t(id.replace('cookie-', ''));
              srText.textContent = `${name}: ${e.target.checked ? 'Enabled' : 'Disabled'}`;
            }
          });
        }
      });

      // Enhanced keyboard navigation
      document.addEventListener('keydown', (e) => {
        if (!this.isVisible) return;

        // Tab and Shift+Tab for focus management
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            // Shift+Tab going backwards
            if (document.activeElement === this.firstFocusableElement) {
              e.preventDefault();
              this.lastFocusableElement.focus();
            }
          } else {
            // Tab going forwards
            if (document.activeElement === this.lastFocusableElement) {
              e.preventDefault();
              this.firstFocusableElement.focus();
            }
          }
          return;
        }

        // Escape key to close
        if (e.key === 'Escape') {
          e.preventDefault();
          this.declineAll();
        }

        // Enter and Space for button activation
        if (e.key === 'Enter' || e.key === ' ') {
          if (e.target.classList.contains('cookie-btn')) {
            e.preventDefault();
            e.target.click();
          }
        }

        // Arrow keys for settings toggle
        if (this.showSettings && ['ArrowUp', 'ArrowDown'].includes(e.key)) {
          e.preventDefault();
          this.navigateSettings(e.key === 'ArrowUp' ? -1 : 1);
        }
      });
    },

    navigateSettings(direction) {
      const checkboxes = document.querySelectorAll('#cookie-settings input[type="checkbox"]:not([disabled])');
      if (checkboxes.length === 0) return;

      const currentIndex = Array.from(checkboxes).findIndex(cb => cb === document.activeElement);
      let nextIndex;

      if (currentIndex === -1) {
        nextIndex = direction > 0 ? 0 : checkboxes.length - 1;
      } else {
        nextIndex = currentIndex + direction;
        if (nextIndex < 0) nextIndex = checkboxes.length - 1;
        if (nextIndex >= checkboxes.length) nextIndex = 0;
      }

      checkboxes[nextIndex].focus();
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
      // Save consent with timestamp and version
      const timestamp = Date.now().toString();
      localStorage.setItem(STORAGE_KEY, 'true');
      localStorage.setItem(PREFERENCES_KEY, JSON.stringify(this.preferences));
      localStorage.setItem(CONSENT_TIMESTAMP_KEY, timestamp);
      localStorage.setItem(CONSENT_VERSION_KEY, CURRENT_CONSENT_VERSION);

      // Create consent record for audit trail
      const consentRecord = {
        timestamp: timestamp,
        version: CURRENT_CONSENT_VERSION,
        preferences: { ...this.preferences },
        userAgent: navigator.userAgent.substring(0, 200),
        consentId: this.generateConsentId()
      };

      // Store audit record (optional, for compliance)
      try {
        const auditRecords = JSON.parse(localStorage.getItem('cookieConsentAudit') || '[]');
        auditRecords.push(consentRecord);
        // Keep only last 10 records to prevent storage bloat
        if (auditRecords.length > 10) {
          auditRecords.shift();
        }
        localStorage.setItem('cookieConsentAudit', JSON.stringify(auditRecords));
      } catch (e) {
        console.warn('Could not store audit record:', e);
      }

      // Dispatch events for other parts of app
      window.dispatchEvent(new CustomEvent('cookieConsentChanged', {
        detail: this.preferences
      }));

      // Also emit a more specific consent event for analytics/marketing scripts
      window.dispatchEvent(new CustomEvent('cookieConsentUpdate', {
        detail: {
          analytics: this.preferences.analytics,
          marketing: this.preferences.marketing,
          functional: this.preferences.functional,
          necessary: this.preferences.necessary
        }
      }));

      this.closeBanner();
      console.log('Cookie preferences saved:', this.preferences);
    },

    generateConsentId() {
      return 'consent_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    },

    closeBanner() {
      const banner = document.getElementById('cookie-consent-banner');
      if (banner) {
        banner.classList.add('cookie-consent-closing');
        setTimeout(() => {
          banner.remove();
          // Restore body scroll
          document.body.style.overflow = '';
          // Restore focus to previous element
          if (this.previousFocus && this.previousFocus.focus) {
            this.previousFocus.focus();
          }
        }, 300);
      }
      this.isVisible = false;
    },

    // Public methods for external access
    hasConsent(category = null) {
      if (!category) return localStorage.getItem(STORAGE_KEY) === 'true';
      return this.preferences[category] || false;
    },

    getPreferences() {
      return { ...this.preferences };
    },

    updatePreferences(newPreferences) {
      this.preferences = { ...this.preferences, ...newPreferences };
      this.saveAndClose();
    },

    showConsentBanner() {
      if (!this.isVisible) {
        this.clearConsent();
        this.showBanner();
      }
    },

    withdrawConsent() {
      this.clearConsent();
      this.showBanner();
      // Emit withdrawal event
      window.dispatchEvent(new CustomEvent('cookieConsentWithdrawn', {
        detail: { timestamp: Date.now() }
      }));
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
