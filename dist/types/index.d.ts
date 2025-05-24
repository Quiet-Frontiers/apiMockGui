export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD';
export type HttpStatus = 200 | 201 | 400 | 401 | 403 | 404 | 500 | 502 | 503;
export interface MockResponseCase {
    id: string;
    name: string;
    description?: string;
    status: HttpStatus;
    headers?: Record<string, string>;
    body: any;
    delay?: number;
    isActive: boolean;
}
export interface MockApi {
    id: string;
    name: string;
    method: HttpMethod;
    path: string;
    description?: string;
    cases: MockResponseCase[];
    activeCase?: string;
    isEnabled: boolean;
    createdAt: string;
    updatedAt: string;
}
export interface MockApiStore {
    apis: MockApi[];
    addApi: (api: Omit<MockApi, 'id' | 'createdAt' | 'updatedAt'>) => string;
    updateApi: (id: string, updates: Partial<MockApi>) => void;
    deleteApi: (id: string) => void;
    addCase: (apiId: string, responseCase: Omit<MockResponseCase, 'id'>) => string;
    updateCase: (apiId: string, caseId: string, updates: Partial<MockResponseCase>) => void;
    deleteCase: (apiId: string, caseId: string) => void;
    setActiveCase: (apiId: string, caseId: string) => void;
    exportConfig: () => string;
    importConfig: (config: string) => void;
}
export interface ApiMockGuiProps {
    className?: string;
    onConfigChange?: (apis: MockApi[]) => void;
    initialConfig?: MockApi[];
    enableExport?: boolean;
    enableImport?: boolean;
}
export interface MockServerConfig {
    baseUrl?: string;
    environment?: 'browser' | 'node';
    onUnhandledRequest?: 'bypass' | 'warn' | 'error';
}
export interface MockServerInstance {
    start: () => Promise<void>;
    stop: () => Promise<void>;
    updateHandlers: (apis: MockApi[]) => void;
    isRunning: boolean;
}
export interface ApiMockManagerProps extends ApiMockGuiProps {
    serverConfig?: MockServerConfig;
    autoStart?: boolean;
    onServerStart?: () => void;
    onServerStop?: () => void;
}
