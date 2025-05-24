import { MockApi, MockServerConfig, MockServerInstance } from '../types';
export declare class MockServer implements MockServerInstance {
    private worker;
    private handlers;
    private config;
    isRunning: boolean;
    constructor(config?: MockServerConfig);
    start(): Promise<void>;
    stop(): Promise<void>;
    updateHandlers(apis: MockApi[]): void;
    private createHandlers;
    private buildFullPath;
    getHandlerCount(): number;
    getConfig(): MockServerConfig;
}
export declare function createMockServer(config?: MockServerConfig): MockServer;
export declare function getGlobalMockServer(config?: MockServerConfig): MockServer;
