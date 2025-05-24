import React from 'react';
import { MockApi } from '../types';
interface ApiEditorProps {
    api: MockApi | null;
    onSave: (apiData: Omit<MockApi, 'id' | 'createdAt' | 'updatedAt'>) => void;
    onCancel: () => void;
}
export declare const ApiEditor: React.FC<ApiEditorProps>;
export {};
