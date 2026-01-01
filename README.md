# Greek Souvlaki Restaurant Website

A modern, multilingual restaurant website for Greek Souvlaki, featuring a responsive design, accessibility compliance, and comprehensive legal documentation.

## Features

### Core Functionality
- **Multilingual Support** - Full support for 4 languages:
  - Hebrew (עברית) - RTL
  - Arabic (العربية) - RTL
  - English
  - Russian (Русский)
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Accessibility Compliant** - WCAG 2.1 Level AA & Israeli Standard 5568
- **Modern UI/UX** - Glassmorphism effects, smooth animations, premium design

### Pages & Sections
- **Home Page** - Hero section with restaurant branding
- **Menu** - Digital menu display
- **Gallery** - Restaurant and food photography
- **About** - Restaurant story and information
- **Contact** - Location, hours, and contact form
- **Legal Pages**:
  - Terms of Use (תקנון ותנאי שימוש)
  - Privacy Policy (מדיניות פרטיות)
  - Accessibility Statement (הצהרת נגישות)

### Technical Features
- Dynamic language switching with localStorage persistence
- Dark/Light theme toggle
- Smooth scroll animations
- SEO optimized with structured data
- Lazy loading images
- Browser cache optimization

## Tech Stack

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS Grid & Flexbox
- **JavaScript (Vanilla)** - No framework dependencies
- **Google Fonts** - Poppins & Inter typography
- **Unsplash** - High-quality imagery

## Project Structure

```
GREEK_SOVLAKI_WEBSITE/
├── index.html              # Main homepage
├── accessibility.html      # Accessibility statement (4 languages)
├── privacy.html           # Privacy policy (4 languages)
├── terms.html             # Terms of use (4 languages)
├── styles.css             # Main stylesheet
├── script.js              # Core functionality
├── translations-new.js    # Language translation system
├── toggles.js             # Theme & language toggles
├── scroll-button.js       # Scroll-to-top functionality
├── restaurant-logo.jpg    # Restaurant branding
├── he.json, ar.json       # Hebrew & Arabic translations
├── en.json, ru.json       # English & Russian translations
├── CLAUDE.md              # Development guidelines
└── README.md              # This file
```

## Setup & Installation

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/ward3107/GREEK_SOVLAKI_WEBSITE.git
   cd GREEK_SOVLAKI_WEBSITE
   ```

2. **Start a local server**

   Using Python:
   ```bash
   python -m http.server 8000
   ```

   Using Node.js:
   ```bash
   npx http-server -p 8000
   ```

3. **Open in browser**
   ```
   http://localhost:8000
   ```

### Deployment

This is a static website and can be deployed to:
- **GitHub Pages**
- **Netlify**
- **Vercel**
- **Any static hosting service**

No build process required - just upload the files!

## Configuration

### Updating Content

- **Language Translations**: Edit `he.json`, `ar.json`, `en.json`, `ru.json`
- **Menu Items**: Modify the menu section in `index.html`
- **Contact Info**: Update contact details in `index.html`
- **Legal Pages**: Edit `terms.html`, `privacy.html`, `accessibility.html`

### Customizing Styles

All styling is in `styles.css` with CSS custom properties (variables) for easy theming:

```css
:root {
    --color-primary: #2563eb;      /* Main blue */
    --color-accent: #f59e0b;       /* Gold/Orange */
    --color-text: #1e293b;         /* Text color */
    /* ...more variables */
}
```

## Accessibility

This website complies with:
- **WCAG 2.1 Level AA** standards
- **Israeli Standard 5568** (תקן ישראלי ת"י 5568)
- Full keyboard navigation support
- Screen reader optimization
- Proper color contrast ratios (4.5:1)
- Responsive text scaling up to 200%

## Legal Compliance

All legal pages comply with Israeli law:
- **Privacy Protection Law** (חוק הגנת הפרטיות, התשמ"א-1981)
- **Amendment 13** (תיקון 13)
- **Communications Law** Section 30א (spam regulations)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contact

**Greek Souvlaki**
- Address: Route 70, Kafr Yasif (כביש 70, כפר יאסיף)
- Phone: 04-8122980
- Email: [Contact form on website]

## License

Copyright © 2025 Greek Souvlaki. All rights reserved.

---

**Built with attention to accessibility, performance, and user experience.**
