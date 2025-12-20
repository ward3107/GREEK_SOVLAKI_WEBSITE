/**
 * UTF-8 Encoding Validator
 * Monitors and validates character encoding integrity
 */

class EncodingValidator {
    constructor() {
        this.issues = [];
        this.init();
    }

    init() {
        // Run validation when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.validate());
        } else {
            this.validate();
        }

        // Re-validate on dynamic content changes
        this.observeContentChanges();
    }

    /**
     * Validate UTF-8 encoding across the page
     */
    validate() {
        this.issues = [];

        // Check 1: Meta charset declaration
        this.validateMetaCharset();

        // Check 2: HTML attributes for proper quoting
        this.validateHtmlAttributes();

        // Check 3: Text content for encoding issues
        this.validateTextContent();

        // Check 4: Language declarations
        this.validateLanguageDeclarations();

        // Report results
        this.reportResults();

        return this.issues.length === 0;
    }

    /**
     * Check for proper UTF-8 meta charset
     */
    validateMetaCharset() {
        const metaCharset = document.querySelector('meta[charset]');
        if (!metaCharset) {
            this.addIssue('error', 'Missing meta charset declaration', 'head');
            return;
        }

        const charset = metaCharset.getAttribute('charset')?.toLowerCase();
        if (charset !== 'utf-8') {
            this.addIssue('error', `Invalid charset: ${charset}. Expected: utf-8`, 'meta[charset]');
        }
    }

    /**
     * Validate HTML attributes have proper quotes
     */
    validateHtmlAttributes() {
        const attributesToCheck = ['content', 'title', 'alt', 'placeholder', 'aria-label'];

        attributesToCheck.forEach(attr => {
            document.querySelectorAll(`[${attr}]`).forEach(element => {
                const value = element.getAttribute(attr);
                if (!value || value.length < 5) return;

                // Check for common encoding corruption patterns
                // Only flag serious corruption, not normal Unicode content
                if (this.detectCorruption(value)) {
                    this.addIssue('error', `Corrupted text in ${attr} attribute`, element.tagName + '[' + attr + ']', value);
                }
            });
        });
    }

    /**
     * Validate text content for encoding issues
     */
    validateTextContent() {
        // Check elements that commonly contain multilingual text, but be more selective
        const selectors = [
            'title',
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'p', 'span', 'div',
            '[data-lang]',
            'meta[name="description"]',
            'meta[name="keywords"]'
        ];

        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                // Skip script and style content, and elements with specific classes that are safe
                if (element.tagName === 'SCRIPT' || element.tagName === 'STYLE' ||
                    element.classList.contains('gallery-item') ||
                    element.classList.contains('menu-item') ||
                    element.classList.contains('contact-info') ||
                    element.closest('.gallery') ||
                    element.closest('.menu-section')) {
                    return;
                }

                const text = element.textContent || element.getAttribute('content') || '';
                // Only validate if text is substantial and contains potential corruption
                if (text.length > 20 && this.detectCorruption(text)) {
                    this.addIssue('warning', `Potential encoding corruption detected`, selector, text.substring(0, 50) + '...');
                }
            });
        });
    }

    /**
     * Validate language declarations
     */
    validateLanguageDeclarations() {
        const htmlLang = document.documentElement.getAttribute('lang');
        if (!htmlLang) {
            this.addIssue('warning', 'Missing language declaration on html element', 'html');
        }

        // Validate hreflang links
        document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(link => {
            const hreflang = link.getAttribute('hreflang');
            if (!hreflang || !/^[a-z]{2}(-[A-Z]{2})?$/.test(hreflang)) {
                this.addIssue('warning', `Invalid hreflang: ${hreflang}`, 'link[hreflang]');
            }
        });
    }

    /**
     * Detect common encoding corruption patterns
     */
    detectCorruption(text) {
        // Skip validation for short or empty text
        if (!text || text.length < 10) return false;

        // Skip validation for content that contains legitimate Unicode:
        // • Any Hebrew characters: [\u0590-\u05FF\u05EA]
        // • Any Arabic characters: [\u0600-\u06FF]
        // • Any Cyrillic characters: [\u0400-\u04FF]
        // • Any Greek characters: [\u0370-\u03FF]
        // • Common emojis: [\u2600-\u27BF\u1F300-\u1F9FF]
        // • Currency symbols: [\u20A0-\u20CF]
        // • HTML entities (like &copy;, &times;, &nbsp;)
        // • Right-to-left marks: [\u2005-\u2007]
        // • Common punctuation and diacritics: [\u2000-\u206F\u0300-\u036F]

        if (/[\u0590-\u05FF\u05EA\u0600-\u06FF\u0400-\u04FF\u0370-\u03FF\u2600-\u27BF\u1F300-\u1F9FF\u20A0-\u20CF\u2005-\u2007\u2000-\u206F\u0300-\u036F&]/.test(text)) {
            return false;
        }

        // Additional check: skip if text contains legitimate multilingual content patterns
        if (/[\u05D0-\u05EA]|[\u0621-\u064A]|[\u0410-\u044F]|[\u0391-\u03F1]|©|®|™|°|±|×|÷|≤|≥|≠|≈|∞|∑|∏|∫|∂|∇|∆|∅|∈|∉|∋|⊂|⊃|⊄|⊅|∧|∨|¬|→|←|↑|↓|↔|⇒|⇐|⇑|⇓|⇔|∀|∃|∄|∴|∵|∶|∷|∝|∞|∟|∠|∡|∢|∥|∦|∧|∨|∩|∪|⊂|⊃|⊄|⊅|⊆|⊇|⊈|⊉|⊊|⊋|⊌|⊍|⊎|⊏|⊐|⊑|⊒|⊓|⊔|⊕|⊖|⊗|⊘|⊙|⊚|⊛|⊜|⊝|⊞|⊟|⊠|⊡|⊢|⊣|⊤|⊥|⊦|⊧|⊨|⊩|⊪|⊫|⊬|⊭|⊮|⊯|⊰|⊱|⊲|⊳|⊴|⊵|⊸|⊹|⊺|⊻|⊼|⊽|⊾|⊿|⋀|⋁|⋂|⋃|⋄|⋅|⋆|⋇|⋈|⋉|⋊|⋋|⋌|⋍|⋎|⋏|⋐|⋑|⋒|⋓|⋔|⋕|⋖|⋗|⋘|⋙|⋚|⋛|⋜|⋝|⋞|⋟|⋠|⋡|⋢|⋣|⋤|⋥|⋦|⋧|⋨|⋩|⋪|⋫|⋬|⋭|⋮|⋯|⋰|⋱|⋲|⋳|⋴|⋵|⋶|⋷|⋸|⋹|⋺|⋻|⋼|⋽|⋾|⋿]/.test(text)) {
            return false;
        }

        const corruptionPatterns = [
            // UTF-8 double encoding patterns - more specific sequences
            /ÃÂ[\u0080-\u00BF]/g,
            // Mojibake patterns - specific misencoded character sequences
            /â¬[¢¬¥¦]/g,
            /â€[œ""‰‹]/g,
            // Replacement character (U+FFFD) - definitive indicator of decoding errors
            /\uFFFD/g,
            // Multiple consecutive question marks - but only if very long (likely real corruption)
            /[?]{5,}/g,
            // Specific invalid UTF-8 byte sequences (more restrictive)
            /[\x80-\x8F\x90-\x9F][\x80-\xBF]/g,
            // Common Latin-1 to UTF-8 misencoding patterns
            /[Ã][Â\x80-\xBF]/g
        ];

        // Only flag actual encoding corruption, not legitimate Unicode content
        return corruptionPatterns.some(pattern => pattern.test(text));
    }

    /**
     * Add an issue to the list
     */
    addIssue(severity, message, element, details = '') {
        this.issues.push({
            severity,
            message,
            element,
            details,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Report validation results
     */
    reportResults() {
        if (this.issues.length === 0) {
            console.log('✅ Encoding validation passed - No issues detected');
            this.logSuccess();
            return;
        }

        console.group('🚨 Encoding Validation Issues Found');
        this.issues.forEach((issue, index) => {
            const icon = issue.severity === 'error' ? '❌' : '⚠️';
            console.log(`${icon} Issue ${index + 1}: ${issue.message}`);
            console.log(`   Element: ${issue.element}`);
            if (issue.details) {
                console.log(`   Details: ${issue.details}`);
            }
            console.log(`   Time: ${issue.timestamp}`);
            console.log('---');
        });
        console.groupEnd();

        this.logIssues();
    }

    /**
     * Log success to analytics/monitoring
     */
    logSuccess() {
        // You can integrate with analytics here
        if (typeof gtag !== 'undefined') {
            gtag('event', 'encoding_validation_success', {
                event_category: 'technical',
                event_label: 'utf_8_validation'
            });
        }
    }

    /**
     * Log issues to monitoring
     */
    logIssues() {
        // You can integrate with error monitoring here
        if (typeof gtag !== 'undefined') {
            gtag('event', 'encoding_validation_error', {
                event_category: 'technical',
                event_label: 'utf_8_validation',
                value: this.issues.length
            });
        }

        // Add error details to dataLayer for debugging
        if (typeof dataLayer !== 'undefined') {
            dataLayer.push({
                'event': 'encoding_issues_detected',
                'issues': this.issues,
                'total_issues': this.issues.length
            });
        }
    }

    /**
     * Observe dynamic content changes
     */
    observeContentChanges() {
        if (!window.MutationObserver) return;

        const observer = new MutationObserver((mutations) => {
            let shouldRevalidate = false;

            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // Check if any text nodes or elements with content were added
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.TEXT_NODE || node.nodeType === Node.ELEMENT_NODE) {
                            shouldRevalidate = true;
                        }
                    });
                }

                if (mutation.type === 'attributes') {
                    shouldRevalidate = true;
                }
            });

            if (shouldRevalidate) {
                // Debounce re-validation
                setTimeout(() => this.validate(), 1000);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['content', 'title', 'alt', 'aria-label']
        });
    }

    /**
     * Public method to get validation results
     */
    getResults() {
        return {
            valid: this.issues.length === 0,
            issues: this.issues,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Quick validation utility for specific text
     */
    static validateText(text) {
        const validator = new EncodingValidator();
        return !validator.detectCorruption(text);
    }
}

// Auto-initialize if in browser
if (typeof window !== 'undefined') {
    window.EncodingValidator = EncodingValidator;

    // Create global instance
    window.encodingValidator = new EncodingValidator();

    // Expose quick validation function
    window.validateEncoding = () => window.encodingValidator.validate();

    console.log('🔍 Encoding Validator initialized');
}

// Export for Node.js/modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EncodingValidator;
}