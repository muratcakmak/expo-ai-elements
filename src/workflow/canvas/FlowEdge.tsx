/**
 * FlowEdge — Edge type definitions for the flow graph.
 *
 * In the WebView-based canvas, edges are rendered inside the WebView.
 * These types and configuration helpers allow the host app to describe
 * edge styles and pass them through the bridge.
 */

/* ---------------------------------- Types --------------------------------- */

type FlowPosition = 'left' | 'right' | 'top' | 'bottom';

type FlowEdgeStyle = {
  stroke?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
};

type FlowEdgeConfig = {
  id: string;
  source: string;
  target: string;
  type?: 'default' | 'animated' | 'temporary';
  sourcePosition?: FlowPosition;
  targetPosition?: FlowPosition;
  animated?: boolean;
  style?: FlowEdgeStyle;
  markerEnd?: string;
};

/* -------------------------------- Helpers --------------------------------- */

function createTemporaryEdge(
  id: string,
  source: string,
  target: string,
): FlowEdgeConfig {
  return {
    id,
    source,
    target,
    type: 'temporary',
    style: {
      stroke: 'var(--color-ring)',
      strokeWidth: 1,
      strokeDasharray: '5, 5',
    },
  };
}

function createAnimatedEdge(
  id: string,
  source: string,
  target: string,
): FlowEdgeConfig {
  return {
    id,
    source,
    target,
    type: 'animated',
    animated: true,
  };
}

export {
  createTemporaryEdge,
  createAnimatedEdge,
  type FlowEdgeConfig,
  type FlowEdgeStyle,
  type FlowPosition,
};
