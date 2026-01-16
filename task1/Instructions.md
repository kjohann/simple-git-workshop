# Task 1: Git Config and aliases

The first set of tasks will familiarize you with the git config, mostly focusing on aliases. A by-product may be that you also learn some new commands and/or flags for those commands.

```text
ℹ️ Remember to initialize the task before proceeding by running npm run task:1 from the workshop root 
```

## Overview

This repository has been set up with the following structure:

- **main branch**: Has evolved with 5 commits (config, README updates, utils module)
- **feature/add-logging branch**: Was created early and has 2 commits (calculator implementation and tests) which has later been merged into main.

## Configuring git

Git has two levels of config:

- Global - applies to all repos - atteched to your user\*
- Local - applies only to the repo you are currently in - located in the `./.git` folder

\* Exactly where will vary depending on your OS. *Nix is typically at `~/.gitconfig` or `~/.config/git/config` while Windows has it at `%USERPROFILE%\.gitconfig`.

The way to work with your config is one of two ways. Either from the command line:

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

Or through direct file edit. Notice the `--global` flag above. For the purpose of this task, you may want to omit it and only work on the local git repo. Just remember that any config you do locally here will not carry over to other repositories. The remaining examples will omit this flag.

If you prefer direct file edit, or simply just want to have it as an option, you should take an informed choice of what editor to use. If you don't want to manually navigate to the config file in your file explorer and open it from there, you can run this command instead:

```bash
git config --edit # or -e for short
```

By default this opens every ones favourite editor - you can find some handy tips on how to use that [in this GitHub repository](https://github.com/hakluke/how-to-exit-vim).

If you'd like to change the default behaviour, I recommend searching the web for how to use your favourite editor to open files from git. You can configure git to open this editor for other cases than simply editing the config, for example for using it as a diff or merge tool when running commands like `git mergetool` or `git difftool` (note that these aren't so common any more since most editors you use for your code has git capabilities built in, but they are handy if you want to use a specialized git UI tool like [SourceTree](https://www.sourcetreeapp.com/)).

This is how you can set VSCode to be your editor for git:

```bash
git config core.editor "code --wait"
```

From this point onwards, I will mostly assume that you use your editor to add config.

## Aliases

You can set aliases in git which lets you run commands like `git your-alias` that does something you have defined. This is a very powerful and handy feature, and it can do a lot more than you think!

### A note on git aliases vs "OS aliases"

You can define aliases for your OS, for example to be able to run `gc` to do `git commit`. These will follow your shell and there are probably a lot of good things you can do with those as well. But there are some drawbacks:

- Tab completion for git may not work (there are probably plugins or other ways to remidy this on some OS'es). Meaning that if you have an alias for `git switch` named `gs` and you type gs and hit tab, you probably only get files as suggestions. But you wanted branches!
- Arguments can only be at the end. Or you'll have to write a function and use the alias as a funciton call. But with git aliases, you can have arguments "anywhere" - ironically, the method of doing this is by having the alias be a bash function that is immediately called. I recommend you google use cases like this, as this is more advanced and outside the scope of this workshop.

The main drawback of git aliases is that you have to type `git` first. That's three whole letters!

### I've read enough, give me some aliases!

The sky's the limit here, but I'll share some useful one's. Feel free to spend time finding operations you often do that you always think that would be nice to type less when doing.

I'll provide you with a command to set your first alias if you don't have any (or if you're working on the local git config of the task repo).

```bash
git config alias.lg "log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"
```

Nice to not have to type that every time right? `git log` output is highly subjective, so feel free to see if you find other ways you like more. A more simple approach would be to set the alias to `log --oneline --graph`.

A thing to notice is that any alias starts with the part of the command that normally would follow directly after you've typed `git` - which makes sense, since you still type it when invoking aliases: `git lg`.

Here are more suggestions, but now in the format that resides in your config file (so open your config file using `git config -e` or "translate" each to `git config alias.<the alias> ""` commands):

**NOTE:** config related commands below use the `--global` flag.

```text
[alias]
    conf = config --global # you normally want your global config, but typing --global is a hassle
    cob = "checkout -b" # checkout a new branch: git cob my-branch
    st = status
    com = commit -m # git com "This is a new feature"
    a = add -A # add ALL files
    rs = reset --mixed HEAD~1 # a handy snippet to reset the latest commit and unstage all changes - git reset --soft resets, but keeps changes staged
    list = config --global --get-regexp ^alias # view your aliases without opening the config file
    can = commit --amend --no-edit # for when you forgot something and just want to "hide" it in the previous commit
    b = branch -v # list branches in the repo with information about the latest commit
    lgmy = lg --author='<the name you've put as username in your config>' # list your changes (notice that this calls another alias, 'lg')
```
