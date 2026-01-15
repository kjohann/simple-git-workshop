# Git Workshop - Development Context

## Project Overview

TypeScript-based git workshop where participants run task setup scripts to practice git rebase operations locally. Each task creates its own isolated git repository for hands-on practice without requiring remote repositories.

## Architecture Decisions

### Functional Approach with Curried Operations

- **Pattern**: `createGitOps(git, repoPath)` returns object with bound operations
- **Why**: Minimal boilerplate, clean call sites, perfect for short-lived task scripts
- **Not using classes**: Each task script is a fresh process, no state persistence needed

### Atomic Operations

- Operations are small, composable functions (writeFile, addAll, commit)
- Task scripts compose these to build complex scenarios
- Provides maximum flexibility for different rebase scenarios

### Task Isolation

- Each task gets its own git repository in `task1/`, `task2/`, etc.
- Task directories are gitignored from the workshop repository
- Participants never modify the workshop repo itself

## Current Structure

```text
git-workshop/
├── src/
│   ├── index.ts           # Entry point, re-exports all public APIs
│   ├── operations.ts      # createGitOps() - factory for atomic operations
│   ├── init.ts            # initTaskRepo() - creates/manages task repos
│   ├── utils.ts           # hasFlag(), getTaskPath()
│   ├── constants.ts       # CLI_FLAGS and other constants
│   └── types.ts           # Exported TypeScript interfaces
├── tasks/
│   └── task1.ts          # Simple fast-forward rebase
├── docs/
│   └── WORKSHOP_CONTEXT.md # This file
├── package.json
├── tsconfig.json
├── .gitignore            # Excludes task*/, node_modules/, dist/
└── CLAUDE.md             # Development guide for Claude
```

## Available Operations

### Branch Operations

- `createBranch(name)` - Create and checkout new branch
- `switchBranch(name)` - Switch to existing branch
- `deleteBranch(name, force?)` - Delete branch
- `getCurrentBranch()` - Get current branch name
- `listBranches()` - List all branches

### File Operations

- `writeFile(path, content)` - Create or update file
- `readFile(path)` - Read file content
- `deleteFile(path)` - Delete file
- `fileExists(path)` - Check if file exists

### Staging & Commits

- `addFiles(files)` - Stage specific files
- `addAll()` - Stage all changes
- `commit(message)` - Create commit
- `amendCommit(message?)` - Amend last commit

### Rebase & Merge

- `rebase(branch)` - Rebase onto branch
- `rebaseContinue()` - Continue rebase after resolving conflicts
- `rebaseAbort()` - Abort rebase
- `merge(branch)` - Merge branch
- `mergeAbort()` - Abort merge

### Rerere

- `enableRerere()` - Enable rerere
- `disableRerere()` - Disable rerere
- `isRerereEnabled()` - Check rerere status
- `clearRerereCache()` - Clear rerere cache

### Repository Info

- `getStatus()` - Get git status
- `getLog(maxCount?)` - Get commit log
- `hasConflicts()` - Check for conflicts
- `getConflictedFiles()` - List conflicted files
- `reset(mode, ref?)` - Reset repository

## Completed Tasks

### Task 1: Simple Fast-Forward Rebase

**File**: `tasks/task1.ts`
**Scenario**: Feature branch with commits, main branch advances, participant rebases feature onto updated main
**Status**: ✅ Complete and tested

## Planned Tasks

### Task 2: Rebase with Conflicts (No Rerere)

- Create conflicting changes on main and feature branches
- Same file modified in both branches
- Participant resolves conflicts during rebase
- Multiple conflicts to practice resolution workflow

### Task 3: Rebase with Conflicts + Rerere

- Similar to Task 2 but with rerere enabled
- Demonstrate how rerere records conflict resolutions
- Reset and rebase again to show automatic resolution
- Compare with/without rerere workflow

### Task 4: Interactive Rebase

- Feature branch with messy commit history
- Participant uses interactive rebase to clean up:
  - Squash commits
  - Reorder commits
  - Edit commit messages
  - Drop unnecessary commits
- No main branch changes needed (just history cleanup)

### Task 5+: Additional Scenarios (TBD)

- Rebase with merge commits
- Rebase onto different base
- Handling rebase conflicts across multiple commits
- Cherry-picking during rebase

## Development Workflow

### Creating New Tasks

1. Create `tasks/taskN.ts`
2. Follow the standard pattern (see CLAUDE.md)
3. Add npm script to package.json: `"task:N": "ts-node tasks/taskN.ts"`
4. Test with `npm run task:N`
5. Test force flag: `npm run task:N -- --force`
6. Update this context file with task details

### Testing Tasks

- Run setup script: `npm run task:N`
- Navigate to task directory: `cd taskN`
- Verify git state: `git log --oneline --graph --all`
- Follow participant instructions to test the scenario
- Use `--force` flag to reset and test again

## Key Implementation Details

### Repository Initialization

- `initTaskRepo()` checks if directory exists
- If exists and no `--force`: throws error with helpful message
- If exists and `--force`: wipes directory completely
- Always creates fresh git repo with main branch
- Sets default git user (Rebase Wizard 🧙)

### Force Flag Behavior

- Parsed from `process.argv` via `hasFlag(CLI_FLAGS.FORCE)`
- When true: deletes entire task directory and recreates
- Warning shown about data loss
- Ensures idempotent task setup

### Logging Philosophy

- Operations log success with ✓ prefix
- Setup phases use emoji (🚀, 📁, 🎯)
- Final state shown with 📊
- Participant instructions with 📚
- Makes script output easy to follow

## Dependencies

- `simple-git` - Git operations wrapper
- `typescript` - TypeScript compiler
- `ts-node` - Direct TypeScript execution
- `@types/node` - Node.js type definitions

## Git Configuration

Every task repo is initialized with:

- `user.name`: "Rebase Wizard 🧙"
- `user.email`: "<merge-conflicts-begone@git-workshop.dev>"
- Default branch: `main`

## Notes

- Task repositories are excluded from version control via .gitignore
- Each task script is a standalone executable
- No build step required (ts-node executes directly)
- Workshop repo itself should remain clean (only task scripts, no generated repos)
