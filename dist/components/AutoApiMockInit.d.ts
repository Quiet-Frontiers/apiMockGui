import React from 'react';
interface AutoApiMockInitProps {
    baseUrl?: string;
    environment?: 'browser' | 'node';
    development?: boolean;
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    buttonText?: string;
    autoStart?: boolean;
    disabled?: boolean;
}
export declare const AutoApiMockInit: React.FC<AutoApiMockInitProps>;
export declare const initAutoApiMock: (options?: AutoApiMockInitProps) => void;
export declare const cleanupAutoApiMock: () => void;
export {};
