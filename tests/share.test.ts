import { describe, expect, it } from 'vitest';
import { decodeDesign, encodeDesign, type SharedDesign } from '@/lib/share';

const sample: SharedDesign = {
  v: 1,
  b: {
    name: 'Ocean Fade',
    industry: 'barber',
    tagline: 'Sharp every time',
    location: 'Cape Town',
  },
  s: {
    presetId: 'bold',
    primary: '#FF3B30',
    accent: '#FFD60A',
    fontPairId: 'bold',
  },
  p: ['home', 'services', 'gallery', 'contact'],
  f: ['whatsapp', 'contactForm', 'maps'],
  e: ['domain', 'hostingBasic'],
  k: 'business',
};

describe('share encode/decode', () => {
  it('round-trips a design', () => {
    const code = encodeDesign(sample);
    expect(code.length).toBeGreaterThan(10);
    expect(code.length).toBeLessThan(1500);
    expect(decodeDesign(code)).toEqual(sample);
  });

  it('rejects tampered input', () => {
    expect(decodeDesign('not-a-real-code')).toBeNull();
    expect(decodeDesign('')).toBeNull();
  });
});
