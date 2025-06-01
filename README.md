# 🎭 API Mock GUI

A powerful and intuitive GUI library for mocking API responses using axios-mock-adapter. Perfect for frontend development and testing.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/npm/v/api-mock-gui.svg)

## ✨ Features

- 🎯 **Zero Configuration**: Just import and use - no complex setup required
- 🎨 **Beautiful GUI**: Modern, intuitive interface for managing mock APIs
- 🚀 **Auto-initialization**: Floating button appears automatically in development
- 📝 **Multiple Response Cases**: Support for different response scenarios per API
- 🔄 **Real-time Updates**: Changes take effect immediately
- 🎛️ **Full Control**: Start/stop mock server, enable/disable individual APIs
- 📱 **Responsive Design**: Works on all screen sizes

## 📦 Installation

```bash
npm install api-mock-gui axios axios-mock-adapter
```

## 🚀 Quick Start

### 1. Installation & Setup

```bash
npm install api-mock-gui axios axios-mock-adapter
```

### 2. Add to Your Project

```tsx
// main.tsx or index.tsx - Add these TWO imports
import 'api-mock-gui/auto';                    // ✅ Auto-initialization
import 'api-mock-gui/dist/styles.css';         // ✅ Required CSS styles

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

> **Important**: Both imports are required! The CSS import ensures all UI elements (like close buttons, icons) display correctly.

### 3. Run Your Development Server

```bash
npm run dev
# or
npm start
```

You should see a blue floating button in the bottom-right corner! 🎉

### 4. Configure Your First Mock API

1. **Click the floating button** → Opens the API Mock Manager
2. **Click "Start" button** → Starts the mock server (button turns green)
3. **Click "Add API" button** → Opens the API configuration form
4. **Fill in the API details**:
   - **Name**: `Get Users` (any descriptive name)
   - **Method**: `GET` (from dropdown)
   - **Path**: `/api/users` (the endpoint you want to mock)
   - **Description**: `Returns list of users` (optional)
5. **Click "Add API"** → Creates the mock with a default 200 response
6. **Your mock is now active!** ✅

### 5. Test Your Mock

Now when your app makes a request to `/api/users`, it will be intercepted:

```tsx
// In your component
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.yourproject.com'  // This can be any URL
});

// This request will now return the mock data!
api.get('/api/users').then(response => {
  console.log(response.data); // { success: true, message: 'Mock response' }
});
```

### 6. Customize Response Data

1. **Click the Edit button** (pencil icon) next to your API
2. **Edit the response**:
   - Change **Status Code** (200, 404, 500, etc.)
   - Modify **Response Body**:
     ```json
     {
       "users": [
         { "id": 1, "name": "John Doe", "email": "john@example.com" },
         { "id": 2, "name": "Jane Smith", "email": "jane@example.com" }
       ]
     }
     ```
3. **Save changes** → Your app will immediately use the new response!

## 🎯 How It Works

API Mock GUI integrates seamlessly with your existing axios setup:

1. **Automatic Detection**: Automatically intercepts ALL axios instances (default and created)
2. **Zero Configuration**: No axios-mock-adapter setup required
3. **Real-time Updates**: Changes in the GUI update mocks immediately
4. **No Conflicts**: Works alongside your existing axios configuration

```tsx
// ✅ All of these work automatically - no additional setup needed!

// Default axios instance
import axios from 'axios';
axios.get('/users'); // ← Automatically mocked

// Created axios instance
const api = axios.create({
  baseURL: 'https://api.yourproject.com',
  timeout: 5000,
});
api.get('/users'); // ← Also automatically mocked!

// Multiple instances
const authApi = axios.create({ baseURL: 'https://auth.yourproject.com' });
const dataApi = axios.create({ baseURL: 'https://data.yourproject.com' });
// ← Both automatically mocked!
```

### 🔧 No axios-mock-adapter Setup Required

Unlike traditional axios-mock-adapter usage, you **don't need to**:

```tsx
// ❌ You DON'T need to do this manually:
import MockAdapter from 'axios-mock-adapter';
const mock = new MockAdapter(axios);
mock.onGet('/users').reply(200, { users: [] });

// ✅ API Mock GUI handles this automatically!
// Just import and use the GUI
```

## 🎨 GUI Usage

### 1. Floating Button
- Click the blue floating button (bottom-right) to open the GUI
- Button turns green when mock server is running

### 2. Server Controls
- **Start/Stop**: Control the mock server
- **Add API**: Create new mock endpoints

### 3. API Management
- **Method**: Choose GET, POST, PUT, DELETE
- **Path**: Set the endpoint path (e.g., `/api/users`)
- **Response Cases**: Configure different response scenarios

### 4. Response Configuration
- **Status Code**: 200, 404, 500, etc.
- **Headers**: Set HTTP headers like Content-Type
- **Body**: JSON response data

## 🛠️ Environment Configuration

### Development (Auto-enabled)

The GUI activates automatically when any of these conditions are met:
- `localhost` or `127.0.0.1`
- Private IP addresses (`192.168.x.x`, `10.x.x.x`, `172.x.x.x`)
- URLs with port numbers
- `file://` protocol
- `NODE_ENV=development`
- URL parameter `?dev=true`

### Production (Manual activation)

```tsx
// Force enable in production
localStorage.setItem('apiMockGui.forceEnable', 'true');

// Or use URL parameter
// https://yoursite.com?dev=true
```

## 🔧 Advanced Usage

### Manual Component Usage

If you prefer manual control instead of auto-initialization:

```tsx
import React from 'react';
import { ApiMockManager } from 'api-mock-gui';
import 'api-mock-gui/dist/styles.css';  // ✅ Required CSS import

function App() {
  return (
    <div>
      <ApiMockManager
        serverConfig={{
          baseUrl: 'https://api.yourproject.com',
          environment: 'browser'
        }}
        autoStart={true}
        onServerStart={() => console.log('Mock server started!')}
      />
    </div>
  );
}
```

### Global Functions

```tsx
// Manual control via window functions
window.apiMockGuiInit();     // Initialize manually
window.apiMockGuiCleanup();  // Clean up resources
```

## 🐛 Troubleshooting

### 🚫 No Floating Button Appears

**Possible causes:**
1. **Not in development environment**
   ```bash
   # Check current URL in browser console
   console.log(window.location.href);
   
   # Force enable if needed
   localStorage.setItem('apiMockGui.forceEnable', 'true');
   # Refresh page
   ```

2. **React not available**
   ```bash
   # Check browser console for errors like:
   # "React not available after maximum attempts"
   ```

### 🖱️ Buttons Not Clickable

**Solutions:**
1. **CSS conflicts** - Check browser DevTools for CSS issues
2. **Z-index problems** - The button uses `z-index: 2147483647`
3. **JavaScript errors** - Check browser console for errors

### 🔌 Mock Not Working

**Step-by-step debugging:**

1. **Check server status**
   - Button should be **green** when server is running
   - If red/blue, click to start the server

2. **Verify API configuration**
   ```tsx
   // Your request
   axios.get('/api/users')
   
   // Mock configuration should match:
   // Method: GET
   // Path: /api/users (exactly)
   ```

3. **Check network tab**
   - Open browser DevTools → Network tab
   - Make the API request
   - Look for the request - it should NOT appear in network tab if mocked
   - If it appears, the mock is not intercepting it

4. **Check axios setup**
   ```tsx
   // This works
   import axios from 'axios';
   const api = axios.create({ baseURL: 'https://any-url.com' });
   api.get('/api/users'); // ✅ Will be mocked
   
   // This doesn't work
   fetch('/api/users'); // ❌ fetch() is not supported, use axios
   ```

### 🌐 Environment Issues

**Not activating in your environment?**
```tsx
// Check what's detected
console.log('Hostname:', window.location.hostname);
console.log('Port:', window.location.port);
console.log('Protocol:', window.location.protocol);

// Force activation
localStorage.setItem('apiMockGui.forceEnable', 'true');
window.location.reload();
```

### 📱 UI Issues

**Panel too small/large?**
```tsx
// Use manual component with custom size
<ApiMockManager
  panelWidth="1000px"
  panelHeight="800px"
  position="top-left"
/>
```

**Can't see the button on mobile?**
- Button is optimized for desktop development
- Use manual component for mobile testing

### ⚡ Performance Issues

**Slow response times?**
- Check if you have many APIs configured
- Disable unused APIs instead of deleting them
- Restart the mock server periodically

## 📖 Example Project

Complete React + Vite example:

```tsx
// main.tsx
import 'api-mock-gui/auto';                    // ✅ Auto-initialization
import 'api-mock-gui/dist/styles.css';         // ✅ Required CSS import
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// App.tsx
import axios from 'axios';
import { useEffect, useState } from 'react';

const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com'
});

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // This request will be mocked when configured in the GUI
    api.get('/users').then(res => {
      setUsers(res.data);
    });
  }, []);

  return (
    <div>
      <h1>Users</h1>
      <pre>{JSON.stringify(users, null, 2)}</pre>
    </div>
  );
}

export default App;
```

## 📋 Quick Summary

**Just 4 steps to get started:**

1. **Install**: `npm install api-mock-gui axios axios-mock-adapter`

2. **Import** (in your main.tsx/index.tsx):
   ```tsx
   import 'api-mock-gui/auto';                  // ✅ Auto-initialization  
   import 'api-mock-gui/dist/styles.css';       // ✅ Required CSS styles
   ```

3. **Run dev server**: `npm run dev`

4. **Use the GUI**: 
   - Click blue floating button (bottom-right)
   - Click "Start" to start mock server
   - Click "Add API" to create your first mock
   - Fill: Method=`GET`, Path=`/api/users`
   - Now `axios.get('/api/users')` returns mock data!

**No additional axios-mock-adapter setup needed!** 🎉

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Usage Guide](USAGE_GUIDE.md) - Detailed usage instructions
- [GitHub Repository](https://github.com/Quiet-Frontiers/apiMockGui)
- [NPM Package](https://www.npmjs.com/package/api-mock-gui)

### Programmatic Control

```tsx
import { createMockServer, MockApi } from 'api-mock-gui';

const mockServer = createMockServer({
  baseUrl: 'https://api.example.com',
  environment: 'browser'
});

const apis: MockApi[] = [
  {
    id: 'users-api',
    name: 'Users API',
    method: 'GET',
    path: '/api/users',
    cases: [
      {
        id: 'success',
        name: 'Success',
        status: 200,
        body: { users: [] },
        isActive: true
      }
    ],
    isEnabled: true
  }
];

await mockServer.start();
mockServer.updateHandlers(apis);
```

### Global Functions

```tsx
// Manual control via window functions
window.apiMockGuiInit();     // Initialize manually
window.apiMockGuiCleanup();  // Clean up resources
```

## 🛠️ Environment Configuration

### Development (Auto-enabled)

The GUI activates automatically when any of these conditions are met:
- `localhost` or `127.0.0.1`
- Private IP addresses (`192.168.x.x`, `10.x.x.x`, `172.x.x.x`)
- URLs with port numbers
- `file://` protocol
- `NODE_ENV=development`
- URL parameter `?dev=true`

### Production (Manual activation)

```tsx
// Force enable in production
localStorage.setItem('apiMockGui.forceEnable', 'true');

// Or use URL parameter
// https://yoursite.com?dev=true
```

## 🐛 Troubleshooting

### 🚫 No Floating Button Appears

**Possible causes:**
1. **Not in development environment**
   ```bash
   # Check current URL in browser console
   console.log(window.location.href);
   
   # Force enable if needed
   localStorage.setItem('apiMockGui.forceEnable', 'true');
   # Refresh page
   ```

2. **React not available**
   ```bash
   # Check browser console for errors like:
   # "React not available after maximum attempts"
   ```

### 🖱️ Buttons Not Clickable

**Solutions:**
1. **CSS conflicts** - Check browser DevTools for CSS issues
2. **Z-index problems** - The button uses `z-index: 2147483647`
3. **JavaScript errors** - Check browser console for errors

### 🔌 Mock Not Working

**Step-by-step debugging:**

1. **Check server status**
   - Button should be **green** when server is running
   - If red/blue, click to start the server

2. **Verify API configuration**
   ```tsx
   // Your request
   axios.get('/api/users')
   
   // Mock configuration should match:
   // Method: GET
   // Path: /api/users (exactly)
   ```

3. **Check network tab**
   - Open browser DevTools → Network tab
   - Make the API request
   - Look for the request - it should NOT appear in network tab if mocked
   - If it appears, the mock is not intercepting it

4. **Check axios setup**
   ```tsx
   // This works
   import axios from 'axios';
   const api = axios.create({ baseURL: 'https://any-url.com' });
   api.get('/api/users'); // ✅ Will be mocked
   
   // This doesn't work
   fetch('/api/users'); // ❌ fetch() is not supported, use axios
   ```

### 🌐 Environment Issues

**Not activating in your environment?**
```tsx
// Check what's detected
console.log('Hostname:', window.location.hostname);
console.log('Port:', window.location.port);
console.log('Protocol:', window.location.protocol);

// Force activation
localStorage.setItem('apiMockGui.forceEnable', 'true');
window.location.reload();
```

### 📱 UI Issues

**Panel too small/large?**
```tsx
// Use manual component with custom size
<ApiMockManager
  panelWidth="1000px"
  panelHeight="800px"
  position="top-left"
/>
```

**Can't see the button on mobile?**
- Button is optimized for desktop development
- Use manual component for mobile testing

### ⚡ Performance Issues

**Slow response times?**
- Check if you have many APIs configured
- Disable unused APIs instead of deleting them
- Restart the mock server periodically
