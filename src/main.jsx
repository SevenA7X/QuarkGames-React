import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
// Importa los estilos globales de Bootstrap desde node_modules
import 'bootstrap/dist/css/bootstrap.min.css';
// Mantiene los estilos personalizados del proyecto
import './styles.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);