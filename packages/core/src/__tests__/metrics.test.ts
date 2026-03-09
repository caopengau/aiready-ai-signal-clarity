import { describe, it, expect } from 'vitest';
import { estimateTokens } from '../utils/metrics';

describe('Metrics Utils', () => {
  it('should estimate tokens correctly', () => {
    // 40 chars = 10 tokens
    const text = 'a'.repeat(40);
    expect(estimateTokens(text)).toBe(10);

    expect(estimateTokens('')).toBe(0);
    expect(estimateTokens('abcd')).toBe(1);
  });
});
