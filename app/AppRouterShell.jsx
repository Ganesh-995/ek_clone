'use client';

import { usePathname } from 'next/navigation';
import { MemoryRouter } from 'react-router-dom';
import App from '../src/App';
import { ProductProvider } from '../src/context/ProductContext';

export default function AppRouterShell() {
  const pathname = usePathname() || '/';

  return (
    <MemoryRouter initialEntries={[pathname]} initialIndex={0}>
      <ProductProvider>
        <App />
      </ProductProvider>
    </MemoryRouter>
  );
}
