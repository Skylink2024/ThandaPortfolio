export type DockSide = 'left' | 'right';

export interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Viewport {
  width: number;
  height: number;
}

export interface DockInsets {
  edge: number;
  top: number;
  bottom: number;
}

/** Left when the centre is on the midline, so a release never stays centred. */
export function nearerSide(centerX: number, viewportWidth: number): DockSide {
  return centerX <= viewportWidth / 2 ? 'left' : 'right';
}

export function dockInsets(mobile: boolean, side: DockSide): DockInsets {
  return {
    edge: 8,
    top: 84,
    bottom: mobile ? 112 : side === 'right' ? 112 : 16,
  };
}

/**
 * Park the box on the left or right edge. Vertical position is kept, clamped
 * clear of the header and the bottom actions.
 */
export function dockToWall(
  box: Box,
  viewport: Viewport,
  insets: DockInsets,
  side: DockSide = nearerSide(box.x + box.width / 2, viewport.width),
): { x: number; y: number; side: DockSide } {
  const x =
    side === 'left' ? insets.edge : Math.max(insets.edge, viewport.width - box.width - insets.edge);
  const minY = insets.top;
  const maxY = Math.max(minY, viewport.height - box.height - insets.bottom);
  const y = Math.min(maxY, Math.max(minY, box.y));
  return { x, y, side };
}

/** Keep a dragged box on screen, including the middle of the page. */
export function clampDrag(
  x: number,
  y: number,
  size: { width: number; height: number },
  viewport: Viewport,
  visible = 36,
): { x: number; y: number } {
  const minX = Math.min(0, visible - size.width);
  const maxX = Math.max(minX, viewport.width - visible);
  const minY = 0;
  const maxY = Math.max(minY, viewport.height - size.height);
  return {
    x: Math.min(maxX, Math.max(minX, x)),
    y: Math.min(maxY, Math.max(minY, y)),
  };
}
