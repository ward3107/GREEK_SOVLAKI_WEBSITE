const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8000;

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.webmanifest': 'application/manifest+json'
};

// Cache durations in seconds
const cacheDurations = {
  // Images - 1 year (immutable content)
  '.png': 31536000,
  '.jpg': 31536000,
  '.jpeg': 31536000,
  '.gif': 31536000,
  '.webp': 31536000,
  '.svg': 31536000,
  '.ico': 31536000,

  // Fonts - 1 year (immutable content)
  '.woff': 31536000,
  '.woff2': 31536000,
  '.ttf': 31536000,

  // Versioned assets - 1 year (you're using ?v= query params)
  '.css': 31536000, // Since you use ?v=38
  '.js': 31536000,  // Since you use ?v=23

  // HTML - short cache or no-cache (dynamic content)
  '.html': 0,

  // Manifest and JSON - 1 day
  '.json': 86400,
  '.webmanifest': 86400
};

// Security: Validate and sanitize file paths
function validateFilePath(reqUrl) {
  // Remove query string for file path
  const queryIndex = reqUrl.indexOf('?');
  let filePath = queryIndex !== -1 ? reqUrl.substring(0, queryIndex) : reqUrl;

  // Ensure path starts with /
  if (!filePath.startsWith('/')) {
    filePath = '/' + filePath;
  }

  // SECURITY: Prevent directory traversal attacks
  if (filePath.includes('..') || filePath.includes('\\')) {
    return null; // Invalid path
  }

  // Normalize path to prevent encoded traversal
  const decodedPath = decodeURIComponent(filePath);
  if (decodedPath.includes('..') || decodedPath.includes('\\')) {
    return null; // Invalid path after decoding
  }

  // Build full file path
  let fullPath = '.' + filePath;

  // Default to index.html
  if (fullPath === './') {
    fullPath = './index.html';
  }

  // Resolve the path to get absolute path and check it's within our directory
  const resolvedPath = path.resolve(fullPath);
  const currentDir = path.resolve('.');

  // Ensure the resolved path is within the current directory
  if (!resolvedPath.startsWith(currentDir)) {
    return null; // Path traversal attempt
  }

  // Additional: Only allow specific file extensions
  const allowedExtensions = Object.keys(mimeTypes);
  const extname = String(path.extname(resolvedPath)).toLowerCase();

  if (!allowedExtensions.includes(extname)) {
    return null; // File type not allowed
  }

  return fullPath;
}

const server = http.createServer((req, res) => {
  const filePath = validateFilePath(req.url);

  // If validation fails, return 403 Forbidden
  if (!filePath) {
    res.writeHead(403, { 'Content-Type': 'text/html' });
    res.end('<h1>403 - Access Denied</h1>', 'utf-8');
    return;
  }

  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = mimeTypes[extname] || 'application/octet-stream';
  const cacheDuration = cacheDurations[extname] !== undefined ? cacheDurations[extname] : 86400;

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        fs.readFile('./404.html', (error404, content404) => {
          if (error404) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('<h1>404 - Page Not Found</h1>', 'utf-8');
          } else {
            res.writeHead(404, {
              'Content-Type': 'text/html',
              'Cache-Control': 'no-cache'
            });
            res.end(content404, 'utf-8');
          }
        });
      } else {
        res.writeHead(500);
        res.end('Server Error: ' + error.code);
      }
    } else {
      // Set cache headers
      const headers = {
        'Content-Type': contentType
      };

      if (cacheDuration === 0) {
        // No cache for HTML files
        headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
        headers['Pragma'] = 'no-cache';
        headers['Expires'] = '0';
      } else {
        // Long-term cache for static assets
        headers['Cache-Control'] = `public, max-age=${cacheDuration}, immutable`;
      }

      res.writeHead(200, headers);
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log('Cache headers configured:');
  console.log('- Images, fonts, CSS, JS: 1 year (immutable)');
  console.log('- HTML: no-cache');
  console.log('- JSON/manifest: 1 day');
});
