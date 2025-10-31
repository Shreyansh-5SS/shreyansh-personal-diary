const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const fs = require('fs');
const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure security headers
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

// Configure CORS
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Disable specific helmet middlewares that might block images
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "blob:"],
        connectSrc: ["'self'", "http://localhost:4000"],
      },
    },
  })
);

// Serve static files from uploads directory
app.use('/uploads', (req, res, next) => {
  // Handle directory listing for /uploads
  if (req.path === '/') {
    fs.readdir(uploadsDir, (err, files) => {
      if (err) {
        console.error('Error reading uploads directory:', err);
        return res.status(500).json({ error: 'Failed to read uploads directory' });
      }
      
      // Create HTML for directory listing
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Uploads Directory</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .file-list { list-style: none; padding: 0; }
              .file-list li { padding: 8px; border-bottom: 1px solid #eee; }
              .file-list a { color: #0066cc; text-decoration: none; }
              .file-list a:hover { text-decoration: underline; }
            </style>
          </head>
          <body>
            <h1>Uploads Directory</h1>
            <ul class="file-list">
              ${files.map(file => `
                <li>
                  <a href="/uploads/${file}">${file}</a>
                  ${file.match(/\.(jpg|jpeg|png|gif)$/i) ? 
                    `<br><img src="/uploads/${file}" style="max-width: 200px; margin: 10px 0;">` : 
                    ''}
                </li>`).join('')}
            </ul>
          </body>
        </html>
      `;
      
      res.setHeader('Content-Type', 'text/html');
      res.send(html);
    });
  } else {
    // Serve static files as before
    express.static(uploadsDir, {
      setHeaders: (res, path) => {
        res.set('Cross-Origin-Resource-Policy', 'cross-origin');
        res.set('Access-Control-Allow-Origin', 'http://localhost:5173');
      }
    })(req, res, next);
  }
});

// Routes
const diaryRoutes = require('./routes/diary');
const uploadRoutes = require('./routes/uploads');
const animeRoutes = require('./routes/anime');
const expensesRoutes = require('./routes/expenses');
const tasksRoutes = require('./routes/tasks');

app.use('/api/diary', diaryRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/anime', animeRoutes);
app.use('/api/expenses', expensesRoutes);
app.use('/api/tasks', tasksRoutes);

// Basic routes
app.get('/', (req, res) => {
  res.json({ message: 'Personal Diary API is running' });
});

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});