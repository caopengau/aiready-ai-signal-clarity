import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getSmartDefaults } from '../defaults';
import * as core from '@aiready/core';

vi.mock('@aiready/core', async () => {
  const actual = await vi.importActual('@aiready/core');
  return {
    ...actual,
    scanFiles: vi.fn(),
  };
});

describe('getSmartDefaults', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return small repo defaults for <100 files', async () => {
    vi.mocked(core.scanFiles).mockResolvedValue(
      Array(50)
        .fill('')
        .map((_, i) => `file${i}.ts`)
    );

    const defaults = await getSmartDefaults('.', {});

    expect(defaults.maxDepth).toBe(5);
    expect(defaults.maxContextBudget).toBe(8000);
    expect(defaults.minCohesion).toBe(0.5);
    expect(defaults.maxFragmentation).toBe(0.5);
  });

  it('should return medium repo defaults for 100-500 files', async () => {
    vi.mocked(core.scanFiles).mockResolvedValue(
      Array(200)
        .fill('')
        .map((_, i) => `file${i}.ts`)
    );

    const defaults = await getSmartDefaults('.', {});

    expect(defaults.maxDepth).toBe(6);
    expect(defaults.maxContextBudget).toBe(15000);
    expect(defaults.minCohesion).toBe(0.45);
    expect(defaults.maxFragmentation).toBe(0.6);
  });

  it('should return large repo defaults for 500-2000 files', async () => {
    vi.mocked(core.scanFiles).mockResolvedValue(
      Array(1000)
        .fill('')
        .map((_, i) => `file${i}.ts`)
    );

    const defaults = await getSmartDefaults('.', {});

    expect(defaults.maxDepth).toBe(8);
    expect(defaults.maxContextBudget).toBe(25000);
    expect(defaults.minCohesion).toBe(0.4);
    expect(defaults.maxFragmentation).toBe(0.7);
  });

  it('should return enterprise repo defaults for >2000 files', async () => {
    vi.mocked(core.scanFiles).mockResolvedValue(
      Array(3000)
        .fill('')
        .map((_, i) => `file${i}.ts`)
    );

    const defaults = await getSmartDefaults('.', {});

    expect(defaults.maxDepth).toBe(12);
    expect(defaults.maxContextBudget).toBe(40000);
    expect(defaults.minCohesion).toBe(0.35);
    expect(defaults.maxFragmentation).toBe(0.8);
  });

  it('should always return hardcoded focus and includeNodeModules', async () => {
    vi.mocked(core.scanFiles).mockResolvedValue(
      Array(50)
        .fill('')
        .map((_, i) => `file${i}.ts`)
    );

    const defaults = await getSmartDefaults('.', {
      includeNodeModules: true,
      focus: 'dependencies' as 'all' | 'fragmentation' | 'cohesion' | 'depth',
    });

    // Note: getSmartDefaults hardcodes focus='all' and includeNodeModules=false
    expect(defaults.focus).toBe('all');
    expect(defaults.includeNodeModules).toBe(false);
  });

  it('should use provided rootDir or fall back to directory', async () => {
    vi.mocked(core.scanFiles).mockResolvedValue([]);

    const defaults1 = await getSmartDefaults('/project', {});
    expect(defaults1.rootDir).toBe('/project');

    const defaults2 = await getSmartDefaults('/project', {
      rootDir: '/custom',
    });
    expect(defaults2.rootDir).toBe('/custom');
  });

  it('should pass include/exclude to scanFiles', async () => {
    vi.mocked(core.scanFiles).mockResolvedValue([]);

    await getSmartDefaults('.', {
      include: ['**/*.ts'],
      exclude: ['**/node_modules/**'],
    });

    expect(core.scanFiles).toHaveBeenCalledWith({
      rootDir: '.',
      include: ['**/*.ts'],
      exclude: ['**/node_modules/**'],
    });
  });
});
