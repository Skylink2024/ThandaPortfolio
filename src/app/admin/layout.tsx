import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
};

/** Admin shell — no public navbar/footer. Uses Brike navy tokens via admin CSS aliases. */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="admin-shell min-h-screen bg-navy-900 text-cream">{children}</div>;
}
