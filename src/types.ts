/**
 * A cubic bezier easing definition: [x1, y1, x2, y2],
 * the coordinates of the two control points.
 */
export type BezierValue = [number, number, number, number];

/**
 * Padding around the grid: [top, right, bottom, left] in pixels.
 */
export type Padding = [number, number, number, number];

/** Pixel coordinates of the grid corners, mapping the unit interval. */
export interface Projection {
  xFrom: number;
  yFrom: number;
  xTo: number;
  yTo: number;
}

function interp(a: number, b: number, t: number): number {
  return a * (1 - t) + b * t;
}

export function projectX({ xFrom, xTo }: Projection, value: number): number {
  return Math.round(interp(xFrom, xTo, value));
}

export function projectY({ yFrom, yTo }: Projection, value: number): number {
  return Math.round(interp(yFrom, yTo, value));
}
