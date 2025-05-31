import { MockApi, MockServerConfig, MockServerInstance } from '../types';
export declare class MockServer implements MockServerInstance {
    private mockAdapter;
    private config;
    isRunning: boolean;
    private handlerCount;
    private hasBeenStarted;
    private trackedInstances;
    constructor(config?: MockServerConfig);
    private interceptAxiosCreate;
    private applyMockToInstance;
    start(): Promise<void>;
    stop(): Promise<void>;
    updateHandlers(apis: MockApi[]): void;
    private createHandlers;
    private createHandlersForAdapter;
    private buildFullPath;
    private getEnabledApiCount;
    getHandlerCount(): number;
    getConfig(): MockServerConfig;
}
export declare function createMockServer(config?: MockServerConfig): MockServer;
export declare function getGlobalMockServer(config?: MockServerConfig): MockServer;
