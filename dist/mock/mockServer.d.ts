import { MockApi, MockServerConfig, MockServerInstance } from '../types';
export declare class MockServer implements MockServerInstance {
    private mockAdapter;
    private config;
    isRunning: boolean;
    private handlerCount;
    constructor(config?: MockServerConfig);
    start(): Promise<void>;
    stop(): Promise<void>;
    updateHandlers(apis: MockApi[]): void;
    private createHandlers;
    private buildFullPath;
    private getEnabledApiCount;
    getHandlerCount(): number;
    getConfig(): MockServerConfig;
}
export declare function createMockServer(config?: MockServerConfig): MockServer;
export declare function getGlobalMockServer(config?: MockServerConfig): MockServer;
