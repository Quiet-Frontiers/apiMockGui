# 🎭 API Mock GUI - 프로젝트 구조 다이어그램

## 📁 전체 프로젝트 구조

```
🎭 API Mock GUI Library Project
├── 📦 api-mock-gui/ (라이브러리)
│   ├── 📂 src/
│   │   ├── 📂 components/
│   │   │   ├── 🧩 ApiMockGui.tsx           # 기본 GUI 컴포넌트
│   │   │   ├── 🧩 ApiList.tsx              # API 목록 관리
│   │   │   ├── 🧩 ApiEditor.tsx            # API 편집기
│   │   │   ├── 🧩 ResponseCaseEditor.tsx   # 응답 케이스 편집
│   │   │   ├── 🎮 ApiMockManager.tsx       # Mock Adapter 통합 매니저
│   │   │   ├── 🎈 FloatingApiMockManager.tsx # 플로팅 버튼 모드
│   │   │   ├── 🪟 PopupApiMockManager.tsx    # 팝업 창 모드
│   │   │   └── 🚀 AutoApiMockInit.tsx       # 자동 초기화
│   │   ├── 📂 hooks/
│   │   │   └── 🎣 useMockApiStore.ts       # 상태 관리 훅
│   │   ├── 📂 mock/
│   │   │   ├── ⚙️ mockServer.ts           # axios-mock-adapter 서버
│   │   │   └── 🔧 setupMsw.ts             # Mock 설정 헬퍼
│   │   ├── 📂 styles/
│   │   │   └── 🎨 globals.css             # Tailwind CSS
│   │   ├── 📂 types/
│   │   │   └── 📝 index.ts                # TypeScript 타입들
│   │   ├── 📄 index.ts                    # 메인 export
│   │   └── 🚀 auto.ts                     # 자동 초기화 entry
│   ├── 📂 dist/ (빌드 결과물)
│   │   ├── 📄 index.js                    # 메인 라이브러리
│   │   ├── 🚀 auto.js                     # 자동 초기화
│   │   ├── 📄 index.d.ts                  # 타입 정의
│   │   └── 🎨 styles.css                  # 컴파일된 CSS
│   ├── 📄 package.json                    # 패키지 설정
│   ├── 📄 tsconfig.json                   # TypeScript 설정
│   └── 📄 README.md                       # 문서
│
└── 🧪 api-mock-test/ (테스트 프로젝트)
    ├── 📂 src/
    │   ├── 📄 App.tsx                     # 테스트 앱
    │   └── 📄 index.tsx                   # 진입점
    ├── 📂 public/
    └── 📄 package.json                    # 테스트 프로젝트 설정
```

## 🏗️ 아키텍처 다이어그램

```plantuml
@startuml Architecture
!define RECTANGLE class
!define COMPONENT component

package "🎭 API Mock GUI Library" as LIBRARY {
  package "🚀 Entry Points" as ENTRY {
    [🚀 auto.ts\n자동 초기화] as AUTO
    [📄 index.ts\n메인 라이브러리] as MAIN
  }

  package "🧩 Core Components" as CORE {
    [🚀 AutoApiMockInit\n자동 초기화 로직] as AUTOINIT
    [🪟 PopupApiMockManager\n팝업 창 모드] as POPUP
    [🎈 FloatingApiMockManager\n플로팅 패널 모드] as FLOATING
    [🎮 ApiMockManager\nMock Adapter 통합 매니저] as MANAGER
    [🧩 ApiMockGui\n기본 GUI 컴포넌트] as GUI
  }

  package "🎨 UI Components" as UI {
    [📋 ApiList\nAPI 목록 관리] as LIST
    [✏️ ApiEditor\nAPI 편집기] as EDITOR
    [📝 ResponseCaseEditor\n케이스 편집] as CASE
  }

  package "🔧 Core Logic" as LOGIC {
    [🎣 useMockApiStore\n상태 관리 훅] as STORE
    [⚙️ MockServer\naxios-mock-adapter] as MOCK_SERVER
    [🔧 mockHelpers\nMock 설정 도구] as HELPERS
  }
}

package "🌐 Browser Environment" as BROWSER {
  [📡 Axios Instance\nHTTP 클라이언트] as AXIOS
  [🌐 DOM\n애플리케이션] as DOM
}

package "📡 Network Layer" as NETWORK {
  [📡 HTTP Requests\nAPI 호출] as HTTP
  [🎭 Mock Responses\n가짜 응답] as MOCK
}

' Entry Points 연결
AUTO --> AUTOINIT
MAIN --> POPUP
MAIN --> FLOATING
MAIN --> MANAGER
MAIN --> GUI

' Component 연결
AUTOINIT --> DOM
POPUP --> GUI
FLOATING --> GUI
MANAGER --> GUI

' UI Component 연결
GUI --> LIST
GUI --> EDITOR
LIST --> CASE
EDITOR --> CASE

' Core Logic 연결
GUI --> STORE
MANAGER --> MOCK_SERVER
POPUP --> MOCK_SERVER
FLOATING --> MOCK_SERVER
MOCK_SERVER --> HELPERS

' Network 연결
MOCK_SERVER --> AXIOS
AXIOS --> HTTP
HTTP --> MOCK
MOCK --> DOM

@enduml
```

## 🎮 사용 패턴 다이어그램

```plantuml
@startuml UsagePatterns
!define USAGE_COLOR #E1F5FE
!define DISPLAY_COLOR #F3E5F5  
!define CONTROL_COLOR #E8F5E8

package "💻 개발자 사용 방식" USAGE_COLOR {
  [🎯 자동 모드\nimport 'api-mock-gui/auto'] as AUTO_MODE
  [🎮 수동 모드\ninitAutoApiMock()] as MANUAL_MODE
  [🧩 컴포넌트 모드\n<PopupApiMockManager />] as COMPONENT_MODE
  [🎈 플로팅 모드\n<FloatingApiMockManager />] as FLOATING_MODE
  [📦 인라인 모드\n<ApiMockManager />] as INLINE_MODE
}

package "🖥️ 화면 표시" DISPLAY_COLOR {
  [🎈 Floating Button\n우측 하단 버튼] as FLOAT_BTN
  [🪟 Popup Window\n별도 창] as POPUP_WIN
  [📱 Draggable Panel\n드래그 가능 패널] as DRAG_PANEL
  [📄 Inline GUI\n페이지 내 통합] as INLINE_GUI
}

package "⚙️ Mock Adapter 제어" CONTROL_COLOR {
  [🟢 서버 시작\nMock 활성화] as START_SERVER
  [📝 설정 변경\nAPI 엔드포인트 관리] as CONFIG_CHANGE
  [🔴 서버 중지\nMock 비활성화] as STOP_SERVER
}

AUTO_MODE --> FLOAT_BTN
MANUAL_MODE --> FLOAT_BTN
COMPONENT_MODE --> POPUP_WIN
FLOATING_MODE --> DRAG_PANEL
INLINE_MODE --> INLINE_GUI

FLOAT_BTN --> POPUP_WIN
POPUP_WIN --> START_SERVER
DRAG_PANEL --> START_SERVER
INLINE_GUI --> START_SERVER

START_SERVER --> CONFIG_CHANGE
CONFIG_CHANGE --> STOP_SERVER

@enduml
```

## 🔄 데이터 플로우

```plantuml
@startuml DataFlow
participant "👨‍💻 개발자" as Dev
participant "🌐 애플리케이션" as App  
participant "🎭 Mock GUI" as GUI
participant "⚙️ Mock Server" as MOCK_SERVER
participant "📡 Axios Instance" as AXIOS
participant "🌐 실제 API" as API

Dev -> App: import 'api-mock-gui/auto'
App -> GUI: 자동 초기화
GUI -> MOCK_SERVER: 서버 인스턴스 생성
GUI -> App: Floating Button 표시

Dev -> GUI: 버튼 클릭
GUI -> GUI: 팝업 창 열기
Dev -> GUI: API 엔드포인트 설정
GUI -> MOCK_SERVER: 핸들러 업데이트
MOCK_SERVER -> AXIOS: Mock Adapter 설정

App -> AXIOS: HTTP 요청 발생
AXIOS -> MOCK_SERVER: 요청 가로채기

alt Mock이 설정된 경우
    MOCK_SERVER -> AXIOS: Mock 응답 반환
    AXIOS -> App: Mock 데이터 전달
else Mock이 없는 경우
    AXIOS -> API: 실제 요청 전달
    API -> AXIOS: 실제 응답
    AXIOS -> App: 실제 데이터 전달
end

@enduml
```

## 📦 빌드 및 배포 구조

```plantuml
@startuml BuildDeploy
!define DEV_COLOR #FFF3E0
!define BUILD_COLOR #E3F2FD
!define DEPLOY_COLOR #E8F5E8
!define USER_COLOR #FCE4EC

package "🛠️ 개발 환경" DEV_COLOR {
  folder "📂 src" as SRC {
    [📄 TypeScript 소스] as TS_SRC
  }
  [⚙️ TypeScript 컴파일러] as TS_COMPILER
  [🎨 Tailwind CSS 처리] as TW_CSS
}

package "📦 빌드 결과" BUILD_COLOR {
  folder "📂 dist" as DIST {
    [📄 index.js\n메인 라이브러리] as INDEX_JS
    [🚀 auto.js\n자동 초기화] as AUTO_JS
    [📝 index.d.ts\n타입 정의] as TYPES_DTS
    [🎨 styles.css\n스타일시트] as STYLES_CSS
  }
}

package "🚀 배포" DEPLOY_COLOR {
  [📦 npm package\napi-mock-gui] as NPM_PKG
  [🌐 CDN\n(optional)] as CDN
}

package "👥 사용자 프로젝트" USER_COLOR {
  [📥 npm install\napi-mock-gui] as INSTALL
  [📝 import\n'api-mock-gui/auto'] as IMPORT
  [🎮 사용\nFloating Button] as USE
}

TS_SRC --> TS_COMPILER
TS_SRC --> TW_CSS
TS_COMPILER --> INDEX_JS
TS_COMPILER --> AUTO_JS
TS_COMPILER --> TYPES_DTS
TW_CSS --> STYLES_CSS

INDEX_JS --> DIST
AUTO_JS --> DIST
TYPES_DTS --> DIST
STYLES_CSS --> DIST

DIST --> NPM_PKG
NPM_PKG --> CDN

NPM_PKG --> INSTALL
INSTALL --> IMPORT
IMPORT --> USE

@enduml
```

## 🧩 컴포넌트 관계도

```plantuml
@startuml ComponentDependency
!define ENTRY_COLOR #E3F2FD
!define MANAGER_COLOR #F3E5F5
!define UI_COLOR #E8F5E8
!define LOGIC_COLOR #FFF3E0

package "🎯 Entry Points" ENTRY_COLOR {
  [auto.ts] as AUTO_ENTRY
  [index.ts] as MAIN_ENTRY
}

package "🎮 Manager Components" MANAGER_COLOR {
  [AutoApiMockInit] as AUTO_INIT
  [PopupApiMockManager] as POPUP_MGR
  [FloatingApiMockManager] as FLOAT_MGR
  [ApiMockManager] as API_MGR
}

package "🧩 UI Components" UI_COLOR {
  [ApiMockGui] as API_GUI
  [ApiList] as API_LIST
  [ApiEditor] as API_EDITOR
  [ResponseCaseEditor] as CASE_EDITOR
}

package "🔧 Core Logic" LOGIC_COLOR {
  [useMockApiStore] as STORE
  [MockServer] as MOCK_SERVER
  [mockHelpers] as MOCK_HELPERS
}

AUTO_ENTRY --> AUTO_INIT
MAIN_ENTRY --> POPUP_MGR
MAIN_ENTRY --> FLOAT_MGR
MAIN_ENTRY --> API_MGR
MAIN_ENTRY --> API_GUI

AUTO_INIT --> POPUP_MGR
POPUP_MGR --> API_GUI
FLOAT_MGR --> API_GUI
API_MGR --> API_GUI

API_GUI --> API_LIST
API_GUI --> API_EDITOR
API_LIST --> CASE_EDITOR
API_EDITOR --> CASE_EDITOR

API_GUI --> STORE
API_MGR --> MOCK_SERVER
POPUP_MGR --> MOCK_SERVER
FLOAT_MGR --> MOCK_SERVER

MOCK_SERVER --> MOCK_HELPERS

@enduml
```

## 🌟 주요 특징 요약

| 특징 | 설명 | 구현 컴포넌트 |
|------|------|---------------|
| 🎯 **One-Line Import** | `import 'api-mock-gui/auto'` 한 줄로 활성화 | `auto.ts` + `AutoApiMockInit` |
| 🪟 **팝업 창 모드** | 별도 창에서 GUI 제공, 메인 앱 방해 없음 | `PopupApiMockManager` |
| 🎈 **플로팅 모드** | 드래그 가능한 플로팅 패널 | `FloatingApiMockManager` |
| 📦 **인라인 모드** | 앱 내부에 통합된 GUI | `ApiMockManager` |
| 📡 **axios-mock-adapter 통합** | axios 요청을 직접 가로채어 Mock 응답 제공 | `MockServer` + `mockHelpers` |
| 🔄 **실시간 제어** | 서버 시작/중지 및 설정 변경 | 모든 Manager 컴포넌트 |
| 🎮 **다양한 모드** | 개발 환경에 맞는 유연한 사용법 | 전체 컴포넌트 시스템 |

## 💡 axios-mock-adapter vs MSW 비교

| 측면 | axios-mock-adapter | MSW |
|------|-------------------|-----|
| **설정 복잡도** | 매우 간단 (import만) | 중간 (Service Worker 설정) |
| **지원 범위** | axios 요청만 | 모든 HTTP 요청 |
| **성능** | 매우 빠름 (네트워크 레이어 거치지 않음) | 빠름 (Service Worker 경유) |
| **디버깅** | Console에서만 확인 가능 | Network 탭에서 확인 가능 |
| **호환성** | axios 기반 프로젝트에 최적 | 모든 HTTP 라이브러리 지원 |
| **배포 크기** | 작음 | 중간 |

---

**PlantUML을 사용하여 보다 전문적이고 깔끔한 다이어그램으로 API Mock GUI 라이브러리의 전체 구조와 동작 방식을 시각적으로 보여줍니다. 🎭** 