# Git Workshop Development Guide

## Code Style

- Pure functional TypeScript with curried operations
- Atomic operations over high-level abstractions
- Use the pattern: `createGitOps(git, repoPath)` returns bound operations
- Export all types from operations modules
- index.ts should be the single file tasks import their functions from (so from src)
- Use 2-space indentation
- Prefer explicit types over inference for public APIs
- When editing markdown files:
  - Always have a space after headings
  - Always have space around lists
  - Always specifiy a language for code blocks - use text if the content isn't actual code (ex: file structure)

## Task Script Pattern

Every task script follows this structure:

1. Import from `../src` (index.ts is implicit entry point)
2. Parse force flag with `hasFlag(CLI_FLAGS.FORCE)`
3. Initialize repo with `initTaskRepo(taskNumber, force)`
4. Create operations object with `createGitOps(git, repoPath)`
5. Compose atomic operations to build scenario
6. Log final state (branches, commits, status)
7. Print participant instructions

Example:

```typescript
import { initTaskRepo, createGitOps, hasFlag, CLI_FLAGS } from '../src';

const force = hasFlag(CLI_FLAGS.FORCE);
const { git, repoPath } = await initTaskRepo(1, force);
const ops = createGitOps(git, repoPath);
```

## Operation Composition

- Keep operations atomic (writeFile, addAll, commit are separate)
- Compose operations in task scripts rather than creating combined helpers
- This gives maximum flexibility for different scenarios

## Logging Style

- Use emoji prefixes for visual clarity:
  - 🚀 Starting/setup
  - ✅ Success/completion
  - ❌ Errors
  - 📊 Repository state
  - 📚 Instructions
  - ✓ Individual operation success
  - 🗑️ Cleanup/deletion
  - 📁 Directory creation
  - 🎯 Git initialization
  - ⚠️ Warnings/expected conflicts
- Log each operation completion for transparency
- End task scripts with clear numbered participant instructions

## Git Configuration

- Default user.name: "Rebase Wizard 🧙"
- Default user.email: "<merge-conflicts-begone@git-workshop.dev>"
- Default branch: main
- Repositories live in root-level task*/ directories

## Error Handling

- Task scripts should catch errors and display user-friendly messages
- When directory exists and force=false, show clear rerun instructions
- Include --force flag warning about data loss

## File Organization

- Core operations: `src/`
  - `index.ts` - Entry point, re-exports all public APIs
  - `operations.ts` - createGitOps() factory and all git operations
  - `init.ts` - initTaskRepo() for repository initialization
  - `utils.ts` - hasFlag(), getTaskPath() utilities
  - `constants.ts` - CLI_FLAGS and other constants
  - `types.ts` - TypeScript interfaces and types
- Task scripts: `tasks/` (root level, not in src/)
- Task repositories: `task*/` (gitignored, created by scripts)
- Documentation: `docs/`

## npm Scripts

- `task:N` pattern for running tasks: `npm run task:1`
- Support --force flag: `npm run task:1 -- --force`

## Workshop Philosophy

- Each task creates an isolated git repository
- Participants never push/pull (local only)
- Focus on rebase scenarios with realistic branch divergence
- Setup scripts should be idempotent with --force flag
