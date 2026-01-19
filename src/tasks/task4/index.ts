import { initTaskRepo, createGitOps, getTaskPath, hasFlag, CLI_FLAGS } from '../..';

const TASK_NUMBER = 4;
const TASK_PATH = getTaskPath(TASK_NUMBER);

async function setupTask4() {
  console.log('🚀 Setting up Task 4: Interactive Rebase Basics\n');

  // Initialize repository
  const filesToPreserve = ['Instructions.md'];
  const { git, repoPath } = await initTaskRepo(
    TASK_NUMBER,
    hasFlag(CLI_FLAGS.FORCE),
    filesToPreserve
  );

  const ops = createGitOps(git, repoPath);

  console.log('📁 Creating initial project structure...\n');

  // Commit 1: Initial project setup
  await ops.writeFile(
    '_sample/README.md',
    `# User Validation Module

A simple user validation library for validating usernames and emails.

## Usage

\`\`\`javascript
const { validateUsername, validateEmail } = require('./validator');

if (validateUsername('john_doe')) {
  console.log('Valid username!');
}
\`\`\`
`
  );
  await ops.addAll();
  await ops.commit('Initial project setup');
  console.log('✓ Created initial project structure');

  // Commit 2: Add package info
  await ops.writeFile(
    '_sample/package.json',
    `{
  "name": "user-validator",
  "version": "1.0.0",
  "description": "Simple user validation library",
  "main": "validator.js",
  "scripts": {
    "test": "node tests.js"
  }
}
`
  );
  await ops.addAll();
  await ops.commit('Add package configuration');
  console.log('✓ Added package configuration');

  console.log('\n🌲 Creating feature branch for validation work...\n');

  // Create feature branch
  await ops.createBranch('feature/user-validation');
  console.log('✓ Created and switched to feature/user-validation branch');

  // Feature commit 1: Add username validation (without email)
  await ops.writeFile(
    '_sample/validator.js',
    `/**
 * User validation utilities
 */

/**
 * Validates a username
 * @param {string} username - The username to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function validateUsername(username) {
  if (!username || typeof username !== 'string') {
    return false;
  }
  
  // Username must be 3-20 characters, alphanumeric with underscores
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
}

module.exports = {
  validateUsername
};
`
  );
  await ops.addAll();
  await ops.commit('Add username validation function');
  console.log('✓ Commit 1: Add username validation function');

  // Feature commit 2: Fixup - add missing email validation
  await ops.writeFile(
    '_sample/validator.js',
    `/**
 * User validation utilities
 */

/**
 * Validates a username
 * @param {string} username - The username to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function validateUsername(username) {
  if (!username || typeof username !== 'string') {
    return false;
  }
  
  // Username must be 3-20 characters, alphanumeric with underscores
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
}

/**
 * Validates an email address
 * @param {string} email - The email to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return false;
  }
  
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

module.exports = {
  validateUsername,
  validateEmail
};
`
  );
  await ops.addAll();
  await ops.commit('Fixup: forgot email validation');
  console.log('✓ Commit 2: Fixup - forgot email validation');

  // Feature commit 3: Add phone support (with unclear commit message - reword target)
  await ops.writeFile(
    '_sample/validator.js',
    `/**
 * User validation utilities
 */

/**
 * Validates a username
 * @param {string} username - The username to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function validateUsername(username) {
  if (!username || typeof username !== 'string') {
    return false;
  }
  
  // Username must be 3-20 characters, alphanumeric with underscores
  // Or a valid phone number (10 digits)
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  const phoneRegex = /^\\d{10}$/;
  return usernameRegex.test(username) || phoneRegex.test(username);
}

/**
 * Validates an email address
 * @param {string} email - The email to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return false;
  }
  
  // Basic email validation
  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  return emailRegex.test(email);
}

module.exports = {
  validateUsername,
  validateEmail
};
`
  );
  await ops.addAll();
  await ops.commit('This needs rewording: Support phone');
  console.log('✓ Commit 3: Vague commit message (reword target)');

  // Feature commit 4: Add profile function
  await ops.writeFile(
    '_sample/profile.js',
    `const { validateUsername, validateEmail } = require('./validator');

/**
 * Creates a user profile
 * @param {string} username - The username
 * @param {string} email - The email address
 * @returns {object|null} - Profile object or null if invalid
 */
function createProfile(username, email) {
  if (!validateUsername(username)) {
    return null;
  }
  
  if (!validateEmail(email)) {
    return null;
  }
  
  return {
    username,
    email,
    createdAt: new Date().toISOString()
  };
}

module.exports = {
  createProfile
};
`
  );
  await ops.addAll();
  await ops.commit('Add new profile function');
  console.log('✓ Commit 4: Add new profile function');

  // Feature commit 5: Add tests for creating profile
  await ops.writeFile(
    '_sample/tests.js',
    `const { createProfile } = require('./profile');

console.log('Running profile tests...\\n');

// Profile creation tests
console.log('Testing profile creation...');
const validProfile = createProfile('john_doe', 'john@example.com');
console.assert(validProfile !== null, 'Valid profile should be created');
console.assert(validProfile.username === 'john_doe', 'Username should match');
console.assert(validProfile.email === 'john@example.com', 'Email should match');
console.log('✓ Profile creation tests passed\\n');
`
  );
  await ops.addAll();
  await ops.commit('Add tests for creating profile');
  console.log('✓ Commit 5: Add tests for creating profile');

  // Feature commit 6: Add test using username validator
  await ops.writeFile(
    '_sample/tests.js',
    `const { createProfile } = require('./profile');

console.log('Running profile tests...\\n');

// Profile creation tests
console.log('Testing profile creation...');
const validProfile = createProfile('john_doe', 'john@example.com');
console.assert(validProfile !== null, 'Valid profile should be created');
console.assert(validProfile.username === 'john_doe', 'Username should match');
console.assert(validProfile.email === 'john@example.com', 'Email should match');
console.log('✓ Profile creation tests passed\\n');

// Test with phone number as username
console.log('Testing profile with phone username...');
const phoneProfile = createProfile('1234567890', 'user@example.com');
console.assert(phoneProfile !== null, 'Profile with phone username should be created');
console.assert(phoneProfile.username === '1234567890', 'Phone username should match');
console.log('✓ Phone username tests passed\\n');

// Test with invalid inputs
console.log('Testing invalid profiles...');
const invalidUsername = createProfile('ab', 'john@example.com');
console.assert(invalidUsername === null, 'Invalid username should return null');
const invalidEmail = createProfile('john_doe', 'invalid');
console.assert(invalidEmail === null, 'Invalid email should return null');
console.log('✓ Invalid profile tests passed\\n');

console.log('All tests completed successfully! ✓');
`
  );
  await ops.addAll();
  await ops.commit('Add test that uses username validator when creating profile');
  console.log('✓ Commit 6: Add test using username validator');

  // Show final state
  console.log('\n📊 Repository state:\n');
  const branches = await ops.listBranches();
  console.log('Branches:');
  branches.forEach(branch => console.log(`  - ${branch}`));

  console.log('\nCommit history (feature/user-validation):');
  const log = await ops.getLog();
  log.all.forEach((commit: any) => {
    console.log(`  ${commit.hash.substring(0, 7)} - ${commit.message}`);
  });

  console.log('\n✅ Task 4 setup complete!');
  console.log(`📖 Next: cd ${TASK_NUMBER === 4 ? 'task4' : `task${TASK_NUMBER}`} && cat Instructions.md\n`);
}

setupTask4().catch((error) => {
  console.error('❌ Setup failed:', error.message);
  process.exit(1);
});
