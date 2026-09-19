import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import summaryHandler from './api/generate-summary.js';
import askAiHandler from './api/ask-ai.js';

function apiDevServerPlugin() {
  return {
    name: 'api-dev-server-plugin',
    configureServer(server) {
      // Ensure server-side middleware has access to process.env loaded from env files
      const env = loadEnv(server.config.mode || 'development', process.cwd(), '');
      Object.assign(process.env, env);

      server.middlewares.use((req, res, next) => {
        if (req.url === '/api/generate-summary' || req.url === '/api/ask-ai') {
          const loadedEnv = loadEnv(server.config.mode || 'development', process.cwd(), '');
          Object.assign(process.env, loadedEnv);
          req.env = loadedEnv;

          let body = '';
          req.on('data', chunk => {
            body += chunk;
          });
          req.on('end', async () => {
            try {
              req.body = body ? JSON.parse(body) : {};
            } catch {
              req.body = {};
            }
            
            // Mock Vercel response methods
            res.status = (statusCode) => {
              res.statusCode = statusCode;
              return res;
            };
            res.json = (data) => {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
              return res;
            };

            if (req.url === '/api/generate-summary') {
              await summaryHandler(req, res);
            } else if (req.url === '/api/ask-ai') {
              await askAiHandler(req, res);
            }
          });
          return;
        }
        next();
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  Object.assign(process.env, env);

  return {
    plugins: [react(), apiDevServerPlugin()],
  };
});

