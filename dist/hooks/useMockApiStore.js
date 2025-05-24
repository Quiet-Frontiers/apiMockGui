import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
export const useMockApiStore = (initialApis = []) => {
    const [apis, setApis] = useState(initialApis);
    const addApi = useCallback((apiData) => {
        const id = uuidv4();
        const now = new Date().toISOString();
        const newApi = {
            ...apiData,
            id,
            createdAt: now,
            updatedAt: now
        };
        setApis((prev) => [...prev, newApi]);
        return id;
    }, []);
    const updateApi = useCallback((id, updates) => {
        setApis((prev) => prev.map((api) => api.id === id
            ? { ...api, ...updates, updatedAt: new Date().toISOString() }
            : api));
    }, []);
    const deleteApi = useCallback((id) => {
        setApis((prev) => prev.filter((api) => api.id !== id));
    }, []);
    const addCase = useCallback((apiId, caseData) => {
        const caseId = uuidv4();
        const newCase = {
            ...caseData,
            id: caseId
        };
        setApis((prev) => prev.map((api) => api.id === apiId
            ? {
                ...api,
                cases: [...api.cases, newCase],
                updatedAt: new Date().toISOString()
            }
            : api));
        return caseId;
    }, []);
    const updateCase = useCallback((apiId, caseId, updates) => {
        setApis((prev) => prev.map((api) => api.id === apiId
            ? {
                ...api,
                cases: api.cases.map((c) => c.id === caseId ? { ...c, ...updates } : c),
                updatedAt: new Date().toISOString()
            }
            : api));
    }, []);
    const deleteCase = useCallback((apiId, caseId) => {
        setApis((prev) => prev.map((api) => api.id === apiId
            ? {
                ...api,
                cases: api.cases.filter((c) => c.id !== caseId),
                activeCase: api.activeCase === caseId ? undefined : api.activeCase,
                updatedAt: new Date().toISOString()
            }
            : api));
    }, []);
    const setActiveCase = useCallback((apiId, caseId) => {
        setApis((prev) => prev.map((api) => api.id === apiId
            ? { ...api, activeCase: caseId, updatedAt: new Date().toISOString() }
            : api));
    }, []);
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
