import { SimpleGit } from 'simple-git';
import { writeFile, readFile, unlink, access, rm, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { GitOps } from './types';

/**
 * Creates a bound git operations object for a specific repository.
 * All operations are curried with the git instance and repo path.
 * 
 * @param git - SimpleGit instance for the repository
 * @param repoPath - Absolute path to the repository
 * @returns Object with bound git operations
 */
export function createGitOps(git: SimpleGit, repoPath: string): GitOps {
  return {
    // ==================== Branch Operations ====================

    async createBranch(name: string): Promise<void> {
      await git.checkoutLocalBranch(name);
      console.log(`✓ Created and checked out branch: ${name}`);
    },

    async switchBranch(name: string): Promise<void> {
      await git.checkout(name);
      console.log(`✓ Switched to branch: ${name}`);
    },

    async deleteBranch(name: string, force: boolean = false): Promise<void> {
      await git.deleteLocalBranch(name, force);
      console.log(`✓ Deleted branch: ${name}`);
    },

    async getCurrentBranch(): Promise<string> {
      const status = await git.status();
      return status.current || 'HEAD';
    },

    async listBranches(): Promise<string[]> {
      const result = await git.branchLocal();
      return result.all;
    },

    // ==================== File Operations ====================

    async writeFile(relativePath: string, content: string): Promise<void> {
      const fullPath = join(repoPath, relativePath);
      const dir = dirname(fullPath);
      await mkdir(dir, { recursive: true });
      await writeFile(fullPath, content, 'utf-8');
      console.log(`✓ Created/updated file: ${relativePath}`);
    },

    async readFile(relativePath: string): Promise<string> {
      const fullPath = join(repoPath, relativePath);
      return await readFile(fullPath, 'utf-8');
    },

    async deleteFile(relativePath: string): Promise<void> {
      const fullPath = join(repoPath, relativePath);
      await unlink(fullPath);
      console.log(`✓ Deleted file: ${relativePath}`);
    },

    async fileExists(relativePath: string): Promise<boolean> {
      try {
        const fullPath = join(repoPath, relativePath);
        await access(fullPath);
        return true;
      } catch {
        return false;
      }
    },

    // ==================== Staging Operations ====================

    async addFiles(files: string[]): Promise<void> {
      await git.add(files);
      console.log(`✓ Staged files: ${files.join(', ')}`);
    },

    async addAll(): Promise<void> {
      await git.add('.');
      console.log(`✓ Staged all changes`);
    },

    // ==================== Commit Operations ====================

    async commit(message: string): Promise<void> {
      await git.commit(message);
      console.log(`✓ Committed: ${message}`);
    },

    async amendCommit(message?: string): Promise<void> {
      if (message) {
        await git.commit(message, undefined, { '--amend': null });
        console.log(`✓ Amended commit with new message: ${message}`);
      } else {
        await git.raw(['commit', '--amend', '--no-edit']);
        console.log(`✓ Amended commit (kept message)`);
      }
    },

    // ==================== Rebase Operations ====================

    async rebase(branch: string): Promise<void> {
      try {
        await git.rebase([branch]);
        console.log(`✓ Successfully rebased onto ${branch}`);
      } catch (error) {
        console.log(`⚠️  Rebase conflict detected (this may be expected)`);
        throw error;
      }
    },

    async rebaseContinue(): Promise<void> {
      await git.rebase(['--continue']);
      console.log(`✓ Rebase continued`);
    },

    async rebaseAbort(): Promise<void> {
      await git.rebase(['--abort']);
      console.log(`✓ Rebase aborted`);
    },

    // ==================== Merge Operations ====================

    async merge(branch: string): Promise<void> {
      try {
        await git.merge([branch]);
        console.log(`✓ Successfully merged ${branch}`);
      } catch (error) {
        console.log(`⚠️  Merge conflict detected`);
        throw error;
      }
    },

    async mergeAbort(): Promise<void> {
      await git.merge(['--abort']);
      console.log(`✓ Merge aborted`);
    },

    // ==================== Rerere Operations ====================

    async enableRerere(): Promise<void> {
      await git.addConfig('rerere.enabled', 'true');
      console.log(`✓ Enabled git rerere`);
    },

    async disableRerere(): Promise<void> {
      await git.addConfig('rerere.enabled', 'false');
      console.log(`✓ Disabled git rerere`);
    },

    async isRerereEnabled(): Promise<boolean> {
      try {
        const result = await git.getConfig('rerere.enabled');
        return result.value === 'true';
      } catch {
        return false;
      }
    },

    async clearRerereCache(): Promise<void> {
      const rererePath = join(repoPath, '.git', 'rr-cache');
      try {
        await rm(rererePath, { recursive: true, force: true });
        console.log(`✓ Cleared rerere cache`);
      } catch (error) {
        // Directory might not exist, that's okay
        console.log(`✓ No rerere cache to clear`);
      }
    },

    // ==================== Repository Info ====================

    async getStatus(): Promise<any> {
      return await git.status();
    },

    async getLog(maxCount: number = 10): Promise<any> {
      return await git.log({ maxCount });
    },

    async hasConflicts(): Promise<boolean> {
      const status = await git.status();
      return status.conflicted.length > 0;
    },

    async getConflictedFiles(): Promise<string[]> {
      const status = await git.status();
      return status.conflicted;
    },

    // ==================== Reset Operations ====================

    async reset(mode: 'soft' | 'mixed' | 'hard' = 'hard', ref: string = 'HEAD'): Promise<void> {
      await git.reset([`--${mode}`, ref]);
      console.log(`✓ Reset (${mode}) to ${ref}`);
    }
  };
}
