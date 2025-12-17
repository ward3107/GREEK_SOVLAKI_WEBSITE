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
      console.log('Accessibility widget initializing...');

      // Check if widget was closed this session
      if (sessionStorage.getItem('accessibilityWidgetClosed') === 'true') {
        console.log('Accessibility widget hidden for this session');
        return; // Don't create widget if closed this session
      }

      this.createWidget();
      this.applySettings();
      this.attachEventListeners();
      this.initBadge();
      console.log('Accessibility widget initialized!');
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

      // Keep toggle button always visible (removed scroll hiding)
    },

    hideBadge() {
      const badgeContainer = document.getElementById('accessibility-badge-container');
      if (badgeContainer) {
        badgeContainer.classList.add('hidden');
      }
    },

    createWidget() {
      const widgetHTML = `
        <div id="a11y-widget" class="a11y-widget">
          <button id="a11y-widget-close" class="a11y-widget-close" aria-label="Close accessibility widget" title="הסתר כפתור נגישות">×</button>
          <button id="a11y-toggle" class="a11y-toggle" aria-label="Open accessibility options" aria-expanded="false" aria-controls="a11y-panel">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <circle cx="12" cy="8" r="1"></circle>
              <line x1="12" y1="10" x2="12" y2="16"></line>
              <line x1="8" y1="14" x2="16" y2="14"></line>
            </svg>
          </button>
          <div id="a11y-panel" class="a11y-panel" role="dialog" aria-label="Accessibility Options" aria-hidden="true">
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
              <div class="a11y-visibility-prompt" id="a11y-visibility-prompt" style="display: none;">
                <p>להשאיר את כפתור הנגישות גלוי?</p>
                <div class="a11y-buttons">
                  <button data-visibility="visible" class="a11y-keep-visible">כן, השאר גלוי</button>
                  <button data-visibility="hidden" class="a11y-hide-widget">הסתר</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
      // Add to page-content so it moves with scroll content
      const pageContent = document.querySelector('.page-content');
      if (pageContent) {
        pageContent.insertAdjacentHTML('beforeend', widgetHTML);
      } else {
        document.body.insertAdjacentHTML('beforeend', widgetHTML);
      }
    },

    attachEventListeners() {
      const toggle = document.getElementById('a11y-toggle');
      const close = document.getElementById('a11y-close');
      const panel = document.getElementById('a11y-panel');
      const widgetElement = document.getElementById('a11y-widget');
      const visibilityPrompt = document.getElementById('a11y-visibility-prompt');
      const widgetCloseBtn = document.getElementById('a11y-widget-close');
      const self = this;

      // Widget close button (X) - hides widget for this session
      if (widgetCloseBtn) {
        widgetCloseBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          sessionStorage.setItem('accessibilityWidgetClosed', 'true');
          widgetElement.classList.add('a11y-widget-hidden');
          // Remove after animation
          setTimeout(() => {
            widgetElement.remove();
          }, 300);
        });
      }

      // Track if user has made a choice about visibility (session only)
      this.visibilityDecided = false;
      this.widgetHidden = false;

      // Sections with dark/blue backgrounds where widget needs light color
      const darkSections = ['footer', '.footer-compact', '#contact'];

      // Check if widget is over a dark section
      function isOverDarkSection() {
        const toggleRect = toggle.getBoundingClientRect();

        for (const selector of darkSections) {
          const section = document.querySelector(selector);
          if (section) {
            const sectionRect = section.getBoundingClientRect();
            // Check if toggle overlaps with this section (when toggle bottom reaches section top)
            if (toggleRect.bottom >= sectionRect.top && toggleRect.top <= sectionRect.bottom) {
              return true;
            }
          }
        }
        return false;
      }

      // Check and update widget color based on background
      function checkBackground() {
        // Update position to move with scroll
        const scrollOffset = window.scrollY;
        widgetElement.style.transform = `translateY(${scrollOffset}px)`;

        if (isOverDarkSection()) {
          toggle.classList.add('light-mode');
        } else {
          toggle.classList.remove('light-mode');
        }
      }

      // Listen for scroll to update color
      window.addEventListener('scroll', checkBackground, { passive: true });
      checkBackground();

      // Store reference for closing
      this.closePanel = () => {
        panel.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        panel.setAttribute('aria-hidden', 'true');
      };

      // Toggle button
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        const isOpen = panel.classList.toggle('open');
        toggle.setAttribute('aria-expanded', isOpen);
        panel.setAttribute('aria-hidden', !isOpen);
      });

      // Close button
      close.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        self.closePanel();
      });

      // Action buttons - use event delegation on the controls container
      const controls = panel.querySelector('.a11y-controls');
      if (controls) {
        controls.addEventListener('click', (e) => {
          const button = e.target.closest('[data-action]');
          if (button) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            const action = button.getAttribute('data-action');
            console.log('Action clicked:', action);
            // Save scroll position
            const scrollY = window.scrollY;
            self.handleAction(action);
            // Restore scroll position
            window.scrollTo(0, scrollY);
          }
        });
      }

      // Prevent panel clicks from closing
      panel.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        e.stopImmediatePropagation();
      });
      panel.addEventListener('click', (e) => {
        e.stopPropagation();
        e.stopImmediatePropagation();
      });

      // Close on Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && panel.classList.contains('open')) {
          self.closePanel();
        }
      });

      // Close on click outside - only in bubble phase
      document.addEventListener('click', (e) => {
        // Check if click is inside widget
        if (widgetElement.contains(e.target)) {
          return; // Do nothing, let widget handle it
        }
        // Close panel if open and click is outside
        if (panel.classList.contains('open')) {
          self.closePanel();
        }
      }, false); // Bubble phase

      // Visibility prompt buttons
      visibilityPrompt.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-visibility]');
        if (btn) {
          e.preventDefault();
          e.stopPropagation();
          const choice = btn.getAttribute('data-visibility');

          // Session only - don't save to localStorage
          self.visibilityDecided = true;

          // Remove focus before closing to avoid aria-hidden warning
          btn.blur();

          if (choice === 'hidden') {
            self.widgetHidden = true;
            self.closePanel();
            // Remove the entire widget from the DOM
            widgetElement.remove();
          } else {
            self.widgetHidden = false;
            visibilityPrompt.style.display = 'none';
          }
        }
      });
    },

    showVisibilityPrompt() {
      const visibilityPrompt = document.getElementById('a11y-visibility-prompt');
      if (visibilityPrompt && !this.visibilityDecided) {
        visibilityPrompt.style.display = 'block';
      }
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

      // Show visibility prompt after any setting change (except reset to default)
      if (action !== 'reset') {
        this.showVisibilityPrompt();
      }
    },

    applySettings() {
      const root = document.documentElement;
      console.log('Applying settings:', this.settings);

      // Font size - apply to html element for better inheritance
      const fontSize = parseInt(this.settings.fontSize);
      root.style.fontSize = fontSize + '%';
      console.log('Font size set to:', fontSize + '%');

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
