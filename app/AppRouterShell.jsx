'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { MemoryRouter } from 'react-router-dom';
import App from '../src/App';
import { ProductProvider } from '../src/context/ProductContext';

function getCurrentEntry(pathname) {
  if (typeof window === 'undefined') return pathname;
  return `${window.location.pathname}${window.location.search}`;
}

export default function AppRouterShell() {
  const pathname = usePathname() || '/';
  const [initialEntry, setInitialEntry] = useState(() => getCurrentEntry(pathname));

  useEffect(() => {
    setInitialEntry(getCurrentEntry(pathname));
  }, [pathname]);

  return (
    <MemoryRouter key={initialEntry} initialEntries={[initialEntry]} initialIndex={0}>
      <ProductProvider>
        <App />
      </ProductProvider>
    </MemoryRouter>
  );
}
