import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { X, Play, Square, Minimize2, Maximize2, Plus, Edit, Trash2, Database } from 'lucide-react';
import { MockServer } from '../mock/mockServer';
import { useMockApiStore } from '../hooks/useMockApiStore';
// API 폼을 별도 컴포넌트로 분리 - 내부 상태 관리로 포커스 문제 해결
const ApiForm = React.memo(({ editingApi, onSave, onCancel }) => {
    // 내부에서 상태 관리 - 부모 상태 변화와 무관하게 동작
    const [formData, setFormData] = useState({
        name: editingApi?.name || '',
        method: (editingApi?.method || 'GET'),
        path: editingApi?.path || '',
        description: editingApi?.description || ''
    });
    // editingApi가 변경될 때만 폼 데이터 초기화
    useEffect(() => {
        if (editingApi) {
            setFormData({
                name: editingApi.name || '',
                method: (editingApi.method || 'GET'),
                path: editingApi.path || '',
                description: editingApi.description || ''
            });
        }
    }, [editingApi?.id]); // id로만 의존성 체크
    const handleSubmit = useCallback(() => {
        if (!formData.name || !formData.path) {
            alert('Please fill in name and path');
            return;
        }
        onSave(formData);
    }, [formData, onSave]);
    if (!editingApi)
        return null;
    return (_jsxs("div", { style: {
            backgroundColor: '#F8FAFC',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            marginBottom: '20px'
        }, children: [_jsx("h3", { style: {
                    fontWeight: '600',
                    fontSize: '16px',
                    color: '#1E293B',
                    margin: '0 0 16px 0'
                }, children: editingApi.id ? 'Edit API' : 'Add New API' }), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '12px' }, children: [_jsxs("div", { children: [_jsx("label", { style: {
                                    display: 'block',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    color: '#374151',
                                    marginBottom: '4px'
                                }, children: "Name" }), _jsx("input", { type: "text", value: formData.name, onChange: (e) => setFormData(prev => ({ ...prev, name: e.target.value })), placeholder: "e.g., Get Users", style: {
                                    width: '100%',
                                    padding: '8px 12px',
                                    border: '1px solid #D1D5DB',
                                    borderRadius: '6px',
                                    fontSize: '14px',
                                    outline: 'none'
                                } })] }), _jsxs("div", { style: { display: 'flex', gap: '12px' }, children: [_jsxs("div", { style: { flex: 1 }, children: [_jsx("label", { style: {
                                            display: 'block',
                                            fontSize: '14px',
                                            fontWeight: '500',
                                            color: '#374151',
                                            marginBottom: '4px'
                                        }, children: "Method" }), _jsxs("select", { value: formData.method, onChange: (e) => setFormData(prev => ({ ...prev, method: e.target.value })), style: {
                                            width: '100%',
                                            padding: '8px 12px',
                                            border: '1px solid #D1D5DB',
                                            borderRadius: '6px',
                                            fontSize: '14px',
                                            outline: 'none'
                                        }, children: [_jsx("option", { value: "GET", children: "GET" }), _jsx("option", { value: "POST", children: "POST" }), _jsx("option", { value: "PUT", children: "PUT" }), _jsx("option", { value: "DELETE", children: "DELETE" }), _jsx("option", { value: "PATCH", children: "PATCH" })] })] }), _jsxs("div", { style: { flex: 2 }, children: [_jsx("label", { style: {
                                            display: 'block',
                                            fontSize: '14px',
                                            fontWeight: '500',
                                            color: '#374151',
                                            marginBottom: '4px'
                                        }, children: "Path" }), _jsx("input", { type: "text", value: formData.path, onChange: (e) => setFormData(prev => ({ ...prev, path: e.target.value })), placeholder: "e.g., /api/users", style: {
                                            width: '100%',
                                            padding: '8px 12px',
                                            border: '1px solid #D1D5DB',
                                            borderRadius: '6px',
                                            fontSize: '14px',
                                            outline: 'none'
                                        } })] })] }), _jsxs("div", { children: [_jsx("label", { style: {
                                    display: 'block',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    color: '#374151',
                                    marginBottom: '4px'
                                }, children: "Description (optional)" }), _jsx("input", { type: "text", value: formData.description, onChange: (e) => setFormData(prev => ({ ...prev, description: e.target.value })), placeholder: "Brief description of this API", style: {
                                    width: '100%',
                                    padding: '8px 12px',
                                    border: '1px solid #D1D5DB',
                                    borderRadius: '6px',
                                    fontSize: '14px',
                                    outline: 'none'
                                } })] }), _jsxs("div", { style: { display: 'flex', gap: '8px', marginTop: '8px' }, children: [_jsxs("button", { onClick: handleSubmit, style: {
                                    padding: '8px 16px',
                                    borderRadius: '6px',
                                    border: 'none',
                                    backgroundColor: '#10B981',
                                    color: 'white',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    cursor: 'pointer'
                                }, children: [editingApi.id ? 'Update' : 'Add', " API"] }), _jsx("button", { onClick: onCancel, style: {
                                    padding: '8px 16px',
                                    borderRadius: '6px',
                                    border: '1px solid #D1D5DB',
                                    backgroundColor: 'white',
                                    color: '#6B7280',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    cursor: 'pointer'
                                }, children: "Cancel" })] })] })] }));
});
export const FloatingApiMockManager = ({ serverConfig, autoStart = false, onServerStart, onServerStop, position = 'bottom-right', buttonText, buttonIcon, panelWidth = '400px', panelHeight = '500px', minimizable = true, draggable = true, resizable = true, minWidth = 300, minHeight = 200, maxWidth = 800, maxHeight = 1000, ...guiProps }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [isServerRunning, setIsServerRunning] = useState(false);
    const [serverError, setServerError] = useState(null);
    const [handlerCount, setHandlerCount] = useState(0);
    const [dragPosition, setDragPosition] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [editingApi, setEditingApi] = useState(null);
    const [editingCase, setEditingCase] = useState(null);
    const mockServerRef = useRef(null);
    const panelRef = useRef(null);
    const dragStartRef = useRef(null);
    const scrollContainerRef = useRef(null);
    const scrollPositionRef = useRef(0); // 스크롤 위치 보존용
    const store = useMockApiStore();
    // 리사이즈 관련 상태 추가
    const [panelSize, setPanelSize] = useState({
        width: parseInt(panelWidth) || 400,
        height: parseInt(panelHeight) || 500
    });
    const [isResizing, setIsResizing] = useState(false);
    const [resizeStartData, setResizeStartData] = useState(null);
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
    // 스크롤 위치 보존
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container)
            return;
        const saveScrollPosition = () => {
            scrollPositionRef.current = container.scrollTop;
        };
        const restoreScrollPosition = () => {
            container.scrollTop = scrollPositionRef.current;
        };
        container.addEventListener('scroll', saveScrollPosition);
        // 컴포넌트 업데이트 후 스크롤 복원
        const timeoutId = setTimeout(restoreScrollPosition, 0);
        return () => {
            container.removeEventListener('scroll', saveScrollPosition);
            clearTimeout(timeoutId);
        };
    });
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
    // 리사이즈 기능
    const handleResizeMouseDown = (e) => {
        if (!resizable)
            return;
        e.preventDefault();
        e.stopPropagation();
        setIsResizing(true);
        setResizeStartData({
            startX: e.clientX,
            startY: e.clientY,
            startWidth: panelSize.width,
            startHeight: panelSize.height
        });
    };
    useEffect(() => {
        if (!isResizing || !resizeStartData)
            return;
        const handleResizeMouseMove = (e) => {
            const deltaX = e.clientX - resizeStartData.startX;
            const deltaY = e.clientY - resizeStartData.startY;
            const newWidth = Math.max(minWidth, Math.min(maxWidth, resizeStartData.startWidth + deltaX));
            const newHeight = Math.max(minHeight, Math.min(maxHeight, resizeStartData.startHeight + deltaY));
            setPanelSize({ width: newWidth, height: newHeight });
        };
        const handleResizeMouseUp = () => {
            setIsResizing(false);
            setResizeStartData(null);
        };
        document.addEventListener('mousemove', handleResizeMouseMove);
        document.addEventListener('mouseup', handleResizeMouseUp);
        return () => {
            document.removeEventListener('mousemove', handleResizeMouseMove);
            document.removeEventListener('mouseup', handleResizeMouseUp);
        };
    }, [isResizing, resizeStartData, minWidth, minHeight, maxWidth, maxHeight]);
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
    const handleSaveNewApi = useCallback((apiData) => {
        const newApi = {
            name: apiData.name,
            method: apiData.method,
            path: apiData.path,
            description: apiData.description,
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
    }, [store]);
    const SimpleMockGui = useMemo(() => {
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
                                    }, children: [isServerRunning ? _jsx(Square, { size: 16 }) : _jsx(Play, { size: 16 }), _jsx("span", { children: isServerRunning ? 'Stop' : 'Start' })] }), _jsxs("button", { onClick: () => setEditingApi({}), style: {
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '8px 16px',
                                        borderRadius: '8px',
                                        border: 'none',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        cursor: 'pointer',
                                        backgroundColor: '#3B82F6',
                                        color: 'white',
                                        transition: 'background-color 0.2s',
                                        outline: 'none'
                                    }, onMouseEnter: (e) => {
                                        e.currentTarget.style.backgroundColor = '#2563EB';
                                    }, onMouseLeave: (e) => {
                                        e.currentTarget.style.backgroundColor = '#3B82F6';
                                    }, children: [_jsx(Plus, { size: 16 }), _jsx("span", { children: "Add API" })] }), _jsx("button", { onClick: () => {
                                        const config = { apis: store.apis };
                                        // Save to public/api-config.json
                                        fetch('/api/save-config', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ filePath: 'public/api-config.json', config })
                                        }).then(() => {
                                            alert('💾 Configuration saved successfully!');
                                        }).catch(() => {
                                            alert('❌ Failed to save configuration');
                                        });
                                    }, style: {
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '8px 16px',
                                        borderRadius: '8px',
                                        border: 'none',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        cursor: 'pointer',
                                        backgroundColor: '#8B5CF6',
                                        color: 'white',
                                        transition: 'background-color 0.2s',
                                        outline: 'none'
                                    }, onMouseEnter: (e) => {
                                        e.currentTarget.style.backgroundColor = '#7C3AED';
                                    }, onMouseLeave: (e) => {
                                        e.currentTarget.style.backgroundColor = '#8B5CF6';
                                    }, children: "\uD83D\uDCBE Save Config" })] })] }), _jsxs("div", { style: {
                        backgroundColor: '#FAFAFA',
                        padding: '20px',
                        borderRadius: '12px',
                        border: '1px solid #E2E8F0',
                        marginBottom: '20px'
                    }, children: [_jsxs("h3", { style: {
                                fontWeight: '600',
                                fontSize: '16px',
                                color: '#1E293B',
                                margin: '0 0 16px 0'
                            }, children: ["API Endpoints (", store.apis.length, ")"] }), store.apis.length === 0 ? (_jsx("div", { style: {
                                textAlign: 'center',
                                color: '#6B7280',
                                padding: '20px',
                                fontSize: '14px'
                            }, children: "No APIs configured yet. Click \"Add API\" to get started." })) : (_jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: '12px' }, children: store.apis.map((api, index) => (_jsxs("div", { style: {
                                    backgroundColor: 'white',
                                    padding: '16px',
                                    borderRadius: '8px',
                                    border: '1px solid #E2E8F0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }, children: [_jsxs("div", { style: { flex: 1 }, children: [_jsxs("div", { style: {
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '8px',
                                                    marginBottom: '4px'
                                                }, children: [_jsx("span", { style: {
                                                            backgroundColor: '#3B82F6',
                                                            color: 'white',
                                                            padding: '2px 8px',
                                                            borderRadius: '4px',
                                                            fontSize: '12px',
                                                            fontWeight: '500'
                                                        }, children: api.method }), _jsx("span", { style: {
                                                            fontWeight: '500',
                                                            color: '#1F2937'
                                                        }, children: api.path })] }), _jsxs("div", { style: {
                                                    fontSize: '14px',
                                                    color: '#6B7280'
                                                }, children: [api.name, " (", api.cases?.length || 0, " cases)"] })] }), _jsxs("div", { style: { display: 'flex', gap: '8px' }, children: [_jsx("button", { onClick: () => setEditingApi(api), style: {
                                                    padding: '6px',
                                                    borderRadius: '4px',
                                                    border: 'none',
                                                    backgroundColor: '#F3F4F6',
                                                    cursor: 'pointer',
                                                    color: '#6B7280'
                                                }, children: _jsx(Edit, { size: 14 }) }), _jsx("button", { onClick: () => store.deleteApi(api.id || ''), style: {
                                                    padding: '6px',
                                                    borderRadius: '4px',
                                                    border: 'none',
                                                    backgroundColor: '#FEF2F2',
                                                    cursor: 'pointer',
                                                    color: '#DC2626'
                                                }, children: _jsx(Trash2, { size: 14 }) })] })] }, api.id || index))) }))] }), _jsx("div", { style: {
                        fontSize: '12px',
                        color: '#94A3B8',
                        textAlign: 'center'
                    }, children: "API Mock GUI v2.0.15 - React Component" }), serverError && (_jsxs("div", { style: {
                        marginTop: '20px',
                        padding: '12px',
                        backgroundColor: '#FEF2F2',
                        border: '1px solid #FECACA',
                        borderRadius: '8px',
                        color: '#DC2626',
                        fontSize: '14px'
                    }, children: ["\u274C ", serverError] }))] }));
    }, [
        isServerRunning,
        store.apis,
        serverError,
        handleStartServer,
        handleStopServer
    ]);
    const FloatingPanel = () => (_jsxs("div", { ref: panelRef, style: {
            position: 'fixed',
            ...getPositionStyle(),
            width: `${panelSize.width}px`,
            height: `${panelSize.height}px`,
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
                                }, children: _jsx(X, { size: 16 }) })] })] }), !isMinimized && (_jsxs("div", { ref: scrollContainerRef, style: {
                    height: 'calc(100% - 65px)',
                    overflow: 'auto',
                    pointerEvents: 'auto'
                }, children: [SimpleMockGui, editingApi && (_jsx("div", { style: { padding: '0 20px 20px' }, children: _jsx(ApiForm, { editingApi: editingApi, onSave: handleSaveNewApi, onCancel: () => setEditingApi(null) }) }))] })), resizable && !isMinimized && (_jsx("div", { onMouseDown: handleResizeMouseDown, style: {
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: '20px',
                    height: '20px',
                    cursor: 'nw-resize',
                    backgroundColor: 'transparent',
                    borderTopLeftRadius: '8px',
                    zIndex: 10,
                    pointerEvents: 'auto'
                }, children: _jsx("div", { style: {
                        position: 'absolute',
                        bottom: '4px',
                        right: '4px',
                        width: '12px',
                        height: '12px',
                        background: `
              linear-gradient(-45deg, transparent 30%, #CBD5E1 30%, #CBD5E1 40%, transparent 40%),
              linear-gradient(-45deg, transparent 50%, #CBD5E1 50%, #CBD5E1 60%, transparent 60%),
              linear-gradient(-45deg, transparent 70%, #CBD5E1 70%, #CBD5E1 80%, transparent 80%)
            `,
                        borderRadius: '0 0 8px 0'
                    } }) }))] }));
    return (_jsxs(_Fragment, { children: [_jsx("style", { children: `
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.7; }
            100% { opacity: 1; }
          }
        ` }), !isOpen && _jsx(FloatingButton, {}), isOpen && _jsx(FloatingPanel, {})] }));
};
