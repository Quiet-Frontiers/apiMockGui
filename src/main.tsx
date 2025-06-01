import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// React 기반 auto-init (업데이트된 컴포넌트 사용)
import 'api-mock-gui/auto';
import 'api-mock-gui/dist/styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
); 