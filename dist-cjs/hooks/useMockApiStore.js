"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMockApiStore = void 0;
const react_1 = require("react");
const uuid_1 = require("uuid");
const setupMsw_1 = require("../mock/setupMsw");
const useMockApiStore = (initialApis = []) => {
    const [apis, setApis] = (0, react_1.useState)(initialApis);
    // API 변경 시 자동 저장 함수
    const saveToFile = (0, react_1.useCallback)(async (updatedApis) => {
        try {
            await setupMsw_1.mockHelpers.saveConfigToFile(updatedApis, 'public/api-config.json');
        }
        catch (error) {
            console.warn('자동 저장 실패:', error);
        }
    }, []);
    const addApi = (0, react_1.useCallback)((apiData) => {
        const id = (0, uuid_1.v4)();
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
    const updateApi = (0, react_1.useCallback)((id, updates) => {
        setApis((prev) => {
            const updatedApis = prev.map((api) => api.id === id
                ? { ...api, ...updates, updatedAt: new Date().toISOString() }
                : api);
            // 비동기로 파일 저장
            saveToFile(updatedApis);
            return updatedApis;
        });
    }, [saveToFile]);
    const deleteApi = (0, react_1.useCallback)((id) => {
        setApis((prev) => {
            const updatedApis = prev.filter((api) => api.id !== id);
            // 비동기로 파일 저장
            saveToFile(updatedApis);
            return updatedApis;
        });
    }, [saveToFile]);
    const addCase = (0, react_1.useCallback)((apiId, caseData) => {
        const caseId = (0, uuid_1.v4)();
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
    const updateCase = (0, react_1.useCallback)((apiId, caseId, updates) => {
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
    const deleteCase = (0, react_1.useCallback)((apiId, caseId) => {
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
    const setActiveCase = (0, react_1.useCallback)((apiId, caseId) => {
        setApis((prev) => {
            const updatedApis = prev.map((api) => api.id === apiId
                ? { ...api, activeCase: caseId, updatedAt: new Date().toISOString() }
                : api);
            // 비동기로 파일 저장
            saveToFile(updatedApis);
            return updatedApis;
        });
    }, [saveToFile]);
    const exportConfig = (0, react_1.useCallback)(() => {
        return JSON.stringify(apis, null, 2);
    }, [apis]);
    const importConfig = (0, react_1.useCallback)((config) => {
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
exports.useMockApiStore = useMockApiStore;
