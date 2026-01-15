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
    // Directly inject error if React fails to mount
    container.innerHTML = `<div style="padding:40px; text-align:center; font-family:sans-serif; color:#ef4444;">
      <h2 style="font-weight:900;">MOUNTING FAILURE</h2>
      <p style="color:#64748b;">${error instanceof Error ? error.message : String(error)}</p>
    </div>`;
  }
} else {
  console.error('Target container #root not found.');
}