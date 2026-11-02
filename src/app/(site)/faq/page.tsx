import type { Metadata } from 'next';
import { FaqPageClient } from '@/components/faq/FaqPageClient';

export const metadata: Metadata = {
  title: 'FAQ',
  description:
    'Straight answers about deposits, prices, timelines and Google from Brike Web in Cape Town.',
  alternates: { canonical: '/faq' },
};

export default function FaqPage() {
  return <FaqPageClient />;
}
