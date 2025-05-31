// API Mock GUI - 브라우저 전용 자동 초기화 (Vanilla JS 버전)
(function(window) {
    'use strict';
    
    // 전역 변수들
    let isInitialized = false;
    let containerElement = null;
    let isOpen = false;
    let initAttempts = 0;
    const MAX_INIT_ATTEMPTS = 10;
    
    // 플로팅 버튼 HTML 생성 함수
    function createFloatingButton() {
        const button = document.createElement('button');
        button.innerHTML = '🎭';
        button.title = 'API Mock GUI - 클릭하여 열기';
        button.id = 'api-mock-floating-btn';
        
        // 스타일 적용 (더 강력하게)
        button.style.cssText = `
            position: fixed !important;
            bottom: 20px !important;
            right: 20px !important;
            width: 60px !important;
            height: 60px !important;
            border-radius: 50% !important;
            background-color: #3B82F6 !important;
            color: white !important;
            border: none !important;
            cursor: pointer !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 24px !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
            z-index: 2147483647 !important;
            transition: all 0.3s ease !important;
            pointer-events: auto !important;
            margin: 0 !important;
            padding: 0 !important;
            top: auto !important;
            left: auto !important;
            transform: none !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        `;
        
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
                <button id="close-panel-btn" style="background: none !important; border: none !important; font-size: 18px !important; cursor: pointer !important; padding: 4px !important; border-radius: 4px !important; color: #6B7280 !important;">❌</button>
            </div>
            <div style="padding: 20px !important; height: calc(100% - 65px) !important; overflow: auto !important;">
                <div style="text-align: center !important; color: #6B7280 !important; line-height: 1.6 !important;">
                    <h3 style="margin: 0 0 10px 0 !important; color: #1F2937 !important;">🎭 API Mock GUI</h3>
                    <p style="margin: 10px 0 !important;">현재 브라우저 테스트 버전입니다.</p>
                    <p style="margin: 10px 0 !important;">실제 프로젝트에서는 npm 패키지를 사용하세요:</p>
                    <code style="display: block !important; background: #F3F4F6 !important; padding: 8px !important; border-radius: 4px !important; margin: 10px 0 !important; font-size: 14px !important; color: #374151 !important;">import 'api-mock-gui/auto';</code>
                    <div style="margin-top: 20px !important;">
                        <button id="start-server-btn" style="background: #10B981 !important; color: white !important; border: none !important; padding: 8px 16px !important; border-radius: 6px !important; cursor: pointer !important; margin: 5px !important; font-size: 14px !important;">▶️ Start Server</button>
                        <button id="add-api-btn" style="background: #3B82F6 !important; color: white !important; border: none !important; padding: 8px 16px !important; border-radius: 6px !important; cursor: pointer !important; margin: 5px !important; font-size: 14px !important;">➕ Add API</button>
                    </div>
                </div>
            </div>
        `;
        
        // 패널 내부 버튼들 이벤트 바인딩
        setTimeout(() => {
            const closeBtn = panel.querySelector('#close-panel-btn');
            const startBtn = panel.querySelector('#start-server-btn');
            const addBtn = panel.querySelector('#add-api-btn');
            
            if (closeBtn) {
                closeBtn.onclick = function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    closePanel();
                };
            }
            
            if (startBtn) {
                startBtn.onclick = function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    alert('🟢 Mock 서버가 시작되었습니다!\n\n실제 프로젝트에서는 npm 패키지를 사용하세요.');
                };
            }
            
            if (addBtn) {
                addBtn.onclick = function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    alert('➕ API 추가 기능\n\n실제 프로젝트에서는 완전한 GUI를 사용할 수 있습니다.');
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
    
    // 자동 초기화 함수
    const initFloatingButton = () => {
        if (isInitialized) return;
        if (typeof window === 'undefined') return;
        
        initAttempts++;
        
        // 개발 환경 체크
        const isDevelopment = 
            window.location.hostname.includes('localhost') || 
            window.location.hostname.includes('127.0.0.1') ||
            window.location.port !== '' ||
            localStorage.getItem('apiMockGui.forceEnable') === 'true';
        
        if (!isDevelopment) {
            return;
        }
        
        try {
            // CSS 스타일 로드
            loadStyles();
            
            // 기존 버튼 제거
            const existingButton = document.getElementById('api-mock-floating-btn');
            if (existingButton) {
                existingButton.remove();
            }
            
            // 기존 컨테이너 확인
            const existingContainer = document.getElementById('api-mock-gui-floating-container');
            if (existingContainer) {
                existingContainer.remove();
            }
            
            // 컨테이너 생성 (패널용으로만 사용)
            containerElement = document.createElement('div');
            containerElement.id = 'api-mock-gui-floating-container';
            
            Object.assign(containerElement.style, {
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: '2147483646'
            });
            
            if (!document.body) {
                if (initAttempts < MAX_INIT_ATTEMPTS) {
                    setTimeout(initFloatingButton, 100);
                    return;
                } else {
                    console.error('❌ document.body를 찾을 수 없습니다');
                    return;
                }
            }
            
            // 컨테이너를 body에 추가
            document.body.appendChild(containerElement);
            
            // 플로팅 버튼을 직접 body에 추가 (컨테이너가 아닌)
            const floatingButton = createFloatingButton();
            document.body.appendChild(floatingButton);
            
            isInitialized = true;
            
        } catch (error) {
            console.error('❌ API Mock GUI 초기화 실패:', error);
            
            if (initAttempts < MAX_INIT_ATTEMPTS) {
                setTimeout(initFloatingButton, 1000);
            }
        }
    };
    
    // CSS 스타일 로드
    const loadStyles = () => {
        if (typeof document === 'undefined') return;
        if (document.querySelector('style[data-api-mock-gui-styles]')) return;
        
        try {
            const style = document.createElement('style');
            style.setAttribute('data-api-mock-gui-styles', 'true');
            style.textContent = `
                /* API Mock GUI 브라우저 스타일 */
                #api-mock-floating-btn {
                    all: initial !important;
                    position: fixed !important;
                    z-index: 2147483647 !important;
                    pointer-events: auto !important;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
                }
                
                #api-mock-panel {
                    all: initial !important;
                    position: fixed !important;
                    z-index: 2147483646 !important;
                    pointer-events: auto !important;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
                }
            `;
            document.head.appendChild(style);
        } catch (error) {
            console.warn('⚠️ API Mock GUI 스타일 로드 실패:', error);
        }
    };
    
    // 초기화 전략들
    if (typeof window !== 'undefined') {
        if (document.readyState === 'complete') {
            setTimeout(initFloatingButton, 50);
        } else if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(initFloatingButton, 50);
            });
        } else {
            setTimeout(initFloatingButton, 100);
        }
        
        window.addEventListener('load', () => {
            if (!isInitialized) {
                setTimeout(initFloatingButton, 100);
            }
        });
        
        // 전역 함수들 (디버깅용)
        window.apiMockGuiInit = () => {
            initAttempts = 0;
            initFloatingButton();
        };
        
        window.apiMockGuiTest = () => {
            const btn = document.getElementById('api-mock-floating-btn');
            if (btn) {
                btn.click();
            }
        };
        
        window.apiMockGuiCleanup = () => {
            if (!isInitialized) return;
            
            try {
                if (containerElement && containerElement.parentNode) {
                    containerElement.parentNode.removeChild(containerElement);
                }
                
                isInitialized = false;
                isOpen = false;
                containerElement = null;
                initAttempts = 0;
                
            } catch (error) {
                console.error('❌ API Mock GUI 정리 실패:', error);
            }
        };
    }
    
})(window); 