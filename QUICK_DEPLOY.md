# 🚀 빠른 배포 체크리스트

## ✅ 배포 전 해야 할 일

### 1. npm 계정 로그인
```bash
npm login
```

### 2. package.json 정보 수정
현재 수정이 필요한 부분:
```json
{
  "author": {
    "name": "Your Name",  // ← 실제 이름으로 변경
    "email": "your.email@example.com"  // ← 실제 이메일로 변경
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/yourusername/api-mock-gui.git"  // ← 실제 GitHub URL
  },
  "bugs": {
    "url": "https://github.com/yourusername/api-mock-gui/issues"  // ← 실제 GitHub URL
  },
  "homepage": "https://github.com/yourusername/api-mock-gui#readme"  // ← 실제 GitHub URL
}
```

### 3. README.md 수정
다음 부분들을 실제 주소로 변경:
- GitHub Issues 링크
- Wiki 링크
- Repository 링크

### 4. GitHub 리포지토리 생성 & 푸시
```bash
git init
git add .
git commit -m "Initial commit: API Mock GUI library with axios-mock-adapter"
git branch -M main
git remote add origin https://github.com/실제유저네임/api-mock-gui.git
git push -u origin main
```

## 🚀 배포 실행

### 1. 최종 체크
```bash
npm run publish:check
```

### 2. 배포 (자동으로 빌드 + 체크 실행됨)
```bash
npm publish
```

## 🎉 배포 성공 후

### 1. 배포 확인
```bash
npm view api-mock-gui
```

### 2. 테스트 설치
```bash
# 다른 폴더에서
mkdir test-install
cd test-install
npm init -y
npm install api-mock-gui axios  # axios도 함께 설치
```

### 3. 실제 사용 테스트
```javascript
// test.js
import 'api-mock-gui/auto';
import axios from 'axios';
console.log('✅ API Mock GUI 설치 성공!');

// 간단한 테스트
setTimeout(async () => {
  try {
    const response = await axios.get('/test');
    console.log('Mock response:', response.data);
  } catch (error) {
    console.log('No mock configured yet - this is normal');
  }
}, 1000);
```

## 📈 버전 업데이트 (향후)

```bash
# 패치 버전 (1.0.0 → 1.0.1)
npm version patch
npm publish

# 마이너 버전 (1.0.1 → 1.1.0)
npm version minor
npm publish

# 메이저 버전 (1.1.0 → 2.0.0)
npm version major
npm publish
```

## 🔄 주요 변경사항 (v1.0.1)

### 🎯 MSW → axios-mock-adapter 마이그레이션

**변경된 점:**
- ✅ MSW Service Worker 의존성 제거
- ✅ axios-mock-adapter 기반으로 변경
- ✅ 설정 복잡도 대폭 감소
- ✅ 성능 향상 (네트워크 레이어 거치지 않음)

**사용자에게 미치는 영향:**
- 🎉 더 간단한 설정 (`npx msw init` 불필요)
- 🚀 더 빠른 응답 속도
- 📦 더 작은 번들 크기
- ⚠️ axios 사용 필수 (fetch API 지원 안됨)

## 🆘 문제 해결

### 패키지명 충돌시
```bash
# Scoped 패키지로 배포
npm publish --access=public --scope=@yourusername
```

### 2FA 필요시
```bash
npm publish --otp=123456
```

### 배포 실수시 (24시간 내)
```bash
npm unpublish api-mock-gui@1.0.1
```

### axios-mock-adapter 관련 이슈
```bash
# 타입 정의 확인
npm ls @types/axios
npm ls axios-mock-adapter

# 의존성 재설치
npm install axios axios-mock-adapter --save
```

## 📝 배포 후 TODO

### 1. 문서 업데이트
- [ ] README.md의 axios 사용법 강조
- [ ] MSW에서 마이그레이션 가이드 작성
- [ ] 예제 코드 업데이트

### 2. 호환성 테스트
- [ ] React 18에서 테스트
- [ ] Next.js에서 테스트
- [ ] Vue.js에서 테스트
- [ ] 다양한 axios 버전에서 테스트

### 3. 커뮤니티 알림
- [ ] GitHub 릴리즈 노트 작성
- [ ] npm 패키지 설명 업데이트
- [ ] 기존 MSW 사용자를 위한 마이그레이션 가이드

## 🔍 품질 체크리스트

### ✅ 기술적 체크
- [x] TypeScript 컴파일 성공
- [x] 번들 크기 최적화
- [x] 의존성 최소화
- [x] Tree-shaking 지원
- [x] ESM/CommonJS 호환성

### ✅ 사용성 체크
- [x] One-line import 동작
- [x] 자동 환경 감지
- [x] Floating button 표시
- [x] Mock server 시작/중지
- [x] API 추가/편집/삭제

### ✅ 문서 체크
- [x] README 업데이트
- [x] 설치 가이드 수정
- [x] 예제 코드 검증
- [x] 마이그레이션 가이드 작성 