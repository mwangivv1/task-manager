import React from 'react';
import ReactDOM from 'react-dom/client'; // Keep this as is
import App from './App';
import './index.css';

// 1. Select the root element from your HTML
const rootElement = document.getElementById('root');

// 2. Create the React root using the new 'createRoot' method
const root = ReactDOM.createRoot(rootElement);

// 3. Render your App to that root
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

