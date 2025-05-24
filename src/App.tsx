import React from 'react';
import 'api-mock-gui/auto'; // 🎯 이 한 줄만으로 floating button이 자동으로 나타납니다!
import './App.css';

function App() {
  const TestButtons = () => (
    <div className="fixed bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg border max-w-xs">
      <h4 className="font-semibold mb-2">🧪 API 테스트</h4>
      <div className="space-y-2">
        <button
          onClick={() => {
            fetch('/api/users')
              .then(response => response.json())
              .then(data => {
                console.log('Mock Response:', data);
                alert(`Mock 응답 받음: ${JSON.stringify(data, null, 2)}`);
              })
              .catch(err => {
                console.error('Error:', err);
                alert(`Error: ${err.message}`);
              });
          }}
          className="block w-full px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm hover:bg-blue-200"
        >
          GET /api/users
        </button>
        <button
          onClick={() => {
            fetch('/api/posts')
              .then(response => response.json())
              .then(data => {
                console.log('Mock Response:', data);
                alert(`Mock 응답 받음: ${JSON.stringify(data, null, 2)}`);
              })
              .catch(err => {
                console.error('Error:', err);
                alert(`Error: ${err.message}`);
              });
          }}
          className="block w-full px-3 py-1 bg-green-100 text-green-800 rounded text-sm hover:bg-green-200"
        >
          GET /api/posts
        </button>
        <button
          onClick={() => {
            fetch('/api/posts', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ title: 'Test Post', content: 'Test content' })
            })
              .then(response => response.json())
              .then(data => {
                console.log('Mock Response:', data);
                alert(`Mock 응답 받음: ${JSON.stringify(data, null, 2)}`);
              })
              .catch(err => {
                console.error('Error:', err);
                alert(`Error: ${err.message}`);
              });
          }}
          className="block w-full px-3 py-1 bg-purple-100 text-purple-800 rounded text-sm hover:bg-purple-200"
        >
          POST /api/posts
        </button>
        <div className="border-t pt-2 mt-2">
          <button
            onClick={() => {
              console.log('💡 개발자 도구의 Network 탭에서 요청을 확인하세요!');
              console.log('🎭 우측 하단의 floating button을 클릭하여 Mock GUI를 열 수 있습니다.');
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

  return (
    <div className="App">
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">🎭 Auto API Mock GUI 테스트</h1>
          <p className="text-blue-100">
            라이브러리를 import하기만 하면 floating button이 자동으로 나타납니다!
          </p>
        </div>
      </header>

      <main className="p-8 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto">
          {/* 메인 설명 카드 */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">✨ 자동 초기화 기능</h2>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <code className="text-sm text-gray-800">
                import 'api-mock-gui/auto'; // 🎯 이 한 줄만으로 완료!
              </code>
            </div>
            <p className="text-gray-600 mb-4">
              위 import 문 하나만으로 API Mock GUI가 자동으로 활성화됩니다. 
              우측 하단에 floating button이 나타나며, 클릭하면 별도의 팝업 창으로 GUI가 열립니다.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">🚀 주요 특징:</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 🎯 One-line import로 즉시 활성화</li>
                  <li>• 🔄 개발 환경에서만 자동 활성화</li>
                  <li>• 🪟 별도 팝업 창으로 GUI 제공</li>
                  <li>• 📡 MSW 기반 실제 요청 차단</li>
                  <li>• 🎮 실시간 Mock 서버 제어</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">📝 사용법:</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>1. 우측 하단 floating button 확인</li>
                  <li>2. 버튼 클릭으로 팝업 창 열기</li>
                  <li>3. Mock 서버 시작/중지</li>
                  <li>4. 좌측 테스트 버튼으로 확인</li>
                  <li>5. Network 탭에서 요청 모니터링</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 기술 상세 */}
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">🔧 기술 특징</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">자동 환경 감지</h4>
                    <p className="text-sm text-gray-600">localhost, 127.0.0.1 등 개발 환경 자동 감지</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">팝업 창 통신</h4>
                    <p className="text-sm text-gray-600">부모-자식 창 간 postMessage 통신</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">MSW 통합</h4>
                    <p className="text-sm text-gray-600">Service Worker를 통한 실제 네트워크 차단</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">🎛️ 제어 옵션</h3>
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-1">전역 제어:</h4>
                  <code className="text-xs text-gray-600">
                    window.apiMockGuiInit() // 수동 활성화<br/>
                    window.apiMockGuiCleanup() // 정리
                  </code>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-1">비활성화:</h4>
                  <code className="text-xs text-gray-600">
                    window.API_MOCK_AUTO_INIT = false;
                  </code>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-1">설정 커스터마이징:</h4>
                  <code className="text-xs text-gray-600">
                    window.API_MOCK_AUTO_INIT = {'{'}position: 'top-left'{'}'};
                  </code>
                </div>
              </div>
            </div>
          </div>

          {/* 상태 표시 */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">📊 현재 상태</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-blue-800 font-medium">환경:</span>
                <span className="ml-2 text-blue-700">
                  {window.location.hostname === 'localhost' ? '개발 모드' : '프로덕션'}
                </span>
              </div>
              <div>
                <span className="text-blue-800 font-medium">Host:</span>
                <span className="ml-2 text-blue-700">{window.location.hostname}</span>
              </div>
              <div>
                <span className="text-blue-800 font-medium">Port:</span>
                <span className="ml-2 text-blue-700">{window.location.port || '80'}</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <TestButtons />
    </div>
  );
}

export default App; 