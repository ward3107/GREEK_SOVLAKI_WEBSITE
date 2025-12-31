/**
 * Navigation Dropdown Functionality
 * Handles dropdown menus for navigation on both desktop and mobile
 */

(function() {
    'use strict';

    class NavigationDropdown {
        constructor() {
            this.activeDropdown = null;
            this.isMobile = window.innerWidth <= 768;
            this.init();
        }

        init() {
            this.setupDropdowns();
            this.setupEventListeners();
            this.setupKeyboardNavigation();
            this.setupResponsiveHandling();
        }

        setupDropdowns() {
            const dropdowns = document.querySelectorAll('.nav-dropdown');

            dropdowns.forEach(dropdown => {
                const toggle = dropdown.querySelector('.nav-dropdown-toggle');
                const panel = dropdown.querySelector('.nav-dropdown-panel');

                if (toggle && panel) {
                    // Set initial ARIA attributes
                    toggle.setAttribute('aria-expanded', 'false');
                    panel.setAttribute('aria-hidden', 'true');

                    // Store references
                    dropdown.toggle = toggle;
                    dropdown.panel = panel;
                }
            });
        }

        setupEventListeners() {
            const dropdowns = document.querySelectorAll('.nav-dropdown');

            dropdowns.forEach(dropdown => {
                const toggle = dropdown.toggle;
                const panel = dropdown.panel;

                if (!toggle || !panel) return;

                // Toggle dropdown on click/tap (with touch support for PWA)
                const handleDropdownToggle = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.toggleDropdown(dropdown);
                };

                toggle.addEventListener('click', handleDropdownToggle);
                toggle.addEventListener('touchstart', handleDropdownToggle, { passive: false });
                toggle.addEventListener('touchend', handleDropdownToggle, { passive: false });

                // Handle dropdown item clicks
                const items = panel.querySelectorAll('.nav-dropdown-item');
                items.forEach(item => {
                    item.addEventListener('click', (e) => {
                        const href = item.getAttribute('href');

                        // Update main navigation button text if this is the main nav dropdown
                        const currentNavItem = dropdown.querySelector('.current-nav-item');
                        if (currentNavItem) {
                            currentNavItem.textContent = item.textContent.trim();
                        }

                        // Update active state
                        items.forEach(i => i.classList.remove('active'));
                        item.classList.add('active');

                        // Only handle internal hash links
                        if (href && href.startsWith('#')) {
                            e.preventDefault();

                            // Close dropdown immediately
                            this.closeDropdown(dropdown);

                            // Close mobile menu if open
                            const mobileMenu = document.querySelector('.nav-menu');
                            const hamburger = document.querySelector('.hamburger');
                            if (mobileMenu && hamburger && hamburger.getAttribute('aria-expanded') === 'true') {
                                mobileMenu.classList.remove('active');
                                hamburger.setAttribute('aria-expanded', 'false');
                            }

                            // Smooth scroll to section
                            const target = document.querySelector(href);
                            if (target) {
                                const navbar = document.querySelector('.navbar');
                                const navbarHeight = navbar ? navbar.offsetHeight : 0;
                                const targetPosition = target.offsetTop - navbarHeight - 20;

                                window.scrollTo({
                                    top: targetPosition,
                                    behavior: 'smooth'
                                });
                            }
                        } else {
                            // For external links, close dropdown after short delay
                            setTimeout(() => {
                                this.closeDropdown(dropdown);
                            }, 150);
                        }
                    });
                });

                // Prevent panel clicks from closing
                panel.addEventListener('click', (e) => {
                    e.stopPropagation();
                });

                // Add hover functionality for desktop (helps PWA too)
                if (!this.isMobile) {
                    dropdown.addEventListener('mouseenter', () => {
                        if (this.activeDropdown !== dropdown) {
                            this.closeAllDropdowns();
                            this.openDropdown(dropdown);
                        }
                    });

                    dropdown.addEventListener('mouseleave', () => {
                        // Add a small delay before closing on mouse leave
                        setTimeout(() => {
                            if (!dropdown.matches(':hover')) {
                                this.closeDropdown(dropdown);
                            }
                        }, 100);
                    });
                }
            });

            // Close dropdowns when clicking outside
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.nav-dropdown')) {
                    this.closeAllDropdowns();
                }
            });

            // Close dropdowns on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeAllDropdowns();
                    // Return focus to the toggle button
                    if (this.activeDropdown && this.activeDropdown.toggle) {
                        this.activeDropdown.toggle.focus();
                    }
                }
            });

            // Handle window resize
            window.addEventListener('resize', () => {
                const wasMobile = this.isMobile;
                this.isMobile = window.innerWidth <= 768;

                // If switching between mobile/desktop, reset dropdowns
                if (wasMobile !== this.isMobile) {
                    this.resetDropdowns();
                }
            });
        }

        setupKeyboardNavigation() {
            const dropdowns = document.querySelectorAll('.nav-dropdown');

            dropdowns.forEach(dropdown => {
                const toggle = dropdown.toggle;
                const panel = dropdown.panel;

                if (!toggle || !panel) return;

                // Enter/Space to toggle
                toggle.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.toggleDropdown(dropdown);
                    }

                    // Arrow keys to navigate
                    if (e.key === 'ArrowDown' && toggle.getAttribute('aria-expanded') === 'true') {
                        e.preventDefault();
                        const firstItem = panel.querySelector('.nav-dropdown-item');
                        if (firstItem) {
                            firstItem.focus();
                        }
                    }
                });

                // Arrow key navigation within dropdown
                const items = panel.querySelectorAll('.nav-dropdown-item');
                items.forEach((item, index) => {
                    item.addEventListener('keydown', (e) => {
                        switch (e.key) {
                            case 'ArrowDown':
                                e.preventDefault();
                                const nextItem = items[index + 1];
                                if (nextItem) {
                                    nextItem.focus();
                                }
                                break;
                            case 'ArrowUp':
                                e.preventDefault();
                                const prevItem = items[index - 1];
                                if (prevItem) {
                                    prevItem.focus();
                                } else {
                                    toggle.focus();
                                }
                                break;
                            case 'Escape':
                                e.preventDefault();
                                this.closeDropdown(dropdown);
                                toggle.focus();
                                break;
                        }
                    });
                });
            });
        }

        setupResponsiveHandling() {
            // Don't interfere with hamburger menu - mobile-menu-fix.js handles it
            // Just ensure dropdowns are closed when mobile menu opens
            const mobileMenuToggle = document.querySelector('.hamburger');

            if (mobileMenuToggle) {
                mobileMenuToggle.addEventListener('click', (e) => {
                    // Use setTimeout to check if menu will be open after other handlers run
                    setTimeout(() => {
                        const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
                        if (isExpanded) {
                            // When mobile menu is opened, close all dropdowns
                            this.closeAllDropdowns();
                        }
                    }, 0);
                });
            }
        }

        toggleDropdown(dropdown) {
            if (this.activeDropdown === dropdown) {
                this.closeDropdown(dropdown);
            } else {
                this.closeAllDropdowns();
                this.openDropdown(dropdown);
            }
        }

        openDropdown(dropdown) {
            const toggle = dropdown.toggle;
            const panel = dropdown.panel;

            if (!toggle || !panel) return;

            // Update ARIA attributes
            toggle.setAttribute('aria-expanded', 'true');
            panel.setAttribute('aria-hidden', 'false');

            // Track active dropdown
            this.activeDropdown = dropdown;

            // Add active class for styling
            dropdown.classList.add('dropdown-active');

            // Focus management for desktop
            if (!this.isMobile) {
                // Add a small delay before allowing keyboard navigation
                setTimeout(() => {
                    const firstItem = panel.querySelector('.nav-dropdown-item');
                    if (firstItem && document.activeElement === toggle) {
                        // Don't automatically focus first item, let user decide
                    }
                }, 100);
            }
        }

        closeDropdown(dropdown) {
            const toggle = dropdown.toggle;
            const panel = dropdown.panel;

            if (!toggle || !panel) return;

            // Remove focus from any items in the dropdown before hiding
            const focusedItem = panel.querySelector('.nav-dropdown-item:focus');
            if (focusedItem) {
                focusedItem.blur();
                // Return focus to the toggle button
                if (toggle) {
                    toggle.focus();
                }
            }

            // Update ARIA attributes
            toggle.setAttribute('aria-expanded', 'false');
            panel.setAttribute('aria-hidden', 'true');

            // Remove active class
            dropdown.classList.remove('dropdown-active');

            // Clear active dropdown reference
            if (this.activeDropdown === dropdown) {
                this.activeDropdown = null;
            }
        }

        closeAllDropdowns() {
            const dropdowns = document.querySelectorAll('.nav-dropdown');
            dropdowns.forEach(dropdown => {
                this.closeDropdown(dropdown);
            });
        }

        resetDropdowns() {
            // Reset all dropdowns when switching between mobile/desktop
            const dropdowns = document.querySelectorAll('.nav-dropdown');
            dropdowns.forEach(dropdown => {
                const toggle = dropdown.toggle;
                const panel = dropdown.panel;

                if (toggle && panel) {
                    // Reset ARIA attributes
                    toggle.setAttribute('aria-expanded', 'false');
                    panel.setAttribute('aria-hidden', 'true');

                    // Remove active class
                    dropdown.classList.remove('dropdown-active');
                }
            });

            this.activeDropdown = null;
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new NavigationDropdown();
        });
    } else {
        new NavigationDropdown();
    }
})();