import { describe, expect, it } from 'vitest';
import { ONCE_OFF_CAP } from '../data/pricing';

describe('pricing data (phase 0)', () => {
  it('caps once-off at 15000', () => {
    expect(ONCE_OFF_CAP).toBe(15_000);
  });
});
