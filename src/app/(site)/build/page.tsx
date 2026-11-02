import type { Metadata } from 'next';
import { Suspense } from 'react';
import { BuilderShell } from '@/components/builder/BuilderShell';

export const metadata: Metadata = {
  title: 'Design your website',
  description:
    'Build a preview of your website and see the price live. Free, no sign-up. Pay nothing until you love it.',
  alternates: { canonical: '/build' },
};

export default function BuildPage() {
  return (
    <Suspense
      fallback={
        <div className="container-brike py-28 text-gray-500">Loading designer…</div>
      }
    >
      <BuilderShell />
    </Suspense>
  );
}
