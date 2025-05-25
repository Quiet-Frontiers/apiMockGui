# 🎭 API Mock GUI

[![npm version](https://img.shields.io/npm/v/api-mock-gui.svg)](https://www.npmjs.com/package/api-mock-gui)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)

**API Mock GUI**는 개발 중인 웹 애플리케이션에서 API 응답을 쉽게 모킹할 수 있는 초간단 라이브러리입니다. 설치만 하면 자동으로 floating button이 나타나며, MSW(Mock Service Worker)를 기반으로 실제 HTTP 요청을 가로채어 개발자가 정의한 Mock 응답을 제공합니다.

## ✨ 주요 특징

- 🚀 **Zero Config**: 라이브러리 import만으로 즉시 활성화
- 🎯 **자동 Floating Button**: 개발 환경에서 자동으로 우측 하단에 버튼 생성
- 📡 **MSW 통합**: Service Worker를 통한 실제 네트워크 요청 차단
- 🔄 **실시간 제어**: Mock 서버 시작/중지 및 설정 변경
- 🔧 **개발자 친화적**: TypeScript 지원 및 직관적인 API
- 🌐 **프레임워크 무관**: React, Next.js, Vue.js 등 다양한 환경 지원

## 🚀 빠른 시작

### 1. 설치

```bash
npm install api-mock-gui
```

### 2. MSW 서비스 워커 설정

```bash
npx msw init public/ --save
```

### 3. 사용하기 (이게 전부입니다!)

```typescript
// App.tsx 또는 index.tsx에 추가
import 'api-mock-gui';

function App() {
  return <div>Your App</div>;
}
```

이것만으로 우측 하단에 floating button이 자동으로 나타납니다! 🎉

## 📋 사용 방법

### 🎯 기본 사용법 (권장)

라이브러리를 import하면 자동으로 floating button이 나타납니다.

```typescript
import 'api-mock-gui';
```

**특징:**
- 개발 환경(localhost, 127.0.0.1 등) 자동 감지
- 우측 하단에 floating button 자동 표시
- 클릭하면 Mock API 관리 패널이 열림
- 프로덕션에서는 자동으로 비활성화

### 🎮 수동 제어 (선택사항)

브라우저 콘솔에서 직접 제어할 수 있습니다.

```javascript
// 브라우저 콘솔에서
window.cleanupApiMockGui(); // 완전히 제거
```

### 🪟 팝업 모드 컴포넌트

```typescript
import React from 'react';
import { PopupApiMockManager, mswHelpers } from 'api-mock-gui';

function App() {
  const serverConfig = mswHelpers.createServerConfig({
    baseUrl: 'http://localhost:3000',
    environment: 'browser',
    development: true
  });

  return (
    <div>
      <PopupApiMockManager
        serverConfig={serverConfig}
        autoStart={true}
        position="bottom-right"
        buttonText="API Mock"
        popupWidth={1000}
        popupHeight={700}
      />
      {/* Your app content */}
    </div>
  );
}
```

### 🎈 Floating 모드 컴포넌트

```typescript
import React from 'react';
import { FloatingApiMockManager, mswHelpers } from 'api-mock-gui';

function App() {
  const serverConfig = mswHelpers.createServerConfig({
    baseUrl: 'http://localhost:3000',
    environment: 'browser',
    development: true
  });

  return (
    <div>
      <FloatingApiMockManager
        serverConfig={serverConfig}
        autoStart={true}
        position="bottom-right"
        buttonText="API Mock"
        panelWidth="900px"
        panelHeight="700px"
        draggable={true}
        minimizable={true}
      />
      {/* Your app content */}
    </div>
  );
}
```

### 📦 인라인 모드 컴포넌트

```typescript
import React from 'react';
import { ApiMockManager, mswHelpers } from 'api-mock-gui';

function App() {
  const serverConfig = mswHelpers.createServerConfig({
    baseUrl: 'http://localhost:3000',
    environment: 'browser',
    development: true
  });

  return (
    <div style={{ height: '100vh' }}>
      <ApiMockManager
        serverConfig={serverConfig}
        autoStart={true}
        enableExport={true}
        enableImport={true}
      />
    </div>
  );
}
```

## 🎛️ 설정 옵션

### 전역 설정

```typescript
// 자동 초기화 비활성화
window.API_MOCK_AUTO_INIT = false;

// 설정 커스터마이징
window.API_MOCK_AUTO_INIT = {
  position: 'top-left',
  buttonText: 'Mock API',
  autoStart: false,
  development: true
};
```

### 브라우저 콘솔에서 제어

```javascript
// 수동 활성화
window.apiMockGuiInit();

// 정리
window.apiMockGuiCleanup();
```

## 📚 API 참조

### `initAutoApiMock(options)`

자동 초기화 함수입니다.

```typescript
interface AutoApiMockInitProps {
  baseUrl?: string;              // 기본: window.location.origin
  environment?: 'browser' | 'node'; // 기본: 'browser'
  development?: boolean;         // 기본: 자동 감지
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'; // 기본: 'bottom-right'
  buttonText?: string;           // 기본: 'API Mock'
  autoStart?: boolean;           // 기본: development 값과 동일
  disabled?: boolean;            // 기본: false
}
```

### `PopupApiMockManager` Props

```typescript
interface PopupApiMockManagerProps {
  serverConfig: MockServerConfig;
  autoStart?: boolean;           // 기본: false
  position?: string;             // 기본: 'bottom-right'
  buttonText?: string;           // 기본: 'API Mock'
  buttonIcon?: React.ReactNode;
  popupWidth?: number;           // 기본: 1000
  popupHeight?: number;          // 기본: 700
  autoShow?: boolean;            // 기본: true
  onServerStart?: () => void;
  onServerStop?: () => void;
  onConfigChange?: (apis: MockApi[]) => void;
}
```

### `FloatingApiMockManager` Props

```typescript
interface FloatingApiMockManagerProps {
  serverConfig: MockServerConfig;
  autoStart?: boolean;           // 기본: false
  position?: string;             // 기본: 'bottom-right'
  buttonText?: string;
  buttonIcon?: React.ReactNode;
  panelWidth?: string;           // 기본: '800px'
  panelHeight?: string;          // 기본: '600px'
  minimizable?: boolean;         // 기본: true
  draggable?: boolean;           // 기본: true
  onServerStart?: () => void;
  onServerStop?: () => void;
  onConfigChange?: (apis: MockApi[]) => void;
}
```

## 🔧 고급 사용법

### 초기 API 설정

```typescript
const initialConfig = [
  {
    id: 'users-api',
    name: 'Users API',
    method: 'GET',
    path: '/api/users',
    description: 'Get all users',
    cases: [
      {
        id: 'success',
        name: 'Success Response',
        description: 'Returns list of users',
        status: 200,
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
        id: 'error',
        name: 'Server Error',
        description: 'Internal server error',
        status: 500,
        body: { success: false, message: 'Internal server error' },
        delay: 1000,
        isActive: false
      }
    ],
    activeCase: 'success',
    isEnabled: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

<ApiMockManager
  serverConfig={serverConfig}
  initialConfig={initialConfig}
  // ... other props
/>
```

### 환경별 설정

```typescript
// 개발 환경
const devConfig = mswHelpers.createServerConfig({
  baseUrl: 'http://localhost:3000',
  environment: 'browser',
  development: true
});

// 스테이징 환경
const stagingConfig = mswHelpers.createServerConfig({
  baseUrl: 'https://api-staging.example.com',
  environment: 'browser',
  development: false
});

// 프로덕션 환경 (일반적으로 비활성화)
const prodConfig = mswHelpers.createServerConfig({
  baseUrl: 'https://api.example.com',
  environment: 'browser',
  development: false
});
```

### 이벤트 핸들링

```typescript
<ApiMockManager
  serverConfig={serverConfig}
  onServerStart={() => {
    console.log('🎭 Mock server started!');
    // 개발자 도구에 알림 표시
    console.log('%c Mock Server Active ', 'background: #10b981; color: white; padding: 2px 4px; border-radius: 2px;');
  }}
  onServerStop={() => {
    console.log('🛑 Mock server stopped!');
  }}
  onConfigChange={(apis) => {
    console.log(`📝 API configuration updated: ${apis.length} endpoints`);
    // localStorage에 설정 저장
    localStorage.setItem('mock-api-config', JSON.stringify(apis));
  }}
/>
```

## 🌐 프레임워크별 가이드

### Next.js

```typescript
// pages/_app.tsx 또는 app/layout.tsx
import 'api-mock-gui/auto';

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
```

### Vue.js

```javascript
// main.js
import { initAutoApiMock } from 'api-mock-gui';

if (process.env.NODE_ENV === 'development') {
  initAutoApiMock({
    development: true,
    autoStart: true
  });
}
```

### Vanilla JavaScript

```html
<script type="module">
  import { initAutoApiMock } from 'api-mock-gui';
  
  initAutoApiMock({
    development: true,
    autoStart: true,
    position: 'bottom-right'
  });
</script>
```

## 🎨 스타일링

### CSS 스타일시트 임포트

```typescript
import 'api-mock-gui/dist/styles.css';
```

### 커스텀 스타일링

```css
/* floating button 커스터마이징 */
#api-mock-gui-auto-container button {
  background: linear-gradient(45deg, #667eea 0%, #764ba2 100%) !important;
}

/* 팝업 창 커스터마이징 */
.api-mock-manager {
  font-family: 'SF Pro Display', system-ui, sans-serif;
}
```

## 🔍 디버깅

### 개발자 도구에서 확인

API Mock GUI가 올바르게 작동하는지 확인하는 방법:

1. **콘솔 로그 확인**
   ```
   🎭 API Mock GUI Auto Mode가 활성화되었습니다!
   💡 우측 하단의 floating button을 클릭하여 사용하세요.
   ```

2. **Network 탭 확인**
   - Mock된 요청은 `(from service worker)` 표시
   - 실제 네트워크 요청 대신 로컬 응답

3. **Console에서 수동 제어**
   ```javascript
   // 상태 확인
   console.log(window.apiMockGuiInit);
   
   // 수동 초기화
   window.apiMockGuiInit();
   ```

### 일반적인 문제 해결

**Q: Floating button이 나타나지 않아요**
```javascript
// 환경 확인
console.log('Hostname:', window.location.hostname);
console.log('Port:', window.location.port);

// 수동 활성화
window.apiMockGuiInit({ development: true });
```

**Q: MSW가 작동하지 않아요**
1. `npx msw init public/ --save` 실행 확인
2. `public/mockServiceWorker.js` 파일 존재 확인
3. HTTPS 환경에서만 Service Worker 작동 (localhost 제외)

**Q: TypeScript 에러가 발생해요**
```typescript
// types 설정
declare global {
  interface Window {
    API_MOCK_AUTO_INIT?: any;
    apiMockGuiInit?: Function;
    apiMockGuiCleanup?: Function;
  }
}
```

## 📦 패키지 정보

- **크기**: ~30KB (gzipped)
- **의존성**: React, ReactDOM, Lucide React, MSW
- **브라우저 지원**: Chrome, Firefox, Safari, Edge (최신 버전)
- **Node.js**: 16+ 권장

## 🤝 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 라이선스

MIT License - 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 🙋‍♂️ 지원

- **Issues**: [GitHub Issues](https://github.com/your-repo/api-mock-gui/issues)
- **Documentation**: [Wiki](https://github.com/your-repo/api-mock-gui/wiki)
- **Examples**: [Examples Repository](https://github.com/your-repo/api-mock-gui-examples)

---

**Made with ❤️ for developers who love efficient API mocking**
 