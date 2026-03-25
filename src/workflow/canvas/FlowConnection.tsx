/**
 * FlowConnection — Connection type definitions for in-progress edge drawing.
 *
 * Mirrors the web connection line component. In the WebView bridge,
 * connections are rendered inside the WebView as SVG paths. This module
 * provides the type and a helper to compute the cubic bezier path string.
 */

/* ---------------------------------- Types --------------------------------- */

type FlowConnectionLine = {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
};

/* --------------------------------- Helper --------------------------------- */

const HALF = 0.5;

/**
 * Compute a cubic bezier SVG path string for a connection line
 * matching the web connection component's path calculation.
 */
function getConnectionPath({ fromX, fromY, toX, toY }: FlowConnectionLine): string {
  const cx = fromX + (toX - fromX) * HALF;
  return `M${fromX},${fromY} C ${cx},${fromY} ${cx},${toY} ${toX},${toY}`;
}

export {
  getConnectionPath,
  type FlowConnectionLine,
};
