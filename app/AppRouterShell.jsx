'use client';

import { Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { MemoryRouter } from 'react-router-dom';
import App from '../src/App';
import { ProductProvider } from '../src/context/ProductContext';

function AppRouterShellContent() {
  const pathname = usePathname() || '/';
  const searchParams = useSearchParams();
  const search = searchParams.toString();
  const initialEntry = search ? `${pathname}?${search}` : pathname;

  return (
    <MemoryRouter key={initialEntry} initialEntries={[initialEntry]} initialIndex={0}>
      <ProductProvider>
        <App />
      </ProductProvider>
    </MemoryRouter>
  );
}

export default function AppRouterShell() {
  return (
    <Suspense fallback={null}>
      <AppRouterShellContent />
    </Suspense>
  );
}
