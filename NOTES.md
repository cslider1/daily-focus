# Project Notes

Working notes for the Daily Focus project and its setup. (For what the app *is*, see `README.md`.)

## Repository

- **GitHub:** https://github.com/cslider1/daily-focus (public)
- **Default branch:** `main`
- **Local folder:** `~/daily-focus` (a plain local folder — intentionally *not* in Downloads or iCloud Drive)
- **Commit email:** GitHub `noreply` (`<id>+cslider1@users.noreply.github.com`) — keeps a real email out of the public commit history while still attributing commits to the `cslider1` profile. This is now the global git default for future repos too.

### Why not iCloud Drive?
GitHub is the cross-device sync. Keeping the git repo inside iCloud Drive risks
`.git` corruption from sync conflicts, so the repo lives in a normal local folder
and syncs through GitHub instead.

## Everyday workflow

```sh
cd ~/daily-focus
# ...edit files...
git add -A
git commit -m "describe your change"
git push
```

## Setting up on another machine (e.g. the Mac mini)

```sh
git clone https://github.com/cslider1/daily-focus.git
cd daily-focus
# one-time GitHub sign-in on that machine:
gh auth login --hostname github.com --git-protocol https --web
```

Then `git pull` to get changes and `git push` to send them.

## The app files

- `daily-focus.html` — standalone version (open directly in a browser; saves to `localStorage`).
- `daily-focus.jsx` — React version (persists via `window.storage`).

Both are kept in sync. Features: seven daily priorities, carry-forward of unfinished
items, light/dark theme toggle, and a History view of past days.

## Backups

Pre-change backups from earlier edits live outside the repo (not tracked):

- `~/Downloads/daily-focus.html.bak`
- `~/Downloads/daily-focus.jsx.bak`
- `~/Downloads/add-history.md` (the instructions used to re-add the History feature)

`.gitignore` excludes `*.bak`, `.DS_Store`, `node_modules/`, and `dist/`.

## Resuming the Claude Code conversation that set this up

Run from the same directory it started in (`/Users/sliderair`):

```sh
cd /Users/sliderair
claude --resume d8a8e114-cd41-4ba0-b7e5-d5a431adf053
```

Or `claude --resume` for a picker / `claude --continue` for the most recent.
Transcript (this machine only):
`~/.claude/projects/-Users-sliderair/d8a8e114-cd41-4ba0-b7e5-d5a431adf053.jsonl`
