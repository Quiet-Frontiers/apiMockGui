import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { Settings, ExternalLink } from 'lucide-react';
import { createMockServer } from '../msw/mockServer';
export const PopupApiMockManager = ({ serverConfig, autoStart = false, onServerStart, onServerStop, position = 'bottom-right', buttonText = 'API Mock', buttonIcon, popupWidth = 1000, popupHeight = 700, autoShow = true, onConfigChange, ...guiProps }) => {
    const [isServerRunning, setIsServerRunning] = useState(false);
    const [popupWindow, setPopupWindow] = useState(null);
    const mockServerRef = useRef(null);
    const messageHandlerRef = useRef(null);
    // MockServer 인스턴스 초기화
    useEffect(() => {
        if (!mockServerRef.current) {
            mockServerRef.current = createMockServer(serverConfig);
        }
    }, [serverConfig]);
    // 자동 시작
    useEffect(() => {
        if (autoStart && mockServerRef.current && !isServerRunning) {
            handleStartServer();
        }
    }, [autoStart]);
    // 메시지 핸들러 설정
    useEffect(() => {
        messageHandlerRef.current = (event) => {
            if (event.origin !== window.location.origin)
                return;
            const { type, data } = event.data;
            switch (type) {
                case 'MOCK_API_CONFIG_CHANGE':
                    handleConfigChange(data.apis);
                    break;
                case 'MOCK_SERVER_START':
                    handleStartServer();
                    break;
                case 'MOCK_SERVER_STOP':
                    handleStopServer();
                    break;
                case 'REQUEST_INITIAL_DATA':
                    // 팝업에 초기 데이터 전송
                    if (popupWindow && !popupWindow.closed) {
                        popupWindow.postMessage({
                            type: 'INITIAL_DATA',
                            data: {
                                serverConfig,
                                isServerRunning,
                                initialConfig: guiProps.initialConfig || [],
                                ...guiProps
                            }
                        }, window.location.origin);
                    }
                    break;
            }
        };
        window.addEventListener('message', messageHandlerRef.current);
        return () => {
            if (messageHandlerRef.current) {
                window.removeEventListener('message', messageHandlerRef.current);
            }
        };
    }, [serverConfig, isServerRunning, guiProps]);
    // 팝업 창 닫힘 감지
    useEffect(() => {
        if (!popupWindow)
            return;
        const checkClosed = setInterval(() => {
            if (popupWindow.closed) {
                setPopupWindow(null);
                clearInterval(checkClosed);
            }
        }, 1000);
        return () => clearInterval(checkClosed);
    }, [popupWindow]);
    const handleConfigChange = (apis) => {
        if (mockServerRef.current) {
            mockServerRef.current.updateHandlers(apis);
        }
        if (onConfigChange) {
            onConfigChange(apis);
        }
    };
    const handleStartServer = async () => {
        if (!mockServerRef.current)
            return;
        try {
            await mockServerRef.current.start();
            setIsServerRunning(true);
            if (onServerStart) {
                onServerStart();
            }
            // 팝업에 서버 상태 알림
            if (popupWindow && !popupWindow.closed) {
                popupWindow.postMessage({
                    type: 'SERVER_STATUS_CHANGE',
                    data: { isRunning: true }
                }, window.location.origin);
            }
        }
        catch (error) {
            console.error('Failed to start mock server:', error);
        }
    };
    const handleStopServer = async () => {
        if (!mockServerRef.current)
            return;
        try {
            await mockServerRef.current.stop();
            setIsServerRunning(false);
            if (onServerStop) {
                onServerStop();
            }
            // 팝업에 서버 상태 알림
            if (popupWindow && !popupWindow.closed) {
                popupWindow.postMessage({
                    type: 'SERVER_STATUS_CHANGE',
                    data: { isRunning: false }
                }, window.location.origin);
            }
        }
        catch (error) {
            console.error('Failed to stop mock server:', error);
        }
    };
    const openPopup = () => {
        if (popupWindow && !popupWindow.closed) {
            popupWindow.focus();
            return;
        }
        const left = (window.screen.width - popupWidth) / 2;
        const top = (window.screen.height - popupHeight) / 2;
        const popup = window.open('', 'api-mock-gui', `width=${popupWidth},height=${popupHeight},left=${left},top=${top},scrollbars=yes,resizable=yes`);
        if (popup) {
            popup.document.write(`
        <!DOCTYPE html>
        <html lang="ko">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>API Mock GUI</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; }
            #root { height: 100vh; }
          </style>
        </head>
        <body>
          <div id="root">
            <div style="display: flex; align-items: center; justify-content: center; height: 100vh; background: #f3f4f6;">
              <div style="text-align: center;">
                <div style="margin-bottom: 16px;">
                  <div style="width: 40px; height: 40px; border: 4px solid #e5e7eb; border-top: 4px solid #3b82f6; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto;"></div>
                </div>
                <p style="color: #6b7280;">API Mock GUI를 로딩 중...</p>
              </div>
            </div>
          </div>
          <style>
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          </style>
          <script>
            // 부모 창에 초기 데이터 요청
            window.opener.postMessage({ type: 'REQUEST_INITIAL_DATA' }, window.location.origin);
            
            // 부모 창으로부터 메시지 수신
            window.addEventListener('message', function(event) {
              if (event.origin !== window.location.origin) return;
              
              const { type, data } = event.data;
              
              if (type === 'INITIAL_DATA') {
                // React 앱 초기화
                initializeReactApp(data);
              } else if (type === 'SERVER_STATUS_CHANGE') {
                // 서버 상태 업데이트
                window.updateServerStatus && window.updateServerStatus(data.isRunning);
              }
            });
            
            function initializeReactApp(initialData) {
              // 여기서 React 앱을 동적으로 생성
              const script = document.createElement('script');
              script.innerHTML = \`
                window.INITIAL_DATA = \${JSON.stringify(initialData)};
                
                // API Mock GUI 컴포넌트를 렌더링하는 함수
                window.renderApiMockGui = function() {
                  const root = document.getElementById('root');
                  root.innerHTML = \`
                    <div style="height: 100vh; display: flex; flex-direction: column;">
                      <div style="background: #1f2937; color: white; padding: 16px; display: flex; align-items: center; justify-content: between;">
                        <h1 style="font-size: 20px; font-weight: bold;">🎭 API Mock GUI</h1>
                        <div style="display: flex; align-items: center; gap: 12px;">
                          <span style="font-size: 12px; color: #9ca3af;">독립 창 모드</span>
                          <button onclick="window.close()" style="background: #374151; border: none; color: white; padding: 8px 12px; border-radius: 4px; cursor: pointer;">닫기</button>
                        </div>
                      </div>
                      <div style="flex: 1; padding: 24px;">
                        <div style="text-align: center; padding: 40px;">
                          <h2 style="font-size: 24px; margin-bottom: 16px;">🚧 개발 중</h2>
                          <p style="color: #6b7280; margin-bottom: 24px;">팝업 모드의 GUI는 현재 개발 중입니다.</p>
                          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; text-align: left; max-width: 600px; margin: 0 auto;">
                            <h3 style="margin-bottom: 12px;">임시 제어 패널:</h3>
                            <button onclick="toggleServer()" id="serverToggle" style="background: #10b981; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; margin-right: 8px;">서버 시작</button>
                            <button onclick="openDevTools()" style="background: #3b82f6; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">개발자 도구</button>
                            <div style="margin-top: 16px;">
                              <p style="font-size: 14px; color: #6b7280;">
                                현재 상태: <span id="serverStatus" style="font-weight: bold; color: #ef4444;">중지됨</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  \`;
                };
                
                window.toggleServer = function() {
                  const button = document.getElementById('serverToggle');
                  const status = document.getElementById('serverStatus');
                  const isRunning = status.textContent === '실행 중';
                  
                  if (isRunning) {
                    window.opener.postMessage({ type: 'MOCK_SERVER_STOP' }, window.location.origin);
                  } else {
                    window.opener.postMessage({ type: 'MOCK_SERVER_START' }, window.location.origin);
                  }
                };
                
                window.updateServerStatus = function(isRunning) {
                  const button = document.getElementById('serverToggle');
                  const status = document.getElementById('serverStatus');
                  
                  if (button && status) {
                    if (isRunning) {
                      button.textContent = '서버 중지';
                      button.style.background = '#ef4444';
                      status.textContent = '실행 중';
                      status.style.color = '#10b981';
                    } else {
                      button.textContent = '서버 시작';
                      button.style.background = '#10b981';
                      status.textContent = '중지됨';
                      status.style.color = '#ef4444';
                    }
                  }
                };
                
                window.openDevTools = function() {
                  console.log('API Mock GUI 개발자 도구');
                  console.log('초기 데이터:', window.INITIAL_DATA);
                };
                
                // GUI 렌더링
                window.renderApiMockGui();
              \`;
              document.head.appendChild(script);
            }
          </script>
        </body>
        </html>
      `);
            popup.document.close();
            setPopupWindow(popup);
        }
    };
    // 위치 스타일 계산
    const getPositionStyle = () => {
        const baseStyle = {
            position: 'fixed',
            zIndex: 9999
        };
        switch (position) {
            case 'top-left':
                return { ...baseStyle, top: '20px', left: '20px' };
            case 'top-right':
                return { ...baseStyle, top: '20px', right: '20px' };
            case 'bottom-left':
                return { ...baseStyle, bottom: '20px', left: '20px' };
            case 'bottom-right':
            default:
                return { ...baseStyle, bottom: '20px', right: '20px' };
        }
    };
    if (!autoShow)
        return null;
    return (_jsxs("button", { onClick: openPopup, className: `
        flex items-center space-x-2 px-4 py-3 
        ${isServerRunning ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'}
        text-white rounded-full shadow-lg transition-all duration-200
        hover:shadow-xl active:scale-95
      `, style: getPositionStyle(), title: "API Mock GUI \uC5F4\uAE30", children: [buttonIcon || _jsx(Settings, { className: "w-5 h-5" }), buttonText && _jsx("span", { className: "text-sm font-medium", children: buttonText }), _jsx(ExternalLink, { className: "w-4 h-4" }), isServerRunning && (_jsx("div", { className: "w-2 h-2 bg-white rounded-full animate-pulse" }))] }));
};
