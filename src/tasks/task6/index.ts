import { initTaskRepo, createGitOps, hasFlag, CLI_FLAGS } from '../..';

const TASK_NUMBER = 6;

/**
 * Task 6: Rebase --onto - Surgical Branch Transplanting
 *
 * This task sets up a scenario where:
 * - main branch has initial commits (M1, M2), then later M3, M4
 * - featureA branch is created from M2 with 3 commits (A1, A2, A3)
 * - featureB branch is created from A2 with 2 commits (B1, B2)
 * - main gets 2 more commits (M3, M4)
 * - featureA is rebased onto main (creating A1', A2', A3')
 * - featureB is now orphaned, still pointing to old A2!
 *
 * The learner must use `git rebase --onto` to move featureB's commits
 * onto the rebased featureA.
 *
 * Graph before featureA rebase:
 *           B1---B2  featureB
 *          /
 *     A1---A2---A3  featureA
 *    /
 * M1---M2---M3---M4  main
 *
 * Graph after featureA rebase (current state when task starts):
 *           B1---B2  featureB (orphaned!)
 *          /
 *     A1---A2---A3  (orphaned commits)
 *    /
 * M1---M2---M3---M4  main
 *               \
 *                A1'---A2'---A3'  featureA (rebased)
 *
 * Desired final state:
 * M1---M2---M3---M4  main
 *               \
 *                A1'---A2'---A3'  featureA
 *                           \
 *                            B1'---B2'  featureB
 */
async function setupTask6() {
  console.log('🚀 Setting up Task 6: Rebase --onto - Surgical Branch Transplanting\n');

  // Initialize repository
  const filesToPreserve = ['Instructions.md'];
  const { git, repoPath } = await initTaskRepo(
    TASK_NUMBER,
    hasFlag(CLI_FLAGS.FORCE),
    filesToPreserve
  );

  const ops = createGitOps(git, repoPath);

  console.log('📁 Creating initial project structure...\n');

  // === MAIN BRANCH SETUP (M1, M2) ===

  // M1: Initial project setup
  await ops.writeFile(
    '_sample/README.md',
    `# API Project

A modular API project.

## Getting Started

\`\`\`bash
npm install
npm start
\`\`\`
`
  );
  await ops.writeFile(
    '_sample/package.json',
    `{
  "name": "api-project",
  "version": "1.0.0",
  "description": "Modular API project",
  "main": "api.js"
}
`
  );
  await ops.addAll();
  await ops.commit('M1: Initial project setup');
  console.log('✓ M1: Initial project setup');

  // M2: Add utility functions
  await ops.writeFile(
    '_sample/utils.js',
    `/**
 * Utility Functions Module
 */

function formatDate(date) {
  return date.toISOString();
}

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

module.exports = { formatDate, generateId };
`
  );
  await ops.addAll();
  await ops.commit('M2: Add utility functions');
  console.log('✓ M2: Add utility functions');

  // Save reference to M2 for later
  const m2Hash = (await git.revparse(['HEAD'])).trim();

  // === FEATURE A BRANCH (A1, A2, A3) ===

  console.log('\n🌲 Creating featureA branch...\n');

  await ops.createBranch('featureA');

  // A1: Add API module
  await ops.writeFile(
    '_sample/api.js',
    `/**
 * API Module
 */

const { generateId } = require('./utils');

const resources = new Map();

function createResource(data) {
  const id = generateId();
  const resource = { id, ...data, createdAt: new Date() };
  resources.set(id, resource);
  return resource;
}

function getResource(id) {
  return resources.get(id) || null;
}

module.exports = { createResource, getResource };
`
  );
  await ops.addAll();
  await ops.commit('A1: Add API module');
  console.log('✓ A1: Add API module');

  // A2: Add API error handling
  await ops.writeFile(
    '_sample/errors.js',
    `/**
 * API Error Handling Module
 */

class ApiError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }
}

class NotFoundError extends ApiError {
  constructor(resource = 'Resource') {
    super(\`\${resource} not found\`, 404);
    this.name = 'NotFoundError';
  }
}

function handleError(error, res) {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal server error';
  return { error: true, statusCode, message };
}

module.exports = { ApiError, NotFoundError, handleError };
`
  );
  await ops.addAll();
  await ops.commit('A2: Add API error handling');
  console.log('✓ A2: Add API error handling');

  // Save reference to A2 for featureB branching
  const a2Hash = (await git.revparse(['HEAD'])).trim();

  // A3: Add API documentation
  await ops.writeFile(
    '_sample/API_DOCS.md',
    `# API Documentation

## Endpoints

### Create Resource
\`\`\`
POST /resources
Body: { "name": "string", "type": "string" }
\`\`\`

### Get Resource
\`\`\`
GET /resources/:id
\`\`\`

## Error Handling

All errors return: { "error": true, "statusCode": number, "message": string }
`
  );
  await ops.addAll();
  await ops.commit('A3: Add API documentation');
  console.log('✓ A3: Add API documentation');

  // === FEATURE B BRANCH (from A2, with B1, B2) ===

  console.log('\n🌲 Creating featureB branch from A2...\n');

  // Go back to A2 to branch featureB
  await git.checkout(a2Hash);
  await ops.createBranch('featureB');

  // B1: Add settings module
  await ops.writeFile(
    '_sample/settings.js',
    `/**
 * Settings Module
 */

const settings = {
  theme: 'light',
  language: 'en',
  notifications: true
};

function getSetting(key) {
  return settings[key];
}

function setSetting(key, value) {
  settings[key] = value;
  return settings;
}

function getAllSettings() {
  return { ...settings };
}

module.exports = { getSetting, setSetting, getAllSettings };
`
  );
  await ops.addAll();
  await ops.commit('B1: Add settings module');
  console.log('✓ B1: Add settings module');

  // B2: Add user preferences feature
  await ops.writeFile(
    '_sample/preferences.js',
    `/**
 * User Preferences Module
 */

const userPreferences = new Map();

function getPreferences(userId) {
  return userPreferences.get(userId) || getDefaultPreferences();
}

function setPreferences(userId, prefs) {
  const current = getPreferences(userId);
  const updated = { ...current, ...prefs };
  userPreferences.set(userId, updated);
  return updated;
}

function getDefaultPreferences() {
  return {
    emailNotifications: true,
    pushNotifications: false,
    theme: 'system'
  };
}

module.exports = { getPreferences, setPreferences, getDefaultPreferences };
`
  );
  await ops.addAll();
  await ops.commit('B2: Add user preferences feature');
  console.log('✓ B2: Add user preferences feature');

  // Save featureB position
  const featureBHash = (await git.revparse(['HEAD'])).trim();

  // === ADD MORE COMMITS TO MAIN (M3, M4) ===

  console.log('\n📝 Adding more commits to main...\n');

  await ops.switchBranch('main');

  // M3: Add configuration module
  await ops.writeFile(
    '_sample/config.js',
    `/**
 * Configuration Module
 */

const config = {
  api: {
    port: 3000,
    host: 'localhost'
  },
  logging: {
    level: 'info'
  }
};

function getConfig(key) {
  return config[key];
}

module.exports = { config, getConfig };
`
  );
  await ops.addAll();
  await ops.commit('M3: Add configuration module');
  console.log('✓ M3: Add configuration module');

  // M4: Add project documentation
  await ops.writeFile(
    '_sample/README.md',
    `# API Project

A modular API project demonstrating clean architecture.

## Features

- RESTful API endpoints
- Configuration management
- Utility functions

## Getting Started

\`\`\`bash
npm install
npm start
\`\`\`

## Configuration

See \`config.js\` for configuration options.
`
  );
  await ops.addAll();
  await ops.commit('M4: Add project documentation');
  console.log('✓ M4: Add project documentation');

  // === REBASE FEATURE A ONTO MAIN ===

  console.log('\n🔄 Rebasing featureA onto main...\n');

  await ops.switchBranch('featureA');
  await git.rebase(['main']);
  console.log('✓ featureA rebased onto main');

  // === RESTORE FEATURE B (still pointing to old A2!) ===

  console.log('\n⚠️  featureB is now orphaned (still based on old A2)...\n');

  // Checkout featureB at its original position
  await git.checkout(featureBHash);
  // Force update featureB branch to point here
  await git.branch(['-f', 'featureB', 'HEAD']);
  await git.checkout('featureB');

  // === FINAL STATE LOGGING ===

  console.log('\n📊 Final repository state:\n');

  // Show the graph
  const log = await git.raw([
    'log',
    '--oneline',
    '--graph',
    '--all',
    '--decorate'
  ]);
  console.log(log);

  console.log('\n✅ Task 6 setup complete!');
  console.log('\n📋 Current situation:');
  console.log('   - featureA has been rebased onto main (M3, M4)');
  console.log('   - featureB is still based on the OLD A2 commit');
  console.log('   - You need to use `git rebase --onto` to move featureB');
  console.log('     so it branches from the NEW featureA');
  console.log('\n📖 Open task6/Instructions.md for detailed guidance.\n');
}

setupTask6().catch((error) => {
  console.error('❌ Error setting up Task 6:', error);
  process.exit(1);
});
