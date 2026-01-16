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
  - Always have space around code blocks as well (before and after the entire block)

## Task Script Pattern

Every task script follows this structure:

1. Import from `../../` (index.ts is implicit entry point)
2. Parse force flag with `hasFlag(CLI_FLAGS.FORCE)`
3. Initialize repo with `initTaskRepo(taskNumber, force)`
4. Create operations object with `createGitOps(git, repoPath)`
5. Compose atomic operations to build scenario
6. Log final state (branches, commits, status)
7. Print completion message directing to Instructions.md

Example:

```typescript
import { initTaskRepo, createGitOps, hasFlag, CLI_FLAGS } from '../../';

const force = hasFlag(CLI_FLAGS.FORCE);
const { git, repoPath } = await initTaskRepo(1, force);
const ops = createGitOps(git, repoPath);

// ... build scenario with atomic operations ...

console.log('\n✅ Task 1 setup complete!\n');
console.log('📖 Next steps:');
console.log('   cd task1');
console.log('   cat Instructions.md  # (or open in your editor)\n');
```

## Instructions.md Files

- **Static files**: Create as `taskN/Instructions.md` and commit to repository
- **Not generated**: Task scripts do NOT create or modify Instructions.md
- **Content structure**:
  - Overview
  - Maybe some intro to the concept
  - Step-by-step exercises with code examples
  - Key takeaways and command reference
  - Use tasks2/Instructions.md as inspiration
- **Format**: Use clear markdown with code blocks, headings, and progressive difficulty
- **Purpose**: Separate setup automation (TypeScript) from learning content (Markdown)

## Operation Composition

- Keep operations atomic (writeFile, addAll, commit are separate)
- Compose operations in task scripts rather than creating combined helpers
- This gives maximum flexibility for different scenarios
- **Important**: Place all generated sample files in `_sample/` directory to keep task repository root clean
- The `writeFile` operation automatically creates parent directories as needed

## Logging Style

- Use emoji prefixes for visual clarity:
  - 🚀 Starting/setup
  - ✅ Success/completion
  - ❌ Errors
  - 📊 Repository state
  - 📖 Directing to Instructions.md
  - ✓ Individual operation success
  - 🗑️ Cleanup/deletion
  - 📁 Directory creation
  - 🌲 Git initialization
  - ⚠️ Warnings/expected conflicts
- Log each operation completion for transparency
- End task scripts with brief completion message and Instructions.md reference
- Do NOT print step-by-step participant instructions in terminal output

## Git Configuration

- Default user.name: "Rebase Wizard 🧙"
- Default user.email: rebase.the.blue@middleearth.com
.dev>"
- Default branch: main
- Repositories live in root-level task*/ directories
- All sample files are placed in `_sample/` subdirectory

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
  - `tasks/` - Task setup scripts
    - `taskN/index.ts` - Individual task setup scripts
- Task repositories: `task*/` (gitignored, generated directories)
  - Each contains `.git/` directory
  - Each contains `Instructions.md` (static file, committed to repo)
- Documentation:
  - `README.md` - Participant-facing entry point
  - `docs/WORKSHOP_CONTEXT.md` - Architecture and development context
  - `CLAUDE.md` - Development patterns and conventions

## npm Scripts

- `task:N` pattern for running tasks: `npm run task:1`
- Support --force flag: `npm run task:1 -- --force`

## Workshop Philosophy

- Each task creates an isolated git repository
- Participants never push/pull (local only)
- Focus on rebase scenarios with realistic branch divergence
- Setup scripts should be idempotent with --force flag
