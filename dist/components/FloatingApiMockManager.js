import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { Settings, X, Play, Square, Wifi, WifiOff, Minimize2, Maximize2 } from 'lucide-react';
import { ApiMockGui } from './ApiMockGui';
import { createMockServer } from '../msw/mockServer';
export const FloatingApiMockManager = ({ serverConfig, autoStart = false, onServerStart, onServerStop, position = 'bottom-right', buttonText, buttonIcon, panelWidth = '800px', panelHeight = '600px', minimizable = true, draggable = true, ...guiProps }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [isServerRunning, setIsServerRunning] = useState(false);
    const [serverError, setServerError] = useState(null);
    const [handlerCount, setHandlerCount] = useState(0);
    const [dragPosition, setDragPosition] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const mockServerRef = useRef(null);
    const panelRef = useRef(null);
    const dragStartRef = useRef(null);
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
        flex items-center space-x-2 px-4 py-3 
        ${isServerRunning ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'}
        text-white rounded-full shadow-lg transition-all duration-200
        hover:shadow-xl active:scale-95
      `, style: getPositionStyle(), children: [buttonIcon || _jsx(Settings, { className: "w-5 h-5" }), buttonText && _jsx("span", { className: "text-sm font-medium", children: buttonText }), isServerRunning && (_jsx("div", { className: "w-2 h-2 bg-white rounded-full animate-pulse" }))] }));
    const FloatingPanel = () => (_jsxs("div", { ref: panelRef, className: "bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden", style: {
            ...getPositionStyle(),
            width: panelWidth,
            height: isMinimized ? 'auto' : panelHeight,
            maxWidth: '90vw',
            maxHeight: '90vh'
        }, children: [_jsxs("div", { className: `bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center justify-between ${draggable ? 'cursor-move' : ''}`, onMouseDown: handleMouseDown, children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [isServerRunning ? (_jsx(Wifi, { className: "w-4 h-4 text-green-600" })) : (_jsx(WifiOff, { className: "w-4 h-4 text-gray-400" })), _jsx("h3", { className: "font-semibold text-gray-900", children: "API Mock Manager" })] }), isServerRunning && (_jsxs("div", { className: "text-xs text-gray-600 bg-gray-200 px-2 py-1 rounded", children: [handlerCount, " active"] }))] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("button", { onClick: isServerRunning ? handleStopServer : handleStartServer, className: `flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium ${isServerRunning
                                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                    : 'bg-green-100 text-green-700 hover:bg-green-200'}`, children: isServerRunning ? (_jsxs(_Fragment, { children: [_jsx(Square, { className: "w-3 h-3" }), _jsx("span", { children: "Stop" })] })) : (_jsxs(_Fragment, { children: [_jsx(Play, { className: "w-3 h-3" }), _jsx("span", { children: "Start" })] })) }), minimizable && (_jsx("button", { onClick: () => setIsMinimized(!isMinimized), className: "p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded", children: isMinimized ? (_jsx(Maximize2, { className: "w-4 h-4" })) : (_jsx(Minimize2, { className: "w-4 h-4" })) })), _jsx("button", { onClick: () => setIsOpen(false), className: "p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded", children: _jsx(X, { className: "w-4 h-4" }) })] })] }), serverError && (_jsx("div", { className: "bg-red-50 border-b border-red-200 px-4 py-2", children: _jsxs("div", { className: "text-sm text-red-600", children: [_jsx("strong", { children: "Error:" }), " ", serverError] }) })), !isMinimized && (_jsx("div", { className: "overflow-hidden", style: { height: 'calc(100% - 60px)' }, children: _jsx(ApiMockGui, { ...guiProps, onConfigChange: handleConfigChange }) }))] }));
    return (_jsxs(_Fragment, { children: [!isOpen && _jsx(FloatingButton, {}), isOpen && _jsx(FloatingPanel, {})] }));
};
