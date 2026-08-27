import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import ticketsRoutes from './backend/routes/tickets.js';
import selarRoutes from './backend/routes/selar.js';

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
  app.use('/api/selar', selarRoutes);
  
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

  // Serve Frontend with SPA Catch-all
  if (process.env.NODE_ENV === 'production') {
    const frontendDist = path.join(__dirname, 'frontend', 'dist');
    const rootDist = path.join(__dirname, 'dist');
    const distPath = fs.existsSync(frontendDist) ? frontendDist : (fs.existsSync(rootDist) ? rootDist : frontendDist);
    
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      if (req.path.startsWith('/api')) {
        return res.status(404).json({ error: 'API route not found' });
      }
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

    // SPA fallback in development mode
    app.use('*', async (req, res, next) => {
      if (req.originalUrl.startsWith('/api')) {
        return next();
      }
      try {
        const url = req.originalUrl;
        const indexPath = path.resolve(__dirname, 'frontend', 'index.html');
        let template = fs.readFileSync(indexPath, 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 SkyDummy Server running on http://0.0.0.0:${PORT}`);
    console.log(`📋 Tickets API: http://localhost:${PORT}/api/tickets`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});