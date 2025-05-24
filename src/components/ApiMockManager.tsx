import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, Wifi, WifiOff } from 'lucide-react';
import { ApiMockGuiProps, ApiMockManagerProps, MockApi } from '../types';
import { ApiMockGui } from './ApiMockGui';
import { MockServer, createMockServer } from '../msw/mockServer';

export const ApiMockManager: React.FC<ApiMockManagerProps> = ({
  serverConfig,
  autoStart = false,
  onServerStart,
  onServerStop,
  ...guiProps
}) => {
  const [isServerRunning, setIsServerRunning] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [handlerCount, setHandlerCount] = useState(0);
  const mockServerRef = useRef<MockServer | null>(null);

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
    
    // 부모 컴포넌트에 변경 알림
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

  const ServerStatusPanel = () => (
    <div className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {isServerRunning ? (
              <Wifi className="w-5 h-5 text-green-600" />
            ) : (
              <WifiOff className="w-5 h-5 text-gray-400" />
            )}
            <span className="text-sm font-medium text-gray-900">
              Mock Server: {isServerRunning ? 'Running' : 'Stopped'}
            </span>
          </div>
          
          {isServerRunning && (
            <div className="text-sm text-gray-600">
              {handlerCount} handler{handlerCount !== 1 ? 's' : ''} active
            </div>
          )}
          
          {serverConfig?.baseUrl && (
            <div className="text-sm text-gray-500">
              Base URL: <span className="font-mono">{serverConfig.baseUrl}</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {serverError && (
            <div className="text-sm text-red-600 mr-3">
              Error: {serverError}
            </div>
          )}
          
          <button
            onClick={isServerRunning ? handleStopServer : handleStartServer}
            className={`flex items-center space-x-2 px-3 py-1 rounded text-sm font-medium ${
              isServerRunning
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            {isServerRunning ? (
              <>
                <Square className="w-4 h-4" />
                <span>Stop Server</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Start Server</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="api-mock-manager">
      <ServerStatusPanel />
      <ApiMockGui
        {...guiProps}
        onConfigChange={handleConfigChange}
      />
    </div>
  );
}; 