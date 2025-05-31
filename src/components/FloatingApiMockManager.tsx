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
    
    // 버튼 클릭인 경우 드래그 방지
    if ((e.target as HTMLElement).closest('button')) return;
    
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
      className="api-mock-floating-btn"
      style={{
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
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1)';
        e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.4), 0 6px 12px rgba(0, 0, 0, 0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.3), 0 4px 8px rgba(0, 0, 0, 0.1)';
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = 'scale(0.95)';
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = 'scale(1.1)';
      }}
      title={isServerRunning ? '🎭 API Mock 실행 중 - 클릭하여 관리' : '🎭 API Mock 중단됨 - 클릭하여 시작'}
    >
      {/* 메인 아이콘 */}
      <div style={{ color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Database size={28} strokeWidth={2.5} />
      </div>
      
      {/* 실행 상태 표시 */}
      {isServerRunning && (
        <div
          style={{
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
          }}
        />
      )}
      
      {/* CSS 애니메이션 정의 */}
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.7; }
            100% { opacity: 1; }
          }
        `}
      </style>
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
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Server Controls */}
      <div style={{
        backgroundColor: '#F1F5F9',
        padding: '20px',
        borderRadius: '12px',
        border: '1px solid #E2E8F0'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          marginBottom: '16px' 
        }}>
          <h3 style={{ 
            fontWeight: '600', 
            fontSize: '16px', 
            color: '#1E293B', 
            margin: 0 
          }}>
            Mock Server
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isServerRunning ? (
              <Wifi size={16} color="#10B981" />
            ) : (
              <WifiOff size={16} color="#94A3B8" />
            )}
            <span style={{ 
              fontSize: '14px', 
              color: isServerRunning ? '#10B981' : '#64748B',
              fontWeight: '500'
            }}>
              {isServerRunning ? 'Running' : 'Stopped'}
            </span>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={isServerRunning ? handleStopServer : handleStartServer}
            style={{
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
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = isServerRunning ? '#DC2626' : '#059669';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = isServerRunning ? '#EF4444' : '#10B981';
            }}
          >
            {isServerRunning ? <Square size={16} /> : <Play size={16} />}
            {isServerRunning ? 'Stop' : 'Start'}
          </button>
          
          {handlerCount > 0 && (
            <span style={{ fontSize: '14px', color: '#64748B' }}>
              {handlerCount} handlers active
            </span>
          )}
        </div>
        
        {serverError && (
          <div style={{
            marginTop: '12px',
            padding: '12px',
            backgroundColor: '#FEF2F2',
            border: '1px solid #FECACA',
            borderRadius: '8px',
            color: '#DC2626',
            fontSize: '14px'
          }}>
            {serverError}
          </div>
        )}
      </div>

      {/* Add/Edit API Form */}
      {editingApi && (
        <div style={{
          backgroundColor: '#EFF6FF',
          border: '1px solid #DBEAFE',
          borderRadius: '12px',
          padding: '20px'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            marginBottom: '16px' 
          }}>
            <h3 style={{ 
              fontWeight: '600', 
              fontSize: '16px', 
              color: '#1E40AF', 
              margin: 0 
            }}>
              {editingApi.id ? 'Edit API' : 'Add New API'}
            </h3>
            <button
              onClick={() => setEditingApi(null)}
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={16} color="#3B82F6" />
            </button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '500', 
                color: '#374151', 
                marginBottom: '6px' 
              }}>
                Name
              </label>
              <input
                type="text"
                value={editingApi.id ? editingApi.name : newApiForm.name}
                onChange={(e) => editingApi.id 
                  ? setEditingApi({...editingApi, name: e.target.value})
                  : setNewApiForm({...newApiForm, name: e.target.value})
                }
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #D1D5DB',
                  borderRadius: '6px',
                  fontSize: '14px',
                  backgroundColor: 'white',
                  color: '#1F2937',
                  boxSizing: 'border-box'
                }}
                placeholder="e.g. Get Users"
              />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  color: '#374151', 
                  marginBottom: '6px' 
                }}>
                  Method
                </label>
                <select
                  value={editingApi.id ? editingApi.method : newApiForm.method}
                  onChange={(e) => editingApi.id
                    ? setEditingApi({...editingApi, method: e.target.value as HttpMethod})
                    : setNewApiForm({...newApiForm, method: e.target.value as HttpMethod})
                  }
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '6px',
                    fontSize: '14px',
                    backgroundColor: 'white',
                    color: '#1F2937',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                  <option value="PATCH">PATCH</option>
                </select>
              </div>
              
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  color: '#374151', 
                  marginBottom: '6px' 
                }}>
                  Path
                </label>
                <input
                  type="text"
                  value={editingApi.id ? editingApi.path : newApiForm.path}
                  onChange={(e) => editingApi.id
                    ? setEditingApi({...editingApi, path: e.target.value})
                    : setNewApiForm({...newApiForm, path: e.target.value})
                  }
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '6px',
                    fontSize: '14px',
                    backgroundColor: 'white',
                    color: '#1F2937',
                    boxSizing: 'border-box'
                  }}
                  placeholder="/api/users"
                />
              </div>
            </div>
            
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '14px', 
                fontWeight: '500', 
                color: '#374151', 
                marginBottom: '6px' 
              }}>
                Description
              </label>
              <input
                type="text"
                value={editingApi.id ? editingApi.description || '' : newApiForm.description}
                onChange={(e) => editingApi.id
                  ? setEditingApi({...editingApi, description: e.target.value})
                  : setNewApiForm({...newApiForm, description: e.target.value})
                }
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #D1D5DB',
                  borderRadius: '6px',
                  fontSize: '14px',
                  backgroundColor: 'white',
                  color: '#1F2937',
                  boxSizing: 'border-box'
                }}
                placeholder="Optional description"
              />
            </div>
            
            <div style={{ display: 'flex', gap: '8px', paddingTop: '8px' }}>
              <button
                onClick={editingApi.id ? () => {
                  store.updateApi(editingApi.id, editingApi);
                  setEditingApi(null);
                } : handleSaveNewApi}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#3B82F6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#2563EB';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#3B82F6';
                }}
              >
                {editingApi.id ? 'Update' : 'Add'} API
              </button>
              <button
                onClick={() => setEditingApi(null)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#F3F4F6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#E5E7EB';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#F3F4F6';
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* API List */}
      <div>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          marginBottom: '16px' 
        }}>
          <h3 style={{ 
            fontWeight: '600', 
            fontSize: '16px', 
            color: '#1E293B', 
            margin: 0 
          }}>
            Mock APIs ({store.apis.length})
          </h3>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setEditingApi({
                id: '',
                name: '',
                method: 'GET' as HttpMethod,
                path: '',
                description: '',
                cases: [],
                isEnabled: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              });
            }}
            style={{
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
              outline: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#2563EB';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#3B82F6';
            }}
          >
            <Plus size={16} />
            Add API
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflow: 'auto' }}>
          {store.apis.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px 20px', 
              color: '#64748B' 
            }}>
              <Database size={32} color="#94A3B8" style={{ margin: '0 auto 12px' }} />
              <p style={{ margin: '0 0 4px', fontSize: '16px' }}>No APIs configured yet</p>
              <p style={{ margin: 0, fontSize: '14px' }}>Click "Add API" to get started</p>
            </div>
          ) : (
            store.apis.map((api) => (
              <div key={api.id} style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                padding: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{
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
                    }}>
                      {api.method}
                    </span>
                    <div>
                      <div style={{ fontWeight: '500', fontSize: '14px', color: '#1F2937' }}>{api.name}</div>
                      <div style={{ fontSize: '12px', color: '#6B7280' }}>{api.path}</div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <button
                      onClick={() => setEditingApi(api)}
                      style={{
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
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#F3F4F6';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <Edit size={14} color="#6B7280" />
                    </button>
                    <button
                      onClick={() => store.deleteApi(api.id)}
                      style={{
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
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#FEE2E2';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <Trash2 size={14} color="#EF4444" />
                    </button>
                  </div>
                </div>
                
                {api.cases.length > 0 && (
                  <div style={{ marginTop: '8px', fontSize: '12px', color: '#6B7280' }}>
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
      style={{
        ...getPositionStyle(),
        width: panelWidth,
        height: isMinimized ? 'auto' : panelHeight,
        maxHeight: '90vh',
        zIndex: 2147483647,
        position: 'fixed',
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)',
        border: '2px solid rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        backdropFilter: 'blur(20px)',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: '#F8FAFC',
          borderBottom: '1px solid #E2E8F0',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'move'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: isServerRunning ? '#10B981' : '#3B82F6',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Database size={18} color="white" strokeWidth={2.5} />
          </div>
          <h2 style={{ 
            fontWeight: '600', 
            fontSize: '16px', 
            color: '#1E293B', 
            margin: 0 
          }}>
            API Mock Manager
          </h2>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {minimizable && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsMinimized(!isMinimized);
              }}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.2s',
                outline: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#E2E8F0';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {isMinimized ? <Maximize2 size={16} color="#64748B" /> : <Minimize2 size={16} color="#64748B" />}
            </button>
          )}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsOpen(false);
            }}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.2s',
              outline: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#FEE2E2';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <X size={16} color="#EF4444" />
          </button>
        </div>
      </div>

      {/* Content */}
      {!isMinimized && (
        <div 
          style={{ 
            height: 'calc(100% - 65px)', 
            overflow: 'auto',
            backgroundColor: '#FFFFFF'
          }}
        >
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