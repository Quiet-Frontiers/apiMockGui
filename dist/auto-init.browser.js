// API Mock GUI - 브라우저 전용 자동 초기화 (Vanilla JS 버전)
(function(window) {
    'use strict';
    
    // 전역 변수들
    let isInitialized = false;
    let containerElement = null;
    let isOpen = false;
    let isServerRunning = false;
    let initAttempts = 0;
    const MAX_INIT_ATTEMPTS = 10;
    
    // Database SVG 아이콘 생성 함수
    function createDatabaseIcon() {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '28');
        svg.setAttribute('height', '28');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('fill', 'none');
        svg.setAttribute('stroke', 'white');
        svg.setAttribute('stroke-width', '2.5');
        svg.style.pointerEvents = 'none';
        
        const ellipse1 = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
        ellipse1.setAttribute('cx', '12');
        ellipse1.setAttribute('cy', '5');
        ellipse1.setAttribute('rx', '9');
        ellipse1.setAttribute('ry', '3');
        
        const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path1.setAttribute('d', 'M21 12c0 1.66-4 3-9 3s-9-1.34-9-3');
        
        const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path2.setAttribute('d', 'M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5');
        
        svg.appendChild(ellipse1);
        svg.appendChild(path1);
        svg.appendChild(path2);
        
        return svg;
    }
    
    // 플로팅 버튼 HTML 생성 함수
    function createFloatingButton() {
        const button = document.createElement('button');
        button.id = 'api-mock-floating-btn';
        button.title = isServerRunning ? '🎭 API Mock 실행 중 - 클릭하여 관리' : '🎭 API Mock 중단됨 - 클릭하여 시작';
        
        // Database 아이콘 추가
        const iconContainer = document.createElement('div');
        iconContainer.style.cssText = `
            color: white !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            pointer-events: none !important;
        `;
        
        const databaseIcon = createDatabaseIcon();
        iconContainer.appendChild(databaseIcon);
        
        // 실행 상태 표시 점
        const statusDot = document.createElement('div');
        statusDot.id = 'status-dot';
        statusDot.style.cssText = `
            position: absolute !important;
            top: -3px !important;
            right: -3px !important;
            width: 20px !important;
            height: 20px !important;
            background-color: #22C55E !important;
            border-radius: 50% !important;
            border: 3px solid white !important;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2) !important;
            display: ${isServerRunning ? 'block' : 'none'} !important;
            pointer-events: none !important;
        `;
        
        button.appendChild(iconContainer);
        button.appendChild(statusDot);
        
        // 스타일 적용 (더 강력하게)
        button.style.cssText = `
            position: fixed !important;
            bottom: 20px !important;
            right: 20px !important;
            width: 60px !important;
            height: 60px !important;
            border-radius: 50% !important;
            background-color: ${isServerRunning ? '#10B981' : '#3B82F6'} !important;
            color: white !important;
            border: 3px solid rgba(255, 255, 255, 0.3) !important;
            cursor: pointer !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3), 0 4px 8px rgba(0, 0, 0, 0.1) !important;
            z-index: 2147483647 !important;
            transition: all 0.3s ease !important;
            pointer-events: auto !important;
            margin: 0 !important;
            padding: 0 !important;
            top: auto !important;
            left: auto !important;
            transform: none !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
            backdrop-filter: blur(10px) !important;
            outline: none !important;
        `;
        
        // 호버 효과
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.4), 0 6px 12px rgba(0, 0, 0, 0.2)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.3), 0 4px 8px rgba(0, 0, 0, 0.1)';
        });
        
        button.addEventListener('mousedown', function() {
            this.style.transform = 'scale(0.95)';
        });
        
        button.addEventListener('mouseup', function() {
            this.style.transform = 'scale(1.1)';
        });
        
        // 클릭 이벤트 (여러 방식으로 바인딩)
        button.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            openPanel();
            return false;
        };
        
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            openPanel();
        }, true);
        
        return button;
    }
    
    // 아이콘 생성 함수들
    function createPlayIcon() {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '16');
        svg.setAttribute('height', '16');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('fill', 'white');
        svg.style.pointerEvents = 'none';
        
        const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        polygon.setAttribute('points', '5,3 19,12 5,21');
        svg.appendChild(polygon);
        
        return svg;
    }
    
    function createStopIcon() {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '16');
        svg.setAttribute('height', '16');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('fill', 'white');
        svg.style.pointerEvents = 'none';
        
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', '6');
        rect.setAttribute('y', '6');
        rect.setAttribute('width', '12');
        rect.setAttribute('height', '12');
        rect.setAttribute('rx', '2');
        svg.appendChild(rect);
        
        return svg;
    }
    
    // 서버 시작 함수
    function startServer() {
        isServerRunning = true;
        
        // 플로팅 버튼 업데이트
        updateFloatingButton();
        
        // 패널의 버튼들도 업데이트
        updatePanelButtons();
        
        // 성공 메시지
        showNotification('🟢 Mock 서버가 시작되었습니다!', 'success');
    }
    
    // 서버 중지 함수
    function stopServer() {
        isServerRunning = false;
        
        // 플로팅 버튼 업데이트
        updateFloatingButton();
        
        // 패널의 버튼들도 업데이트
        updatePanelButtons();
        
        // 중지 메시지
        showNotification('🛑 Mock 서버가 중지되었습니다!', 'info');
    }
    
    // 플로팅 버튼 업데이트
    function updateFloatingButton() {
        const button = document.getElementById('api-mock-floating-btn');
        if (button) {
            button.style.backgroundColor = isServerRunning ? '#10B981' : '#3B82F6';
            button.title = isServerRunning ? '🎭 API Mock 실행 중 - 클릭하여 관리' : '🎭 API Mock 중단됨 - 클릭하여 시작';
            
            const statusDot = button.querySelector('#status-dot');
            if (statusDot) {
                statusDot.style.display = isServerRunning ? 'block' : 'none';
            }
        }
    }
    
    // 패널 버튼들 업데이트
    function updatePanelButtons() {
        const startBtn = document.getElementById('start-server-btn');
        if (startBtn) {
            const iconContainer = startBtn.querySelector('.btn-icon');
            if (iconContainer) {
                iconContainer.innerHTML = '';
                iconContainer.appendChild(isServerRunning ? createStopIcon() : createPlayIcon());
            }
            
            const textSpan = startBtn.querySelector('.btn-text');
            if (textSpan) {
                textSpan.textContent = isServerRunning ? 'Stop' : 'Start';
            }
            
            startBtn.style.backgroundColor = isServerRunning ? '#EF4444' : '#10B981';
        }
        
        const statusText = document.getElementById('server-status');
        if (statusText) {
            statusText.textContent = isServerRunning ? 'Running' : 'Stopped';
            statusText.style.color = isServerRunning ? '#10B981' : '#64748B';
        }
    }
    
    // 알림 메시지 표시
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed !important;
            top: 20px !important;
            right: 20px !important;
            background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#3B82F6'} !important;
            color: white !important;
            padding: 12px 20px !important;
            border-radius: 8px !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
            z-index: 2147483648 !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
            font-size: 14px !important;
            max-width: 300px !important;
            pointer-events: auto !important;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // 3초 후 자동 제거
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }
    
    // 패널 HTML 생성 함수
    function createPanel() {
        const panel = document.createElement('div');
        panel.id = 'api-mock-panel';
        
        // 스타일 적용 (더 강력하게)
        panel.style.cssText = `
            position: fixed !important;
            bottom: 100px !important;
            right: 20px !important;
            width: 400px !important;
            height: 500px !important;
            background-color: white !important;
            border-radius: 12px !important;
            border: 1px solid #E2E8F0 !important;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1) !important;
            z-index: 2147483646 !important;
            overflow: hidden !important;
            pointer-events: auto !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
            margin: 0 !important;
            padding: 0 !important;
            top: auto !important;
            left: auto !important;
            transform: none !important;
            display: block !important;
        `;
        
        panel.innerHTML = `
            <div style="display: flex !important; align-items: center !important; justify-content: space-between !important; padding: 16px 20px !important; border-bottom: 1px solid #E2E8F0 !important; background-color: #F8FAFC !important; margin: 0 !important;">
                <h2 style="margin: 0 !important; font-size: 16px !important; font-weight: 600 !important; color: #1F2937 !important;">🎭 API Mock Manager</h2>
                <button id="close-panel-btn" style="background: none !important; border: none !important; font-size: 18px !important; cursor: pointer !important; padding: 4px !important; border-radius: 4px !important; color: #6B7280 !important; outline: none !important;">❌</button>
            </div>
            <div style="padding: 20px !important; height: calc(100% - 65px) !important; overflow: auto !important;">
                <!-- Server Status Section -->
                <div style="background-color: #F1F5F9 !important; padding: 20px !important; border-radius: 12px !important; border: 1px solid #E2E8F0 !important; margin-bottom: 20px !important;">
                    <div style="display: flex !important; align-items: center !important; justify-content: space-between !important; margin-bottom: 16px !important;">
                        <h3 style="font-weight: 600 !important; font-size: 16px !important; color: #1E293B !important; margin: 0 !important;">Mock Server</h3>
                        <div style="display: flex !important; align-items: center !important; gap: 8px !important;">
                            <span style="width: 16px !important; height: 16px !important; background: ${isServerRunning ? '#10B981' : '#94A3B8'} !important; border-radius: 50% !important; display: inline-block !important;"></span>
                            <span id="server-status" style="font-size: 14px !important; color: ${isServerRunning ? '#10B981' : '#64748B'} !important; font-weight: 500 !important;">${isServerRunning ? 'Running' : 'Stopped'}</span>
                        </div>
                    </div>
                    <div style="display: flex !important; align-items: center !important; gap: 12px !important;">
                        <button id="start-server-btn" style="display: flex !important; align-items: center !important; gap: 8px !important; padding: 8px 16px !important; border-radius: 8px !important; border: none !important; font-size: 14px !important; font-weight: 500 !important; cursor: pointer !important; background-color: ${isServerRunning ? '#EF4444' : '#10B981'} !important; color: white !important; transition: background-color 0.2s !important; pointer-events: auto !important; outline: none !important;">
                            <span class="btn-icon"></span>
                            <span class="btn-text">${isServerRunning ? 'Stop' : 'Start'}</span>
                        </button>
                        <span style="font-size: 14px !important; color: #64748B !important;">Ready for testing</span>
                    </div>
                </div>
                
                <!-- Info Section -->
                <div style="text-align: center !important; color: #6B7280 !important; line-height: 1.6 !important;">
                    <h3 style="margin: 0 0 10px 0 !important; color: #1F2937 !important;">🎭 API Mock GUI</h3>
                    <p style="margin: 10px 0 !important;">현재 브라우저 테스트 버전입니다.</p>
                    <p style="margin: 10px 0 !important;">실제 프로젝트에서는 npm 패키지를 사용하세요:</p>
                    <code style="display: block !important; background: #F3F4F6 !important; padding: 8px !important; border-radius: 4px !important; margin: 10px 0 !important; font-size: 14px !important; color: #374151 !important;">import 'api-mock-gui/auto';</code>
                    <div style="margin-top: 20px !important;">
                        <button id="add-api-btn" style="background: #3B82F6 !important; color: white !important; border: none !important; padding: 8px 16px !important; border-radius: 6px !important; cursor: pointer !important; margin: 5px !important; font-size: 14px !important; pointer-events: auto !important; outline: none !important;">➕ Add API</button>
                        <button id="save-config-btn" style="background: #8B5CF6 !important; color: white !important; border: none !important; padding: 8px 16px !important; border-radius: 6px !important; cursor: pointer !important; margin: 5px !important; font-size: 14px !important; pointer-events: auto !important; outline: none !important;">💾 Save Config</button>
                    </div>
                    <p style="margin: 20px 0 10px 0 !important; font-size: 12px !important; color: #94A3B8 !important;">
                        완전한 GUI는 npm 패키지에서 이용하세요<br>
                        npm install api-mock-gui
                    </p>
                </div>
            </div>
        `;
        
        // 패널 내부 버튼들 이벤트 바인딩
        setTimeout(() => {
            const closeBtn = panel.querySelector('#close-panel-btn');
            const startBtn = panel.querySelector('#start-server-btn');
            const addBtn = panel.querySelector('#add-api-btn');
            const saveBtn = panel.querySelector('#save-config-btn');
            
            if (closeBtn) {
                closeBtn.onclick = function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    closePanel();
                };
            }
            
            if (startBtn) {
                // 아이콘 추가
                const iconContainer = startBtn.querySelector('.btn-icon');
                if (iconContainer) {
                    iconContainer.appendChild(isServerRunning ? createStopIcon() : createPlayIcon());
                }
                
                startBtn.onclick = function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    if (isServerRunning) {
                        stopServer();
                    } else {
                        startServer();
                    }
                };
                
                // 호버 효과
                startBtn.addEventListener('mouseenter', function() {
                    this.style.backgroundColor = isServerRunning ? '#DC2626' : '#059669';
                });
                
                startBtn.addEventListener('mouseleave', function() {
                    this.style.backgroundColor = isServerRunning ? '#EF4444' : '#10B981';
                });
            }
            
            if (addBtn) {
                addBtn.onclick = function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    showNotification('➕ API 추가 기능\n\n실제 프로젝트에서는 완전한 GUI를 사용할 수 있습니다.', 'info');
                };
            }
            
            if (saveBtn) {
                saveBtn.onclick = function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    showNotification('💾 설정이 저장되었습니다!', 'success');
                };
            }
        }, 100);
        
        return panel;
    }
    
    // 패널 열기
    function openPanel() {
        if (isOpen) return;
        
        isOpen = true;
        
        // 기존 패널 제거
        const existingPanel = document.getElementById('api-mock-panel');
        if (existingPanel) {
            existingPanel.remove();
        }
        
        // 플로팅 버튼 완전히 제거 (스타일 변경 대신)
        const floatingBtn = document.getElementById('api-mock-floating-btn');
        if (floatingBtn) {
            floatingBtn.remove();
        }
        
        // 새 패널 생성 및 직접 body에 추가
        const panel = createPanel();
        document.body.appendChild(panel);
    }
    
    // 패널 닫기
    function closePanel() {
        isOpen = false;
        
        // 패널 제거
        const panel = document.getElementById('api-mock-panel');
        if (panel) {
            panel.remove();
        }
        
        // 플로팅 버튼 다시 생성하고 추가 (스타일 변경 대신)
        const existingBtn = document.getElementById('api-mock-floating-btn');
        if (existingBtn) {
            existingBtn.remove(); // 혹시 있다면 제거
        }
        
        const newFloatingButton = createFloatingButton();
        document.body.appendChild(newFloatingButton);
    }
    
    // CSS 스타일 로드 함수
    const loadStyles = () => {
        if (typeof document === 'undefined') return;
        
        // 이미 로드된 스타일시트가 있는지 확인
        if (document.querySelector('style[data-api-mock-gui-styles]')) return;
        
        try {
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
                
                /* 펄스 애니메이션 */
                @keyframes api-mock-pulse {
                    0% { opacity: 1; }
                    50% { opacity: 0.7; }
                    100% { opacity: 1; }
                }
                
                #status-dot {
                    animation: api-mock-pulse 2s infinite;
                }
            `;
            document.head.appendChild(style);
        } catch (error) {
            console.warn('⚠️ API Mock GUI 스타일 로드 실패:', error);
        }
    };
    
    // 자동 초기화 함수
    const initFloatingButton = () => {
        if (isInitialized) return;
        if (typeof window === 'undefined') return;
        
        initAttempts++;
        
        // 개발 환경 체크 (더 포괄적한 조건)
        const isDevelopment = 
            window.location.hostname.includes('localhost') || 
            window.location.hostname.includes('127.0.0.1') ||
            window.location.hostname.includes('192.168.') ||
            window.location.hostname.includes('10.') ||
            window.location.hostname.includes('172.') ||
            window.location.port !== '' ||
            window.location.hostname === '' ||
            window.location.protocol === 'file:' ||
            window.location.hostname === '0.0.0.0' ||
            (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') ||
            window.__VUE_DEVTOOLS_GLOBAL_HOOK__ ||
            window.__REACT_DEVTOOLS_GLOBAL_HOOK__ ||
            !!window.__vite_plugin_react_preamble_installed__ ||
            !!window.__webpack_dev_server__ ||
            document.location.search.includes('dev=true') ||
            localStorage.getItem('apiMockGui.forceEnable') === 'true';
        
        if (!isDevelopment) {
            return;
        }
        
        try {
            // CSS 스타일 로드
            loadStyles();
            
            // document.body가 준비될 때까지 대기
            if (!document.body) {
                if (initAttempts < MAX_INIT_ATTEMPTS) {
                    setTimeout(initFloatingButton, 100);
                    return;
                } else {
                    console.error('❌ document.body가 준비되지 않았습니다');
                    return;
                }
            }
            
            // 기존 컨테이너 확인 (중복 초기화 방지)
            const existingContainer = document.getElementById('api-mock-floating-btn');
            if (existingContainer) {
                isInitialized = true;
                return;
            }
            
            // 플로팅 버튼 생성 및 추가
            const floatingButton = createFloatingButton();
            document.body.appendChild(floatingButton);
            
            isInitialized = true;
            
        } catch (error) {
            console.error('API Mock GUI 초기화 실패:', error);
            
            // 재시도 (제한적)
            if (initAttempts < MAX_INIT_ATTEMPTS) {
                setTimeout(initFloatingButton, 1000);
            }
        }
    };
    
    // 여러 초기화 전략으로 안정성 향상
    if (typeof window !== 'undefined') {
        // 전략 1: DOM이 준비된 경우 즉시 실행
        if (document.readyState === 'complete') {
            setTimeout(initFloatingButton, 50);
        }
        // 전략 2: DOM 로딩 중인 경우 DOMContentLoaded 대기
        else if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(initFloatingButton, 50);
            });
        }
        // 전략 3: interactive 상태인 경우 약간의 지연 후 실행
        else {
            setTimeout(initFloatingButton, 100);
        }
        
        // 전략 4: window.load 이벤트 추가 대기 (안전장치)
        window.addEventListener('load', () => {
            if (!isInitialized) {
                setTimeout(initFloatingButton, 100);
            }
        });
        
        // 전역 함수 제공
        window.apiMockGuiInit = () => {
            initAttempts = 0; // 시도 횟수 초기화
            initFloatingButton();
        };
        
        window.apiMockGuiCleanup = () => {
            if (!isInitialized) return;
            
            try {
                // 플로팅 버튼 제거
                const floatingBtn = document.getElementById('api-mock-floating-btn');
                if (floatingBtn && floatingBtn.parentNode) {
                    floatingBtn.parentNode.removeChild(floatingBtn);
                }
                
                // 패널 제거
                const panel = document.getElementById('api-mock-panel');
                if (panel && panel.parentNode) {
                    panel.parentNode.removeChild(panel);
                }
                
                // 스타일 제거
                const style = document.querySelector('style[data-api-mock-gui-styles]');
                if (style && style.parentNode) {
                    style.parentNode.removeChild(style);
                }
                
                isInitialized = false;
                isOpen = false;
                initAttempts = 0;
                
            } catch (error) {
                console.error('API Mock GUI 정리 실패:', error);
            }
        };
        
        window.apiMockGuiToggleServer = () => {
            if (isServerRunning) {
                stopServer();
            } else {
                startServer();
            }
        };
    }
    
})(window); 