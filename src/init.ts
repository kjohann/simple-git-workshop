import simpleGit from 'simple-git';
import { existsSync } from 'fs';
import { rm, mkdir } from 'fs/promises';
import { resolve } from 'path';
import { TaskRepoResult, GitUserConfig } from './types';

/**
 * Default git user configuration for workshop
 */
const DEFAULT_GIT_USER: GitUserConfig = {
  name: 'Rebase Wizard 🧙',
  email: 'merge-conflicts-begone@git-workshop.dev'
};

/**
 * Initialize a task repository.
 * Creates a new git repository in taskN/ directory.
 * 
 * @param taskNumber - The task number (creates taskN/ directory)
 * @param force - If true, wipes existing directory; if false, throws error if exists
 * @returns Git instance and repository path
 * @throws Error if directory exists and force is false
 */
export async function initTaskRepo(
  taskNumber: number,
  force: boolean = false
): Promise<TaskRepoResult> {
  const taskDir = `task${taskNumber}`;
  const repoPath = resolve(process.cwd(), taskDir);

  // Check if directory exists
  if (existsSync(repoPath)) {
    if (!force) {
      throw new Error(
        `\n❌ Task repository already exists: ${taskDir}/\n\n` +
        `To reset and recreate this task repository, rerun with --force flag:\n` +
        `  npm run task:${taskNumber} -- --force\n\n` +
        `⚠️  WARNING: This will DELETE all files and git history in ${taskDir}/\n`
      );
    }

    // Force flag present - wipe everything
    console.log(`🗑️  Removing existing ${taskDir}/...`);
    await rm(repoPath, { recursive: true, force: true });
  }

  // Create fresh directory
  console.log(`📁 Creating ${taskDir}/...`);
  await mkdir(repoPath, { recursive: true });

  // Initialize git repository
  console.log(`🎯 Initializing git repository...`);
  const git = simpleGit(repoPath);
  await git.init(['-b', 'main']);

  // Configure git user
  await git.addConfig('user.name', DEFAULT_GIT_USER.name);
  await git.addConfig('user.email', DEFAULT_GIT_USER.email);

  console.log(`✅ Task repository initialized: ${taskDir}/\n`);
  console.log(`   User: ${DEFAULT_GIT_USER.name} <${DEFAULT_GIT_USER.email}>\n`);

  return {
    git,
    repoPath,
    taskNumber
  };
}
