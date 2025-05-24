import { MockApi, MockServerConfig } from '../types';
/**
 * MSW Service Worker 파일을 public 폴더에 복사하는 함수
 * 개발자가 프로젝트에서 한 번만 실행하면 됩니다.
 */
export declare function setupMswServiceWorker(publicDir?: string): Promise<void>;
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
export declare const mswHelpers: {
    /**
     * 설정 파일에서 API 로드
     */
    loadConfigFromFile: (configPath: string) => Promise<MockApi[]>;
    /**
     * localStorage에서 설정 로드
     */
    loadConfigFromLocalStorage: (key?: string) => MockApi[];
    /**
     * localStorage에 설정 저장
     */
    saveConfigToLocalStorage: (apis: MockApi[], key?: string) => void;
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
            onUnhandledRequest: "warn";
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
            environment: "node";
            onUnhandledRequest: "error";
        };
        autoStart: boolean;
        enableExport: boolean;
        enableImport: boolean;
    };
};
