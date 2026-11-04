'use client';

import { useMemo, useState } from 'react';
import { Accordion } from '@/components/ui/Accordion';
import { Button } from '@/components/ui/Button';
import { Section } from '@/components/ui/Section';
import { PageHeader } from '@/components/ui/PageHeader';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';
import { cn } from '@/lib/cn';
import { site } from '@data/site';
import { faqs, type FaqItem } from '@data/faq';
import { whatsappLink } from '@/lib/whatsapp';

type Tag = FaqItem['tags'][number] | 'all';

const tags: { id: Tag; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'general', label: 'General' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'process', label: 'Process' },
];

export function FaqPageClient() {
  const [query, setQuery] = useState('');
  const [tag, setTag] = useState<Tag>('all');

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    return faqs.filter((f) => {
      const tagOk = tag === 'all' || f.tags.includes(tag);
      if (!tagOk) return false;
      if (!q) return true;
      return (
        f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q)
      );
    });
  }, [query, tag]);

  const waHref = whatsappLink(
    site.whatsappNumber,
    'Hi Thanda, I still have a question about Brike Web.',
  );

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        eyebrow="FAQ"
        title="Frequently asked questions"
        subtitle="Straight answers about deposits, prices, timelines and Google."
      />
      <Section tone="default">
        <div className="max-w-3xl space-y-6">
          <label className="block">
            <span className="text-micro text-gray-500">Search</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a keyword…"
              className="mt-2 h-12 w-full rounded-[var(--radius-md)] border border-border bg-bg px-4 text-gray-900 outline-none focus:border-navy"
            />
          </label>

          <div className="flex flex-wrap gap-2" role="tablist" aria-label="FAQ topics">
            {tags.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tag === t.id}
                onClick={() => setTag(t.id)}
                className={cn(
                  'h-10 rounded-full border px-4 text-sm transition-colors',
                  tag === t.id
                    ? 'border-gray-900 bg-gray-900 text-bg'
                    : 'border-border bg-bg text-gray-700 hover:border-gray-900',
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          {items.length === 0 ? (
            <p className="text-gray-500">No questions match that search.</p>
          ) : (
            <Accordion items={items} />
          )}

          <div className="border-border flex flex-col gap-4 border-t pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-h3 text-gray-900">Still have a question?</p>
            <Button href={waHref} variant="whatsapp" icon={<WhatsAppIcon />}>
              WhatsApp me
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
