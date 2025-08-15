import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './auth/AuthContext';
import './css/index.css';
import './css/sidebar.css';
import './css/lightmode.css';
import './css/darkmode.css';
import './css/calendar.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider>
    <App />
  </AuthProvider>
  // <React.StrictMode>
  //   <App />
  // </React.StrictMode>
); 