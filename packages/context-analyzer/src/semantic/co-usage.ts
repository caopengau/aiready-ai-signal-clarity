import type { DependencyGraph, CoUsageData } from '../types';

/**
 * Build co-usage matrix: track which files are imported together frequently.
 *
 * @param graph - The dependency graph to analyze.
 * @returns Map of file path to nested map of related files and their co-occurrence counts.
 */
export function buildCoUsageMatrix(
  graph: DependencyGraph
): Map<string, Map<string, number>> {
  const coUsageMatrix = new Map<string, Map<string, number>>();

  for (const [, node] of graph.nodes) {
    const imports = node.imports;

    for (let i = 0; i < imports.length; i++) {
      const fileA = imports[i];
      if (!coUsageMatrix.has(fileA)) coUsageMatrix.set(fileA, new Map());

      for (let j = i + 1; j < imports.length; j++) {
        const fileB = imports[j];
        const fileAUsage = coUsageMatrix.get(fileA)!;
        fileAUsage.set(fileB, (fileAUsage.get(fileB) || 0) + 1);

        if (!coUsageMatrix.has(fileB)) coUsageMatrix.set(fileB, new Map());
        const fileBUsage = coUsageMatrix.get(fileB)!;
        fileBUsage.set(fileA, (fileBUsage.get(fileA) || 0) + 1);
      }
    }
  }

  return coUsageMatrix;
}

/**
 * Find semantic clusters using frequently occurring co-usage patterns.
 *
 * @param coUsageMatrix - The co-usage matrix from buildCoUsageMatrix.
 * @param minCoUsage - Minimum co-usage count to consider a strong relationship (default: 3).
 * @returns Map of cluster representative files to their associated cluster members.
 */
export function findSemanticClusters(
  coUsageMatrix: Map<string, Map<string, number>>,
  minCoUsage: number = 3
): Map<string, string[]> {
  const clusters = new Map<string, string[]>();
  const visited = new Set<string>();

  for (const [file, coUsages] of coUsageMatrix) {
    if (visited.has(file)) continue;

    const cluster: string[] = [file];
    visited.add(file);

    for (const [relatedFile, count] of coUsages) {
      if (count >= minCoUsage && !visited.has(relatedFile)) {
        cluster.push(relatedFile);
        visited.add(relatedFile);
      }
    }

    if (cluster.length > 1) clusters.set(file, cluster);
  }

  return clusters;
}

/**
 * Retrieve co-usage data for a specific file.
 *
 * @param file - The file path to look up.
 * @param coUsageMatrix - The global co-usage matrix.
 * @returns Formatted co-usage data object.
 */
export function getCoUsageData(
  file: string,
  coUsageMatrix: Map<string, Map<string, number>>
): CoUsageData {
  return {
    file,
    coImportedWith: coUsageMatrix.get(file) || new Map(),
    sharedImporters: [],
  };
}
