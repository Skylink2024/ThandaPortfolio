'use client';

import { useEffect, useRef } from 'react';

/**
 * Soft colour glow behind the public site.
 * Shifts blue → sky → peach as you scroll, eases toward the pointer/finger,
 * and drifts slightly with phone tilt.
 */
export function AmbientField() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const target = { x: 0.7, y: 0.3, tx: 0, ty: 0 };
    const current = { ...target };
    let frame = 0;

    function onPointer(e: PointerEvent) {
      target.x = e.clientX / window.innerWidth;
      target.y = e.clientY / window.innerHeight;
    }

    function onTilt(e: DeviceOrientationEvent) {
      if (e.gamma == null || e.beta == null) return;
      target.tx = Math.max(-1, Math.min(1, e.gamma / 30));
      target.ty = Math.max(-1, Math.min(1, (e.beta - 45) / 30));
    }

    function tick() {
      current.x += (target.x - current.x) * 0.06;
      current.y += (target.y - current.y) * 0.06;
      current.tx += (target.tx - current.tx) * 0.05;
      current.ty += (target.ty - current.ty) * 0.05;

      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;

      el!.style.setProperty('--mx', `${(current.x * 100).toFixed(2)}%`);
      el!.style.setProperty('--my', `${(current.y * 100).toFixed(2)}%`);
      el!.style.setProperty('--tx', `${(current.tx * 40).toFixed(1)}px`);
      el!.style.setProperty('--ty', `${(current.ty * 40).toFixed(1)}px`);
      el!.style.setProperty('--p', p.toFixed(3));
      frame = requestAnimationFrame(tick);
    }

    window.addEventListener('pointermove', onPointer, { passive: true });
    window.addEventListener('pointerdown', onPointer, { passive: true });
    window.addEventListener('deviceorientation', onTilt, { passive: true });
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('pointerdown', onPointer);
      window.removeEventListener('deviceorientation', onTilt);
    };
  }, []);

  return (
    <div ref={ref} className="ambient-field pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="ambient-layer">
        <span className="ambient-orb ambient-orb-1" />
        <span className="ambient-orb ambient-orb-2" />
        <span className="ambient-orb ambient-orb-3" />
      </div>
      <span className="ambient-touch" />
    </div>
  );
}
