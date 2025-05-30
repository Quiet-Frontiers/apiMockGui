"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.presets = exports.mockHelpers = void 0;
exports.setupAxiosMockAdapter = setupAxiosMockAdapter;
exports.validateApiConfig = validateApiConfig;
/**
 * axios-mock-adapter 설정 안내 함수
 * 개발자가 프로젝트에서 참고할 수 있는 정보를 제공합니다.
 */
async function setupAxiosMockAdapter() {
    try {
        console.log(`
🎭 axios-mock-adapter 설정 안내:

1. axios와 axios-mock-adapter가 이미 설치되어 있습니다.
   
2. MockServer 클래스가 자동으로 axios-mock-adapter를 설정합니다.

3. 별도의 Service Worker 파일이 필요하지 않습니다.

4. 모든 axios 요청이 자동으로 모킹됩니다.
    `);
    }
    catch (error) {
        console.error('axios-mock-adapter 설정 중 오류가 발생했습니다:', error);
        throw error;
    }
}
/**
 * API 설정을 검증하는 함수
 */
function validateApiConfig(apis) {
    const errors = [];
    apis.forEach((api, index) => {
        if (!api.name.trim()) {
            errors.push(`API ${index + 1}: 이름이 필요합니다.`);
        }
        if (!api.path.trim()) {
            errors.push(`API "${api.name}": 경로가 필요합니다.`);
        }
        if (api.cases.length === 0) {
            errors.push(`API "${api.name}": 최소 하나의 응답 케이스가 필요합니다.`);
        }
        const activeCase = api.cases.find(c => c.id === api.activeCase) || api.cases.find(c => c.isActive);
        if (api.isEnabled && !activeCase) {
            errors.push(`API "${api.name}": 활성 케이스가 설정되지 않았습니다.`);
        }
        api.cases.forEach((case_, caseIndex) => {
            if (!case_.name.trim()) {
                errors.push(`API "${api.name}" 케이스 ${caseIndex + 1}: 이름이 필요합니다.`);
            }
            try {
                if (typeof case_.body === 'string') {
                    JSON.parse(case_.body);
                }
            }
            catch {
                errors.push(`API "${api.name}" 케이스 "${case_.name}": 유효하지 않은 JSON 형식입니다.`);
            }
        });
    });
    return {
        isValid: errors.length === 0,
        errors
    };
}
/**
 * 개발자를 위한 도우미 함수들
 */
exports.mockHelpers = {
    /**
     * 설정 파일에서 API 로드
     */
    loadConfigFromFile: async (configPath) => {
        try {
            const response = await fetch(configPath);
            if (!response.ok) {
                throw new Error(`Failed to load config from ${configPath}`);
            }
            const config = await response.json();
            return Array.isArray(config) ? config : config.apis || [];
        }
        catch (error) {
            console.error('설정 파일 로드 실패:', error);
            throw error;
        }
    },
    /**
     * JSON 파일에 설정 자동 저장 (개발 환경용)
     */
    saveConfigToFile: async (apis, filePath = '/api-config.json') => {
        try {
            // 브라우저 환경에서는 파일 시스템에 직접 쓸 수 없으므로
            // 개발 서버를 통한 API 엔드포인트가 필요합니다
            if (typeof window !== 'undefined') {
                // 개발 환경에서만 작동
                const response = await fetch('/api/save-config', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        filePath,
                        config: apis
                    })
                });
                if (!response.ok) {
                    // API 엔드포인트가 없는 경우 자동 다운로드로 대체
                    console.warn('자동 저장 API가 없습니다. 수동 Export를 사용하세요.');
                    return;
                }
            }
        }
        catch (error) {
            console.warn('JSON 파일 자동 저장 실패:', error);
            // 에러가 발생해도 앱이 중단되지 않도록 warning만 출력
        }
    },
    /**
     * 서버 설정 생성 도우미
     */
    createServerConfig: (options) => {
        return {
            baseUrl: options.baseUrl,
            environment: options.environment || 'browser',
            onUnhandledRequest: options.development ? 'warn' : 'bypass'
        };
    }
};
/**
 * 간편 사용을 위한 프리셋
 */
exports.presets = {
    /**
     * 개발 환경용 기본 설정
     */
    development: {
        serverConfig: {
            environment: 'browser',
            onUnhandledRequest: 'bypass'
        },
        autoStart: true,
        enableExport: true,
        enableImport: true
    },
    /**
     * 프로덕션 환경용 설정
     */
    production: {
        serverConfig: {
            environment: 'browser',
            onUnhandledRequest: 'bypass'
        },
        autoStart: false,
        enableExport: false,
        enableImport: false
    },
    /**
     * 테스트 환경용 설정
     */
    testing: {
        serverConfig: {
            environment: 'browser',
            onUnhandledRequest: 'bypass'
        },
        autoStart: true,
        enableExport: false,
        enableImport: false
    }
};
