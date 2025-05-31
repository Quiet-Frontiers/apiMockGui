import React from 'react';
import ReactDOM from 'react-dom/client';
import { FloatingApiMockManager } from './components/FloatingApiMockManager';

// Global variables
let isInitialized = false;
let containerElement: HTMLDivElement | null = null;
let reactRoot: any = null;
let initAttempts = 0;
const MAX_INIT_ATTEMPTS = 10;

// Auto-initialization function
const initFloatingButton = () => {
  if (isInitialized) return;
  
  // Browser environment check
  if (typeof window === 'undefined') return;
  
  // Increment attempt counter
  initAttempts++;
  
  // 개선된 개발 환경 체크 (더 포괄적인 조건)
  const isDevelopment = 
    // 기존 조건들
    window.location.hostname.includes('localhost') || 
    window.location.hostname.includes('127.0.0.1') ||
    window.location.hostname.includes('192.168.') ||
    window.location.hostname.includes('10.') ||
    window.location.hostname.includes('172.') ||
    window.location.port !== '' ||
    window.location.hostname === '' ||
    // 추가 개발 환경 조건들
    window.location.protocol === 'file:' ||
    window.location.hostname === '0.0.0.0' ||
    // NODE_ENV 환경변수 체크 (있는 경우)
    (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') ||
    // 개발 도구가 열려있는 경우 (Chrome DevTools)
    (window as any).__VUE_DEVTOOLS_GLOBAL_HOOK__ ||
    (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__ ||
    // Vite 개발 서버 감지
    !!(window as any).__vite_plugin_react_preamble_installed__ ||
    // webpack 개발 서버 감지  
    !!(window as any).__webpack_dev_server__ ||
    // 기타 개발 환경 감지
    document.location.search.includes('dev=true') ||
    // 강제 활성화 플래그
    localStorage.getItem('apiMockGui.forceEnable') === 'true';

  // 개발 환경이 아닌 경우에도 강제 활성화 옵션 제공
  if (!isDevelopment) {
    console.log('🔒 API Mock GUI는 개발 환경에서만 자동 활성화됩니다.');
    console.log('💡 강제 활성화하려면: localStorage.setItem("apiMockGui.forceEnable", "true")');
    console.log('💡 또는 URL에 ?dev=true 파라미터를 추가하세요.');
    return;
  }

  try {
    // CSS 스타일 로드
    loadStyles();
    
    // Wait for React to be available
    if (typeof React === 'undefined' || typeof ReactDOM === 'undefined') {
      if (initAttempts < MAX_INIT_ATTEMPTS) {
        console.log(`⏳ Waiting for React to load... (attempt ${initAttempts}/${MAX_INIT_ATTEMPTS})`);
        setTimeout(initFloatingButton, 500);
        return;
      } else {
        console.error('❌ React not available after maximum attempts');
        return;
      }
    }

    // Check if container already exists (prevent duplicate initialization)
    const existingContainer = document.getElementById('api-mock-gui-floating-container');
    if (existingContainer) {
      console.log('🔄 Floating button container already exists, skipping initialization');
      isInitialized = true;
      return;
    }

    // Create container element
    containerElement = document.createElement('div');
    containerElement.id = 'api-mock-gui-floating-container';
    containerElement.setAttribute('data-api-mock-floating-button', 'true');
    containerElement.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 2147483647;
    `;
    
    // Wait for document.body to be available
    if (!document.body) {
      if (initAttempts < MAX_INIT_ATTEMPTS) {
        console.log(`⏳ Waiting for document.body... (attempt ${initAttempts}/${MAX_INIT_ATTEMPTS})`);
        setTimeout(initFloatingButton, 100);
        return;
      } else {
        console.error('❌ document.body not available after maximum attempts');
        return;
      }
    }

    document.body.appendChild(containerElement);

    // Create React root with better error handling
    if (typeof ReactDOM.createRoot === 'function') {
      reactRoot = ReactDOM.createRoot(containerElement);
    } else {
      // Fallback for older React versions
      reactRoot = {
        render: (element: React.ReactElement) => {
          (ReactDOM as any).render(element, containerElement);
        }
      };
    }

    // Render FloatingApiMockManager
    const floatingManager = React.createElement(FloatingApiMockManager, {
      serverConfig: {
        baseUrl: window.location.origin,
        environment: 'browser'
      },
      position: 'bottom-right',
      buttonText: 'API Mock',
      autoStart: true,
      draggable: true,
      minimizable: true,
      onServerStart: () => {
        console.log('🎭 API Mock Server started!');
      },
      onServerStop: () => {
        console.log('🛑 API Mock Server stopped.');
      }
    });

    reactRoot.render(floatingManager);
    isInitialized = true;

    console.log('🎭 API Mock GUI Floating Button auto-initialized!');
    console.log('💡 Click the floating button at bottom-right to use.');

  } catch (error) {
    console.error('API Mock GUI auto-initialization failed:', error);
    
    // Retry on error (with limit)
    if (initAttempts < MAX_INIT_ATTEMPTS) {
      console.log(`🔄 Retrying initialization in 1 second... (attempt ${initAttempts}/${MAX_INIT_ATTEMPTS})`);
      setTimeout(initFloatingButton, 1000);
    }
  }
};

// Multiple initialization strategies for better reliability
if (typeof window !== 'undefined') {
  // Strategy 1: Immediate if DOM is ready
  if (document.readyState === 'complete') {
    setTimeout(initFloatingButton, 50);
  }
  // Strategy 2: On DOM content loaded
  else if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(initFloatingButton, 50);
    });
  }
  // Strategy 3: On window load (fallback)
  else {
    setTimeout(initFloatingButton, 100);
  }

  // Strategy 4: Additional window load listener for safety
  window.addEventListener('load', () => {
    if (!isInitialized) {
      setTimeout(initFloatingButton, 100);
    }
  });

  // Provide global functions
  (window as any).apiMockGuiInit = () => {
    initAttempts = 0; // Reset attempts for manual init
    initFloatingButton();
  };
  
  (window as any).apiMockGuiCleanup = () => {
    if (!isInitialized) return;

    try {
      if (reactRoot && reactRoot.unmount) {
        reactRoot.unmount();
      }
      
      if (containerElement && containerElement.parentNode) {
        containerElement.parentNode.removeChild(containerElement);
      }
      
      isInitialized = false;
      containerElement = null;
      reactRoot = null;
      initAttempts = 0;
      
      console.log('🧹 API Mock GUI cleaned up.');
    } catch (error) {
      console.error('API Mock GUI cleanup failed:', error);
    }
  };
}

// CSS 스타일 로드
const loadStyles = () => {
  if (typeof document === 'undefined') return;
  
  // 이미 로드된 스타일시트가 있는지 확인
  if (document.querySelector('link[data-api-mock-gui-styles]')) return;
  
  try {
    // CSS를 동적으로 삽입
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/api-mock-gui/dist/styles.css'; // 패키지에서 CSS 로드 시도
    link.setAttribute('data-api-mock-gui-styles', 'true');
    document.head.appendChild(link);
  } catch (error) {
    console.warn('Could not load API Mock GUI styles:', error);
  }
}; 