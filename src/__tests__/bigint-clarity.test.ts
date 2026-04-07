import { describe, it, expect, beforeEach } from 'vitest';
import { scanFile } from '../scanner';
import { writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';

describe('BigInt Clarity Support', () => {
  const testFile = join(__dirname, 'test-bigint.ts');

  beforeEach(() => {
    // Clean up if exists
  });

  it('should not flag common BigInt literals as magic literals', async () => {
    const code = `
      export const ZERO = 0n;
      export const ONE = 1n;
      export const THOUSAND = 1000n;
    `;
    writeFileSync(testFile, code);

    try {
      const result = await scanFile(testFile);
      const magicLiteralIssues = result.issues.filter(
        (i) => i.type === 'magic-literal'
      );
      expect(magicLiteralIssues).toHaveLength(0);
    } finally {
      unlinkSync(testFile);
    }
  });

  it('should flag uncommon BigInt literals as magic literals', async () => {
    const code = `
      export function x() {
        return 123456n;
      }
    `;
    writeFileSync(testFile, code);

    try {
      const result = await scanFile(testFile);
      const magicLiteralIssues = result.issues.filter(
        (i) => i.type === 'magic-literal'
      );
      expect(magicLiteralIssues).toHaveLength(1);
      expect(magicLiteralIssues[0].message).toContain('123456n');
    } finally {
      unlinkSync(testFile);
    }
  });
});
