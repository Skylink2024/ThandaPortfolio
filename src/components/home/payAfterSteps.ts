/** The 4 pay-after steps, used by PayAfterTimeline. */
export interface PayAfterStep {
  title: string;
  body: string;
}

export const payAfterSteps: PayAfterStep[] = [
  {
    title: 'Tell me about your business.',
    body: 'A quick WhatsApp chat or use the builder. Share your logo, photos and what you sell.',
  },
  {
    title: 'I build your site. No deposit.',
    body: 'You get a working preview link, usually within days.',
  },
  {
    title: 'You review and ask for changes.',
    body: 'Tell me what to tweak. We polish it together until it feels right.',
  },
  {
    title: 'You pay only when you approve.',
    body: 'Happy? Pay, and your website goes live on your domain.',
  },
];
