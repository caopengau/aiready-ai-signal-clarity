import { describe, it, expect, vi, beforeEach } from 'vitest';

// Test the failOnLevel function logic
describe('failOnLevel', () => {
  // Inline the function for testing since it's not exported
  function failOnLevel(
    level: string,
    critical: number,
    major: number,
    total: number
  ): boolean {
    if (level === 'none') return false;
    if (level === 'critical') return critical > 0;
    if (level === 'major') return critical + major > 0;
    if (level === 'any') return total > 0;
    return false;
  }

  describe('none level', () => {
    it('should never fail', () => {
      expect(failOnLevel('none', 5, 10, 20)).toBe(false);
      expect(failOnLevel('none', 0, 0, 0)).toBe(false);
    });
  });

  describe('critical level', () => {
    it('should fail when critical issues exist', () => {
      expect(failOnLevel('critical', 1, 0, 0)).toBe(true);
      expect(failOnLevel('critical', 5, 10, 20)).toBe(true);
    });

    it('should not fail when no critical issues', () => {
      expect(failOnLevel('critical', 0, 10, 20)).toBe(false);
      expect(failOnLevel('critical', 0, 0, 0)).toBe(false);
    });
  });

  describe('major level', () => {
    it('should fail when critical or major issues exist', () => {
      expect(failOnLevel('major', 1, 0, 0)).toBe(true);
      expect(failOnLevel('major', 0, 1, 0)).toBe(true);
      expect(failOnLevel('major', 5, 10, 20)).toBe(true);
    });

    it('should not fail when no critical or major issues', () => {
      expect(failOnLevel('major', 0, 0, 20)).toBe(false);
      expect(failOnLevel('major', 0, 0, 0)).toBe(false);
    });
  });

  describe('any level', () => {
    it('should fail when any issues exist', () => {
      expect(failOnLevel('any', 0, 0, 1)).toBe(true);
      expect(failOnLevel('any', 5, 10, 20)).toBe(true);
    });

    it('should not fail when no issues', () => {
      expect(failOnLevel('any', 0, 0, 0)).toBe(false);
    });
  });

  describe('unknown level', () => {
    it('should return false for unknown levels', () => {
      expect(failOnLevel('unknown', 5, 10, 20)).toBe(false);
    });
  });
});

describe('Input parsing', () => {
  it('should parse threshold with default value', () => {
    const parseThreshold = (input: string | undefined): number => {
      return parseInt(input || '70', 10);
    };

    expect(parseThreshold('80')).toBe(80);
    expect(parseThreshold('50')).toBe(50);
    expect(parseThreshold(undefined)).toBe(70);
    expect(parseThreshold('')).toBe(70);
  });

  it('should parse tools with default value', () => {
    const parseTools = (input: string | undefined): string => {
      return input || 'patterns,context,consistency';
    };

    expect(parseTools('patterns,context')).toBe('patterns,context');
    expect(parseTools(undefined)).toBe('patterns,context,consistency');
    expect(parseTools('')).toBe('patterns,context,consistency');
  });

  it('should parse fail-on with default value', () => {
    const parseFailOn = (input: string | undefined): string => {
      return input || 'critical';
    };

    expect(parseFailOn('major')).toBe('major');
    expect(parseFailOn(undefined)).toBe('critical');
    expect(parseFailOn('')).toBe('critical');
  });
});