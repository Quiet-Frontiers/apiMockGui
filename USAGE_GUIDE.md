# API Mock GUI - 사용법 가이드

이 가이드는 API Mock GUI 라이브러리를 각 프로젝트에 설치하고 사용하는 방법을 설명합니다.

## 🚀 최소 단계 가이드 (5분 완성)

### 1. 설치

```bash
npm install api-mock-gui axios axios-mock-adapter
```

### 2. 프로젝트에 추가

```tsx
// main.tsx 또는 index.tsx - 이 두 줄을 추가하세요
import 'api-mock-gui/auto';                    // ✅ 자동 초기화
import 'api-mock-gui/dist/styles.css';         // ✅ 필수 CSS 스타일

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### 3. 개발 서버 실행

```bash
npm run dev
# 또는
npm start
```

우하단에 파란색 플로팅 버튼이 나타날 것입니다! 🎉

### 4. 첫 번째 Mock API 설정

1. **플로팅 버튼 클릭** → API Mock Manager 열기
2. **"Start" 버튼 클릭** → Mock 서버 시작 (버튼이 초록색으로 변함)
3. **"Add API" 버튼 클릭** → API 설정 폼 열기
4. **API 정보 입력**:
   - **이름**: `사용자 목록` (설명용)
   - **메서드**: `GET` (드롭다운에서 선택)
   - **경로**: `/users` (가로챌 경로)
5. **"Add" 버튼 클릭** → Mock API 생성 완료! ✅

### 5. 실제 코드에서 테스트

```tsx
// 어떤 axios 인스턴스든 자동으로 가로채집니다! 
import axios from 'axios';

// ✅ 기본 axios 인스턴스 - 자동 가로채기
axios.get('/users').then(res => console.log(res.data));

// ✅ 생성된 axios 인스턴스 - 자동 가로채기  
const api = axios.create({
  baseURL: 'https://api.example.com'
});
api.get('/users').then(res => console.log(res.data)); // Mock 데이터 반환!

// ✅ 여러 개의 인스턴스도 모두 자동 가로채기
const authApi = axios.create({ baseURL: 'https://auth.example.com' });
const dataApi = axios.create({ baseURL: 'https://data.example.com' });
// 모두 Mock GUI 설정에 따라 가로채집니다!
```

### 6. 응답 데이터 커스터마이징

1. **Edit 버튼** (연필 아이콘) 클릭
2. **응답 수정**:
   - **상태 코드** 변경 (200, 404, 500 등)
   - **응답 본문** 수정:
     ```json
     {
       "users": [
         { "id": 1, "name": "김철수", "email": "kim@example.com" },
         { "id": 2, "name": "이영희", "email": "lee@example.com" }
       ]
     }
     ```
3. **저장** → 즉시 새로운 응답 적용! 🎯

## 🎯 axios-mock-adapter와의 통합

API Mock GUI는 내부적으로 `axios-mock-adapter`를 사용합니다. **별도의 axios-mock-adapter 설정이 필요하지 않습니다**.

### 자동으로 처리되는 것들:

1. **Axios 인스턴스 자동 감지**: 프로젝트에서 사용 중인 axios 인스턴스를 자동으로 찾습니다
2. **Mock 핸들러 자동 등록**: GUI에서 설정한 API들이 자동으로 axios-mock-adapter에 등록됩니다
3. **실시간 업데이트**: GUI에서 API 설정을 변경하면 즉시 반영됩니다

### 기존 axios 설정과 충돌 방지:

```tsx
// 기존 axios 설정이 있어도 괜찮습니다
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.yourproject.com',
  timeout: 5000,
});

// API Mock GUI가 자동으로 이 인스턴스를 감지하고 Mock을 적용합니다
export default api;
```

## 🔧 고급 사용법

### 1. 수동 컴포넌트 사용

자동 초기화 대신 직접 컴포넌트를 사용하고 싶다면:

```tsx
import React from 'react';
import { ApiMockManager } from 'api-mock-gui';
import 'api-mock-gui/dist/styles.css';

function App() {
  return (
    <div style={{ height: '100vh' }}>
      <ApiMockManager
        serverConfig={{
          baseUrl: 'https://api.yourproject.com',
          environment: 'browser'
        }}
        autoStart={true}
        onServerStart={() => console.log('Mock server started!')}
        onServerStop={() => console.log('Mock server stopped!')}
      />
    </div>
  );
}

export default App;
```

### 2. 프로그래밍 방식 제어

```tsx
import { createMockServer, MockApi } from 'api-mock-gui';

// Mock 서버 생성
const mockServer = createMockServer({
  baseUrl: 'https://api.example.com',
  environment: 'browser'
});

// API 설정
const apis: MockApi[] = [
  {
    id: 'users-api',
    name: 'Users API',
    method: 'GET',
    path: '/api/users',
    cases: [
      {
        id: 'success',
        name: 'Success',
        status: 200,
        body: { users: [] },
        isActive: true
      }
    ],
    isEnabled: true
  }
];

// 서버 시작 및 핸들러 등록
await mockServer.start();
mockServer.updateHandlers(apis);
```

## 🛠️ 환경별 설정

### 개발 환경 (자동 활성화)

다음 조건 중 하나라도 만족하면 자동으로 활성화됩니다:
- `localhost` 또는 `127.0.0.1`
- IP 주소가 `192.168.x.x`, `10.x.x.x`, `172.x.x.x`
- 포트 번호가 있는 주소
- `file://` 프로토콜
- `process.env.NODE_ENV === 'development'`
- URL에 `?dev=true` 파라미터

### 프로덕션 환경 (수동 활성화)

```tsx
// 프로덕션에서 강제 활성화
localStorage.setItem('apiMockGui.forceEnable', 'true');

// 또는 URL 파라미터로
// https://yoursite.com?dev=true
```

## 🎨 GUI 사용법

### 1. 플로팅 버튼
- 화면 우하단의 파란색 버튼을 클릭하여 GUI 열기
- 서버가 실행 중일 때는 초록색으로 표시

### 2. 서버 제어
- **Start/Stop 버튼**: Mock 서버 시작/중지
- **Add API 버튼**: 새로운 API 엔드포인트 추가

### 3. API 관리
- **메소드**: GET, POST, PUT, DELETE 선택
- **경로**: API 엔드포인트 경로 입력 (예: `/api/users`)
- **응답 케이스**: 다양한 응답 시나리오 관리

### 4. 응답 케이스
- **상태 코드**: 200, 404, 500 등
- **헤더**: Content-Type 등 HTTP 헤더
- **바디**: JSON 응답 데이터

## 🐛 문제 해결

### 버튼이 클릭되지 않는 경우

1. **CSS 파일 임포트 확인**:
   ```tsx
   import 'api-mock-gui/dist/styles.css';
   ```

2. **브라우저 개발자 도구에서 오류 확인**:
   - F12 → Console 탭에서 JavaScript 오류 확인

3. **수동 초기화 시도**:
   ```tsx
   // 브라우저 콘솔에서 실행
   window.apiMockGuiInit();
   ```

### Mock이 적용되지 않는 경우

1. **서버 상태 확인**: GUI에서 서버가 실행 중인지 확인
2. **API 설정 확인**: 경로와 메소드가 정확한지 확인
3. **브라우저 네트워크 탭 확인**: 요청이 Mock으로 처리되는지 확인

### 개발 환경에서 자동 활성화되지 않는 경우

```tsx
// 강제 활성화
localStorage.setItem('apiMockGui.forceEnable', 'true');
// 페이지 새로고침
```

## 📖 예제 프로젝트

### React + Vite 예제

```tsx
// main.tsx
import 'api-mock-gui/auto';
import 'api-mock-gui/dist/styles.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// App.tsx
import axios from 'axios';
import { useEffect, useState } from 'react';

const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com'
});

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // 이 요청이 Mock으로 처리됩니다
    api.get('/users').then(res => {
      setUsers(res.data);
    });
  }, []);

  return (
    <div>
      <h1>Users</h1>
      <pre>{JSON.stringify(users, null, 2)}</pre>
    </div>
  );
}

export default App;
```

## 📋 요약

1. `npm install api-mock-gui axios axios-mock-adapter`
2. `import 'api-mock-gui/auto'` 추가
3. `import 'api-mock-gui/dist/styles.css'` 추가
4. 개발 서버 실행
5. 우하단 플로팅 버튼 클릭하여 사용

**별도의 axios-mock-adapter 설정은 필요하지 않습니다!** API Mock GUI가 모든 것을 자동으로 처리합니다.

## ❓ 자주 묻는 질문

### Q: axios-mock-adapter를 별도로 설정해야 하나요?

**A: 아니요! 전혀 필요없습니다.** 🙅‍♂️

```tsx
// ❌ 이런 설정은 필요 없습니다:
import MockAdapter from 'axios-mock-adapter';
const mock = new MockAdapter(axios);
mock.onGet('/users').reply(200, { users: [] });

// ✅ API Mock GUI가 모든 것을 자동으로 처리합니다!
import 'api-mock-gui/auto';
// 끝! 더 이상 설정할 것이 없습니다.
```

### Q: axios.create()로 만든 인스턴스도 가로채나요?

**A: 네! 자동으로 모든 axios 인스턴스를 가로챕니다.** ✅

API Mock GUI는 다음을 모두 자동으로 처리합니다:
- `axios.get()` - 기본 인스턴스
- `axios.create().get()` - 생성된 인스턴스  
- 기존에 이미 생성된 인스턴스들
- 앞으로 생성될 인스턴스들

### Q: fetch() API도 지원하나요?

**A: 아니요, axios 전용입니다.** ⚠️

```tsx
// ✅ 지원됨
axios.get('/api/users');

// ❌ 지원 안됨
fetch('/api/users');
```

### Q: 어떤 요청이 Mock되었는지 어떻게 확인하나요?

**A: 브라우저 Console을 확인하세요!** 🔍

Mock이 활성화되면 Console에 다음과 같은 로그가 표시됩니다:
```
✅ Mock server가 성공적으로 시작되었습니다
📡 3개의 axios 인스턴스에 Mock이 적용되었습니다 (기본 + 생성된 인스턴스들)
📡 2개의 Mock API 핸들러가 업데이트되었습니다.
```
