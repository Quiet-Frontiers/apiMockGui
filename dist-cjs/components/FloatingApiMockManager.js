"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FloatingApiMockManager = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
const mockServer_1 = require("../mock/mockServer");
const useMockApiStore_1 = require("../hooks/useMockApiStore");
const FloatingApiMockManager = ({ serverConfig, autoStart = false, onServerStart, onServerStop, position = 'bottom-right', buttonText, buttonIcon, panelWidth = '800px', panelHeight = '600px', minimizable = true, draggable = true, ...guiProps }) => {
    const [isOpen, setIsOpen] = (0, react_1.useState)(false);
    const [isMinimized, setIsMinimized] = (0, react_1.useState)(false);
    const [isServerRunning, setIsServerRunning] = (0, react_1.useState)(false);
    const [serverError, setServerError] = (0, react_1.useState)(null);
    const [handlerCount, setHandlerCount] = (0, react_1.useState)(0);
    const [dragPosition, setDragPosition] = (0, react_1.useState)(null);
    const [isDragging, setIsDragging] = (0, react_1.useState)(false);
    const [editingApi, setEditingApi] = (0, react_1.useState)(null);
    const [editingCase, setEditingCase] = (0, react_1.useState)(null);
    const [newApiForm, setNewApiForm] = (0, react_1.useState)({
        name: '',
        method: 'GET',
        path: '',
        description: ''
    });
    const mockServerRef = (0, react_1.useRef)(null);
    const panelRef = (0, react_1.useRef)(null);
    const dragStartRef = (0, react_1.useRef)(null);
    const store = (0, useMockApiStore_1.useMockApiStore)();
    // MockServer 인스턴스 초기화
    (0, react_1.useEffect)(() => {
        if (!mockServerRef.current) {
            mockServerRef.current = new mockServer_1.MockServer(serverConfig);
        }
    }, [serverConfig]);
    // 자동 시작
    (0, react_1.useEffect)(() => {
        if (autoStart && mockServerRef.current && !isServerRunning) {
            handleStartServer();
        }
    }, [autoStart]);
    // API 설정 변경 시 핸들러 업데이트
    (0, react_1.useEffect)(() => {
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
    (0, react_1.useEffect)(() => {
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
    const FloatingButton = () => ((0, jsx_runtime_1.jsxs)("button", { onClick: () => setIsOpen(true), className: `
        relative flex items-center justify-center w-12 h-12
        ${isServerRunning ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'}
        text-white rounded-full shadow-lg transition-all duration-200
        hover:shadow-xl active:scale-95
      `, style: { ...getPositionStyle(), pointerEvents: 'auto' }, title: isServerRunning ? 'API Mock Running' : 'API Mock Stopped', children: [buttonIcon || (0, jsx_runtime_1.jsx)(lucide_react_1.Settings, { className: "w-5 h-5" }), isServerRunning && ((0, jsx_runtime_1.jsx)("div", { className: "absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse border-2 border-white" }))] }));
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
    const SimpleMockGui = () => ((0, jsx_runtime_1.jsxs)("div", { className: "p-4 space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "bg-gray-50 p-4 rounded-lg", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-2", children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-semibold", children: "Mock Server" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [isServerRunning ? ((0, jsx_runtime_1.jsx)(lucide_react_1.Wifi, { className: "w-4 h-4 text-green-600" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.WifiOff, { className: "w-4 h-4 text-gray-400" })), (0, jsx_runtime_1.jsx)("span", { className: `text-sm ${isServerRunning ? 'text-green-600' : 'text-gray-500'}`, children: isServerRunning ? 'Running' : 'Stopped' })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsxs)("button", { onClick: isServerRunning ? handleStopServer : handleStartServer, className: `
              flex items-center space-x-2 px-3 py-1.5 rounded text-sm font-medium
              ${isServerRunning
                                    ? 'bg-red-600 hover:bg-red-700 text-white'
                                    : 'bg-green-600 hover:bg-green-700 text-white'}
            `, children: [isServerRunning ? (0, jsx_runtime_1.jsx)(lucide_react_1.Square, { className: "w-4 h-4" }) : (0, jsx_runtime_1.jsx)(lucide_react_1.Play, { className: "w-4 h-4" }), isServerRunning ? 'Stop' : 'Start'] }), handlerCount > 0 && ((0, jsx_runtime_1.jsxs)("span", { className: "text-sm text-gray-600", children: [handlerCount, " handlers active"] }))] }), serverError && ((0, jsx_runtime_1.jsx)("div", { className: "mt-2 p-2 bg-red-100 border border-red-300 rounded text-red-700 text-sm", children: serverError }))] }), editingApi && ((0, jsx_runtime_1.jsxs)("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-3", children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-semibold text-blue-800", children: editingApi.id ? 'Edit API' : 'Add New API' }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setEditingApi(null), className: "text-blue-600 hover:text-blue-800", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "w-4 h-4" }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Name" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: editingApi.id ? editingApi.name : newApiForm.name, onChange: (e) => editingApi.id
                                            ? setEditingApi({ ...editingApi, name: e.target.value })
                                            : setNewApiForm({ ...newApiForm, name: e.target.value }), className: "w-full px-3 py-1.5 border border-gray-300 rounded text-sm", placeholder: "e.g. Get Users" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-3", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Method" }), (0, jsx_runtime_1.jsxs)("select", { value: editingApi.id ? editingApi.method : newApiForm.method, onChange: (e) => editingApi.id
                                                    ? setEditingApi({ ...editingApi, method: e.target.value })
                                                    : setNewApiForm({ ...newApiForm, method: e.target.value }), className: "w-full px-3 py-1.5 border border-gray-300 rounded text-sm", children: [(0, jsx_runtime_1.jsx)("option", { value: "GET", children: "GET" }), (0, jsx_runtime_1.jsx)("option", { value: "POST", children: "POST" }), (0, jsx_runtime_1.jsx)("option", { value: "PUT", children: "PUT" }), (0, jsx_runtime_1.jsx)("option", { value: "DELETE", children: "DELETE" }), (0, jsx_runtime_1.jsx)("option", { value: "PATCH", children: "PATCH" })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Path" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: editingApi.id ? editingApi.path : newApiForm.path, onChange: (e) => editingApi.id
                                                    ? setEditingApi({ ...editingApi, path: e.target.value })
                                                    : setNewApiForm({ ...newApiForm, path: e.target.value }), className: "w-full px-3 py-1.5 border border-gray-300 rounded text-sm", placeholder: "/api/users" })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Description" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: editingApi.id ? editingApi.description || '' : newApiForm.description, onChange: (e) => editingApi.id
                                            ? setEditingApi({ ...editingApi, description: e.target.value })
                                            : setNewApiForm({ ...newApiForm, description: e.target.value }), className: "w-full px-3 py-1.5 border border-gray-300 rounded text-sm", placeholder: "Optional description" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex space-x-2 pt-2", children: [(0, jsx_runtime_1.jsxs)("button", { onClick: editingApi.id ? () => {
                                            store.updateApi(editingApi.id, editingApi);
                                            setEditingApi(null);
                                        } : handleSaveNewApi, className: "px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm", children: [editingApi.id ? 'Update' : 'Add', " API"] }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setEditingApi(null), className: "px-4 py-1.5 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded text-sm", children: "Cancel" })] })] })] })), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-3", children: [(0, jsx_runtime_1.jsxs)("h3", { className: "font-semibold", children: ["Mock APIs (", store.apis.length, ")"] }), (0, jsx_runtime_1.jsxs)("button", { onClick: () => setEditingApi({
                                    id: '',
                                    name: '',
                                    method: 'GET',
                                    path: '',
                                    description: '',
                                    cases: [],
                                    isEnabled: true,
                                    createdAt: new Date().toISOString(),
                                    updatedAt: new Date().toISOString()
                                }), className: "flex items-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Plus, { className: "w-4 h-4" }), (0, jsx_runtime_1.jsx)("span", { children: "Add API" })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-2 max-h-64 overflow-y-auto", children: store.apis.length === 0 ? ((0, jsx_runtime_1.jsxs)("div", { className: "text-center py-8 text-gray-500", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Settings, { className: "w-8 h-8 mx-auto mb-2 text-gray-400" }), (0, jsx_runtime_1.jsx)("p", { children: "No APIs configured yet" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm", children: "Click \"Add API\" to get started" })] })) : (store.apis.map((api) => ((0, jsx_runtime_1.jsxs)("div", { className: "bg-white border border-gray-200 rounded-lg p-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3", children: [(0, jsx_runtime_1.jsx)("span", { className: `
                      px-2 py-1 rounded text-xs font-medium
                      ${api.method === 'GET' ? 'bg-blue-100 text-blue-800' :
                                                        api.method === 'POST' ? 'bg-green-100 text-green-800' :
                                                            api.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                                                                api.method === 'DELETE' ? 'bg-red-100 text-red-800' :
                                                                    'bg-gray-100 text-gray-800'}
                    `, children: api.method }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "font-medium text-sm", children: api.name }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs text-gray-500", children: api.path })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-1", children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => setEditingApi(api), className: "p-1 hover:bg-gray-100 rounded", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Edit, { className: "w-4 h-4 text-gray-500" }) }), (0, jsx_runtime_1.jsx)("button", { onClick: () => store.deleteApi(api.id), className: "p-1 hover:bg-gray-100 rounded", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Trash2, { className: "w-4 h-4 text-red-500" }) })] })] }), api.cases.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "mt-2 text-xs text-gray-500", children: [api.cases.length, " response case(s)"] }))] }, api.id)))) })] })] }));
    const FloatingPanel = () => ((0, jsx_runtime_1.jsxs)("div", { ref: panelRef, className: "bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden", style: {
            ...getPositionStyle(),
            width: panelWidth,
            height: isMinimized ? 'auto' : panelHeight,
            maxHeight: '90vh'
        }, children: [(0, jsx_runtime_1.jsxs)("div", { className: "bg-gray-50 border-b border-gray-200 p-3 flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Settings, { className: "w-5 h-5 text-gray-600" }), (0, jsx_runtime_1.jsx)("h2", { className: "font-semibold text-gray-800", children: "API Mock Manager" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [minimizable && ((0, jsx_runtime_1.jsx)("button", { onClick: () => setIsMinimized(!isMinimized), className: "p-1 hover:bg-gray-200 rounded", children: isMinimized ? (0, jsx_runtime_1.jsx)(lucide_react_1.Maximize2, { className: "w-4 h-4" }) : (0, jsx_runtime_1.jsx)(lucide_react_1.Minimize2, { className: "w-4 h-4" }) })), (0, jsx_runtime_1.jsx)("button", { onClick: () => setIsOpen(false), className: "p-1 hover:bg-gray-200 rounded", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "w-4 h-4" }) })] })] }), !isMinimized && ((0, jsx_runtime_1.jsx)("div", { className: "overflow-y-auto", style: { height: 'calc(100% - 60px)' }, children: (0, jsx_runtime_1.jsx)(SimpleMockGui, {}) }))] }));
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [!isOpen && (0, jsx_runtime_1.jsx)(FloatingButton, {}), isOpen && (0, jsx_runtime_1.jsx)(FloatingPanel, {})] }));
};
exports.FloatingApiMockManager = FloatingApiMockManager;
