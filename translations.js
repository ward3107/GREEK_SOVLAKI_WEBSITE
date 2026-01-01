const translations = {
    he: {
        // Navigation
        'logo': '×¡×•×‘×œ××§×™ ×™×•×•× ×™',
        'nav-home': '×‘×™×ª',
        'nav-menu': '×ª×¤×¨×™×˜',
        'nav-about': '××•×“×•×ª',
        'nav-gallery': '×’×œ×¨×™×”',
        'nav-contact': '×¦×•×¨ ×§×©×¨',

        // Hero Section
        'hero-title': '×¡×•×‘×œ××§×™ ×™×•×•× ×™ - ×›×¤×¨ ×™××¡×™×£',
        'hero-subtitle': '×˜×¢×ž×™× ×™×•×•× ×™×™× ××•×ª× ×˜×™×™× ×‘×œ×‘ ×›×¤×¨ ×™××¡×™×£',
        'hero-description': '×—×•×•×™×” ×§×•×œ×™× ×¨×™×ª ×™×•×•× ×™×ª ××ž×™×ª×™×ª ×¢× ×ž×ª×›×•× ×™× ×ž×¡×•×¨×ª×™×™×, ×—×•×ž×¨×™ ×’×œ× ×˜×¨×™×™× ×•××•×•×™×¨×” ×™× ×ª×™×›×•× ×™×ª ×—×ž×”',
        'view-menu': '×¦×¤×” ×‘×ª×¤×¨×™×˜',
        'call-reservations': '×”×ª×§×©×¨ ×œ×”×–×ž× ×•×ª',

        // Menu Section
        'menu-title': '×”×ª×¤×¨×™×˜ ×©×œ× ×•',
        'menu-subtitle': '×ž×‘×—×¨ ×¢×©×™×¨ ×©×œ ×ž× ×•×ª ×™×•×•× ×™×•×ª ×ž×¡×•×¨×ª×™×•×ª',

        // Category Titles
        'cat-pita-title': '×¡×•×‘×œ××§×™ ×‘×¤×™×ª×”',
        'cat-plates-title': '×¦×œ×—×•×ª ×¡×•×‘×œ××§×™',
        'cat-platters-title': '×ž×’×©×™ ×‘×©×¨×™×',
        'cat-pizza-title': '×¤×™×¦×” ×’×™×¨×•×¡',
        'cat-salad-title': '×¡×œ×˜×™×',
        'cat-drinks-title': '×ž×©×§××•×ª',
        'cat-alcohol-title': '××œ×›×•×”×•×œ',
        'cat-sides-title': '×ª×•×¡×¤×•×ª',

        // Souvlaki in Pita
        'item-pita-chicken': 'Souvlaki Peta Chicken',
        'desc-pita-chicken': '×¤×™×ª×” ×™×•×•× ×™×ª, ×©×™×¤×•×“ ×¢×•×£, ×¨×•×˜×‘ ×¦×–×™×§×™/×—×¨×™×£, ×›×¨×•×‘, ×‘×¦×œ, ×¢×’×‘× ×™×™×”, ×—×¡×”, ×¦\'×™×¤×¡',
        'item-pita-pork': 'Souvlaki Peta Pork',
        'desc-pita-pork': '×¤×™×ª×” ×™×•×•× ×™×ª, ×©×™×¤×•×“ ×œ×‘×Ÿ, ×¨×•×˜×‘ ×¦×–×™×§×™/×—×¨×™×£, ×›×¨×•×‘, ×‘×¦×œ, ×¢×’×‘× ×™×™×”, ×—×¡×”, ×¦\'×™×¤×¡',
        'item-pita-gyros': 'Souvlaki Peta Pork Gyros',
        'desc-pita-gyros': '×¤×™×ª×” ×™×•×•× ×™×ª, ×’×™×¨×•×¡ ×œ×‘×Ÿ (×©×•×•××¨×ž×”), ×¨×•×˜×‘ ×¦×–×™×§×™/×—×¨×™×£, ×›×¨×•×‘, ×‘×¦×œ, ×¢×’×‘× ×™×™×”, ×—×¡×”, ×¦\'×™×¤×¡',
        'item-pita-kebab': 'Souvlaki Peta Kebab',
        'desc-pita-kebab': '×¤×™×ª×” ×™×•×•× ×™×ª, ×§×‘×‘ ×¨×’×œ ×˜×œ×”, ×¨×•×˜×‘ ×¦×–×™×§×™/×—×¨×™×£, ×›×¨×•×‘, ×‘×¦×œ, ×¢×’×‘× ×™×™×”, ×—×¡×”, ×¦\'×™×¤×¡',
        'item-pita-sausage': 'Souvlaki Peta Sausage',
        'desc-pita-sausage': '×¤×™×ª×” ×™×•×•× ×™×ª, × ×§× ×™×§×™×•×ª, ×¨×•×˜×‘ ×¦×–×™×§×™/×—×¨×™×£, ×›×¨×•×‘, ×‘×¦×œ, ×¢×’×‘× ×™×™×”, ×—×¡×”, ×¦\'×™×¤×¡',
        'item-pita-vegan': 'Souvlaki Peta Vegan',
        'desc-pita-vegan': '×¤×™×ª×” ×™×•×•× ×™×ª, ×©×™×¤×•×“ ×˜×‘×¢×•× ×™, ×¨×•×˜×‘ ×¦×–×™×§×™/×—×¨×™×£, ×›×¨×•×‘, ×‘×¦×œ, ×¢×’×‘× ×™×™×”, ×—×¡×”, ×¦\'×™×¤×¡',
        'item-pita-steak': 'Souvlaki Peta Pork Steak',
        'desc-pita-steak': '×¤×™×ª×” ×™×•×•× ×™×ª, ×¡×˜×™×™×§ ×œ×‘×Ÿ ×¡×™× ×˜×”, ×¨×•×˜×‘ ×¦×–×™×§×™/×—×¨×™×£, ×›×¨×•×‘, ×‘×¦×œ, ×¢×’×‘× ×™×™×”, ×—×¡×”, ×¦\'×™×¤×¡',
        'item-pita-glutenfree': 'Souvlaki Peta Gluten Free',
        'desc-pita-glutenfree': '×¤×™×ª×” ×œ×œ× ×’×œ×•×˜×Ÿ, ×©×™×¤×•×“ ×œ×‘×—×™×¨×”, ×¨×•×˜×‘ ×¦×–×™×§×™/×—×¨×™×£, ×›×¨×•×‘, ×‘×¦×œ, ×¢×’×‘× ×™×™×”, ×—×¡×”, ×¦\'×™×¤×¡',
        'item-double-skewer': 'Double Skewer',
        'desc-double-skewer': '×ª×•×¡×¤×ª ×©×™×¤×•×“ × ×•×¡×£',

        // Souvlaki Plates
        'item-plate-souvlaki': 'Souvlaki Plate',
        'desc-plate-souvlaki': '×©×™×¤×•×“×™× ×œ×‘×—×™×¨×”, ×¨×•×˜×‘ ×¦×–×™×§×™/×—×¨×™×£, ×›×¨×•×‘, ×‘×¦×œ, ×¢×’×‘× ×™×™×”, ×—×¡×”, ×¦\'×™×¤×¡',
        'item-plate-gyros': 'Souvlaki Plate Gyros',
        'desc-plate-gyros': '×©×•×•××¨×ž×” ×œ×‘×Ÿ, ×¨×•×˜×‘ ×¦×–×™×§×™/×—×¨×™×£, ×›×¨×•×‘, ×‘×¦×œ, ×¢×’×‘× ×™×™×”, ×—×¡×”, ×¦\'×™×¤×¡',

        // Meat Platters
        'item-platter-two': 'Meat Platter for Two',
        'desc-platter-two': '3 ×©×™×¤×•×“×™× (×œ×‘×Ÿ/×¢×•×£/×§×‘×‘), × ×§× ×™×§×”, ×¨×•×˜×‘ ×ž×™×•×—×“, 2 ×¡×˜×™×™×§ ×œ×‘×Ÿ ×¡×™× ×˜×”',
        'item-platter-four': 'Meat Platter for Four',
        'desc-platter-four': '6 ×©×™×¤×•×“×™×, ×©×•×•××¨×ž×” ×œ×‘×Ÿ, × ×§× ×™×§×”, ×¨×•×˜×‘ ×ž×™×•×—×“, 3 ×¡×˜×™×™×§ ×œ×‘×Ÿ ×¡×™× ×˜×”',

        // Pizza Gyros
        'item-pizza-small': 'Pizza Gyros (Small)',
        'desc-pizza-small': '×¤×™×¦×” ×¢× ×©×•×•××¨×ž×” ×œ×‘×Ÿ ×•×¦\'×™×¤×¡',
        'item-pizza-large': 'Pizza Gyros (Large)',
        'desc-pizza-large': '×¤×™×¦×” ×¢× ×©×•×•××¨×ž×” ×œ×‘×Ÿ ×•×¦\'×™×¤×¡',

        // Salad
        'item-greek-salad': 'Greek Salad',
        'desc-greek-salad': '×¢×’×‘× ×™×•×ª, ×ž×œ×¤×¤×•×Ÿ, ×¤×œ×¤×œ ×ž×—×•×§, ×‘×¦×œ, ×–×™×ª×™× ×©×—×•×¨×™× ×§×œ×ž×˜×”, ×’×‘×™× ×ª ×¤×˜×”',

        // Drinks
        'item-soft-drinks': 'Soft Drinks',
        'desc-soft-drinks': '×§×•×§×” ×§×•×œ×”, ×§×•×œ×” ×–×™×¨×•, ×¤× ×˜×”, ×¡×¤×¨×™×™×˜, ×¢× ×‘×™×',
        'item-water': 'Water',
        'desc-water': '×ž×™×',

        // Alcohol
        'item-beer': 'Drift Beer (1/3)',
        'desc-beer': '×‘×™×¨×” ×”×‘×™×ª',
        'item-wine-glass': 'Wine (Glass)',
        'desc-wine-glass': '×™×™×Ÿ ××“×•×/×œ×‘×Ÿ/×¨×•×–×”',
        'item-wine-bottle': 'Wine Bottle',
        'desc-wine-bottle': '×‘×§×‘×•×§ ×™×™×Ÿ',
        'item-whiskey': 'Whiskey',
        'desc-whiskey': '×•×•×™×¡×§×™',
        'item-ouzo': 'Ouzo Plomari',
        'desc-ouzo': '×‘×§×‘×•×§ ××•×–×• ×¤×œ×•×ž×¨×™ 200 ×ž"×œ',

        // Sides
        'item-fries': 'Fries Chips',
        'desc-fries': '×¦×œ×—×ª ×¦\'×™×¤×¡',

        // Contact Footer
        'contact-phones': '×˜×œ×¤×•×Ÿ: 04-8122980, 052-8921454, 054-2001235',
        'contact-instagram': '××™× ×¡×˜×’×¨×: @GREEK.SOUVLAKII',
        'contact-name': '×ž×¡×¢×“×ª GREEK SOUVLAKI',
        'contact-slogan': '××”×‘×ª×? ×ª×™×™×’×• ××•×ª× ×•!',

        // About Section
        'about-title': '××•×“×•×ª×™× ×•',
        'about-text': '×—×•×•×™×” ×§×•×œ×™× ×¨×™×ª ×™×•×•× ×™×ª ××ž×™×ª×™×ª ×‘×œ×‘ ×›×¤×¨ ×™××¡×™×£. ×× ×• ×ž×‘×™××™× ××ª ×”×˜×¢×ž×™× ×”××•×ª× ×˜×™×™× ×©×œ ×™×•×•×Ÿ ×¢× ×ž×ª×›×•× ×™× ×ž×¡×•×¨×ª×™×™× ×©×¢×•×‘×¨×™× ×‘×ž×©×¤×—×” ×ž×“×•×¨ ×œ×“×•×¨. ×”×ž×¡×¢×“×” ×©×œ× ×• ×ž×¦×™×¢×” ××•×•×™×¨×” ×—×ž×” ×•×ž×–×ž×™× ×”, ×©×™×¨×•×ª ×ž×¢×•×œ×” ×•×—×•×ž×¨×™ ×’×œ× ×˜×¨×™×™× ×•××™×›×•×ª×™×™×.',
        'quality-title': '×‘×©×¨×™× ××™×›×•×ª×™×™×',
        'quality-desc': '×‘×©×¨×™× ×˜×¨×™×™× ×•××™×›×•×ª×™×™× ×ž×¡×¤×§×™× ×ž×•×‘×—×¨×™×',
        'fresh-title': '×—×•×ž×¨×™ ×’×œ× ×˜×¨×™×™×',
        'fresh-desc': '×™×¨×§×•×ª ×•×ª×‘×œ×™× ×™× ×˜×¨×™×™× ×ž×“×™ ×™×•×',
        'chef-title': '×ž×ª×›×•× ×™× ×ž×¡×•×¨×ª×™×™×',
        'chef-desc': '×©×™×˜×•×ª ×‘×™×©×•×œ ×™×•×•× ×™×•×ª ××•×ª× ×˜×™×•×ª',
        'atmosphere-title': '××•×•×™×¨×” ×™×•×•× ×™×ª',
        'atmosphere-desc': '×¢×™×¦×•×‘ ×™× ×ª×™×›×•× ×™ ×•×ž×•×–×™×§×” ×™×•×•× ×™×ª',

        // Gallery Section
        'gallery-title': '×’×œ×¨×™×”',
        'gallery-subtitle': '×˜×¢×™×ž×” ×ž×”××•×•×™×¨×” ×•×”×ž× ×•×ª ×©×œ× ×•',

        // Contact Section
        'contact-title': '×¦×•×¨ ×§×©×¨',
        'reservation-title': '×”×–×ž× ×•×ª ×•×¤×¨×˜×™×',
        'reservation-text': '×œ×”×–×ž× ×ª ×ž×§×•×, ××™×¨×•×¢×™× ×ž×™×•×—×“×™× ××• ×¤×¨×˜×™× × ×•×¡×¤×™×',
        'call-now': '×”×ª×§×©×¨ ×¢×›×©×™×•',
        'whatsapp': 'WhatsApp',
        'location-title': '×ž×™×§×•×',
        'location-text': '×›×‘×™×© 70, ×›×¤×¨ ×™××¡×™×£',
        'get-directions': '×§×‘×œ ×”×•×¨××•×ª ×”×’×¢×”',
        'hours-title': '×©×¢×•×ª ×¤×ª×™×—×”',
        'hours-text': '×¨××©×•×Ÿ-×¨×‘×™×¢×™: ×¡×’×•×¨<br>×—×ž×™×©×™-×©×‘×ª: 13:00-01:00',
        'hours-closed': 'ראשון-רביעי: סגור',
        'hours-open': 'חמישי-שבת: 13:00-01:00',
        'hours-note': '×ž×•×ž×œ×¥ ×œ×”×–×ž×™×Ÿ ×ž×§×•× ×ž×¨××©',
        'events-title': '××™×¨×•×¢×™×',
        'events-text': '×× ×• ×ž××¨×—×™× ××™×¨×•×¢×™× ×¤×¨×˜×™×™× ×•×§×‘×•×¦×ª×™×™×',
        'events-contact': '×œ×™×•×¢×¥ ××™×¨×•×¢×™×: 052-8921454',
        'social-title': '×¢×§×‘×• ××—×¨×™× ×•',
        'phone-text': '052-8921454 / 04-8122980',

        // Footer
        'footer': 'Â© 2024 ×¡×•×‘×œ××§×™ ×™×•×•× ×™ - ×ž×¡×¢×“×” ×™×•×•× ×™×ª ××•×ª× ×˜×™×ª ×‘×›×¤×¨ ×™××¡×™×£'
    },

    en: {
        // Navigation
        'logo': 'Greek Souvlaki',
        'nav-home': 'Home',
        'nav-menu': 'Menu',
        'nav-about': 'About',
        'nav-gallery': 'Gallery',
        'nav-contact': 'Contact',

        // Hero Section
        'hero-title': 'Greek Souvlaki - Kafr Yasif',
        'hero-subtitle': 'Authentic Greek Flavors in the Heart of Kafr Yasif',
        'hero-description': 'A genuine Greek culinary experience with traditional recipes, fresh ingredients and warm Mediterranean atmosphere',
        'view-menu': 'View Menu',
        'call-reservations': 'Call for Reservations',

        // Menu Section
        'menu-title': 'Our Menu',
        'menu-subtitle': 'Rich selection of traditional Greek dishes',

        // Category Titles
        'cat-pita-title': 'Souvlaki in Pita',
        'cat-plates-title': 'Souvlaki Plates',
        'cat-platters-title': 'Meat Platters',
        'cat-pizza-title': 'Pizza Gyros',
        'cat-salad-title': 'Salads',
        'cat-drinks-title': 'Drinks',
        'cat-alcohol-title': 'Alcohol',
        'cat-sides-title': 'Sides',

        // Souvlaki in Pita
        'item-pita-chicken': 'Souvlaki Peta Chicken',
        'desc-pita-chicken': 'Greek pita, chicken skewer, tzatziki/spicy sauce, cabbage, onion, tomato, lettuce, fries',
        'item-pita-pork': 'Souvlaki Peta Pork',
        'desc-pita-pork': 'Greek pita, pork skewer, tzatziki/spicy sauce, cabbage, onion, tomato, lettuce, fries',
        'item-pita-gyros': 'Souvlaki Peta Pork Gyros',
        'desc-pita-gyros': 'Greek pita, pork gyros (shawarma), tzatziki/spicy sauce, cabbage, onion, tomato, lettuce, fries',
        'item-pita-kebab': 'Souvlaki Peta Kebab',
        'desc-pita-kebab': 'Greek pita, lamb leg kebab, tzatziki/spicy sauce, cabbage, onion, tomato, lettuce, fries',
        'item-pita-sausage': 'Souvlaki Peta Sausage',
        'desc-pita-sausage': 'Greek pita, sausages, tzatziki/spicy sauce, cabbage, onion, tomato, lettuce, fries',
        'item-pita-vegan': 'Souvlaki Peta Vegan',
        'desc-pita-vegan': 'Greek pita, vegan skewer, tzatziki/spicy sauce, cabbage, onion, tomato, lettuce, fries',
        'item-pita-steak': 'Souvlaki Peta Pork Steak',
        'desc-pita-steak': 'Greek pita, pork steak sinta, tzatziki/spicy sauce, cabbage, onion, tomato, lettuce, fries',
        'item-pita-glutenfree': 'Souvlaki Peta Gluten Free',
        'desc-pita-glutenfree': 'Gluten-free pita, choice of skewer, tzatziki/spicy sauce, cabbage, onion, tomato, lettuce, fries',
        'item-double-skewer': 'Double Skewer',
        'desc-double-skewer': 'Extra skewer addition',

        // Souvlaki Plates
        'item-plate-souvlaki': 'Souvlaki Plate',
        'desc-plate-souvlaki': 'Choice of skewers, tzatziki/spicy sauce, cabbage, onion, tomato, lettuce, fries',
        'item-plate-gyros': 'Souvlaki Plate Gyros',
        'desc-plate-gyros': 'Pork shawarma, tzatziki/spicy sauce, cabbage, onion, tomato, lettuce, fries',

        // Meat Platters
        'item-platter-two': 'Meat Platter for Two',
        'desc-platter-two': '3 skewers (pork/chicken/kebab), sausage, special sauce, 2 pork steak sinta',
        'item-platter-four': 'Meat Platter for Four',
        'desc-platter-four': '6 skewers, pork shawarma, sausage, special sauce, 3 pork steak sinta',

        // Pizza Gyros
        'item-pizza-small': 'Pizza Gyros (Small)',
        'desc-pizza-small': 'Pizza with pork shawarma and fries',
        'item-pizza-large': 'Pizza Gyros (Large)',
        'desc-pizza-large': 'Pizza with pork shawarma and fries',

        // Salad
        'item-greek-salad': 'Greek Salad',
        'desc-greek-salad': 'Tomatoes, cucumber, chopped pepper, onion, Kalamata black olives, feta cheese',

        // Drinks
        'item-soft-drinks': 'Soft Drinks',
        'desc-soft-drinks': 'Coca Cola, Cola Zero, Fanta, Sprite, Grapes',
        'item-water': 'Water',
        'desc-water': 'Water',

        // Alcohol
        'item-beer': 'Drift Beer (1/3)',
        'desc-beer': 'House beer',
        'item-wine-glass': 'Wine (Glass)',
        'desc-wine-glass': 'Red/white/rosÃ© wine',
        'item-wine-bottle': 'Wine Bottle',
        'desc-wine-bottle': 'Bottle of wine',
        'item-whiskey': 'Whiskey',
        'desc-whiskey': 'Whiskey',
        'item-ouzo': 'Ouzo Plomari',
        'desc-ouzo': 'Ouzo Plomari bottle 200ml',

        // Sides
        'item-fries': 'Fries Chips',
        'desc-fries': 'Plate of fries',

        // Contact Footer
        'contact-phones': 'Phone: 04-8122980, 052-8921454, 054-2001235',
        'contact-instagram': 'Instagram: @GREEK.SOUVLAKII',
        'contact-name': 'GREEK SOUVLAKI Restaurant',
        'contact-slogan': 'Enjoyed it? Tag us!',

        // About Section
        'about-title': 'About Us',
        'about-text': 'A genuine Greek culinary experience in the heart of Kafr Yasif. We bring authentic Greek flavors with traditional family recipes passed down through generations. Our restaurant offers a warm and inviting atmosphere, excellent service and fresh quality ingredients.',
        'quality-title': 'Quality Meats',
        'quality-desc': 'Fresh quality meats from premium suppliers',
        'fresh-title': 'Fresh Ingredients',
        'fresh-desc': 'Daily fresh vegetables and herbs',
        'chef-title': 'Traditional Recipes',
        'chef-desc': 'Authentic Greek cooking methods',
        'atmosphere-title': 'Greek Atmosphere',
        'atmosphere-desc': 'Mediterranean design and Greek music',

        // Gallery Section
        'gallery-title': 'Gallery',
        'gallery-subtitle': 'A taste of our atmosphere and dishes',

        // Contact Section
        'contact-title': 'Contact Us',
        'reservation-title': 'Reservations & Information',
        'reservation-text': 'For reservations, special events or more information',
        'call-now': 'Call Now',
        'whatsapp': 'WhatsApp',
        'location-title': 'Location',
        'location-text': 'Route 70, Kafr Yasif',
        'get-directions': 'Get Directions',
        'hours-title': 'Opening Hours',
        'hours-text': 'Sun-Wed: Closed | Thu-Sat: 1:00pm-1:00am',
        'hours-closed': 'Sun-Wed: Closed',
        'hours-open': 'Thu-Sat: 1:00pm-1:00am',
        'hours-note': 'Advance reservations recommended',
        'events-title': 'Events',
        'events-text': 'We host private and group events',
        'events-contact': 'Event consultant: 052-8921454',
        'social-title': 'Follow Us',
        'phone-text': '052-8921454 / 04-8122980',

        // Footer
        'footer': 'Â© 2024 Greek Souvlaki - Authentic Greek Restaurant in Kafr Yasif'
    },

    ar: {
        // Navigation
        'logo': 'Ø³ÙˆÙÙ„Ø§ÙƒÙŠ ÙŠÙˆÙ†Ø§Ù†ÙŠ',
        'nav-home': 'Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ©',
        'nav-menu': 'Ø§Ù„Ù‚Ø§Ø¦Ù…Ø©',
        'nav-about': 'Ù…Ù† Ù†Ø­Ù†',
        'nav-gallery': 'Ù…Ø¹Ø±Ø¶ Ø§Ù„ØµÙˆØ±',
        'nav-contact': 'Ø§ØªØµÙ„ Ø¨Ù†Ø§',

        // Hero Section
        'hero-title': 'Ø³ÙˆÙÙ„Ø§ÙƒÙŠ ÙŠÙˆÙ†Ø§Ù†ÙŠ - ÙƒÙØ± ÙŠØ§Ø³ÙŠÙ',
        'hero-subtitle': 'Ù†ÙƒÙ‡Ø§Øª ÙŠÙˆÙ†Ø§Ù†ÙŠØ© Ø£ØµÙŠÙ„Ø© ÙÙŠ Ù‚Ù„Ø¨ ÙƒÙØ± ÙŠØ§Ø³ÙŠÙ',
        'hero-description': 'ØªØ¬Ø±Ø¨Ø© Ø·Ù‡ÙŠ ÙŠÙˆÙ†Ø§Ù†ÙŠØ© Ø­Ù‚ÙŠÙ‚ÙŠØ© Ù…Ø¹ ÙˆØµÙØ§Øª ØªÙ‚Ù„ÙŠØ¯ÙŠØ© ÙˆÙ…ÙƒÙˆÙ†Ø§Øª Ø·Ø§Ø²Ø¬Ø© ÙˆØ£Ø¬ÙˆØ§Ø¡ Ø§Ù„Ø¨Ø­Ø± Ø§Ù„Ø£Ø¨ÙŠØ¶ Ø§Ù„Ù…ØªÙˆØ³Ø· Ø§Ù„Ø¯Ø§ÙØ¦Ø©',
        'view-menu': 'Ø¹Ø±Ø¶ Ø§Ù„Ù‚Ø§Ø¦Ù…Ø©',
        'call-reservations': 'Ø§ØªØµÙ„ Ù„Ù„Ø­Ø¬Ø²',

        // Menu Section
        'menu-title': 'Ù‚Ø§Ø¦Ù…ØªÙ†Ø§',
        'menu-subtitle': 'Ù…Ø¬Ù…ÙˆØ¹Ø© ØºÙ†ÙŠØ© Ù…Ù† Ø§Ù„Ø£Ø·Ø¨Ø§Ù‚ Ø§Ù„ÙŠÙˆÙ†Ø§Ù†ÙŠØ© Ø§Ù„ØªÙ‚Ù„ÙŠØ¯ÙŠØ©',

        // Category Titles
        'cat-pita-title': 'Ø³ÙˆÙÙ„Ø§ÙƒÙŠ ÙÙŠ Ø¨ÙŠØªØ§',
        'cat-plates-title': 'Ø£Ø·Ø¨Ø§Ù‚ Ø³ÙˆÙÙ„Ø§ÙƒÙŠ',
        'cat-platters-title': 'Ø£Ø·Ø¨Ø§Ù‚ Ø§Ù„Ù„Ø­ÙˆÙ…',
        'cat-pizza-title': 'Ø¨ÙŠØªØ²Ø§ Ø¬ÙŠØ±ÙˆØ³',
        'cat-salad-title': 'Ø§Ù„Ø³Ù„Ø·Ø§Øª',
        'cat-drinks-title': 'Ø§Ù„Ù…Ø´Ø±ÙˆØ¨Ø§Øª',
        'cat-alcohol-title': 'Ø§Ù„ÙƒØ­ÙˆÙ„',
        'cat-sides-title': 'Ø§Ù„Ø¥Ø¶Ø§ÙØ§Øª',

        // Contact Footer
        'contact-phones': 'Ø§Ù„Ù‡Ø§ØªÙ: 04-8122980, 052-8921454, 054-2001235',
        'contact-instagram': 'Ø¥Ù†Ø³ØªØºØ±Ø§Ù…: @GREEK.SOUVLAKII',
        'contact-name': 'Ù…Ø·Ø¹Ù… GREEK SOUVLAKI',
        'contact-slogan': 'Ø£Ø¹Ø¬Ø¨ÙƒÙ…ØŸ Ø¶Ø¹ÙˆØ§ Ø¹Ù„Ø§Ù…Ø© Ù„Ù†Ø§!',

        // Main Dishes
        'souvlaki-chicken': 'Ø³ÙˆÙÙ„Ø§ÙƒÙŠ Ø¯Ø¬Ø§Ø¬',
        'souvlaki-chicken-desc': 'Ø£Ø³ÙŠØ§Ø® Ø¯Ø¬Ø§Ø¬ Ù…ØªØ¨Ù„ ÙŠÙˆÙ†Ø§Ù†ÙŠØŒ Ø®Ø¶Ø±ÙˆØ§Øª Ø·Ø§Ø²Ø¬Ø©ØŒ Ø¨Ø·Ø§Ø·Ø³ ÙˆØ®Ø¨Ø² Ø¨ÙŠØªØ§',
        'souvlaki-pork': 'Ø³ÙˆÙÙ„Ø§ÙƒÙŠ Ù„Ø­Ù… Ø®Ù†Ø²ÙŠØ±',
        'souvlaki-pork-desc': 'Ø£Ø³ÙŠØ§Ø® Ù„Ø­Ù… Ø®Ù†Ø²ÙŠØ± ØªÙ‚Ù„ÙŠØ¯ÙŠØ© Ù…Ø¹ Ø§Ù„ØªÙˆØ§Ø¨Ù„ Ø§Ù„ÙŠÙˆÙ†Ø§Ù†ÙŠØ©',
        'gyros': 'Ø¬ÙŠØ±ÙˆØ³',
        'gyros-desc': 'Ø¬ÙŠØ±ÙˆØ³ Ø£ØµÙŠÙ„ Ù…Ø¹ ØªØ²Ø§ØªØ²ÙŠÙƒÙŠØŒ Ø®Ø¶Ø±ÙˆØ§Øª Ø·Ø§Ø²Ø¬Ø© ÙˆØ¨Ø·Ø§Ø·Ø³',
        'mix-grill': 'Ù…Ø´Ø§ÙˆÙŠ ÙŠÙˆÙ†Ø§Ù†ÙŠØ© Ù…Ø´ÙƒÙ„Ø©',
        'mix-grill-desc': 'ØªØ´ÙƒÙŠÙ„Ø© Ù…Ù† Ø§Ù„Ù„Ø­ÙˆÙ… Ø§Ù„Ù…Ø´ÙˆÙŠØ© Ù…Ø¹ Ø§Ù„Ø£Ø·Ø¨Ø§Ù‚ Ø§Ù„Ø¬Ø§Ù†Ø¨ÙŠØ©',

        // Appetizers
        'tzatziki': 'ØªØ²Ø§ØªØ²ÙŠÙƒÙŠ',
        'tzatziki-desc': 'ØµÙ„ØµØ© Ø§Ù„Ø²Ø¨Ø§Ø¯ÙŠ Ø§Ù„ÙŠÙˆÙ†Ø§Ù†ÙŠØ© Ø§Ù„ÙƒÙ„Ø§Ø³ÙŠÙƒÙŠØ© Ù…Ø¹ Ø§Ù„Ø®ÙŠØ§Ø± ÙˆØ§Ù„Ø«ÙˆÙ…',
        'dolmades': 'Ø¯ÙˆÙ„Ù…Ø§Ø¯ÙŠØ³',
        'dolmades-desc': 'ÙˆØ±Ù‚ Ø¹Ù†Ø¨ Ù…Ø­Ø´Ùˆ Ø¨Ø§Ù„Ø£Ø±Ø² ÙˆØ§Ù„Ø£Ø¹Ø´Ø§Ø¨',
        'feta-olives': 'ÙÙŠØªØ§ ÙˆØ²ÙŠØªÙˆÙ†',
        'feta-olives-desc': 'Ø¬Ø¨Ù†Ø© ÙÙŠØªØ§ Ù…Ù…ØªØ§Ø²Ø© Ù…Ø¹ Ø²ÙŠØªÙˆÙ† ÙƒØ§Ù„Ø§Ù…Ø§ØªØ§',

        // Salads
        'greek-salad': 'Ø³Ù„Ø·Ø© Ø§Ù„Ù‚Ø±ÙŠØ© Ø§Ù„ÙŠÙˆÙ†Ø§Ù†ÙŠØ©',
        'greek-salad-desc': 'Ø·Ù…Ø§Ø·Ù…ØŒ Ø®ÙŠØ§Ø±ØŒ ÙÙŠØªØ§ØŒ Ø²ÙŠØªÙˆÙ† ÙˆØ²ÙŠØª Ø§Ù„Ø²ÙŠØªÙˆÙ†',
        'season-salad': 'Ø³Ù„Ø·Ø© Ø§Ù„Ù…ÙˆØ³Ù…',
        'season-salad-desc': 'Ø®Ø¶Ø±ÙˆØ§Øª Ù…ÙˆØ³Ù…ÙŠØ© Ø·Ø§Ø²Ø¬Ø©',

        // Beverages
        'ouzo': 'Ø£ÙˆØ²Ùˆ',
        'ouzo-desc': 'Ù…Ø´Ø±ÙˆØ¨ ÙŠÙˆÙ†Ø§Ù†ÙŠ ØªÙ‚Ù„ÙŠØ¯ÙŠ',
        'greek-beer': 'Ø¨ÙŠØ±Ø© ÙŠÙˆÙ†Ø§Ù†ÙŠØ©',
        'greek-beer-desc': 'ØªØ´ÙƒÙŠÙ„Ø© Ù…Ù† Ø§Ù„Ø¨ÙŠØ±Ø© Ø§Ù„ÙŠÙˆÙ†Ø§Ù†ÙŠØ©',

        // About Section
        'about-title': 'Ù…Ù† Ù†Ø­Ù†',
        'about-text': 'ØªØ¬Ø±Ø¨Ø© Ø·Ù‡ÙŠ ÙŠÙˆÙ†Ø§Ù†ÙŠØ© Ø­Ù‚ÙŠÙ‚ÙŠØ© ÙÙŠ Ù‚Ù„Ø¨ ÙƒÙØ± ÙŠØ§Ø³ÙŠÙ. Ù†Ù‚Ø¯Ù… Ø§Ù„Ù†ÙƒÙ‡Ø§Øª Ø§Ù„ÙŠÙˆÙ†Ø§Ù†ÙŠØ© Ø§Ù„Ø£ØµÙŠÙ„Ø© Ù…Ø¹ ÙˆØµÙØ§Øª Ø¹Ø§Ø¦Ù„ÙŠØ© ØªÙ‚Ù„ÙŠØ¯ÙŠØ© ØªÙ†ØªÙ‚Ù„ Ø¹Ø¨Ø± Ø§Ù„Ø£Ø¬ÙŠØ§Ù„. ÙŠÙˆÙØ± Ù…Ø·Ø¹Ù…Ù†Ø§ Ø£Ø¬ÙˆØ§Ø¡ Ø¯Ø§ÙØ¦Ø© ÙˆÙ…Ø±Ø­Ø¨Ø© ÙˆØ®Ø¯Ù…Ø© Ù…Ù…ØªØ§Ø²Ø© ÙˆÙ…ÙƒÙˆÙ†Ø§Øª Ø·Ø§Ø²Ø¬Ø© ÙˆØ¹Ø§Ù„ÙŠØ© Ø§Ù„Ø¬ÙˆØ¯Ø©.',
        'quality-title': 'Ù„Ø­ÙˆÙ… Ø¹Ø§Ù„ÙŠØ© Ø§Ù„Ø¬ÙˆØ¯Ø©',
        'quality-desc': 'Ù„Ø­ÙˆÙ… Ø·Ø§Ø²Ø¬Ø© ÙˆØ¹Ø§Ù„ÙŠØ© Ø§Ù„Ø¬ÙˆØ¯Ø© Ù…Ù† Ù…ÙˆØ±Ø¯ÙŠÙ† Ù…ØªÙ…ÙŠØ²ÙŠÙ†',
        'fresh-title': 'Ù…ÙƒÙˆÙ†Ø§Øª Ø·Ø§Ø²Ø¬Ø©',
        'fresh-desc': 'Ø®Ø¶Ø±ÙˆØ§Øª ÙˆØ£Ø¹Ø´Ø§Ø¨ Ø·Ø§Ø²Ø¬Ø© ÙŠÙˆÙ…ÙŠØ§Ù‹',
        'chef-title': 'ÙˆØµÙØ§Øª ØªÙ‚Ù„ÙŠØ¯ÙŠØ©',
        'chef-desc': 'Ø·Ø±Ù‚ Ø·Ù‡ÙŠ ÙŠÙˆÙ†Ø§Ù†ÙŠØ© Ø£ØµÙŠÙ„Ø©',
        'atmosphere-title': 'Ø£Ø¬ÙˆØ§Ø¡ ÙŠÙˆÙ†Ø§Ù†ÙŠØ©',
        'atmosphere-desc': 'ØªØµÙ…ÙŠÙ… Ù…ØªÙˆØ³Ø·ÙŠ ÙˆÙ…ÙˆØ³ÙŠÙ‚Ù‰ ÙŠÙˆÙ†Ø§Ù†ÙŠØ©',

        // Gallery Section
        'gallery-title': 'Ù…Ø¹Ø±Ø¶ Ø§Ù„ØµÙˆØ±',
        'gallery-subtitle': 'Ù„Ù…Ø­Ø© Ù…Ù† Ø£Ø¬ÙˆØ§Ø¦Ù†Ø§ ÙˆØ£Ø·Ø¨Ø§Ù‚Ù†Ø§',

        // Contact Section
        'contact-title': 'Ø§ØªØµÙ„ Ø¨Ù†Ø§',
        'reservation-title': 'Ø§Ù„Ø­Ø¬ÙˆØ²Ø§Øª ÙˆØ§Ù„Ù…Ø¹Ù„ÙˆÙ…Ø§Øª',
        'reservation-text': 'Ù„Ù„Ø­Ø¬Ø²ØŒ Ø§Ù„Ù…Ù†Ø§Ø³Ø¨Ø§Øª Ø§Ù„Ø®Ø§ØµØ© Ø£Ùˆ Ù„Ù…Ø²ÙŠØ¯ Ù…Ù† Ø§Ù„Ù…Ø¹Ù„ÙˆÙ…Ø§Øª',
        'call-now': 'Ø§ØªØµÙ„ Ø§Ù„Ø¢Ù†',
        'whatsapp': 'ÙˆØ§ØªØ³Ø§Ø¨',
        'location-title': 'Ø§Ù„Ù…ÙˆÙ‚Ø¹',
        'location-text': 'Ø´Ø§Ø±Ø¹ 70ØŒ ÙƒÙØ± ÙŠØ§Ø³ÙŠÙ',
        'get-directions': 'Ø§Ø­ØµÙ„ Ø¹Ù„Ù‰ Ø§Ù„Ø§ØªØ¬Ø§Ù‡Ø§Øª',
        'hours-title': 'Ø³Ø§Ø¹Ø§Øª Ø§Ù„Ø¹Ù…Ù„',
        'hours-text': 'Ø§Ù„Ø£Ø­Ø¯-Ø§Ù„Ø£Ø±Ø¨Ø¹Ø§Ø¡: Ù…ØºÙ„Ù‚<br>Ø§Ù„Ø®Ù…ÙŠØ³-Ø§Ù„Ø³Ø¨Øª: 13:00-01:00',
        'hours-closed': 'الأحد-الأربعاء: مغلق',
        'hours-open': 'الخميس-السبت: 13:00-01:00',
        'hours-note': 'ÙŠÙÙ†ØµØ­ Ø¨Ø§Ù„Ø­Ø¬Ø² Ø§Ù„Ù…Ø³Ø¨Ù‚',
        'events-title': 'Ø§Ù„Ù…Ù†Ø§Ø³Ø¨Ø§Øª',
        'events-text': 'Ù†Ø³ØªØ¶ÙŠÙ Ø§Ù„Ù…Ù†Ø§Ø³Ø¨Ø§Øª Ø§Ù„Ø®Ø§ØµØ© ÙˆØ§Ù„Ø¬Ù…Ø§Ø¹ÙŠØ©',
        'events-contact': 'Ù…Ø³ØªØ´Ø§Ø± Ø§Ù„Ù…Ù†Ø§Ø³Ø¨Ø§Øª: 052-8921454',
        'social-title': 'ØªØ§Ø¨Ø¹ÙˆÙ†Ø§',
        'phone-text': '052-8921454 / 04-8122980',

        // Footer
        'footer': 'Â© 2024 Ø³ÙˆÙÙ„Ø§ÙƒÙŠ ÙŠÙˆÙ†Ø§Ù†ÙŠ - Ù…Ø·Ø¹Ù… ÙŠÙˆÙ†Ø§Ù†ÙŠ Ø£ØµÙŠÙ„ ÙÙŠ ÙƒÙØ± ÙŠØ§Ø³ÙŠÙ'
    },

    ru: {
        // Navigation
        'logo': 'Ð“Ñ€ÐµÑ‡ÐµÑÐºÐ¸Ð¹ Ð¡ÑƒÐ²Ð»Ð°ÐºÐ¸',
        'nav-home': 'Ð“Ð»Ð°Ð²Ð½Ð°Ñ',
        'nav-menu': 'ÐœÐµÐ½ÑŽ',
        'nav-about': 'Ðž Ð½Ð°Ñ',
        'nav-gallery': 'Ð“Ð°Ð»ÐµÑ€ÐµÑ',
        'nav-contact': 'ÐšÐ¾Ð½Ñ‚Ð°ÐºÑ‚Ñ‹',

        // Hero Section
        'hero-title': 'Ð“Ñ€ÐµÑ‡ÐµÑÐºÐ¸Ð¹ Ð¡ÑƒÐ²Ð»Ð°ÐºÐ¸ - ÐšÑ„Ð°Ñ€ Ð¯ÑÐ¸Ñ„',
        'hero-subtitle': 'ÐÑƒÑ‚ÐµÐ½Ñ‚Ð¸Ñ‡Ð½Ñ‹Ðµ Ð³Ñ€ÐµÑ‡ÐµÑÐºÐ¸Ðµ Ð²ÐºÑƒÑÑ‹ Ð² ÑÐµÑ€Ð´Ñ†Ðµ ÐšÑ„Ð°Ñ€ Ð¯ÑÐ¸Ñ„Ð°',
        'hero-description': 'ÐÐ°ÑÑ‚Ð¾ÑÑ‰Ð¸Ð¹ Ð³Ñ€ÐµÑ‡ÐµÑÐºÐ¸Ð¹ ÐºÑƒÐ»Ð¸Ð½Ð°Ñ€Ð½Ñ‹Ð¹ Ð¾Ð¿Ñ‹Ñ‚ Ñ Ñ‚Ñ€Ð°Ð´Ð¸Ñ†Ð¸Ð¾Ð½Ð½Ñ‹Ð¼Ð¸ Ñ€ÐµÑ†ÐµÐ¿Ñ‚Ð°Ð¼Ð¸, ÑÐ²ÐµÐ¶Ð¸Ð¼Ð¸ Ð¸Ð½Ð³Ñ€ÐµÐ´Ð¸ÐµÐ½Ñ‚Ð°Ð¼Ð¸ Ð¸ Ñ‚ÐµÐ¿Ð»Ð¾Ð¹ ÑÑ€ÐµÐ´Ð¸Ð·ÐµÐ¼Ð½Ð¾Ð¼Ð¾Ñ€ÑÐºÐ¾Ð¹ Ð°Ñ‚Ð¼Ð¾ÑÑ„ÐµÑ€Ð¾Ð¹',
        'view-menu': 'ÐŸÐ¾ÑÐ¼Ð¾Ñ‚Ñ€ÐµÑ‚ÑŒ Ð¼ÐµÐ½ÑŽ',
        'call-reservations': 'ÐŸÐ¾Ð·Ð²Ð¾Ð½Ð¸Ñ‚ÑŒ Ð´Ð»Ñ Ð±Ñ€Ð¾Ð½Ð¸',

        // Menu Section
        'menu-title': 'ÐÐ°ÑˆÐµ Ð¼ÐµÐ½ÑŽ',
        'menu-subtitle': 'Ð‘Ð¾Ð³Ð°Ñ‚Ñ‹Ð¹ Ð²Ñ‹Ð±Ð¾Ñ€ Ñ‚Ñ€Ð°Ð´Ð¸Ñ†Ð¸Ð¾Ð½Ð½Ñ‹Ñ… Ð³Ñ€ÐµÑ‡ÐµÑÐºÐ¸Ñ… Ð±Ð»ÑŽÐ´',

        // Category Titles
        'cat-pita-title': 'Ð¡ÑƒÐ²Ð»Ð°ÐºÐ¸ Ð² Ð¿Ð¸Ñ‚Ðµ',
        'cat-plates-title': 'Ð¢Ð°Ñ€ÐµÐ»ÐºÐ¸ ÑÑƒÐ²Ð»Ð°ÐºÐ¸',
        'cat-platters-title': 'ÐœÑÑÐ½Ñ‹Ðµ Ð±Ð»ÑŽÐ´Ð°',
        'cat-pizza-title': 'ÐŸÐ¸Ñ†Ñ†Ð° Ð³Ð¸Ñ€Ð¾Ñ',
        'cat-salad-title': 'Ð¡Ð°Ð»Ð°Ñ‚Ñ‹',
        'cat-drinks-title': 'ÐÐ°Ð¿Ð¸Ñ‚ÐºÐ¸',
        'cat-alcohol-title': 'ÐÐ»ÐºÐ¾Ð³Ð¾Ð»ÑŒ',
        'cat-sides-title': 'Ð“Ð°Ñ€Ð½Ð¸Ñ€Ñ‹',

        // Contact Footer
        'contact-phones': 'Ð¢ÐµÐ»ÐµÑ„Ð¾Ð½: 04-8122980, 052-8921454, 054-2001235',
        'contact-instagram': 'Instagram: @GREEK.SOUVLAKII',
        'contact-name': 'Ð ÐµÑÑ‚Ð¾Ñ€Ð°Ð½ GREEK SOUVLAKI',
        'contact-slogan': 'ÐŸÐ¾Ð½Ñ€Ð°Ð²Ð¸Ð»Ð¾ÑÑŒ? ÐžÑ‚Ð¼ÐµÑ‚ÑŒÑ‚Ðµ Ð½Ð°Ñ!',

        // Main Dishes
        'souvlaki-chicken': 'ÐšÑƒÑ€Ð¸Ð½Ñ‹Ð¹ ÑÑƒÐ²Ð»Ð°ÐºÐ¸',
        'souvlaki-chicken-desc': 'Ð“Ñ€ÐµÑ‡ÐµÑÐºÐ¸Ðµ Ð¼Ð°Ñ€Ð¸Ð½Ð¾Ð²Ð°Ð½Ð½Ñ‹Ðµ ÐºÑƒÑ€Ð¸Ð½Ñ‹Ðµ ÑˆÐ°ÑˆÐ»Ñ‹Ñ‡ÐºÐ¸, ÑÐ²ÐµÐ¶Ð¸Ðµ Ð¾Ð²Ð¾Ñ‰Ð¸, ÐºÐ°Ñ€Ñ‚Ð¾Ñ„ÐµÐ»ÑŒ Ñ„Ñ€Ð¸ Ð¸ Ð¿Ð¸Ñ‚Ð°',
        'souvlaki-pork': 'Ð¡Ð²Ð¸Ð½Ð¾Ð¹ ÑÑƒÐ²Ð»Ð°ÐºÐ¸',
        'souvlaki-pork-desc': 'Ð¢Ñ€Ð°Ð´Ð¸Ñ†Ð¸Ð¾Ð½Ð½Ñ‹Ðµ ÑÐ²Ð¸Ð½Ñ‹Ðµ ÑˆÐ°ÑˆÐ»Ñ‹Ñ‡ÐºÐ¸ Ñ Ð³Ñ€ÐµÑ‡ÐµÑÐºÐ¸Ð¼Ð¸ ÑÐ¿ÐµÑ†Ð¸ÑÐ¼Ð¸',
        'gyros': 'Ð“Ð¸Ñ€Ð¾Ñ',
        'gyros-desc': 'ÐÑƒÑ‚ÐµÐ½Ñ‚Ð¸Ñ‡Ð½Ñ‹Ð¹ Ð³Ð¸Ñ€Ð¾Ñ Ñ Ð´Ð·Ð°Ð´Ð·Ð¸ÐºÐ¸, ÑÐ²ÐµÐ¶Ð¸Ð¼Ð¸ Ð¾Ð²Ð¾Ñ‰Ð°Ð¼Ð¸ Ð¸ ÐºÐ°Ñ€Ñ‚Ð¾Ñ„ÐµÐ»ÐµÐ¼ Ñ„Ñ€Ð¸',
        'mix-grill': 'Ð“Ñ€ÐµÑ‡ÐµÑÐºÐ¾Ðµ Ð°ÑÑÐ¾Ñ€Ñ‚Ð¸ Ð³Ñ€Ð¸Ð»ÑŒ',
        'mix-grill-desc': 'ÐÑÑÐ¾Ñ€Ñ‚Ð¸ Ð¸Ð· Ð¼ÑÑÐ° Ð½Ð° Ð³Ñ€Ð¸Ð»Ðµ Ñ Ð³Ð°Ñ€Ð½Ð¸Ñ€Ð°Ð¼Ð¸',

        // Appetizers
        'tzatziki': 'Ð”Ð·Ð°Ð´Ð·Ð¸ÐºÐ¸',
        'tzatziki-desc': 'ÐšÐ»Ð°ÑÑÐ¸Ñ‡ÐµÑÐºÐ¸Ð¹ Ð³Ñ€ÐµÑ‡ÐµÑÐºÐ¸Ð¹ Ð¹Ð¾Ð³ÑƒÑ€Ñ‚Ð¾Ð²Ñ‹Ð¹ ÑÐ¾ÑƒÑ Ñ Ð¾Ð³ÑƒÑ€Ñ†Ð¾Ð¼ Ð¸ Ñ‡ÐµÑÐ½Ð¾ÐºÐ¾Ð¼',
        'dolmades': 'Ð”Ð¾Ð»Ð¼Ð°Ð´ÐµÑ',
        'dolmades-desc': 'Ð¤Ð°Ñ€ÑˆÐ¸Ñ€Ð¾Ð²Ð°Ð½Ð½Ñ‹Ðµ Ð²Ð¸Ð½Ð¾Ð³Ñ€Ð°Ð´Ð½Ñ‹Ðµ Ð»Ð¸ÑÑ‚ÑŒÑ Ñ Ñ€Ð¸ÑÐ¾Ð¼ Ð¸ Ñ‚Ñ€Ð°Ð²Ð°Ð¼Ð¸',
        'feta-olives': 'Ð¤ÐµÑ‚Ð° Ð¸ Ð¾Ð»Ð¸Ð²ÐºÐ¸',
        'feta-olives-desc': 'ÐŸÑ€ÐµÐ¼Ð¸ÑƒÐ¼ ÑÑ‹Ñ€ Ñ„ÐµÑ‚Ð° Ñ Ð¾Ð»Ð¸Ð²ÐºÐ°Ð¼Ð¸ ÐšÐ°Ð»Ð°Ð¼Ð°Ñ‚Ð°',

        // Salads
        'greek-salad': 'Ð“Ñ€ÐµÑ‡ÐµÑÐºÐ¸Ð¹ Ð´ÐµÑ€ÐµÐ²ÐµÐ½ÑÐºÐ¸Ð¹ ÑÐ°Ð»Ð°Ñ‚',
        'greek-salad-desc': 'ÐŸÐ¾Ð¼Ð¸Ð´Ð¾Ñ€Ñ‹, Ð¾Ð³ÑƒÑ€Ñ†Ñ‹, Ñ„ÐµÑ‚Ð°, Ð¾Ð»Ð¸Ð²ÐºÐ¸ Ð¸ Ð¾Ð»Ð¸Ð²ÐºÐ¾Ð²Ð¾Ðµ Ð¼Ð°ÑÐ»Ð¾',
        'season-salad': 'Ð¡ÐµÐ·Ð¾Ð½Ð½Ñ‹Ð¹ ÑÐ°Ð»Ð°Ñ‚',
        'season-salad-desc': 'Ð¡Ð²ÐµÐ¶Ð¸Ðµ ÑÐµÐ·Ð¾Ð½Ð½Ñ‹Ðµ Ð¾Ð²Ð¾Ñ‰Ð¸',

        // Beverages
        'ouzo': 'Ð£Ð·Ð¾',
        'ouzo-desc': 'Ð¢Ñ€Ð°Ð´Ð¸Ñ†Ð¸Ð¾Ð½Ð½Ñ‹Ð¹ Ð³Ñ€ÐµÑ‡ÐµÑÐºÐ¸Ð¹ Ð½Ð°Ð¿Ð¸Ñ‚Ð¾Ðº',
        'greek-beer': 'Ð“Ñ€ÐµÑ‡ÐµÑÐºÐ¾Ðµ Ð¿Ð¸Ð²Ð¾',
        'greek-beer-desc': 'ÐÑÑÐ¾Ñ€Ñ‚Ð¸Ð¼ÐµÐ½Ñ‚ Ð³Ñ€ÐµÑ‡ÐµÑÐºÐ¾Ð³Ð¾ Ñ€Ð°Ð·Ð»Ð¸Ð²Ð½Ð¾Ð³Ð¾ Ð¿Ð¸Ð²Ð°',

        // About Section
        'about-title': 'Ðž Ð½Ð°Ñ',
        'about-text': 'ÐÐ°ÑÑ‚Ð¾ÑÑ‰Ð¸Ð¹ Ð³Ñ€ÐµÑ‡ÐµÑÐºÐ¸Ð¹ ÐºÑƒÐ»Ð¸Ð½Ð°Ñ€Ð½Ñ‹Ð¹ Ð¾Ð¿Ñ‹Ñ‚ Ð² ÑÐµÑ€Ð´Ñ†Ðµ ÐšÑ„Ð°Ñ€ Ð¯ÑÐ¸Ñ„Ð°. ÐœÑ‹ Ð¿Ñ€ÐµÐ´Ð»Ð°Ð³Ð°ÐµÐ¼ Ð°ÑƒÑ‚ÐµÐ½Ñ‚Ð¸Ñ‡Ð½Ñ‹Ðµ Ð³Ñ€ÐµÑ‡ÐµÑÐºÐ¸Ðµ Ð²ÐºÑƒÑÑ‹ Ñ Ñ‚Ñ€Ð°Ð´Ð¸Ñ†Ð¸Ð¾Ð½Ð½Ñ‹Ð¼Ð¸ ÑÐµÐ¼ÐµÐ¹Ð½Ñ‹Ð¼Ð¸ Ñ€ÐµÑ†ÐµÐ¿Ñ‚Ð°Ð¼Ð¸, Ð¿ÐµÑ€ÐµÐ´Ð°Ð²Ð°ÐµÐ¼Ñ‹Ð¼Ð¸ Ð¸Ð· Ð¿Ð¾ÐºÐ¾Ð»ÐµÐ½Ð¸Ñ Ð² Ð¿Ð¾ÐºÐ¾Ð»ÐµÐ½Ð¸Ðµ. ÐÐ°Ñˆ Ñ€ÐµÑÑ‚Ð¾Ñ€Ð°Ð½ Ð¿Ñ€ÐµÐ´Ð»Ð°Ð³Ð°ÐµÑ‚ Ñ‚ÐµÐ¿Ð»ÑƒÑŽ Ð¸ ÑƒÑŽÑ‚Ð½ÑƒÑŽ Ð°Ñ‚Ð¼Ð¾ÑÑ„ÐµÑ€Ñƒ, Ð¾Ñ‚Ð»Ð¸Ñ‡Ð½Ñ‹Ð¹ ÑÐµÑ€Ð²Ð¸Ñ Ð¸ ÑÐ²ÐµÐ¶Ð¸Ðµ ÐºÐ°Ñ‡ÐµÑÑ‚Ð²ÐµÐ½Ð½Ñ‹Ðµ Ð¸Ð½Ð³Ñ€ÐµÐ´Ð¸ÐµÐ½Ñ‚Ñ‹.',
        'quality-title': 'ÐšÐ°Ñ‡ÐµÑÑ‚Ð²ÐµÐ½Ð½Ð¾Ðµ Ð¼ÑÑÐ¾',
        'quality-desc': 'Ð¡Ð²ÐµÐ¶ÐµÐµ ÐºÐ°Ñ‡ÐµÑÑ‚Ð²ÐµÐ½Ð½Ð¾Ðµ Ð¼ÑÑÐ¾ Ð¾Ñ‚ Ð¿Ñ€ÐµÐ¼Ð¸Ð°Ð»ÑŒÐ½Ñ‹Ñ… Ð¿Ð¾ÑÑ‚Ð°Ð²Ñ‰Ð¸ÐºÐ¾Ð²',
        'fresh-title': 'Ð¡Ð²ÐµÐ¶Ð¸Ðµ Ð¸Ð½Ð³Ñ€ÐµÐ´Ð¸ÐµÐ½Ñ‚Ñ‹',
        'fresh-desc': 'Ð•Ð¶ÐµÐ´Ð½ÐµÐ²Ð½Ð¾ ÑÐ²ÐµÐ¶Ð¸Ðµ Ð¾Ð²Ð¾Ñ‰Ð¸ Ð¸ Ñ‚Ñ€Ð°Ð²Ñ‹',
        'chef-title': 'Ð¢Ñ€Ð°Ð´Ð¸Ñ†Ð¸Ð¾Ð½Ð½Ñ‹Ðµ Ñ€ÐµÑ†ÐµÐ¿Ñ‚Ñ‹',
        'chef-desc': 'ÐÑƒÑ‚ÐµÐ½Ñ‚Ð¸Ñ‡Ð½Ñ‹Ðµ Ð³Ñ€ÐµÑ‡ÐµÑÐºÐ¸Ðµ Ð¼ÐµÑ‚Ð¾Ð´Ñ‹ Ð¿Ñ€Ð¸Ð³Ð¾Ñ‚Ð¾Ð²Ð»ÐµÐ½Ð¸Ñ',
        'atmosphere-title': 'Ð“Ñ€ÐµÑ‡ÐµÑÐºÐ°Ñ Ð°Ñ‚Ð¼Ð¾ÑÑ„ÐµÑ€Ð°',
        'atmosphere-desc': 'Ð¡Ñ€ÐµÐ´Ð¸Ð·ÐµÐ¼Ð½Ð¾Ð¼Ð¾Ñ€ÑÐºÐ¸Ð¹ Ð´Ð¸Ð·Ð°Ð¹Ð½ Ð¸ Ð³Ñ€ÐµÑ‡ÐµÑÐºÐ°Ñ Ð¼ÑƒÐ·Ñ‹ÐºÐ°',

        // Gallery Section
        'gallery-title': 'Ð“Ð°Ð»ÐµÑ€ÐµÑ',
        'gallery-subtitle': 'Ð’ÐºÑƒÑ Ð½Ð°ÑˆÐµÐ¹ Ð°Ñ‚Ð¼Ð¾ÑÑ„ÐµÑ€Ñ‹ Ð¸ Ð±Ð»ÑŽÐ´',

        // Contact Section
        'contact-title': 'Ð¡Ð²ÑÐ·Ð°Ñ‚ÑŒÑÑ Ñ Ð½Ð°Ð¼Ð¸',
        'reservation-title': 'Ð‘Ñ€Ð¾Ð½Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ðµ Ð¸ Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸Ñ',
        'reservation-text': 'Ð”Ð»Ñ Ð±Ñ€Ð¾Ð½Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ñ, Ð¾ÑÐ¾Ð±Ñ‹Ñ… ÑÐ¾Ð±Ñ‹Ñ‚Ð¸Ð¹ Ð¸Ð»Ð¸ Ð´Ð¾Ð¿Ð¾Ð»Ð½Ð¸Ñ‚ÐµÐ»ÑŒÐ½Ð¾Ð¹ Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸Ð¸',
        'call-now': 'ÐŸÐ¾Ð·Ð²Ð¾Ð½Ð¸Ñ‚ÑŒ ÑÐµÐ¹Ñ‡Ð°Ñ',
        'whatsapp': 'WhatsApp',
        'location-title': 'Ð Ð°ÑÐ¿Ð¾Ð»Ð¾Ð¶ÐµÐ½Ð¸Ðµ',
        'location-text': 'Ð¨Ð¾ÑÑÐµ 70, ÐšÑ„Ð°Ñ€ Ð¯ÑÐ¸Ñ„',
        'get-directions': 'ÐŸÐ¾Ð»ÑƒÑ‡Ð¸Ñ‚ÑŒ Ð½Ð°Ð¿Ñ€Ð°Ð²Ð»ÐµÐ½Ð¸Ñ',
        'hours-title': 'Ð§Ð°ÑÑ‹ Ñ€Ð°Ð±Ð¾Ñ‚Ñ‹',
        'hours-text': 'Ð’Ñ-Ð¡Ñ€: Ð—Ð°ÐºÑ€Ñ‹Ñ‚Ð¾<br>Ð§Ñ‚-Ð¡Ð±: 13:00-01:00',
        'hours-note': 'Ð ÐµÐºÐ¾Ð¼ÐµÐ½Ð´ÑƒÐµÑ‚ÑÑ Ð¿Ñ€ÐµÐ´Ð²Ð°Ñ€Ð¸Ñ‚ÐµÐ»ÑŒÐ½Ð¾Ðµ Ð±Ñ€Ð¾Ð½Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ðµ',
        'events-title': 'ÐœÐµÑ€Ð¾Ð¿Ñ€Ð¸ÑÑ‚Ð¸Ñ',
        'hours-closed': 'Вс-Ср: Закрыто',
        'hours-open': 'Чт-Сб: 13:00-01:00',
        'events-text': 'ÐœÑ‹ Ð¿Ñ€Ð¾Ð²Ð¾Ð´Ð¸Ð¼ Ñ‡Ð°ÑÑ‚Ð½Ñ‹Ðµ Ð¸ Ð³Ñ€ÑƒÐ¿Ð¿Ð¾Ð²Ñ‹Ðµ Ð¼ÐµÑ€Ð¾Ð¿Ñ€Ð¸ÑÑ‚Ð¸Ñ',
        'events-contact': 'ÐšÐ¾Ð½ÑÑƒÐ»ÑŒÑ‚Ð°Ð½Ñ‚ Ð¿Ð¾ Ð¼ÐµÑ€Ð¾Ð¿Ñ€Ð¸ÑÑ‚Ð¸ÑÐ¼: 052-8921454',
        'social-title': 'ÐŸÐ¾Ð´Ð¿Ð¸ÑÑ‹Ð²Ð°Ð¹Ñ‚ÐµÑÑŒ Ð½Ð° Ð½Ð°Ñ',
        'phone-text': '052-8921454 / 04-8122980',

        // Footer
        'footer': 'Â© 2024 Ð“Ñ€ÐµÑ‡ÐµÑÐºÐ¸Ð¹ Ð¡ÑƒÐ²Ð»Ð°ÐºÐ¸ - ÐÑƒÑ‚ÐµÐ½Ñ‚Ð¸Ñ‡Ð½Ñ‹Ð¹ Ð³Ñ€ÐµÑ‡ÐµÑÐºÐ¸Ð¹ Ñ€ÐµÑÑ‚Ð¾Ñ€Ð°Ð½ Ð² ÐšÑ„Ð°Ñ€ Ð¯ÑÐ¸Ñ„Ðµ'
    },
    el: {
        'logo': 'Ελληνικό Σουβλάκι',
        'nav-home': 'Αρχική',
        'nav-menu': 'Μενού',
        'nav-about': 'Σχετικά',
        'nav-gallery': 'Γκαλερί',
        'nav-contact': 'Επικοινωνία',
        'hero-title': 'Ελληνικό Σουβλάκι - Καφρ Γιασίφ',
        'hero-subtitle': 'Αυθεντικές Ελληνικές Γεύσεις στην Καρδιά του Καφρ Γιασίφ',
        'hero-description': 'Μια γνήσια ελληνική γαστρονομική εμπειρία με παραδοσιακές συνταγές, φρέσκα υλικά και ζεστή μεσογειακή ατμόσφαιρα',
        'view-menu': 'Δείτε το Μενού',
        'call-reservations': 'Κλήση για Κρατήσεις',
        'menu-title': 'Το Μενού μας',
        'menu-subtitle': 'Πλούσια επιλογή παραδοσιακών ελληνικών πιάτων',
        'tab-more': 'Περισσότερα',
        'cat-pita-title': 'Σουβλάκι σε Πίτα',
        'cat-plates-title': 'Πιάτα Σουβλάκι',
        'cat-platters-title': 'Πιατέλες Κρεάτων',
        'cat-pizza-title': 'Πίτσα Γύρος',
        'cat-salad-title': 'Σαλάτες',
        'cat-drinks-title': 'Ποτά',
        'cat-alcohol-title': 'Αλκοόλ',
        'cat-sides-title': 'Συνοδευτικά',
        'item-pita-chicken': 'Σουβλάκι Πίτα Κοτόπουλο',
        'desc-pita-chicken': 'Ελληνική πίτα, σουβλάκι κοτόπουλο, σάλτσα τζατζίκι/πικάντικη, λάχανο, κρεμμύδι, ντομάτα, μαρούλι, πατάτες',
        'item-pita-pork': 'Σουβλάκι Πίτα Χοιρινό',
        'desc-pita-pork': 'Ελληνική πίτα, σουβλάκι χοιρινό, σάλτσα τζατζίκι/πικάντικη, λάχανο, κρεμμύδι, ντομάτα, μαρούλι, πατάτες',
        'item-pita-gyros': 'Σουβλάκι Πίτα Γύρος Χοιρινό',
        'desc-pita-gyros': 'Ελληνική πίτα, γύρος χοιρινό, σάλτσα τζατζίκι/πικάντικη, λάχανο, κρεμμύδι, ντομάτα, μαρούλι, πατάτες',
        'item-pita-kebab': 'Σουβλάκι Πίτα Κεμπάπ',
        'desc-pita-kebab': 'Ελληνική πίτα, κεμπάπ αρνίσιο, σάλτσα τζατζίκι/πικάντικη, λάχανο, κρεμμύδι, ντομάτα, μαρούλι, πατάτες',
        'item-pita-sausage': 'Σουβλάκι Πίτα Λουκάνικο',
        'desc-pita-sausage': 'Ελληνική πίτα, λουκάνικα, σάλτσα τζατζίκι/πικάντικη, λάχανο, κρεμμύδι, ντομάτα, μαρούλι, πατάτες',
        'item-pita-vegan': 'Σουβλάκι Πίτα Vegan',
        'desc-pita-vegan': 'Ελληνική πίτα, vegan σουβλάκι, σάλτσα τζατζίκι/πικάντικη, λάχανο, κρεμμύδι, ντομάτα, μαρούλι, πατάτες',
        'item-pita-steak': 'Σουβλάκι Πίτα Μπριζόλα Χοιρινή',
        'desc-pita-steak': 'Ελληνική πίτα, χοιρινή μπριζόλα, σάλτσα τζατζίκι/πικάντικη, λάχανο, κρεμμύδι, ντομάτα, μαρούλι, πατάτες',
        'item-pita-glutenfree': 'Σουβλάκι Πίτα Χωρίς Γλουτένη',
        'desc-pita-glutenfree': 'Πίτα χωρίς γλουτένη, επιλογή σουβλακιού, σάλτσα τζατζίκι/πικάντικη, λάχανο, κρεμμύδι, ντομάτα, μαρούλι, πατάτες',
        'item-double-skewer': 'Διπλό Σουβλάκι',
        'desc-double-skewer': 'Επιπλέον σουβλάκι',
        'item-plate-souvlaki': 'Πιάτο Σουβλάκι',
        'desc-plate-souvlaki': 'Επιλογή σουβλακιών, σάλτσα τζατζίκι/πικάντικη, λάχανο, κρεμμύδι, ντομάτα, μαρούλι, πατάτες',
        'item-plate-gyros': 'Πιάτο Γύρος',
        'desc-plate-gyros': 'Γύρος χοιρινό, σάλτσα τζατζίκι/πικάντικη, λάχανο, κρεμμύδι, ντομάτα, μαρούλι, πατάτες',
        'item-platter-two': 'Πιατέλα Κρεάτων για Δύο',
        'desc-platter-two': '3 σουβλάκια (χοιρινό/κοτόπουλο/κεμπάπ), λουκάνικο, ειδική σάλτσα, 2 χοιρινές μπριζόλες',
        'item-platter-four': 'Πιατέλα Κρεάτων για Τέσσερις',
        'desc-platter-four': '6 σουβλάκια, γύρος χοιρινό, λουκάνικο, ειδική σάλτσα, 3 χοιρινές μπριζόλες',
        'item-pizza-small': 'Πίτσα Γύρος (Μικρή)',
        'desc-pizza-small': 'Πίτσα με γύρο χοιρινό και πατάτες',
        'item-pizza-large': 'Πίτσα Γύρος (Μεγάλη)',
        'desc-pizza-large': 'Πίτσα με γύρο χοιρινό και πατάτες',
        'item-greek-salad': 'Ελληνική Σαλάτα',
        'desc-greek-salad': 'Ντομάτες, αγγούρι, πιπεριά, κρεμμύδι, ελιές Καλαμών, φέτα',
        'item-soft-drinks': 'Αναψυκτικά',
        'desc-soft-drinks': 'Coca Cola, Cola Zero, Fanta, Sprite, Σταφύλι',
        'item-water': 'Νερό',
        'desc-water': 'Νερό',
        'item-beer': 'Μπύρα Βαρελίσια (1/3)',
        'desc-beer': 'Μπύρα του καταστήματος',
        'item-wine-glass': 'Κρασί (Ποτήρι)',
        'desc-wine-glass': 'Κόκκινο/λευκό/ροζέ κρασί',
        'item-wine-bottle': 'Μπουκάλι Κρασί',
        'desc-wine-bottle': 'Μπουκάλι κρασί',
        'item-whiskey': 'Ουίσκι',
        'desc-whiskey': 'Ουίσκι',
        'item-ouzo': 'Ούζο Πλωμαρίου',
        'desc-ouzo': 'Μπουκάλι ούζο Πλωμαρίου 200ml',
        'item-fries': 'Πατάτες Τηγανητές',
        'desc-fries': 'Πιάτο με πατάτες',
        'contact-call': 'Καλέστε μας',
        'contact-social': 'Ακολουθήστε μας',
        'contact-phones': 'Τηλέφωνο: 04-8122980, 052-8921454, 054-2001235',
        'contact-instagram': 'Instagram: @GREEK.SOUVLAKII',
        'contact-name': 'Εστιατόριο GREEK SOUVLAKI',
        'contact-slogan': 'Σας άρεσε; Κάντε μας tag!',
        'about-title': 'Σχετικά με εμάς',
        'about-text': 'Μια γνήσια ελληνική γαστρονομική εμπειρία στην καρδιά του Καφρ Γιασίφ. Φέρνουμε αυθεντικές ελληνικές γεύσεις με παραδοσιακές οικογενειακές συνταγές που περνούν από γενιά σε γενιά.',
        'quality-title': 'Ποιοτικά Κρέατα',
        'quality-desc': 'Φρέσκα ποιοτικά κρέατα από κορυφαίους προμηθευτές',
        'fresh-title': 'Φρέσκα Υλικά',
        'fresh-desc': 'Καθημερινά φρέσκα λαχανικά και βότανα',
        'chef-title': 'Παραδοσιακές Συνταγές',
        'chef-desc': 'Αυθεντικές ελληνικές μέθοδοι μαγειρικής',
        'atmosphere-title': 'Ελληνική Ατμόσφαιρα',
        'atmosphere-desc': 'Μεσογειακός σχεδιασμός και ελληνική μουσική',
        'gallery-title': 'Γκαλερί',
        'gallery-subtitle': 'Μια γεύση από την ατμόσφαιρα και τα πιάτα μας',
        'contact-title': 'Επικοινωνία',
        'reservation-title': 'Κρατήσεις & Πληροφορίες',
        'reservation-text': 'Για κρατήσεις, ειδικές εκδηλώσεις ή περισσότερες πληροφορίες',
        'call-now': 'Καλέστε Τώρα',
        'whatsapp': 'WhatsApp',
        'location-title': 'Τοποθεσία',
        'location-text': 'Λεωφόρος 70, Καφρ Γιασίφ',
        'get-directions': 'Οδηγίες',
        'hours-title': 'Ώρες Λειτουργίας',
        'hours-text': 'Κυρ-Τετ: Κλειστά<br>Πεμ-Σαβ: 13:00-01:00',
        'hours-closed': 'Κυριακή-Τετάρτη: Κλειστά',
        'hours-open': 'Πέμπτη-Σάββατο: 13:00-01:00',
        'hours-note': 'Συνιστάται κράτηση εκ των προτέρων',
        'events-title': 'Εκδηλώσεις',
        'events-text': 'Φιλοξενούμε ιδιωτικές και ομαδικές εκδηλώσεις',
        'events-contact': 'Σύμβουλος εκδηλώσεων: 052-8921454',
        'social-title': 'Ακολουθήστε μας',
        'phone-text': '052-8921454 / 04-8122980',
        'footer': '© 2024 Ελληνικό Σουβλάκι - Αυθεντικό Ελληνικό Εστιατόριο στο Καφρ Γιασίφ',
        'footer-terms': 'Όροι Χρήσης',
        'footer-privacy': 'Απόρρητο',
        'footer-accessibility': 'Προσβασιμότητα',
        'footer-copyright': '© 2024 Greek Souvlaki - Ελληνικό Σουβλάκι',
        'nav-waze': '🧭 Waze',
        'footer-developed-by': 'Αναπτύχθηκε από'
    }
};

// Language switcher functionality
let currentLanguage = localStorage.getItem('preferred-language') || 'he';

function switchLanguage(lang) {
    currentLanguage = lang;
    document.documentElement.lang = lang;

    // Set text direction for RTL languages
    if (lang === 'he' || lang === 'ar') {
        document.documentElement.dir = 'rtl';
        document.body.classList.add('rtl');
        // Reverse navigation menu order for RTL
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu) {
            navMenu.style.flexDirection = 'row-reverse';
        }
        // Adjust container layout for RTL
        const navbar = document.querySelector('.navbar .container');
        if (navbar) {
            navbar.style.flexDirection = 'row-reverse';
        }
    } else {
        document.documentElement.dir = 'ltr';
        document.body.classList.remove('rtl');
        // Reset navigation menu order for LTR
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu) {
            navMenu.style.flexDirection = 'row';
        }
        // Reset container layout for LTR
        const navbar = document.querySelector('.navbar .container');
        if (navbar) {
            navbar.style.flexDirection = 'row';
        }
    }

    // Update all text elements with English fallback when needed\n    const resolveText = (k) => {\n        const val = translations[lang] && translations[lang][k];\n        const isBad = (s) => !s || /�/.test(String(s));\n        if (!isBad(val)) return val;\n        const enVal = translations.en && translations.en[k];\n        return enVal || (val || '');\n    };\n\n    document.querySelectorAll('[data-lang]').forEach(element => {\n        const key = element.getAttribute('data-lang');\n        const text = resolveText(key);\n        if (text !== undefined) {\n            element.innerHTML = text;\n        }\n    });

    // Update active language button
    document.querySelectorAll('.lang-option').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-lang-switch="${lang}"]`)?.classList.add('active');

    // Update current language display
    const currentLangSpan = document.querySelector('.current-lang');
    if (currentLangSpan) {
        const langMap = { he: '🇮🇱 HE', en: '🇬🇧 EN', ar: '🇸🇦 AR', ru: '🇷🇺 RU', el: '🇬🇷 GR' };
        currentLangSpan.textContent = langMap[lang] || '🇮🇱 HE';
    }

    // Save language preference
    localStorage.setItem('preferred-language', lang);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Set up language switcher buttons
    document.querySelectorAll('[data-lang-switch]').forEach(button => {
        button.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang-switch');
            switchLanguage(lang);
        });
    });

    // Initialize with Hebrew as default
    switchLanguage(currentLanguage); document.getElementById('i18n-hide')?.remove(); document.body.style.visibility='visible';
});

