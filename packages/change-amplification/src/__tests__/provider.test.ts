import { describe, it, expect } from 'vitest';
import { CHANGE_AMPLIFICATION_PROVIDER } from '../provider';

describe('Change Amplification Provider', () => {
  it('should have correct ID', () => {
    expect(CHANGE_AMPLIFICATION_PROVIDER.id).toBe('change-amplification');
  });

  it('should have alias', () => {
    expect(CHANGE_AMPLIFICATION_PROVIDER.alias).toContain('blast-radius');
  });
});
