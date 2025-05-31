import { jsx as _jsx } from "react/jsx-runtime";
import 'api-mock-gui/auto';
import 'api-mock-gui/dist/styles.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
createRoot(document.getElementById('root')).render(_jsx(StrictMode, { children: _jsx(App, {}) }));
