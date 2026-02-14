import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// PWA Service Worker is handled by vite-plugin-pwa auto-injection.
// Manual registration removed to ensure preview stability.

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error("Root element not found");

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);