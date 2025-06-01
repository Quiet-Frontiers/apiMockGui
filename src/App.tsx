import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

// Create axios instance
const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com'
});

interface User {
  id: number;
  name: string;
  email: string;
  username: string;
}

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🚀 Fetching users...');
      
      const response = await api.get<User[]>('/users');
      console.log('✅ Response received:', response.data);
      
      setUsers(response.data);
    } catch (err) {
      console.error('❌ Error fetching users:', err);
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const testPost = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🚀 Testing POST request...');
      
      const response = await api.post('/users', {
        name: 'Test User',
        email: 'test@example.com',
        username: 'testuser'
      });
      console.log('✅ POST Response:', response.data);
      
      alert('POST request successful! Check console for details.');
    } catch (err) {
      console.error('❌ Error posting data:', err);
      setError('Failed to post data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>🎭 API Mock GUI Test App</h1>
      
      <div style={{ 
        backgroundColor: '#e8f5e8', 
        padding: '20px', 
        borderRadius: '8px', 
        marginBottom: '20px',
        border: '1px solid #4caf50'
      }}>
        <h2>✨ 업데이트: React 컴포넌트가 브라우저 번들과 동일한 디자인으로!</h2>
        <p><strong>이제 React 환경에서도 순수 JS 버전과 동일한 디자인을 사용합니다.</strong></p>
        <ul>
          <li>🎯 <strong>Database 아이콘</strong> - 깔끔한 데이터베이스 아이콘</li>
          <li>🟢 <strong>실시간 상태 표시</strong> - 서버 상태에 따른 색상 변경</li>
          <li>🎨 <strong>동일한 패널 디자인</strong> - 브라우저 번들과 같은 레이아웃</li>
          <li>⚡ <strong>간소화된 UI</strong> - Start/Stop, Add API, Save Config</li>
          <li>📱 <strong>반응형 디자인</strong> - 400x500px 패널 크기</li>
        </ul>
        <p style={{ margin: '10px 0', fontSize: '14px', color: '#1b5e20' }}>
          React 프로젝트에서는 <code>import 'api-mock-gui/auto';</code> 한 줄로 이 기능을 사용할 수 있습니다.
        </p>
      </div>

      <div style={{ 
        backgroundColor: '#f0f8ff', 
        padding: '20px', 
        borderRadius: '8px', 
        marginBottom: '20px',
        border: '1px solid #ddeeff'
      }}>
        <h2>📝 How to Test:</h2>
        <ol>
          <li><strong>Look for the blue floating button</strong> in the bottom-right corner</li>
          <li><strong>Click it</strong> to open the API Mock Manager</li>
          <li><strong>Click "Start"</strong> to start the mock server (button should turn green)</li>
          <li><strong>Click "Add API"</strong> and configure:
            <ul>
              <li>Method: <code>GET</code></li>
              <li>Path: <code>/users</code></li>
              <li>Name: <code>Mock Users</code></li>
            </ul>
          </li>
          <li><strong>Click "Refresh Users"</strong> button below</li>
          <li><strong>See mock data</strong> instead of real API data!</li>
        </ol>
      </div>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button 
          onClick={fetchUsers}
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? '⏳ Loading...' : '🔄 Refresh Users'}
        </button>
        
        <button 
          onClick={testPost}
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? '⏳ Loading...' : '📤 Test POST'}
        </button>
      </div>

      {error && (
        <div style={{ 
          color: '#d32f2f', 
          backgroundColor: '#ffebee', 
          padding: '10px', 
          borderRadius: '4px',
          marginBottom: '20px',
          border: '1px solid #ffcdd2'
        }}>
          ❌ {error}
        </div>
      )}

      <div>
        <h2>👥 Users ({users.length})</h2>
        
        {users.length === 0 && !loading && (
          <p style={{ color: '#666' }}>No users found. Try refreshing or setting up a mock!</p>
        )}
        
        <div style={{ display: 'grid', gap: '10px' }}>
          {users.map(user => (
            <div key={user.id} style={{ 
              border: '1px solid #ddd', 
              padding: '15px', 
              borderRadius: '8px',
              backgroundColor: '#fafafa'
            }}>
              <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '5px' }}>
                {user.name}
              </div>
              <div style={{ color: '#666', fontSize: '14px' }}>
                📧 {user.email}
              </div>
              <div style={{ color: '#666', fontSize: '14px' }}>
                👤 @{user.username}
              </div>
              <div style={{ color: '#999', fontSize: '12px', marginTop: '5px' }}>
                ID: {user.id}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ 
        marginTop: '40px', 
        padding: '20px', 
        backgroundColor: '#fff3e0',
        borderRadius: '8px',
        border: '1px solid #ffcc02'
      }}>
        <h3>🔍 Debug Info</h3>
        <ul style={{ fontSize: '14px', color: '#666' }}>
          <li><strong>Base URL:</strong> {api.defaults.baseURL}</li>
          <li><strong>Total Users:</strong> {users.length}</li>
          <li><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</li>
          <li><strong>Error:</strong> {error || 'None'}</li>
          <li><strong>GUI Version:</strong> React Component (v2.0.11) - 브라우저 번들과 동일한 디자인</li>
        </ul>
        <p style={{ fontSize: '12px', color: '#888', marginTop: '10px' }}>
          💡 Check browser console (F12) for detailed request/response logs
        </p>
      </div>
    </div>
  );
}

export default App; 