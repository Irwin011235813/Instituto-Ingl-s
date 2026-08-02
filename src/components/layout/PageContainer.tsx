import type { ReactNode } from 'react';

export function PageContainer({ children }: { children: ReactNode }) {
  return <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>;
}
