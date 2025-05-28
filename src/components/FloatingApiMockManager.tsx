import React, { useState, useEffect, useRef } from 'react';
import { Settings, X, Play, Square, Wifi, WifiOff, Minimize2, Maximize2, Plus, Edit, Trash2 } from 'lucide-react';
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
      onClick={() => setIsOpen(true)}
      className={`
        relative flex items-center justify-center w-12 h-12
        ${isServerRunning ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'}
        text-white rounded-full shadow-lg transition-all duration-200
        hover:shadow-xl active:scale-95
      `}
      style={{ ...getPositionStyle(), pointerEvents: 'auto' }}
      title={isServerRunning ? 'API Mock Running' : 'API Mock Stopped'}
    >
      {buttonIcon || <Settings className="w-5 h-5" />}
      {isServerRunning && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse border-2 border-white" />
      )}
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
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">Mock Server</h3>
          <div className="flex items-center space-x-2">
            {isServerRunning ? (
              <Wifi className="w-4 h-4 text-green-600" />
            ) : (
              <WifiOff className="w-4 h-4 text-gray-400" />
            )}
            <span className={`text-sm ${isServerRunning ? 'text-green-600' : 'text-gray-500'}`}>
              {isServerRunning ? 'Running' : 'Stopped'}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={isServerRunning ? handleStopServer : handleStartServer}
            className={`
              flex items-center space-x-2 px-3 py-1.5 rounded text-sm font-medium
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
            <span className="text-sm text-gray-600">
              {handlerCount} handlers active
            </span>
          )}
        </div>
        
        {serverError && (
          <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
            {serverError}
          </div>
        )}
      </div>

      {/* Add/Edit API Form */}
      {editingApi && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-blue-800">
              {editingApi.id ? 'Edit API' : 'Add New API'}
            </h3>
            <button
              onClick={() => setEditingApi(null)}
              className="text-blue-600 hover:text-blue-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={editingApi.id ? editingApi.name : newApiForm.name}
                onChange={(e) => editingApi.id 
                  ? setEditingApi({...editingApi, name: e.target.value})
                  : setNewApiForm({...newApiForm, name: e.target.value})
                }
                className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm"
                placeholder="e.g. Get Users"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Method</label>
                <select
                  value={editingApi.id ? editingApi.method : newApiForm.method}
                  onChange={(e) => editingApi.id
                    ? setEditingApi({...editingApi, method: e.target.value as HttpMethod})
                    : setNewApiForm({...newApiForm, method: e.target.value as HttpMethod})
                  }
                  className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm"
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                  <option value="PATCH">PATCH</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Path</label>
                <input
                  type="text"
                  value={editingApi.id ? editingApi.path : newApiForm.path}
                  onChange={(e) => editingApi.id
                    ? setEditingApi({...editingApi, path: e.target.value})
                    : setNewApiForm({...newApiForm, path: e.target.value})
                  }
                  className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm"
                  placeholder="/api/users"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input
                type="text"
                value={editingApi.id ? editingApi.description || '' : newApiForm.description}
                onChange={(e) => editingApi.id
                  ? setEditingApi({...editingApi, description: e.target.value})
                  : setNewApiForm({...newApiForm, description: e.target.value})
                }
                className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm"
                placeholder="Optional description"
              />
            </div>
            
            <div className="flex space-x-2 pt-2">
              <button
                onClick={editingApi.id ? () => {
                  store.updateApi(editingApi.id, editingApi);
                  setEditingApi(null);
                } : handleSaveNewApi}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
              >
                {editingApi.id ? 'Update' : 'Add'} API
              </button>
              <button
                onClick={() => setEditingApi(null)}
                className="px-4 py-1.5 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded text-sm"
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
          <h3 className="font-semibold">Mock APIs ({store.apis.length})</h3>
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
            className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add API</span>
          </button>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {store.apis.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Settings className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p>No APIs configured yet</p>
              <p className="text-sm">Click "Add API" to get started</p>
            </div>
          ) : (
            store.apis.map((api) => (
              <div key={api.id} className="bg-white border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className={`
                      px-2 py-1 rounded text-xs font-medium
                      ${api.method === 'GET' ? 'bg-blue-100 text-blue-800' :
                        api.method === 'POST' ? 'bg-green-100 text-green-800' :
                        api.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                        api.method === 'DELETE' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }
                    `}>
                      {api.method}
                    </span>
                    <div>
                      <div className="font-medium text-sm">{api.name}</div>
                      <div className="text-xs text-gray-500">{api.path}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => setEditingApi(api)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Edit className="w-4 h-4 text-gray-500" />
                    </button>
                    <button
                      onClick={() => store.deleteApi(api.id)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
                
                {api.cases.length > 0 && (
                  <div className="mt-2 text-xs text-gray-500">
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
      className="bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden"
      style={{
        ...getPositionStyle(),
        width: panelWidth,
        height: isMinimized ? 'auto' : panelHeight,
        maxHeight: '90vh'
      }}
    >
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200 p-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Settings className="w-5 h-5 text-gray-600" />
          <h2 className="font-semibold text-gray-800">API Mock Manager</h2>
        </div>
        
        <div className="flex items-center space-x-2">
          {minimizable && (
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 hover:bg-gray-200 rounded"
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
          )}
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-gray-200 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      {!isMinimized && (
        <div className="overflow-y-auto" style={{ height: 'calc(100% - 60px)' }}>
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