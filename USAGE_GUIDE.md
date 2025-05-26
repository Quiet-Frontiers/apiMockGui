# API Mock GUI - 사용법 가이드

이 가이드는 API Mock GUI 라이브러리를 각 프로젝트에 설치하고 MSW를 통해 실제 API를 제어하는 방법을 설명합니다.

## 📦 설치

```bash
npm install api-mock-gui msw
```

## 🚀 빠른 시작

### 1. MSW Service Worker 설정

프로젝트에서 한 번만 실행하면 됩니다:

```bash
npx msw init public/ --save
```

### 2. 기본 사용법

```tsx
import React from 'react';
import { ApiMockManager, mswHelpers } from 'api-mock-gui';

function App() {
  // 서버 설정
  const serverConfig = mswHelpers.createServerConfig({
    baseUrl: 'https://api.yourproject.com', // 실제 API 서버 URL
    environment: 'browser',
    development: process.env.NODE_ENV === 'development'
  });

  return (
    <div style={{ height: '100vh' }}>
      <ApiMockManager
        serverConfig={serverConfig}
        autoStart={true}
        onServerStart={() => console.log('Mock server started!')}
        onConfigChange={(apis) => {
          // JSON 파일 기반 설정 관리
          // Export/Import 기능을 통해 수동으로 관리
          console.log('Config changed:', apis);
        }}
      />
    </div>
  );
}

export default App;
```

## 🎯 주요 기능

### 1. API Mock Manager

MSW 서버와 GUI를 통합한 컴포넌트입니다.

```tsx
import { ApiMockManager, presets } from 'api-mock-gui';

// 개발 환경용 프리셋 사용
<ApiMockManager
  {...presets.development}
  serverConfig={{
    baseUrl: 'http://localhost:3000',
    environment: 'browser'
  }}
/>
```

### 2. 프리셋 활용

```tsx
import { presets } from 'api-mock-gui';

// 개발 환경
const devConfig = presets.development;

// 프로덕션 환경
const prodConfig = presets.production;

// 테스트 환경
const testConfig = presets.testing;
```

### 3. 프로그래밍 방식으로 Mock Server 제어

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
    activeCase: 'success',
    isEnabled: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// 서버 시작
await mockServer.start();

// 핸들러 업데이트
mockServer.updateHandlers(apis);

// 서버 중지
await mockServer.stop();
```

## 🔧 고급 설정

### 1. 다양한 환경 설정

#### 개발 환경 (Development)
```tsx
import { ApiMockManager } from 'api-mock-gui';

<ApiMockManager
  serverConfig={{
    baseUrl: 'http://localhost:3000',
    environment: 'browser',
    onUnhandledRequest: 'warn' // 처리되지 않은 요청 경고
  }}
  autoStart={true}
  enableExport={true}
  enableImport={true}
/>
```

#### 프로덕션 환경 (Production)
```tsx
<ApiMockManager
  serverConfig={{
    baseUrl: 'https://api.yourproject.com',
    environment: 'browser',
    onUnhandledRequest: 'bypass' // 처리되지 않은 요청 우회
  }}
  autoStart={false}
  enableExport={false}
  enableImport={false}
/>
```

#### 테스트 환경 (Testing)
```tsx
import { createMockServer } from 'api-mock-gui';

// Node.js 환경에서 테스트
const server = createMockServer({
  environment: 'node',
  onUnhandledRequest: 'error' // 처리되지 않은 요청 에러
});

beforeAll(() => server.start());
afterAll(() => server.stop());
```

### 2. 설정 파일 관리

#### 설정 내보내기/가져오기
```tsx
import { mswHelpers } from 'api-mock-gui';

// 설정 파일에서 로드
const fileConfig = await mswHelpers.loadConfigFromFile('/config/mock-apis.json');

// GUI에서 내보내기/가져오기 기능 사용
// - Export 버튼으로 JSON 파일 다운로드
// - Import 버튼으로 JSON 파일 업로드
```

#### 설정 검증
```tsx
import { validateApiConfig } from 'api-mock-gui';

const { isValid, errors } = validateApiConfig(apis);

if (!isValid) {
  console.error('API 설정 오류:', errors);
}
```

## 🌐 실제 프로젝트 통합 예제

### React + TypeScript 프로젝트

```tsx
// src/components/ApiMocker.tsx
import React, { useEffect, useState } from 'react';
import { ApiMockManager, mswHelpers, MockApi } from 'api-mock-gui';

interface ApiMockerProps {
  enabled?: boolean;
}

export const ApiMocker: React.FC<ApiMockerProps> = ({ enabled = false }) => {
  const [isVisible, setIsVisible] = useState(enabled);
  const [savedConfig, setSavedConfig] = useState<MockApi[]>([]);

  useEffect(() => {
    // 설정 파일에서 로드 (필요시)
    // const config = await mswHelpers.loadConfigFromFile('/config/mock-apis.json');
    // setSavedConfig(config);
  }, []);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 left-4 bg-blue-600 text-white px-4 py-2 rounded shadow-lg"
      >
        Open API Mocker
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-white">
      <div className="flex justify-between items-center p-4 border-b">
        <h1 className="text-xl font-bold">API Mock Manager</h1>
        <button
          onClick={() => setIsVisible(false)}
          className="px-4 py-2 bg-gray-500 text-white rounded"
        >
          Close
        </button>
      </div>
      
      <div style={{ height: 'calc(100% - 80px)' }}>
        <ApiMockManager
          serverConfig={mswHelpers.createServerConfig({
            baseUrl: process.env.REACT_APP_API_BASE_URL,
            environment: 'browser',
            development: process.env.NODE_ENV === 'development'
          })}
          autoStart={true}
          initialConfig={savedConfig}
          onConfigChange={(apis) => {
            // JSON 파일 기반 설정 관리
            // Export/Import 기능을 통해 수동으로 관리
            console.log('Config changed:', apis);
          }}
        />
      </div>
    </div>
  );
};
```

### Next.js 프로젝트

```tsx
// pages/_app.tsx
import type { AppProps } from 'next/app';
import { ApiMocker } from '../components/ApiMocker';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      {process.env.NODE_ENV === 'development' && (
        <ApiMocker enabled={true} />
      )}
    </>
  );
}
```

### Vue.js 프로젝트

```vue
<!-- src/components/ApiMocker.vue -->
<template>
  <div v-if="visible" class="api-mocker-overlay">
    <div ref="mockManagerContainer"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { createRoot } from 'react-dom/client';
import { ApiMockManager, mswHelpers } from 'api-mock-gui';

const visible = ref(false);
const mockManagerContainer = ref(null);

onMounted(() => {
  if (mockManagerContainer.value) {
    const root = createRoot(mockManagerContainer.value);
    root.render(
      ApiMockManager({
        serverConfig: mswHelpers.createServerConfig({
          baseUrl: import.meta.env.VITE_API_BASE_URL,
          environment: 'browser'
        }),
        autoStart: true
      })
    );
  }
});
</script>
```

## 🔍 API 테스트 방법

### 1. 브라우저에서 테스트

```javascript
// 개발자 도구 콘솔에서 실행
fetch('/api/users')
  .then(response => response.json())
  .then(data => console.log('Mock 응답:', data));
```

### 2. 컴포넌트에서 테스트

```tsx
import React, { useEffect, useState } from 'react';

const TestComponent = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('/api/users')
      .then(response => response.json())
      .then(data => setUsers(data.users || []));
  }, []);

  return (
    <div>
      <h2>Users (Mocked)</h2>
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
};
```

## 🎨 스타일 커스터마이징

```tsx
import 'api-mock-gui/dist/styles.css'; // 기본 스타일

// 커스텀 스타일 추가
const customStyles = `
  .api-mock-manager {
    /* 커스텀 스타일 */
  }
`;
```

## 📝 팁과 모범 사례

### 1. 환경별 설정 관리

```tsx
// config/mockConfig.ts
export const getMockConfig = () => {
  switch (process.env.NODE_ENV) {
    case 'development':
      return {
        autoStart: true,
        enableExport: true,
        serverConfig: { onUnhandledRequest: 'warn' }
      };
    case 'test':
      return {
        autoStart: true,
        enableExport: false,
        serverConfig: { environment: 'node', onUnhandledRequest: 'error' }
      };
    default:
      return {
        autoStart: false,
        enableExport: false,
        serverConfig: { onUnhandledRequest: 'bypass' }
      };
  }
};
```

### 2. 팀 간 설정 공유

```json
// public/api-mock-config.json
{
  "apis": [
    {
      "name": "Users API",
      "method": "GET",
      "path": "/api/users",
      "cases": [...]
    }
  ]
}
```

```tsx
// 설정 파일에서 로드
useEffect(() => {
  mswHelpers.loadConfigFromFile('/api-mock-config.json')
    .then(config => {
      // 로드된 설정 사용
    });
}, []);
```

### 3. 조건부 Mock 활성화

```tsx
// 개발 환경에서만 Mock 활성화
const shouldEnableMock = 
  process.env.NODE_ENV === 'development' || 
  localStorage.getItem('enableMock') === 'true';

if (shouldEnableMock) {
  // Mock 서버 시작
}
```

## 🚨 주의사항

1. **프로덕션 빌드에서 제외**: Mock 관련 코드가 프로덕션 빌드에 포함되지 않도록 주의하세요.

2. **Service Worker 충돌**: 다른 Service Worker와 충돌할 수 있으니 주의하세요.

3. **CORS 설정**: 실제 API 서버의 CORS 설정을 확인하세요.

4. **성능**: 많은 수의 API Mock은 성능에 영향을 줄 수 있습니다.

## 🐛 문제 해결

### MSW가 작동하지 않는 경우

1. Service Worker 파일 확인:
   ```bash
   npx msw init public/ --save
   ```

2. 브라우저 개발자 도구에서 Service Worker 상태 확인

3. HTTPS 환경에서만 작동하는지 확인 (로컬은 HTTP 가능)

### Mock이 적용되지 않는 경우

1. API 경로 확인
2. Base URL 설정 확인
3. 활성 케이스 설정 확인
4. Mock 서버 실행 상태 확인

## 📞 지원

문제가 발생하면 GitHub Issues에 제보해 주세요:
- 사용 환경 (브라우저, Node.js 버전)
- 에러 메시지
- 재현 단계 