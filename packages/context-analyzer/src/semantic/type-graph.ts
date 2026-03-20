import type { DependencyGraph } from '../types';

/**
 * Extract type dependencies from AST exports to build a type-based relationship graph.
 *
 * @param graph - The dependency graph to analyze.
 * @returns Map of type reference names to sets of files that consume or export them.
 */
export function buildTypeGraph(
  graph: DependencyGraph
): Map<string, Set<string>> {
  const typeGraph = new Map<string, Set<string>>();

  for (const [file, node] of graph.nodes) {
    for (const exp of node.exports) {
      if (exp.typeReferences) {
        for (const typeRef of exp.typeReferences) {
          if (!typeGraph.has(typeRef)) typeGraph.set(typeRef, new Set());
          typeGraph.get(typeRef)!.add(file);
        }
      }
    }
  }

  return typeGraph;
}
