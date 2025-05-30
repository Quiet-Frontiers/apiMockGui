"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseCaseEditor = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
const HTTP_STATUSES = [200, 201, 400, 401, 403, 404, 500, 502, 503];
const ResponseCaseEditor = ({ api, caseId, onSave, onCancel }) => {
    const [formData, setFormData] = (0, react_1.useState)({
        name: '',
        description: '',
        status: 200,
        headers: '{}',
        body: '{}',
        delay: 0,
        isActive: false
    });
    const [jsonErrors, setJsonErrors] = (0, react_1.useState)({
        headers: '',
        body: ''
    });
    (0, react_1.useEffect)(() => {
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
    return ((0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-screen overflow-y-auto", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-4", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-xl font-semibold text-gray-900", children: caseId ? 'Edit Response Case' : 'Add New Response Case' }), (0, jsx_runtime_1.jsx)("button", { onClick: onCancel, className: "p-1 text-gray-400 hover:text-gray-600", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "w-5 h-5" }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "mb-4 p-3 bg-gray-50 rounded", children: (0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-gray-600", children: [(0, jsx_runtime_1.jsx)("span", { className: "font-medium", children: api.method }), " ", api.path] }) }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit, className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Case Name *" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: formData.name, onChange: (e) => handleInputChange('name', e.target.value), className: "input-field", placeholder: "Success, Error, Not Found, etc.", required: true })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Description" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: formData.description, onChange: (e) => handleInputChange('description', e.target.value), className: "input-field", placeholder: "Optional description for this response case" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "HTTP Status *" }), (0, jsx_runtime_1.jsx)("select", { value: formData.status, onChange: (e) => handleInputChange('status', parseInt(e.target.value)), className: "input-field", required: true, children: HTTP_STATUSES.map(status => ((0, jsx_runtime_1.jsx)("option", { value: status, children: status }, status))) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Delay (ms)" }), (0, jsx_runtime_1.jsx)("input", { type: "number", min: "0", value: formData.delay, onChange: (e) => handleInputChange('delay', parseInt(e.target.value) || 0), className: "input-field", placeholder: "0" })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Response Headers (JSON)" }), (0, jsx_runtime_1.jsx)("textarea", { value: formData.headers, onChange: (e) => handleInputChange('headers', e.target.value), className: `input-field font-mono text-sm ${jsonErrors.headers ? 'border-red-300' : ''}`, rows: 3, placeholder: '{"Content-Type": "application/json"}' }), jsonErrors.headers && ((0, jsx_runtime_1.jsx)("p", { className: "text-red-600 text-xs mt-1", children: jsonErrors.headers }))] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-1", children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700", children: "Response Body (JSON) *" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex space-x-2", children: [(0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => insertTemplate('success'), className: "text-xs text-primary-600 hover:text-primary-800", children: "Success Template" }), (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => insertTemplate('error'), className: "text-xs text-primary-600 hover:text-primary-800", children: "Error Template" }), (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => insertTemplate('list'), className: "text-xs text-primary-600 hover:text-primary-800", children: "List Template" })] })] }), (0, jsx_runtime_1.jsx)("textarea", { value: formData.body, onChange: (e) => handleInputChange('body', e.target.value), className: `input-field font-mono text-sm ${jsonErrors.body ? 'border-red-300' : ''}`, rows: 8, placeholder: '{"message": "Hello World"}', required: true }), jsonErrors.body && ((0, jsx_runtime_1.jsx)("p", { className: "text-red-600 text-xs mt-1", children: jsonErrors.body }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", id: "active", checked: formData.isActive, onChange: (e) => handleInputChange('isActive', e.target.checked), className: "h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" }), (0, jsx_runtime_1.jsx)("label", { htmlFor: "active", className: "ml-2 block text-sm text-gray-700", children: "Set as active case" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-end space-x-3 pt-4 border-t", children: [(0, jsx_runtime_1.jsx)("button", { type: "button", onClick: onCancel, className: "btn-secondary", children: "Cancel" }), (0, jsx_runtime_1.jsx)("button", { type: "submit", className: "btn-primary", disabled: !formData.name.trim() ||
                                        !!jsonErrors.headers ||
                                        !!jsonErrors.body, children: caseId ? 'Update Case' : 'Create Case' })] })] })] }) }));
};
exports.ResponseCaseEditor = ResponseCaseEditor;
