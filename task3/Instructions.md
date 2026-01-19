# Task 3: Merge Conflicts and Rerere

This task introduces you to handling merge conflicts during rebasing and teaches you about Git's rerere (reuse recorded resolution) feature that can automatically resolve conflicts you've already seen before.

```text
ℹ️ Remember to initialize the task before proceeding by running npm run task:3 from the workshop root
```

## Overview

This repository has been set up with the following structure:

- **main branch**: Has 4 commits with changes to README and tasks.js
- **feature/enhance-tasks branch**: Was created early and has 2 commits that conflict with main

The feature branch modifies the same lines in both commits, creating a total of 4 conflicts (2 per commit) when rebasing.

## What is Rerere?

**Rerere** stands for "reuse recorded resolution". It's a Git feature that:

1. **Remembers** how you resolved a merge conflict
2. **Automatically resolves** the same conflict if it appears again
3. **Saves time** when dealing with repeated conflicts during rebasing or merging

### When is Rerere Useful?

- **Abandoned rebases** - When you abort a rebase and try again
- **Long-running feature branches** that need frequent rebasing
- **Working with multiple branches** that have similar conflicts
- **Iterative conflict resolution** where you refine your approach

### Some words of causion

Since rerere records how you resolve a file, it will also record your mistakes. Meaning that if you end up abandoning a merge or rebase because you messed up a conflict resolution, the same resolution will be reused when you try again.

To avoid this you can use `git rerere forget <path>` to clear the rerere cache of the resolutions for that particular file. You can also run `git rerere clear` to forget everything (or simply delete the `.git/rr-cache`) folder.

With rerere enabled, git will remember the conflict resolutions based on file contents alone. This means that if the same conflict occurs across different branches, it will reuse that resolution. This may not always be the right choice.

**:scream: This sounds really scary - why would any one use this?**

I sort of agree, but I've used this setting for 11 years and can count on my fingers how many times I've said "something strange happened during a rebase" (after I learned rebasing properly of course). The key thing to note is that whenever a recorded resoluton is used, the rebase or merge process will still stop just as if there were conflicts. But the file will show as "no merges needed". This is a hint to you to verify that the current state of that file is actually correct (remember that you can always run your project after all conflicts have been resolved, before progressing with the merge/rebase).

## Step-by-Step Exercise

### Step 1: View the Repository State

First, let's see what we're working with:

```bash
# List all branches
git branch -v

# View the commit graph
git log --oneline --graph --all

# Or with your alias:
git lg --all
```

You should see divergent branches:

```text
* a1b2c3d (feature/enhance-tasks) Enhance descriptions and priority
* b2c3d4e Update branding and default status
| * c3d4e5f (HEAD -> main) Update descriptions and set priority to LOW
| * d4e5f6g Rebrand to Task Tracker and update status
|/
* e5f6g7h Add task creation function
* f6g7h8i Initial commit
```

### Step 2: Examine the Files

Look at what was changed on both branches:

```bash
# Make sure you're on feature branch
git checkout feature/enhance-tasks

# View the files on current branch
cat _sample/README.md
cat _sample/tasks.js

# View the files on main
git show main:_sample/README.md
git show main:_sample/tasks.js
```

Notice both branches changed:

- **README title**: "Task Manager Pro" vs "Task Tracker"
- **README description**: "powerful" vs "comprehensive"
- **Status value**: "PENDING" vs "OPEN"
- **Priority value**: "HIGH" vs "LOW"

All on the same lines = conflicts!

### Step 3: First Rebase Attempt

```bash
# Make sure you're on feature/enhance-tasks
git checkout feature/enhance-tasks

# Start the rebase
git rebase main
```

Git will stop at the first conflicting commit:

```text
Auto-merging _sample/README.md
CONFLICT (content): Merge conflict in _sample/README.md
Auto-merging _sample/tasks.js
CONFLICT (content): Merge conflict in _sample/tasks.js
```

### Step 4: Resolve the First Two Conflicts

:warning: It is highly recommended that you use an editor you're comfortable with for resolving conflicts. If you use VSCode or similar, you don't need to type `git mergetool` - just open the task folder in the editor, and you should see the repo files, conflicts and all in the Source Control pane.

```bash
# See which files have conflicts
git status

# Look at the conflicts
cat _sample/README.md
cat _sample/tasks.js
```

You'll see conflict markers. **Resolve both files** so that they look like this:

**_sample/README.md** - Choose "Task Manager Pro":

```markdown
# Task Manager Pro

A simple task management application.

## Features
- Create tasks
- Track status
```

**_sample/tasks.js** - Choose "PENDING":

```javascript
function createTask(title, description) {
  return {
    id: Date.now(),
    title,
    description,
    status: "PENDING",
    priority: "NORMAL",
  };
}

module.exports = { createTask };
```

Stage and continue:

```bash
git add .
git rebase --continue
```

### Step 5: Abort Before Resolving the Second Commit

Git will now stop at the second conflicting commit. **But instead of resolving it, abort!** Just pretend that you have gotten quite far into a larger rebase and that something's gone wrong on the current step that you can't get out of without aborting the rebase and starting over.

```bash
# Check status - you'll see the second set of conflicts
git status

# Abort the rebase
git rebase --abort
```

You're back to where you started! Your first resolutions are **lost**.

### Step 6: Rebase Again (Manual Frustration)

Now try rebasing again:

```bash
git rebase main
```

**The exact same conflicts appear!** You have to resolve them again:

1. Edit `_sample/README.md` - choose "Task Manager Pro" again
2. Edit `_sample/tasks.js` - choose "PENDING" again
3. Stage: `git add .`
4. Continue: `git rebase --continue`
5. Abort again: `git rebase --abort`

:warning: **This is frustrating!** Re-resolving the same conflicts is tedious and error-prone.

### Step 7: Enable Rerere and Try Again

Now enable rerere and see the magic:

```bash
# Enable rerere
git config rerere.enabled true

# Verify it's enabled
git config rerere.enabled
```

Start the rebase again:

```bash
git rebase main
```

You'll see:

```text
CONFLICT (content): Merge conflict in _sample/README.md
Recorded preimage for '_sample/README.md'
CONFLICT (content): Merge conflict in _sample/tasks.js
Recorded preimage for '_sample/tasks.js'
```

**"Recorded preimage"** means rerere is watching and recording!

Resolve the conflicts the same way:

```bash
# Edit both files (Task Manager Pro, PENDING)
git add .
git rebase --continue
```

And abort one final time:

```bash
git rebase --abort
```

### Step 8: Rebase One More Time (Watch the Magic!)

Now try again:

```bash
git rebase main
```

**Watch the magic!**

```text
CONFLICT (content): Merge conflict in _sample/README.md
Resolved '_sample/README.md' using previous resolution.
CONFLICT (content): Merge conflict in _sample/tasks.js
Resolved '_sample/tasks.js' using previous resolution.
```

Check the files:

```bash
cat _sample/README.md
cat _sample/tasks.js
```

**The conflicts are already resolved!** Rerere applied your previous resolutions automatically.

You still need to verify and stage:

```bash
git add .
git rebase --continue
```

For the purpose of this exercise you can choose wheter or not to complete the rebase by resolving the final conflicts.

## What Just Happened?

### Without Rerere

1. Resolved conflicts → aborted → **lost all work**
2. Rebased again → **manually resolved same conflicts** again
3. Tedious and error-prone

### With Rerere

1. **First rebase**: Rerere recorded your resolutions
2. **Aborted and rebased again**: Rerere automatically applied resolutions
3. You only needed to **verify and stage** - no manual editing!

### How Rerere Works Internally

- **Stores conflict patterns** in `.git/rr-cache/`
- **Matches current conflicts** against recorded patterns
- **Applies recorded resolutions** when patterns match
- **Requires verification** - you still need to stage (safety check)

## Key Takeaways

✅ **Merge conflicts happen** when the same lines change on different branches

✅ **git rebase --abort** lets you bail out and start over (but you lose your work)

✅ **Rerere remembers conflict resolutions** and reapplies them automatically

✅ **Enable rerere for iterative rebasing** - perfect when refining your approach

✅ **Rerere still requires staging** - it's a helper, not full auto-pilot

✅ **Rerere is especially useful** when you need to abort/retry rebases

## Common Commands Reference

```bash
# Enable/disable rerere
git config rerere.enabled true
git config rerere.enabled false

# Check rerere status
git config rerere.enabled

# Work with the rerere cache
git rerere forget <path>
git rerere clear

# During a rebase
git status                    # See which files have conflicts
git rebase --continue         # Continue after resolving conflicts
git rebase --abort            # Abort the rebase (go back to start)

# View differences
git diff                      # See unstaged changes (including conflict markers)
git show main:path/to/file    # See file content from another branch
```
