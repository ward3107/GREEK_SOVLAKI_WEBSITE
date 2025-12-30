// Google Analytics 4 (GA4) Tracking
// Replace G-XXXXXXXXXX with your actual Google Analytics Measurement ID
// To get your ID: https://analytics.google.com/ → Admin → Create Property → Data Streams

(function() {
  'use strict';

  // Create dataLayer
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}

  // Initialize
  gtag('js', new Date());

  // Configure with your Measurement ID
  const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // TODO: Replace with your actual ID

  gtag('config', GA_MEASUREMENT_ID, {
    'anonymize_ip': true,
    'cookie_flags': 'SameSite=None;Secure'
  });

  // Track page views for SPA navigation (hash changes)
  gtag('event', 'page_view', {
    page_title: document.title,
    page_location: window.location.href
  });

  // Track hash navigation (for one-page site sections)
  let lastPath = location.pathname;
  new MutationObserver(() => {
    const path = location.pathname;
    if (path !== lastPath) {
      lastPath = path;
      gtag('event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href
      });
    }
  }).observe(document, { subtree: true, childList: true });

  // Track language preference changes
  window.addEventListener('languageChange', function(e) {
    gtag('event', 'language_change', {
      language: e.detail.lang
    });
  });

  // Track cookie consent
  window.addEventListener('cookieConsent', function(e) {
    gtag('consent', 'update', {
      analytics_storage: e.detail.analytics ? 'granted' : 'denied'
    });
  });

  // Load gtag.js script
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_MEASUREMENT_ID;
  document.head.appendChild(script);

  console.log('[GA4] Analytics initialized (update GA_MEASUREMENT_ID with your ID)');
})();
