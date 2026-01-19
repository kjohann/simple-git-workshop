import { initTaskRepo, createGitOps, hasFlag, CLI_FLAGS } from '../..';

/**
 * Task 1: Git Configuration & Setup
 * 
 * This task creates a Git repository with sample commits for participants to:
 * - Practice configuring Git (user, email, aliases, editor)
 * - Understand local vs global configuration
 * - Set up cross-platform settings
 * - Experiment with Git aliases and workflow preferences
 * - Test git log commands and formatting
 */
async function main() {
  // Parse command-line flags
  const force = hasFlag(CLI_FLAGS.FORCE);
  const clean = hasFlag(CLI_FLAGS.CLEAN);

  if (!clean) {
    console.log('🚀 Setting up Task 1: Git Configuration & Setup\n');
  }

  // Initialize task repository
  const { git, repoPath } = await initTaskRepo(1, force, ['Instructions.md'], clean);
  const ops = createGitOps(git, repoPath);

  // Create initial commits on main
  await ops.writeFile('_sample/README.md', '# Workshop Project\n\nA sample project for learning Git.\n');
  await ops.addAll();
  await ops.commit('Initial commit');

  await ops.writeFile('_sample/config.json', '{\n  "version": "1.0.0",\n  "name": "workshop"\n}');
  await ops.addAll();
  await ops.commit('Add configuration file');

  // Create feature branch and add commits
  await ops.createBranch('feature/add-logging');

  await ops.writeFile('_sample/src/logger.js', 'function log(message) {\n  console.log(`[LOG] ${message}`);\n}\n\nmodule.exports = { log };\n');
  await ops.addAll();
  await ops.commit('Add logger module');

  await ops.writeFile('_sample/src/main.js', 'const { log } = require("./logger");\n\nlog("Hello, Git!");\n');
  await ops.addAll();
  await ops.commit('Use logger in main application');

  // Switch back to main and add more commits (create divergence)
  await ops.switchBranch('main');

  await ops.writeFile('_sample/README.md', '# Workshop Project\n\nA sample project for learning Git.\n\n## Getting Started\n\nExplore the git history with various log commands!\n');
  await ops.addAll();
  await ops.commit('Update README with getting started section');

  await ops.writeFile('_sample/.gitignore', 'node_modules/\n*.log\n.env\n');
  await ops.addAll();
  await ops.commit('Add gitignore file');

  // Merge feature branch back to main
  await ops.merge('feature/add-logging');

  // Add one more commit after the merge
  await ops.writeFile('_sample/config.json', '{\n  "version": "1.1.0",\n  "name": "workshop",\n  "logging": true\n}');
  await ops.addAll();
  await ops.commit('Update config for logging feature');

  // Show final state
  console.log('\n📊 Repository Setup Complete!\n');
  console.log('Repository location:', repoPath);
  console.log('Current branch:', await ops.getCurrentBranch());
  console.log('\nBranches:');
  const branches = await ops.listBranches();
  branches.forEach(branch => console.log(`  - ${branch}`));

  console.log('\n📝 Git Log (all commits):');
  const log = await ops.getLog(10);
  log.all.forEach((commit: any) => {
    console.log(`  ${commit.hash.substring(0, 7)} - ${commit.message}`);
  });

  console.log('\n✅ Task 1 setup complete!\n');
  console.log('📖 Next steps:');
  console.log('   cd task1');
  console.log('   cat Instructions.md  # (or open in your editor)\n');
}

// Run the script
main().catch((error) => {
  console.error('\n❌ Error:', error.message);
  process.exit(1);
});
