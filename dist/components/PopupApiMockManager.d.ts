import React from 'react';
import { ApiMockManagerProps, MockApi } from '../types';
interface PopupApiMockManagerProps extends Omit<ApiMockManagerProps, 'onConfigChange'> {
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    buttonText?: string;
    buttonIcon?: React.ReactNode;
    popupWidth?: number;
    popupHeight?: number;
    autoShow?: boolean;
    onConfigChange?: (apis: MockApi[]) => void;
}
export declare const PopupApiMockManager: React.FC<PopupApiMockManagerProps>;
export {};
