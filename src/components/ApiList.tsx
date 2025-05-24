import React from 'react';
import { Edit, Trash2, Plus, Play, Pause, Circle } from 'lucide-react';
import { MockApi } from '../types';

interface ApiListProps {
  apis: MockApi[];
  onEditApi: (api: MockApi) => void;
  onDeleteApi: (id: string) => void;
  onToggleApi: (id: string) => void;
  onAddCase: (apiId: string) => void;
  onEditCase: (apiId: string, caseId: string) => void;
  onDeleteCase: (apiId: string, caseId: string) => void;
  onSetActiveCase: (apiId: string, caseId: string) => void;
}

export const ApiList: React.FC<ApiListProps> = ({
  apis,
  onEditApi,
  onDeleteApi,
  onToggleApi,
  onAddCase,
  onEditCase,
  onDeleteCase,
  onSetActiveCase
}) => {
  const getMethodClass = (method: string) => {
    return `method-badge method-${method.toLowerCase()}`;
  };

  const getStatusClass = (status: number) => {
    return `status-badge status-${status}`;
  };

  return (
    <div className="p-4 h-full overflow-y-auto">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">APIs</h2>
      
      {apis.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          <p>No APIs added yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {apis.map((api) => (
            <div key={api.id} className="card p-4">
              {/* API Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className={getMethodClass(api.method)}>
                    {api.method}
                  </span>
                  <button
                    onClick={() => onToggleApi(api.id)}
                    className={`p-1 rounded ${
                      api.isEnabled 
                        ? 'text-green-600 hover:bg-green-50' 
                        : 'text-gray-400 hover:bg-gray-50'
                    }`}
                    title={api.isEnabled ? 'Disable API' : 'Enable API'}
                  >
                    {api.isEnabled ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => onEditApi(api)}
                    className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                    title="Edit API"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteApi(api.id)}
                    className="p-1 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                    title="Delete API"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* API Info */}
              <div className="mb-3">
                <h3 className="font-medium text-gray-900">{api.name}</h3>
                <p className="text-sm text-gray-600 font-mono">{api.path}</p>
                {api.description && (
                  <p className="text-sm text-gray-500 mt-1">{api.description}</p>
                )}
              </div>

              {/* Response Cases */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-700">Response Cases</h4>
                  <button
                    onClick={() => onAddCase(api.id)}
                    className="btn-secondary text-xs py-1 px-2"
                    title="Add Response Case"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add Case
                  </button>
                </div>

                {api.cases.length === 0 ? (
                  <p className="text-xs text-gray-500">No response cases defined</p>
                ) : (
                  <div className="space-y-2">
                    {api.cases.map((responseCase) => (
                      <div
                        key={responseCase.id}
                        className={`flex items-center justify-between p-2 rounded border ${
                          api.activeCase === responseCase.id
                            ? 'border-primary-200 bg-primary-50'
                            : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center space-x-2 flex-1">
                          <button
                            onClick={() => onSetActiveCase(api.id, responseCase.id)}
                            className={`p-1 rounded ${
                              api.activeCase === responseCase.id
                                ? 'text-primary-600'
                                : 'text-gray-400 hover:text-primary-600'
                            }`}
                            title={
                              api.activeCase === responseCase.id
                                ? 'Active case'
                                : 'Set as active case'
                            }
                          >
                            <Circle
                              className={`w-3 h-3 ${
                                api.activeCase === responseCase.id ? 'fill-current' : ''
                              }`}
                            />
                          </button>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-medium text-gray-900 truncate">
                                {responseCase.name}
                              </span>
                              <span className={getStatusClass(responseCase.status)}>
                                {responseCase.status}
                              </span>
                            </div>
                            {responseCase.description && (
                              <p className="text-xs text-gray-500 truncate">
                                {responseCase.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => onEditCase(api.id, responseCase.id)}
                            className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                            title="Edit Case"
                          >
                            <Edit className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => onDeleteCase(api.id, responseCase.id)}
                            className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                            title="Delete Case"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 