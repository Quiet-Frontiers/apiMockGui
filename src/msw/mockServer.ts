import { setupWorker } from 'msw/browser';
import { http, HttpResponse, type RequestHandler } from 'msw';
import { MockApi, MockResponseCase, MockServerConfig, MockServerInstance } from '../types';

export class MockServer implements MockServerInstance {
  private worker: any = null;
  private handlers: RequestHandler[] = [];
  private config: MockServerConfig;
  public isRunning = false;

  constructor(config: MockServerConfig = {}) {
    this.config = {
      environment: 'browser',
      onUnhandledRequest: 'bypass',
      ...config
    };
  }

  async start(): Promise<void> {
    if (this.isRunning) {
      console.warn('Mock server is already running');
      return;
    }

    try {
      if (this.config.environment === 'browser') {
        if (typeof window !== 'undefined') {
          this.worker = setupWorker(...this.handlers);
          await this.worker.start({
            onUnhandledRequest: this.config.onUnhandledRequest,
            serviceWorker: {
              url: '/mockServiceWorker.js'
            }
          });
        } else {
          throw new Error('Browser environment not available');
        }
      } else {
        // Node.js 환경은 현재 지원하지 않음 (개발 중)
        console.warn('Node.js environment is not supported in development mode');
        throw new Error('Node.js environment is not supported in development mode');
      }

      this.isRunning = true;
      console.log('🎭 Mock server started successfully');
    } catch (error) {
      console.error('Failed to start mock server:', error);
      throw error;
    }
  }

  async stop(): Promise<void> {
    if (!this.isRunning) {
      console.warn('Mock server is not running');
      return;
    }

    try {
      if (this.worker) {
        this.worker.stop();
        this.worker = null;
      }

      this.isRunning = false;
      console.log('🛑 Mock server stopped');
    } catch (error) {
      console.error('Failed to stop mock server:', error);
      throw error;
    }
  }

  updateHandlers(apis: MockApi[]): void {
    this.handlers = this.createHandlers(apis);

    if (this.isRunning) {
      if (this.worker) {
        this.worker.use(...this.handlers);
      }
    }

    console.log(`📡 Updated ${this.handlers.length} mock handlers`);
  }

  private createHandlers(apis: MockApi[]): RequestHandler[] {
    const handlers: RequestHandler[] = [];

    apis.forEach(api => {
      if (!api.isEnabled) return;

      const activeCase = api.cases.find(c => c.id === api.activeCase) || api.cases.find(c => c.isActive);
      if (!activeCase) return;

      const fullPath = this.buildFullPath(api.path);
      const method = api.method.toLowerCase() as keyof typeof http;

      const handler = http[method](fullPath, async () => {
        // 딜레이 시뮬레이션
        if (activeCase.delay && activeCase.delay > 0) {
          await new Promise(resolve => setTimeout(resolve, activeCase.delay));
        }

        return HttpResponse.json(activeCase.body, {
          status: activeCase.status,
          headers: activeCase.headers || {}
        });
      });

      handlers.push(handler);
    });

    return handlers;
  }

  private buildFullPath(path: string): string {
    const baseUrl = this.config.baseUrl || '';
    
    // path가 이미 절대 URL인 경우
    if (path.startsWith('http')) {
      return path;
    }

    // baseUrl이 있는 경우 조합
    if (baseUrl) {
      const cleanBase = baseUrl.replace(/\/$/, '');
      const cleanPath = path.startsWith('/') ? path : '/' + path;
      return cleanBase + cleanPath;
    }

    // 상대 경로 반환
    return path.startsWith('/') ? path : '/' + path;
  }

  getHandlerCount(): number {
    return this.handlers.length;
  }

  getConfig(): MockServerConfig {
    return { ...this.config };
  }
}

// 글로벌 인스턴스를 위한 팩토리 함수
let globalMockServer: MockServer | null = null;

export function createMockServer(config?: MockServerConfig): MockServer {
  return new MockServer(config);
}

export function getGlobalMockServer(config?: MockServerConfig): MockServer {
  if (!globalMockServer) {
    globalMockServer = new MockServer(config);
  }
  return globalMockServer;
} 