import { preload } from 'react-dom';
import { Suspense } from 'react';
import { Hero } from '@/components/home/Hero';
import { WorkShowcase } from '@/components/home/WorkShowcase';
import { Services } from '@/components/home/Services';
import { PayAfterTimeline } from '@/components/pricing/PayAfterTimeline';
import { MeetThanda } from '@/components/home/MeetThanda';
import { Testimonials } from '@/components/home/Testimonials';
import { FinalCta } from '@/components/home/FinalCta';
import {
  getPublicAbout,
  getPublicCmsProjects,
  portraitSrc,
  socialsFromAbout,
} from '@/lib/public-content';

export default function HomePage() {
  preload('/hero-gradient.jpg', { as: 'image', fetchPriority: 'high' });

  return (
    <>
      <Hero />
      <Suspense>
        <HomeBelow />
      </Suspense>
    </>
  );
}

async function HomeBelow() {
  const [about, cmsProjects] = await Promise.all([
    getPublicAbout(),
    getPublicCmsProjects(),
  ]);

  return (
    <>
      <WorkShowcase cmsProjects={cmsProjects} index="01" />
      <Services index="02" />
      <PayAfterTimeline index="03" />
      <MeetThanda
        about={about}
        socials={socialsFromAbout(about)}
        photoSrc={portraitSrc(about)}
        index="04"
      />
      <Testimonials />
      <FinalCta />
    </>
  );
}
