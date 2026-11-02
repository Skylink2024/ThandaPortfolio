import { Button } from '@/components/ui/Button';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { site } from '@data/site';

export default function HomePage() {
  return (
    <Section id="hero" tone="default">
      <SectionHeading
        eyebrow="Web design · Cape Town"
        title={site.tagline}
        subtitle={site.description}
      />
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button href="/build" size="lg">
          Design my website
        </Button>
        <Button href="/pricing" variant="outline" size="lg">
          See pricing
        </Button>
      </div>
    </Section>
  );
}
