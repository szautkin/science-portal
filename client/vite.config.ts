import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import type { UserConfig } from 'vite';

export default defineConfig(
  ({ command }) =>
    ({
      plugins: [react()],
      base: 'science-portal',
      server: {
        port: 5173,
        proxy: {
          '^/science-portal/userinfo': {
            target: 'https://haproxy.cadc.dao.nrc.ca',
            changeOrigin: true,
            secure: false,
          },
          '^/science-portal/session': {
            target: 'https://haproxy.cadc.dao.nrc.ca',
            changeOrigin: true,
            secure: false,
          },
          '^/science-portal/context': {
            target: 'https://haproxy.cadc.dao.nrc.ca',
            changeOrigin: true,
            secure: false,
          },
          '^/science-portal/image': {
            target: 'https://haproxy.cadc.dao.nrc.ca',
            changeOrigin: true,
            secure: false,
          },
          '/science-portal/oidc-login': {
            target: 'https://ska-iam.stfc.ac.uk/authorize',
            changeOrigin: true,
            secure: false,
            selfHandleResponse: true,
            configure: (proxy, options) => {
              proxy.on('proxyReq', (proxyReq, req, res) => {
                const authUrl = new URL('https://ska-iam.stfc.ac.uk/authorize');
                authUrl.searchParams.set('response_type', 'code');
                authUrl.searchParams.set(
                  'redirect_uri',
                  'http://localhost:5173/science-portal/oidc-callback',
                );
                authUrl.searchParams.set(
                  'client_id',
                  '83b50c08-25a7-460e-9d03-42500d4f88cb',
                );
                authUrl.searchParams.set(
                  'scope',
                  'openid profile offline_access',
                );

                res.writeHead(302, {
                  Location: authUrl.toString(),
                });
                res.end();
              });
            },
          },
          '/science-portal/oidc-callback': {
            // Moved inside proxy object
            target: 'https://haproxy.cadc.dao.nrc.ca',
            changeOrigin: true,
            secure: false,
            configure: (proxy, options) => {
              proxy.on('proxyRes', function (proxyRes, req, res) {
                // Remove CORS headers from upstream
                delete proxyRes.headers['access-control-allow-origin'];

                // Preserve cookies
                if (proxyRes.headers['set-cookie']) {
                  const cookies = proxyRes.headers['set-cookie'].map((cookie) =>
                    cookie.replace(/Domain=[^;]+/, 'Domain=localhost'),
                  );
                  proxyRes.headers['set-cookie'] = cookies;
                }

                // Copy all response headers
                Object.keys(proxyRes.headers).forEach((key) => {
                  res.setHeader(key, proxyRes.headers[key]);
                });
              });
            },
          },
        },
      },
      // Rest of your config remains the same
      build: {
        outDir: resolve(__dirname, '../src/main/webapp/dist'),
        emptyOutDir: true,
        ...(command === 'build'
          ? {
              lib: {
                entry: resolve(__dirname, 'src/main.tsx'),
                name: 'SciencePortal',
                fileName: () => 'react-app.js',
                formats: ['iife'],
              },
              rollupOptions: {
                output: {
                  inlineDynamicImports: true,
                  globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                  },
                  assetFileNames: (assetInfo: { name?: string }) => {
                    if (assetInfo.name && assetInfo.name.endsWith('.css')) {
                      return 'react-app.css';
                    }
                    return 'assets/[name].[ext]';
                  },
                },
                external: ['react', 'react-dom'],
              },
            }
          : {}),
      },
      define: {
        'process.env': {},
        'process.env.NODE_ENV': JSON.stringify(
          command === 'serve' ? 'development' : 'production',
        ),
      },
    }) as UserConfig,
);
