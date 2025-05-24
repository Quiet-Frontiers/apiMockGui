import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { Play, Square, Wifi, WifiOff } from 'lucide-react';
import { ApiMockGui } from './ApiMockGui';
import { createMockServer } from '../msw/mockServer';
export const ApiMockManager = ({ serverConfig, autoStart = false, onServerStart, onServerStop, ...guiProps }) => {
    const [isServerRunning, setIsServerRunning] = useState(false);
    const [serverError, setServerError] = useState(null);
    const [handlerCount, setHandlerCount] = useState(0);
    const mockServerRef = useRef(null);
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
    // API 설정 변경 시 핸들러 업데이트
    const handleConfigChange = (apis) => {
        if (mockServerRef.current) {
            mockServerRef.current.updateHandlers(apis);
            setHandlerCount(mockServerRef.current.getHandlerCount());
        }
        // 부모 컴포넌트에 변경 알림
        if (guiProps.onConfigChange) {
            guiProps.onConfigChange(apis);
        }
    };
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
    const ServerStatusPanel = () => (_jsx("div", { className: "bg-white border-b border-gray-200 px-6 py-3", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [isServerRunning ? (_jsx(Wifi, { className: "w-5 h-5 text-green-600" })) : (_jsx(WifiOff, { className: "w-5 h-5 text-gray-400" })), _jsxs("span", { className: "text-sm font-medium text-gray-900", children: ["Mock Server: ", isServerRunning ? 'Running' : 'Stopped'] })] }), isServerRunning && (_jsxs("div", { className: "text-sm text-gray-600", children: [handlerCount, " handler", handlerCount !== 1 ? 's' : '', " active"] })), serverConfig?.baseUrl && (_jsxs("div", { className: "text-sm text-gray-500", children: ["Base URL: ", _jsx("span", { className: "font-mono", children: serverConfig.baseUrl })] }))] }), _jsxs("div", { className: "flex items-center space-x-2", children: [serverError && (_jsxs("div", { className: "text-sm text-red-600 mr-3", children: ["Error: ", serverError] })), _jsx("button", { onClick: isServerRunning ? handleStopServer : handleStartServer, className: `flex items-center space-x-2 px-3 py-1 rounded text-sm font-medium ${isServerRunning
                                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                : 'bg-green-100 text-green-700 hover:bg-green-200'}`, children: isServerRunning ? (_jsxs(_Fragment, { children: [_jsx(Square, { className: "w-4 h-4" }), _jsx("span", { children: "Stop Server" })] })) : (_jsxs(_Fragment, { children: [_jsx(Play, { className: "w-4 h-4" }), _jsx("span", { children: "Start Server" })] })) })] })] }) }));
    return (_jsxs("div", { className: "api-mock-manager", children: [_jsx(ServerStatusPanel, {}), _jsx(ApiMockGui, { ...guiProps, onConfigChange: handleConfigChange })] }));
};
