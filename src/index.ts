/**
 * Main entry point for git workshop operations.
 * Tasks should import from '../src/git-ops'.
 */

// Core functionality
export { createGitOps } from './operations';
export { initTaskRepo } from './init';

// Utilities
export { hasFlag, getTaskPath } from './utils';

// Constants
export { CLI_FLAGS } from './constants';

// Types
export * from './types';
