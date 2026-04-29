import {
  ScanOptions,
  AnalysisResult,
  Issue,
  SpokeOutput,
  Severity,
} from '@aiready/core';

export interface AiSignalClarityOptions extends ScanOptions {
  checkMagicLiterals?: boolean;
  checkBooleanTraps?: boolean;
  checkAmbiguousNames?: boolean;
  checkUndocumentedExports?: boolean;
  checkImplicitSideEffects?: boolean;
  checkDeepCallbacks?: boolean;
  checkOverloadedSymbols?: boolean;
  checkLargeFiles?: boolean;
  minSeverity?: Severity | string;
}

export interface AiSignalClarityIssue extends Issue {
  category?: string;
  signalType?: string;
  context?: string;
}

export interface FileAiSignalClarityResult extends AnalysisResult {
  signals: Record<string, number>;
  issues: AiSignalClarityIssue[];
  filePath?: string; // For backward compatibility
}

export interface AiSignalClarityReport extends SpokeOutput {
  summary: {
    filesAnalyzed: number;
    totalIssues: number;
    criticalIssues: number;
    majorIssues: number;
    minorIssues: number;
    topRisk: string;
    rating: string;
    totalSignals?: number; // Keep for backward compatibility
    criticalSignals?: number; // Keep for backward compatibility
    majorSignals?: number; // Keep for backward compatibility
    minorSignals?: number; // Keep for backward compatibility
  };
  results: FileAiSignalClarityResult[];
  issues: AiSignalClarityIssue[];
  aggregateSignals: any;
  recommendations: string[];
}
