import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
// Create axios instance
const api = axios.create({
    baseURL: 'https://jsonplaceholder.typicode.com'
});
function App() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('🚀 Fetching users...');
            const response = await api.get('/users');
            console.log('✅ Response received:', response.data);
            setUsers(response.data);
        }
        catch (err) {
            console.error('❌ Error fetching users:', err);
            setError('Failed to fetch users');
        }
        finally {
            setLoading(false);
        }
    };
    const testPost = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('🚀 Testing POST request...');
            const response = await api.post('/users', {
                name: 'Test User',
                email: 'test@example.com',
                username: 'testuser'
            });
            console.log('✅ POST Response:', response.data);
            alert('POST request successful! Check console for details.');
        }
        catch (err) {
            console.error('❌ Error posting data:', err);
            setError('Failed to post data');
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchUsers();
    }, []);
    return (_jsxs("div", { style: { padding: '20px', maxWidth: '800px', margin: '0 auto' }, children: [_jsx("h1", { children: "\uD83C\uDFAD API Mock GUI Test App" }), _jsxs("div", { style: {
                    backgroundColor: '#f0f8ff',
                    padding: '20px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    border: '1px solid #ddeeff'
                }, children: [_jsx("h2", { children: "\uD83D\uDCDD How to Test:" }), _jsxs("ol", { children: [_jsxs("li", { children: [_jsx("strong", { children: "Look for the blue floating button" }), " in the bottom-right corner"] }), _jsxs("li", { children: [_jsx("strong", { children: "Click it" }), " to open the API Mock Manager"] }), _jsxs("li", { children: [_jsx("strong", { children: "Click \"Start\"" }), " to start the mock server (button should turn green)"] }), _jsxs("li", { children: [_jsx("strong", { children: "Click \"Add API\"" }), " and configure:", _jsxs("ul", { children: [_jsxs("li", { children: ["Method: ", _jsx("code", { children: "GET" })] }), _jsxs("li", { children: ["Path: ", _jsx("code", { children: "/users" })] }), _jsxs("li", { children: ["Name: ", _jsx("code", { children: "Mock Users" })] })] })] }), _jsxs("li", { children: [_jsx("strong", { children: "Click \"Refresh Users\"" }), " button below"] }), _jsxs("li", { children: [_jsx("strong", { children: "See mock data" }), " instead of real API data!"] })] })] }), _jsxs("div", { style: { marginBottom: '20px', display: 'flex', gap: '10px' }, children: [_jsx("button", { onClick: fetchUsers, disabled: loading, style: {
                            padding: '10px 20px',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.6 : 1
                        }, children: loading ? '⏳ Loading...' : '🔄 Refresh Users' }), _jsx("button", { onClick: testPost, disabled: loading, style: {
                            padding: '10px 20px',
                            backgroundColor: '#2196F3',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.6 : 1
                        }, children: loading ? '⏳ Loading...' : '📤 Test POST' })] }), error && (_jsxs("div", { style: {
                    color: '#d32f2f',
                    backgroundColor: '#ffebee',
                    padding: '10px',
                    borderRadius: '4px',
                    marginBottom: '20px',
                    border: '1px solid #ffcdd2'
                }, children: ["\u274C ", error] })), _jsxs("div", { children: [_jsxs("h2", { children: ["\uD83D\uDC65 Users (", users.length, ")"] }), users.length === 0 && !loading && (_jsx("p", { style: { color: '#666' }, children: "No users found. Try refreshing or setting up a mock!" })), _jsx("div", { style: { display: 'grid', gap: '10px' }, children: users.map(user => (_jsxs("div", { style: {
                                border: '1px solid #ddd',
                                padding: '15px',
                                borderRadius: '8px',
                                backgroundColor: '#fafafa'
                            }, children: [_jsx("div", { style: { fontWeight: 'bold', fontSize: '16px', marginBottom: '5px' }, children: user.name }), _jsxs("div", { style: { color: '#666', fontSize: '14px' }, children: ["\uD83D\uDCE7 ", user.email] }), _jsxs("div", { style: { color: '#666', fontSize: '14px' }, children: ["\uD83D\uDC64 @", user.username] }), _jsxs("div", { style: { color: '#999', fontSize: '12px', marginTop: '5px' }, children: ["ID: ", user.id] })] }, user.id))) })] }), _jsxs("div", { style: {
                    marginTop: '40px',
                    padding: '20px',
                    backgroundColor: '#fff3e0',
                    borderRadius: '8px',
                    border: '1px solid #ffcc02'
                }, children: [_jsx("h3", { children: "\uD83D\uDD0D Debug Info" }), _jsxs("ul", { style: { fontSize: '14px', color: '#666' }, children: [_jsxs("li", { children: [_jsx("strong", { children: "Base URL:" }), " ", api.defaults.baseURL] }), _jsxs("li", { children: [_jsx("strong", { children: "Total Users:" }), " ", users.length] }), _jsxs("li", { children: [_jsx("strong", { children: "Loading:" }), " ", loading ? 'Yes' : 'No'] }), _jsxs("li", { children: [_jsx("strong", { children: "Error:" }), " ", error || 'None'] })] }), _jsx("p", { style: { fontSize: '12px', color: '#888', marginTop: '10px' }, children: "\uD83D\uDCA1 Check browser console (F12) for detailed request/response logs" })] })] }));
}
export default App;
