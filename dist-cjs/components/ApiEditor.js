"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiEditor = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
const HTTP_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'];
const ApiEditor = ({ api, onSave, onCancel }) => {
    const [formData, setFormData] = (0, react_1.useState)({
        name: '',
        method: 'GET',
        path: '',
        description: '',
        cases: [],
        isEnabled: true
    });
    (0, react_1.useEffect)(() => {
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
    return ((0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-lg p-6 w-full max-w-md mx-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-4", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-xl font-semibold text-gray-900", children: api ? 'Edit API' : 'Add New API' }), (0, jsx_runtime_1.jsx)("button", { onClick: onCancel, className: "p-1 text-gray-400 hover:text-gray-600", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "w-5 h-5" }) })] }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit, className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "API Name *" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: formData.name, onChange: (e) => handleInputChange('name', e.target.value), className: "input-field", placeholder: "User API, Product API, etc.", required: true })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "HTTP Method *" }), (0, jsx_runtime_1.jsx)("select", { value: formData.method, onChange: (e) => handleInputChange('method', e.target.value), className: "input-field", required: true, children: HTTP_METHODS.map(method => ((0, jsx_runtime_1.jsx)("option", { value: method, children: method }, method))) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "API Path *" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: formData.path, onChange: (e) => handleInputChange('path', e.target.value), className: "input-field", placeholder: "/api/users, /api/products/:id, etc.", required: true })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Description" }), (0, jsx_runtime_1.jsx)("textarea", { value: formData.description, onChange: (e) => handleInputChange('description', e.target.value), className: "input-field", rows: 3, placeholder: "Optional description for this API endpoint" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", id: "enabled", checked: formData.isEnabled, onChange: (e) => handleInputChange('isEnabled', e.target.checked), className: "h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" }), (0, jsx_runtime_1.jsx)("label", { htmlFor: "enabled", className: "ml-2 block text-sm text-gray-700", children: "Enable this API" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-end space-x-3 pt-4 border-t", children: [(0, jsx_runtime_1.jsx)("button", { type: "button", onClick: onCancel, className: "btn-secondary", children: "Cancel" }), (0, jsx_runtime_1.jsx)("button", { type: "submit", className: "btn-primary", disabled: !formData.name.trim() || !formData.path.trim(), children: api ? 'Update API' : 'Create API' })] })] })] }) }));
};
exports.ApiEditor = ApiEditor;
