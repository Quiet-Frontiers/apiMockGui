import React, { useState, useEffect, useRef } from 'react';
import { Settings, X, Play, Square, Wifi, WifiOff, Minimize2, Maximize2 } from 'lucide-react';
import { ApiMockManagerProps, MockApi } from '../types';
import { ApiMockGui } from './ApiMockGui';
import { MockServer, createMockServer } from '../msw/mockServer';

interface FloatingApiMockManagerProps extends ApiMockManagerProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  buttonText?: string;
  buttonIcon?: React.ReactNode;
  panelWidth?: string;
  panelHeight?: string;
  minimizable?: boolean;
  draggable?: boolean;
}

export const FloatingApiMockManager: React.FC<FloatingApiMockManagerProps> = ({
  serverConfig,
  autoStart = false,
  onServerStart,
  onServerStop,
  position = 'bottom-right',
  buttonText,
  buttonIcon,
  panelWidth = '800px',
  panelHeight = '600px',
  minimizable = true,
  draggable = true,
  ...guiProps
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isServerRunning, setIsServerRunning] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [handlerCount, setHandlerCount] = useState(0);
  const [dragPosition, setDragPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const mockServerRef = useRef<MockServer | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);

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
  const handleConfigChange = (apis: MockApi[]) => {
    if (mockServerRef.current) {
      mockServerRef.current.updateHandlers(apis);
      setHandlerCount(mockServerRef.current.getHandlerCount());
    }
    
    if (guiProps.onConfigChange) {
      guiProps.onConfigChange(apis);
    }
  };

  const handleStartServer = async () => {
    if (!mockServerRef.current) return;

    try {
      setServerError(null);
      await mockServerRef.current.start();
      setIsServerRunning(true);
      setHandlerCount(mockServerRef.current.getHandlerCount());
      
      if (onServerStart) {
        onServerStart();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setServerError(errorMessage);
      console.error('Failed to start mock server:', error);
    }
  };

  const handleStopServer = async () => {
    if (!mockServerRef.current) return;

    try {
      setServerError(null);
      await mockServerRef.current.stop();
      setIsServerRunning(false);
      
      if (onServerStop) {
        onServerStop();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setServerError(errorMessage);
      console.error('Failed to stop mock server:', error);
    }
  };

  // 드래그 기능
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!draggable || !panelRef.current) return;
    
    setIsDragging(true);
    const rect = panelRef.current.getBoundingClientRect();
    dragStartRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragStartRef.current) return;
      
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
        position: 'fixed' as const,
        left: `${dragPosition.x}px`,
        top: `${dragPosition.y}px`,
        right: 'auto',
        bottom: 'auto'
      };
    }

    const baseStyle: React.CSSProperties = {
      position: 'fixed' as const,
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

  const FloatingButton = () => (
    <button
      onClick={() => setIsOpen(true)}
      className={`
        flex items-center space-x-2 px-4 py-3 
        ${isServerRunning ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'}
        text-white rounded-full shadow-lg transition-all duration-200
        hover:shadow-xl active:scale-95
      `}
      style={getPositionStyle()}
    >
      {buttonIcon || <Settings className="w-5 h-5" />}
      {buttonText && <span className="text-sm font-medium">{buttonText}</span>}
      {isServerRunning && (
        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
      )}
    </button>
  );

  const FloatingPanel = () => (
    <div
      ref={panelRef}
      className="bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden"
      style={{
        ...getPositionStyle(),
        width: panelWidth,
        height: isMinimized ? 'auto' : panelHeight,
        maxWidth: '90vw',
        maxHeight: '90vh'
      }}
    >
      {/* Header */}
      <div 
        className={`bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center justify-between ${draggable ? 'cursor-move' : ''}`}
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            {isServerRunning ? (
              <Wifi className="w-4 h-4 text-green-600" />
            ) : (
              <WifiOff className="w-4 h-4 text-gray-400" />
            )}
            <h3 className="font-semibold text-gray-900">API Mock Manager</h3>
          </div>
          
          {isServerRunning && (
            <div className="text-xs text-gray-600 bg-gray-200 px-2 py-1 rounded">
              {handlerCount} active
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Server Control */}
          <button
            onClick={isServerRunning ? handleStopServer : handleStartServer}
            className={`flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium ${
              isServerRunning
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            {isServerRunning ? (
              <>
                <Square className="w-3 h-3" />
                <span>Stop</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3" />
                <span>Start</span>
              </>
            )}
          </button>

          {/* Minimize Button */}
          {minimizable && (
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded"
            >
              {isMinimized ? (
                <Maximize2 className="w-4 h-4" />
              ) : (
                <Minimize2 className="w-4 h-4" />
              )}
            </button>
          )}

          {/* Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Server Error */}
      {serverError && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-2">
          <div className="text-sm text-red-600">
            <strong>Error:</strong> {serverError}
          </div>
        </div>
      )}

      {/* Content */}
      {!isMinimized && (
        <div className="overflow-hidden" style={{ height: 'calc(100% - 60px)' }}>
          <ApiMockGui
            {...guiProps}
            onConfigChange={handleConfigChange}
          />
        </div>
      )}
    </div>
  );

  return (
    <>
      {!isOpen && <FloatingButton />}
      {isOpen && <FloatingPanel />}
    </>
  );
}; 