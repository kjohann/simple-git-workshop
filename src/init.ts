import simpleGit from 'simple-git';
import { existsSync } from 'fs';
import { rm, mkdir, readdir } from 'fs/promises';
import { resolve, join } from 'path';
import { TaskRepoResult, GitUserConfig } from './types';
import { INSTRUCTIONS_FILE_NAME } from './constants';

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
 * @param preserveFiles - Array of filenames to preserve when force is true (default: [INSTRUCTIONS_FILE_NAME])
 * @param cleanOnly - If true, only clean the directory and exit without recreating
 * @returns Git instance and repository path (or null if cleanOnly)
 * @throws Error if directory exists and force is false
 */
export async function initTaskRepo(
  taskNumber: number,
  force: boolean = false,
  preserveFiles: string[] = [INSTRUCTIONS_FILE_NAME],
  cleanOnly: boolean = false
): Promise<TaskRepoResult> {
  const taskDir = `task${taskNumber}`;
  const repoPath = resolve(process.cwd(), taskDir);
  const gitPath = join(repoPath, '.git');

  // Handle --clean flag: remove files and exit
  if (cleanOnly) {
    const dirExists = existsSync(repoPath);
    if (!dirExists) {
      console.log(`✅ Nothing to clean: ${taskDir}/ does not exist.\n`);
      process.exit(0);
    }

    console.log(`🧹 Cleaning ${taskDir}/...`);

    // Delete .git directory if it exists
    if (existsSync(gitPath)) {
      await rm(gitPath, { recursive: true, force: true });
    }

    // Delete all files except preserved ones
    const entries = await readdir(repoPath);
    let cleanedCount = 0;
    for (const entry of entries) {
      if (!preserveFiles.includes(entry)) {
        await rm(join(repoPath, entry), { recursive: true, force: true });
        cleanedCount++;
      }
    }

    console.log(`✅ Cleaned ${taskDir}/ (removed ${cleanedCount} items, preserved: ${preserveFiles.join(', ')})\n`);
    process.exit(0);
  }

  // Check if git repository already exists
  const gitExists = existsSync(gitPath);

  if (gitExists) {
    if (!force) {
      throw new Error(
        `\n❌ Task repository already exists: ${taskDir}/\n\n` +
        `To reset and recreate this task repository, rerun with --force flag:\n` +
        `  npm run task:${taskNumber} -- --force\n\n` +
        `⚠️  WARNING: This will DELETE all files and git history in ${taskDir}/\n`
      );
    }

    // Force flag present - only delete .git and files that aren't preserved
    console.log(`🗑️  Removing git repository and generated files from ${taskDir}/...`);

    // Delete .git directory
    await rm(gitPath, { recursive: true, force: true });

    // Delete all files except preserved ones
    const dirExists = existsSync(repoPath);
    if (dirExists) {
      const entries = await readdir(repoPath);
      for (const entry of entries) {
        if (!preserveFiles.includes(entry)) {
          await rm(join(repoPath, entry), { recursive: true, force: true });
        }
      }
    }
  }

  // Ensure directory exists
  if (!existsSync(repoPath)) {
    console.log(`📁 Creating ${taskDir}/...`);
    await mkdir(repoPath, { recursive: true });
  }

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
