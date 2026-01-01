const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8000;

// Simple file-based logger for production
const logger = {
  logFile: './server.log',

  log(level, message, data = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...data
    };

    const logLine = JSON.stringify(logEntry) + '\n';

    // Console output with color
    const colors = {
      INFO: '\x1b[36m',    // Cyan
      WARN: '\x1b[33m',    // Yellow
      ERROR: '\x1b[31m',   // Red
      RESET: '\x1b[0m'
    };

    console.log(`${colors[level] || ''}[${level}]${colors.RESET} ${timestamp} - ${message}`,
      Object.keys(data).length > 0 ? data : '');

    // Write to log file
    try {
      fs.appendFileSync(this.logFile, logLine);
    } catch (err) {
      console.error('Failed to write to log file:', err.message);
    }
  },

  info(message, data) { this.log('INFO', message, data); },
  warn(message, data) { this.log('WARN', message, data); },
  error(message, data) { this.log('ERROR', message, data); }
};

// Log rotation - keep logs manageable (100KB max, keep last 5)
function rotateLogs() {
  try {
    if (fs.existsSync(logger.logFile)) {
      const stats = fs.statSync(logger.logFile);

      // If log file is > 100KB, rotate it
      if (stats.size > 100 * 1024) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const archiveName = `./server-${timestamp}.log`;

        // Rename current log to archive
        fs.renameSync(logger.logFile, archiveName);

        // Keep only last 5 log files
        const logFiles = fs.readdirSync('.')
          .filter(f => f.startsWith('server-') && f.endsWith('.log'))
          .sort()
          .reverse();

        // Delete old logs beyond 5
        logFiles.slice(5).forEach(file => {
          try {
            fs.unlinkSync(file);
          } catch (err) {
            // Ignore deletion errors
          }
        });

        logger.info('Log rotated', { archive: archiveName });
      }
    }
  } catch (err) {
    console.error('Log rotation failed:', err.message);
  }
}

// Run log rotation daily and on startup
rotateLogs();
setInterval(rotateLogs, 24 * 60 * 60 * 1000);

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
  '.css': 31536000,  // RESTORED: Back to 1 year cache
  '.js': 31536000,

  // HTML - no-cache for dynamic content
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
    logger.warn('Path traversal attempt blocked', { path: filePath });
    return null; // Invalid path
  }

  // Normalize path to prevent encoded traversal
  const decodedPath = decodeURIComponent(filePath);
  if (decodedPath.includes('..') || decodedPath.includes('\\')) {
    logger.warn('Encoded path traversal blocked', { path: filePath, decoded: decodedPath });
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
    logger.warn('Path traversal blocked (resolved)', { fullPath, resolved: resolvedPath });
    return null; // Path traversal attempt
  }

  // Additional: Only allow specific file extensions
  const allowedExtensions = Object.keys(mimeTypes);
  const extname = String(path.extname(resolvedPath)).toLowerCase();

  if (!allowedExtensions.includes(extname)) {
    logger.warn('Blocked file type', { extname, path: filePath });
    return null; // File type not allowed
  }

  return fullPath;
}

// Request counter for monitoring
const metrics = {
  requests: {
    total: 0,
    successful: 0,
    failed: 0,
    notFound: 0,
    forbidden: 0
  },
  startTime: Date.now()
};

// Health check endpoint
function handleHealthCheck(req, res) {
  const uptime = Date.now() - metrics.startTime;
  const health = {
    status: 'healthy',
    uptime: `${Math.floor(uptime / 1000)}s`,
    metrics: {
      total: metrics.requests.total,
      successful: metrics.requests.successful,
      failed: metrics.requests.failed,
      notFound: metrics.requests.notFound,
      forbidden: metrics.requests.forbidden
    },
    timestamp: new Date().toISOString()
  };

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(health, null, 2));
}

const server = http.createServer((req, res) => {
  metrics.requests.total++;

  // Health check endpoint
  if (req.url === '/health' || req.url === '/api/health') {
    handleHealthCheck(req, res);
    return;
  }

  const filePath = validateFilePath(req.url);

  // If validation fails, return 403 Forbidden
  if (!filePath) {
    metrics.requests.forbidden++;
    logger.warn('Request blocked - invalid path', {
      url: req.url,
      ip: req.socket.remoteAddress
    });
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
        metrics.requests.notFound++;
        logger.info('File not found', {
          path: filePath,
          url: req.url,
          ip: req.socket.remoteAddress
        });

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
        metrics.requests.failed++;
        logger.error('Server error reading file', {
          path: filePath,
          error: error.code,
          message: error.message,
          ip: req.socket.remoteAddress
        });
        res.writeHead(500);
        res.end('Server Error: ' + error.code);
      }
    } else {
      metrics.requests.successful++;

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

// Handle server errors
server.on('error', (error) => {
  logger.error('Server error', {
    code: error.code,
    message: error.message
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

// Log uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', {
    message: error.message,
    stack: error.stack
  });

  // Give logger time to write, then exit
  setTimeout(() => process.exit(1), 1000);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Promise Rejection', {
    reason: reason,
    promise: promise
  });
});

server.listen(PORT, () => {
  logger.info(`Server running at http://localhost:${PORT}/`);
  logger.info('Cache headers configured:');
  logger.info('- Images, fonts, CSS, JS: 1 year (immutable)');
  logger.info('- HTML: no-cache');
  logger.info('- JSON/manifest: 1 day');
  logger.info(`Health check: http://localhost:${PORT}/health`);
  console.log('\n=== Metrics ===');
  console.log('View live stats: curl http://localhost:' + PORT + '/health');
  console.log('===============\n');
});

// Log metrics every hour
setInterval(() => {
  logger.info('Server metrics', {
    uptime: `${Math.floor((Date.now() - metrics.startTime) / 1000)}s`,
    ...metrics.requests
  });
}, 60 * 60 * 1000);
