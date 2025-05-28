import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { mockHelpers } from '../mock/setupMsw';
export const useMockApiStore = (initialApis = []) => {
    const [apis, setApis] = useState(initialApis);
    // API 변경 시 자동 저장 함수
    const saveToFile = useCallback(async (updatedApis) => {
        try {
            await mockHelpers.saveConfigToFile(updatedApis, 'public/api-config.json');
        }
        catch (error) {
            console.warn('자동 저장 실패:', error);
        }
    }, []);
    const addApi = useCallback((apiData) => {
        const id = uuidv4();
        const now = new Date().toISOString();
        const newApi = {
            ...apiData,
            id,
            createdAt: now,
            updatedAt: now
        };
        setApis((prev) => {
            const updatedApis = [...prev, newApi];
            // 비동기로 파일 저장
            saveToFile(updatedApis);
            return updatedApis;
        });
        return id;
    }, [saveToFile]);
    const updateApi = useCallback((id, updates) => {
        setApis((prev) => {
            const updatedApis = prev.map((api) => api.id === id
                ? { ...api, ...updates, updatedAt: new Date().toISOString() }
                : api);
            // 비동기로 파일 저장
            saveToFile(updatedApis);
            return updatedApis;
        });
    }, [saveToFile]);
    const deleteApi = useCallback((id) => {
        setApis((prev) => {
            const updatedApis = prev.filter((api) => api.id !== id);
            // 비동기로 파일 저장
            saveToFile(updatedApis);
            return updatedApis;
        });
    }, [saveToFile]);
    const addCase = useCallback((apiId, caseData) => {
        const caseId = uuidv4();
        const newCase = {
            ...caseData,
            id: caseId
        };
        setApis((prev) => {
            const updatedApis = prev.map((api) => api.id === apiId
                ? {
                    ...api,
                    cases: [...api.cases, newCase],
                    updatedAt: new Date().toISOString()
                }
                : api);
            // 비동기로 파일 저장
            saveToFile(updatedApis);
            return updatedApis;
        });
        return caseId;
    }, [saveToFile]);
    const updateCase = useCallback((apiId, caseId, updates) => {
        setApis((prev) => {
            const updatedApis = prev.map((api) => api.id === apiId
                ? {
                    ...api,
                    cases: api.cases.map((c) => c.id === caseId ? { ...c, ...updates } : c),
                    updatedAt: new Date().toISOString()
                }
                : api);
            // 비동기로 파일 저장
            saveToFile(updatedApis);
            return updatedApis;
        });
    }, [saveToFile]);
    const deleteCase = useCallback((apiId, caseId) => {
        setApis((prev) => {
            const updatedApis = prev.map((api) => api.id === apiId
                ? {
                    ...api,
                    cases: api.cases.filter((c) => c.id !== caseId),
                    activeCase: api.activeCase === caseId ? undefined : api.activeCase,
                    updatedAt: new Date().toISOString()
                }
                : api);
            // 비동기로 파일 저장
            saveToFile(updatedApis);
            return updatedApis;
        });
    }, [saveToFile]);
    const setActiveCase = useCallback((apiId, caseId) => {
        setApis((prev) => {
            const updatedApis = prev.map((api) => api.id === apiId
                ? { ...api, activeCase: caseId, updatedAt: new Date().toISOString() }
                : api);
            // 비동기로 파일 저장
            saveToFile(updatedApis);
            return updatedApis;
        });
    }, [saveToFile]);
    const exportConfig = useCallback(() => {
        return JSON.stringify(apis, null, 2);
    }, [apis]);
    const importConfig = useCallback((config) => {
        try {
            const importedApis = JSON.parse(config);
            setApis(importedApis);
        }
        catch (error) {
            console.error('Failed to import config:', error);
            throw new Error('Invalid configuration format');
        }
    }, []);
    return {
        apis,
        addApi,
        updateApi,
        deleteApi,
        addCase,
        updateCase,
        deleteCase,
        setActiveCase,
        exportConfig,
        importConfig
    };
};
