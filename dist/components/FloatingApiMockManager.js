import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { X, Play, Square, Wifi, WifiOff, Minimize2, Maximize2, Plus, Edit, Trash2, Database, Zap } from 'lucide-react';
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
        }, className: `
        api-mock-floating-btn group relative flex items-center justify-center w-16 h-16
        ${isServerRunning
            ? 'bg-gradient-to-br from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-600 hover:to-green-700'
            : 'bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'}
        text-white rounded-2xl shadow-2xl transition-all duration-300 ease-out
        hover:shadow-3xl hover:scale-110 active:scale-95 
        border-3 border-white/30 backdrop-blur-sm
        ring-4 ring-black/10 dark:ring-white/10
      `, style: {
            ...getPositionStyle(),
            pointerEvents: 'auto',
            zIndex: 999999,
            // 다크모드에서도 확실히 보이도록 box-shadow 강화
            boxShadow: isServerRunning
                ? '0 20px 40px -12px rgba(16, 185, 129, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                : '0 20px 40px -12px rgba(99, 102, 241, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
        }, title: isServerRunning ? '🎭 API Mock 실행 중 - 클릭하여 관리' : '🎭 API Mock 중단됨 - 클릭하여 시작', children: [_jsx("div", { className: `absolute inset-0 rounded-2xl transition-opacity duration-300 ${isServerRunning
                    ? 'bg-emerald-400/30 animate-pulse'
                    : 'bg-indigo-400/30'}` }), _jsx("div", { className: "relative z-10", children: buttonIcon || (_jsxs("div", { className: "flex items-center space-x-1", children: [_jsx(Database, { className: "w-6 h-6 drop-shadow-sm" }), _jsx(Zap, { className: "w-4 h-4 opacity-90 drop-shadow-sm" })] })) }), isServerRunning && (_jsxs(_Fragment, { children: [_jsx("div", { className: "absolute -top-2 -right-2 w-5 h-5 bg-green-400 rounded-full border-3 border-white shadow-lg", children: _jsx("div", { className: "w-full h-full bg-green-400 rounded-full animate-pulse" }) }), _jsx("div", { className: "absolute -top-2 -right-2 w-5 h-5 bg-green-400 rounded-full animate-ping opacity-75" })] })), _jsxs("div", { className: "absolute bottom-full mb-3 left-1/2 transform -translate-x-1/2 \r\n                     bg-gray-900/95 dark:bg-gray-100/95 text-white dark:text-gray-900 \r\n                     text-xs px-3 py-2 rounded-lg whitespace-nowrap font-medium\r\n                     opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none\r\n                     border border-white/20 dark:border-gray-900/20 shadow-xl", children: [isServerRunning ? '🎭 API Mock 실행 중' : '🎭 API Mock 관리', _jsx("div", { className: "absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent \r\n                       border-t-gray-900/95 dark:border-t-gray-100/95" })] }), _jsx("div", { className: "absolute -inset-2 rounded-3xl" })] }));
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
    const SimpleMockGui = () => (_jsxs("div", { className: "p-4 space-y-4", children: [_jsxs("div", { className: "bg-gray-50 dark:bg-gray-700 p-4 rounded-lg", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("h3", { className: "font-semibold text-gray-800 dark:text-gray-200", children: "Mock Server" }), _jsxs("div", { className: "flex items-center space-x-2", children: [isServerRunning ? (_jsx(Wifi, { className: "w-4 h-4 text-green-600 dark:text-green-400" })) : (_jsx(WifiOff, { className: "w-4 h-4 text-gray-400" })), _jsx("span", { className: `text-sm ${isServerRunning ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`, children: isServerRunning ? 'Running' : 'Stopped' })] })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsxs("button", { onClick: isServerRunning ? handleStopServer : handleStartServer, className: `
              flex items-center space-x-2 px-3 py-1.5 rounded text-sm font-medium transition-colors
              ${isServerRunning
                                    ? 'bg-red-600 hover:bg-red-700 text-white'
                                    : 'bg-green-600 hover:bg-green-700 text-white'}
            `, children: [isServerRunning ? _jsx(Square, { className: "w-4 h-4" }) : _jsx(Play, { className: "w-4 h-4" }), isServerRunning ? 'Stop' : 'Start'] }), handlerCount > 0 && (_jsxs("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: [handlerCount, " handlers active"] }))] }), serverError && (_jsx("div", { className: "mt-2 p-2 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded text-red-700 dark:text-red-400 text-sm", children: serverError }))] }), editingApi && (_jsxs("div", { className: "bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsx("h3", { className: "font-semibold text-blue-800 dark:text-blue-300", children: editingApi.id ? 'Edit API' : 'Add New API' }), _jsx("button", { onClick: () => setEditingApi(null), className: "text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300", children: _jsx(X, { className: "w-4 h-4" }) })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Name" }), _jsx("input", { type: "text", value: editingApi.id ? editingApi.name : newApiForm.name, onChange: (e) => editingApi.id
                                            ? setEditingApi({ ...editingApi, name: e.target.value })
                                            : setNewApiForm({ ...newApiForm, name: e.target.value }), className: "w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100", placeholder: "e.g. Get Users" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Method" }), _jsxs("select", { value: editingApi.id ? editingApi.method : newApiForm.method, onChange: (e) => editingApi.id
                                                    ? setEditingApi({ ...editingApi, method: e.target.value })
                                                    : setNewApiForm({ ...newApiForm, method: e.target.value }), className: "w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100", children: [_jsx("option", { value: "GET", children: "GET" }), _jsx("option", { value: "POST", children: "POST" }), _jsx("option", { value: "PUT", children: "PUT" }), _jsx("option", { value: "DELETE", children: "DELETE" }), _jsx("option", { value: "PATCH", children: "PATCH" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Path" }), _jsx("input", { type: "text", value: editingApi.id ? editingApi.path : newApiForm.path, onChange: (e) => editingApi.id
                                                    ? setEditingApi({ ...editingApi, path: e.target.value })
                                                    : setNewApiForm({ ...newApiForm, path: e.target.value }), className: "w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100", placeholder: "/api/users" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Description" }), _jsx("input", { type: "text", value: editingApi.id ? editingApi.description || '' : newApiForm.description, onChange: (e) => editingApi.id
                                            ? setEditingApi({ ...editingApi, description: e.target.value })
                                            : setNewApiForm({ ...newApiForm, description: e.target.value }), className: "w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100", placeholder: "Optional description" })] }), _jsxs("div", { className: "flex space-x-2 pt-2", children: [_jsxs("button", { onClick: editingApi.id ? () => {
                                            store.updateApi(editingApi.id, editingApi);
                                            setEditingApi(null);
                                        } : handleSaveNewApi, className: "px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors", children: [editingApi.id ? 'Update' : 'Add', " API"] }), _jsx("button", { onClick: () => setEditingApi(null), className: "px-4 py-1.5 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 rounded text-sm transition-colors", children: "Cancel" })] })] })] })), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsxs("h3", { className: "font-semibold text-gray-800 dark:text-gray-200", children: ["Mock APIs (", store.apis.length, ")"] }), _jsxs("button", { onClick: () => setEditingApi({
                                    id: '',
                                    name: '',
                                    method: 'GET',
                                    path: '',
                                    description: '',
                                    cases: [],
                                    isEnabled: true,
                                    createdAt: new Date().toISOString(),
                                    updatedAt: new Date().toISOString()
                                }), className: "flex items-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors", children: [_jsx(Plus, { className: "w-4 h-4" }), _jsx("span", { children: "Add API" })] })] }), _jsx("div", { className: "space-y-2 max-h-64 overflow-y-auto", children: store.apis.length === 0 ? (_jsxs("div", { className: "text-center py-8 text-gray-500 dark:text-gray-400", children: [_jsx(Database, { className: "w-8 h-8 mx-auto mb-2 text-gray-400 dark:text-gray-500" }), _jsx("p", { children: "No APIs configured yet" }), _jsx("p", { className: "text-sm", children: "Click \"Add API\" to get started" })] })) : (store.apis.map((api) => (_jsxs("div", { className: "bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("span", { className: `
                      px-2 py-1 rounded text-xs font-medium
                      ${api.method === 'GET' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300' :
                                                        api.method === 'POST' ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300' :
                                                            api.method === 'PUT' ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300' :
                                                                api.method === 'DELETE' ? 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300' :
                                                                    'bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200'}
                    `, children: api.method }), _jsxs("div", { children: [_jsx("div", { className: "font-medium text-sm text-gray-900 dark:text-gray-100", children: api.name }), _jsx("div", { className: "text-xs text-gray-500 dark:text-gray-400", children: api.path })] })] }), _jsxs("div", { className: "flex items-center space-x-1", children: [_jsx("button", { onClick: () => setEditingApi(api), className: "p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors", children: _jsx(Edit, { className: "w-4 h-4 text-gray-500 dark:text-gray-400" }) }), _jsx("button", { onClick: () => store.deleteApi(api.id), className: "p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors", children: _jsx(Trash2, { className: "w-4 h-4 text-red-500 dark:text-red-400" }) })] })] }), api.cases.length > 0 && (_jsxs("div", { className: "mt-2 text-xs text-gray-500 dark:text-gray-400", children: [api.cases.length, " response case(s)"] }))] }, api.id)))) })] })] }));
    const FloatingPanel = () => (_jsxs("div", { ref: panelRef, onMouseDown: handleMouseDown, className: "bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden backdrop-blur-lg", style: {
            ...getPositionStyle(),
            width: panelWidth,
            height: isMinimized ? 'auto' : panelHeight,
            maxHeight: '90vh',
            zIndex: 999999
        }, children: [_jsxs("div", { className: "bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 p-3 flex items-center justify-between cursor-move", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx(Database, { className: "w-5 h-5 text-gray-600 dark:text-gray-300" }), _jsx("h2", { className: "font-semibold text-gray-800 dark:text-gray-200", children: "API Mock Manager" })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [minimizable && (_jsx("button", { onClick: () => setIsMinimized(!isMinimized), className: "p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors", children: isMinimized ? _jsx(Maximize2, { className: "w-4 h-4 text-gray-600 dark:text-gray-300" }) : _jsx(Minimize2, { className: "w-4 h-4 text-gray-600 dark:text-gray-300" }) })), _jsx("button", { onClick: () => setIsOpen(false), className: "p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors", children: _jsx(X, { className: "w-4 h-4 text-gray-600 dark:text-gray-300" }) })] })] }), !isMinimized && (_jsx("div", { className: "overflow-y-auto bg-white dark:bg-gray-800", style: { height: 'calc(100% - 60px)' }, children: _jsx(SimpleMockGui, {}) }))] }));
    return (_jsxs(_Fragment, { children: [!isOpen && _jsx(FloatingButton, {}), isOpen && _jsx(FloatingPanel, {})] }));
};
