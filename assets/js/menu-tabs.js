/**
 * Menu Tabs Functionality
 * Handles tab switching for the menu section
 */

document.addEventListener('DOMContentLoaded', function() {
    initMenuTabs();
});

function initMenuTabs() {
    const tabs = document.querySelectorAll('.menu-tab');
    const tabContents = document.querySelectorAll('.menu-tab-content');

    if (tabs.length === 0) {
        return;
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');

            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));

            // Remove active class from all content
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked tab
            this.classList.add('active');

            // Show corresponding content
            const targetContent = document.getElementById('tab-' + targetTab);
            if (targetContent) {
                targetContent.classList.add('active');

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
        });
    });

    console.log('Menu tabs initialized');
}
