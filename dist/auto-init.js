import React from 'react';
import ReactDOM from 'react-dom/client';
import { FloatingApiMockManager } from './components/FloatingApiMockManager';
// Global variables
let isInitialized = false;
let containerElement = null;
let reactRoot = null;
let initAttempts = 0;
const MAX_INIT_ATTEMPTS = 10;
// Auto-initialization function
const initFloatingButton = () => {
    if (isInitialized)
        return;
    // Browser environment check
    if (typeof window === 'undefined')
        return;
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
        window.__VUE_DEVTOOLS_GLOBAL_HOOK__ ||
        window.__REACT_DEVTOOLS_GLOBAL_HOOK__ ||
        // Vite 개발 서버 감지
        !!window.__vite_plugin_react_preamble_installed__ ||
        // webpack 개발 서버 감지  
        !!window.__webpack_dev_server__ ||
        // 기타 개발 환경 감지
        document.location.search.includes('dev=true') ||
        // 강제 활성화 플래그
        localStorage.getItem('apiMockGui.forceEnable') === 'true';
    // 개발 환경이 아닌 경우에도 강제 활성화 옵션 제공
    if (!isDevelopment) {
        return;
    }
    try {
        // CSS 스타일 로드
        loadStyles();
        // Wait for React to be available
        if (typeof React === 'undefined' || typeof ReactDOM === 'undefined') {
            if (initAttempts < MAX_INIT_ATTEMPTS) {
                setTimeout(initFloatingButton, 500);
                return;
            }
            else {
                console.error('❌ React not available after maximum attempts');
                return;
            }
        }
        // Check if container already exists (prevent duplicate initialization)
        const existingContainer = document.getElementById('api-mock-gui-floating-container');
        if (existingContainer) {
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
                setTimeout(initFloatingButton, 100);
                return;
            }
            else {
                console.error('❌ document.body not available after maximum attempts');
                return;
            }
        }
        document.body.appendChild(containerElement);
        // Create React root with better error handling
        if (typeof ReactDOM.createRoot === 'function') {
            reactRoot = ReactDOM.createRoot(containerElement);
        }
        else {
            // Fallback for older React versions
            reactRoot = {
                render: (element) => {
                    ReactDOM.render(element, containerElement);
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
            resizable: true,
            onServerStart: () => {
                // Server started
            },
            onServerStop: () => {
                // Server stopped
            }
        });
        reactRoot.render(floatingManager);
        isInitialized = true;
    }
    catch (error) {
        console.error('API Mock GUI auto-initialization failed:', error);
        // Retry on error (with limit)
        if (initAttempts < MAX_INIT_ATTEMPTS) {
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
    window.apiMockGuiInit = () => {
        initAttempts = 0; // Reset attempts for manual init
        initFloatingButton();
    };
    window.apiMockGuiCleanup = () => {
        if (!isInitialized)
            return;
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
        }
        catch (error) {
            console.error('API Mock GUI cleanup failed:', error);
        }
    };
}
// CSS 스타일 로드
const loadStyles = () => {
    if (typeof document === 'undefined')
        return;
    // 이미 로드된 스타일시트가 있는지 확인
    if (document.querySelector('link[data-api-mock-gui-styles]') ||
        document.querySelector('style[data-api-mock-gui-styles]'))
        return;
    try {
        // 인라인 CSS를 사용하여 스타일 적용 (패키지 import 문제 방지)
        const style = document.createElement('style');
        style.setAttribute('data-api-mock-gui-styles', 'true');
        style.textContent = `
      /* API Mock GUI 기본 스타일 */
      .api-mock-floating-btn {
        all: initial;
        position: fixed !important;
        z-index: 2147483647 !important;
        pointer-events: auto !important;
        touch-action: manipulation !important;
        user-select: none !important;
      }
      
      .api-mock-panel {
        all: initial;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif !important;
        position: fixed !important;
        z-index: 2147483646 !important;
        background: white !important;
        border: 1px solid #E2E8F0 !important;
        border-radius: 12px !important;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
        pointer-events: auto !important;
      }
      
      .api-mock-panel button {
        font-family: inherit !important;
        cursor: pointer !important;
        outline: none !important;
      }
      
      .api-mock-panel input, .api-mock-panel select, .api-mock-panel textarea {
        font-family: inherit !important;
        outline: none !important;
      }
    `;
        document.head.appendChild(style);
    }
    catch (error) {
        console.warn('⚠️ API Mock GUI 스타일 로드 실패:', error);
    }
};
// Export 선언
export { initFloatingButton, loadStyles };
