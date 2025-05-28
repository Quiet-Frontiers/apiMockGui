import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { MockApi, MockResponseCase, MockApiStore } from '../types';
import { mockHelpers } from '../mock/setupMsw';

export const useMockApiStore = (initialApis: MockApi[] = []): MockApiStore => {
  const [apis, setApis] = useState<MockApi[]>(initialApis);

  // API 변경 시 자동 저장 함수
  const saveToFile = useCallback(async (updatedApis: MockApi[]) => {
    try {
      await mockHelpers.saveConfigToFile(updatedApis, 'public/api-config.json');
    } catch (error) {
      console.warn('자동 저장 실패:', error);
    }
  }, []);

  const addApi = useCallback((apiData: Omit<MockApi, 'id' | 'createdAt' | 'updatedAt'>): string => {
    const id = uuidv4();
    const now = new Date().toISOString();
    
    const newApi: MockApi = {
      ...apiData,
      id,
      createdAt: now,
      updatedAt: now
    };

    setApis((prev: MockApi[]) => {
      const updatedApis = [...prev, newApi];
      // 비동기로 파일 저장
      saveToFile(updatedApis);
      return updatedApis;
    });
    return id;
  }, [saveToFile]);

  const updateApi = useCallback((id: string, updates: Partial<MockApi>) => {
    setApis((prev: MockApi[]) => {
      const updatedApis = prev.map((api: MockApi) => 
        api.id === id 
          ? { ...api, ...updates, updatedAt: new Date().toISOString() }
          : api
      );
      // 비동기로 파일 저장
      saveToFile(updatedApis);
      return updatedApis;
    });
  }, [saveToFile]);

  const deleteApi = useCallback((id: string) => {
    setApis((prev: MockApi[]) => {
      const updatedApis = prev.filter((api: MockApi) => api.id !== id);
      // 비동기로 파일 저장
      saveToFile(updatedApis);
      return updatedApis;
    });
  }, [saveToFile]);

  const addCase = useCallback((apiId: string, caseData: Omit<MockResponseCase, 'id'>): string => {
    const caseId = uuidv4();
    const newCase: MockResponseCase = {
      ...caseData,
      id: caseId
    };

    setApis((prev: MockApi[]) => {
      const updatedApis = prev.map((api: MockApi) => 
        api.id === apiId 
          ? { 
              ...api, 
              cases: [...api.cases, newCase],
              updatedAt: new Date().toISOString()
            }
          : api
      );
      // 비동기로 파일 저장
      saveToFile(updatedApis);
      return updatedApis;
    });
    
    return caseId;
  }, [saveToFile]);

  const updateCase = useCallback((apiId: string, caseId: string, updates: Partial<MockResponseCase>) => {
    setApis((prev: MockApi[]) => {
      const updatedApis = prev.map((api: MockApi) => 
        api.id === apiId 
          ? {
              ...api,
              cases: api.cases.map((c: MockResponseCase) => 
                c.id === caseId ? { ...c, ...updates } : c
              ),
              updatedAt: new Date().toISOString()
            }
          : api
      );
      // 비동기로 파일 저장
      saveToFile(updatedApis);
      return updatedApis;
    });
  }, [saveToFile]);

  const deleteCase = useCallback((apiId: string, caseId: string) => {
    setApis((prev: MockApi[]) => {
      const updatedApis = prev.map((api: MockApi) => 
        api.id === apiId 
          ? {
              ...api,
              cases: api.cases.filter((c: MockResponseCase) => c.id !== caseId),
              activeCase: api.activeCase === caseId ? undefined : api.activeCase,
              updatedAt: new Date().toISOString()
            }
          : api
      );
      // 비동기로 파일 저장
      saveToFile(updatedApis);
      return updatedApis;
    });
  }, [saveToFile]);

  const setActiveCase = useCallback((apiId: string, caseId: string) => {
    setApis((prev: MockApi[]) => {
      const updatedApis = prev.map((api: MockApi) => 
        api.id === apiId 
          ? { ...api, activeCase: caseId, updatedAt: new Date().toISOString() }
          : api
      );
      // 비동기로 파일 저장
      saveToFile(updatedApis);
      return updatedApis;
    });
  }, [saveToFile]);

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