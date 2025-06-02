import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { FloatingApiMockManager } from '../components/FloatingApiMockManager';
import { mockHelpers, presets } from '../mock/setupMsw';
import '../styles/globals.css';

const App = () => {
  const [selectedPreset, setSelectedPreset] = useState<'development' | 'production'>('development');

  const handleConfigChange = (apis: any[]) => {
    console.log('Config changed:', apis);
    // JSON 파일에 자동 저장 (개발 환경에서만)
    if (process.env.NODE_ENV === 'development') {
      mockHelpers.saveConfigToFile(apis, 'public/api-config.json');
    }
  };

  const handleServerStart = () => {
    console.log('🎭 Mock server started!');
    alert('Mock server가 시작되었습니다! 이제 API 요청을 테스트해보세요.');
  };

  const handleServerStop = () => {
    console.log('🛑 Mock server stopped!');
  };

  // 예제 초기 데이터
  const initialConfig = [
    {
      id: 'api1',
      name: 'Users API',
      method: 'GET' as const,
      path: '/api/users',
      description: 'Get all users',
      cases: [
        {
          id: 'case1',
          name: 'Success',
          description: 'Returns list of users',
          status: 200 as const,
          headers: { 'Content-Type': 'application/json' },
          body: {
            success: true,
            data: [
              { id: 1, name: 'John Doe', email: 'john@example.com' },
              { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
            ]
          },
          isActive: true
        },
        {
          id: 'case2',
          name: 'Server Error',
          description: 'Internal server error',
          status: 500 as const,
          body: {
            success: false,
            message: 'Internal server error'
          },
          delay: 1000,
          isActive: false
        }
      ],
      activeCase: 'case1',
      isEnabled: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'api2',
      name: 'User Detail API',
      method: 'GET' as const,
      path: '/api/users/:id',
      description: 'Get user by ID',
      cases: [
        {
          id: 'case3',
          name: 'User Found',
          description: 'Returns user details',
          status: 200 as const,
          body: {
            success: true,
            data: { id: 1, name: 'John Doe', email: 'john@example.com' }
          },
          isActive: true
        },
        {
          id: 'case4',
          name: 'User Not Found',
          description: 'User does not exist',
          status: 404 as const,
          body: {
            success: false,
            message: 'User not found'
          },
          isActive: false
        }
      ],
      activeCase: 'case3',
      isEnabled: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'api3',
      name: 'Posts API',
      method: 'POST' as const,
      path: '/api/posts',
      description: 'Create a new post',
      cases: [
        {
          id: 'case5',
          name: 'Post Created',
          description: 'Successfully created post',
          status: 201 as const,
          headers: { 'Content-Type': 'application/json' },
          body: {
            success: true,
            data: {
              id: 123,
              title: 'New Post',
              content: 'This is a new post',
              author: 'John Doe',
              createdAt: new Date().toISOString()
            }
          },
          isActive: true
        },
        {
          id: 'case6',
          name: 'Validation Error',
          description: 'Invalid request data',
          status: 400 as const,
          body: {
            success: false,
            errors: {
              title: 'Title is required',
              content: 'Content is too short'
            }
          },
          isActive: false
        }
      ],
      activeCase: 'case5',
      isEnabled: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  // 서버 설정
  const serverConfig = mockHelpers.createServerConfig({
    baseUrl: 'http://localhost:3000', // 실제 API 서버 URL
    environment: 'browser',
    development: selectedPreset === 'development'
  });

  const TestApiButtons = () => (
    <div className="fixed bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg border max-w-xs">
      <h4 className="font-semibold mb-2">🧪 API 테스트</h4>
      <div className="space-y-2">
        <button
          onClick={() => {
            fetch('/api/users')
              .then(r => r.json())
              .then(data => {
                console.log('Mock Response:', data);
                alert(`Mock 응답: ${JSON.stringify(data, null, 2)}`);
              })
              .catch(console.error);
          }}
          className="block w-full px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm hover:bg-blue-200"
        >
          GET /api/users
        </button>
        <button
          onClick={() => {
            fetch('/api/users/1')
              .then(r => r.json())
              .then(data => {
                console.log('Mock Response:', data);
                alert(`Mock 응답: ${JSON.stringify(data, null, 2)}`);
              })
              .catch(console.error);
          }}
          className="block w-full px-3 py-1 bg-green-100 text-green-800 rounded text-sm hover:bg-green-200"
        >
          GET /api/users/1
        </button>
        <button
          onClick={() => {
            fetch('/api/posts', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ title: 'Test Post', content: 'Test content' })
            })
              .then(r => r.json())
              .then(data => {
                console.log('Mock Response:', data);
                alert(`Mock 응답: ${JSON.stringify(data, null, 2)}`);
              })
              .catch(console.error);
          }}
          className="block w-full px-3 py-1 bg-purple-100 text-purple-800 rounded text-sm hover:bg-purple-200"
        >
          POST /api/posts
        </button>
        <div className="border-t pt-2 mt-2">
          <button
            onClick={() => {
              console.log('💡 개발자 도구의 Network 탭에서 요청을 확인하세요!');
              alert('개발자 도구(F12) > Network 탭에서 Mock된 응답을 확인할 수 있습니다.');
            }}
            className="block w-full px-3 py-1 bg-yellow-100 text-yellow-800 rounded text-sm hover:bg-yellow-200"
          >
            💡 도움말
          </button>
        </div>
      </div>
    </div>
  );

  const MainContent = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">🎭 Floating API Mock Manager</h1>
              <p className="text-gray-600 mt-2">
                우측 하단의 floating button을 클릭하여 API Mock GUI를 열어보세요!
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Environment:</span>
              <select
                value={selectedPreset}
                onChange={(e) => setSelectedPreset(e.target.value as 'development' | 'production')}
                className="text-sm border border-gray-300 rounded px-3 py-1 bg-white"
              >
                <option value="development">Development</option>
                <option value="production">Production</option>
              </select>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                Base URL: {serverConfig.baseUrl}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* 기능 소개 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">🚀 주요 기능</h2>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Floating Button Interface</h3>
                  <p className="text-sm text-gray-600">화면 어디서나 접근 가능한 floating button</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Drag & Drop</h3>
                  <p className="text-sm text-gray-600">패널을 드래그하여 원하는 위치로 이동</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Minimize/Maximize</h3>
                  <p className="text-sm text-gray-600">필요에 따라 패널 크기 조절</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Window Resize</h3>
                  <p className="text-sm text-gray-600">우측 하단 모서리를 드래그하여 창 크기 조절</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Real-time Control</h3>
                  <p className="text-sm text-gray-600">실시간 API Mock 서버 제어</p>
                </div>
              </div>
            </div>
          </div>

          {/* 사용 방법 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">📝 사용 방법</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Floating Button 클릭</h3>
                  <p className="text-sm text-gray-600">우측 하단의 "API Mock" 버튼을 클릭하세요</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Mock Server 시작</h3>
                  <p className="text-sm text-gray-600">패널 상단의 "Start" 버튼으로 서버를 시작하세요</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">API 관리</h3>
                  <p className="text-sm text-gray-600">API endpoints와 response cases를 추가/편집하세요</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  4
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">테스트 실행</h3>
                  <p className="text-sm text-gray-600">좌측 하단의 테스트 버튼으로 API를 확인하세요</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 개발자 팁 */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3">💡 개발자 팁</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <h4 className="font-medium mb-2">커스터마이징 옵션:</h4>
              <ul className="space-y-1">
                <li>• <code className="bg-blue-100 px-1 rounded">position</code>: 버튼 위치 설정</li>
                <li>• <code className="bg-blue-100 px-1 rounded">buttonText</code>: 버튼 텍스트 변경</li>
                <li>• <code className="bg-blue-100 px-1 rounded">panelWidth/Height</code>: 패널 크기 조절</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">추가 기능:</h4>
              <ul className="space-y-1">
                <li>• <code className="bg-blue-100 px-1 rounded">minimizable</code>: 최소화 기능</li>
                <li>• <code className="bg-blue-100 px-1 rounded">draggable</code>: 드래그 기능</li>
                <li>• <code className="bg-blue-100 px-1 rounded">resizable</code>: 창 크기 조절 기능</li>
                <li>• <code className="bg-blue-100 px-1 rounded">autoStart</code>: 자동 서버 시작</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );

  return (
    <>
      <MainContent />
      
      {/* Floating API Mock Manager */}
      <FloatingApiMockManager
        serverConfig={serverConfig}
        autoStart={selectedPreset === 'development'}
        onConfigChange={handleConfigChange}
        onServerStart={handleServerStart}
        onServerStop={handleServerStop}
        initialConfig={initialConfig}
        enableExport={true}
        enableImport={true}
        position="bottom-right"
        buttonText="API Mock"
        panelWidth="900px"
        panelHeight="700px"
        minimizable={true}
        draggable={true}
        resizable={true}
      />

      {/* Test API Buttons */}
      <TestApiButtons />
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />); 