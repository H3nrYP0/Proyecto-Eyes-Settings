// src/app/main.jsx - CORREGIDO
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './App.css'
import { ProveedoresProvider } from '../features/compras/context/ProveedoresContext.jsx'
import { ComprasProvider } from '../features/compras/context/ComprasContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ProveedoresProvider>
      <ComprasProvider>
        <App />
      </ComprasProvider>
    </ProveedoresProvider>
  </React.StrictMode>,
)