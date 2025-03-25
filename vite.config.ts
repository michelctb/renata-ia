
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      // Configuração do proxy para redirecionar para o servidor externo
      '/api/generate-report': {
        target: 'https://lovable.renata-ia.com.br',
        changeOrigin: true,
        secure: true,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('Erro no proxy:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Proxy request:', req.method, req.url);
            
            // Preserva o header x-api-key se estiver presente na requisição original
            const apiKey = req.headers['x-api-key'];
            if (apiKey) {
              proxyReq.setHeader('x-api-key', apiKey);
            } else if (req.method === 'POST') {
              // Adiciona o header x-api-key padrão para requisições POST se não estiver presente
              proxyReq.setHeader('x-api-key', '784ce4af-6987-4711-b5bd-920f1d67a8d4');
            }
            
            // Mantém outros headers importantes
            proxyReq.setHeader('Content-Type', 'application/json');
          });
        }
      }
    }
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
