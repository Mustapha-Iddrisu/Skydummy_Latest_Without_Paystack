import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import ticketsRoutes from './backend/routes/tickets.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Middleware
  app.use(cors({
    origin: true,
    credentials: true
  }));
  app.use(express.json({ limit: '10mb' }));

  // API Routes
  app.use('/api/tickets', ticketsRoutes);
  
  // ✅ Log all incoming requests (helpful for debugging)
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'OK', 
      message: 'SkyDummy Backend is running',
      timestamp: new Date().toISOString()
    });
  });

  // Serve Frontend
  if (process.env.NODE_ENV === 'production') {
    const distPath = path.join(__dirname, 'frontend', 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      configFile: path.join(__dirname, 'frontend', 'vite.config.js'),
      root: path.join(__dirname, 'frontend'),
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 SkyDummy Server running on http://0.0.0.0:${PORT}`);
    console.log(`📋 Tickets API: http://localhost:${PORT}/api/tickets`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});