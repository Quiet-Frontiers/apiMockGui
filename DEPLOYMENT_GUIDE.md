# 📦 NPM 배포 가이드

## 1. 사전 준비

### npm 계정 준비
```bash
# npm 계정 생성 (없다면)
npm adduser

# 기존 계정 로그인
npm login

# 로그인 확인
npm whoami
```

### GitHub 리포지토리 생성
1. GitHub에서 새 리포지토리 생성 (예: `api-mock-gui`)
2. 코드 푸시:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/api-mock-gui.git
git push -u origin main
```

## 2. 배포 정보 수정

### package.json 수정 필요 사항
```json
{
  "author": {
    "name": "실제이름",
    "email": "실제이메일@example.com"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/실제깃허브유저네임/api-mock-gui.git"
  },
  "bugs": {
    "url": "https://github.com/실제깃허브유저네임/api-mock-gui/issues"
  },
  "homepage": "https://github.com/실제깃허브유저네임/api-mock-gui#readme"
}
```

## 3. 배포 실행

### 최종 빌드
```bash
npm run build
```

### 배포 전 테스트 (선택사항)
```bash
# 로컬에서 패키지 설치 테스트
npm pack
# 생성된 .tgz 파일로 다른 프로젝트에서 테스트 가능
```

### 실제 배포
```bash
# 첫 배포
npm publish

# 버전 업데이트 후 배포
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.1 -> 1.1.0  
npm version major  # 1.1.0 -> 2.0.0
npm publish
```

## 4. 배포 후 확인

### npm 레지스트리에서 확인
```bash
npm view api-mock-gui
```

### 설치 테스트
```bash
# 새 프로젝트에서 테스트
npm install api-mock-gui
```

## 5. 일반적인 문제 해결

### 패키지명 충돌
```bash
# 다른 이름으로 배포
npm publish --scope=@yourusername
# 결과: @yourusername/api-mock-gui
```

### 버전 업데이트 실수
```bash
# 잘못된 버전 삭제 (24시간 내)
npm unpublish api-mock-gui@1.0.1

# 특정 버전 deprecate
npm deprecate api-mock-gui@1.0.1 "버그가 있는 버전입니다"
```

### 2FA 인증 필요시
```bash
npm publish --otp=123456  # 2FA 코드 입력
```

## 6. 성공적인 배포 후

### README 업데이트
- npm 배지 추가
- 설치 가이드 업데이트
- 버전 정보 업데이트

### 지속적인 유지관리
- 이슈 대응
- 보안 업데이트
- 새 기능 추가 시 버전 관리 