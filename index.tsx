import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');

if (container) {
  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log('App successfully mounted.');
  } catch (error) {
    console.error('Failed to mount React app:', error);
    container.innerHTML = `<div style="padding:20px; color:red;">Mount Error: ${error}</div>`;
  }
} else {
  console.error('Target container #root not found.');
}
