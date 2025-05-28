// 자동 초기화 - 라이브러리 import 시 자동으로 floating button 생성
import './auto-init';

// 핵심 컴포넌트만 export
export { FloatingApiMockManager } from './components/FloatingApiMockManager';

// 필수 유틸리티
export { useMockApiStore } from './hooks/useMockApiStore';
export { MockServer } from './mock/mockServer';

// 타입 정의
export type {
  HttpMethod,
  HttpStatus,
  MockResponseCase,
  MockApi,
  MockApiStore
} from './types';

// 스타일
import './styles/globals.css'; 