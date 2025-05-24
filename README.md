# API Mock GUI

**MSW(Mock Service Worker) 통합**을 통해 실제 API 요청을 가로채고 Mock 응답을 제공하는 React 기반 GUI 라이브러리입니다. 개발 및 테스트 환경에서 API 응답을 쉽게 관리하고 시뮬레이션할 수 있습니다.

## ✨ 주요 기능

- ✅ **API 관리**: RESTful API endpoint 추가/수정/삭제
- ✅ **Response Case 관리**: 각 API별로 여러 응답 케이스 관리
- ✅ **MSW 통합**: 실제 API 요청을 가로채고 Mock 응답 제공
- ✅ **라이브러리 형태**: npm 패키지로 배포 가능
- ✅ **모던 UI**: Tailwind CSS 기반의 깔끔한 인터페이스
- ✅ **TypeScript 지원**: 완전한 타입 안정성
- ✅ **Export/Import**: 설정을 JSON 파일로 내보내기/가져오기
- ✅ **환경별 설정**: 개발/프로덕션/테스트 환경별 프리셋 제공

## 📦 설치

```bash
npm install api-mock-gui msw
```

## 🚀 빠른 시작

### 1. MSW Service Worker 설정

```bash
npx msw init public/ --save
```

### 2. 기본 사용법

```tsx
import React from 'react';
import { ApiMockManager, mswHelpers } from 'api-mock-gui';

function App() {
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
        onConfigChange={(apis) => {
          mswHelpers.saveConfigToLocalStorage(apis);
        }}
      />
    </div>
  );
}

export default App;
```

### 3. 프리셋 사용

```tsx
import { ApiMockManager, presets } from 'api-mock-gui';

// 개발 환경용 프리셋
<ApiMockManager
  {...presets.development}
  serverConfig={{ baseUrl: 'http://localhost:3000' }}
/>

// 프로덕션 환경용 프리셋
<ApiMockManager
  {...presets.production}
  serverConfig={{ baseUrl: 'https://api.production.com' }}
/>
```

## 🎯 주요 컴포넌트

### ApiMockManager

MSW 서버와 GUI를 통합한 메인 컴포넌트

```tsx
<ApiMockManager
  serverConfig={{
    baseUrl: 'https://api.example.com',
    environment: 'browser',
    onUnhandledRequest: 'warn'
  }}
  autoStart={true}
  onServerStart={() => console.log('Mock server started!')}
  onServerStop={() => console.log('Mock server stopped!')}
  onConfigChange={(apis) => console.log('Config changed:', apis)}
  enableExport={true}
  enableImport={true}
/>
```

### ApiMockGui (GUI만 사용)

MSW 없이 GUI만 사용하는 경우

```tsx
import { ApiMockGui } from 'api-mock-gui';

<ApiMockGui
  onConfigChange={(apis) => console.log('APIs:', apis)}
  enableExport={true}
  enableImport={true}
/>
```

## 🔧 고급 사용법

### 프로그래밍 방식으로 Mock Server 제어

```tsx
import { createMockServer, MockApi } from 'api-mock-gui';

const mockServer = createMockServer({
  baseUrl: 'https://api.example.com',
  environment: 'browser'
});

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
        body: {
          success: true,
          data: [
            { id: 1, name: 'John Doe', email: 'john@example.com' }
          ]
        },
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

### 설정 파일 관리

```tsx
import { mswHelpers } from 'api-mock-gui';

// localStorage에서 설정 로드
const savedConfig = mswHelpers.loadConfigFromLocalStorage();

// 설정 파일에서 로드
const fileConfig = await mswHelpers.loadConfigFromFile('/config/apis.json');

// localStorage에 저장
mswHelpers.saveConfigToLocalStorage(apis);
```

## 🌐 실제 프로젝트 통합

### React 프로젝트

```tsx
// src/components/ApiMocker.tsx
import React, { useState } from 'react';
import { ApiMockManager, mswHelpers } from 'api-mock-gui';

export const ApiMocker = () => {
  const [isVisible, setIsVisible] = useState(false);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 left-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Open API Mocker
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-white">
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-4 right-4 bg-gray-500 text-white px-4 py-2 rounded"
      >
        Close
      </button>
      
      <ApiMockManager
        serverConfig={mswHelpers.createServerConfig({
          baseUrl: process.env.REACT_APP_API_BASE_URL,
          environment: 'browser'
        })}
        autoStart={true}
        onConfigChange={(apis) => {
          mswHelpers.saveConfigToLocalStorage(apis);
        }}
      />
    </div>
  );
};
```

### Next.js 프로젝트

```tsx
// pages/_app.tsx
import { ApiMocker } from '../components/ApiMocker';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      {process.env.NODE_ENV === 'development' && <ApiMocker />}
    </>
  );
}
```

## 📊 API 테스트

Mock 서버가 실행되면 실제 API 요청을 가로채서 Mock 응답을 제공합니다:

```javascript
// 브라우저 개발자 도구에서 테스트
fetch('/api/users')
  .then(response => response.json())
  .then(data => console.log('Mock 응답:', data));

// 또는 컴포넌트에서
useEffect(() => {
  fetch('/api/users')
    .then(response => response.json())
    .then(data => setUsers(data));
}, []);
```

## 🎨 Props 및 설정

### ApiMockManagerProps

| 속성 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `serverConfig` | `MockServerConfig` | `{}` | MSW 서버 설정 |
| `autoStart` | `boolean` | `false` | 자동으로 서버 시작 |
| `onServerStart` | `() => void` | `undefined` | 서버 시작 시 콜백 |
| `onServerStop` | `() => void` | `undefined` | 서버 중지 시 콜백 |
| `className` | `string` | `''` | 추가 CSS 클래스 |
| `onConfigChange` | `(apis: MockApi[]) => void` | `undefined` | API 설정 변경 시 콜백 |
| `initialConfig` | `MockApi[]` | `[]` | 초기 API 설정 |
| `enableExport` | `boolean` | `true` | 내보내기 기능 활성화 |
| `enableImport` | `boolean` | `true` | 가져오기 기능 활성화 |

### MockServerConfig

| 속성 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `baseUrl` | `string` | `undefined` | API 서버의 베이스 URL |
| `environment` | `'browser' \| 'node'` | `'browser'` | 실행 환경 |
| `onUnhandledRequest` | `'bypass' \| 'warn' \| 'error'` | `'bypass'` | 처리되지 않은 요청 처리 방식 |

## 📝 환경별 프리셋

### Development
```tsx
{
  serverConfig: {
    environment: 'browser',
    onUnhandledRequest: 'warn'
  },
  autoStart: true,
  enableExport: true,
  enableImport: true
}
```

### Production
```tsx
{
  serverConfig: {
    environment: 'browser',
    onUnhandledRequest: 'bypass'
  },
  autoStart: false,
  enableExport: false,
  enableImport: false
}
```

### Testing
```tsx
{
  serverConfig: {
    environment: 'node',
    onUnhandledRequest: 'error'
  },
  autoStart: true,
  enableExport: false,
  enableImport: false
}
```

## 🛠️ 개발

### 로컬 개발 환경 설정

```bash
# 저장소 클론
git clone https://github.com/your-username/api-mock-gui.git
cd api-mock-gui

# 의존성 설치
npm install

# MSW Service Worker 설정
npx msw init public/ --save

# 개발 서버 시작
npm run dev
```

### 빌드

```bash
# 라이브러리 빌드
npm run build

# 타입 체크
npm run type-check
```

## 🚨 주의사항

1. **Service Worker**: MSW는 Service Worker를 사용하므로 HTTPS 환경이 필요합니다 (localhost는 예외)
2. **프로덕션 빌드**: Mock 관련 코드가 프로덕션에 포함되지 않도록 환경별 조건부 로딩 권장
3. **CORS**: 실제 API 서버의 CORS 설정을 확인하세요
4. **충돌**: 다른 Service Worker와 충돌할 수 있습니다

## 🐛 문제 해결

### MSW가 작동하지 않는 경우
1. `npx msw init public/ --save` 실행 확인
2. 브라우저 개발자 도구에서 Service Worker 상태 확인
3. Console에서 MSW 관련 오류 메시지 확인

### Mock이 적용되지 않는 경우
1. Mock 서버가 실행 중인지 확인
2. API 경로와 Base URL 설정 확인
3. 활성 케이스가 설정되어 있는지 확인

## 📚 추가 문서

- [상세 사용법 가이드](./USAGE_GUIDE.md)
- [API 참조 문서](./docs/api-reference.md)
- [예제 프로젝트](./examples/)

## 🤝 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

MIT License - 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 💬 지원

이슈가 있거나 기능 요청이 있으시면 [GitHub Issues](https://github.com/your-username/api-mock-gui/issues)에 올려주세요.

---

**🎭 이제 실제 API 요청을 MSW로 가로채서 Mock 응답을 제공할 수 있습니다!**
 