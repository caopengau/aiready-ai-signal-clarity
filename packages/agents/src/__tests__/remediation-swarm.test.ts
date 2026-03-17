import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RemediationSwarm } from '../workflows/remediation-swarm';
import { MCPAdapter } from '../tools/mcp-adapter';
import { Agent } from '@mastra/core/agent';

// Mock MCPAdapter
vi.mock('../tools/mcp-adapter', () => {
  const MockAdapter = vi.fn();
  MockAdapter.prototype.connect = vi.fn().mockResolvedValue(undefined);
  MockAdapter.prototype.disconnect = vi.fn().mockResolvedValue(undefined);
  MockAdapter.prototype.getMastraTools = vi.fn().mockResolvedValue({
    'list-files': { id: 'list-files', execute: vi.fn() },
    'create-pr': { id: 'create-pr', execute: vi.fn() },
  });
  return { MCPAdapter: MockAdapter };
});

// Mock Mastra Agent
vi.mock('@mastra/core/agent', () => {
  const MockAgent = vi.fn();
  MockAgent.prototype.generate = vi.fn().mockResolvedValue({
    text: JSON.stringify({
      status: 'success',
      diff: 'test-diff',
      prUrl: 'https://github.com/test/repo/pull/1',
      prNumber: 1,
      explanation: 'Fixed duplication in auth.ts',
    }),
  });
  return { Agent: MockAgent };
});

describe('RemediationSwarm (MCP Powered)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully connect to MCP, execute agent, and parse JSON response', async () => {
    const input = {
      remediation: { id: 'rem-1', type: 'consolidation' },
      repo: { url: 'https://github.com/test/repo' },
      rootDir: '/tmp/test-repo',
      config: {
        githubToken: 'gh-token-123',
        openaiApiKey: 'oa-key-456',
      },
    };

    const result = await RemediationSwarm.execute(input);

    // Verify MCP Adapters were created and connected
    expect(MCPAdapter).toHaveBeenCalledTimes(2);

    const mockInstances = vi.mocked(MCPAdapter).mock.instances;
    for (const instance of mockInstances) {
      expect(instance.connect).toHaveBeenCalled();
      expect(instance.getMastraTools).toHaveBeenCalled();
      expect(instance.disconnect).toHaveBeenCalled();
    }

    // Verify result structure
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.status).toBe('success');
      expect(result.value.prUrl).toBe('https://github.com/test/repo/pull/1');
    }
  });

  it('should handle agent failures and return error status', async () => {
    // Override mock for this specific test
    const MockAgent = vi.mocked(Agent);
    (MockAgent.prototype.generate as any).mockResolvedValueOnce({
      text: JSON.stringify({
        status: 'failure',
        explanation: 'Could not find the duplicated files',
      }),
    });

    const input = {
      remediation: { id: 'rem-2' },
      repo: { url: 'https://github.com/test/repo' },
      rootDir: '/tmp/test',
      config: { githubToken: 'token' },
    };

    const result = await RemediationSwarm.execute(input);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.status).toBe('failure');
      expect(result.value.explanation).toBe(
        'Could not find the duplicated files'
      );
    }
  });

  it('should fallback to raw text if agent fails to return valid JSON', async () => {
    const MockAgent = vi.mocked(Agent);
    (MockAgent.prototype.generate as any).mockResolvedValueOnce({
      text: 'Applied fixes manually. PR created at https://github.com/test/repo/pull/99',
    });

    const input = {
      remediation: { id: 'rem-3' },
      repo: { url: 'https://github.com/test/repo' },
      rootDir: '/tmp/test',
      config: { githubToken: 'token' },
    };

    const result = await RemediationSwarm.execute(input);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.status).toBe('success');
      expect(result.value.explanation).toContain('fallback to text response');
    }
  });
});
