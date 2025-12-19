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

  // Create the install banner - DISABLED
  function createInstallBanner(isIOSDevice = false) {
    // PWA install banner has been disabled
    console.log('📱 PWA install banner disabled');
    return;
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

  // Show banner after delay - DISABLED
  function showBannerWithDelay(isIOSDevice = false) {
    // PWA install banner has been disabled
    console.log('📱 PWA install banner disabled');
    return;
  }

  // Initialize - DISABLED
  function init() {
    console.log('📱 PWA Install script initialized - BANNER DISABLED');
    console.log('📱 PWA install prompts have been disabled');

    // Listen for successful installation only
    window.addEventListener('appinstalled', () => {
      console.log('📱 🎉 App was installed successfully!');
      deferredPrompt = null;
    });
  }

  // Expose test function globally - DISABLED
  window.testPWAInstall = function() {
    console.log('📱 PWA install banner testing disabled');
  };

  window.testPWAInstallIOS = function() {
    console.log('📱 PWA install banner testing disabled');
  };

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
