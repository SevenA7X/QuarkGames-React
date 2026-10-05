//Punto de entrada y renderizado: Utiliza createRoot para inyectar la aplicación completa dentro del elemento HTML con ID root.

//Enrutamiento web: Envuelve el componente principal (App) con BrowserRouter para habilitar la navegación SPA (Single Page Application) basada en rutas.

//Control y estilos: Incorpora React.StrictMode para validaciones adicionales en desarrollo y carga la hoja de estilos global (styles.css) junto con las dependencias necesarias.
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);