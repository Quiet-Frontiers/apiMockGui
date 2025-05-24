import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { MockApi, HttpMethod, MockResponseCase } from '../types';

interface ApiEditorProps {
  api: MockApi | null;
  onSave: (apiData: Omit<MockApi, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const HTTP_METHODS: HttpMethod[] = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'];

export const ApiEditor: React.FC<ApiEditorProps> = ({ api, onSave, onCancel }) => {
  const [formData, setFormData] = useState<{
    name: string;
    method: HttpMethod;
    path: string;
    description: string;
    cases: MockResponseCase[];
    isEnabled: boolean;
  }>({
    name: '',
    method: 'GET' as HttpMethod,
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
    } else {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim() && formData.path.trim()) {
      onSave(formData);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {api ? 'Edit API' : 'Add New API'}
          </h2>
          <button
            onClick={onCancel}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              API Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="input-field"
              placeholder="User API, Product API, etc."
              required
            />
          </div>

          {/* Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              HTTP Method *
            </label>
            <select
              value={formData.method}
              onChange={(e) => handleInputChange('method', e.target.value as HttpMethod)}
              className="input-field"
              required
            >
              {HTTP_METHODS.map(method => (
                <option key={method} value={method}>{method}</option>
              ))}
            </select>
          </div>

          {/* Path */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              API Path *
            </label>
            <input
              type="text"
              value={formData.path}
              onChange={(e) => handleInputChange('path', e.target.value)}
              className="input-field"
              placeholder="/api/users, /api/products/:id, etc."
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="input-field"
              rows={3}
              placeholder="Optional description for this API endpoint"
            />
          </div>

          {/* Enabled */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="enabled"
              checked={formData.isEnabled}
              onChange={(e) => handleInputChange('isEnabled', e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="enabled" className="ml-2 block text-sm text-gray-700">
              Enable this API
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
              disabled={!formData.name.trim() || !formData.path.trim()}
            >
              {api ? 'Update API' : 'Create API'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 