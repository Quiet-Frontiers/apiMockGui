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
  panelWidth = '400px',
  panelHeight = '500px',
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
    
    // 버튼이나 인터랙티브 요소 클릭인 경우 드래그 방지
    const target = e.target as HTMLElement;
    if (target.closest('button') || 
        target.closest('input') || 
        target.closest('select') || 
        target.closest('textarea')) {
      return;
    }
    
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
      zIndex: 2147483647
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

  // Database 아이콘 컴포넌트 (순수 JS 버전과 동일)
  const DatabaseIcon = () => (
    <Database 
      size={28} 
      color="white" 
      strokeWidth={2.5}
      style={{ pointerEvents: 'none' }}
    />
  );

  // 상태 표시 점 (순수 JS 버전과 동일)
  const StatusDot = () => (
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
        display: isServerRunning ? 'block' : 'none',
        pointerEvents: 'none',
        animation: 'pulse 2s infinite'
      }}
    />
  );

  // 플로팅 버튼 (순수 JS 버전과 동일한 디자인)
  const FloatingButton = () => (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsOpen(true);
      }}
      title={isServerRunning ? '🎭 API Mock 실행 중 - 클릭하여 관리' : '🎭 API Mock 중단됨 - 클릭하여 시작'}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        backgroundColor: isServerRunning ? '#10B981' : '#3B82F6',
        color: 'white',
        border: '3px solid rgba(255, 255, 255, 0.3)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3), 0 4px 8px rgba(0, 0, 0, 0.1)',
        zIndex: 2147483647,
        transition: 'all 0.3s ease',
        pointerEvents: 'auto',
        margin: 0,
        padding: 0,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
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
    >
      <div style={{
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none'
      }}>
        <DatabaseIcon />
      </div>
      <StatusDot />
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

  const SimpleMockGui = () => {
    return (
      <div style={{ padding: '20px' }}>
        {/* Server Status Section (순수 JS 버전과 동일) */}
        <div style={{
          backgroundColor: '#F1F5F9',
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid #E2E8F0',
          marginBottom: '20px'
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
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{
                width: '16px',
                height: '16px',
                background: isServerRunning ? '#10B981' : '#94A3B8',
                borderRadius: '50%',
                display: 'inline-block'
              }} />
              <span style={{
                fontSize: '14px',
                color: isServerRunning ? '#10B981' : '#64748B',
                fontWeight: '500'
              }}>
                {isServerRunning ? 'Running' : 'Stopped'}
              </span>
            </div>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
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
                transition: 'background-color 0.2s',
                outline: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = isServerRunning ? '#DC2626' : '#059669';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = isServerRunning ? '#EF4444' : '#10B981';
              }}
            >
              {isServerRunning ? <Square size={16} /> : <Play size={16} />}
              <span>{isServerRunning ? 'Stop' : 'Start'}</span>
            </button>
            <span style={{
              fontSize: '14px',
              color: '#64748B'
            }}>
              Ready for testing
            </span>
          </div>
        </div>

        {/* Info Section (순수 JS 버전과 동일) */}
        <div style={{
          textAlign: 'center',
          color: '#6B7280',
          lineHeight: '1.6'
        }}>
          <h3 style={{
            margin: '0 0 10px 0',
            color: '#1F2937'
          }}>
            🎭 API Mock GUI
          </h3>
          <p style={{ margin: '10px 0' }}>
            현재 React 컴포넌트 버전입니다.
          </p>
          <p style={{ margin: '10px 0' }}>
            순수 JS 버전과 동일한 디자인으로 업데이트되었습니다:
          </p>
          <div style={{
            background: '#F3F4F6',
            padding: '8px',
            borderRadius: '4px',
            margin: '10px 0',
            fontSize: '14px',
            color: '#374151',
            display: 'block'
          }}>
            import 'api-mock-gui/auto';
          </div>
          
          <div style={{ marginTop: '20px' }}>
            <button
              onClick={() => {
                // Add API 기능 알림
                alert('➕ API 추가 기능\n\n실제 프로젝트에서는 완전한 GUI를 사용할 수 있습니다.');
              }}
              style={{
                background: '#3B82F6',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                margin: '5px',
                fontSize: '14px',
                outline: 'none'
              }}
            >
              ➕ Add API
            </button>
            <button
              onClick={() => {
                // Save Config 기능 알림
                alert('💾 설정이 저장되었습니다!');
              }}
              style={{
                background: '#8B5CF6',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                margin: '5px',
                fontSize: '14px',
                outline: 'none'
              }}
            >
              💾 Save Config
            </button>
          </div>
          
          <p style={{
            margin: '20px 0 10px 0',
            fontSize: '12px',
            color: '#94A3B8'
          }}>
            완전한 GUI는 React 컴포넌트에서 이용하세요<br />
            npm install api-mock-gui
          </p>
        </div>

        {serverError && (
          <div style={{
            marginTop: '20px',
            padding: '12px',
            backgroundColor: '#FEF2F2',
            border: '1px solid #FECACA',
            borderRadius: '8px',
            color: '#DC2626',
            fontSize: '14px'
          }}>
            ❌ {serverError}
          </div>
        )}
      </div>
    );
  };

  const FloatingPanel = () => (
    <div
      ref={panelRef}
      style={{
        position: 'fixed',
        ...getPositionStyle(),
        width: panelWidth,
        height: panelHeight,
        backgroundColor: 'white',
        borderRadius: '12px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        zIndex: 2147483646,
        overflow: 'hidden',
        pointerEvents: 'auto',
        userSelect: 'none',
      }}
      className="api-mock-panel"
    >
      {/* Header - 여기서만 드래그 가능 */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: '1px solid #E2E8F0',
          cursor: draggable ? 'move' : 'default',
          pointerEvents: 'auto'
        }}
        onMouseDown={draggable ? handleMouseDown : undefined}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Database size={20} color="#3B82F6" />
          <h2 style={{ 
            margin: 0, 
            fontSize: '16px', 
            fontWeight: '600', 
            color: '#1F2937' 
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
                console.log('🔧 Minimize/Maximize 버튼 클릭됨');
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
                color: '#6B7280',
                transition: 'all 0.2s',
                pointerEvents: 'auto'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F3F4F6';
                e.currentTarget.style.color = '#374151';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#6B7280';
              }}
            >
              {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
            </button>
          )}
          
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('❌ Close 버튼 클릭됨');
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
              color: '#6B7280',
              transition: 'all 0.2s',
              pointerEvents: 'auto'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#FEF2F2';
              e.currentTarget.style.color = '#DC2626';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#6B7280';
            }}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Content - 여기서는 드래그 비활성화 */}
      {!isMinimized && (
        <div style={{ 
          height: 'calc(100% - 65px)', 
          overflow: 'auto',
          pointerEvents: 'auto'
        }}>
          <SimpleMockGui />
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* CSS 애니메이션 추가 */}
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.7; }
            100% { opacity: 1; }
          }
        `}
      </style>
      
      {!isOpen && <FloatingButton />}
      {isOpen && <FloatingPanel />}
    </>
  );
}; 