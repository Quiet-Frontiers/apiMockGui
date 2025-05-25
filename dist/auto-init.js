import React from 'react';
import ReactDOM from 'react-dom/client';
import { FloatingApiMockManager } from './components/FloatingApiMockManager';
// 전역 변수
let isInitialized = false;
let containerElement = null;
let reactRoot = null;
// 자동 초기화 함수
const initFloatingButton = () => {
    if (isInitialized)
        return;
    // 브라우저 환경 체크
    if (typeof window === 'undefined')
        return;
    // 개발 환경 체크 (localhost, 127.0.0.1, 포트 있는 경우)
    const isDevelopment = window.location.hostname.includes('localhost') ||
        window.location.hostname.includes('127.0.0.1') ||
        window.location.hostname.includes('192.168.') ||
        window.location.port !== '' ||
        window.location.hostname === '';
    // 개발 환경이 아니면 초기화하지 않음
    if (!isDevelopment) {
        console.log('🔒 API Mock GUI는 개발 환경에서만 자동 활성화됩니다.');
        return;
    }
    try {
        // 컨테이너 엘리먼트 생성
        containerElement = document.createElement('div');
        containerElement.id = 'api-mock-gui-floating-container';
        containerElement.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 999999;
    `;
        document.body.appendChild(containerElement);
        // React root 생성
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
        // FloatingApiMockManager 렌더링
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
                console.log('🎭 API Mock Server가 시작되었습니다!');
            },
            onServerStop: () => {
                console.log('🛑 API Mock Server가 중지되었습니다.');
            }
        });
        reactRoot.render(floatingManager);
        isInitialized = true;
        console.log('🎭 API Mock GUI Floating Button이 자동으로 생성되었습니다!');
        console.log('💡 우측 하단의 floating button을 클릭하여 사용하세요.');
    }
    catch (error) {
        console.error('API Mock GUI 자동 초기화 실패:', error);
    }
};
// DOM 로드 완료 후 자동 초기화
if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFloatingButton);
    }
    else {
        // DOM이 이미 로드된 경우
        setTimeout(initFloatingButton, 100);
    }
    // 전역 cleanup 함수 제공
    window.cleanupApiMockGui = () => {
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
            console.log('🧹 API Mock GUI가 정리되었습니다.');
        }
        catch (error) {
            console.error('API Mock GUI 정리 실패:', error);
        }
    };
}
