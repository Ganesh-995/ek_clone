'use client';

import { BrowserRouter } from 'react-router-dom';
import App from '../src/App';
import { ProductProvider } from '../src/context/ProductContext';

export default function AppRouterShell() {
  return (
    <BrowserRouter>
      <ProductProvider>
        <App />
      </ProductProvider>
    </BrowserRouter>
  );
}
