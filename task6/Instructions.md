# Task 6: Rebase --onto - Surgical Branch Transplanting

Learn how to use `git rebase --onto` to move commits from one base to another, a powerful technique for reorganizing branch history.

```text
ℹ️ Remember to initialize the task before proceeding by running npm run task:6 from the workshop root
```

## Overview

This task repository demonstrates a common scenario:

- `main` branch with project setup
- `featureA` branch that was created from main with 3 commits
- `featureB` branch that was created from featureA's **second** commit with 2 commits

**The scenario**: After featureB was created, featureA was rebased onto new commits in main. Now featureB is based on commits that no longer exist in featureA's history!

### Initial Repository State (Before featureA Rebase)

```text
          B1---B2  featureB (branched from A2)
         /
    A1---A2---A3  featureA
   /
M1---M2  main
```

### Current Repository State (After featureA Rebase)

FeatureA has been rebased onto main's new commits (M3, M4):

```text
          B1---B2  featureB (still pointing to OLD A2!)
         /
    A1---A2---A3  (orphaned - old featureA commits)
   /
M1---M2---M3---M4  main
              \
               A1'---A2'---A3'  featureA (rebased)
```

**The problem**: featureB is still based on the **old** A2 commit, which is no longer part of any branch. If you try to rebase featureB normally, you'll include the old A1 and A2 commits!

**Your goal**: Use `git rebase --onto` to transplant featureB's commits (B1, B2) so they're based on the **new** A3' commit of the rebased featureA.

### Desired Final State

```text
M1---M2---M3---M4  main
              \
               A1'---A2'---A3'  featureA
                           \
                            B1'---B2'  featureB
```

## What is `git rebase --onto`?

Standard `git rebase <branch>` replays all your commits on top of another branch. But what if you only want to move **some** commits? Or move commits to a completely different base than where they branched from?

`git rebase --onto` gives you surgical precision:

```bash
git rebase --onto <new-base> <old-base> <branch>
```

This command means: "Take the commits in `<branch>` that come **after** `<old-base>`, and replay them onto `<new-base>`."

### Breaking Down the Parameters

| Parameter | Description |
|-----------|-------------|
| `<new-base>` | Where you want the commits to end up (the new parent) |
| `<old-base>` | The commit **after which** you want to take commits (exclusive) |
| `<branch>` | The branch containing the commits you want to move |

### Visual Example

```text
Before:
      X---Y---Z  topic (we want to move Y and Z)
     /
A---B---C  main

Command: git rebase --onto C X topic

After:
          Y'---Z'  topic
         /
A---B---C  main
```

The command says: "Take commits after X (which is Y and Z), and put them onto C."

## Why Use --onto?

Common scenarios where `--onto` is essential:

1. **Branch was based on a feature branch that got rebased** (our scenario!)
2. **Remove a range of commits from the middle of a branch**
3. **Move a feature to a different parent branch**
4. **Split a branch - take only some commits**

## Step-by-Step Exercise

### Step 1: Understand the Current State

Let's visualize what we're working with:

```bash
# See all branches and their relationships
git log --oneline --graph --all
```

You should see something like:

```text
* abc1234 (featureB) B2: Add user preferences feature
* def5678 B1: Add settings module
* 111aaaa A2: Add API error handling
* 222bbbb A1: Add API module
| * 333cccc (featureA) A3: Add API documentation
| * 444dddd A2: Add API error handling
| * 555eeee A1: Add API module
|/
* 666ffff (main) M4: Add project documentation
* 777gggg M3: Add configuration module
* 888hhhh M2: Add utility functions
* 999iiii M1: Initial project setup
```

Notice how featureB's parent commits (111aaaa, 222bbbb) are **different** from featureA's commits (444dddd, 555eeee) even though they have the same messages. These are the orphaned commits!

### Step 2: Find the Old Base

The old base is the commit that featureB was originally branched from. Looking at the output from Step 1, we can see featureB's history includes orphaned commits (111aaaa, 222bbbb) that are no longer part of featureA.

We need to find where to "cut" - that's the old A2 commit in featureB's history:

```bash
# List featureB's commits to find the old A2
git log --oneline featureB
# B2: abc1234 (featureB)
# B1: def5678
# A2 (old): 111aaaa  <- This is your <old-base>
# A1 (old): 222bbbb

# Note the commit hash for "A2: Add API error handling" in featureB's history
# This is the commit AFTER which we want to take commits (B1 and B2)
```

### Step 3: Perform the Rebase --onto

Now we have everything we need:

- `<new-base>`: featureA (the rebased branch tip)
- `<old-base>`: The old A2 commit hash from featureB's history
- `<branch>`: featureB

```bash
# First, make sure you're on featureB
git checkout featureB

# Perform the surgical rebase
# Replace OLD_A2_HASH with the actual commit hash from Step 3
git rebase --onto featureA OLD_A2_HASH featureB
```

:warning: **Important**: Replace `OLD_A2_HASH` with the actual commit hash you identified in Step 2!

### Step 4: Verify the Result

Check that featureB is now based on the rebased featureA:

```bash
git log --oneline --graph --all
```

You should now see:

```text
* abc1234 (featureB) B2: Add user preferences feature
* def5678 B1: Add settings module
* 333cccc (featureA) A3: Add API documentation
* 444dddd A2: Add API error handling
* 555eeee A1: Add API module
* 666ffff (main) M4: Add project documentation
* 777gggg M3: Add configuration module
* 888hhhh M2: Add utility functions
* 999iiii M1: Initial project setup
```

Now featureB's commits (B1, B2) are directly on top of featureA's latest commit (A3')!

### Step 5: Verify the Code

Make sure the files are correct:

```bash
# Check that featureB has all the expected files
ls _sample/

# You should see:
# - Files from main (M1-M4)
# - Files from featureA (A1-A3)
# - Files from featureB (B1-B2)
```

## What Just Happened?

Let's trace through what `git rebase --onto` did:

1. **Identified the commits to move**: Everything in featureB after OLD_A2_HASH
   - That's B1 and B2 (not A1 or A2!)

2. **Found the new base**: featureA (which points to A3')

3. **Replayed the commits**: Applied B1, then B2, on top of featureA

4. **Updated the branch pointer**: featureB now points to the new B2'

The orphaned commits (old A1, A2, and the old B1, B2) will eventually be garbage collected.

## Alternative: Using HEAD~n Syntax

If you know exactly how many commits to move, you can use relative references:

```bash
# "Take the last 2 commits of featureB and put them on featureA"
git rebase --onto featureA HEAD~2 featureB
```

This is often simpler when you know the commit count but don't want to look up hashes.

## Common --onto Patterns

### Pattern 1: Move Branch to Different Parent

```bash
# Move feature from develop to main
git rebase --onto main develop feature
```

### Pattern 2: Remove Commits from Middle

```bash
# Remove commits B and C, keeping A and D
# Before: A---B---C---D
git rebase --onto A C D
# After: A---D'
```

### Pattern 3: Extract Recent Commits

```bash
# Take only the last 3 commits and put them on main
git rebase --onto main HEAD~3 feature
```

## Recovery: If Something Goes Wrong

During the rebase:

```bash
# Abort and restore original state
git rebase --abort
```

After the rebase (if you need to undo):

```bash
# Find the old branch position
git reflog

# Reset to the old position
git reset --hard featureB@{1}
```

## Key Takeaways

✅ **`--onto` gives surgical precision** - move exactly the commits you want

✅ **Three parameters**: new-base (destination), old-base (cut point), branch (source)

✅ **Old-base is exclusive** - commits AFTER it are moved, not including it

✅ **Essential for rebased parent branches** - when your base branch was rebased

✅ **Works with branch names or commit hashes** - use what's clearest

✅ **HEAD~n is your friend** - when you know the commit count

## Common Commands Reference

```bash
# Rebase --onto syntax
git rebase --onto <new-base> <old-base> <branch>

# Common variations
git rebase --onto main develop feature     # Move feature from develop to main
git rebase --onto main HEAD~3 feature      # Move last 3 commits to main
git rebase --onto A C D                    # Remove commits between A and C

# Useful for identifying commits
git log --oneline --graph --all            # Visualize all branches
git rev-parse <branch>                     # Get commit hash for branch
git merge-base branch1 branch2             # Find common ancestor

# During rebase
git rebase --continue                      # Continue after resolving conflicts
git rebase --abort                         # Cancel and restore original state
git rebase --skip                          # Skip current commit

# Recovery
git reflog                                 # See history including rebases
git reset --hard <branch>@{n}              # Undo rebase
```
