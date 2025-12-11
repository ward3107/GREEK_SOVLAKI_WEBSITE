/**
 * PWA Install Prompt
 * ==================
 * Shows a custom install prompt to encourage users to install the app
 */

(function() {
  'use strict';

  // Store the deferred prompt event
  let deferredPrompt = null;
  let installBanner = null;

  // Translations for the install prompt
  const translations = {
    he: {
      title: 'התקן את האפליקציה',
      message: 'הוסף את Greek Souvlaki למסך הבית שלך לגישה מהירה!',
      install: 'התקן',
      later: 'אחר כך',
      iosMessage: 'להתקנה: לחץ על כפתור השיתוף ובחר "הוסף למסך הבית"'
    },
    en: {
      title: 'Install App',
      message: 'Add Greek Souvlaki to your home screen for quick access!',
      install: 'Install',
      later: 'Later',
      iosMessage: 'To install: tap the share button and select "Add to Home Screen"'
    },
    ar: {
      title: 'تثبيت التطبيق',
      message: 'أضف Greek Souvlaki إلى شاشتك الرئيسية للوصول السريع!',
      install: 'تثبيت',
      later: 'لاحقاً',
      iosMessage: 'للتثبيت: اضغط على زر المشاركة واختر "إضافة إلى الشاشة الرئيسية"'
    },
    ru: {
      title: 'Установить приложение',
      message: 'Добавьте Greek Souvlaki на главный экран для быстрого доступа!',
      install: 'Установить',
      later: 'Позже',
      iosMessage: 'Для установки: нажмите кнопку "Поделиться" и выберите "На экран Домой"'
    }
  };

  // Get current language
  function getCurrentLang() {
    const html = document.documentElement;
    return html.getAttribute('lang') || 'he';
  }

  // Get translation
  function t(key) {
    const lang = getCurrentLang();
    return translations[lang]?.[key] || translations['en'][key];
  }

  // Check if app is already installed
  function isAppInstalled() {
    // Check if running in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return true;
    }
    // Check iOS standalone
    if (window.navigator.standalone === true) {
      return true;
    }
    return false;
  }

  // Check if user dismissed the prompt recently
  function wasRecentlyDismissed() {
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (!dismissed) return false;

    const dismissedTime = parseInt(dismissed, 10);
    const threeDays = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds

    return (Date.now() - dismissedTime) < threeDays;
  }

  // Check if iOS
  function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  }

  // Check if Safari on iOS
  function isIOSSafari() {
    return isIOS() && /Safari/.test(navigator.userAgent) && !/CriOS|FxiOS/.test(navigator.userAgent);
  }

  // Create the install banner
  function createInstallBanner(isIOSDevice = false) {
    if (installBanner) return;

    installBanner = document.createElement('div');
    installBanner.id = 'pwa-install-banner';
    installBanner.innerHTML = `
      <div class="pwa-install-content">
        <div class="pwa-install-icon">
          <img src="restaurant-logo.jpg" alt="Greek Souvlaki" width="48" height="48">
        </div>
        <div class="pwa-install-text">
          <strong>${t('title')}</strong>
          <p>${isIOSDevice ? t('iosMessage') : t('message')}</p>
        </div>
        <div class="pwa-install-buttons">
          ${isIOSDevice ? `
            <button class="pwa-btn-later" id="pwa-dismiss">${t('later')}</button>
          ` : `
            <button class="pwa-btn-later" id="pwa-dismiss">${t('later')}</button>
            <button class="pwa-btn-install" id="pwa-install">${t('install')}</button>
          `}
        </div>
      </div>
    `;

    // Add styles
    const styles = document.createElement('style');
    styles.textContent = `
      #pwa-install-banner {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
        color: white;
        padding: 1rem;
        z-index: 999999;
        box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3), 0 0 0 2px rgba(251, 191, 36, 0.3);
        animation: slideUp 0.4s ease-out, subtlePulse 2s ease-in-out infinite 1s;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        border-top: 3px solid #fbbf24;
      }

      @keyframes slideUp {
        from {
          transform: translateY(100%);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }

      @keyframes subtlePulse {
        0%, 100% {
          box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3), 0 0 0 2px rgba(251, 191, 36, 0.3);
        }
        50% {
          box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.35), 0 0 0 3px rgba(251, 191, 36, 0.5);
        }
      }

      .pwa-install-content {
        display: flex;
        align-items: center;
        gap: 1rem;
        max-width: 600px;
        margin: 0 auto;
      }

      .pwa-install-icon img {
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      }

      .pwa-install-text {
        flex: 1;
      }

      .pwa-install-text strong {
        font-size: 1.1rem;
        display: block;
        margin-bottom: 0.25rem;
      }

      .pwa-install-text p {
        margin: 0;
        font-size: 0.9rem;
        opacity: 0.9;
        line-height: 1.4;
      }

      .pwa-install-buttons {
        display: flex;
        gap: 0.5rem;
        flex-shrink: 0;
      }

      .pwa-btn-install,
      .pwa-btn-later {
        padding: 0.6rem 1.2rem;
        border-radius: 8px;
        font-size: 0.95rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        border: none;
      }

      .pwa-btn-install {
        background: #fbbf24;
        color: #1e3a8a;
      }

      .pwa-btn-install:hover {
        background: #f59e0b;
        transform: scale(1.05);
      }

      .pwa-btn-later {
        background: transparent;
        color: white;
        border: 2px solid rgba(255, 255, 255, 0.5);
      }

      .pwa-btn-later:hover {
        background: rgba(255, 255, 255, 0.1);
        border-color: white;
      }

      /* RTL Support */
      [dir="rtl"] .pwa-install-content {
        flex-direction: row-reverse;
      }

      [dir="rtl"] .pwa-install-text {
        text-align: right;
      }

      [dir="rtl"] .pwa-install-buttons {
        flex-direction: row-reverse;
      }

      /* Mobile adjustments */
      @media (max-width: 480px) {
        .pwa-install-content {
          flex-wrap: wrap;
        }

        .pwa-install-icon {
          display: none;
        }

        .pwa-install-text {
          width: 100%;
          text-align: center !important;
          margin-bottom: 0.5rem;
        }

        .pwa-install-buttons {
          width: 100%;
          justify-content: center;
        }

        [dir="rtl"] .pwa-install-text {
          text-align: center !important;
        }
      }
    `;
    document.head.appendChild(styles);
    document.body.appendChild(installBanner);

    // Add event listeners
    const dismissBtn = document.getElementById('pwa-dismiss');
    const installBtn = document.getElementById('pwa-install');

    if (dismissBtn) {
      dismissBtn.addEventListener('click', dismissBanner);
    }

    if (installBtn) {
      installBtn.addEventListener('click', installApp);
    }

    console.log('📱 PWA install banner shown');
  }

  // Dismiss the banner
  function dismissBanner() {
    if (installBanner) {
      installBanner.style.animation = 'slideDown 0.3s ease-in forwards';
      installBanner.style.setProperty('--slideDown', 'translateY(100%)');

      // Add slideDown animation
      const style = document.createElement('style');
      style.textContent = `
        @keyframes slideDown {
          to {
            transform: translateY(100%);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);

      setTimeout(() => {
        installBanner.remove();
        installBanner = null;
      }, 300);
    }

    // Remember dismissal for 3 days
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
    console.log('📱 PWA install banner dismissed');
  }

  // Install the app
  async function installApp() {
    if (!deferredPrompt) {
      console.log('📱 No deferred prompt available');
      return;
    }

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for user response
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`📱 User response to install prompt: ${outcome}`);

    // Clear the deferred prompt
    deferredPrompt = null;

    // Remove the banner
    dismissBanner();

    if (outcome === 'accepted') {
      console.log('📱 App installed successfully!');
    }
  }

  // Show banner after delay
  function showBannerWithDelay(isIOSDevice = false) {
    // Wait 2 seconds before showing the banner (reduced for better visibility)
    setTimeout(() => {
      console.log('📱 Showing PWA install banner now...');
      createInstallBanner(isIOSDevice);
    }, 2000);
  }

  // Initialize
  function init() {
    console.log('📱 PWA Install script initialized');
    console.log('📱 Current URL:', window.location.href);
    console.log('📱 Is HTTPS:', window.location.protocol === 'https:');
    console.log('📱 User Agent:', navigator.userAgent);

    // Don't show if already installed
    if (isAppInstalled()) {
      console.log('📱 App already installed, skipping install prompt');
      return;
    }

    // Don't show if recently dismissed
    if (wasRecentlyDismissed()) {
      const dismissed = localStorage.getItem('pwa-install-dismissed');
      const dismissedTime = new Date(parseInt(dismissed, 10));
      console.log('📱 Install prompt recently dismissed on:', dismissedTime.toLocaleString());
      console.log('📱 Will show again after 3 days');
      return;
    }

    // Handle iOS Safari (no beforeinstallprompt event)
    if (isIOSSafari()) {
      console.log('📱 iOS Safari detected, showing manual install instructions');
      showBannerWithDelay(true);
      return;
    }

    // Listen for the beforeinstallprompt event (Chrome, Edge, etc.)
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();

      // Store the event for later use
      deferredPrompt = e;

      console.log('📱 ✅ beforeinstallprompt event captured - PWA is installable!');

      // Show the install banner
      showBannerWithDelay(false);
    });

    // Listen for successful installation
    window.addEventListener('appinstalled', () => {
      console.log('📱 🎉 App was installed successfully!');
      deferredPrompt = null;

      if (installBanner) {
        installBanner.remove();
        installBanner = null;
      }
    });

    console.log('📱 Waiting for beforeinstallprompt event...');
    console.log('📱 Note: This event only fires on HTTPS or localhost in supported browsers');
    console.log('📱 Android Chrome/Edge: Will show automatically');
    console.log('📱 iOS Safari: Will show manual instructions');
    console.log('📱 Desktop: May not show (PWA install typically for mobile)');
    console.log('📱 Tip: Run testPWAInstall() in console to test the banner manually');
  }

  // Expose test function globally
  window.testPWAInstall = function() {
    console.log('📱 Testing PWA install banner...');
    // Clear any previous dismissal
    localStorage.removeItem('pwa-install-dismissed');
    // Show the banner immediately
    createInstallBanner(false);
  };

  window.testPWAInstallIOS = function() {
    console.log('📱 Testing PWA install banner (iOS style)...');
    localStorage.removeItem('pwa-install-dismissed');
    createInstallBanner(true);
  };

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
