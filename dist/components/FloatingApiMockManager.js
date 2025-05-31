import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { X, Play, Square, Wifi, WifiOff, Minimize2, Maximize2, Plus, Edit, Trash2, Database } from 'lucide-react';
import { MockServer } from '../mock/mockServer';
import { useMockApiStore } from '../hooks/useMockApiStore';
export const FloatingApiMockManager = ({ serverConfig, autoStart = false, onServerStart, onServerStop, position = 'bottom-right', buttonText, buttonIcon, panelWidth = '800px', panelHeight = '600px', minimizable = true, draggable = true, ...guiProps }) => {
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
            console.log('🚫 드래그 방지: 인터랙티브 요소 클릭됨');
            return;
        }
        console.log('🖱️ 드래그 시작');
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
    const FloatingButton = () => (_jsxs("button", { onClick: (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('🎭 Floating button clicked!');
            setIsOpen(true);
        }, className: "api-mock-floating-btn", style: {
            ...getPositionStyle(),
            pointerEvents: 'auto',
            zIndex: 2147483647,
            position: 'fixed',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: isServerRunning ? '#10B981' : '#3B82F6',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3), 0 4px 8px rgba(0, 0, 0, 0.1)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            border: '3px solid rgba(255, 255, 255, 0.3)',
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
        }, title: isServerRunning ? '🎭 API Mock 실행 중 - 클릭하여 관리' : '🎭 API Mock 중단됨 - 클릭하여 시작', children: [_jsx("div", { style: { color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }, children: _jsx(Database, { size: 28, strokeWidth: 2.5 }) }), isServerRunning && (_jsx("div", { style: {
                    position: 'absolute',
                    top: '-3px',
                    right: '-3px',
                    width: '20px',
                    height: '20px',
                    backgroundColor: '#22C55E',
                    borderRadius: '50%',
                    border: '3px solid white',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                    animation: 'pulse 2s infinite'
                } })), _jsx("style", { children: `
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.7; }
            100% { opacity: 1; }
          }
        ` })] }));
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
        console.log('🎨 SimpleMockGui 렌더링, editingApi:', editingApi);
        return (_jsxs("div", { style: { padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }, children: [_jsxs("div", { style: {
                        backgroundColor: '#F1F5F9',
                        padding: '20px',
                        borderRadius: '12px',
                        border: '1px solid #E2E8F0'
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
                                    }, children: "Mock Server" }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '8px' }, children: [isServerRunning ? (_jsx(Wifi, { size: 16, color: "#10B981" })) : (_jsx(WifiOff, { size: 16, color: "#94A3B8" })), _jsx("span", { style: {
                                                fontSize: '14px',
                                                color: isServerRunning ? '#10B981' : '#64748B',
                                                fontWeight: '500'
                                            }, children: isServerRunning ? 'Running' : 'Stopped' })] })] }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '12px' }, children: [_jsxs("button", { onClick: (e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        console.log('Start/Stop button clicked, isServerRunning:', isServerRunning);
                                        if (isServerRunning) {
                                            handleStopServer();
                                        }
                                        else {
                                            handleStartServer();
                                        }
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
                                        backgroundColor: isServerRunning ? '#EF4444' : '#10B981',
                                        color: 'white',
                                        transition: 'background-color 0.2s',
                                        pointerEvents: 'auto',
                                        outline: 'none'
                                    }, onMouseEnter: (e) => {
                                        e.currentTarget.style.backgroundColor = isServerRunning ? '#DC2626' : '#059669';
                                    }, onMouseLeave: (e) => {
                                        e.currentTarget.style.backgroundColor = isServerRunning ? '#EF4444' : '#10B981';
                                    }, children: [isServerRunning ? _jsx(Square, { size: 16 }) : _jsx(Play, { size: 16 }), isServerRunning ? 'Stop' : 'Start'] }), handlerCount > 0 && (_jsxs("span", { style: { fontSize: '14px', color: '#64748B' }, children: [handlerCount, " handlers active"] }))] }), serverError && (_jsx("div", { style: {
                                marginTop: '12px',
                                padding: '12px',
                                backgroundColor: '#FEF2F2',
                                border: '1px solid #FECACA',
                                borderRadius: '8px',
                                color: '#DC2626',
                                fontSize: '14px'
                            }, children: serverError }))] }), editingApi && (_jsxs("div", { style: {
                        backgroundColor: '#EFF6FF',
                        border: '1px solid #DBEAFE',
                        borderRadius: '12px',
                        padding: '20px'
                    }, children: [_jsxs("div", { style: {
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: '16px'
                            }, children: [_jsx("h3", { style: {
                                        fontWeight: '600',
                                        fontSize: '16px',
                                        color: '#1E40AF',
                                        margin: 0
                                    }, children: editingApi.id ? 'Edit API' : 'Add New API' }), _jsx("button", { onClick: () => setEditingApi(null), style: {
                                        width: '24px',
                                        height: '24px',
                                        borderRadius: '4px',
                                        border: 'none',
                                        backgroundColor: 'transparent',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }, children: _jsx(X, { size: 16, color: "#3B82F6" }) })] }), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: '16px' }, children: [_jsxs("div", { children: [_jsx("label", { style: {
                                                display: 'block',
                                                fontSize: '14px',
                                                fontWeight: '500',
                                                color: '#374151',
                                                marginBottom: '6px'
                                            }, children: "Name" }), _jsx("input", { type: "text", value: editingApi.id ? editingApi.name : newApiForm.name, onChange: (e) => editingApi.id
                                                ? setEditingApi({ ...editingApi, name: e.target.value })
                                                : setNewApiForm({ ...newApiForm, name: e.target.value }), style: {
                                                width: '100%',
                                                padding: '8px 12px',
                                                border: '1px solid #D1D5DB',
                                                borderRadius: '6px',
                                                fontSize: '14px',
                                                backgroundColor: 'white',
                                                color: '#1F2937',
                                                boxSizing: 'border-box'
                                            }, placeholder: "e.g. Get Users" })] }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }, children: [_jsxs("div", { children: [_jsx("label", { style: {
                                                        display: 'block',
                                                        fontSize: '14px',
                                                        fontWeight: '500',
                                                        color: '#374151',
                                                        marginBottom: '6px'
                                                    }, children: "Method" }), _jsxs("select", { value: editingApi.id ? editingApi.method : newApiForm.method, onChange: (e) => editingApi.id
                                                        ? setEditingApi({ ...editingApi, method: e.target.value })
                                                        : setNewApiForm({ ...newApiForm, method: e.target.value }), style: {
                                                        width: '100%',
                                                        padding: '8px 12px',
                                                        border: '1px solid #D1D5DB',
                                                        borderRadius: '6px',
                                                        fontSize: '14px',
                                                        backgroundColor: 'white',
                                                        color: '#1F2937',
                                                        boxSizing: 'border-box'
                                                    }, children: [_jsx("option", { value: "GET", children: "GET" }), _jsx("option", { value: "POST", children: "POST" }), _jsx("option", { value: "PUT", children: "PUT" }), _jsx("option", { value: "DELETE", children: "DELETE" }), _jsx("option", { value: "PATCH", children: "PATCH" })] })] }), _jsxs("div", { children: [_jsx("label", { style: {
                                                        display: 'block',
                                                        fontSize: '14px',
                                                        fontWeight: '500',
                                                        color: '#374151',
                                                        marginBottom: '6px'
                                                    }, children: "Path" }), _jsx("input", { type: "text", value: editingApi.id ? editingApi.path : newApiForm.path, onChange: (e) => editingApi.id
                                                        ? setEditingApi({ ...editingApi, path: e.target.value })
                                                        : setNewApiForm({ ...newApiForm, path: e.target.value }), style: {
                                                        width: '100%',
                                                        padding: '8px 12px',
                                                        border: '1px solid #D1D5DB',
                                                        borderRadius: '6px',
                                                        fontSize: '14px',
                                                        backgroundColor: 'white',
                                                        color: '#1F2937',
                                                        boxSizing: 'border-box'
                                                    }, placeholder: "/api/users" })] })] }), _jsxs("div", { children: [_jsx("label", { style: {
                                                display: 'block',
                                                fontSize: '14px',
                                                fontWeight: '500',
                                                color: '#374151',
                                                marginBottom: '6px'
                                            }, children: "Description" }), _jsx("input", { type: "text", value: editingApi.id ? editingApi.description || '' : newApiForm.description, onChange: (e) => editingApi.id
                                                ? setEditingApi({ ...editingApi, description: e.target.value })
                                                : setNewApiForm({ ...newApiForm, description: e.target.value }), style: {
                                                width: '100%',
                                                padding: '8px 12px',
                                                border: '1px solid #D1D5DB',
                                                borderRadius: '6px',
                                                fontSize: '14px',
                                                backgroundColor: 'white',
                                                color: '#1F2937',
                                                boxSizing: 'border-box'
                                            }, placeholder: "Optional description" })] }), _jsxs("div", { style: { display: 'flex', gap: '8px', paddingTop: '8px' }, children: [_jsxs("button", { onClick: (e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                console.log('API Save button clicked, editingApi.id:', editingApi.id);
                                                if (editingApi.id) {
                                                    store.updateApi(editingApi.id, editingApi);
                                                    setEditingApi(null);
                                                }
                                                else {
                                                    handleSaveNewApi();
                                                }
                                            }, style: {
                                                padding: '8px 16px',
                                                backgroundColor: '#3B82F6',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '6px',
                                                fontSize: '14px',
                                                fontWeight: '500',
                                                cursor: 'pointer',
                                                transition: 'background-color 0.2s',
                                                pointerEvents: 'auto',
                                                outline: 'none'
                                            }, onMouseEnter: (e) => {
                                                e.currentTarget.style.backgroundColor = '#2563EB';
                                            }, onMouseLeave: (e) => {
                                                e.currentTarget.style.backgroundColor = '#3B82F6';
                                            }, children: [editingApi.id ? 'Update' : 'Add', " API"] }), _jsx("button", { onClick: (e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                console.log('API Cancel button clicked');
                                                setEditingApi(null);
                                            }, style: {
                                                padding: '8px 16px',
                                                backgroundColor: '#F3F4F6',
                                                color: '#374151',
                                                border: 'none',
                                                borderRadius: '6px',
                                                fontSize: '14px',
                                                fontWeight: '500',
                                                cursor: 'pointer',
                                                transition: 'background-color 0.2s',
                                                pointerEvents: 'auto',
                                                outline: 'none'
                                            }, onMouseEnter: (e) => {
                                                e.currentTarget.style.backgroundColor = '#E5E7EB';
                                            }, onMouseLeave: (e) => {
                                                e.currentTarget.style.backgroundColor = '#F3F4F6';
                                            }, children: "Cancel" })] })] })] })), _jsxs("div", { children: [_jsxs("div", { style: {
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: '16px'
                            }, children: [_jsxs("h3", { style: {
                                        fontWeight: '600',
                                        fontSize: '16px',
                                        color: '#1E293B',
                                        margin: 0
                                    }, children: ["Mock APIs (", store.apis.length, ")"] }), _jsxs("button", { onClick: (e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        console.log('Add API button clicked');
                                        setEditingApi({
                                            id: '',
                                            name: '',
                                            method: 'GET',
                                            path: '',
                                            description: '',
                                            cases: [],
                                            isEnabled: true,
                                            createdAt: new Date().toISOString(),
                                            updatedAt: new Date().toISOString()
                                        });
                                    }, style: {
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        padding: '8px 16px',
                                        backgroundColor: '#3B82F6',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        cursor: 'pointer',
                                        transition: 'background-color 0.2s',
                                        outline: 'none',
                                        pointerEvents: 'auto'
                                    }, onMouseEnter: (e) => {
                                        console.log('Add API button hovered');
                                        e.currentTarget.style.backgroundColor = '#2563EB';
                                    }, onMouseLeave: (e) => {
                                        e.currentTarget.style.backgroundColor = '#3B82F6';
                                    }, children: [_jsx(Plus, { size: 16 }), "Add API"] })] }), _jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflow: 'auto' }, children: store.apis.length === 0 ? (_jsxs("div", { style: {
                                    textAlign: 'center',
                                    padding: '40px 20px',
                                    color: '#64748B'
                                }, children: [_jsx(Database, { size: 32, color: "#94A3B8", style: { margin: '0 auto 12px' } }), _jsx("p", { style: { margin: '0 0 4px', fontSize: '16px' }, children: "No APIs configured yet" }), _jsx("p", { style: { margin: 0, fontSize: '14px' }, children: "Click \"Add API\" to get started" })] })) : (store.apis.map((api) => (_jsxs("div", { style: {
                                    backgroundColor: '#FFFFFF',
                                    border: '1px solid #E2E8F0',
                                    borderRadius: '8px',
                                    padding: '16px'
                                }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '12px' }, children: [_jsx("span", { style: {
                                                            padding: '4px 8px',
                                                            borderRadius: '4px',
                                                            fontSize: '12px',
                                                            fontWeight: '600',
                                                            backgroundColor: api.method === 'GET' ? '#DBEAFE' :
                                                                api.method === 'POST' ? '#D1FAE5' :
                                                                    api.method === 'PUT' ? '#FEF3C7' :
                                                                        api.method === 'DELETE' ? '#FEE2E2' :
                                                                            '#F3F4F6',
                                                            color: api.method === 'GET' ? '#1E40AF' :
                                                                api.method === 'POST' ? '#065F46' :
                                                                    api.method === 'PUT' ? '#92400E' :
                                                                        api.method === 'DELETE' ? '#B91C1C' :
                                                                            '#374151'
                                                        }, children: api.method }), _jsxs("div", { children: [_jsx("div", { style: { fontWeight: '500', fontSize: '14px', color: '#1F2937' }, children: api.name }), _jsx("div", { style: { fontSize: '12px', color: '#6B7280' }, children: api.path })] })] }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '4px' }, children: [_jsx("button", { onClick: () => setEditingApi(api), style: {
                                                            width: '28px',
                                                            height: '28px',
                                                            borderRadius: '4px',
                                                            border: 'none',
                                                            backgroundColor: 'transparent',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            transition: 'background-color 0.2s'
                                                        }, onMouseEnter: (e) => {
                                                            e.currentTarget.style.backgroundColor = '#F3F4F6';
                                                        }, onMouseLeave: (e) => {
                                                            e.currentTarget.style.backgroundColor = 'transparent';
                                                        }, children: _jsx(Edit, { size: 14, color: "#6B7280" }) }), _jsx("button", { onClick: () => store.deleteApi(api.id), style: {
                                                            width: '28px',
                                                            height: '28px',
                                                            borderRadius: '4px',
                                                            border: 'none',
                                                            backgroundColor: 'transparent',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            transition: 'background-color 0.2s'
                                                        }, onMouseEnter: (e) => {
                                                            e.currentTarget.style.backgroundColor = '#FEE2E2';
                                                        }, onMouseLeave: (e) => {
                                                            e.currentTarget.style.backgroundColor = 'transparent';
                                                        }, children: _jsx(Trash2, { size: 14, color: "#EF4444" }) })] })] }), api.cases.length > 0 && (_jsxs("div", { style: { marginTop: '8px', fontSize: '12px', color: '#6B7280' }, children: [api.cases.length, " response case(s)"] }))] }, api.id)))) })] })] }));
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
    return (_jsxs(_Fragment, { children: [!isOpen && _jsx(FloatingButton, {}), isOpen && _jsx(FloatingPanel, {})] }));
};
