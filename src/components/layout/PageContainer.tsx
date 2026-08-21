import type { ReactNode } from 'react';

export function PageContainer({ children }: { children: ReactNode }) {
  return <main className="max-w-6xl mx-auto px-5 py-8 lg:px-10 lg:py-10">{children}</main>;
}