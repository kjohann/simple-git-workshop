import { initTaskRepo, createGitOps, hasFlag, CLI_FLAGS } from '../..';

/**
 * Task 2: Simple Fast-Forward Rebase
 * 
 * This task sets up a scenario where:
 * - main branch has initial commits
 * - feature branch is created from an earlier commit
 * - feature branch has its own commits
 * - main branch continues to evolve
 * - The participant will practice rebasing feature onto main (fast-forward)
 */
async function main() {
  // Parse command-line flags
  const force = hasFlag(CLI_FLAGS.FORCE);
  const clean = hasFlag(CLI_FLAGS.CLEAN);

  if (!clean) {
    console.log('🚀 Setting up Task 2: Simple Fast-Forward Rebase\n');
  }

  // Initialize task repository
  const { git, repoPath } = await initTaskRepo(2, force, ['Instructions.md'], clean);
  const ops = createGitOps(git, repoPath);

  // Create initial commit on main
  await ops.writeFile('_sample/README.md', '# Project\n\nWelcome to the project!');
  await ops.addAll();
  await ops.commit('Initial commit');

  await ops.writeFile('_sample/config.json', '{\n  "version": "1.0.0"\n}');
  await ops.addAll();
  await ops.commit('Add config file');

  // Create feature branch
  await ops.createBranch('feature/add-calculator');

  // Add commits on feature branch
  await ops.writeFile('_sample/calculator.js', 'function add(a, b) {\n  return a + b;\n}\n\nmodule.exports = { add };');
  await ops.addAll();
  await ops.commit('Add calculator with add function');

  await ops.writeFile('_sample/calculator.test.js', 'const { add } = require("./calculator");\n\ntest("add", () => {\n  expect(add(2, 3)).toBe(5);\n});');
  await ops.addAll();
  await ops.commit('Add tests for calculator');

  // Switch back to main and add more commits
  await ops.switchBranch('main');

  await ops.writeFile('_sample/README.md', '# Project\n\nWelcome to the project!\n\n## Features\n- Configuration management\n');
  await ops.addAll();
  await ops.commit('Update README with features section');

  await ops.writeFile('_sample/utils.js', 'function formatDate(date) {\n  return date.toISOString();\n}\n\nmodule.exports = { formatDate };');
  await ops.addAll();
  await ops.commit('Add utils module');

  await ops.writeFile('_sample/config.json', '{\n  "version": "1.1.0",\n  "author": "Workshop Team"\n}');
  await ops.addAll();
  await ops.commit('Update config to version 1.1.0');

  // Show final state
  console.log('\n📊 Repository Setup Complete!\n');
  console.log('Current branch:', await ops.getCurrentBranch());
  console.log('\nBranches:');
  const branches = await ops.listBranches();
  branches.forEach(branch => console.log(`  - ${branch}`));

  console.log('\n📝 Git Log (main):');
  const log = await ops.getLog(10);
  log.all.forEach((commit: any) => {
    console.log(`  ${commit.hash.substring(0, 7)} - ${commit.message}`);
  });

  console.log('\n✅ Task 2 setup complete!\n');
  console.log('📖 Next steps:');
  console.log('   cd task2');
  console.log('   cat Instructions.md  # (or open in your editor)\n');
}

// Run the script
main().catch((error) => {
  console.error('\n❌ Error:', error.message);
  process.exit(1);
});
