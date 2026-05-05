import { performSignalClarityScan } from '../scanner';
import { join } from 'path';
import { writeFileSync, mkdirSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';

describe('AI Signal Clarity - Feedback-Driven Improvements', () => {
  const tmpDir = join(tmpdir(), 'aiready-feedback-tests');

  beforeAll(() => {
    mkdirSync(tmpDir, { recursive: true });
  });

  afterAll(() => {
    rmSync(tmpDir, { recursive: true, force: true });
  });

  function createTestFile(name: string, content: string): string {
    const filePath = join(tmpDir, name);
    writeFileSync(filePath, content, 'utf8');
    return filePath;
  }

  it('should NOT flag string literals in enum assignments', async () => {
    const file = createTestFile(
      'enums.ts',
      `
      export enum TaskType {
        COLLECT = 'collect_data_task',
        PROCESS = 'process_logic_task',
        NOTIFY = 'notify_user_task'
      }
    `
    );

    const result = await performSignalClarityScan(file, {
      rootDir: tmpDir,
      minSeverity: 'info',
    });
    const issues = result.issues.filter((i) => i.category === 'magic-literal');

    expect(issues.length).toBe(0);
  });

  it('should NOT flag string literals in union type assignments', async () => {
    const file = createTestFile(
      'unions.ts',
      `
      export type CustomMode = 'ultra_production' | 'debug_mode' | 'shadow_test';
      export const currentCustomMode: CustomMode = 'ultra_production';
    `
    );

    const result = await performSignalClarityScan(file, {
      rootDir: tmpDir,
      minSeverity: 'info',
    });
    const issues = result.issues.filter((i) => i.category === 'magic-literal');

    expect(issues.length).toBe(0);
  });

  it('should NOT flag boolean traps in test assertions', async () => {
    const file = createTestFile(
      'logic.test.ts',
      `
      describe('logic', () => {
        it('should work', () => {
          expect(isReady()).toBe(true);
          expect(isFinished()).toEqual(false);
        });
      });
    `
    );

    const result = await performSignalClarityScan(file, {
      rootDir: tmpDir,
      minSeverity: 'info',
    });
    const issues = result.issues.filter((i) => i.category === 'boolean-trap');

    expect(issues.length).toBe(0);
  });
});
