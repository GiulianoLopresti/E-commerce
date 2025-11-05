import 'bootstrap/dist/css/bootstrap.min.css'

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ECommerceApp } from './EcommerceApp';
import './index.css'; // O tus estilos
import './styles/global.css'; // Estilos globales personalizados

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ECommerceApp /> {/* <-- (2) Renderizamos el Cerebro */}
    </BrowserRouter>
  </React.StrictMode>
);