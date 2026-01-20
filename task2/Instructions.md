# Task 2: Simple Fast-Forward Rebase

This task will ease you into the world of rebasing by simply introducing you to what it is and how it works in it's simplest form.

```text
ℹ️ Remember to initialize the task before proceeding by running npm run task:2 from the workshop root
```

## Overview

This repository in this folder should be set up with the following structure:

- **main branch**: Has evolved with 5 commits (config, README updates, utils module)
- **feature/add-calculator branch**: Was created early and has 2 commits (calculator implementation and tests)

The feature branch needs to be updated with the latest changes from main.

## What is Rebasing?

Rebasing is the process of moving or "replaying" your branch's commits onto a different base commit. Think of it as:

1. **Taking your commits** (the ones unique to your branch)
2. **Temporarily setting them aside**
3. **Updating your branch** to point to the new base (main's latest commit)
4. **Reapplying your commits** on top of that new base

:warning: Rebase rewrites history. Only rebase commits that haven't been shared with others! :warning:

### Rebase vs Merge

- **Merge**: Creates a merge commit that ties two branches together, preserving the original branch history
- **Rebase**: Rewrites history to make it appear as if your work was done on top of the latest main

Both have their uses, but rebase creates a cleaner, linear history.

## Step-by-Step Exercise

### Step 1: View repo state

First, let's visualize the current state of the repository:

```bash
# List all branches
git branch -v

# View the commit graph
git log --oneline --graph --all

# Or if you set up the alias from Task 1:
git lg --all
```

You should see something like this (hashes will be different):

```text
* 43b8429 (HEAD -> main) Update config to version 1.1.0
* f978989 Add utils module
* 02798f1 Update README with features section
| * 7eac275 (feature/add-calculator) Add tests for calculator
| * e4fc448 Add calculator with add function
|/
* 4f037c0 Add config file
* 8d54af2 Initial commit
```

**Note**: The graph might show the branches in opposite positions (feature on the left, main on the right) depending on commit timing during setup. The important thing is seeing the divergence at the "Add config file" commit.

Notice how the feature branch diverged from main at an earlier commit.

### Step 2: Explore the Current State

```bash
# Make sure you're on main
git checkout main

# View what files exist on main
ls _sample

# Check out the feature branch
git checkout feature/add-calculator

# View what files exist on the feature branch
ls _sample

# Notice that the feature branch is missing files from recent main commits
```

### Step 3: Perform the Rebase

Now, let's rebase the feature branch onto main:

```bash
# Make sure you're on the feature branch
git checkout feature/add-calculator

# Rebase onto main
git rebase main
```

You should see output like:

```text
Successfully rebased and updated refs/heads/feature/add-calculator.
```

### Step 4: Examine the Result

```bash
# View the new commit graph
git log --oneline --graph --all
```

Now the graph should look linear:

```text
* 9d8e7f6 (HEAD -> feature/add-calculator) Add tests for calculator
* 8c7d6e5 Add calculator with add function
* 7a8b9c0 (main) Update config to version 1.1.0
* 6d7e8f9 Add utils module
* 5c6d7e8 Update README with features section
* 2a3b4c5 Add config file
* 1a2b3c4 Initial commit
```

Notice:

- ✅ Your feature commits are now on top of main's latest commit
- ✅ The commit hashes for your feature commits have changed (they're new commits!)
- ✅ The history is completely linear
- ✅ All files from main are now present in your branch

### Step 5: Verify the Files

```bash
# You should now have all files from main AND your feature files
ls _sample

# Check that you have:
# - README.md (from main)
# - config.json (from main)
# - utils.js (from main)
# - calculator.js (from your feature)
# - calculator.test.js (from your feature)
```

## What Just Happened?

1. **Git identified your unique commits**: The two calculator commits
2. **Git temporarily removed them**: Set them aside
3. **Git updated your branch**: Moved the branch pointer to main's HEAD
4. **Git replayed your commits**: Applied them one by one on top of main
5. **New commit hashes**: Since the base changed, your commits got new hashes

## Why is This Called "Fast-Forward"?

This particular rebase is considered a fast-forward scenario because:

- No conflicts occurred
- The commits could be cleanly applied
- Main could now be fast-forwarded to include your changes (just move the pointer)

## Next Steps: Simulating a Merge

Now that your feature branch is rebased, merging into main would be trivial:

```bash
# Switch to main
git checkout main

# Merge the feature branch
git merge feature/add-calculator

# View the history
git log --oneline --graph --all
```

This should be a fast-forward merge (no merge commit needed) because your feature is directly ahead of main!

## Key Takeaways

- ✅ **Rebase replays your commits** on top of a new base
- ✅ **Commit hashes change** during rebase (new commits are created)
- ✅ **Fast-forward rebases are clean** - no conflicts, linear history
- ✅ **Use rebase before merging** to create clean history
- ✅ **Never rebase commits you've already pushed** (unless working alone)

## Common Commands Reference

```bash
# Start a rebase
git rebase <branch>

# View rebase status
git status

# If something goes wrong, abort
git rebase --abort

# View graph
git log --oneline --graph --all
```
