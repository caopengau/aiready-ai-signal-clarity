import { describe, it, expect } from 'vitest';
import { ToolRegistry } from '../registry';
import { ToolName } from '../types/schema';
import { ToolProvider } from '../types/contract';

describe('Tool Registry', () => {
  const mockProvider: ToolProvider = {
    id: ToolName.PatternDetect,
    alias: ['patterns', 'p'],
    name: 'Pattern Detect',
    description: 'test',
    run: async () => ({ issues: [], summary: {} as any, results: [] }),
  };

  it('should register and find tools', () => {
    const registry = new ToolRegistry('test');
    registry.register(mockProvider);

    expect(registry.get(ToolName.PatternDetect)).toBe(mockProvider);
    expect(registry.find('patterns')).toBe(mockProvider);
    expect(registry.find('p')).toBe(mockProvider);
  });

  it('should support static singleton usage', () => {
    ToolRegistry.clear();
    ToolRegistry.register(mockProvider);

    expect(ToolRegistry.get(ToolName.PatternDetect)).toBe(mockProvider);
    expect(ToolRegistry.getAll()).toHaveLength(1);
  });
});
