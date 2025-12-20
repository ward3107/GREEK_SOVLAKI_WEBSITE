/**
 * Theme Manager - Date-Based Christmas Theme System
 * =================================================
 *
 * This script automatically switches between the default theme and
 * Christmas theme based on the current date.
 *
 * Christmas theme is active: December 20 - December 27 (inclusive)
 *
 * TODO: To change the Christmas period, edit these values:
 */

// ========================================
// CONFIGURATION - Edit dates here
// ========================================

const CHRISTMAS_CONFIG = {
  // Start date (month is 0-based: 11 = December)
  startMonth: 11,  // December
  startDay: 20,    // 20th
  startYear: 2025, // Year

  // End date
  endMonth: 0,     // January (0-based)
  endDay: 15,      // 15th
  endYear: 2026,   // Year

  // CSS file paths (change if you rename the files)
  christmasStylesheet: 'theme-christmas.css',

  // Logo paths (change if you have different logos)
  defaultLogo: 'images/ws-logo.png',
  christmasLogo: 'images/ws-logo-christmas.png', // Create this file for a festive logo

  // Body classes
  defaultClass: 'is-default',
  christmasClass: 'is-christmas'
};

// ========================================
// THEME MANAGER LOGIC
// ========================================

class ThemeManager {
  constructor(config) {
    this.config = config;
    this.initialized = false;
  }

  /**
   * Check if the current date falls within the Christmas period
   * @returns {boolean}
   */
  isChristmasPeriod() {
    const now = new Date();

    // Create start and end dates for the Christmas period
    const startDate = new Date(
      this.config.startYear,
      this.config.startMonth,
      this.config.startDay,
      0, 0, 0
    );
    const endDate = new Date(
      this.config.endYear,
      this.config.endMonth,
      this.config.endDay,
      23, 59, 59
    );

    // Check if current date is within the range
    return now >= startDate && now <= endDate;
  }

  /**
   * Load or remove the Christmas stylesheet
   * @param {boolean} isChristmas
   */
  updateStylesheet(isChristmas) {
    const existingLink = document.getElementById('christmasStylesheet');

    if (isChristmas) {
      // Add Christmas stylesheet if not already present
      if (!existingLink) {
        const link = document.createElement('link');
        link.id = 'christmasStylesheet';
        link.rel = 'stylesheet';
        link.href = this.config.christmasStylesheet + '?v=' + Date.now();
        document.head.appendChild(link);
        console.log('🎄 Christmas theme stylesheet loaded');
      }
    } else {
      // Remove Christmas stylesheet if present
      if (existingLink) {
        existingLink.remove();
        console.log('🌿 Christmas theme stylesheet removed');
      }
    }
  }

  /**
   * Update body classes for theme
   * @param {boolean} isChristmas
   */
  updateBodyClass(isChristmas) {
    const body = document.body;

    if (isChristmas) {
      body.classList.remove(this.config.defaultClass);
      body.classList.add(this.config.christmasClass);
    } else {
      body.classList.remove(this.config.christmasClass);
      body.classList.add(this.config.defaultClass);
    }
  }

  /**
   * Update logo image if Christmas logo exists
   * @param {boolean} isChristmas
   */
  updateLogo(isChristmas) {
    const logo = document.querySelector('.logo-img, #appLogo, .logo img');

    if (!logo) {
      // No logo element found, skip
      return;
    }

    // Store original logo if not already stored
    if (!logo.dataset.defaultLogo) {
      logo.dataset.defaultLogo = logo.src;
    }

    if (isChristmas && this.config.christmasLogo) {
      // Check if Christmas logo exists before switching
      const testImg = new Image();
      testImg.onload = () => {
        logo.src = this.config.christmasLogo;
        console.log('🎄 Christmas logo applied');
      };
      testImg.onerror = () => {
        // Christmas logo doesn't exist, keep default
        console.log('ℹ️ Christmas logo not found, using default');
      };
      testImg.src = this.config.christmasLogo;
    } else {
      // Use default logo
      logo.src = logo.dataset.defaultLogo || this.config.defaultLogo;
    }
  }

  /**
   * Check if user has closed the Christmas banner
   * @returns {boolean}
   */
  hasUserClosedBanner() {
    try {
      return localStorage.getItem('christmas-banner-closed') === 'true';
    } catch (e) {
      console.warn('Could not access localStorage for banner preference:', e);
      return false;
    }
  }

  /**
   * Mark that user has closed the Christmas banner
   */
  setBannerClosed() {
    try {
      localStorage.setItem('christmas-banner-closed', 'true');
      console.log('🎄 Christmas banner preference saved');
    } catch (e) {
      console.warn('Could not save banner preference:', e);
    }
  }

  /**
   * Add Christmas announcement banner
   * @param {boolean} isChristmas
   */
  addChristmasBanner(isChristmas) {
    const existingBanner = document.getElementById('christmas-banner');

    if (isChristmas && !this.hasUserClosedBanner()) {
      if (!existingBanner) {
        const banner = document.createElement('div');
        banner.id = 'christmas-banner';
        banner.setAttribute('role', 'alert');
        banner.setAttribute('aria-live', 'polite');
        banner.innerHTML = `
          <span class="christmas-banner-text">
            🎄 Christmas Menu Available 20/12/2025 - 15/1/2026! Book Your Table Now! 🎄
          </span>
          <button class="christmas-banner-close" aria-label="Close Christmas announcement" title="Close announcement">×</button>
        `;

        // Banner styles
        Object.assign(banner.style, {
          position: 'fixed',
          top: '0',
          left: '0',
          right: '0',
          background: 'linear-gradient(135deg, #b22222 0%, #8b0000 100%)',
          color: '#fdf5e6',
          textAlign: 'center',
          padding: '0.75rem 2rem',
          fontWeight: '600',
          zIndex: '10000',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '1rem',
          borderBottom: '3px solid #d4af37',
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
          animation: 'slideDown 0.5s ease-out',
          fontFamily: "'Inter', 'Rubik', 'Arial Hebrew', sans-serif",
          fontSize: '0.95rem'
        });

        // Add styles if not already present
        if (!document.getElementById('christmas-banner-styles')) {
          const style = document.createElement('style');
          style.id = 'christmas-banner-styles';
          style.textContent = `
            @keyframes slideDown {
              from { transform: translateY(-100%); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
            }
            @keyframes slideUp {
              from { transform: translateY(0); opacity: 1; }
              to { transform: translateY(-100%); opacity: 0; }
            }
            .christmas-banner-close {
              background: transparent;
              border: 2px solid #d4af37;
              color: #fdf5e6;
              width: 32px;
              height: 32px;
              border-radius: 50%;
              cursor: pointer;
              font-size: 1.2rem;
              line-height: 1;
              transition: all 0.2s ease;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
              min-width: 32px;
              min-height: 32px;
            }
            .christmas-banner-close:hover {
              background: rgba(212, 175, 55, 0.3);
              transform: scale(1.1);
            }
            .christmas-banner-close:focus {
              outline: 2px solid #d4af37;
              outline-offset: 2px;
            }
            .christmas-banner-text {
              animation: pulse 2s ease-in-out infinite;
            }
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.8; }
            }
            .christmas-banner.closing {
              animation: slideUp 0.3s ease-out forwards;
            }
            @media (max-width: 768px) {
              .christmas-banner {
                padding: 0.5rem 1rem;
                font-size: 0.85rem;
                flex-direction: column;
                gap: 0.5rem;
              }
              .christmas-banner-close {
                width: 28px;
                height: 28px;
                font-size: 1rem;
              }
            }
          `;
          document.head.appendChild(style);
        }

        // Insert banner at the very top of body
        document.body.insertBefore(banner, document.body.firstChild);

        // Add event listener for close button
        const closeButton = banner.querySelector('.christmas-banner-close');
        closeButton.addEventListener('click', (e) => {
          e.preventDefault();
          this.closeChristmasBanner();
        });

        // Adjust body padding to account for banner
        setTimeout(() => {
          if (document.body.style.paddingTop === '' || document.body.style.paddingTop === '0px') {
            document.body.style.paddingTop = banner.offsetHeight + 'px';
          }
        }, 100);

        console.log('🎄 Christmas banner added');
      }
    } else {
      if (existingBanner) {
        this.closeChristmasBanner();
      }
    }
  }

  /**
   * Close the Christmas banner with animation
   */
  closeChristmasBanner() {
    const banner = document.getElementById('christmas-banner');
    if (banner) {
      // Add closing animation
      banner.classList.add('closing');

      // Remove banner after animation and save preference
      setTimeout(() => {
        banner.remove();
        document.body.style.paddingTop = '';
        this.setBannerClosed();
        console.log('🌿 Christmas banner closed');
      }, 300);
    }
  }

  /**
   * Reset banner preference (for testing)
   */
  resetBannerPreference() {
    try {
      localStorage.removeItem('christmas-banner-closed');
      console.log('🔄 Christmas banner preference reset');
    } catch (e) {
      console.warn('Could not reset banner preference:', e);
    }
  }

  /**
   * Initialize the theme manager
   */
  init() {
    if (this.initialized) return;

    const isChristmas = this.isChristmasPeriod();

    console.log(`🎨 Theme Manager initialized`);
    console.log(`📅 Current date: ${new Date().toLocaleDateString()}`);
    console.log(`🎄 Christmas period: ${this.config.startDay}/${this.config.startMonth + 1}/${this.config.startYear} - ${this.config.endDay}/${this.config.endMonth + 1}/${this.config.endYear}`);
    console.log(`✨ Christmas theme active: ${isChristmas}`);

    // Apply theme
    this.updateStylesheet(isChristmas);
    this.updateBodyClass(isChristmas);
    this.updateLogo(isChristmas);
    this.addChristmasBanner(isChristmas);

    this.initialized = true;

    // Dispatch custom event for other scripts to hook into
    window.dispatchEvent(new CustomEvent('themeChanged', {
      detail: { isChristmas, config: this.config }
    }));
  }

  /**
   * Force a specific theme (useful for testing)
   * @param {boolean} forceChristmas
   */
  forceTheme(forceChristmas) {
    console.log(`🔧 Forcing ${forceChristmas ? 'Christmas' : 'default'} theme`);
    this.updateStylesheet(forceChristmas);
    this.updateBodyClass(forceChristmas);
    this.updateLogo(forceChristmas);
    this.addChristmasBanner(forceChristmas);

    window.dispatchEvent(new CustomEvent('themeChanged', {
      detail: { isChristmas: forceChristmas, config: this.config, forced: true }
    }));
  }
}

// ========================================
// INITIALIZE ON PAGE LOAD
// ========================================

// Create global theme manager instance
window.themeManager = new ThemeManager(CHRISTMAS_CONFIG);

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.themeManager.init();
  });
} else {
  // DOM already loaded
  window.themeManager.init();
}

// ========================================
// DEVELOPER HELPER FUNCTIONS
// ========================================

/**
 * Test the Christmas theme without waiting for December
 * Call from browser console: testChristmasTheme()
 */
window.testChristmasTheme = function() {
  window.themeManager.forceTheme(true);
  console.log('🎄 Christmas theme forced ON for testing');
  console.log('💡 Tip: Refresh the page to restore date-based theme');
};

/**
 * Test the default theme
 * Call from browser console: testDefaultTheme()
 */
window.testDefaultTheme = function() {
  window.themeManager.forceTheme(false);
  console.log('🌿 Default theme forced ON for testing');
  console.log('💡 Tip: Refresh the page to restore date-based theme');
};

/**
 * Check theme status
 * Call from browser console: checkThemeStatus()
 */
window.checkThemeStatus = function() {
  const isChristmas = window.themeManager.isChristmasPeriod();
  const config = CHRISTMAS_CONFIG;

  console.log('=== Theme Status ===');
  console.log(`Current date: ${new Date().toLocaleDateString()}`);
  console.log(`Christmas period: ${config.startDay}/${config.startMonth + 1}/${config.startYear} - ${config.endDay}/${config.endMonth + 1}/${config.endYear}`);
  console.log(`Is Christmas active: ${isChristmas}`);
  console.log(`Body class: ${document.body.className}`);
  console.log(`Banner closed by user: ${window.themeManager.hasUserClosedBanner()}`);
  console.log('==================');

  return { isChristmas, config, bannerClosed: window.themeManager.hasUserClosedBanner() };
};

/**
 * Test Christmas banner specifically
 * Call from browser console: testChristmasBanner()
 */
window.testChristmasBanner = function() {
  window.themeManager.addChristmasBanner(true);
  console.log('🎄 Christmas banner test added');
};

/**
 * Close Christmas banner test
 * Call from browser console: closeChristmasBanner()
 */
window.closeChristmasBanner = function() {
  window.themeManager.closeChristmasBanner();
  console.log('🌿 Christmas banner test closed');
};

/**
 * Reset banner preference (show banner again)
 * Call from browser console: resetChristmasBanner()
 */
window.resetChristmasBanner = function() {
  window.themeManager.resetBannerPreference();
  console.log('🔄 Christmas banner preference reset - banner will show again');
};

/**
 * Toggle Christmas banner
 * Call from browser console: toggleChristmasBanner()
 */
window.toggleChristmasBanner = function() {
  const banner = document.getElementById('christmas-banner');
  if (banner) {
    window.themeManager.closeChristmasBanner();
  } else {
    window.themeManager.addChristmasBanner(true);
  }
};
