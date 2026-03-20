import chalk from 'chalk';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import prompts from 'prompts';

/**
 * Interactive setup: detect common frameworks and suggest excludes & focus areas
 */
export async function runInteractiveSetup(
  directory: string,
  current: any
): Promise<any> {
  console.log(chalk.yellow("🧭 Interactive mode: let's tailor the analysis."));

  const pkgPath = join(directory, 'package.json');
  let deps: Record<string, string> = {};
  if (existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
      deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
    } catch (e) {
      void e;
      // Ignore parse errors, use empty deps
    }
  }

  const hasNextJs = existsSync(join(directory, '.next')) || !!deps['next'];
  const hasCDK =
    existsSync(join(directory, 'cdk.out')) ||
    !!deps['aws-cdk-lib'] ||
    Object.keys(deps).some((d) => d.startsWith('@aws-cdk/'));

  const recommendedExcludes = new Set<string>(current.exclude || []);
  if (
    hasNextJs &&
    !Array.from(recommendedExcludes).some((p) => p.includes('.next'))
  ) {
    recommendedExcludes.add('**/.next/**');
  }
  if (
    hasCDK &&
    !Array.from(recommendedExcludes).some((p) => p.includes('cdk.out'))
  ) {
    recommendedExcludes.add('**/cdk.out/**');
  }

  const { applyExcludes } = await prompts({
    type: 'toggle',
    name: 'applyExcludes',
    message: `Detected ${hasNextJs ? 'Next.js ' : ''}${hasCDK ? 'AWS CDK ' : ''}frameworks. Apply recommended excludes?`,
    initial: true,
    active: 'yes',
    inactive: 'no',
  });

  const nextOptions = { ...current };
  if (applyExcludes) {
    nextOptions.exclude = Array.from(recommendedExcludes);
  }

  const { focusArea } = await prompts({
    type: 'select',
    name: 'focusArea',
    message: 'Which areas to focus?',
    choices: [
      { title: 'Frontend (web app)', value: 'frontend' },
      { title: 'Backend (API/infra)', value: 'backend' },
      { title: 'Both', value: 'both' },
    ],
    initial: 2,
  });

  if (focusArea === 'frontend') {
    nextOptions.include = ['**/*.{ts,tsx,js,jsx}'];
    nextOptions.exclude = Array.from(
      new Set([
        ...(nextOptions.exclude || []),
        '**/cdk.out/**',
        '**/infra/**',
        '**/server/**',
        '**/backend/**',
      ])
    );
  } else if (focusArea === 'backend') {
    nextOptions.include = [
      '**/api/**',
      '**/server/**',
      '**/backend/**',
      '**/infra/**',
      '**/*.{ts,js,py,java}',
    ];
  }

  console.log(chalk.green('✓ Interactive configuration applied.'));
  return nextOptions;
}
