import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { Settings, X, Play, Square, Wifi, WifiOff, Minimize2, Maximize2, Plus, Edit, Trash2, Database, Zap } from 'lucide-react';
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
    const FloatingButton = () => (_jsxs("button", { onClick: () => setIsOpen(true), className: `
        group relative flex items-center justify-center w-14 h-14
        ${isServerRunning
            ? 'bg-gradient-to-br from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-emerald-200'
            : 'bg-gradient-to-br from-slate-600 to-gray-700 hover:from-slate-700 hover:to-gray-800 shadow-slate-200'}
        text-white rounded-2xl shadow-2xl transition-all duration-300 ease-out
        hover:shadow-3xl hover:scale-110 active:scale-95 
        border-2 border-white/20 backdrop-blur-sm
      `, style: { ...getPositionStyle(), pointerEvents: 'auto' }, title: isServerRunning ? '🎭 API Mock 실행 중 - 클릭하여 관리' : '🎭 API Mock 중단됨 - 클릭하여 시작', children: [_jsx("div", { className: "relative", children: buttonIcon || (_jsxs("div", { className: "flex items-center space-x-0.5", children: [_jsx(Database, { className: "w-5 h-5" }), _jsx(Zap, { className: "w-3 h-3 opacity-80" })] })) }), isServerRunning && (_jsxs(_Fragment, { children: [_jsx("div", { className: "absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white", children: _jsx("div", { className: "w-full h-full bg-green-400 rounded-full animate-pulse" }) }), _jsx("div", { className: "absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-ping opacity-75" })] })), _jsxs("div", { className: "absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 \r\n                     bg-black/80 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap\r\n                     opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none", children: [isServerRunning ? 'API Mock 실행 중' : 'API Mock 관리', _jsx("div", { className: "absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black/80" })] }), _jsx("div", { className: `absolute inset-0 rounded-2xl transition-opacity duration-300 
                      ${isServerRunning
                    ? 'bg-emerald-400/20 opacity-0 group-hover:opacity-100'
                    : 'bg-slate-400/20 opacity-0 group-hover:opacity-100'}` })] }));
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
    const SimpleMockGui = () => (_jsxs("div", { className: "p-4 space-y-4", children: [_jsxs("div", { className: "bg-gray-50 p-4 rounded-lg", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("h3", { className: "font-semibold", children: "Mock Server" }), _jsxs("div", { className: "flex items-center space-x-2", children: [isServerRunning ? (_jsx(Wifi, { className: "w-4 h-4 text-green-600" })) : (_jsx(WifiOff, { className: "w-4 h-4 text-gray-400" })), _jsx("span", { className: `text-sm ${isServerRunning ? 'text-green-600' : 'text-gray-500'}`, children: isServerRunning ? 'Running' : 'Stopped' })] })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsxs("button", { onClick: isServerRunning ? handleStopServer : handleStartServer, className: `
              flex items-center space-x-2 px-3 py-1.5 rounded text-sm font-medium
              ${isServerRunning
                                    ? 'bg-red-600 hover:bg-red-700 text-white'
                                    : 'bg-green-600 hover:bg-green-700 text-white'}
            `, children: [isServerRunning ? _jsx(Square, { className: "w-4 h-4" }) : _jsx(Play, { className: "w-4 h-4" }), isServerRunning ? 'Stop' : 'Start'] }), handlerCount > 0 && (_jsxs("span", { className: "text-sm text-gray-600", children: [handlerCount, " handlers active"] }))] }), serverError && (_jsx("div", { className: "mt-2 p-2 bg-red-100 border border-red-300 rounded text-red-700 text-sm", children: serverError }))] }), editingApi && (_jsxs("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsx("h3", { className: "font-semibold text-blue-800", children: editingApi.id ? 'Edit API' : 'Add New API' }), _jsx("button", { onClick: () => setEditingApi(null), className: "text-blue-600 hover:text-blue-800", children: _jsx(X, { className: "w-4 h-4" }) })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Name" }), _jsx("input", { type: "text", value: editingApi.id ? editingApi.name : newApiForm.name, onChange: (e) => editingApi.id
                                            ? setEditingApi({ ...editingApi, name: e.target.value })
                                            : setNewApiForm({ ...newApiForm, name: e.target.value }), className: "w-full px-3 py-1.5 border border-gray-300 rounded text-sm", placeholder: "e.g. Get Users" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Method" }), _jsxs("select", { value: editingApi.id ? editingApi.method : newApiForm.method, onChange: (e) => editingApi.id
                                                    ? setEditingApi({ ...editingApi, method: e.target.value })
                                                    : setNewApiForm({ ...newApiForm, method: e.target.value }), className: "w-full px-3 py-1.5 border border-gray-300 rounded text-sm", children: [_jsx("option", { value: "GET", children: "GET" }), _jsx("option", { value: "POST", children: "POST" }), _jsx("option", { value: "PUT", children: "PUT" }), _jsx("option", { value: "DELETE", children: "DELETE" }), _jsx("option", { value: "PATCH", children: "PATCH" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Path" }), _jsx("input", { type: "text", value: editingApi.id ? editingApi.path : newApiForm.path, onChange: (e) => editingApi.id
                                                    ? setEditingApi({ ...editingApi, path: e.target.value })
                                                    : setNewApiForm({ ...newApiForm, path: e.target.value }), className: "w-full px-3 py-1.5 border border-gray-300 rounded text-sm", placeholder: "/api/users" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Description" }), _jsx("input", { type: "text", value: editingApi.id ? editingApi.description || '' : newApiForm.description, onChange: (e) => editingApi.id
                                            ? setEditingApi({ ...editingApi, description: e.target.value })
                                            : setNewApiForm({ ...newApiForm, description: e.target.value }), className: "w-full px-3 py-1.5 border border-gray-300 rounded text-sm", placeholder: "Optional description" })] }), _jsxs("div", { className: "flex space-x-2 pt-2", children: [_jsxs("button", { onClick: editingApi.id ? () => {
                                            store.updateApi(editingApi.id, editingApi);
                                            setEditingApi(null);
                                        } : handleSaveNewApi, className: "px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm", children: [editingApi.id ? 'Update' : 'Add', " API"] }), _jsx("button", { onClick: () => setEditingApi(null), className: "px-4 py-1.5 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded text-sm", children: "Cancel" })] })] })] })), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsxs("h3", { className: "font-semibold", children: ["Mock APIs (", store.apis.length, ")"] }), _jsxs("button", { onClick: () => setEditingApi({
                                    id: '',
                                    name: '',
                                    method: 'GET',
                                    path: '',
                                    description: '',
                                    cases: [],
                                    isEnabled: true,
                                    createdAt: new Date().toISOString(),
                                    updatedAt: new Date().toISOString()
                                }), className: "flex items-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm", children: [_jsx(Plus, { className: "w-4 h-4" }), _jsx("span", { children: "Add API" })] })] }), _jsx("div", { className: "space-y-2 max-h-64 overflow-y-auto", children: store.apis.length === 0 ? (_jsxs("div", { className: "text-center py-8 text-gray-500", children: [_jsx(Settings, { className: "w-8 h-8 mx-auto mb-2 text-gray-400" }), _jsx("p", { children: "No APIs configured yet" }), _jsx("p", { className: "text-sm", children: "Click \"Add API\" to get started" })] })) : (store.apis.map((api) => (_jsxs("div", { className: "bg-white border border-gray-200 rounded-lg p-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("span", { className: `
                      px-2 py-1 rounded text-xs font-medium
                      ${api.method === 'GET' ? 'bg-blue-100 text-blue-800' :
                                                        api.method === 'POST' ? 'bg-green-100 text-green-800' :
                                                            api.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                                                                api.method === 'DELETE' ? 'bg-red-100 text-red-800' :
                                                                    'bg-gray-100 text-gray-800'}
                    `, children: api.method }), _jsxs("div", { children: [_jsx("div", { className: "font-medium text-sm", children: api.name }), _jsx("div", { className: "text-xs text-gray-500", children: api.path })] })] }), _jsxs("div", { className: "flex items-center space-x-1", children: [_jsx("button", { onClick: () => setEditingApi(api), className: "p-1 hover:bg-gray-100 rounded", children: _jsx(Edit, { className: "w-4 h-4 text-gray-500" }) }), _jsx("button", { onClick: () => store.deleteApi(api.id), className: "p-1 hover:bg-gray-100 rounded", children: _jsx(Trash2, { className: "w-4 h-4 text-red-500" }) })] })] }), api.cases.length > 0 && (_jsxs("div", { className: "mt-2 text-xs text-gray-500", children: [api.cases.length, " response case(s)"] }))] }, api.id)))) })] })] }));
    const FloatingPanel = () => (_jsxs("div", { ref: panelRef, className: "bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden", style: {
            ...getPositionStyle(),
            width: panelWidth,
            height: isMinimized ? 'auto' : panelHeight,
            maxHeight: '90vh'
        }, children: [_jsxs("div", { className: "bg-gray-50 border-b border-gray-200 p-3 flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx(Settings, { className: "w-5 h-5 text-gray-600" }), _jsx("h2", { className: "font-semibold text-gray-800", children: "API Mock Manager" })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [minimizable && (_jsx("button", { onClick: () => setIsMinimized(!isMinimized), className: "p-1 hover:bg-gray-200 rounded", children: isMinimized ? _jsx(Maximize2, { className: "w-4 h-4" }) : _jsx(Minimize2, { className: "w-4 h-4" }) })), _jsx("button", { onClick: () => setIsOpen(false), className: "p-1 hover:bg-gray-200 rounded", children: _jsx(X, { className: "w-4 h-4" }) })] })] }), !isMinimized && (_jsx("div", { className: "overflow-y-auto", style: { height: 'calc(100% - 60px)' }, children: _jsx(SimpleMockGui, {}) }))] }));
    return (_jsxs(_Fragment, { children: [!isOpen && _jsx(FloatingButton, {}), isOpen && _jsx(FloatingPanel, {})] }));
};
