import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { FloatingApiMockManager } from '../components/FloatingApiMockManager';
import { mswHelpers } from '../msw/setupMsw';
import '../styles/globals.css';
const App = () => {
    const [selectedPreset, setSelectedPreset] = useState('development');
    const handleConfigChange = (apis) => {
        console.log('Config changed:', apis);
        // localStorage에 자동 저장
        mswHelpers.saveConfigToLocalStorage(apis);
    };
    const handleServerStart = () => {
        console.log('🎭 Mock server started!');
        alert('Mock server가 시작되었습니다! 이제 API 요청을 테스트해보세요.');
    };
    const handleServerStop = () => {
        console.log('🛑 Mock server stopped!');
    };
    // 예제 초기 데이터
    const initialConfig = [
        {
            id: 'api1',
            name: 'Users API',
            method: 'GET',
            path: '/api/users',
            description: 'Get all users',
            cases: [
                {
                    id: 'case1',
                    name: 'Success',
                    description: 'Returns list of users',
                    status: 200,
                    headers: { 'Content-Type': 'application/json' },
                    body: {
                        success: true,
                        data: [
                            { id: 1, name: 'John Doe', email: 'john@example.com' },
                            { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
                        ]
                    },
                    isActive: true
                },
                {
                    id: 'case2',
                    name: 'Server Error',
                    description: 'Internal server error',
                    status: 500,
                    body: {
                        success: false,
                        message: 'Internal server error'
                    },
                    delay: 1000,
                    isActive: false
                }
            ],
            activeCase: 'case1',
            isEnabled: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: 'api2',
            name: 'User Detail API',
            method: 'GET',
            path: '/api/users/:id',
            description: 'Get user by ID',
            cases: [
                {
                    id: 'case3',
                    name: 'User Found',
                    description: 'Returns user details',
                    status: 200,
                    body: {
                        success: true,
                        data: { id: 1, name: 'John Doe', email: 'john@example.com' }
                    },
                    isActive: true
                },
                {
                    id: 'case4',
                    name: 'User Not Found',
                    description: 'User does not exist',
                    status: 404,
                    body: {
                        success: false,
                        message: 'User not found'
                    },
                    isActive: false
                }
            ],
            activeCase: 'case3',
            isEnabled: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: 'api3',
            name: 'Posts API',
            method: 'POST',
            path: '/api/posts',
            description: 'Create a new post',
            cases: [
                {
                    id: 'case5',
                    name: 'Post Created',
                    description: 'Successfully created post',
                    status: 201,
                    headers: { 'Content-Type': 'application/json' },
                    body: {
                        success: true,
                        data: {
                            id: 123,
                            title: 'New Post',
                            content: 'This is a new post',
                            author: 'John Doe',
                            createdAt: new Date().toISOString()
                        }
                    },
                    isActive: true
                },
                {
                    id: 'case6',
                    name: 'Validation Error',
                    description: 'Invalid request data',
                    status: 400,
                    body: {
                        success: false,
                        errors: {
                            title: 'Title is required',
                            content: 'Content is too short'
                        }
                    },
                    isActive: false
                }
            ],
            activeCase: 'case5',
            isEnabled: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    ];
    // 서버 설정
    const serverConfig = mswHelpers.createServerConfig({
        baseUrl: 'http://localhost:3000', // 실제 API 서버 URL
        environment: 'browser',
        development: selectedPreset === 'development'
    });
    const TestApiButtons = () => (_jsxs("div", { className: "fixed bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg border max-w-xs", children: [_jsx("h4", { className: "font-semibold mb-2", children: "\uD83E\uDDEA API \uD14C\uC2A4\uD2B8" }), _jsxs("div", { className: "space-y-2", children: [_jsx("button", { onClick: () => {
                            fetch('/api/users')
                                .then(r => r.json())
                                .then(data => {
                                console.log('Mock Response:', data);
                                alert(`Mock 응답: ${JSON.stringify(data, null, 2)}`);
                            })
                                .catch(console.error);
                        }, className: "block w-full px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm hover:bg-blue-200", children: "GET /api/users" }), _jsx("button", { onClick: () => {
                            fetch('/api/users/1')
                                .then(r => r.json())
                                .then(data => {
                                console.log('Mock Response:', data);
                                alert(`Mock 응답: ${JSON.stringify(data, null, 2)}`);
                            })
                                .catch(console.error);
                        }, className: "block w-full px-3 py-1 bg-green-100 text-green-800 rounded text-sm hover:bg-green-200", children: "GET /api/users/1" }), _jsx("button", { onClick: () => {
                            fetch('/api/posts', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ title: 'Test Post', content: 'Test content' })
                            })
                                .then(r => r.json())
                                .then(data => {
                                console.log('Mock Response:', data);
                                alert(`Mock 응답: ${JSON.stringify(data, null, 2)}`);
                            })
                                .catch(console.error);
                        }, className: "block w-full px-3 py-1 bg-purple-100 text-purple-800 rounded text-sm hover:bg-purple-200", children: "POST /api/posts" }), _jsx("div", { className: "border-t pt-2 mt-2", children: _jsx("button", { onClick: () => {
                                console.log('💡 개발자 도구의 Network 탭에서 요청을 확인하세요!');
                                alert('개발자 도구(F12) > Network 탭에서 Mock된 응답을 확인할 수 있습니다.');
                            }, className: "block w-full px-3 py-1 bg-yellow-100 text-yellow-800 rounded text-sm hover:bg-yellow-200", children: "\uD83D\uDCA1 \uB3C4\uC6C0\uB9D0" }) })] })] }));
    const MainContent = () => (_jsxs("div", { className: "min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100", children: [_jsx("header", { className: "bg-white shadow-sm border-b border-gray-200", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 py-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "\uD83C\uDFAD Floating API Mock Manager" }), _jsx("p", { className: "text-gray-600 mt-2", children: "\uC6B0\uCE21 \uD558\uB2E8\uC758 floating button\uC744 \uD074\uB9AD\uD558\uC5EC API Mock GUI\uB97C \uC5F4\uC5B4\uBCF4\uC138\uC694!" })] }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("span", { className: "text-sm font-medium text-gray-700", children: "Environment:" }), _jsxs("select", { value: selectedPreset, onChange: (e) => setSelectedPreset(e.target.value), className: "text-sm border border-gray-300 rounded px-3 py-1 bg-white", children: [_jsx("option", { value: "development", children: "Development" }), _jsx("option", { value: "production", children: "Production" })] }), _jsxs("span", { className: "text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded", children: ["Base URL: ", serverConfig.baseUrl] })] })] }) }) }), _jsxs("main", { className: "max-w-7xl mx-auto px-4 py-8", children: [_jsxs("div", { className: "grid lg:grid-cols-2 gap-8", children: [_jsxs("div", { className: "bg-white rounded-lg shadow-md p-6", children: [_jsx("h2", { className: "text-xl font-semibold mb-4 text-gray-900", children: "\uD83D\uDE80 \uC8FC\uC694 \uAE30\uB2A5" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-start space-x-3", children: [_jsx("div", { className: "w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5", children: _jsx("div", { className: "w-2 h-2 bg-blue-600 rounded-full" }) }), _jsxs("div", { children: [_jsx("h3", { className: "font-medium text-gray-900", children: "Floating Button Interface" }), _jsx("p", { className: "text-sm text-gray-600", children: "\uD654\uBA74 \uC5B4\uB514\uC11C\uB098 \uC811\uADFC \uAC00\uB2A5\uD55C floating button" })] })] }), _jsxs("div", { className: "flex items-start space-x-3", children: [_jsx("div", { className: "w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5", children: _jsx("div", { className: "w-2 h-2 bg-green-600 rounded-full" }) }), _jsxs("div", { children: [_jsx("h3", { className: "font-medium text-gray-900", children: "Drag & Drop" }), _jsx("p", { className: "text-sm text-gray-600", children: "\uD328\uB110\uC744 \uB4DC\uB798\uADF8\uD558\uC5EC \uC6D0\uD558\uB294 \uC704\uCE58\uB85C \uC774\uB3D9" })] })] }), _jsxs("div", { className: "flex items-start space-x-3", children: [_jsx("div", { className: "w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mt-0.5", children: _jsx("div", { className: "w-2 h-2 bg-purple-600 rounded-full" }) }), _jsxs("div", { children: [_jsx("h3", { className: "font-medium text-gray-900", children: "Minimize/Maximize" }), _jsx("p", { className: "text-sm text-gray-600", children: "\uD544\uC694\uC5D0 \uB530\uB77C \uD328\uB110 \uD06C\uAE30 \uC870\uC808" })] })] }), _jsxs("div", { className: "flex items-start space-x-3", children: [_jsx("div", { className: "w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center mt-0.5", children: _jsx("div", { className: "w-2 h-2 bg-orange-600 rounded-full" }) }), _jsxs("div", { children: [_jsx("h3", { className: "font-medium text-gray-900", children: "Real-time Control" }), _jsx("p", { className: "text-sm text-gray-600", children: "\uC2E4\uC2DC\uAC04 API Mock \uC11C\uBC84 \uC81C\uC5B4" })] })] })] })] }), _jsxs("div", { className: "bg-white rounded-lg shadow-md p-6", children: [_jsx("h2", { className: "text-xl font-semibold mb-4 text-gray-900", children: "\uD83D\uDCDD \uC0AC\uC6A9 \uBC29\uBC95" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-start space-x-3", children: [_jsx("div", { className: "w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold", children: "1" }), _jsxs("div", { children: [_jsx("h3", { className: "font-medium text-gray-900", children: "Floating Button \uD074\uB9AD" }), _jsx("p", { className: "text-sm text-gray-600", children: "\uC6B0\uCE21 \uD558\uB2E8\uC758 \"API Mock\" \uBC84\uD2BC\uC744 \uD074\uB9AD\uD558\uC138\uC694" })] })] }), _jsxs("div", { className: "flex items-start space-x-3", children: [_jsx("div", { className: "w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold", children: "2" }), _jsxs("div", { children: [_jsx("h3", { className: "font-medium text-gray-900", children: "Mock Server \uC2DC\uC791" }), _jsx("p", { className: "text-sm text-gray-600", children: "\uD328\uB110 \uC0C1\uB2E8\uC758 \"Start\" \uBC84\uD2BC\uC73C\uB85C \uC11C\uBC84\uB97C \uC2DC\uC791\uD558\uC138\uC694" })] })] }), _jsxs("div", { className: "flex items-start space-x-3", children: [_jsx("div", { className: "w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold", children: "3" }), _jsxs("div", { children: [_jsx("h3", { className: "font-medium text-gray-900", children: "API \uAD00\uB9AC" }), _jsx("p", { className: "text-sm text-gray-600", children: "API endpoints\uC640 response cases\uB97C \uCD94\uAC00/\uD3B8\uC9D1\uD558\uC138\uC694" })] })] }), _jsxs("div", { className: "flex items-start space-x-3", children: [_jsx("div", { className: "w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold", children: "4" }), _jsxs("div", { children: [_jsx("h3", { className: "font-medium text-gray-900", children: "\uD14C\uC2A4\uD2B8 \uC2E4\uD589" }), _jsx("p", { className: "text-sm text-gray-600", children: "\uC88C\uCE21 \uD558\uB2E8\uC758 \uD14C\uC2A4\uD2B8 \uBC84\uD2BC\uC73C\uB85C API\uB97C \uD655\uC778\uD558\uC138\uC694" })] })] })] })] })] }), _jsxs("div", { className: "mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6", children: [_jsx("h3", { className: "font-semibold text-blue-900 mb-3", children: "\uD83D\uDCA1 \uAC1C\uBC1C\uC790 \uD301" }), _jsxs("div", { className: "grid md:grid-cols-2 gap-4 text-sm text-blue-800", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-medium mb-2", children: "\uCEE4\uC2A4\uD130\uB9C8\uC774\uC9D5 \uC635\uC158:" }), _jsxs("ul", { className: "space-y-1", children: [_jsxs("li", { children: ["\u2022 ", _jsx("code", { className: "bg-blue-100 px-1 rounded", children: "position" }), ": \uBC84\uD2BC \uC704\uCE58 \uC124\uC815"] }), _jsxs("li", { children: ["\u2022 ", _jsx("code", { className: "bg-blue-100 px-1 rounded", children: "buttonText" }), ": \uBC84\uD2BC \uD14D\uC2A4\uD2B8 \uBCC0\uACBD"] }), _jsxs("li", { children: ["\u2022 ", _jsx("code", { className: "bg-blue-100 px-1 rounded", children: "panelWidth/Height" }), ": \uD328\uB110 \uD06C\uAE30 \uC870\uC808"] })] })] }), _jsxs("div", { children: [_jsx("h4", { className: "font-medium mb-2", children: "\uCD94\uAC00 \uAE30\uB2A5:" }), _jsxs("ul", { className: "space-y-1", children: [_jsxs("li", { children: ["\u2022 ", _jsx("code", { className: "bg-blue-100 px-1 rounded", children: "minimizable" }), ": \uCD5C\uC18C\uD654 \uAE30\uB2A5"] }), _jsxs("li", { children: ["\u2022 ", _jsx("code", { className: "bg-blue-100 px-1 rounded", children: "draggable" }), ": \uB4DC\uB798\uADF8 \uAE30\uB2A5"] }), _jsxs("li", { children: ["\u2022 ", _jsx("code", { className: "bg-blue-100 px-1 rounded", children: "autoStart" }), ": \uC790\uB3D9 \uC11C\uBC84 \uC2DC\uC791"] })] })] })] })] })] })] }));
    return (_jsxs(_Fragment, { children: [_jsx(MainContent, {}), _jsx(FloatingApiMockManager, { serverConfig: serverConfig, autoStart: selectedPreset === 'development', onConfigChange: handleConfigChange, onServerStart: handleServerStart, onServerStop: handleServerStop, initialConfig: initialConfig, enableExport: true, enableImport: true, position: "bottom-right", buttonText: "API Mock", panelWidth: "900px", panelHeight: "700px", minimizable: true, draggable: true }), _jsx(TestApiButtons, {})] }));
};
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(_jsx(App, {}));
