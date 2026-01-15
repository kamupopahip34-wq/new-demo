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
    console.log('EarnTask Pro successfully mounted.');
  } catch (error) {
    console.error('Fatal Mounting Error:', error);
    container.innerHTML = `
      <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; font-family:sans-serif; text-align:center; padding:20px;">
        <h2 style="color:#ef4444; font-weight:900;">MOUNTING FAILURE</h2>
        <p style="color:#64748b; margin-top:10px;">${error instanceof Error ? error.message : String(error)}</p>
        <button onclick="location.reload()" style="margin-top:20px; padding:10px 20px; background:#6366f1; color:white; border:none; border-radius:8px; font-weight:bold; cursor:pointer;">RETRY</button>
      </div>`;
  }
} else {
  console.error('Critical Error: Element with ID "root" was not found in the DOM.');
}