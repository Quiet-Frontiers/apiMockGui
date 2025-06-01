# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.12] - 2025-05-31

### ✨ Updated
- **React Component Design**: React 컴포넌트 디자인을 브라우저 번들과 동일하게 업데이트
- **Database Icon**: React 컴포넌트에서도 Database 아이콘 사용
- **Status Indicators**: 실시간 서버 상태 표시 (색상 변경, 펄스 애니메이션)
- **Simplified UI**: Start/Stop, Add API, Save Config 버튼으로 간소화
- **Consistent Experience**: npm과 CDN 버전 모두 동일한 UI/UX 제공

### 🔄 Changed
- `FloatingApiMockManager.tsx`: 브라우저 번들 스타일로 완전 재설계
- Panel size: 400x500px로 표준화
- Button interactions: 호버 효과 및 상태 반영 개선

## [2.0.11] - 2025-05-31

### 🧹 Production Ready Cleanup
- **Console.log 정리**: 모든 디버깅용 console.log 메시지를 제거하여 프로덕션 환경에 적합하도록 개선
- **브라우저 번들 최적화**: 불필요한 로그 출력 제거로 파일 크기 최적화 (27.96KB)
- **성능 향상**: 로그 처리 오버헤드 제거로 런타임 성능 개선

### 🔧 Technical Improvements  
- 중요한 에러 메시지와 경고는 유지하면서 디버그 로그만 선별적 제거
- 브라우저 환경에서의 깔끔한 콘솔 출력
- 프로덕션 배포에 최적화된 코드베이스

### ✨ 유지된 기능
- 모든 기존 기능은 그대로 유지
- Database 아이콘과 플로팅 UI 정상 작동
- 서버 상태 관리 및 버튼 이벤트 처리 완벽 동작

## [2.0.10] - 2025-05-31

### 🎉 브라우저 버전 완전 개선
- **Database 아이콘 적용**: 테스트에서 확인된 최신 Database SVG 아이콘 적용
- **서버 상태 관리**: Start/Stop 버튼이 실제로 상태를 변경하고 UI 업데이트
- **실시간 상태 표시**: 플로팅 버튼과 패널에서 서버 실행 상태 시각적 표시
- **알림 시스템**: 서버 시작/중지 시 우상단 알림 메시지 표시
- **호버 효과 개선**: 모든 버튼에 부드러운 호버 및 클릭 애니메이션

### ✨ 새로운 기능
- **Status Dot**: 서버 실행 중일 때 플로팅 버튼에 펄스 애니메이션 점 표시
- **Play/Stop 아이콘**: Start/Stop 버튼에 적절한 SVG 아이콘 표시
- **Save Config 버튼**: 설정 저장 기능 버튼 추가
- **개선된 서버 상태 패널**: Mock Server 섹션에서 상태 한눈에 확인 가능

### 🔧 기술적 개선
- 순수 JavaScript 기반 완전한 상태 관리
- SVG 아이콘 동적 생성으로 외부 의존성 제거
- 더 강력한 이벤트 핸들링과 상태 동기화
- 브라우저 호환성 향상된 CSS 스타일링

### 🎯 테스트된 기능
- ✅ Database 아이콘 표시
- ✅ Start/Stop 버튼 정상 작동
- ✅ 서버 상태 실시간 업데이트
- ✅ 플로팅 버튼 상태 변경
- ✅ 알림 메시지 표시
- ✅ 모든 버튼 클릭 이벤트 정상 작동

## [2.0.9] - 2025-05-31

### 🔧 Fixed
- **브라우저 번들 누락 해결**: `auto-init.browser.js` 파일이 npm 패키지에 포함되지 않았던 문제 수정
- **빌드 프로세스 개선**: 브라우저 번들이 자동으로 빌드에 포함되도록 스크립트 수정
- **패키지 완성도 향상**: 모든 테스트된 기능이 배포 버전에 포함되도록 보장

### 📦 Technical Details
- 빌드 스크립트에 `build:browser` 단계 추가
- 브라우저 호환성 테스트를 위한 번들 파일 검증 로직 구현

## [2.0.8] - 2025-05-31

### 🎉 Major Bug Fixes
- **CSS 임포트 오류 완전 해결**: 사용자가 더 이상 CSS를 수동으로 임포트할 필요 없음
- **버튼 클릭 무반응 문제 해결**: 모든 GUI 버튼이 안정적으로 작동
- **플로팅 UI 위치 문제 해결**: 우하단에 정확히 고정되어 표시

### ✨ New Features
- **자동 CSS 주입**: `import 'api-mock-gui/auto'` 한 줄로 모든 스타일 자동 적용
- **브라우저 호환성 향상**: UMD 번들을 통한 직접 HTML 사용 지원
- **강화된 이벤트 핸들링**: 더 안정적인 버튼 클릭 및 드래그 기능
- **개발 환경 자동 감지**: localhost, 127.0.0.1 등에서 자동 활성화

### 🔧 Technical Improvements
- 순수 JavaScript 기반 플로팅 버튼 (React 의존성 문제 해결)
- CSS `!important` 규칙으로 스타일 충돌 방지
- 엘리먼트 제거/재생성 방식으로 UI 상태 관리 개선
- 불필요한 console.log 제거로 깔끔한 개발자 경험

### 📚 Documentation
- README.md 업데이트: 간소화된 사용법 안내
- USAGE_GUIDE.md 개선: CSS 임포트 요구사항 제거
- 문제 해결 가이드 추가

### 🚫 Breaking Changes
- CSS 수동 임포트가 더 이상 필요하지 않음 (이전 버전 사용자는 CSS import 코드 제거 권장)

### 📖 Migration Guide
```javascript
// v2.0.7 이전 (더 이상 필요 없음)
import 'api-mock-gui/dist/styles.css'; // ❌ 제거
import 'api-mock-gui/auto';

// v2.0.8+ (권장)
import 'api-mock-gui/auto'; // ✅ 이것만으로 충분
```

## [2.0.7] - 2025-05-30

### 🚀 Major Enhancement
- **BREAKING IMPROVEMENT**: Automatic interception of ALL axios instances (default + created)
- **Zero Configuration**: Now truly works with any axios setup without additional configuration
- **Smart Instance Tracking**: Automatically tracks `axios.create()` instances
- **Universal Coverage**: Both existing and future axios instances are automatically mocked

### 🔧 Technical Improvements
- **Enhanced MockServer**: Overrides `axios.create`