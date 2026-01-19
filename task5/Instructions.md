# Task 5: Interactive Rebase - Reordering and Removing Commits

Learn how to clean up commit history by reordering commits and removing unwanted ones using interactive rebase.

```text
ℹ️ Remember to initialize the task before proceeding by running npm run task:5 from the workshop root
```

## Overview

This task repository contains:

- `main` branch with 1 commit (initial project setup)
- `feature/user-crud` branch with 6 commits implementing user CRUD operations

The feature branch has some problems with its commit history:

```text
1. Implement user creation logic     ← Core feature
2. Implement user edit logic         ← Core feature
3. Fixed unrelated bug               ← Out of place! Should be at the end
4. Implement user deletion logic     ← Core feature
5. Trying out something              ← Junk! Should be removed
6. Fixup: tests for user creation    ← Should be combined with commit 1
```

**Your goal**: Clean up the history to:

1. **Drop** commit 5 completely (experimental code that shouldn't be committed)
2. **Move** commit 6 right after commit 1 and apply it as a **fixup**
3. **Move** commit 3 to be the **last** commit (keeping user-related commits together)

**Final desired history**:

```text
1. Implement user creation logic     ← Now includes the tests
2. Implement user edit logic
3. Implement user deletion logic
4. Fixed unrelated bug               ← Moved to end
```

## Why Reorder and Remove Commits?

### Removing Commits (drop)

Sometimes commits slip into your branch that shouldn't be there:

- Experimental code you forgot to remove
- Debug statements or temporary files
- Work-in-progress commits that are now obsolete
- Commits that duplicate work done elsewhere

Using `drop` lets you remove these cleanly, as if they never happened. OR you can just delete the line from the rebase script.

### Reordering Commits

A logical commit order makes your PR easier to review:

- Related changes should be grouped together
- Bug fixes unrelated to the main feature can be moved to the end
- Setup/foundation commits should come before commits that build on them

Reordering is done simply by changing the line order in the interactive rebase editor.

## Step-by-Step Exercise

### Step 1: Inspect the Current History

First, let's see what we're working with:

```bash
# Make sure you're on the feature branch
git checkout feature/user-crud

# View the commit history
git log --oneline
```

You should see something like:

```text
f6g7h8i (HEAD -> feature/user-crud) Fixup: tests for user creation logic
e5f6g7h Trying out something
d4e5f6g Implement user deletion logic
c3d4e5f Fixed unrelated bug
b2c3d4e Implement user edit logic
a1b2c3d Implement user creation logic
y9z0a1b (main) Initial project setup
```

### Step 2: Plan Your Changes

Before starting the rebase, let's plan what we need to do:

| Original Position | Commit Message | Action |
|------------------|----------------|--------|
| 1 | Implement user creation logic | Keep (will receive fixup) |
| 2 | Implement user edit logic | Keep |
| 3 | Fixed unrelated bug | **Move to position 4** |
| 4 | Implement user deletion logic | Keep (becomes position 3) |
| 5 | Trying out something | **Drop** |
| 6 | Fixup: tests for user creation | **Move after 1, make fixup** |

### Step 3: Start the Interactive Rebase

Start an interactive rebase for all 6 commits since main:

```bash
git rebase -i main
```

Your editor will open with:

```text
pick a1b2c3d Implement user creation logic
pick b2c3d4e Implement user edit logic
pick c3d4e5f Fixed unrelated bug
pick d4e5f6g Implement user deletion logic
pick e5f6g7h Trying out something
pick f6g7h8i Fixup: tests for user creation logic
```

### Step 4: Apply All Changes at Once

Now we'll make all three changes in a single rebase. Edit the file to look like this:

```text
pick a1b2c3d Implement user creation logic
fixup f6g7h8i Fixup: tests for user creation logic
pick b2c3d4e Implement user edit logic
pick d4e5f6g Implement user deletion logic
pick c3d4e5f Fixed unrelated bug
```

**What we changed:**

1. **Moved line 6** (fixup commit) to right after line 1, and changed `pick` to `fixup`
2. **Deleted line 5** (trying out something) - this drops that commit entirely
3. **Moved line 3** (Fixed unrelated bug) to be the last line
4. **Line 4** (deletion logic) moved up to fill the gap

**Important notes:**

- The order of lines in this file determines the order commits will be applied
- `fixup` must come immediately after the commit it's fixing up
- To drop a commit, simply delete its line (or change `pick` to `drop`)

Save and close the editor.

### Step 5: Verify the Result

Git will reapply the commits in your new order. Check the result:

```bash
git log --oneline
```

You should now see:

```text
d4e5f6g (HEAD -> feature/user-crud) Fixed unrelated bug
c3d4e5f Implement user deletion logic
b2c3d4e Implement user edit logic
a1b2c3d Implement user creation logic
y9z0a1b (main) Initial project setup
```

Notice:

- Only **4 commits** remain (down from 6)
- "Trying out something" is **gone**
- "Fixup: tests for user creation logic" was **absorbed** into the first commit
- "Fixed unrelated bug" is now at the **end**
- User CRUD commits are now **in logical order**

### Step 6: Verify the Fixup Worked

Let's make sure the test file is included in the first commit:

```bash
# Show the contents of the "Implement user creation logic" commit
git show HEAD~3 --stat
```

You should see that `_sample/tests.js` is now part of the user creation commit!

You can also verify the experimental file is gone:

```bash
# This should fail - the file was removed with its commit
ls _sample/experimental.js
```

## Understanding Drop vs Delete

There are two ways to remove a commit in interactive rebase:

### Using `drop`

Change `pick` to `drop`:

```text
pick a1b2c3d First commit
drop b2c3d4e Unwanted commit
pick c3d4e5f Third commit
```

### Deleting the Line

Simply remove the line entirely:

```text
pick a1b2c3d First commit
pick c3d4e5f Third commit
```

Both achieve the same result. Using `drop` is more explicit and can serve as documentation if you're sharing the rebase plan with others.

## Dealing with Conflicts When Reordering

When you reorder commits, you might encounter conflicts if:

- A later commit depends on changes from an earlier one
- Moving a commit changes what it's being applied on top of

If this happens:

1. Resolve the conflicts as usual
2. Stage the resolved files: `git add .`
3. Continue the rebase: `git rebase --continue`

In our exercise, the commits were designed to be independent enough to reorder without conflicts.

## Advanced: Combining Multiple Operations

You can combine all interactive rebase operations in a single session:

```text
pick a1b2c3d First feature
fixup d4e5f6g Fix for first feature
reword b2c3d4e Second feature (needs better message)
squash e5f6g7h Related to second feature
drop f6g7h8i Experimental junk
pick c3d4e5f Independent bug fix
```

This single rebase will:

1. Keep first feature and absorb its fixup
2. Edit the message for second feature
3. Combine related commits with squash
4. Remove the experimental commit
5. Keep the bug fix

## Recovery: If Something Goes Wrong

If you make a mistake during rebase:

```bash
# Abort and start over
git rebase --abort
```

If you already completed the rebase but want to undo it:

```bash
# Find the commit before the rebase
git reflog

# Reset to that point
git reset --hard HEAD@{n}  # where n is the reflog entry number
```

## Key Takeaways

✅ **Drop commits** by deleting their line or changing `pick` to `drop`

✅ **Reorder commits** by changing the line order in the rebase editor

✅ **Fixup must follow** the commit it's fixing - move it to the right position first

✅ **Plan before rebasing** - know what order you want before starting

✅ **Test after rebasing** - make sure your code still works

✅ **Interactive rebase is powerful** - you can do multiple operations in one session

## Common Commands Reference

```bash
# Start interactive rebase
git rebase -i main           # Rebase all commits since main
git rebase -i HEAD~n         # Rebase last n commits

# Interactive rebase commands (in editor)
pick   = keep commit as-is
drop   = remove commit entirely
reword = keep commit, edit message
fixup  = combine with previous, discard this message
squash = combine with previous, edit combined message

# During rebase
git rebase --continue        # Continue after resolving conflicts
git rebase --abort           # Cancel and restore original state
git rebase --skip            # Skip current commit

# Recovery
git reflog                   # See history including rebases
git reset --hard HEAD@{n}    # Undo rebase by resetting to reflog entry
```
