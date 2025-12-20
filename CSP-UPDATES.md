# CSP Updates for Vercel Development Support

## Problem
The Content Security Policy (CSP) was blocking Vercel's live development script: `https://vercel.live/_next-live/feedback/feedback.js`

## Solution
Updated CSP in all HTML files to allow Vercel development scripts while maintaining security.

## Changes Made

### 1. Main Site Files
- **index.html** - Updated CSP to allow `https://vercel.live` for scripts and connections
- **privacy.html** - Updated CSP to allow `https://vercel.live`
- **terms.html** - Updated CSP to allow `https://vercel.live`
- **accessibility.html** - Updated CSP to allow `https://vercel.live`

### 2. Test Files
- **test-christmas.html** - Added CSP with `unsafe-inline` for development testing

### 3. CSP Directives Updated

#### script-src:
- Before: `'self' https://www.googletagmanager.com https://www.google-analytics.com 'sha256-vvt4KWwuNr51XfE5m+hzeNEGhiOfZzG97ccfqGsPwvE='`
- After: `'self' https://www.googletagmanager.com https://www.google-analytics.com https://vercel.live 'sha256-vvt4KWwuNr51XfE5m+hzeNEGhiOfZzG97ccfqGsPwvE='`

#### connect-src:
- Added: `https://vercel.live` to allow connections to Vercel's development services

## Security Considerations

### What's Allowed Now:
- ✅ Vercel live development scripts (`https://vercel.live/*`)
- ✅ Google Analytics scripts
- ✅ Google Tag Manager scripts
- ✅ Internal scripts with hash verification
- ✅ Styles from Google Fonts

### What's Still Blocked:
- ❌ Inline scripts (except those with specific hashes)
- ❌ External scripts from untrusted domains
- ❌ Dangerous protocols (http:, data: for scripts)
- ❌ eval() and similar functions

## Development vs Production

### Development Environment:
- CSP allows `https://vercel.live` for hot reload and development tools
- All security measures remain in place

### Production Environment:
- Same CSP works for production
- Vercel live scripts won't be loaded in production build
- No security compromise for end users

## Testing

To test the CSP changes:

1. **Local Development**:
   ```bash
   # Start local server
   node server.js
   # Or use any local development server
   ```

2. **Vercel Development**:
   ```bash
   vercel dev
   ```
   - The Vercel live feedback script should now load without CSP violations
   - Check browser console for any CSP errors

3. **Production Build**:
   ```bash
   vercel --prod
   ```
   - Should work the same as before
   - No CSP violations expected

## Browser Console Testing

Open browser console and check for:
- ✅ No CSP violation messages
- ✅ Vercel live scripts loading successfully (in development)
- ✅ Google Analytics scripts loading (if configured)

## Common CSP Issues & Solutions

### If you see CSP violations:
1. **Check the exact URL** being blocked
2. **Verify the domain** matches `https://vercel.live`
3. **Check protocol** (must be https://)
4. **Verify script hash** if using inline scripts

### Example CSP Violation & Fix:
```
ERROR: Loading script from 'https://vercel.live/feedback.js' blocked by CSP
```
Fixed by adding `https://vercel.live` to script-src directive.

## Rollback Plan

If issues arise, you can revert by:
1. Removing `https://vercel.live` from script-src
2. Removing `https://vercel.live` from connect-src
3. Keeping all other security measures intact

## Future Considerations

1. **Nonce-based CSP**: Consider using nonces for inline scripts in production
2. **Report-Only Mode**: Use `Content-Security-Policy-Report-Only` for testing
3. **CSP Headers**: Consider moving CSP to HTTP headers for better control

---

*Updated: December 20, 2024*