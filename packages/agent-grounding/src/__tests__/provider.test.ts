import { describe, it, expect } from 'vitest';
import { AGENT_GROUNDING_PROVIDER } from '../provider';

describe('Agent Grounding Provider', () => {
  it('should have correct ID', () => {
    expect(AGENT_GROUNDING_PROVIDER.id).toBe('agent-grounding');
  });

  it('should have alias', () => {
    expect(AGENT_GROUNDING_PROVIDER.alias).toContain('grounding');
  });
});
