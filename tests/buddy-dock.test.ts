import { describe, expect, it } from 'vitest';
import { clampDrag, dockInsets, dockToWall, nearerSide } from '../src/lib/buddy-dock';

const viewport = { width: 1366, height: 768 };
const size = { width: 64, height: 64 };

describe('buddy docking', () => {
  it('picks the nearer wall, and the exact centre goes left', () => {
    expect(nearerSide(100, 1366)).toBe('left');
    expect(nearerSide(1366 / 2, 1366)).toBe('left');
    expect(nearerSide(1366 / 2 + 1, 1366)).toBe('right');
  });

  it('never leaves the character in the middle of the viewport', () => {
    for (let x = -40; x <= viewport.width; x += 40) {
      const docked = dockToWall({ x, y: 300, ...size }, viewport, dockInsets(false, 'left'));
      const center = docked.x + size.width / 2;
      expect(center < viewport.width * 0.25 || center > viewport.width * 0.75).toBe(true);
      expect(docked.x === 8 || docked.x === viewport.width - size.width - 8).toBe(true);
    }
  });

  it('docks a right-of-centre release to the right wall', () => {
    const docked = dockToWall({ x: 900, y: 240, ...size }, viewport, dockInsets(false, 'right'));
    expect(docked.side).toBe('right');
    expect(docked.x).toBe(viewport.width - size.width - 8);
    expect(docked.y).toBe(240);
  });

  it('keeps a low right-side dock above the WhatsApp button', () => {
    const docked = dockToWall(
      { x: 1200, y: 740, ...size },
      viewport,
      dockInsets(false, 'right'),
      'right',
    );
    expect(docked.y).toBe(viewport.height - size.height - 112);
  });

  it('clamps the top under the navbar', () => {
    const docked = dockToWall(
      { x: 20, y: 0, ...size },
      viewport,
      dockInsets(false, 'left'),
      'left',
    );
    expect(docked.side).toBe('left');
    expect(docked.x).toBe(8);
    expect(docked.y).toBe(84);
  });

  it('allows the middle of the page while dragging', () => {
    expect(clampDrag(600, 400, size, viewport)).toEqual({ x: 600, y: 400 });
  });
});
