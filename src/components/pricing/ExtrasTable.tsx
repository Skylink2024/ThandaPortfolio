import { Badge } from '@/components/ui/Badge';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { formatPrice } from '@/lib/pricing';
import { extras, type Extra } from '@data/pricing';

interface Group {
  key: Extra['group'];
  id?: string;
  title: string;
  /** Display order of extras inside the group. */
  order: Extra['id'][];
}

const groups: Group[] = [
  {
    key: 'essentials',
    title: 'Essentials',
    order: ['domain', 'hostingBasic', 'hostingBusiness', 'extraPage'],
  },
  {
    key: 'google',
    id: 'seo',
    title: 'Get found on Google',
    order: ['gbpSetup', 'gbpCare', 'seoOnce', 'localSeo', 'googleStarter'],
  },
  {
    key: 'support',
    id: 'care',
    title: 'Support & care',
    order: ['care', 'extraChanges'],
  },
];

function PriceCell({ extra }: { extra: Extra }) {
  return <span className="font-mono font-medium text-gray-900">{formatPrice(extra.price, extra.billing)}</span>;
}

export function ExtrasTable() {
  return (
    <Section id="extras" tone="surface" className="scroll-mt-20">
      <SectionHeading
        eyebrow="Extras"
        title="Add only what you need"
        subtitle="Everything is optional. Pick extras now or add them later."
      />

      <div className="space-y-10">
        {groups.map((group) => {
          const items = group.order
            .map((id) => extras.find((e) => e.id === id))
            .filter((e): e is Extra => Boolean(e));
          const headingId = `extras-${group.key}`;

          return (
            <Reveal key={group.key}>
              <section id={group.id} aria-labelledby={headingId} className="scroll-mt-24">
                <h3 id={headingId} className="text-h3 mb-4 text-gray-900">
                  {group.title}
                </h3>

                {/* Desktop table */}
                <div className="border-border bg-bg hidden overflow-hidden rounded-[var(--radius-lg)] border md:block">
                  <table className="w-full text-left">
                    <caption className="sr-only">{group.title}</caption>
                    <thead className="bg-surface-2 text-micro tracking-wide text-gray-500 uppercase">
                      <tr>
                        <th scope="col" className="w-1/4 px-5 py-3 font-semibold">
                          Extra
                        </th>
                        <th scope="col" className="px-5 py-3 font-semibold">
                          What it does
                        </th>
                        <th scope="col" className="w-48 px-5 py-3 text-right font-semibold">
                          Price
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-border divide-y">
                      {items.map((extra) => (
                        <tr key={extra.id}>
                          <th scope="row" className="px-5 py-4 align-top font-semibold text-gray-900">
                            {extra.name}
                            {extra.includedInPackages?.length ? (
                              <Badge tone="success" className="ml-2 align-middle">
                                In Get Found on Google
                              </Badge>
                            ) : null}
                          </th>
                          <td className="text-small px-5 py-4 align-top text-gray-700">
                            {extra.description}
                          </td>
                          <td className="px-5 py-4 text-right align-top whitespace-nowrap">
                            <PriceCell extra={extra} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile stacked cards */}
                <ul className="space-y-3 md:hidden">
                  {items.map((extra) => (
                    <li
                      key={extra.id}
                      className="border-border bg-bg rounded-[var(--radius-lg)] border p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="font-semibold text-gray-900">{extra.name}</p>
                        <PriceCell extra={extra} />
                      </div>
                      <p className="text-small mt-1.5 text-gray-700">{extra.description}</p>
                      {extra.includedInPackages?.length ? (
                        <Badge tone="success" className="mt-2">
                          In Get Found on Google
                        </Badge>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </section>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
