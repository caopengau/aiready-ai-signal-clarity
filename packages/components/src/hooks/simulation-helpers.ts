import { SimulationNode } from './simulation-types';

/**
 * Stabilizes nodes by zeroing velocities and rounding positions.
 * Extracted to reduce duplicate patterns in useForceSimulation.
 */
export function stabilizeNodes(nodes: SimulationNode[]): void {
  nodes.forEach((n) => {
    (n as any).vx = 0;
    (n as any).vy = 0;
    if (typeof n.x === 'number') n.x = Number(n.x.toFixed(3));
    if (typeof n.y === 'number') n.y = Number(n.y.toFixed(3));
  });
}

/**
 * Seeds nodes with random positions within bounds.
 * Used as fallback when initial positioning fails.
 */
export function seedRandomPositions(
  nodes: SimulationNode[],
  width: number,
  height: number
): void {
  nodes.forEach((n) => {
    n.x = Math.random() * width;
    n.y = Math.random() * height;
    (n as any).vx = (Math.random() - 0.5) * 10;
    (n as any).vy = (Math.random() - 0.5) * 10;
  });
}
