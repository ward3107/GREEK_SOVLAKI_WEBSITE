/**
 * Menu Tabs Functionality
 * Handles tab switching for the menu section
 */

document.addEventListener('DOMContentLoaded', function() {
    initMenuTabs();
});

function initMenuTabs() {
    // Try tabs first (fallback for old structure)
    let tabs = document.querySelectorAll('.menu-tab');
    let useDropdown = false;

    // If no tabs, try dropdown items
    if (tabs.length === 0) {
        tabs = document.querySelectorAll('.dropdown-item');
        useDropdown = true;
    }

    const tabContents = document.querySelectorAll('.menu-tab-content');
    const dropdownToggle = document.getElementById('menu-dropdown-toggle');
    const currentCategorySpan = document.getElementById('current-menu-category');

    if (tabs.length === 0) {
        return;
    }

    // Add event listeners
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            if (useDropdown) {
                switchDropdownTab(this);
            } else {
                switchTab(this);
            }
        });

        // Keyboard navigation
        tab.addEventListener('keydown', function(e) {
            let targetTab = null;

            switch(e.key) {
                case 'ArrowRight':
                case 'ArrowDown':
                    e.preventDefault();
                    // Move to next tab, wrap around if at end
                    const nextTab = this.nextElementSibling || tabs[0];
                    targetTab = nextTab;
                    break;
                case 'ArrowLeft':
                case 'ArrowUp':
                    e.preventDefault();
                    // Move to previous tab, wrap around if at start
                    const prevTab = this.previousElementSibling || tabs[tabs.length - 1];
                    targetTab = prevTab;
                    break;
                case 'Home':
                    e.preventDefault();
                    targetTab = tabs[0];
                    break;
                case 'End':
                    e.preventDefault();
                    targetTab = tabs[tabs.length - 1];
                    break;
                case 'Enter':
                case ' ':
                    e.preventDefault();
                    if (useDropdown) {
                        switchDropdownTab(this);
                    } else {
                        switchTab(this);
                    }
                    return;
            }

            if (targetTab) {
                targetTab.focus();
            }
        });
    });

    function switchTab(selectedTab) {
        const targetTab = selectedTab.getAttribute('data-tab');

        // Update ARIA states and visual states for all tabs
        tabs.forEach(t => {
            t.classList.remove('active');
            t.setAttribute('aria-selected', 'false');
        });

        // Update ARIA states and visual states for selected tab
        selectedTab.classList.add('active');
        selectedTab.setAttribute('aria-selected', 'true');

        // Hide all tab panels and remove active class
        tabContents.forEach(content => {
            content.classList.remove('active');
            content.setAttribute('hidden', '');
        });

        // Show corresponding tab panel
        const targetContent = document.getElementById('tab-' + targetTab);
        if (targetContent) {
            targetContent.classList.add('active');
            targetContent.removeAttribute('hidden');

            // Set focus to the tab panel for screen readers
            targetContent.focus();

            // Re-trigger animations for cards in the new tab
            const cards = targetContent.querySelectorAll('.menu-card');
            cards.forEach((card, index) => {
                card.style.animation = 'none';
                card.offsetHeight; // Trigger reflow
                card.style.animation = `fadeInScale 0.5s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.05}s forwards`;
            });
        }

        // Smooth scroll to menu section if needed
        const menuSection = document.getElementById('menu');
        if (menuSection) {
            const rect = menuSection.getBoundingClientRect();
            if (rect.top < 0 || rect.top > window.innerHeight * 0.3) {
                menuSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }

    function switchDropdownTab(selectedItem) {
        const targetCategory = selectedItem.getAttribute('data-category');

        // Update button text
        if (currentCategorySpan) {
            currentCategorySpan.textContent = selectedItem.textContent.trim();
        }

        // Update ARIA states and visual states for all dropdown items
        tabs.forEach(t => {
            t.classList.remove('active');
            t.setAttribute('aria-selected', 'false');
        });

        // Update ARIA states and visual states for selected item
        selectedItem.classList.add('active');
        selectedItem.setAttribute('aria-selected', 'true');

        // Close dropdown
        if (dropdownToggle) {
            dropdownToggle.setAttribute('aria-expanded', 'false');
        }

        const dropdownPanel = document.getElementById('menu-dropdown-panel');
        if (dropdownPanel) {
            dropdownPanel.setAttribute('aria-hidden', 'true');
        }

        // Hide all tab panels and remove active class
        tabContents.forEach(content => {
            content.classList.remove('active');
            content.setAttribute('hidden', '');
        });

        // Show corresponding tab panel
        const targetContent = document.getElementById('tab-' + targetCategory);
        if (targetContent) {
            targetContent.classList.add('active');
            targetContent.removeAttribute('hidden');

            // Re-trigger animations for cards in the new tab
            const cards = targetContent.querySelectorAll('.menu-card');
            cards.forEach((card, index) => {
                card.style.animation = 'none';
                card.offsetHeight; // Trigger reflow
                card.style.animation = `fadeInScale 0.5s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.05}s forwards`;
            });
        }

        // Smooth scroll to menu section if needed
        const menuSection = document.getElementById('menu');
        if (menuSection) {
            const rect = menuSection.getBoundingClientRect();
            if (rect.top < 0 || rect.top > window.innerHeight * 0.3) {
                menuSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }

    console.log('Menu tabs initialized with focus management');
}
