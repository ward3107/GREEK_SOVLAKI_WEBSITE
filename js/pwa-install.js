/**
 * PWA Install Prompt Handler
 * Shows a custom install prompt for Progressive Web App installation
 */

(function() {
    'use strict';

    class PWAInstallPrompt {
        constructor() {
            this.prompt = null;
            this.promptElement = null;
            this.installButton = null;
            this.closeButton = null;
            this.userDismissed = false;
            this.init();
        }

        init() {
            // Check if already installed
            if (this.isInstalled()) {
                console.log('PWA is already installed');
                return;
            }

            // Check if user previously dismissed the prompt
            if (localStorage.getItem('pwa-install-dismissed')) {
                console.log('PWA install prompt previously dismissed');
                return;
            }

            // Get DOM elements
            this.promptElement = document.getElementById('pwa-install-prompt');
            this.installButton = document.getElementById('pwa-install-button');
            this.closeButton = document.querySelector('.pwa-prompt-close');

            if (!this.promptElement || !this.installButton || !this.closeButton) {
                console.log('PWA install prompt elements not found');
                return;
            }

            // Setup event listeners
            this.setupEventListeners();
            this.setupInstallPromptListener();
            this.checkInstallConditions();
        }

        setupEventListeners() {
            // Install button click
            this.installButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleInstallClick();
            });

            // Close button click
            this.closeButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.dismissPrompt();
            });

            // Keyboard navigation
            this.installButton.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.handleInstallClick();
                }
            });

            this.closeButton.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.dismissPrompt();
                }
            });

            // Escape key to close
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.promptElement.classList.contains('show')) {
                    this.dismissPrompt();
                }
            });
        }

        setupInstallPromptListener() {
            // Listen for the beforeinstallprompt event
            window.addEventListener('beforeinstallprompt', (e) => {
                e.preventDefault();
                this.prompt = e;
                console.log('Install prompt event captured');
                this.showPrompt();
            });

            // Listen for successful installation
            window.addEventListener('appinstalled', () => {
                console.log('PWA installed successfully');
                this.hidePrompt();
                this.showInstallationSuccess();
            });
        }

        checkInstallConditions() {
            // Show prompt after some interaction (delayed to be less intrusive)
            setTimeout(() => {
                if (!this.userDismissed && this.shouldShowPrompt()) {
                    // Check if browser supports PWA installation
                    if (this.isPWASupported()) {
                        this.showPrompt();
                    } else {
                        this.showManualInstallInstructions();
                    }
                }
            }, 5000); // Show after 5 seconds
        }

        shouldShowPrompt() {
            // Don't show on very first visit (let user explore first)
            const visitCount = parseInt(localStorage.getItem('site-visit-count') || '0');
            localStorage.setItem('site-visit-count', (visitCount + 1).toString());

            // Only show on 2nd visit or later
            if (visitCount < 1) {
                console.log('First visit - will show PWA prompt on next visit');
                return false;
            }

            // Only show on mobile devices where PWA makes sense
            if (!this.isMobileOrTablet()) {
                console.log('Desktop device - may not show PWA prompt');
                return false;
            }

            return true;
        }

        isMobileOrTablet() {
            return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                   (navigator.maxTouchPoints > 0 && window.innerWidth <= 1024);
        }

        isPWASupported() {
            // Check if PWA features are supported
            return 'serviceWorker' in navigator &&
                   'BeforeInstallPromptEvent' in window &&
                   !this.isInstalled();
        }

        isInstalled() {
            // Check if app is running in standalone mode (installed)
            return window.matchMedia('(display-mode: standalone)').matches ||
                   window.navigator.standalone === true ||
                   document.referrer.includes('android-app://');
        }

        showPrompt() {
            if (!this.promptElement || this.userDismissed) return;

            this.promptElement.style.display = 'block';
            // Force reflow
            this.promptElement.offsetHeight;
            this.promptElement.classList.add('show');

            console.log('PWA install prompt shown');
        }

        hidePrompt() {
            if (!this.promptElement) return;

            this.promptElement.classList.remove('show');
            setTimeout(() => {
                this.promptElement.style.display = 'none';
            }, 400);

            console.log('PWA install prompt hidden');
        }

        dismissPrompt() {
            this.userDismissed = true;
            localStorage.setItem('pwa-install-dismissed', 'true');
            this.hidePrompt();
        }

        async handleInstallClick() {
            if (this.prompt) {
                // Use the native browser install prompt
                try {
                    const result = await this.prompt.prompt();
                    console.log('Install prompt result:', result);

                    if (result.outcome === 'accepted') {
                        console.log('User accepted PWA installation');
                    } else {
                        console.log('User dismissed PWA installation');
                    }
                } catch (error) {
                    console.error('Error during PWA installation:', error);
                }
            } else {
                // Show manual install instructions
                this.showManualInstallInstructions();
            }
        }

        showManualInstallInstructions() {
            // Create a simple modal with instructions
            const instructions = document.createElement('div');
            instructions.className = 'pwa-install-instructions';
            instructions.innerHTML = `
                <div class="instructions-content">
                    <h3>כיצד להתקין את האפליקציה</h3>
                    <div class="instructions-steps">
                        ${this.isSafari() ? `
                            <p><strong>iPhone/iPad:</strong></p>
                            <ol>
                                <li>לחץ על כפתור השיתוף <span class="icon">📤</span></li>
                                <li>גלול למטה ובחר "אל המסך הבית" <span class="icon">➕</span></li>
                                <li>לחץ "הוסף" כדי להתקין</li>
                            </ol>
                        ` : `
                            <p><strong>Android:</strong></p>
                            <ol>
                                <li>לחץ על שלוש הנקודות <span class="icon">⋮</span> בפינה הימנית העליונה</li>
                                <li>בחר "התקן אפליקציה" או "Add to Home screen"</li>
                                <li>לחץ "התקן" כדי לסיים</li>
                            </ol>
                        `}
                    </div>
                    <button class="instructions-close">סגור</button>
                </div>
            `;

            // Add styles for instructions
            const style = document.createElement('style');
            style.textContent = `
                .pwa-install-instructions {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.8);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10001;
                    animation: fadeIn 0.3s ease;
                }

                .instructions-content {
                    background: var(--color-surface);
                    padding: 2rem;
                    border-radius: var(--radius-lg);
                    max-width: 400px;
                    margin: 0 1rem;
                    text-align: center;
                }

                .instructions-content h3 {
                    margin-bottom: 1rem;
                    color: var(--color-text);
                }

                .instructions-steps {
                    text-align: right;
                    margin-bottom: 1.5rem;
                }

                .instructions-steps ol {
                    margin: 0.5rem 0;
                    padding-right: 1.5rem;
                }

                .instructions-steps li {
                    margin-bottom: 0.5rem;
                    line-height: 1.5;
                }

                .icon {
                    display: inline-block;
                    margin: 0 0.25rem;
                }

                .instructions-close {
                    background: var(--color-primary);
                    color: white;
                    border: none;
                    padding: 0.7rem 1.5rem;
                    border-radius: var(--radius-md);
                    cursor: pointer;
                    font-weight: 500;
                }
            `;

            document.head.appendChild(style);
            document.body.appendChild(instructions);

            // Handle close
            const closeBtn = instructions.querySelector('.instructions-close');
            closeBtn.addEventListener('click', () => {
                instructions.remove();
                style.remove();
            });

            // Close on outside click
            instructions.addEventListener('click', (e) => {
                if (e.target === instructions) {
                    instructions.remove();
                    style.remove();
                }
            });
        }

        isSafari() {
            return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        }

        showInstallationSuccess() {
            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'pwa-success-toast';
            successMessage.textContent = 'האפליקציה הותקנה בהצלחה!';

            // Add styles
            const style = document.createElement('style');
            style.textContent = `
                .pwa-success-toast {
                    position: fixed;
                    top: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: #4CAF50;
                    color: white;
                    padding: 1rem 2rem;
                    border-radius: var(--radius-md);
                    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
                    z-index: 10002;
                    animation: slideDown 0.4s ease;
                }

                @keyframes slideDown {
                    from {
                        transform: translateX(-50%) translateY(-100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(-50%) translateY(0);
                        opacity: 1;
                    }
                }
            `;

            document.head.appendChild(style);
            document.body.appendChild(successMessage);

            // Remove after 3 seconds
            setTimeout(() => {
                successMessage.style.animation = 'slideDown 0.4s ease reverse';
                setTimeout(() => {
                    successMessage.remove();
                    style.remove();
                }, 400);
            }, 3000);
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new PWAInstallPrompt();
        });
    } else {
        new PWAInstallPrompt();
    }
})();