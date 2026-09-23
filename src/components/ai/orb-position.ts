export interface OrbArea {
  width: number;
  height: number;
}

export interface OrbPoint {
  x: number;
  y: number;
}

/** Distance kept between the orb and the edges of its area. */
export const ORB_MARGIN = 8;
/** Default resting place: right edge, just above the bottom limit (reference `.cau`: right 18). */
export const ORB_DEFAULT_RIGHT = 18;
export const ORB_DEFAULT_GAP = 20;
/** Finger travel (px) below which a touch is a tap, not a drag. */
export const ORB_DRAG_THRESHOLD = 6;

/**
 * Keeps the orb fully inside the visible area: `reservedTop` is the status-bar inset,
 * `reservedBottom` the bottom tab bar, so it can never end up behind either.
 */
export function clampOrbPosition(point: OrbPoint, area: OrbArea, size: number, reservedTop: number, reservedBottom: number): OrbPoint {
  const minX = ORB_MARGIN;
  const maxX = Math.max(minX, area.width - size - ORB_MARGIN);
  const minY = reservedTop + ORB_MARGIN;
  const maxY = Math.max(minY, area.height - reservedBottom - size - ORB_MARGIN);
  return { x: Math.min(Math.max(point.x, minX), maxX), y: Math.min(Math.max(point.y, minY), maxY) };
}

export const defaultOrbPosition = (area: OrbArea, size: number, reservedBottom: number): OrbPoint => ({
  x: area.width - size - ORB_DEFAULT_RIGHT,
  y: area.height - reservedBottom - size - ORB_DEFAULT_GAP,
});

/** A touch counts as a drag once it travelled further than the threshold. */
export const isOrbDrag = (dx: number, dy: number): boolean => Math.abs(dx) > ORB_DRAG_THRESHOLD || Math.abs(dy) > ORB_DRAG_THRESHOLD;
