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
git commit -m "Initial commit: API Mock GUI library"
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
npm install api-mock-gui
```

### 3. 실제 사용 테스트
```javascript
// test.js
import 'api-mock-gui';
console.log('✅ API Mock GUI 설치 성공!');
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
npm unpublish api-mock-gui@1.0.0
``` 