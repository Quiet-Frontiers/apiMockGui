import React from 'react';
import { MockApi, MockResponseCase } from '../types';
interface ResponseCaseEditorProps {
    api: MockApi;
    caseId: string | null;
    onSave: (caseData: Omit<MockResponseCase, 'id'>) => void;
    onCancel: () => void;
}
export declare const ResponseCaseEditor: React.FC<ResponseCaseEditorProps>;
export {};
