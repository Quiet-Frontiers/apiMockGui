import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
const HTTP_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'];
export const ApiEditor = ({ api, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        method: 'GET',
        path: '',
        description: '',
        cases: [],
        isEnabled: true
    });
    useEffect(() => {
        if (api) {
            setFormData({
                name: api.name,
                method: api.method,
                path: api.path,
                description: api.description || '',
                cases: api.cases,
                isEnabled: api.isEnabled
            });
        }
        else {
            setFormData({
                name: '',
                method: 'GET',
                path: '',
                description: '',
                cases: [],
                isEnabled: true
            });
        }
    }, [api]);
    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.name.trim() && formData.path.trim()) {
            onSave(formData);
        }
    };
    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: _jsxs("div", { className: "bg-white rounded-lg p-6 w-full max-w-md mx-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h2", { className: "text-xl font-semibold text-gray-900", children: api ? 'Edit API' : 'Add New API' }), _jsx("button", { onClick: onCancel, className: "p-1 text-gray-400 hover:text-gray-600", children: _jsx(X, { className: "w-5 h-5" }) })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "API Name *" }), _jsx("input", { type: "text", value: formData.name, onChange: (e) => handleInputChange('name', e.target.value), className: "input-field", placeholder: "User API, Product API, etc.", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "HTTP Method *" }), _jsx("select", { value: formData.method, onChange: (e) => handleInputChange('method', e.target.value), className: "input-field", required: true, children: HTTP_METHODS.map(method => (_jsx("option", { value: method, children: method }, method))) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "API Path *" }), _jsx("input", { type: "text", value: formData.path, onChange: (e) => handleInputChange('path', e.target.value), className: "input-field", placeholder: "/api/users, /api/products/:id, etc.", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Description" }), _jsx("textarea", { value: formData.description, onChange: (e) => handleInputChange('description', e.target.value), className: "input-field", rows: 3, placeholder: "Optional description for this API endpoint" })] }), _jsxs("div", { className: "flex items-center", children: [_jsx("input", { type: "checkbox", id: "enabled", checked: formData.isEnabled, onChange: (e) => handleInputChange('isEnabled', e.target.checked), className: "h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" }), _jsx("label", { htmlFor: "enabled", className: "ml-2 block text-sm text-gray-700", children: "Enable this API" })] }), _jsxs("div", { className: "flex justify-end space-x-3 pt-4 border-t", children: [_jsx("button", { type: "button", onClick: onCancel, className: "btn-secondary", children: "Cancel" }), _jsx("button", { type: "submit", className: "btn-primary", disabled: !formData.name.trim() || !formData.path.trim(), children: api ? 'Update API' : 'Create API' })] })] })] }) }));
};
