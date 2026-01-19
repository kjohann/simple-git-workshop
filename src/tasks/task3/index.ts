import { initTaskRepo, createGitOps, hasFlag, CLI_FLAGS } from '../..';

/**
 * Task 3: Merge Conflicts and Rerere
 * 
 * This task sets up a scenario where:
 * - main branch has initial commits
 * - feature branch is created with conflicting changes
 * - Participants will experience resolving the same conflicts multiple times
 * - They'll learn about git rebase --abort and rerere
 */
async function main() {
  // Parse command-line flags
  const force = hasFlag(CLI_FLAGS.FORCE);
  const clean = hasFlag(CLI_FLAGS.CLEAN);

  if (!clean) {
    console.log('🚀 Setting up Task 3: Merge Conflicts and Rerere\n');
  }

  // Initialize task repository
  const { git, repoPath } = await initTaskRepo(3, force, ['Instructions.md'], clean);
  const ops = createGitOps(git, repoPath);

  // Create initial commits on main
  await ops.writeFile('_sample/README.md', '# Task Manager\n\nA simple task management application.\n\n## Features\n- Create tasks\n- Track status\n');
  await ops.addAll();
  await ops.commit('Initial commit');

  await ops.writeFile('_sample/tasks.js', 'function createTask(title, description) {\n  return {\n    id: Date.now(),\n    title,\n    description,\n    status: "TODO",\n    priority: "NORMAL",\n  };\n}\n\nmodule.exports = { createTask };\n');
  await ops.addAll();
  await ops.commit('Add task creation function');

  // Create feature branch
  await ops.createBranch('feature/enhance-tasks');

  // Add two commits on feature branch with changes that will conflict
  // Commit 1: Changes to README title and tasks.js status
  await ops.writeFile('_sample/README.md', '# Task Manager Pro\n\nA simple task management application.\n\n## Features\n- Create tasks\n- Track status\n');
  await ops.writeFile('_sample/tasks.js', 'function createTask(title, description) {\n  return {\n    id: Date.now(),\n    title,\n    description,\n    status: "PENDING",\n    priority: "NORMAL",\n  };\n}\n\nmodule.exports = { createTask };\n');
  await ops.addAll();
  await ops.commit('Update branding and default status');

  // Commit 2: Changes to README description and tasks.js priority
  await ops.writeFile('_sample/README.md', '# Task Manager Pro\n\nA powerful task management application.\n\n## Features\n- Create tasks\n- Track status\n');
  await ops.writeFile('_sample/tasks.js', 'function createTask(title, description) {\n  return {\n    id: Date.now(),\n    title,\n    description,\n    status: "PENDING",\n    priority: "HIGH",\n  };\n}\n\nmodule.exports = { createTask };\n');
  await ops.addAll();
  await ops.commit('Enhance descriptions and priority');

  // Switch back to main and add conflicting changes
  await ops.switchBranch('main');

  // Commit 3: Conflicts with feature's first commit
  await ops.writeFile('_sample/README.md', '# Task Tracker\n\nA simple task management application.\n\n## Features\n- Create tasks\n- Track status\n');
  await ops.writeFile('_sample/tasks.js', 'function createTask(title, description) {\n  return {\n    id: Date.now(),\n    title,\n    description,\n    status: "OPEN",\n    priority: "NORMAL",\n  };\n}\n\nmodule.exports = { createTask };\n');
  await ops.addAll();
  await ops.commit('Rebrand to Task Tracker and update status');

  // Commit 4: Conflicts with feature's second commit
  await ops.writeFile('_sample/README.md', '# Task Tracker\n\nA comprehensive task management application.\n\n## Features\n- Create tasks\n- Track status\n');
  await ops.writeFile('_sample/tasks.js', 'function createTask(title, description) {\n  return {\n    id: Date.now(),\n    title,\n    description,\n    status: "OPEN",\n    priority: "LOW",\n  };\n}\n\nmodule.exports = { createTask };\n');
  await ops.addAll();
  await ops.commit('Update descriptions and set priority to LOW');

  // Switch back to feature branch for rebase
  await ops.switchBranch('feature/enhance-tasks');

  // Show final state
  console.log('\n📊 Repository Setup Complete!\n');
  console.log('Repository location:', repoPath);
  console.log('Current branch:', await ops.getCurrentBranch());
  console.log('\nBranches:');
  const branches = await ops.listBranches();
  branches.forEach(branch => console.log(`  - ${branch}`));

  console.log('\n📝 Git Log (all branches):');
  await ops.switchBranch('main');
  const mainLog = await ops.getLog(10);
  console.log('\n  main branch:');
  mainLog.all.forEach((commit: any) => {
    console.log(`    ${commit.hash.substring(0, 7)} - ${commit.message}`);
  });

  await ops.switchBranch('feature/enhance-tasks');
  const featureLog = await ops.getLog(10);
  console.log('\n  feature/enhance-tasks branch:');
  featureLog.all.forEach((commit: any) => {
    console.log(`    ${commit.hash.substring(0, 7)} - ${commit.message}`);
  });

  console.log('\n✅ Task 3 setup complete!\n');
  console.log('📖 Next steps:');
  console.log('   cd task3');
  console.log('   cat Instructions.md  # (or open in your editor)\n');
}

// Run the script
main().catch((error) => {
  console.error('\n❌ Error:', error.message);
  process.exit(1);
});
