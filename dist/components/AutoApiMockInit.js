import React from 'react';
import ReactDOM from 'react-dom/client';
import { PopupApiMockManager } from './PopupApiMockManager';
import { mswHelpers } from '../msw/setupMsw';
let isInitialized = false;
let containerElement = null;
let reactRoot = null;
export const AutoApiMockInit = (props) => {
    return null; // 이 컴포넌트는 실제로 렌더링되지 않음
};
// 자동 초기화 함수
export const initAutoApiMock = (options = {}) => {
    if (isInitialized || options.disabled)
        return;
    const { baseUrl = window.location.origin, environment = 'browser', development = !window.location.hostname.includes('localhost') ? false : true, position = 'bottom-right', buttonText = 'API Mock', autoStart = development } = options;
    try {
        // DOM이 로드된 후 실행
        const initializeButton = () => {
            if (isInitialized)
                return;
            // 컨테이너 엘리먼트 생성
            containerElement = document.createElement('div');
            containerElement.id = 'api-mock-gui-auto-container';
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
            // React root 생성 (React 18 방식)
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
            // 서버 설정
            const serverConfig = mswHelpers.createServerConfig({
                baseUrl,
                environment,
                development
            });
            // PopupApiMockManager 렌더링
            const mockManager = React.createElement(PopupApiMockManager, {
                serverConfig,
                autoStart,
                position,
                buttonText,
                autoShow: true,
                onServerStart: () => {
                    console.log('🎭 API Mock Server started automatically');
                },
                onServerStop: () => {
                    console.log('🛑 API Mock Server stopped');
                },
                onConfigChange: (apis) => {
                    console.log('API Mock configuration changed:', apis.length, 'endpoints');
                }
            });
            reactRoot.render(mockManager);
            isInitialized = true;
            console.log('🎭 API Mock GUI가 자동으로 초기화되었습니다!');
            console.log(`📍 위치: ${position}`);
            console.log(`🔧 개발 모드: ${development}`);
            console.log(`🚀 자동 시작: ${autoStart}`);
        };
        // DOM 준비 상태 확인
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeButton);
        }
        else {
            // DOM이 이미 로드된 경우
            setTimeout(initializeButton, 100);
        }
    }
    catch (error) {
        console.error('API Mock GUI 자동 초기화 실패:', error);
    }
};
// 정리 함수
export const cleanupAutoApiMock = () => {
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
// 환경 변수 또는 전역 설정 확인하여 자동 초기화
if (typeof window !== 'undefined') {
    // 브라우저 환경에서만 실행
    const autoInit = () => {
        // window 객체에서 설정 확인
        const config = window.API_MOCK_AUTO_INIT;
        if (config !== false) { // 명시적으로 false가 아닌 경우 자동 초기화        const isDevelopment = window.location.hostname.includes('localhost') || window.location.hostname.includes('127.0.0.1');        const defaultConfig: AutoApiMockInitProps = {          development: isDevelopment,          autoStart: isDevelopment,          ...(typeof config === 'object' ? config : {})        };                // 개발 모드가 아닌 경우 사용자가 명시적으로 활성화해야 함        if (!isDevelopment && !config) {          return;        }                initAutoApiMock(defaultConfig);
        }
    };
    // 다음 틱에서 초기화 (모듈 로드 완료 후)
    setTimeout(autoInit, 0);
}
