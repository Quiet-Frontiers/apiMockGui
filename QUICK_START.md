# 🚀 빠른 시작 가이드

## 1분 만에 API Mock GUI 설정하기

### 1️⃣ 설치

```bash
npm install api-mock-gui msw
```

### 2️⃣ MSW Service Worker 설정

```bash
npx msw init public/ --save
```

### 3️⃣ 프로젝트에 추가

```tsx
// src/App.tsx
import React from 'react';
import { ApiMockManager, mswHelpers } from 'api-mock-gui';

function App() {
  return (
    <div className="h-screen">
      <ApiMockManager
        serverConfig={mswHelpers.createServerConfig({
          baseUrl: 'https://jsonplaceholder.typicode.com', // 테스트용 API
          environment: 'browser'
        })}
        autoStart={true}
      />
    </div>
  );
}

export default App;
```

### 4️⃣ 테스트해보기

1. 브라우저에서 앱 실행
2. "Add API" 버튼 클릭
3. 다음 설정으로 API 추가:
   - **Name**: `Posts API`
   - **Method**: `GET`
   - **Path**: `/posts`
4. "Add Case" 버튼으로 응답 케이스 추가:
   - **Name**: `Success`
   - **Status**: `200`
   - **Body**: 
     ```json
     {
       "success": true,
       "data": [
         {"id": 1, "title": "Hello World", "body": "This is a mock response!"}
       ]
     }
     ```
5. "Start Server" 버튼 클릭
6. 브라우저 개발자 도구 콘솔에서 테스트:
   ```javascript
   fetch('/posts').then(r => r.json()).then(console.log)
   ```

### 🎉 완료!

이제 실제 API 요청이 Mock 응답으로 가로채집니다!

## 💡 다음 단계

- [상세 사용법 가이드](./USAGE_GUIDE.md) 읽기
- [프로젝트별 통합 방법](./README.md#실제-프로젝트-통합) 확인
- [고급 설정](./README.md#고급-사용법) 살펴보기

## 🚨 문제가 있나요?

1. Service Worker가 등록되었는지 개발자 도구 > Application > Service Workers에서 확인
2. 콘솔에 MSW 관련 오류가 있는지 확인
3. [문제 해결 가이드](./README.md#문제-해결) 참조 