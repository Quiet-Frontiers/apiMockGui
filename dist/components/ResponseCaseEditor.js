import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
const HTTP_STATUSES = [200, 201, 400, 401, 403, 404, 500, 502, 503];
export const ResponseCaseEditor = ({ api, caseId, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        status: 200,
        headers: '{}',
        body: '{}',
        delay: 0,
        isActive: false
    });
    const [jsonErrors, setJsonErrors] = useState({
        headers: '',
        body: ''
    });
    useEffect(() => {
        if (caseId) {
            const existingCase = api.cases.find(c => c.id === caseId);
            if (existingCase) {
                setFormData({
                    name: existingCase.name,
                    description: existingCase.description || '',
                    status: existingCase.status,
                    headers: JSON.stringify(existingCase.headers || {}, null, 2),
                    body: JSON.stringify(existingCase.body, null, 2),
                    delay: existingCase.delay || 0,
                    isActive: existingCase.isActive
                });
            }
        }
        else {
            setFormData({
                name: '',
                description: '',
                status: 200,
                headers: '{}',
                body: '{}',
                delay: 0,
                isActive: false
            });
        }
    }, [api, caseId]);
    const validateJson = (field, value) => {
        try {
            JSON.parse(value);
            setJsonErrors(prev => ({ ...prev, [field]: '' }));
            return true;
        }
        catch (error) {
            setJsonErrors(prev => ({
                ...prev,
                [field]: `Invalid JSON: ${error instanceof Error ? error.message : 'Unknown error'}`
            }));
            return false;
        }
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name.trim())
            return;
        const headersValid = validateJson('headers', formData.headers);
        const bodyValid = validateJson('body', formData.body);
        if (!headersValid || !bodyValid)
            return;
        try {
            const parsedHeaders = JSON.parse(formData.headers);
            const parsedBody = JSON.parse(formData.body);
            onSave({
                name: formData.name.trim(),
                description: formData.description.trim() || undefined,
                status: formData.status,
                headers: Object.keys(parsedHeaders).length > 0 ? parsedHeaders : undefined,
                body: parsedBody,
                delay: formData.delay > 0 ? formData.delay : undefined,
                isActive: formData.isActive
            });
        }
        catch (error) {
            console.error('Failed to parse JSON:', error);
        }
    };
    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (field === 'headers' || field === 'body') {
            validateJson(field, value);
        }
    };
    const insertTemplate = (type) => {
        let template = '';
        switch (type) {
            case 'success':
                template = JSON.stringify({
                    success: true,
                    message: "Operation completed successfully",
                    data: {}
                }, null, 2);
                break;
            case 'error':
                template = JSON.stringify({
                    success: false,
                    message: "An error occurred",
                    error: {
                        code: "ERROR_CODE",
                        details: "Error details here"
                    }
                }, null, 2);
                break;
            case 'list':
                template = JSON.stringify({
                    success: true,
                    data: [],
                    pagination: {
                        page: 1,
                        limit: 10,
                        total: 0
                    }
                }, null, 2);
                break;
        }
        handleInputChange('body', template);
    };
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: _jsxs("div", { className: "bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-screen overflow-y-auto", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h2", { className: "text-xl font-semibold text-gray-900", children: caseId ? 'Edit Response Case' : 'Add New Response Case' }), _jsx("button", { onClick: onCancel, className: "p-1 text-gray-400 hover:text-gray-600", children: _jsx(X, { className: "w-5 h-5" }) })] }), _jsx("div", { className: "mb-4 p-3 bg-gray-50 rounded", children: _jsxs("p", { className: "text-sm text-gray-600", children: [_jsx("span", { className: "font-medium", children: api.method }), " ", api.path] }) }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Case Name *" }), _jsx("input", { type: "text", value: formData.name, onChange: (e) => handleInputChange('name', e.target.value), className: "input-field", placeholder: "Success, Error, Not Found, etc.", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Description" }), _jsx("input", { type: "text", value: formData.description, onChange: (e) => handleInputChange('description', e.target.value), className: "input-field", placeholder: "Optional description for this response case" })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "HTTP Status *" }), _jsx("select", { value: formData.status, onChange: (e) => handleInputChange('status', parseInt(e.target.value)), className: "input-field", required: true, children: HTTP_STATUSES.map(status => (_jsx("option", { value: status, children: status }, status))) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Delay (ms)" }), _jsx("input", { type: "number", min: "0", value: formData.delay, onChange: (e) => handleInputChange('delay', parseInt(e.target.value) || 0), className: "input-field", placeholder: "0" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Response Headers (JSON)" }), _jsx("textarea", { value: formData.headers, onChange: (e) => handleInputChange('headers', e.target.value), className: `input-field font-mono text-sm ${jsonErrors.headers ? 'border-red-300' : ''}`, rows: 3, placeholder: '{"Content-Type": "application/json"}' }), jsonErrors.headers && (_jsx("p", { className: "text-red-600 text-xs mt-1", children: jsonErrors.headers }))] }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between mb-1", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Response Body (JSON) *" }), _jsxs("div", { className: "flex space-x-2", children: [_jsx("button", { type: "button", onClick: () => insertTemplate('success'), className: "text-xs text-primary-600 hover:text-primary-800", children: "Success Template" }), _jsx("button", { type: "button", onClick: () => insertTemplate('error'), className: "text-xs text-primary-600 hover:text-primary-800", children: "Error Template" }), _jsx("button", { type: "button", onClick: () => insertTemplate('list'), className: "text-xs text-primary-600 hover:text-primary-800", children: "List Template" })] })] }), _jsx("textarea", { value: formData.body, onChange: (e) => handleInputChange('body', e.target.value), className: `input-field font-mono text-sm ${jsonErrors.body ? 'border-red-300' : ''}`, rows: 8, placeholder: '{"message": "Hello World"}', required: true }), jsonErrors.body && (_jsx("p", { className: "text-red-600 text-xs mt-1", children: jsonErrors.body }))] }), _jsxs("div", { className: "flex items-center", children: [_jsx("input", { type: "checkbox", id: "active", checked: formData.isActive, onChange: (e) => handleInputChange('isActive', e.target.checked), className: "h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" }), _jsx("label", { htmlFor: "active", className: "ml-2 block text-sm text-gray-700", children: "Set as active case" })] }), _jsxs("div", { className: "flex justify-end space-x-3 pt-4 border-t", children: [_jsx("button", { type: "button", onClick: onCancel, className: "btn-secondary", children: "Cancel" }), _jsx("button", { type: "submit", className: "btn-primary", disabled: !formData.name.trim() ||
                                        !!jsonErrors.headers ||
                                        !!jsonErrors.body, children: caseId ? 'Update Case' : 'Create Case' })] })] })] }) }));
};
