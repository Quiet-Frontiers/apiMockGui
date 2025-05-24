import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { MockApi, MockResponseCase, MockApiStore } from '../types';

export const useMockApiStore = (initialApis: MockApi[] = []): MockApiStore => {
  const [apis, setApis] = useState<MockApi[]>(initialApis);

  const addApi = useCallback((apiData: Omit<MockApi, 'id' | 'createdAt' | 'updatedAt'>): string => {
    const id = uuidv4();
    const now = new Date().toISOString();
    
    const newApi: MockApi = {
      ...apiData,
      id,
      createdAt: now,
      updatedAt: now
    };

    setApis((prev: MockApi[]) => [...prev, newApi]);
    return id;
  }, []);

  const updateApi = useCallback((id: string, updates: Partial<MockApi>) => {
    setApis((prev: MockApi[]) => prev.map((api: MockApi) => 
      api.id === id 
        ? { ...api, ...updates, updatedAt: new Date().toISOString() }
        : api
    ));
  }, []);

  const deleteApi = useCallback((id: string) => {
    setApis((prev: MockApi[]) => prev.filter((api: MockApi) => api.id !== id));
  }, []);

  const addCase = useCallback((apiId: string, caseData: Omit<MockResponseCase, 'id'>): string => {
    const caseId = uuidv4();
    const newCase: MockResponseCase = {
      ...caseData,
      id: caseId
    };

    setApis((prev: MockApi[]) => prev.map((api: MockApi) => 
      api.id === apiId 
        ? { 
            ...api, 
            cases: [...api.cases, newCase],
            updatedAt: new Date().toISOString()
          }
        : api
    ));
    
    return caseId;
  }, []);

  const updateCase = useCallback((apiId: string, caseId: string, updates: Partial<MockResponseCase>) => {
    setApis((prev: MockApi[]) => prev.map((api: MockApi) => 
      api.id === apiId 
        ? {
            ...api,
            cases: api.cases.map((c: MockResponseCase) => 
              c.id === caseId ? { ...c, ...updates } : c
            ),
            updatedAt: new Date().toISOString()
          }
        : api
    ));
  }, []);

  const deleteCase = useCallback((apiId: string, caseId: string) => {
    setApis((prev: MockApi[]) => prev.map((api: MockApi) => 
      api.id === apiId 
        ? {
            ...api,
            cases: api.cases.filter((c: MockResponseCase) => c.id !== caseId),
            activeCase: api.activeCase === caseId ? undefined : api.activeCase,
            updatedAt: new Date().toISOString()
          }
        : api
    ));
  }, []);

  const setActiveCase = useCallback((apiId: string, caseId: string) => {
    setApis((prev: MockApi[]) => prev.map((api: MockApi) => 
      api.id === apiId 
        ? { ...api, activeCase: caseId, updatedAt: new Date().toISOString() }
        : api
    ));
  }, []);

  const exportConfig = useCallback(() => {
    return JSON.stringify(apis, null, 2);
  }, [apis]);

  const importConfig = useCallback((config: string) => {
    try {
      const importedApis = JSON.parse(config) as MockApi[];
      setApis(importedApis);
    } catch (error) {
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