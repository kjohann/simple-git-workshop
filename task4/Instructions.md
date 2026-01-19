# Task 4: Interactive Rebase Basics

Learn how to clean up commit history using interactive rebase to reword messages, apply fixups, and squash related commits.

```text
ℹ️ Remember to initialize the task before proceeding by running npm run task:4 from the workshop root
```

## Overview

This task repository contains:

- `main` branch with 2 commits (initial project setup)
- `feature/user-validation` branch with 6 commits that need cleaning:
  - 2 commits where the second is a fixup for the first (forgot to add email validation)
  - 1 commit with an unclear message that needs rewording
  - 3 commits for profile functionality that should be squashed into a single commit

Your goal: Use interactive rebase to clean up these 6 commits into 3 polished commits.

## What is Interactive Rebase?

Interactive rebase (`git rebase -i`) lets you edit, reorder, combine, or remove commits from your branch's history. Instead of just moving commits onto a new base (like regular rebase), you get to modify them during the process.

When you start an interactive rebase, Git opens your editor with a list of commits and commands you can apply to each one:

- `pick` - Keep the commit as-is (default)
- `reword` - Keep the commit but edit its message
- `edit` - Pause to amend the commit's content
- `squash` - Combine with previous commit, keep both messages
- `fixup` - Combine with previous commit, discard this message
- `drop` - Remove the commit entirely

**Important**: Interactive rebase rewrites history. Only do this on commits you haven't pushed yet, or on branches only you are working on.

## Step-by-Step Exercise

### Step 1: Inspect the Current History

First, let's see what we're working with:

```bash
git log --oneline
```

You should see something like:

```text
f6g7h8i (HEAD -> feature/user-validation) Add test that uses username validator when creating profile
e5f6g7h Add tests for creating profile
d4e5f6g Add new profile function
c3d4e5f This needs rewording: Support phone
b2c3d4e Fixup: forgot email validation
a1b2c3d Add username validation function
y9z0a1b (main) Add package configuration
x8y9z0a Initial project setup
```

Notice the problems:

- "Add username validation function" is missing email validation - there's a fixup commit right after it
- "This needs rewording: Support phone" has a vague message that doesn't explain what it does
- Three separate commits for profile functionality that are really one logical change

### Step 2: Apply a Fixup

Let's start by fixing the "Add username validation function" commit. This commit is incomplete - it's missing email validation, which was added in the next commit "Fixup: forgot email validation".

#### Understanding Fixup vs Squash

Both `fixup` and `squash` combine commits, but they handle commit messages differently:

- **`squash`**: Combines the commit with the previous one and lets you edit a combined commit message. You'll see both messages in your editor and can create a new message incorporating both.

- **`fixup`**: Combines the commit with the previous one but automatically discards the fixup commit's message. The previous commit's message is kept as-is. This is perfect for commits like "Fix typo" or "Oops, forgot this file" where the message doesn't add value.

#### When to use which?

- Use `fixup` when you want to discard the commit's message but merge its changes with the previous one (typically for when you forgot something)
- Use `squash` when both commits contribute meaningful information you want to preserve

Let's fix this now. Start an interactive rebase for the last 6 commits\*:

```bash
git rebase -i HEAD~6
```

\* NOTE: If you'd like to rebase all the commits since main, simply write `git rebase -i main`

Your editor will open with:

```text
pick a1b2c3d Add username validation function
pick b2c3d4e Fixup: forgot email validation
pick c3d4e5f This needs rewording: Support phone
pick d4e5f6g Add new profile function
pick e5f6g7h Add tests for creating profile
pick f6g7h8i Add test that uses username validator when creating profile
```

Change the second line to use `fixup` or `f`:

```text
pick a1b2c3d Add username validation function
fixup b2c3d4e Fixup: forgot email validation
pick c3d4e5f This needs rewording: Support phone
pick d4e5f6g Add new profile function
pick e5f6g7h Add tests for creating profile
pick f6g7h8i Add test that uses username validator when creating profile
```

Save and close. Git will automatically:

1. Apply the first commit
2. Apply the fixup commit's changes on top of it
3. Discard the fixup commit's message
4. Create a single combined commit with just the first commit's message

Now check your history:

```bash
git log --oneline
```

The "Fixup: forgot email validation" commit is gone, and its changes are now part of "Add username validation function". If you inspect that commit:

```bash
git show HEAD~4
```

You'll see it now includes both the username AND email validation functions!

### Step 3: Reword a Commit Message

Now let's fix that vague commit message: "This needs rewording: Support phone". This doesn't clearly describe what the commit does.

Start another interactive rebase:

```bash
git rebase -i HEAD~4
```

Your editor shows the remaining commits:

```text
pick a1b2c3d Add username validation function
pick c3d4e5f This needs rewording: Support phone
pick d4e5f6g Add new profile function
pick e5f6g7h Add tests for creating profile
pick f6g7h8i Add test that uses username validator when creating profile
```

Change the second line to use `reword` or `r`:

```text
pick a1b2c3d Add username validation function
reword c3d4e5f This needs rewording: Support phone
pick d4e5f6g Add new profile function
pick e5f6g7h Add tests for creating profile
pick f6g7h8i Add test that uses username validator when creating profile
```

Save and close. Git will open another editor for you to rewrite the commit message. Replace it with:

```text
Add support for using phone number as username
```

Save and close. The rebase continues automatically.

**What happened?** Git rewrote that commit with the new message, then reapplied all subsequent commits on top of it.

### Step 4: Squash Multiple Commits

Finally, let's combine those three profile-related commits into a single, well-named commit.

Start another interactive rebase:

```bash
git rebase -i HEAD~3
```

Your editor shows:

```text
pick d4e5f6g Add new profile function
pick e5f6g7h Add tests for creating profile
pick f6g7h8i Add test that uses username validator when creating profile
```

We want to keep the first commit and squash the other two into it - use `squash` or `s` on the other two:

```text
pick d4e5f6g Add new profile function
squash e5f6g7h Add tests for creating profile
squash f6g7h8i Add test that uses username validator when creating profile
```

Save and close. Git will open another editor showing all three commit messages:

```text
# This is a combination of 3 commits.
# This is the 1st commit message:

Add new profile function

# This is the commit message #2:

Add tests for creating profile

# This is the commit message #3:

Add test that uses username validator when creating profile
```

Replace everything with a single, clear message:

```text
Add profile creation with comprehensive tests
```

Save and close. Git combines all three commits into one!

## Verify Your Work

Check your final history:

```bash
git log --oneline --all --graph
```

You should now see a clean history with just 3 commits on the feature branch:

```text
* c3d4e5f (HEAD -> feature/user-validation) Add profile creation with comprehensive tests
* b2c3d4e Add support for using phone number as username
* a1b2c3d Add username validation function
* y9z0a1b (main) Add package configuration
* x8y9z0a Initial project setup
```

Perfect! You've transformed 6 messy commits into 3 polished ones.

## Visual: Before and After

**Before (messy history):**

```text
* Add test that uses username validator when creating profile
* Add tests for creating profile
* Add new profile function
* This needs rewording: Support phone
* Fixup: forgot email validation
* Add username validation function
* Add package configuration (main)
* Initial project setup
```

**After (clean history):**

```text
* Add profile creation with comprehensive tests
* Add support for using phone number as username
* Add username validation function (includes email validation)
* Add package configuration (main)
* Initial project setup
```

## Important Warnings

⚠️ **Never rebase commits that have been pushed to a shared branch!** Other developers may have based work on those commits. Rewriting history they've already pulled will cause major conflicts.

⚠️ **Interactive rebase rewrites commit hashes.** Even commits you don't modify get new SHAs because their parent commits changed.

⚠️ **Always work on a feature branch.** If you make a mistake during interactive rebase, you can abort with `git rebase --abort` to return to the state before you started.

## Key Takeaways

✅ Interactive rebase (`git rebase -i`) lets you edit commit history before sharing your work

✅ `reword` changes a commit message without changing its content

✅ `fixup` combines a commit with the previous one, discarding the fixup's message (use for "oops" commits)

✅ `squash` combines a commit with the previous one, letting you edit the combined message (use when both messages add value)

✅ Clean commit history makes code review easier and helps future developers understand your changes

✅ Only rebase commits that haven't been pushed to shared branches

## Common Commands Reference

```bash
# Start interactive rebase for last N commits
git rebase -i HEAD~N

# Start interactive rebase from a specific commit (rebase everything after it)
git rebase -i <commit-hash>

# Abort an interactive rebase in progress
git rebase --abort

# Continue after resolving conflicts during rebase
git rebase --continue

# View commit history
git log --oneline

# View commit history with graph
git log --oneline --graph --all

# Show details of a specific commit
git show <commit-hash>

# Show details of a commit relative to HEAD
git show HEAD~N
```
