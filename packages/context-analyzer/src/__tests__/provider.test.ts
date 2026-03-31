import { describe, it, expect } from 'vitest';
import { CONTEXT_ANALYZER_PROVIDER } from '../provider';

describe('Context Analyzer Provider', () => {
  it('should have correct ID', () => {
    expect(CONTEXT_ANALYZER_PROVIDER.id).toBe('context-analyzer');
  });

  it('should have alias', () => {
    expect(CONTEXT_ANALYZER_PROVIDER.alias).toContain('context');
  });
});
