# 🚀 빠른 시작 가이드

## 1분 만에 API Mock GUI 설정하기

### 1️⃣ 설치

```bash
npm install api-mock-gui
```

### 2️⃣ 프로젝트에 추가

```tsx
// src/App.tsx
import React from 'react';
import 'api-mock-gui/auto'; // 🎯 이 한 줄만 추가하면 됩니다!

function App() {
  return (
    <div className="h-screen">
      <h1>Your Application</h1>
      {/* 우측 하단에 floating button이 자동으로 나타납니다! */}
    </div>
  );
}

export default App;
```

### 3️⃣ 테스트해보기

1. 브라우저에서 앱 실행
2. 우측 하단의 floating button 클릭
3. "Start" 버튼으로 Mock Server 시작
4. "Add API" 버튼 클릭
5. 다음 설정으로 API 추가:
   - **Name**: `Posts API`
   - **Method**: `GET`
   - **Path**: `/api/posts`
6. "Add Case" 버튼으로 응답 케이스 추가:
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
7. 브라우저 개발자 도구 콘솔에서 테스트:
   ```javascript
   // axios 사용 (권장)
   import axios from 'axios';
   axios.get('/api/posts').then(r => console.log(r.data));
   
   // 또는 fetch (axios가 더 안정적임)
   fetch('/api/posts').then(r => r.json()).then(console.log)
   ```

### 🎉 완료!

이제 실제 API 요청이 Mock 응답으로 가로채집니다!

## 💡 주요 차이점 (vs MSW)

| 특징 | API Mock GUI (axios-mock-adapter) | MSW |
|------|-----------------------------------|-----|
| **설정** | import 한 줄만 추가 | Service Worker 파일 설정 필요 |
| **지원 요청** | axios 요청만 지원 | 모든 HTTP 요청 지원 |
| **성능** | 즉시 응답 (네트워크 레이어 거치지 않음) | Service Worker 경유 |
| **디버깅** | Network 탭에 요청 표시 안됨 | Network 탭에 표시됨 |
| **호환성** | axios 사용 프로젝트에 최적화 | 모든 HTTP 라이브러리 지원 |

## 🚨 axios 사용 권장

이 라이브러리는 **axios-mock-adapter** 기반이므로 axios 사용을 강력히 권장합니다:

```typescript
// ✅ 권장 - axios 사용
import axios from 'axios';
const response = await axios.get('/api/users');

// ⚠️ 비권장 - fetch API (지원하지 않음)
const response = await fetch('/api/users');
```

## 🔧 고급 설정

### 커스텀 axios 인스턴스

```typescript
import axios from 'axios';
import 'api-mock-gui/auto';

// 커스텀 axios 인스턴스도 자동으로 Mock됩니다
const apiClient = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 5000
});

// 이 요청도 Mock GUI에서 설정한 대로 가로채집니다
apiClient.get('/users');
```

### 개발 환경에서만 활성화

```typescript
// 개발 환경에서만 Mock GUI 활성화
if (process.env.NODE_ENV === 'development') {
  import('api-mock-gui/auto');
}
```

## 💡 다음 단계

- [상세 사용법 가이드](./README.md) 읽기
- [프로젝트별 통합 방법](./README.md#프레임워크별-가이드) 확인
- [고급 설정](./README.md#고급-사용법) 살펴보기

## 🚨 문제가 있나요?

1. axios를 사용하고 있는지 확인
2. 개발 환경(localhost)에서 실행 중인지 확인
3. 콘솔에 오류가 있는지 확인
4. [문제 해결 가이드](./README.md#일반적인-문제-해결) 참조 