'use client';

import dynamic from 'next/dynamic';

const AppRouterShell = dynamic(() => import('./AppRouterShell'), { ssr: false });

export default function Page() {
  return <AppRouterShell />;
}
