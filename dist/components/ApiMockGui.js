import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Plus, Download, Upload, Settings } from 'lucide-react';
import { useMockApiStore } from '../hooks/useMockApiStore';
import { ApiList } from './ApiList';
import { ApiEditor } from './ApiEditor';
import { ResponseCaseEditor } from './ResponseCaseEditor';
export const ApiMockGui = ({ className = '', onConfigChange, initialConfig = [], enableExport = true, enableImport = true }) => {
    const store = useMockApiStore(initialConfig);
    const [selectedApi, setSelectedApi] = useState(null);
    const [showApiEditor, setShowApiEditor] = useState(false);
    const [showCaseEditor, setShowCaseEditor] = useState(false);
    const [selectedCaseId, setSelectedCaseId] = useState(null);
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
    const handleEditApi = (api) => {
        setSelectedApi(api);
        setShowApiEditor(true);
    };
    const handleAddCase = (apiId) => {
        const api = store.apis.find(a => a.id === apiId);
        if (api) {
            setSelectedApi(api);
            setSelectedCaseId(null);
            setShowCaseEditor(true);
        }
    };
    const handleEditCase = (apiId, caseId) => {
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
    const handleImport = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const config = e.target?.result;
                    store.importConfig(config);
                }
                catch (error) {
                    alert('Failed to import configuration. Please check the file format.');
                }
            };
            reader.readAsText(file);
        }
    };
    return (_jsxs("div", { className: `api-mock-gui ${className}`, children: [_jsx("div", { className: "bg-white border-b border-gray-200 px-6 py-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "API Mock GUI" }), _jsx("p", { className: "text-sm text-gray-600 mt-1", children: "Manage mock API responses for development and testing" })] }), _jsxs("div", { className: "flex items-center space-x-3", children: [enableImport && (_jsxs("label", { className: "btn-secondary cursor-pointer", children: [_jsx(Upload, { className: "w-4 h-4 mr-2" }), "Import", _jsx("input", { type: "file", accept: ".json", onChange: handleImport, className: "hidden" })] })), enableExport && (_jsxs("button", { onClick: handleExport, className: "btn-secondary", disabled: store.apis.length === 0, children: [_jsx(Download, { className: "w-4 h-4 mr-2" }), "Export"] })), _jsxs("button", { onClick: handleAddApi, className: "btn-primary", children: [_jsx(Plus, { className: "w-4 h-4 mr-2" }), "Add API"] })] })] }) }), _jsxs("div", { className: "flex h-screen", children: [_jsx("div", { className: "w-1/3 border-r border-gray-200 bg-gray-50", children: _jsx(ApiList, { apis: store.apis, onEditApi: handleEditApi, onDeleteApi: store.deleteApi, onToggleApi: (id) => {
                                const api = store.apis.find(a => a.id === id);
                                if (api) {
                                    store.updateApi(id, { isEnabled: !api.isEnabled });
                                }
                            }, onAddCase: handleAddCase, onEditCase: handleEditCase, onDeleteCase: store.deleteCase, onSetActiveCase: store.setActiveCase }) }), _jsx("div", { className: "flex-1 p-6", children: store.apis.length === 0 ? (_jsx("div", { className: "flex items-center justify-center h-full", children: _jsxs("div", { className: "text-center", children: [_jsx(Settings, { className: "w-16 h-16 text-gray-400 mx-auto mb-4" }), _jsx("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: "No APIs configured" }), _jsx("p", { className: "text-gray-600 mb-4", children: "Get started by adding your first API endpoint" }), _jsxs("button", { onClick: handleAddApi, className: "btn-primary", children: [_jsx(Plus, { className: "w-4 h-4 mr-2" }), "Add Your First API"] })] }) })) : (_jsx("div", { className: "text-center text-gray-600", children: _jsx("p", { children: "Select an API from the sidebar to view and manage its response cases." }) })) })] }), showApiEditor && (_jsx(ApiEditor, { api: selectedApi, onSave: (apiData) => {
                    if (selectedApi) {
                        store.updateApi(selectedApi.id, apiData);
                    }
                    else {
                        store.addApi(apiData);
                    }
                    setShowApiEditor(false);
                }, onCancel: () => setShowApiEditor(false) })), showCaseEditor && selectedApi && (_jsx(ResponseCaseEditor, { api: selectedApi, caseId: selectedCaseId, onSave: (caseData) => {
                    if (selectedCaseId) {
                        store.updateCase(selectedApi.id, selectedCaseId, caseData);
                    }
                    else {
                        store.addCase(selectedApi.id, caseData);
                    }
                    setShowCaseEditor(false);
                }, onCancel: () => setShowCaseEditor(false) }))] }));
};
