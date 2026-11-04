import { Quote } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { testimonials } from '@data/testimonials';

/** Real client testimonials only. Renders nothing while the data file is empty. */
export function Testimonials() {
  if (testimonials.length === 0) return null;

  return (
    <Section id="testimonials" tone="default">
      <SectionHeading eyebrow="Kind words" title="What clients say" />
      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.slice(0, 3).map((t) => (
          <li key={t.id}>
            <Reveal className="h-full">
              <Card className="flex h-full flex-col">
                <Quote className="text-blue size-6" aria-hidden="true" />
                <blockquote className="mt-4 flex-1 text-gray-700">“{t.quote}”</blockquote>
                <figcaption className="text-small mt-5">
                  <span className="font-semibold text-gray-900">{t.name}</span>
                  <span className="text-gray-500">, {t.business}</span>
                  {t.sourceUrl ? (
                    <>
                      {' · '}
                      <a
                        href={t.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-link hover:underline"
                      >
                        Source
                      </a>
                    </>
                  ) : null}
                </figcaption>
              </Card>
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  );
}
