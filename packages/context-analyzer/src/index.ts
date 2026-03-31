import { ToolRegistry } from '@aiready/core';
import { CONTEXT_ANALYZER_PROVIDER } from './provider';

// Register with global registry
ToolRegistry.register(CONTEXT_ANALYZER_PROVIDER);

export * from './types';
export * from './analyzer';
export * from './scoring';
export { CONTEXT_ANALYZER_PROVIDER };
