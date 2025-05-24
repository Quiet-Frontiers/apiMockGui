import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    exclude: ['msw/node']
  },
  ssr: {
    noExternal: ['msw']
  },
  resolve: {
    conditions: ['browser']
  },
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'ApiMockGui',
      fileName: (format) => `index.${format}.js`
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'msw/node'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  }
}) 