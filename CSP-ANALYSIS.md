# Content Security Policy (CSP) Analysis

**Date:** 2025-12-23
**Status:** Documented

---

## Current CSP Policy

```html
<meta http-equiv="Content-Security-Policy" content="
    default-src 'self';
    script-src 'self' https://vercel.live;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com http://fonts.googleapis.com;
    font-src 'self' https://fonts.gstatic.com http://fonts.gstatic.com;
    img-src 'self' data: blob: https://images.unsplash.com https://flagcdn.com;
    connect-src 'self' https://images.unsplash.com https://flagcdn.com https://vercel.live;
    frame-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
">
```

---

## Why `unsafe-inline` is Required for Styles

### Dynamic Style Tag Creation

The `unsafe-inline` directive in `style-src` is **required** because the application dynamically creates `<style>` tags via JavaScript:

#### 1. Toast Notification Styles (script.js)
**Location:** `script.js` - `showHashNotFoundMessage()` function

```javascript
const style = document.createElement('style');
style.id = 'toast-animation-style';
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    .hash-not-found-toast .toast-close { ... }
    .hash-not-found-toast .toast-icon { ... }
`;
document.head.appendChild(style);
```

**Purpose:** Adds animations and styles for the 404 hash not found toast notification.

---

## Alternatives Considered

### 1. Move All Styles to External CSS Files

**Pros:**
- Would allow removing `unsafe-inline`
- Better caching

**Cons:**
- Toast notification styles are only needed when there's an error (rare)
- Would require external CSS file modification for dynamic content
- More complex to maintain

### 2. Use Nonce-Based CSP

**Pros:**
- More secure than `unsafe-inline`

**Cons:**
- Requires server-side generation of nonces
- Adds complexity to deployment
- Overkill for this static site
- GitHub Pages doesn't support server-side nonce generation

### 3. Use style-src 'unsafe-hashes'

**Pros:**
- More secure than `unsafe-inline`

**Cons:**
- Not widely supported yet
- Requires computing hashes for all dynamic styles
- Complex to maintain

---

## Recommendation

### Keep `unsafe-inline` for styles

**Justification:**
1. **Legitimate use case:** Dynamic styles are for user-facing error handling (404 toast)
2. **No user input:** The dynamic styles don't incorporate user input
3. **Static site limitation:** Nonce-based CSP requires server-side rendering
4. **Low risk:** The injected styles are hardcoded strings, not user-generated content

### Security Posture Assessment

| Aspect | Status |
|--------|--------|
| Script execution | ✅ Secure - No `unsafe-inline` for scripts |
| Dynamic styles | ⚠️ Acceptable risk - Required for error UI |
| External scripts | ✅ Secure - Only self + vercel.live |
| External styles | ✅ Secure - Only Google Fonts |
| Data sources | ✅ Secure - No `data:` for scripts |
| Plugins | ✅ Secure - `object-src 'none'` |

---

## Future Improvements

### Option A: Pre-load Toast Styles
Move toast notification styles to `styles.css` and only toggle classes via JavaScript:
- Remove need for dynamic `<style>` tag creation
- Still uses `unsafe-inline` but less dynamic injection

### Option B: Server-Side Rendering (If moving off GitHub Pages)
- Generate nonces server-side
- Use CSP with nonces instead of `unsafe-inline`
- Requires hosting change (e.g., Vercel, Netlify with edge functions)

---

## Compliance Notes

### WCAG 2.1 Level AA
The toast notification with dynamic styles provides:
- Visual feedback for navigation errors
- Accessible ARIA attributes (`role="alert"`, `aria-live="polite"`)
- Keyboard-accessible close button

Removing `unsafe-inline` would require removing this accessibility feature or finding alternative implementation.

---

## Conclusion

**Keep the current CSP configuration with `unsafe-inline` for styles.**

The security trade-off is acceptable because:
1. Only styles (not scripts) use `unsafe-inline`
2. Dynamic styles are for accessibility features (error notifications)
3. No user-generated content is injected
4. Static site constraints make alternatives impractical
