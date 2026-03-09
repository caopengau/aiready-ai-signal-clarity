import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import {
  resolveOutputPath,
  getScoreBar,
  getSafetyIcon,
  emitProgress,
} from '../utils/cli-helpers';
import { join } from 'path';
import { existsSync, rmSync } from 'fs';
import { tmpdir } from 'os';

describe('CLI Helpers', () => {
  const tmpDir = join(tmpdir(), 'aiready-cli-helpers-tests');

  beforeAll(() => {
    // resolveOutputPath creates dirs, so we test that
  });

  afterAll(() => {
    rmSync(tmpDir, { recursive: true, force: true });
  });

  it('should resolve output path and create directories', () => {
    const customPath = join(tmpDir, 'reports/my-report.json');
    const resolved = resolveOutputPath(customPath, 'default.json');

    expect(resolved).toBe(customPath);
    expect(existsSync(join(tmpDir, 'reports'))).toBe(true);
  });

  it('should generate a score bar', () => {
    expect(getScoreBar(50)).toBe('█████░░░░░');
    expect(getScoreBar(100)).toBe('██████████');
    expect(getScoreBar(0)).toBe('░░░░░░░░░░');
  });

  it('should return correct safety icons', () => {
    expect(getSafetyIcon('safe')).toBe('✅');
    expect(getSafetyIcon('blind-risk')).toBe('💀');
    expect(getSafetyIcon('unknown')).toBe('❓');
  });

  it('should emit progress with throttling', () => {
    const onProgress = vi.fn();

    // Total 100, throttle 50. Should emit at 50 and 100.
    emitProgress(10, 100, 'test', 'msg', onProgress, 50);
    expect(onProgress).not.toHaveBeenCalled();

    emitProgress(50, 100, 'test', 'msg', onProgress, 50);
    expect(onProgress).toHaveBeenCalledWith(50, 100, 'msg (50/100)');

    emitProgress(100, 100, 'test', 'msg', onProgress, 50);
    expect(onProgress).toHaveBeenCalledTimes(2);
  });
});
