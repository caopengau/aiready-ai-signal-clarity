import type { DependencyGraph } from '../types';

/**
 * Identify candidates for module consolidation based on high co-usage or shared types.
 *
 * @param graph - The dependency graph.
 * @param coUsageMatrix - Matrix of frequently paired files.
 * @param typeGraph - Map of shared type references.
 * @param minCoUsage - Minimum co-usage count threshold.
 * @param minSharedTypes - Minimum shared types threshold.
 * @returns Array of consolidation candidates sorted by strength.
 */
export function findConsolidationCandidates(
  graph: DependencyGraph,
  coUsageMatrix: Map<string, Map<string, number>>,
  typeGraph: Map<string, Set<string>>,
  minCoUsage: number = 5,
  minSharedTypes: number = 2
): { files: string[]; reason: string; strength: number }[] {
  const candidates: { files: string[]; reason: string; strength: number }[] =
    [];
  for (const [fileA, coUsages] of coUsageMatrix) {
    const nodeA = graph.nodes.get(fileA);
    if (!nodeA) continue;
    for (const [fileB, count] of coUsages) {
      if (fileB <= fileA || count < minCoUsage) continue;
      const nodeB = graph.nodes.get(fileB);
      if (!nodeB) continue;
      const typesA = new Set(
        nodeA.exports.flatMap((e) => e.typeReferences || [])
      );
      const typesB = new Set(
        nodeB.exports.flatMap((e) => e.typeReferences || [])
      );
      const sharedTypes = Array.from(typesA).filter((t) => typesB.has(t));
      if (sharedTypes.length >= minSharedTypes || count >= minCoUsage * 2) {
        candidates.push({
          files: [fileA, fileB],
          reason: `High co-usage (${count}x)`,
          strength: count / 10,
        });
      }
    }
  }
  return candidates.sort((a, b) => b.strength - a.strength);
}
