import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { X, Play, Square, Minimize2, Maximize2, Database } from 'lucide-react';
import { MockServer } from '../mock/mockServer';
import { useMockApiStore } from '../hooks/useMockApiStore';
export const FloatingApiMockManager = ({ serverConfig, autoStart = false, onServerStart, onServerStop, position = 'bottom-right', buttonText, buttonIcon, panelWidth = '400px', panelHeight = '500px', minimizable = true, draggable = true, ...guiProps }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [isServerRunning, setIsServerRunning] = useState(false);
    const [serverError, setServerError] = useState(null);
    const [handlerCount, setHandlerCount] = useState(0);
    const [dragPosition, setDragPosition] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [editingApi, setEditingApi] = useState(null);
    const [editingCase, setEditingCase] = useState(null);
    const [newApiForm, setNewApiForm] = useState({
        name: '',
        method: 'GET',
        path: '',
        description: ''
    });
    const mockServerRef = useRef(null);
    const panelRef = useRef(null);
    const dragStartRef = useRef(null);
    const store = useMockApiStore();
    // MockServer 인스턴스 초기화
    useEffect(() => {
        if (!mockServerRef.current) {
            mockServerRef.current = new MockServer(serverConfig);
        }
    }, [serverConfig]);
    // 자동 시작
    useEffect(() => {
        if (autoStart && mockServerRef.current && !isServerRunning) {
            handleStartServer();
        }
    }, [autoStart]);
    // API 설정 변경 시 핸들러 업데이트
    useEffect(() => {
        if (mockServerRef.current) {
            mockServerRef.current.updateHandlers(store.apis);
            setHandlerCount(mockServerRef.current.getHandlerCount());
        }
        if (guiProps.onConfigChange) {
            guiProps.onConfigChange(store.apis);
        }
    }, [store.apis]);
    const handleStartServer = async () => {
        if (!mockServerRef.current)
            return;
        try {
            setServerError(null);
            await mockServerRef.current.start();
            setIsServerRunning(true);
            setHandlerCount(mockServerRef.current.getHandlerCount());
            if (onServerStart) {
                onServerStart();
            }
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            setServerError(errorMessage);
            console.error('Failed to start mock server:', error);
        }
    };
    const handleStopServer = async () => {
        if (!mockServerRef.current)
            return;
        try {
            setServerError(null);
            await mockServerRef.current.stop();
            setIsServerRunning(false);
            if (onServerStop) {
                onServerStop();
            }
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            setServerError(errorMessage);
            console.error('Failed to stop mock server:', error);
        }
    };
    // 드래그 기능
    const handleMouseDown = (e) => {
        if (!draggable || !panelRef.current)
            return;
        // 버튼이나 인터랙티브 요소 클릭인 경우 드래그 방지
        const target = e.target;
        if (target.closest('button') ||
            target.closest('input') ||
            target.closest('select') ||
            target.closest('textarea')) {
            return;
        }
        setIsDragging(true);
        const rect = panelRef.current.getBoundingClientRect();
        dragStartRef.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    };
    useEffect(() => {
        if (!isDragging)
            return;
        const handleMouseMove = (e) => {
            if (!dragStartRef.current)
                return;
            setDragPosition({
                x: e.clientX - dragStartRef.current.x,
                y: e.clientY - dragStartRef.current.y
            });
        };
        const handleMouseUp = () => {
            setIsDragging(false);
            dragStartRef.current = null;
        };
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);
    // 위치 스타일 계산
    const getPositionStyle = () => {
        if (dragPosition) {
            return {
                position: 'fixed',
                left: `${dragPosition.x}px`,
                top: `${dragPosition.y}px`,
                right: 'auto',
                bottom: 'auto'
            };
        }
        const baseStyle = {
            position: 'fixed',
            zIndex: 2147483647
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
    // Database 아이콘 컴포넌트 (순수 JS 버전과 동일)
    const DatabaseIcon = () => (_jsx(Database, { size: 28, color: "white", strokeWidth: 2.5, style: { pointerEvents: 'none' } }));
    // 상태 표시 점 (순수 JS 버전과 동일)
    const StatusDot = () => (_jsx("div", { style: {
            position: 'absolute',
            top: '-3px',
            right: '-3px',
            width: '20px',
            height: '20px',
            backgroundColor: '#22C55E',
            borderRadius: '50%',
            border: '3px solid white',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
            display: isServerRunning ? 'block' : 'none',
            pointerEvents: 'none',
            animation: 'pulse 2s infinite'
        } }));
    // 플로팅 버튼 (순수 JS 버전과 동일한 디자인)
    const FloatingButton = () => (_jsxs("button", { onClick: (e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsOpen(true);
        }, title: isServerRunning ? '🎭 API Mock 실행 중 - 클릭하여 관리' : '🎭 API Mock 중단됨 - 클릭하여 시작', style: {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: isServerRunning ? '#10B981' : '#3B82F6',
            color: 'white',
            border: '3px solid rgba(255, 255, 255, 0.3)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3), 0 4px 8px rgba(0, 0, 0, 0.1)',
            zIndex: 2147483647,
            transition: 'all 0.3s ease',
            pointerEvents: 'auto',
            margin: 0,
            padding: 0,
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            backdropFilter: 'blur(10px)',
            outline: 'none'
        }, onMouseEnter: (e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.4), 0 6px 12px rgba(0, 0, 0, 0.2)';
        }, onMouseLeave: (e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.3), 0 4px 8px rgba(0, 0, 0, 0.1)';
        }, onMouseDown: (e) => {
            e.currentTarget.style.transform = 'scale(0.95)';
        }, onMouseUp: (e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
        }, children: [_jsx("div", { style: {
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'none'
                }, children: _jsx(DatabaseIcon, {}) }), _jsx(StatusDot, {})] }));
    const handleSaveNewApi = () => {
        if (!newApiForm.name || !newApiForm.path) {
            alert('Please fill in name and path');
            return;
        }
        const newApi = {
            name: newApiForm.name,
            method: newApiForm.method,
            path: newApiForm.path,
            description: newApiForm.description,
            cases: [{
                    id: `case-${Date.now()}`,
                    name: 'Default Response',
                    description: 'Default response case',
                    status: 200,
                    headers: { 'Content-Type': 'application/json' },
                    body: { success: true, message: 'Mock response' },
                    isActive: true
                }],
            isEnabled: true
        };
        store.addApi(newApi);
        setEditingApi(null);
        setNewApiForm({ name: '', method: 'GET', path: '', description: '' });
    };
    const SimpleMockGui = () => {
        return (_jsxs("div", { style: { padding: '20px' }, children: [_jsxs("div", { style: {
                        backgroundColor: '#F1F5F9',
                        padding: '20px',
                        borderRadius: '12px',
                        border: '1px solid #E2E8F0',
                        marginBottom: '20px'
                    }, children: [_jsxs("div", { style: {
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: '16px'
                            }, children: [_jsx("h3", { style: {
                                        fontWeight: '600',
                                        fontSize: '16px',
                                        color: '#1E293B',
                                        margin: 0
                                    }, children: "Mock Server" }), _jsxs("div", { style: {
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }, children: [_jsx("span", { style: {
                                                width: '16px',
                                                height: '16px',
                                                background: isServerRunning ? '#10B981' : '#94A3B8',
                                                borderRadius: '50%',
                                                display: 'inline-block'
                                            } }), _jsx("span", { style: {
                                                fontSize: '14px',
                                                color: isServerRunning ? '#10B981' : '#64748B',
                                                fontWeight: '500'
                                            }, children: isServerRunning ? 'Running' : 'Stopped' })] })] }), _jsxs("div", { style: {
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px'
                            }, children: [_jsxs("button", { onClick: isServerRunning ? handleStopServer : handleStartServer, style: {
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '8px 16px',
                                        borderRadius: '8px',
                                        border: 'none',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        cursor: 'pointer',
                                        backgroundColor: isServerRunning ? '#EF4444' : '#10B981',
                                        color: 'white',
                                        transition: 'background-color 0.2s',
                                        outline: 'none'
                                    }, onMouseEnter: (e) => {
                                        e.currentTarget.style.backgroundColor = isServerRunning ? '#DC2626' : '#059669';
                                    }, onMouseLeave: (e) => {
                                        e.currentTarget.style.backgroundColor = isServerRunning ? '#EF4444' : '#10B981';
                                    }, children: [isServerRunning ? _jsx(Square, { size: 16 }) : _jsx(Play, { size: 16 }), _jsx("span", { children: isServerRunning ? 'Stop' : 'Start' })] }), _jsx("span", { style: {
                                        fontSize: '14px',
                                        color: '#64748B'
                                    }, children: "Ready for testing" })] })] }), _jsxs("div", { style: {
                        textAlign: 'center',
                        color: '#6B7280',
                        lineHeight: '1.6'
                    }, children: [_jsx("h3", { style: {
                                margin: '0 0 10px 0',
                                color: '#1F2937'
                            }, children: "\uD83C\uDFAD API Mock GUI" }), _jsx("p", { style: { margin: '10px 0' }, children: "\uD604\uC7AC React \uCEF4\uD3EC\uB10C\uD2B8 \uBC84\uC804\uC785\uB2C8\uB2E4." }), _jsx("p", { style: { margin: '10px 0' }, children: "\uC21C\uC218 JS \uBC84\uC804\uACFC \uB3D9\uC77C\uD55C \uB514\uC790\uC778\uC73C\uB85C \uC5C5\uB370\uC774\uD2B8\uB418\uC5C8\uC2B5\uB2C8\uB2E4:" }), _jsx("div", { style: {
                                background: '#F3F4F6',
                                padding: '8px',
                                borderRadius: '4px',
                                margin: '10px 0',
                                fontSize: '14px',
                                color: '#374151',
                                display: 'block'
                            }, children: "import 'api-mock-gui/auto';" }), _jsxs("div", { style: { marginTop: '20px' }, children: [_jsx("button", { onClick: () => {
                                        // Add API 기능 알림
                                        alert('➕ API 추가 기능\n\n실제 프로젝트에서는 완전한 GUI를 사용할 수 있습니다.');
                                    }, style: {
                                        background: '#3B82F6',
                                        color: 'white',
                                        border: 'none',
                                        padding: '8px 16px',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        margin: '5px',
                                        fontSize: '14px',
                                        outline: 'none'
                                    }, children: "\u2795 Add API" }), _jsx("button", { onClick: () => {
                                        // Save Config 기능 알림
                                        alert('💾 설정이 저장되었습니다!');
                                    }, style: {
                                        background: '#8B5CF6',
                                        color: 'white',
                                        border: 'none',
                                        padding: '8px 16px',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        margin: '5px',
                                        fontSize: '14px',
                                        outline: 'none'
                                    }, children: "\uD83D\uDCBE Save Config" })] }), _jsxs("p", { style: {
                                margin: '20px 0 10px 0',
                                fontSize: '12px',
                                color: '#94A3B8'
                            }, children: ["\uC644\uC804\uD55C GUI\uB294 React \uCEF4\uD3EC\uB10C\uD2B8\uC5D0\uC11C \uC774\uC6A9\uD558\uC138\uC694", _jsx("br", {}), "npm install api-mock-gui"] })] }), serverError && (_jsxs("div", { style: {
                        marginTop: '20px',
                        padding: '12px',
                        backgroundColor: '#FEF2F2',
                        border: '1px solid #FECACA',
                        borderRadius: '8px',
                        color: '#DC2626',
                        fontSize: '14px'
                    }, children: ["\u274C ", serverError] }))] }));
    };
    const FloatingPanel = () => (_jsxs("div", { ref: panelRef, style: {
            position: 'fixed',
            ...getPositionStyle(),
            width: panelWidth,
            height: panelHeight,
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            zIndex: 2147483646,
            overflow: 'hidden',
            pointerEvents: 'auto',
            userSelect: 'none',
        }, className: "api-mock-panel", children: [_jsxs("div", { style: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 20px',
                    borderBottom: '1px solid #E2E8F0',
                    cursor: draggable ? 'move' : 'default',
                    pointerEvents: 'auto'
                }, onMouseDown: draggable ? handleMouseDown : undefined, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '8px' }, children: [_jsx(Database, { size: 20, color: "#3B82F6" }), _jsx("h2", { style: {
                                    margin: 0,
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    color: '#1F2937'
                                }, children: "API Mock Manager" })] }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '8px' }, children: [minimizable && (_jsx("button", { onClick: (e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    console.log('🔧 Minimize/Maximize 버튼 클릭됨');
                                    setIsMinimized(!isMinimized);
                                }, style: {
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '6px',
                                    border: 'none',
                                    backgroundColor: 'transparent',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#6B7280',
                                    transition: 'all 0.2s',
                                    pointerEvents: 'auto'
                                }, onMouseEnter: (e) => {
                                    e.currentTarget.style.backgroundColor = '#F3F4F6';
                                    e.currentTarget.style.color = '#374151';
                                }, onMouseLeave: (e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                    e.currentTarget.style.color = '#6B7280';
                                }, children: isMinimized ? _jsx(Maximize2, { size: 16 }) : _jsx(Minimize2, { size: 16 }) })), _jsx("button", { onClick: (e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    console.log('❌ Close 버튼 클릭됨');
                                    setIsOpen(false);
                                }, style: {
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '6px',
                                    border: 'none',
                                    backgroundColor: 'transparent',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#6B7280',
                                    transition: 'all 0.2s',
                                    pointerEvents: 'auto'
                                }, onMouseEnter: (e) => {
                                    e.currentTarget.style.backgroundColor = '#FEF2F2';
                                    e.currentTarget.style.color = '#DC2626';
                                }, onMouseLeave: (e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                    e.currentTarget.style.color = '#6B7280';
                                }, children: _jsx(X, { size: 16 }) })] })] }), !isMinimized && (_jsx("div", { style: {
                    height: 'calc(100% - 65px)',
                    overflow: 'auto',
                    pointerEvents: 'auto'
                }, children: _jsx(SimpleMockGui, {}) }))] }));
    return (_jsxs(_Fragment, { children: [_jsx("style", { children: `
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.7; }
            100% { opacity: 1; }
          }
        ` }), !isOpen && _jsx(FloatingButton, {}), isOpen && _jsx(FloatingPanel, {})] }));
};
