import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { MockApi, MockResponseCase, HttpStatus } from '../types';

interface ResponseCaseEditorProps {
  api: MockApi;
  caseId: string | null;
  onSave: (caseData: Omit<MockResponseCase, 'id'>) => void;
  onCancel: () => void;
}

const HTTP_STATUSES: HttpStatus[] = [200, 201, 400, 401, 403, 404, 500, 502, 503];

export const ResponseCaseEditor: React.FC<ResponseCaseEditorProps> = ({
  api,
  caseId,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 200 as HttpStatus,
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
    } else {
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

  const validateJson = (field: 'headers' | 'body', value: string) => {
    try {
      JSON.parse(value);
      setJsonErrors(prev => ({ ...prev, [field]: '' }));
      return true;
    } catch (error) {
      setJsonErrors(prev => ({ 
        ...prev, 
        [field]: `Invalid JSON: ${error instanceof Error ? error.message : 'Unknown error'}` 
      }));
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) return;
    
    const headersValid = validateJson('headers', formData.headers);
    const bodyValid = validateJson('body', formData.body);
    
    if (!headersValid || !bodyValid) return;

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
    } catch (error) {
      console.error('Failed to parse JSON:', error);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'headers' || field === 'body') {
      validateJson(field as 'headers' | 'body', value);
    }
  };

  const insertTemplate = (type: 'success' | 'error' | 'list') => {
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-screen overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {caseId ? 'Edit Response Case' : 'Add New Response Case'}
          </h2>
          <button
            onClick={onCancel}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4 p-3 bg-gray-50 rounded">
          <p className="text-sm text-gray-600">
            <span className="font-medium">{api.method}</span> {api.path}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Case Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="input-field"
              placeholder="Success, Error, Not Found, etc."
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="input-field"
              placeholder="Optional description for this response case"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                HTTP Status *
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', parseInt(e.target.value) as HttpStatus)}
                className="input-field"
                required
              >
                {HTTP_STATUSES.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            {/* Delay */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delay (ms)
              </label>
              <input
                type="number"
                min="0"
                value={formData.delay}
                onChange={(e) => handleInputChange('delay', parseInt(e.target.value) || 0)}
                className="input-field"
                placeholder="0"
              />
            </div>
          </div>

          {/* Headers */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Response Headers (JSON)
            </label>
            <textarea
              value={formData.headers}
              onChange={(e) => handleInputChange('headers', e.target.value)}
              className={`input-field font-mono text-sm ${jsonErrors.headers ? 'border-red-300' : ''}`}
              rows={3}
              placeholder='{"Content-Type": "application/json"}'
            />
            {jsonErrors.headers && (
              <p className="text-red-600 text-xs mt-1">{jsonErrors.headers}</p>
            )}
          </div>

          {/* Body */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700">
                Response Body (JSON) *
              </label>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => insertTemplate('success')}
                  className="text-xs text-primary-600 hover:text-primary-800"
                >
                  Success Template
                </button>
                <button
                  type="button"
                  onClick={() => insertTemplate('error')}
                  className="text-xs text-primary-600 hover:text-primary-800"
                >
                  Error Template
                </button>
                <button
                  type="button"
                  onClick={() => insertTemplate('list')}
                  className="text-xs text-primary-600 hover:text-primary-800"
                >
                  List Template
                </button>
              </div>
            </div>
            <textarea
              value={formData.body}
              onChange={(e) => handleInputChange('body', e.target.value)}
              className={`input-field font-mono text-sm ${jsonErrors.body ? 'border-red-300' : ''}`}
              rows={8}
              placeholder='{"message": "Hello World"}'
              required
            />
            {jsonErrors.body && (
              <p className="text-red-600 text-xs mt-1">{jsonErrors.body}</p>
            )}
          </div>

          {/* Active */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="active"
              checked={formData.isActive}
              onChange={(e) => handleInputChange('isActive', e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="active" className="ml-2 block text-sm text-gray-700">
              Set as active case
            </label>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={
                !formData.name.trim() || 
                !!jsonErrors.headers || 
                !!jsonErrors.body
              }
            >
              {caseId ? 'Update Case' : 'Create Case'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 