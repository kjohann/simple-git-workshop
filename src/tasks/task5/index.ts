import { initTaskRepo, createGitOps, getTaskPath, hasFlag, CLI_FLAGS } from '../..';

const TASK_NUMBER = 5;

/**
 * Task 5: Interactive Rebase - Reordering and Removing Commits
 *
 * This task sets up a scenario where:
 * - main branch has initial commits (project setup)
 * - feature branch has 6 commits that need cleanup:
 *   1. Implement user creation logic
 *   2. Implement user edit logic
 *   3. Fixed unrelated bug (needs to be moved to end)
 *   4. Implement user deletion logic
 *   5. Trying out something (needs to be dropped)
 *   6. Fixup: tests for user creation logic (needs to be fixup of #1)
 *
 * Desired final order:
 *   1. Implement user creation logic (with tests fixup)
 *   2. Implement user edit logic
 *   3. Implement user deletion logic
 *   4. Fixed unrelated bug
 */
async function setupTask5() {
  const clean = hasFlag(CLI_FLAGS.CLEAN);
  if (!clean) {
    console.log('🚀 Setting up Task 5: Interactive Rebase - Reordering and Removing Commits\n');
  }

  // Initialize repository
  const filesToPreserve = ['Instructions.md'];
  const { git, repoPath } = await initTaskRepo(
    TASK_NUMBER,
    hasFlag(CLI_FLAGS.FORCE),
    filesToPreserve,
    hasFlag(CLI_FLAGS.CLEAN)
  );

  const ops = createGitOps(git, repoPath);

  console.log('📁 Creating initial project structure...\n');

  // === MAIN BRANCH SETUP ===

  // Commit 1: Initial project setup
  await ops.writeFile(
    '_sample/README.md',
    `# User Management API

A simple user management module with CRUD operations.

## Features

- Create users
- Read user data
- Update users
- Delete users

## Usage

\`\`\`javascript
const userManager = require('./userManager');

// Create a user
const user = userManager.createUser('john', 'john@example.com');
\`\`\`
`
  );
  await ops.writeFile(
    '_sample/package.json',
    `{
  "name": "user-management-api",
  "version": "1.0.0",
  "description": "Simple user management module",
  "main": "userManager.js",
  "scripts": {
    "test": "node tests.js"
  }
}
`
  );
  await ops.addAll();
  await ops.commit('Initial project setup');
  console.log('✓ Created initial project setup on main');

  // === FEATURE BRANCH SETUP ===

  console.log('\n🌲 Creating feature branch with messy commit history...\n');

  await ops.createBranch('feature/user-crud');
  console.log('✓ Created and switched to feature/user-crud branch');

  // Feature Commit 1: Implement user creation logic
  await ops.writeFile(
    '_sample/userManager.js',
    `/**
 * User Management Module
 */

const users = [];
let nextId = 1;

/**
 * Creates a new user
 * @param {string} username - The username
 * @param {string} email - The email address
 * @returns {object} - The created user
 */
function createUser(username, email) {
  const user = {
    id: nextId++,
    username,
    email,
    createdAt: new Date().toISOString()
  };
  users.push(user);
  return user;
}

/**
 * Gets all users
 * @returns {Array} - All users
 */
function getAllUsers() {
  return [...users];
}

module.exports = {
  createUser,
  getAllUsers
};
`
  );
  await ops.addAll();
  await ops.commit('Implement user creation logic');
  console.log('✓ Commit 1: Implement user creation logic');

  // Feature Commit 2: Implement user edit logic
  await ops.writeFile(
    '_sample/userManager.js',
    `/**
 * User Management Module
 */

const users = [];
let nextId = 1;

/**
 * Creates a new user
 * @param {string} username - The username
 * @param {string} email - The email address
 * @returns {object} - The created user
 */
function createUser(username, email) {
  const user = {
    id: nextId++,
    username,
    email,
    createdAt: new Date().toISOString()
  };
  users.push(user);
  return user;
}

/**
 * Gets all users
 * @returns {Array} - All users
 */
function getAllUsers() {
  return [...users];
}

/**
 * Finds a user by ID
 * @param {number} id - The user ID
 * @returns {object|undefined} - The user or undefined
 */
function findUserById(id) {
  return users.find(user => user.id === id);
}

/**
 * Updates a user
 * @param {number} id - The user ID
 * @param {object} updates - The fields to update
 * @returns {object|null} - The updated user or null if not found
 */
function updateUser(id, updates) {
  const user = findUserById(id);
  if (!user) {
    return null;
  }
  
  if (updates.username) user.username = updates.username;
  if (updates.email) user.email = updates.email;
  user.updatedAt = new Date().toISOString();
  
  return user;
}

module.exports = {
  createUser,
  getAllUsers,
  findUserById,
  updateUser
};
`
  );
  await ops.addAll();
  await ops.commit('Implement user edit logic');
  console.log('✓ Commit 2: Implement user edit logic');

  // Feature Commit 3: Fixed unrelated bug (this will be moved to the end)
  await ops.writeFile(
    '_sample/README.md',
    `# User Management API

A simple user management module with CRUD operations.

## Features

- Create users
- Read user data
- Update users
- Delete users

## Usage

\`\`\`javascript
const userManager = require('./userManager');

// Create a user
const user = userManager.createUser('john', 'john@example.com');
\`\`\`

## License

MIT
`
  );
  await ops.addAll();
  await ops.commit('Fixed unrelated bug');
  console.log('✓ Commit 3: Fixed unrelated bug (misplaced - should be at end)');

  // Feature Commit 4: Implement user deletion logic
  await ops.writeFile(
    '_sample/userManager.js',
    `/**
 * User Management Module
 */

const users = [];
let nextId = 1;

/**
 * Creates a new user
 * @param {string} username - The username
 * @param {string} email - The email address
 * @returns {object} - The created user
 */
function createUser(username, email) {
  const user = {
    id: nextId++,
    username,
    email,
    createdAt: new Date().toISOString()
  };
  users.push(user);
  return user;
}

/**
 * Gets all users
 * @returns {Array} - All users
 */
function getAllUsers() {
  return [...users];
}

/**
 * Finds a user by ID
 * @param {number} id - The user ID
 * @returns {object|undefined} - The user or undefined
 */
function findUserById(id) {
  return users.find(user => user.id === id);
}

/**
 * Updates a user
 * @param {number} id - The user ID
 * @param {object} updates - The fields to update
 * @returns {object|null} - The updated user or null if not found
 */
function updateUser(id, updates) {
  const user = findUserById(id);
  if (!user) {
    return null;
  }
  
  if (updates.username) user.username = updates.username;
  if (updates.email) user.email = updates.email;
  user.updatedAt = new Date().toISOString();
  
  return user;
}

/**
 * Deletes a user
 * @param {number} id - The user ID
 * @returns {boolean} - True if deleted, false if not found
 */
function deleteUser(id) {
  const index = users.findIndex(user => user.id === id);
  if (index === -1) {
    return false;
  }
  users.splice(index, 1);
  return true;
}

module.exports = {
  createUser,
  getAllUsers,
  findUserById,
  updateUser,
  deleteUser
};
`
  );
  await ops.addAll();
  await ops.commit('Implement user deletion logic');
  console.log('✓ Commit 4: Implement user deletion logic');

  // Feature Commit 5: Trying out something (this will be dropped)
  await ops.writeFile(
    '_sample/experimental.js',
    `// Just trying something out
// This file shouldn't be committed

console.log('Testing...');
console.log('More testing...');

// TODO: Remove this file
`
  );
  await ops.addAll();
  await ops.commit('Trying out something');
  console.log('✓ Commit 5: Trying out something (should be dropped)');

  // Feature Commit 6: Fixup - tests for user creation logic (should be fixup of commit 1)
  await ops.writeFile(
    '_sample/tests.js',
    `/**
 * Tests for User Management Module
 */

const { createUser, getAllUsers, findUserById, updateUser, deleteUser } = require('./userManager');

console.log('Running user creation tests...\\n');

// Test createUser
console.log('Testing createUser...');
const user1 = createUser('alice', 'alice@example.com');
console.assert(user1.id === 1, 'First user should have ID 1');
console.assert(user1.username === 'alice', 'Username should be alice');
console.assert(user1.email === 'alice@example.com', 'Email should match');
console.assert(user1.createdAt !== undefined, 'Should have createdAt timestamp');
console.log('✓ createUser tests passed\\n');

// Test creating multiple users
console.log('Testing multiple user creation...');
const user2 = createUser('bob', 'bob@example.com');
console.assert(user2.id === 2, 'Second user should have ID 2');
const allUsers = getAllUsers();
console.assert(allUsers.length === 2, 'Should have 2 users');
console.log('✓ Multiple user creation tests passed\\n');

console.log('All user creation tests completed! ✓');
`
  );
  await ops.addAll();
  await ops.commit('Fixup: tests for user creation logic');
  console.log('✓ Commit 6: Fixup - tests for user creation (should be fixup of commit 1)');

  // Show final state
  console.log('\n📊 Repository state:\n');
  const branches = await ops.listBranches();
  console.log('Branches:');
  branches.forEach(branch => console.log(`  - ${branch}`));

  console.log('\nCommit history (feature/user-crud):');
  const log = await ops.getLog();
  log.all.forEach((commit: any, index: number) => {
    const marker = getCommitMarker(commit.message);
    console.log(`  ${commit.hash.substring(0, 7)} - ${commit.message}${marker}`);
  });

  console.log('\n✅ Task 5 setup complete!');
  console.log(`📖 Next: cd task5 && cat Instructions.md\n`);
}

/**
 * Returns a marker for commits that need special handling
 */
function getCommitMarker(message: string): string {
  if (message.includes('Trying out something')) return ' ← DROP this';
  if (message.includes('Fixup:')) return ' ← FIXUP (move to after commit 1)';
  if (message === 'Fixed unrelated bug') return ' ← MOVE to end';
  return '';
}

setupTask5().catch((error) => {
  console.error('❌ Setup failed:', error.message);
  process.exit(1);
});
