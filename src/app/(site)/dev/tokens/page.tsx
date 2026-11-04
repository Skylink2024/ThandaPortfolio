import type { Metadata } from 'next';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { formatZAR } from '@/lib/format';

export const metadata: Metadata = {
  title: 'Design tokens | Brike Web (dev)',
  robots: { index: false, follow: false },
};

const colours = [
  'navy',
  'navy-900',
  'navy-700',
  'blue',
  'blue-600',
  'blue-100',
  'orange',
  'orange-ink',
  'link',
  'bg',
  'surface',
  'surface-2',
  'border',
  'gray-900',
  'gray-700',
  'gray-500',
  'gray-300',
  'success',
  'warning',
  'danger',
  'whatsapp',
] as const;

const typeSamples = [
  { label: 'display', className: 'text-display' },
  { label: 'h1', className: 'text-h1' },
  { label: 'h2', className: 'text-h2' },
  { label: 'h3', className: 'text-h3' },
  { label: 'lead', className: 'text-lead' },
  { label: 'body', className: '' },
  { label: 'small', className: 'text-small' },
  { label: 'micro', className: 'text-micro' },
] as const;

export default function DevTokensPage() {
  return (
    <div>
      <Section>
        <div className="mb-8 flex items-center justify-between gap-4">
          <SectionHeading
            eyebrow="Dev only"
            title="Design tokens"
            subtitle="Colour, type, buttons and cards. Noindex."
          />
          <ThemeToggle />
        </div>

        <h3 className="mb-4 text-h3">Colours</h3>
        <div className="mb-12 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {colours.map((name) => (
            <div key={name} className="overflow-hidden rounded-[var(--radius-md)] border border-border">
              <div className="h-16" style={{ background: `var(--${name})` }} />
              <p className="px-2 py-2 font-mono text-[11px] text-gray-700">--{name}</p>
            </div>
          ))}
        </div>

        <h3 className="mb-4 text-h3">Typography</h3>
        <div className="mb-12 space-y-4">
          {typeSamples.map((t) => (
            <div key={t.label}>
              <p className="mb-1 text-micro text-gray-500">{t.label}</p>
              <p className={t.className}>Your website first. {formatZAR(4500)}.</p>
            </div>
          ))}
        </div>

        <h3 className="mb-4 text-h3">Buttons</h3>
        <div className="mb-12 flex flex-wrap gap-3">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="whatsapp">WhatsApp</Button>
        </div>

        <h3 className="mb-4 text-h3">Cards</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <Badge tone="blue">Popular</Badge>
            <p className="mt-3 font-heading text-xl font-bold text-gray-900">Business</p>
            <p className="mt-2 text-gray-500">A complete website that shows everything you do.</p>
          </Card>
          <Card interactive>
            <p className="font-heading text-xl font-bold text-gray-900">Interactive</p>
            <p className="mt-2 text-gray-500">Hover to lift.</p>
          </Card>
          <Card className="bg-surface">
            <p className="font-heading text-xl font-bold text-gray-900">Surface</p>
            <p className="mt-2 text-gray-500">Alternate card tone.</p>
          </Card>
        </div>
      </Section>
    </div>
  );
}
