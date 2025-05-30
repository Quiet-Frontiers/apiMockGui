"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockServer = void 0;
exports.createMockServer = createMockServer;
exports.getGlobalMockServer = getGlobalMockServer;
const axios_1 = require("axios");
const axios_mock_adapter_1 = require("axios-mock-adapter");
class MockServer {
    constructor(config = {}) {
        Object.defineProperty(this, "mockAdapter", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "config", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "isRunning", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        this.config = {
            environment: 'browser',
            onUnhandledRequest: 'bypass',
            ...config
        };
    }
    async start() {
        if (this.isRunning) {
            console.warn('Mock server is already running');
            return;
        }
        try {
            // axios-mock-adapter 인스턴스 생성
            this.mockAdapter = new axios_mock_adapter_1.default(axios_1.default, {
                delayResponse: 0,
                onNoMatch: this.config.onUnhandledRequest === 'bypass' ? 'passthrough' : 'throwException'
            });
            this.isRunning = true;
            console.log('🎭 Mock server started successfully (axios-mock-adapter)');
        }
        catch (error) {
            console.error('Failed to start mock server:', error);
            throw error;
        }
    }
    async stop() {
        if (!this.isRunning) {
            console.warn('Mock server is not running');
            return;
        }
        try {
            if (this.mockAdapter) {
                this.mockAdapter.restore();
                this.mockAdapter = null;
            }
            this.isRunning = false;
            console.log('🛑 Mock server stopped');
        }
        catch (error) {
            console.error('Failed to stop mock server:', error);
            throw error;
        }
    }
    updateHandlers(apis) {
        if (!this.mockAdapter) {
            console.warn('Mock adapter is not initialized');
            return;
        }
        // 기존 핸들러 초기화
        this.mockAdapter.reset();
        // 새로운 핸들러 등록
        this.createHandlers(apis);
        console.log(`📡 Updated ${this.getEnabledApiCount(apis)} mock handlers`);
    }
    createHandlers(apis) {
        if (!this.mockAdapter)
            return;
        apis.forEach(api => {
            if (!api.isEnabled)
                return;
            const activeCase = api.cases.find(c => c.id === api.activeCase) || api.cases.find(c => c.isActive);
            if (!activeCase)
                return;
            const fullPath = this.buildFullPath(api.path);
            const method = api.method.toLowerCase();
            // axios-mock-adapter 핸들러 등록
            try {
                switch (method) {
                    case 'get':
                        this.mockAdapter.onGet(fullPath).reply(async () => {
                            if (activeCase.delay && activeCase.delay > 0) {
                                await new Promise(resolve => setTimeout(resolve, activeCase.delay));
                            }
                            return [activeCase.status, activeCase.body, activeCase.headers || {}];
                        });
                        break;
                    case 'post':
                        this.mockAdapter.onPost(fullPath).reply(async () => {
                            if (activeCase.delay && activeCase.delay > 0) {
                                await new Promise(resolve => setTimeout(resolve, activeCase.delay));
                            }
                            return [activeCase.status, activeCase.body, activeCase.headers || {}];
                        });
                        break;
                    case 'put':
                        this.mockAdapter.onPut(fullPath).reply(async () => {
                            if (activeCase.delay && activeCase.delay > 0) {
                                await new Promise(resolve => setTimeout(resolve, activeCase.delay));
                            }
                            return [activeCase.status, activeCase.body, activeCase.headers || {}];
                        });
                        break;
                    case 'delete':
                        this.mockAdapter.onDelete(fullPath).reply(async () => {
                            if (activeCase.delay && activeCase.delay > 0) {
                                await new Promise(resolve => setTimeout(resolve, activeCase.delay));
                            }
                            return [activeCase.status, activeCase.body, activeCase.headers || {}];
                        });
                        break;
                    case 'patch':
                        this.mockAdapter.onPatch(fullPath).reply(async () => {
                            if (activeCase.delay && activeCase.delay > 0) {
                                await new Promise(resolve => setTimeout(resolve, activeCase.delay));
                            }
                            return [activeCase.status, activeCase.body, activeCase.headers || {}];
                        });
                        break;
                    default:
                        console.warn(`Unsupported HTTP method: ${method}`);
                }
            }
            catch (error) {
                console.error(`Failed to register handler for ${method.toUpperCase()} ${fullPath}:`, error);
            }
        });
    }
    buildFullPath(path) {
        const baseUrl = this.config.baseUrl || '';
        let fullPath = baseUrl + path;
        // URL 파라미터를 정규표현식으로 변환 (/api/users/:id -> /api/users/\d+)
        if (fullPath.includes(':')) {
            const regexPath = fullPath.replace(/:[\w]+/g, '\\d+');
            return new RegExp(regexPath);
        }
        return fullPath;
    }
    getEnabledApiCount(apis) {
        return apis.filter(api => api.isEnabled && (api.cases.find(c => c.id === api.activeCase) || api.cases.find(c => c.isActive))).length;
    }
    getHandlerCount() {
        return this.getEnabledApiCount([]);
    }
    getConfig() {
        return { ...this.config };
    }
}
exports.MockServer = MockServer;
// 글로벌 인스턴스를 위한 팩토리 함수
let globalMockServer = null;
function createMockServer(config) {
    return new MockServer(config);
}
function getGlobalMockServer(config) {
    if (!globalMockServer) {
        globalMockServer = new MockServer(config);
    }
    return globalMockServer;
}
