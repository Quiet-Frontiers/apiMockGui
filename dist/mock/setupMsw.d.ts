import { MockApi, MockServerConfig } from '../types';
/**
 * axios-mock-adapter 설정 안내 함수
 * 개발자가 프로젝트에서 참고할 수 있는 정보를 제공합니다.
 */
export declare function setupAxiosMockAdapter(): Promise<void>;
/**
 * API 설정을 검증하는 함수
 */
export declare function validateApiConfig(apis: MockApi[]): {
    isValid: boolean;
    errors: string[];
};
/**
 * 개발자를 위한 도우미 함수들
 */
export declare const mockHelpers: {
    /**
     * 설정 파일에서 API 로드
     */
    loadConfigFromFile: (configPath: string) => Promise<MockApi[]>;
    /**
     * JSON 파일에 설정 자동 저장 (개발 환경용)
     */
    saveConfigToFile: (apis: MockApi[], filePath?: string) => Promise<void>;
    /**
     * 서버 설정 생성 도우미
     */
    createServerConfig: (options: {
        baseUrl?: string;
        environment?: "browser" | "node";
        development?: boolean;
    }) => MockServerConfig;
};
/**
 * 간편 사용을 위한 프리셋
 */
export declare const presets: {
    /**
     * 개발 환경용 기본 설정
     */
    development: {
        serverConfig: {
            environment: "browser";
            onUnhandledRequest: "bypass";
        };
        autoStart: boolean;
        enableExport: boolean;
        enableImport: boolean;
    };
    /**
     * 프로덕션 환경용 설정
     */
    production: {
        serverConfig: {
            environment: "browser";
            onUnhandledRequest: "bypass";
        };
        autoStart: boolean;
        enableExport: boolean;
        enableImport: boolean;
    };
    /**
     * 테스트 환경용 설정
     */
    testing: {
        serverConfig: {
            environment: "browser";
            onUnhandledRequest: "bypass";
        };
        autoStart: boolean;
        enableExport: boolean;
        enableImport: boolean;
    };
};
