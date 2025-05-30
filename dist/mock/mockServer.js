import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
export class MockServer {
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
        Object.defineProperty(this, "handlerCount", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "hasBeenStarted", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        }); // 한 번이라도 시작된 적이 있는지 추적
        this.config = {
            environment: 'browser',
            onUnhandledRequest: 'bypass',
            ...config
        };
        console.log('🎭 MockServer 인스턴스가 생성되었습니다.');
    }
    async start() {
        if (this.isRunning) {
            console.warn('🔄 Mock server가 이미 실행 중입니다.');
            return;
        }
        try {
            // axios-mock-adapter 인스턴스 생성
            this.mockAdapter = new MockAdapter(axios, {
                delayResponse: 0,
                onNoMatch: this.config.onUnhandledRequest === 'bypass' ? 'passthrough' : 'throwException'
            });
            this.isRunning = true;
            this.hasBeenStarted = true; // 시작됨을 표시
            console.log('✅ Mock server가 성공적으로 시작되었습니다 (axios-mock-adapter 사용)');
        }
        catch (error) {
            console.error('❌ Mock server 시작 실패:', error);
            throw error;
        }
    }
    async stop() {
        if (!this.isRunning) {
            console.warn('⚠️  Mock server가 실행되고 있지 않습니다.');
            return;
        }
        try {
            if (this.mockAdapter) {
                this.mockAdapter.restore();
                this.mockAdapter = null;
            }
            this.isRunning = false;
            this.handlerCount = 0;
            console.log('🛑 Mock server가 중지되었습니다.');
        }
        catch (error) {
            console.error('❌ Mock server 중지 실패:', error);
            throw error;
        }
    }
    updateHandlers(apis) {
        if (!this.mockAdapter) {
            if (this.isRunning) {
                console.error('⚠️  Mock adapter가 초기화되지 않았습니다. Mock server를 재시작해 주세요.');
            }
            else if (this.hasBeenStarted) {
                // 한 번 시작된 적이 있었는데 지금 중지된 경우에만 경고
                console.warn('💡 Mock server가 실행되지 않았습니다. 먼저 서버를 시작해 주세요.');
            }
            // 초기 로딩 시에는 아무 메시지도 표시하지 않음
            return;
        }
        // 기존 핸들러 초기화
        this.mockAdapter.reset();
        // 새로운 핸들러 등록
        this.createHandlers(apis);
        this.handlerCount = this.getEnabledApiCount(apis);
        if (this.handlerCount > 0) {
            console.log(`📡 ${this.handlerCount}개의 Mock API 핸들러가 업데이트되었습니다.`);
        }
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
        return this.handlerCount;
    }
    getConfig() {
        return { ...this.config };
    }
}
// 글로벌 인스턴스를 위한 팩토리 함수
let globalMockServer = null;
export function createMockServer(config) {
    return new MockServer(config);
}
export function getGlobalMockServer(config) {
    if (!globalMockServer) {
        globalMockServer = new MockServer(config);
    }
    return globalMockServer;
}
