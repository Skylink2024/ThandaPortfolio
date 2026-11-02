import type { Metadata } from 'next';
import { ContactDetails, ContactForm } from '@/components/contact/ContactForm';
import { PageHeader } from '@/components/ui/PageHeader';
import { Section } from '@/components/ui/Section';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Contact Brike Web in Cape Town. Tell me about your business — I usually reply the same day. WhatsApp or email.',
  alternates: { canonical: '/contact' },
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ d?: string; design?: string }>;
}) {
  const params = await searchParams;
  const designCode = params.design?.trim() || params.d?.trim() || undefined;

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Let's build your website"
        subtitle="Tell me about your business. I usually reply the same day."
      />
      <Section tone="default">
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <ContactDetails />
          </div>
          <div className="lg:col-span-7">
            <ContactForm designCode={designCode} />
          </div>
        </div>
      </Section>
    </>
  );
}
