const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const noteRoutes = require('./routes/notes');

function createApp(options = {}) {
  const { serveStatic = false } = options;
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: '1mb' }));
  app.use('/api/auth', authRoutes);
  app.use('/api/notes', noteRoutes);
  app.get('/api/health', (req, res) => res.json({ ok: true }));

  if (serveStatic) {
    app.use(express.static(path.join(__dirname, 'public')));
  }

  return app;
}

module.exports = { createApp };
