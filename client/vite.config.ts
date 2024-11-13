import { defineConfig } from 'vite'
import { resolve } from 'path'
import react from '@vitejs/plugin-react'
import type { UserConfig } from 'vite'

export default defineConfig(({ command }) => ({
  plugins: [react()],
  // Different configurations based on mode
  build: {
    outDir: resolve(__dirname, '../src/main/webapp/dist'),
    emptyOutDir: true,
    // Only use lib config when building for production
    ...(command === 'build' ? {
      lib: {
        entry: resolve(__dirname, 'src/main.tsx'),
        name: 'SciencePortal',
        fileName: () => 'react-app.js',
        formats: ['iife']
      },
      rollupOptions: {
        output: {
          inlineDynamicImports: true,
          globals: {
            'react': 'React',
            'react-dom': 'ReactDOM'
          },
          assetFileNames: (assetInfo: { name?: string }) => {
            if (assetInfo.name && assetInfo.name.endsWith('.css')) {
              return 'react-app.css'
            }
            return 'assets/[name].[ext]'
          }
        },
        external: ['react', 'react-dom']
      }
    } : {}), // Empty object for development mode
  },
  define: {
    'process.env': {},
    'process.env.NODE_ENV': JSON.stringify(command === 'serve' ? 'development' : 'production')
  }
}) as UserConfig)