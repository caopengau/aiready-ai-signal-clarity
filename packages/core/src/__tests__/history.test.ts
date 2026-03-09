import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import {
  saveScoreEntry,
  loadScoreHistory,
  getHistorySummary,
  exportHistory,
  clearHistory,
} from '../utils/history';
import { join } from 'path';
import { mkdirSync, rmSync } from 'fs';
import { tmpdir } from 'os';

describe('History Utilities', () => {
  const tmpDir = join(tmpdir(), 'aiready-history-tests');

  beforeAll(() => {
    mkdirSync(tmpDir, { recursive: true });
  });

  afterAll(() => {
    rmSync(tmpDir, { recursive: true, force: true });
  });

  it('should save and load history entries', () => {
    const entry = {
      overallScore: 80,
      breakdown: { patterns: 70 },
      totalIssues: 5,
      totalTokens: 1000,
    };

    saveScoreEntry(tmpDir, entry);
    const history = loadScoreHistory(tmpDir);

    expect(history).toHaveLength(1);
    expect(history[0].overallScore).toBe(80);
    expect(history[0].timestamp).toBeDefined();
  });

  it('should calculate history summary', () => {
    const summary = getHistorySummary(tmpDir);
    expect(summary.totalScans).toBe(1);
    expect(summary.avgScore).toBe(80);
  });

  it('should export history in CSV format', () => {
    const csv = exportHistory(tmpDir, 'csv');
    expect(csv).toContain('timestamp,overallScore');
    expect(csv).toContain(',80,5,1000');
  });

  it('should clear history', () => {
    clearHistory(tmpDir);
    const history = loadScoreHistory(tmpDir);
    expect(history).toHaveLength(0);
  });
});
