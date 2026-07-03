# Daily Focus

A small focus dashboard — your seven most important things, one day at a time.

## Files

- **`daily-focus.html`** — standalone version. Open it directly in any browser; your list is saved to `localStorage`.
- **`daily-focus.jsx`** — React component version (persists via `window.storage`).

Both files implement the same app and are kept in sync.

## Features

- Up to **seven daily priorities** with a progress bar and completion tally.
- Unfinished items **carry forward** to the next day automatically.
- **Light / dark mode** toggle in the header — remembers your choice and defaults to your OS setting.
- **History** view — a read-only look back at past days (newest first), each showing its tally and which items were completed.
- A rotating daily quote and motif.

## Using it across machines

This repo is the source of truth. Clone it on each machine and `git pull` / `git push` to stay in sync — no need to keep the working folder in a cloud-synced directory.
