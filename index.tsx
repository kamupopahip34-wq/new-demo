import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const init = () => {
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    console.error('Critical Failure: Root element not found in the DOM.');
    return;
  }

  try {
    const root = createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log('Application initialized successfully.');
  } catch (err) {
    console.error('Mounting Error:', err);
    rootElement.innerHTML = `<div style="padding:40px; text-align:center; font-family:sans-serif;">
      <h2 style="color:#ef4444;">Initialization Error</h2>
      <p>${err instanceof Error ? err.message : String(err)}</p>
    </div>`;
  }
};

// Run when the DOM is ready
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  init();
} else {
  document.addEventListener('DOMContentLoaded', init);
}
