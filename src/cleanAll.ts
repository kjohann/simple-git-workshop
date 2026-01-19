import { readdirSync } from 'fs';
import { resolve } from 'path';
import { execSync } from 'child_process';

/**
 * Cleans all task directories by running --clean on each task script.
 * Automatically discovers tasks by looking for task* directories and
 * corresponding src/tasks/task* scripts.
 */
async function cleanAll() {
  const rootDir = process.cwd();

  // Find all taskN directories
  const entries = readdirSync(rootDir, { withFileTypes: true });
  const taskDirs = entries
    .filter(e => e.isDirectory() && /^task\d+$/.test(e.name))
    .map(e => e.name)
    .sort((a, b) => {
      const numA = parseInt(a.replace('task', ''));
      const numB = parseInt(b.replace('task', ''));
      return numA - numB;
    });

  if (taskDirs.length === 0) {
    console.log('✅ No task directories found to clean.\n');
    return;
  }

  console.log(`🧹 Cleaning ${taskDirs.length} task(s)...\n`);

  for (const taskDir of taskDirs) {
    const taskNum = taskDir.replace('task', '');
    try {
      execSync(`npm run task:${taskNum} -- --clean`, {
        stdio: 'inherit',
        cwd: rootDir
      });
    } catch (error) {
      // Task script might not exist, skip it
      console.log(`⚠️  Could not clean ${taskDir} (task:${taskNum} script may not exist)\n`);
    }
  }

  console.log('\n✅ All tasks cleaned!\n');
}

cleanAll().catch(console.error);
