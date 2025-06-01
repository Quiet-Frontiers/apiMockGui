import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { writeFileSync } from 'fs'
import { join } from 'path'
import type { IncomingMessage, ServerResponse } from 'http'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // 개발 환경에서 파일 저장을 위한 커스텀 플러그인
    {
      name: 'api-config-saver',
      configureServer(server) {
        server.middlewares.use('/api/save-config', (req: IncomingMessage, res: ServerResponse, next: () => void) => {
          if (req.method === 'POST') {
            let body = '';
            req.on('data', (chunk: Buffer) => {
              body += chunk.toString();
            });
            req.on('end', () => {
              try {
                const { filePath, config } = JSON.parse(body);
                const fullPath = join(process.cwd(), filePath);
                writeFileSync(fullPath, JSON.stringify(config, null, 2), 'utf8');
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: 'Config saved successfully' }));
                
                console.log(`✅ API 설정이 저장되었습니다: ${fullPath}`);
              } catch (error: any) {
                console.error('❌ 설정 저장 실패:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: error.message }));
              }
            });
          } else {
            next();
          }
        });
      }
    }
  ],
  // 개발 환경에서 dist 폴더도 정적 파일로 제공
  publicDir: 'public',
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
  // 개발 서버 설정 - dist 폴더의 파일들을 제공
  server: {
    fs: {
      allow: ['..', '.', 'dist']
    }
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