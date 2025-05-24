import React from 'react';
import { MockApi } from '../types';
interface ApiListProps {
    apis: MockApi[];
    onEditApi: (api: MockApi) => void;
    onDeleteApi: (id: string) => void;
    onToggleApi: (id: string) => void;
    onAddCase: (apiId: string) => void;
    onEditCase: (apiId: string, caseId: string) => void;
    onDeleteCase: (apiId: string, caseId: string) => void;
    onSetActiveCase: (apiId: string, caseId: string) => void;
}
export declare const ApiList: React.FC<ApiListProps>;
export {};
