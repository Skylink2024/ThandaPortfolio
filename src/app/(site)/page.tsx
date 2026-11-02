import { Hero } from '@/components/home/Hero';
import { StatsStrip } from '@/components/home/StatsStrip';
import { IndustryMarquee } from '@/components/home/IndustryMarquee';
import { HowItWorks } from '@/components/home/HowItWorks';
import { BuilderTeaser } from '@/components/home/BuilderTeaser';
import { PackagesPreview } from '@/components/home/PackagesPreview';
import { BeforeAfter } from '@/components/home/BeforeAfter';
import { WhyBrikeWeb } from '@/components/home/WhyBrikeWeb';
import { WorkShowcase } from '@/components/home/WorkShowcase';
import { MeetThanda } from '@/components/home/MeetThanda';
import { Testimonials } from '@/components/home/Testimonials';
import { FaqPreview } from '@/components/home/FaqPreview';
import { FinalCta } from '@/components/home/FinalCta';

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsStrip />
      <IndustryMarquee />
      <HowItWorks />
      <BuilderTeaser />
      <PackagesPreview />
      <BeforeAfter />
      <WhyBrikeWeb />
      <WorkShowcase />
      <MeetThanda />
      <Testimonials />
      <FaqPreview />
      <FinalCta />
    </>
  );
}
