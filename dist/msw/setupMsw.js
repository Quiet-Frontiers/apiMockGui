/**
 * MSW Service Worker 파일을 public 폴더에 복사하는 함수
 * 개발자가 프로젝트에서 한 번만 실행하면 됩니다.
 */
export async function setupMswServiceWorker(publicDir = './public') {
    try {
        // 이 함수는 개발자가 수동으로 MSW service worker를 설정할 때 참고용
        console.log(`
🎭 MSW Service Worker 설정 안내:

1. 다음 명령어를 실행하여 service worker 파일을 복사하세요:
   npx msw init ${publicDir} --save

2. 또는 수동으로 다음 내용을 ${publicDir}/mockServiceWorker.js 파일로 저장하세요:
   https://github.com/mswjs/msw/blob/main/packages/cli/src/init/mockServiceWorker.js

3. 브라우저에서 MSW가 정상적으로 작동하는지 확인하세요.
    `);
    }
    catch (error) {
        console.error('MSW Service Worker 설정 중 오류가 발생했습니다:', error);
        throw error;
    }
}
/**
 * API 설정을 검증하는 함수
 */
export function validateApiConfig(apis) {
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
export const mswHelpers = {
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
     * localStorage에서 설정 로드
     */
    loadConfigFromLocalStorage: (key = 'api-mock-config') => {
        try {
            const stored = localStorage.getItem(key);
            return stored ? JSON.parse(stored) : [];
        }
        catch (error) {
            console.error('localStorage에서 설정 로드 실패:', error);
            return [];
        }
    },
    /**
     * localStorage에 설정 저장
     */
    saveConfigToLocalStorage: (apis, key = 'api-mock-config') => {
        try {
            localStorage.setItem(key, JSON.stringify(apis));
        }
        catch (error) {
            console.error('localStorage에 설정 저장 실패:', error);
            throw error;
        }
    },
    /**
     * 서버 설정 생성 도우미
     */
    createServerConfig: (options) => {
        return {
            baseUrl: options.baseUrl,
            environment: options.environment || (typeof window !== 'undefined' ? 'browser' : 'node'),
            onUnhandledRequest: options.development ? 'warn' : 'bypass'
        };
    }
};
/**
 * 간편 사용을 위한 프리셋
 */
export const presets = {
    /**
     * 개발 환경용 기본 설정
     */
    development: {
        serverConfig: {
            environment: 'browser',
            onUnhandledRequest: 'warn'
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
            environment: 'node',
            onUnhandledRequest: 'error'
        },
        autoStart: true,
        enableExport: false,
        enableImport: false
    }
};
