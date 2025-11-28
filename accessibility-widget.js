// Accessibility Widget for Greek Souvlaki Website
(function() {
  'use strict';

  // Create accessibility widget
  const widget = {
    settings: {
      fontSize: localStorage.getItem('a11y-fontSize') || '100',
      contrast: localStorage.getItem('a11y-contrast') || 'normal',
      lineSpacing: localStorage.getItem('a11y-lineSpacing') || 'normal',
      letterSpacing: localStorage.getItem('a11y-letterSpacing') || 'normal'
    },

    init() {
      this.createWidget();
      this.applySettings();
      this.attachEventListeners();
      this.initBadge();
    },

    initBadge() {
      // Check if badge should be hidden
      const badgeHidden = localStorage.getItem('a11y-badge-hidden');
      if (badgeHidden === 'true') {
        this.hideBadge();
      }

      // Add close button listener
      const closeBtn = document.querySelector('.a11y-badge-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.hideBadge();
          localStorage.setItem('a11y-badge-hidden', 'true');
        });
      }
    },

    hideBadge() {
      const badgeContainer = document.getElementById('accessibility-badge-container');
      if (badgeContainer) {
        badgeContainer.classList.add('hidden');
      }
    },

    createWidget() {
      const widgetHTML = `
        <div id="a11y-widget" class="a11y-widget" role="dialog" aria-label="Accessibility Options" aria-hidden="true">
          <button id="a11y-toggle" class="a11y-toggle" aria-label="Open accessibility options" aria-expanded="false">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <circle cx="12" cy="8" r="1"></circle>
              <line x1="12" y1="10" x2="12" y2="16"></line>
              <line x1="8" y1="14" x2="16" y2="14"></line>
            </svg>
          </button>
          <div id="a11y-panel" class="a11y-panel">
            <div class="a11y-header">
              <h3>אפשרויות נגישות</h3>
              <button id="a11y-close" class="a11y-close" aria-label="Close accessibility options">✕</button>
            </div>
            <div class="a11y-controls">
              <div class="a11y-control">
                <label for="font-size">גודל טקסט</label>
                <div class="a11y-buttons">
                  <button data-action="decreaseFontSize" aria-label="Decrease font size">A-</button>
                  <span id="font-size-value">${this.settings.fontSize}%</span>
                  <button data-action="increaseFontSize" aria-label="Increase font size">A+</button>
                </div>
              </div>
              <div class="a11y-control">
                <label>ניגודיות</label>
                <div class="a11y-buttons">
                  <button data-action="normalContrast" class="${this.settings.contrast === 'normal' ? 'active' : ''}">רגיל</button>
                  <button data-action="highContrast" class="${this.settings.contrast === 'high' ? 'active' : ''}">גבוה</button>
                  <button data-action="invertContrast" class="${this.settings.contrast === 'invert' ? 'active' : ''}">הפוך</button>
                </div>
              </div>
              <div class="a11y-control">
                <label>ריווח שורות</label>
                <div class="a11y-buttons">
                  <button data-action="normalLineSpacing" class="${this.settings.lineSpacing === 'normal' ? 'active' : ''}">רגיל</button>
                  <button data-action="increaseLineSpacing" class="${this.settings.lineSpacing === 'increased' ? 'active' : ''}">מוגבר</button>
                </div>
              </div>
              <div class="a11y-control">
                <label>ריווח אותיות</label>
                <div class="a11y-buttons">
                  <button data-action="normalLetterSpacing" class="${this.settings.letterSpacing === 'normal' ? 'active' : ''}">רגיל</button>
                  <button data-action="increaseLetterSpacing" class="${this.settings.letterSpacing === 'increased' ? 'active' : ''}">מוגבר</button>
                </div>
              </div>
              <div class="a11y-control">
                <button data-action="reset" class="a11y-reset">איפוס הגדרות</button>
              </div>
            </div>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML('beforeend', widgetHTML);
    },

    attachEventListeners() {
      const toggle = document.getElementById('a11y-toggle');
      const close = document.getElementById('a11y-close');
      const panel = document.getElementById('a11y-panel');
      const widgetElement = document.getElementById('a11y-widget');

      toggle.addEventListener('click', () => {
        const isOpen = panel.classList.toggle('open');
        toggle.setAttribute('aria-expanded', isOpen);
        widgetElement.setAttribute('aria-hidden', !isOpen);
      });

      close.addEventListener('click', () => {
        panel.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        widgetElement.setAttribute('aria-hidden', 'true');
      });

      // Action buttons
      document.querySelectorAll('[data-action]').forEach(button => {
        button.addEventListener('click', (e) => {
          const action = e.target.dataset.action;
          this.handleAction(action);
        });
      });

      // Close on Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && panel.classList.contains('open')) {
          panel.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
          widgetElement.setAttribute('aria-hidden', 'true');
        }
      });
    },

    handleAction(action) {
      switch(action) {
        case 'increaseFontSize':
          this.settings.fontSize = Math.min(parseInt(this.settings.fontSize) + 10, 200).toString();
          break;
        case 'decreaseFontSize':
          this.settings.fontSize = Math.max(parseInt(this.settings.fontSize) - 10, 80).toString();
          break;
        case 'normalContrast':
          this.settings.contrast = 'normal';
          break;
        case 'highContrast':
          this.settings.contrast = 'high';
          break;
        case 'invertContrast':
          this.settings.contrast = 'invert';
          break;
        case 'normalLineSpacing':
          this.settings.lineSpacing = 'normal';
          break;
        case 'increaseLineSpacing':
          this.settings.lineSpacing = 'increased';
          break;
        case 'normalLetterSpacing':
          this.settings.letterSpacing = 'normal';
          break;
        case 'increaseLetterSpacing':
          this.settings.letterSpacing = 'increased';
          break;
        case 'reset':
          this.settings = {
            fontSize: '100',
            contrast: 'normal',
            lineSpacing: 'normal',
            letterSpacing: 'normal'
          };
          Object.keys(this.settings).forEach(key => {
            localStorage.removeItem(`a11y-${key}`);
          });
          break;
      }
      this.applySettings();
      this.saveSettings();
      this.updateUI();

      // Hide badge after user makes any changes
      if (action !== 'reset') {
        this.hideBadge();
        localStorage.setItem('a11y-badge-hidden', 'true');
      }
    },

    applySettings() {
      const root = document.documentElement;

      // Font size
      root.style.fontSize = this.settings.fontSize + '%';

      // Contrast
      document.body.classList.remove('a11y-high-contrast', 'a11y-invert-contrast');
      if (this.settings.contrast === 'high') {
        document.body.classList.add('a11y-high-contrast');
      } else if (this.settings.contrast === 'invert') {
        document.body.classList.add('a11y-invert-contrast');
      }

      // Line spacing
      if (this.settings.lineSpacing === 'increased') {
        root.style.setProperty('--line-height', '2');
      } else {
        root.style.setProperty('--line-height', '1.6');
      }

      // Letter spacing
      if (this.settings.letterSpacing === 'increased') {
        root.style.setProperty('--letter-spacing', '0.1em');
      } else {
        root.style.setProperty('--letter-spacing', 'normal');
      }
    },

    saveSettings() {
      Object.keys(this.settings).forEach(key => {
        localStorage.setItem(`a11y-${key}`, this.settings[key]);
      });
    },

    updateUI() {
      // Update font size display
      const fontSizeValue = document.getElementById('font-size-value');
      if (fontSizeValue) {
        fontSizeValue.textContent = this.settings.fontSize + '%';
      }

      // Update active button states
      document.querySelectorAll('[data-action]').forEach(button => {
        button.classList.remove('active');
      });

      const activeButtons = {
        contrast: `${this.settings.contrast}Contrast`,
        lineSpacing: this.settings.lineSpacing === 'increased' ? 'increaseLineSpacing' : 'normalLineSpacing',
        letterSpacing: this.settings.letterSpacing === 'increased' ? 'increaseLetterSpacing' : 'normalLetterSpacing'
      };

      Object.values(activeButtons).forEach(action => {
        const button = document.querySelector(`[data-action="${action}"]`);
        if (button) {
          button.classList.add('active');
        }
      });
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => widget.init());
  } else {
    widget.init();
  }
})();
