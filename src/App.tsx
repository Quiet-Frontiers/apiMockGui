import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'api-mock-gui/auto'; // 🎯 이 한 줄만으로 floating button이 자동으로 나타납니다!
import './App.css';

function App() {
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 디버깅: auto-init 상태 확인
  useEffect(() => {
    console.log('🔍 API Mock GUI Auto-init 디버깅:');
    console.log('- window.apiMockGuiInit:', typeof (window as any).apiMockGuiInit);
    console.log('- window.apiMockGuiCleanup:', typeof (window as any).apiMockGuiCleanup);
    console.log('- window.API_MOCK_AUTO_INIT:', (window as any).API_MOCK_AUTO_INIT);
    console.log('- hostname:', window.location.hostname);
    console.log('- isDev:', window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    
    // floating button element 확인
    setTimeout(() => {
      const floatingButton = document.querySelector('[data-api-mock-floating-button]');
      console.log('- floating button element:', floatingButton);
      if (!floatingButton) {
        console.warn('⚠️ Floating button not found! Manually initializing...');
        if (typeof (window as any).apiMockGuiInit === 'function') {
          (window as any).apiMockGuiInit();
        }
      }
    }, 1000);
  }, []);

  const makeApiCall = async (method: string, url: string, data?: any) => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      let result;
      switch (method) {
        case 'GET':
          result = await axios.get(url);
          break;
        case 'POST':
          result = await axios.post(url, data);
          break;
        case 'PUT':
          result = await axios.put(url, data);
          break;
        case 'DELETE':
          result = await axios.delete(url);
          break;
        default:
          result = await axios.get(url);
      }
      setResponse(result.data);
      console.log('API Response:', result.data);
    } catch (err: any) {
      setError(err.message);
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App" style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ marginBottom: '30px' }}>
        <h1>🎭 API Mock GUI 테스트</h1>
        <p style={{ color: '#666' }}>
          axios-mock-adapter 기반으로 업데이트된 API Mock GUI를 테스트해보세요!
        </p>
        <div style={{ 
          backgroundColor: '#e3f2fd', 
          padding: '15px', 
          borderRadius: '8px', 
          marginTop: '15px',
          borderLeft: '4px solid #2196f3'
        }}>
          <h3>🔧 사용 방법:</h3>
          <ol style={{ textAlign: 'left', marginLeft: '20px' }}>
            <li>우측 하단의 floating button 클릭</li>
            <li>"Start" 버튼으로 Mock Server 시작</li>
            <li>"Add API" 버튼으로 새 API 추가</li>
            <li>아래 테스트 버튼들로 API 호출 테스트</li>
          </ol>
        </div>
      </header>

      <main>
        <section style={{ marginBottom: '30px' }}>
          <h2>🧪 API 테스트 버튼들</h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '15px',
            marginBottom: '20px'
          }}>
            <button
              onClick={() => makeApiCall('GET', '/api/users')}
              style={{
                padding: '12px 16px',
                backgroundColor: '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
              disabled={loading}
            >
              GET /api/users
            </button>

            <button
              onClick={() => makeApiCall('GET', '/api/posts')}
              style={{
                padding: '12px 16px',
                backgroundColor: '#2196f3',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
              disabled={loading}
            >
              GET /api/posts
            </button>

            <button
              onClick={() => makeApiCall('POST', '/api/posts', {
                title: 'Test Post',
                content: 'This is a test post from React app',
                author: 'Test User'
              })}
              style={{
                padding: '12px 16px',
                backgroundColor: '#ff9800',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
              disabled={loading}
            >
              POST /api/posts
            </button>

            <button
              onClick={() => makeApiCall('GET', '/api/users/1')}
              style={{
                padding: '12px 16px',
                backgroundColor: '#9c27b0',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
              disabled={loading}
            >
              GET /api/users/1
            </button>

            <button
              onClick={() => makeApiCall('PUT', '/api/users/1', {
                name: 'Updated User',
                email: 'updated@example.com'
              })}
              style={{
                padding: '12px 16px',
                backgroundColor: '#607d8b',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
              disabled={loading}
            >
              PUT /api/users/1
            </button>

            <button
              onClick={() => makeApiCall('DELETE', '/api/posts/1')}
              style={{
                padding: '12px 16px',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
              disabled={loading}
            >
              DELETE /api/posts/1
            </button>
          </div>
        </section>

        <section>
          <h2>📊 응답 결과</h2>
          <div style={{
            minHeight: '200px',
            backgroundColor: '#f5f5f5',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #ddd'
          }}>
            {loading && (
              <div style={{ textAlign: 'center', color: '#666' }}>
                ⏳ Loading...
              </div>
            )}
            
            {error && (
              <div style={{
                backgroundColor: '#ffebee',
                color: '#c62828',
                padding: '15px',
                borderRadius: '6px',
                border: '1px solid #ef5350'
              }}>
                <strong>❌ Error:</strong> {error}
              </div>
            )}
            
            {response && (
              <div>
                <h3 style={{ color: '#2e7d32', marginBottom: '10px' }}>✅ Success Response:</h3>
                <pre style={{
                  backgroundColor: '#e8f5e8',
                  padding: '15px',
                  borderRadius: '6px',
                  overflow: 'auto',
                  fontSize: '14px',
                  border: '1px solid #4caf50'
                }}>
                  {JSON.stringify(response, null, 2)}
                </pre>
              </div>
            )}
            
            {!loading && !error && !response && (
              <div style={{ textAlign: 'center', color: '#999' }}>
                위의 테스트 버튼을 클릭해서 API를 호출해보세요.
              </div>
            )}
          </div>
        </section>

        <section style={{ marginTop: '30px' }}>
          <h2>💡 테스트 가이드</h2>
          <div style={{ backgroundColor: '#fff3e0', padding: '20px', borderRadius: '8px' }}>
            <h3>🎯 axios-mock-adapter 특징:</h3>
            <ul style={{ textAlign: 'left', lineHeight: '1.6' }}>
              <li>✅ <strong>빠른 응답:</strong> 네트워크 요청 없이 즉시 응답</li>
              <li>✅ <strong>axios 전용:</strong> axios 요청만 가로채기</li>
              <li>✅ <strong>간단한 설정:</strong> Service Worker 설정 불필요</li>
              <li>⚠️ <strong>Network 탭:</strong> 실제 네트워크 요청이 표시되지 않음</li>
            </ul>
            
            <h3 style={{ marginTop: '20px' }}>🔍 확인 방법:</h3>
            <ul style={{ textAlign: 'left', lineHeight: '1.6' }}>
              <li>Console 로그에서 Mock 응답 확인</li>
              <li>이 페이지의 응답 결과 섹션에서 확인</li>
              <li>Mock GUI에서 설정한 응답과 일치하는지 확인</li>
            </ul>
          </div>
        </section>
      </main>

      {/* 우측 하단에 floating button이 자동으로 나타납니다! */}
    </div>
  );
}

export default App; 