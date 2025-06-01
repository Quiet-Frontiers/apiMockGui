import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// React 기반 auto-init (로컬 개발 버전 사용)
import './auto-init';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
); 