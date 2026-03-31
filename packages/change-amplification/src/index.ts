import { ToolRegistry } from '@aiready/core';
import { CHANGE_AMPLIFICATION_PROVIDER } from './provider';

// Register with global registry
ToolRegistry.register(CHANGE_AMPLIFICATION_PROVIDER);

export * from './types';
export * from './analyzer';
export { CHANGE_AMPLIFICATION_PROVIDER };
