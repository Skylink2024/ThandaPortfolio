import Link from 'next/link';
import { Accordion } from '@/components/ui/Accordion';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { faqs } from '@data/faq';

export function FaqPreview() {
  const items = faqs.slice(0, 4).map(({ id, question, answer }) => ({ id, question, answer }));

  return (
    <Section id="faq" tone="surface">
      <SectionHeading align="center" title="Questions, answered" />
      <Reveal className="mx-auto max-w-3xl">
        <Accordion items={items} />
        <p className="mt-6 text-center">
          <Link href="/faq" className="text-blue font-semibold underline-offset-4 hover:underline">
            All questions →
          </Link>
        </p>
      </Reveal>
    </Section>
  );
}
