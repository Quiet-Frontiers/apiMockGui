// 이 파일을 import하면 자동으로 floating button이 나타납니다.
// import 'api-mock-gui/auto';
import { initAutoApiMock, cleanupAutoApiMock } from './components/AutoApiMockInit';
// 자동 초기화 실행 (개발 환경에서만)
const isDevelopment = typeof window !== 'undefined' &&
    (window.location.hostname.includes('localhost') ||
        window.location.hostname.includes('127.0.0.1') ||
        window.location.hostname.includes('192.168.') ||
        window.location.port !== '');
if (isDevelopment) {
    initAutoApiMock({
        development: true,
        autoStart: true,
        position: 'bottom-right',
        buttonText: 'API Mock'
    });
    console.log('🎭 API Mock GUI Auto Mode가 활성화되었습니다!');
    console.log('💡 우측 하단의 floating button을 클릭하여 사용하세요.');
}
else {
    console.log('🔒 API Mock GUI Auto Mode는 개발 환경에서만 활성화됩니다.');
    console.log('💡 수동으로 활성화하려면 다음 코드를 사용하세요:');
    console.log('   import { initAutoApiMock } from "api-mock-gui"; initAutoApiMock();');
}
// 수동 제어를 위한 전역 함수 추가
if (typeof window !== 'undefined') {
    window.apiMockGuiInit = initAutoApiMock;
    window.apiMockGuiCleanup = cleanupAutoApiMock;
}
