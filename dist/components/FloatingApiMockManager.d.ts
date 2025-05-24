import React from 'react';
import { ApiMockManagerProps } from '../types';
interface FloatingApiMockManagerProps extends ApiMockManagerProps {
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    buttonText?: string;
    buttonIcon?: React.ReactNode;
    panelWidth?: string;
    panelHeight?: string;
    minimizable?: boolean;
    draggable?: boolean;
}
export declare const FloatingApiMockManager: React.FC<FloatingApiMockManagerProps>;
export {};
