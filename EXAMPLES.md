# 🚀 Examples & Integration Guide

This document provides practical examples for integrating API Mock GUI into different frameworks and scenarios.

## 📋 Table of Contents

- [React + Vite](#react--vite)
- [React + Create React App](#react--create-react-app)
- [Next.js](#nextjs)
- [Vue.js](#vuejs)
- [Common Use Cases](#common-use-cases)
- [Best Practices](#best-practices)

## React + Vite

### Complete Setup

```bash
# 1. Create new Vite project
npm create vite@latest my-app -- --template react-ts
cd my-app

# 2. Install dependencies
npm install
npm install api-mock-gui axios axios-mock-adapter

# 3. Start development
npm run dev
```

### Configuration

```tsx
// src/main.tsx
import 'api-mock-gui/auto';
import 'api-mock-gui/dist/styles.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### Usage Example

```tsx
// src/App.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com'
});

interface User {
  id: number;
  name: string;
  email: string;
}

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (err) {
      setError('Failed to fetch users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>API Mock GUI Demo</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={fetchUsers}>Refresh Users</button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <div>
        <h2>Users ({users.length})</h2>
        {users.map(user => (
          <div key={user.id} style={{ 
            border: '1px solid #ccc', 
            padding: '10px', 
            margin: '5px 0',
            borderRadius: '4px'
          }}>
            <strong>{user.name}</strong> - {user.email}
          </div>
        ))}
      </div>

      <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#f0f0f0' }}>
        <h3>🎭 Try the Mock!</h3>
        <ol>
          <li>Click the blue floating button (bottom-right)</li>
          <li>Click "Start" to start mock server</li>
          <li>Click "Add API" and configure:
            <ul>
              <li>Method: GET</li>
              <li>Path: /users</li>
              <li>Name: Mock Users</li>
            </ul>
          </li>
          <li>Click "Refresh Users" button above</li>
          <li>See mock data instead of real API!</li>
        </ol>
      </div>
    </div>
  );
}

export default App;
```

## React + Create React App

### Setup

```bash
# 1. Create new CRA project
npx create-react-app my-app --template typescript
cd my-app

# 2. Install dependencies
npm install api-mock-gui axios axios-mock-adapter
```

### Configuration

```tsx
// src/index.tsx
import 'api-mock-gui/auto';
import 'api-mock-gui/dist/styles.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

## Next.js

### App Router (Next.js 13+)

```tsx
// app/layout.tsx
import 'api-mock-gui/auto';
import 'api-mock-gui/dist/styles.css';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

### Pages Router (Next.js 12 and below)

```tsx
// pages/_app.tsx
import 'api-mock-gui/auto';
import 'api-mock-gui/dist/styles.css';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
```

### API Usage in Next.js

```tsx
// pages/users.tsx or app/users/page.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://api.example.com'
});

export default function UsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get('/users').then(res => setUsers(res.data));
  }, []);

  return (
    <div>
      <h1>Users</h1>
      {users.map((user: any) => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

## Vue.js

### Vue 3 + Vite

```bash
# 1. Create Vue project
npm create vue@latest my-app
cd my-app

# 2. Install dependencies
npm install
npm install api-mock-gui axios axios-mock-adapter
```

```typescript
// src/main.ts
import 'api-mock-gui/auto';
import 'api-mock-gui/dist/styles.css';

import { createApp } from 'vue';
import App from './App.vue';

createApp(App).mount('#app');
```

```vue
<!-- src/App.vue -->
<template>
  <div>
    <h1>Vue.js with API Mock GUI</h1>
    <button @click="fetchUsers">Fetch Users</button>
    
    <div v-if="loading">Loading...</div>
    <div v-else>
      <div v-for="user in users" :key="user.id">
        {{ user.name }} - {{ user.email }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com'
});

const users = ref([]);
const loading = ref(false);

const fetchUsers = async () => {
  loading.value = true;
  try {
    const response = await api.get('/users');
    users.value = response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
  } finally {
    loading.value = false;
  }
};
</script>
```

## Common Use Cases

### 1. User Authentication Flow

```tsx
// Mock login API
const authApi = axios.create({
  baseURL: 'https://api.yourapp.com'
});

// In your login component
const handleLogin = async (credentials: LoginCredentials) => {
  try {
    const response = await authApi.post('/auth/login', credentials);
    // This can be mocked to return different responses:
    // - Success: { token: 'abc123', user: {...} }
    // - Error: { error: 'Invalid credentials' }
    // - Server Error: 500 status code
    
    localStorage.setItem('token', response.data.token);
    navigate('/dashboard');
  } catch (error) {
    setError('Login failed');
  }
};
```

**Mock Configuration:**
- **Path**: `/auth/login`
- **Method**: `POST`
- **Success Response**: `{ "token": "mock-jwt-token", "user": { "id": 1, "name": "Test User" } }`
- **Error Response**: `{ "error": "Invalid credentials" }` with 401 status

### 2. CRUD Operations

```tsx
// Users CRUD
const usersApi = axios.create({
  baseURL: 'https://api.yourapp.com'
});

// Create user
const createUser = (userData: CreateUserData) => 
  usersApi.post('/users', userData);

// Get users list
const getUsers = () => 
  usersApi.get('/users');

// Get single user
const getUser = (id: string) => 
  usersApi.get(`/users/${id}`);

// Update user
const updateUser = (id: string, userData: UpdateUserData) => 
  usersApi.put(`/users/${id}`, userData);

// Delete user
const deleteUser = (id: string) => 
  usersApi.delete(`/users/${id}`);
```

**Mock APIs to Configure:**
1. `GET /users` → List of users
2. `POST /users` → Create user response
3. `GET /users/:id` → Single user (use `/users/1` for testing)
4. `PUT /users/:id` → Update confirmation
5. `DELETE /users/:id` → Delete confirmation

### 3. Error Handling Scenarios

```tsx
const api = axios.create({
  baseURL: 'https://api.yourapp.com'
});

// Test different error scenarios
const fetchData = async () => {
  try {
    const response = await api.get('/data');
    setData(response.data);
  } catch (error) {
    if (error.response?.status === 404) {
      setError('Data not found');
    } else if (error.response?.status === 500) {
      setError('Server error occurred');
    } else if (error.response?.status === 401) {
      setError('Unauthorized access');
      // Redirect to login
    } else {
      setError('Network error');
    }
  }
};
```

**Mock Different Error Responses:**
- **200**: `{ "data": [...] }` (Success)
- **404**: `{ "error": "Not found" }` (Not Found)
- **500**: `{ "error": "Internal server error" }` (Server Error)
- **401**: `{ "error": "Unauthorized" }` (Auth Error)

## Best Practices

### 1. Environment-based Configuration

```tsx
// config/api.ts
const getBaseURL = () => {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000/api';
  }
  return 'https://api.production.com';
};

export const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 5000,
});
```

### 2. Interceptors with Mocking

```tsx
// Setup request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### 3. TypeScript Integration

```tsx
// types/api.ts
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

// services/userService.ts
export const userService = {
  getUsers: (): Promise<ApiResponse<User[]>> => 
    api.get('/users'),
    
  createUser: (user: Omit<User, 'id'>): Promise<ApiResponse<User>> => 
    api.post('/users', user),
};
```

### 4. Testing with Mocks

```tsx
// __tests__/UserList.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import UserList from '../UserList';

// Mock data to configure in API Mock GUI
const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
];

test('displays users when API returns data', async () => {
  // Configure Mock GUI to return mockUsers for GET /users
  
  render(<UserList />);
  
  await waitFor(() => {
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });
});
```

### 5. Development vs Production

```tsx
// Only load API Mock GUI in development
if (process.env.NODE_ENV === 'development') {
  import('api-mock-gui/auto');
  import('api-mock-gui/dist/styles.css');
}
```

## 🎯 Quick Tips

1. **Always import CSS**: `import 'api-mock-gui/dist/styles.css'`
2. **Use axios**: fetch() API is not supported
3. **Match paths exactly**: `/api/users` ≠ `/users`
4. **Check server status**: Button should be green when active
5. **Use Network tab**: Mocked requests won't appear in browser network tab
6. **Force enable**: `localStorage.setItem('apiMockGui.forceEnable', 'true')` 