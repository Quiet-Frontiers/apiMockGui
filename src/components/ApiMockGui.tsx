import React, { useState, useEffect } from 'react';
import { Plus, Download, Upload, Settings } from 'lucide-react';
import { ApiMockGuiProps, MockApi } from '../types';
import { useMockApiStore } from '../hooks/useMockApiStore';
import { ApiList } from './ApiList';
import { ApiEditor } from './ApiEditor';
import { ResponseCaseEditor } from './ResponseCaseEditor';

export const ApiMockGui: React.FC<ApiMockGuiProps> = ({
  className = '',
  onConfigChange,
  initialConfig = [],
  enableExport = true,
  enableImport = true
}) => {
  const store = useMockApiStore(initialConfig);
  const [selectedApi, setSelectedApi] = useState<MockApi | null>(null);
  const [showApiEditor, setShowApiEditor] = useState(false);
  const [showCaseEditor, setShowCaseEditor] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  
  // Notify parent of config changes
  useEffect(() => {
    if (onConfigChange) {
      onConfigChange(store.apis);
    }
  }, [store.apis, onConfigChange]);

  const handleAddApi = () => {
    setSelectedApi(null);
    setShowApiEditor(true);
  };

  const handleEditApi = (api: MockApi) => {
    setSelectedApi(api);
    setShowApiEditor(true);
  };

  const handleAddCase = (apiId: string) => {
    const api = store.apis.find(a => a.id === apiId);
    if (api) {
      setSelectedApi(api);
      setSelectedCaseId(null);
      setShowCaseEditor(true);
    }
  };

  const handleEditCase = (apiId: string, caseId: string) => {
    const api = store.apis.find(a => a.id === apiId);
    if (api) {
      setSelectedApi(api);
      setSelectedCaseId(caseId);
      setShowCaseEditor(true);
    }
  };

  const handleExport = () => {
    const config = store.exportConfig();
    const blob = new Blob([config], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'api-mock-config.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const config = e.target?.result as string;
          store.importConfig(config);
        } catch (error) {
          alert('Failed to import configuration. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className={`api-mock-gui ${className}`}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">API Mock GUI</h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage mock API responses for development and testing
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {enableImport && (
              <label className="btn-secondary cursor-pointer">
                <Upload className="w-4 h-4 mr-2" />
                Import
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>
            )}
            {enableExport && (
              <button
                onClick={handleExport}
                className="btn-secondary"
                disabled={store.apis.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            )}
            <button
              onClick={handleAddApi}
              className="btn-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add API
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-screen">
        {/* API List Sidebar */}
        <div className="w-1/3 border-r border-gray-200 bg-gray-50">
          <ApiList
            apis={store.apis}
            onEditApi={handleEditApi}
            onDeleteApi={store.deleteApi}
            onToggleApi={(id) => {
              const api = store.apis.find(a => a.id === id);
              if (api) {
                store.updateApi(id, { isEnabled: !api.isEnabled });
              }
            }}
            onAddCase={handleAddCase}
            onEditCase={handleEditCase}
            onDeleteCase={store.deleteCase}
            onSetActiveCase={store.setActiveCase}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6">
          {store.apis.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No APIs configured
                </h3>
                <p className="text-gray-600 mb-4">
                  Get started by adding your first API endpoint
                </p>
                <button
                  onClick={handleAddApi}
                  className="btn-primary"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First API
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-600">
              <p>Select an API from the sidebar to view and manage its response cases.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showApiEditor && (
        <ApiEditor
          api={selectedApi}
          onSave={(apiData) => {
            if (selectedApi) {
              store.updateApi(selectedApi.id, apiData);
            } else {
              store.addApi(apiData);
            }
            setShowApiEditor(false);
          }}
          onCancel={() => setShowApiEditor(false)}
        />
      )}

      {showCaseEditor && selectedApi && (
        <ResponseCaseEditor
          api={selectedApi}
          caseId={selectedCaseId}
          onSave={(caseData) => {
            if (selectedCaseId) {
              store.updateCase(selectedApi.id, selectedCaseId, caseData);
            } else {
              store.addCase(selectedApi.id, caseData);
            }
            setShowCaseEditor(false);
          }}
          onCancel={() => setShowCaseEditor(false)}
        />
      )}
    </div>
  );
}; 