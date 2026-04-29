/**
 * Main analyzer for AI signal clarity.
 * Scans all TS/JS files in a directory and aggregates signals.
 */

import {
  scanFiles,
  calculateAiSignalClarity,
  Severity,
  emitProgress,
} from '@aiready/core';
import { performSignalClarityScan } from './scanner';
import type {
  AiSignalClarityOptions,
  AiSignalClarityReport,
  FileAiSignalClarityResult,
} from './types';

export async function analyzeAiSignalClarity(
  options: AiSignalClarityOptions
): Promise<AiSignalClarityReport> {
  // Use core scanFiles which respects .gitignore recursively
  const files = await scanFiles(options);
  const results: FileAiSignalClarityResult[] = [];

  // Aggregate signals
  const aggregate = {
    magicLiterals: 0,
    booleanTraps: 0,
    ambiguousNames: 0,
    undocumentedExports: 0,
    implicitSideEffects: 0,
    deepCallbacks: 0,
    overloadedSymbols: 0,
    largeFiles: 0,
    totalSymbols: 0,
    totalExports: 0,
    totalLines: 0,
  };

  let processed = 0;
  for (const filePath of files) {
    processed++;
    emitProgress(
      processed,
      files.length,
      'ai-signal-clarity',
      'analyzing files',
      options.onProgress
    );

    const result = await performSignalClarityScan(filePath, options);
    results.push(result);
    // result.signals is a Record<string, number>, iterate over entries
    for (const [key, value] of Object.entries(result.signals)) {
      if (key in aggregate) {
        (aggregate as Record<string, number>)[key] += value;
      }
    }
  }

  // Calculate grounding score using core math (statically imported)
  const riskResult = calculateAiSignalClarity({
    overloadedSymbols: aggregate.overloadedSymbols,
    magicLiterals: aggregate.magicLiterals,
    booleanTraps: aggregate.booleanTraps,
    implicitSideEffects: aggregate.implicitSideEffects,
    deepCallbacks: aggregate.deepCallbacks,
    ambiguousNames: aggregate.ambiguousNames,
    undocumentedExports: aggregate.undocumentedExports,
    largeFiles: aggregate.largeFiles,
    totalSymbols: Math.max(1, aggregate.totalSymbols),
    totalExports: Math.max(1, aggregate.totalExports),
  });

  // Helper for severity mapping
  const getLevel = (s: any): number => {
    if (s === Severity.Critical || s === 'critical') return 4;
    if (s === Severity.Major || s === 'major') return 3;
    if (s === Severity.Minor || s === 'minor') return 2;
    if (s === Severity.Info || s === 'info') return 1;
    return 0;
  };

  // Count severities
  const allIssues = results.flatMap((r) => r.issues);
  const criticalIssues = allIssues.filter(
    (i) => getLevel(i.severity) === 4
  ).length;
  const majorIssues = allIssues.filter(
    (i) => getLevel(i.severity) === 3
  ).length;
  const minorIssues = allIssues.filter(
    (i) => getLevel(i.severity) === 2
  ).length;

  // Filter by minSeverity
  const minSev = options.minSeverity ?? Severity.Info;
  const filteredResults = results.map((r) => ({
    ...r,
    issues: r.issues.filter((i) => getLevel(i.severity) >= getLevel(minSev)),
  }));

  const filteredIssues = filteredResults.flatMap((r) => r.issues);

  return {
    summary: {
      filesAnalyzed: files.length,
      totalIssues: filteredIssues.length,
      totalSignals: filteredIssues.length, // Alias for backward compatibility
      criticalIssues,
      criticalSignals: criticalIssues, // Alias for backward compatibility
      majorIssues,
      majorSignals: majorIssues, // Alias for backward compatibility
      minorIssues,
      minorSignals: minorIssues, // Alias for backward compatibility
      topRisk: riskResult.topRisk,
      rating: riskResult.rating,
    },
    results: filteredResults,
    issues: filteredIssues,
    aggregateSignals: aggregate,
    recommendations: riskResult.recommendations,
  };
}
