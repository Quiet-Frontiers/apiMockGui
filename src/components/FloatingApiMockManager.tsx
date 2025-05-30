import React, { useState, useEffect, useRef } from 'react';
import { Settings, X, Play, Square, Wifi, WifiOff, Minimize2, Maximize2, Plus, Edit, Trash2, Database, Server, Zap } from 'lucide-react';
import { ApiMockManagerProps, MockApi, MockResponseCase, HttpMethod, HttpStatus } from '../types';
import { MockServer } from '../mock/mockServer';
import { useMockApiStore } from '../hooks/useMockApiStore';

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
  const [editingApi, setEditingApi] = useState<MockApi | null>(null);
  const [editingCase, setEditingCase] = useState<{ api: MockApi; case: MockResponseCase } | null>(null);
  const [newApiForm, setNewApiForm] = useState({ 
    name: '', 
    method: 'GET' as HttpMethod, 
    path: '', 
    description: '' 
  });
  
  const mockServerRef = useRef<MockServer | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);

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
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('🎭 Floating button clicked!');
        setIsOpen(true);
      }}
      className={`
        api-mock-floating-btn group relative flex items-center justify-center w-16 h-16
        ${isServerRunning 
          ? 'bg-gradient-to-br from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-600 hover:to-green-700' 
          : 'bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
        }
        text-white rounded-2xl shadow-2xl transition-all duration-300 ease-out
        hover:shadow-3xl hover:scale-110 active:scale-95 
        border-3 border-white/30 backdrop-blur-sm
        ring-4 ring-black/10 dark:ring-white/10
      `}
      style={{ 
        ...getPositionStyle(), 
        pointerEvents: 'auto',
        zIndex: 999999,
        // 다크모드에서도 확실히 보이도록 box-shadow 강화
        boxShadow: isServerRunning 
          ? '0 20px 40px -12px rgba(16, 185, 129, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
          : '0 20px 40px -12px rgba(99, 102, 241, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
      }}
      title={isServerRunning ? '🎭 API Mock 실행 중 - 클릭하여 관리' : '🎭 API Mock 중단됨 - 클릭하여 시작'}
    >
      {/* 배경 글로우 효과 - 다크모드에서도 보이도록 */}
      <div className={`absolute inset-0 rounded-2xl transition-opacity duration-300 ${isServerRunning 
        ? 'bg-emerald-400/30 animate-pulse' 
        : 'bg-indigo-400/30'
      }`} />
      
      {/* 기본 아이콘 - 더 큰 크기로 */}
      <div className="relative z-10">
        {buttonIcon || (
          <div className="flex items-center space-x-1">
            <Database className="w-6 h-6 drop-shadow-sm" />
            <Zap className="w-4 h-4 opacity-90 drop-shadow-sm" />
          </div>
        )}
      </div>
      
      {/* 실행 상태 표시 - 더 눈에 띄게 */}
      {isServerRunning && (
        <>
          <div className="absolute -top-2 -right-2 w-5 h-5 bg-green-400 rounded-full border-3 border-white shadow-lg">
            <div className="w-full h-full bg-green-400 rounded-full animate-pulse" />
          </div>
          <div className="absolute -top-2 -right-2 w-5 h-5 bg-green-400 rounded-full animate-ping opacity-75" />
        </>
      )}
      
      {/* 호버 효과 - 라벨 표시 (다크모드 대응) */}
      <div className="absolute bottom-full mb-3 left-1/2 transform -translate-x-1/2 
                     bg-gray-900/95 dark:bg-gray-100/95 text-white dark:text-gray-900 
                     text-xs px-3 py-2 rounded-lg whitespace-nowrap font-medium
                     opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none
                     border border-white/20 dark:border-gray-900/20 shadow-xl">
        {isServerRunning ? '🎭 API Mock 실행 중' : '🎭 API Mock 관리'}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent 
                       border-t-gray-900/95 dark:border-t-gray-100/95" />
      </div>
      
      {/* 클릭 범위 확대를 위한 투명 영역 */}
      <div className="absolute -inset-2 rounded-3xl" />
    </button>
  );

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
        status: 200 as HttpStatus,
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

  const SimpleMockGui = () => (
    <div className="p-4 space-y-4">
      {/* Server Controls */}
      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200">Mock Server</h3>
          <div className="flex items-center space-x-2">
            {isServerRunning ? (
              <Wifi className="w-4 h-4 text-green-600 dark:text-green-400" />
            ) : (
              <WifiOff className="w-4 h-4 text-gray-400" />
            )}
            <span className={`text-sm ${isServerRunning ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
              {isServerRunning ? 'Running' : 'Stopped'}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={isServerRunning ? handleStopServer : handleStartServer}
            className={`
              flex items-center space-x-2 px-3 py-1.5 rounded text-sm font-medium transition-colors
              ${isServerRunning 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-green-600 hover:bg-green-700 text-white'
              }
            `}
          >
            {isServerRunning ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isServerRunning ? 'Stop' : 'Start'}
          </button>
          
          {handlerCount > 0 && (
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {handlerCount} handlers active
            </span>
          )}
        </div>
        
        {serverError && (
          <div className="mt-2 p-2 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded text-red-700 dark:text-red-400 text-sm">
            {serverError}
          </div>
        )}
      </div>

      {/* Add/Edit API Form */}
      {editingApi && (
        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-blue-800 dark:text-blue-300">
              {editingApi.id ? 'Edit API' : 'Add New API'}
            </h3>
            <button
              onClick={() => setEditingApi(null)}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
              <input
                type="text"
                value={editingApi.id ? editingApi.name : newApiForm.name}
                onChange={(e) => editingApi.id 
                  ? setEditingApi({...editingApi, name: e.target.value})
                  : setNewApiForm({...newApiForm, name: e.target.value})
                }
                className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="e.g. Get Users"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Method</label>
                <select
                  value={editingApi.id ? editingApi.method : newApiForm.method}
                  onChange={(e) => editingApi.id
                    ? setEditingApi({...editingApi, method: e.target.value as HttpMethod})
                    : setNewApiForm({...newApiForm, method: e.target.value as HttpMethod})
                  }
                  className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                  <option value="PATCH">PATCH</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Path</label>
                <input
                  type="text"
                  value={editingApi.id ? editingApi.path : newApiForm.path}
                  onChange={(e) => editingApi.id
                    ? setEditingApi({...editingApi, path: e.target.value})
                    : setNewApiForm({...newApiForm, path: e.target.value})
                  }
                  className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="/api/users"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
              <input
                type="text"
                value={editingApi.id ? editingApi.description || '' : newApiForm.description}
                onChange={(e) => editingApi.id
                  ? setEditingApi({...editingApi, description: e.target.value})
                  : setNewApiForm({...newApiForm, description: e.target.value})
                }
                className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Optional description"
              />
            </div>
            
            <div className="flex space-x-2 pt-2">
              <button
                onClick={editingApi.id ? () => {
                  store.updateApi(editingApi.id, editingApi);
                  setEditingApi(null);
                } : handleSaveNewApi}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
              >
                {editingApi.id ? 'Update' : 'Add'} API
              </button>
              <button
                onClick={() => setEditingApi(null)}
                className="px-4 py-1.5 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 rounded text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* API List */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200">Mock APIs ({store.apis.length})</h3>
          <button
            onClick={() => setEditingApi({
              id: '',
              name: '',
              method: 'GET' as HttpMethod,
              path: '',
              description: '',
              cases: [],
              isEnabled: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            })}
            className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add API</span>
          </button>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {store.apis.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Database className="w-8 h-8 mx-auto mb-2 text-gray-400 dark:text-gray-500" />
              <p>No APIs configured yet</p>
              <p className="text-sm">Click "Add API" to get started</p>
            </div>
          ) : (
            store.apis.map((api) => (
              <div key={api.id} className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className={`
                      px-2 py-1 rounded text-xs font-medium
                      ${api.method === 'GET' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300' :
                        api.method === 'POST' ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300' :
                        api.method === 'PUT' ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300' :
                        api.method === 'DELETE' ? 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300' :
                        'bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200'
                      }
                    `}>
                      {api.method}
                    </span>
                    <div>
                      <div className="font-medium text-sm text-gray-900 dark:text-gray-100">{api.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{api.path}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => setEditingApi(api)}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors"
                    >
                      <Edit className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </button>
                    <button
                      onClick={() => store.deleteApi(api.id)}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-500 dark:text-red-400" />
                    </button>
                  </div>
                </div>
                
                {api.cases.length > 0 && (
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    {api.cases.length} response case(s)
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  const FloatingPanel = () => (
    <div
      ref={panelRef}
      onMouseDown={handleMouseDown}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden backdrop-blur-lg"
      style={{
        ...getPositionStyle(),
        width: panelWidth,
        height: isMinimized ? 'auto' : panelHeight,
        maxHeight: '90vh',
        zIndex: 999999
      }}
    >
      {/* Header */}
      <div className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 p-3 flex items-center justify-between cursor-move">
        <div className="flex items-center space-x-3">
          <Database className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          <h2 className="font-semibold text-gray-800 dark:text-gray-200">API Mock Manager</h2>
        </div>
        
        <div className="flex items-center space-x-2">
          {minimizable && (
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
            >
              {isMinimized ? <Maximize2 className="w-4 h-4 text-gray-600 dark:text-gray-300" /> : <Minimize2 className="w-4 h-4 text-gray-600 dark:text-gray-300" />}
            </button>
          )}
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
          >
            <X className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </div>

      {/* Content */}
      {!isMinimized && (
        <div className="overflow-y-auto bg-white dark:bg-gray-800" style={{ height: 'calc(100% - 60px)' }}>
          <SimpleMockGui />
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