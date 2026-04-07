import { describe, it, expect } from 'vitest';
import { parse } from '@typescript-eslint/typescript-estree';

describe('Modern TS Support Repro', () => {
  it('should parse decorators', () => {
    const code = `
@sealed
class BugReport {
  type = 'report';
  title: string;

  constructor(t: string) {
    this.title = t;
  }
}
    `;
    const ast = parse(code, {
      loc: true,
      range: true,
      tokens: true,
      comment: true,
      ecmaVersion: 'latest',
    });
    expect(ast).toBeDefined();
  });

  it('should parse explicit resource management', () => {
    const code = `
async function handle() {
  await using resource = await getResource();
  // ...
}
    `;
    const ast = parse(code, {
      loc: true,
      range: true,
      tokens: true,
      comment: true,
      ecmaVersion: 'latest',
    });
    expect(ast).toBeDefined();
  });

  it('should parse BigInt literals as BigIntLiteral or Literal', () => {
    const code = 'const x = 100n;';
    const ast = parse(code, {
      loc: true,
      range: true,
      tokens: true,
      comment: true,
      ecmaVersion: 'latest',
    });
    const node = (ast.body[0] as any).declarations[0].init;
    console.log('BigInt Node Type:', node.type);
    expect(['BigIntLiteral', 'Literal']).toContain(node.type);
  });
});
