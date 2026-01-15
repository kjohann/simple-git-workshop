import { SimpleGit } from 'simple-git';

/**
 * Context containing git instance and repository path
 */
export interface GitContext {
  git: SimpleGit;
  repoPath: string;
}

/**
 * Bound git operations with repository context
 */
export interface GitOps {
  // Branch operations
  createBranch(name: string): Promise<void>;
  switchBranch(name: string): Promise<void>;
  deleteBranch(name: string, force?: boolean): Promise<void>;
  getCurrentBranch(): Promise<string>;
  listBranches(): Promise<string[]>;

  // File operations
  writeFile(relativePath: string, content: string): Promise<void>;
  readFile(relativePath: string): Promise<string>;
  deleteFile(relativePath: string): Promise<void>;
  fileExists(relativePath: string): Promise<boolean>;

  // Staging operations
  addFiles(files: string[]): Promise<void>;
  addAll(): Promise<void>;

  // Commit operations
  commit(message: string): Promise<void>;
  amendCommit(message?: string): Promise<void>;

  // Rebase operations
  rebase(branch: string): Promise<void>;
  rebaseContinue(): Promise<void>;
  rebaseAbort(): Promise<void>;

  // Merge operations
  merge(branch: string): Promise<void>;
  mergeAbort(): Promise<void>;

  // Rerere operations
  enableRerere(): Promise<void>;
  disableRerere(): Promise<void>;
  isRerereEnabled(): Promise<boolean>;
  clearRerereCache(): Promise<void>;

  // Repository info
  getStatus(): Promise<any>;
  getLog(maxCount?: number): Promise<any>;
  hasConflicts(): Promise<boolean>;
  getConflictedFiles(): Promise<string[]>;

  // Reset operations
  reset(mode: 'soft' | 'mixed' | 'hard', ref?: string): Promise<void>;
}

/**
 * Task repository initialization result
 */
export interface TaskRepoResult {
  git: SimpleGit;
  repoPath: string;
  taskNumber: number;
}

/**
 * Configuration for git user
 */
export interface GitUserConfig {
  name: string;
  email: string;
}
