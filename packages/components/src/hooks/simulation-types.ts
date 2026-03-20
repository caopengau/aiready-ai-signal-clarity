import * as d3 from 'd3';

export interface SimulationNode extends d3.SimulationNodeDatum {
  id: string;
  [key: string]: any;
}

export interface SimulationLink extends d3.SimulationLinkDatum<SimulationNode> {
  source: string | SimulationNode;
  target: string | SimulationNode;
  [key: string]: any;
}

export interface ForceSimulationOptions {
  /**
   * Strength of the charge force (repulsion between nodes)
   * @default -300
   */
  chargeStrength?: number;

  /**
   * Distance for links between nodes
   * @default 100
   */
  linkDistance?: number;

  /**
   * Strength of the link force
   * @default 1
   */
  linkStrength?: number;

  /**
   * Strength of collision detection
   * @default 1
   */
  collisionStrength?: number;

  /**
   * Radius for collision detection (node size)
   * @default 10
   */
  collisionRadius?: number;

  /**
   * Strength of centering force
   * @default 0.1
   */
  centerStrength?: number;

  /**
   * Width of the simulation space
   */
  width: number;

  /**
   * Height of the simulation space
   */
  height: number;

  /**
   * Alpha decay rate (how quickly the simulation cools down)
   * @default 0.0228
   */
  alphaDecay?: number;

  /**
   * Alpha target controls the resting energy of the simulation. When set to 0
   * the simulation will cool and stop moving once forces settle. Increase to
   * keep the graph more dynamic.
   * @default 0
   */
  alphaTarget?: number;

  /**
   * Warm alpha used when (re)starting the simulation to give it a small amount
   * of energy. This mirrors the Observable example which sets a modest
   * alphaTarget when dragging instead of forcing alpha to 1.
   * @default 0.3
   */
  warmAlpha?: number;

  /**
   * Minimum alpha threshold below which the simulation is considered cooled
   * and will stop. Increasing this makes the simulation stop earlier.
   * @default 0.01
   */
  alphaMin?: number;

  /**
   * When true, zero node velocities and snap positions when the simulation
   * stops to reduce residual jitter.
   * @default true
   */
  stabilizeOnStop?: boolean;

  /**
   * Throttle for tick updates in milliseconds to reduce update frequency
   * (helps avoid excessive React re-renders).
   * @default 33
   */
  tickThrottleMs?: number;

  /**
   * Maximum time (ms) to allow the simulation to run after creation/restart.
   * If the simulation hasn't cooled by this time, it will be force-stopped
   * to prevent indefinite animation. Set to 0 to disable.
   * @default 3000
   */
  maxSimulationTimeMs?: number;

  /**
   * Velocity decay (friction)
   * @default 0.4
   */
  velocityDecay?: number;

  /**
   * Optional tick callback invoked on each simulation tick with current nodes/links and the simulation instance
   */
  onTick?: (
    nodes: SimulationNode[],
    links: SimulationLink[],
    sim: d3.Simulation<SimulationNode, SimulationLink>
  ) => void;
}

export interface UseForceSimulationReturn {
  /**
   * Current nodes with positions
   */
  nodes: SimulationNode[];

  /**
   * Current links
   */
  links: SimulationLink[];

  /**
   * Restart the simulation
   */
  restart: () => void;

  /**
   * Stop the simulation
   */
  stop: () => void;

  /**
   * Whether the simulation is currently running
   */
  isRunning: boolean;

  /**
   * Current alpha value (simulation heat)
   */
  alpha: number;
}
