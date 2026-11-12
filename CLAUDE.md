# Yggdrasil Campaign Tools: notes for Claude

The canonical lore and design decisions live in the claude.ai Project **"D&D - Yggdrasil"** (`claude/World Bible.md`, `claude/Price Reference.md`, `claude/Guild Upgrade Catalog (draft).md`). If you can't reach it, ask Max for the latest World Bible before changing game rules or content.

## What this is
A single-file, offline HTML app ("Guild Hall") the DM uses for prep and at the table. The DM does not have Claude; Max does. Data must never depend on Claude-hosted storage.

## Build
`python3 build.py` concatenates `src/` into `dist/Yggdrasil-Guild-Hall.html` (commit `dist/`, since the DM downloads it from GitHub). It also gets published as a claude.ai artifact for Max (declare capabilities `sample` + `downloads`).

## Architecture (src/)
- `core.js`: helpers, campaign state `C` (+ `S = C.settings`), `commit()` (autosave to localStorage + dirty flag), campaign file save/load/import, `AI` (artifact `sample` → API key via direct browser fetch → copy/paste fallback via `aiRun`/`aiButtons`), `printHTML` (window.print standalone; downloads a printable page when framed).
- `jobtables.js` / `upgtables.js`: default tables (`DEFAULT_JOB_TABLES`, `DEFAULT_UPG_TABLES`, `DEFAULT_PRICES`). Custom tables are stored in `C.tables.*` (null = use defaults) and travel in the campaign file.
- `jobboard.js` (`Jobs`), `upgrades.js` (`Upgrades`), `roster.js` (`Roster`): IIFE modules, each with `render`/`bind`.
- `tableeditor.js` (`TableEditor`): form view over any table JSON (lazy collapsible sections; maps vs records via heuristics + `RECORD` set; labels/hints maps).
- `app.js` (`App`): nav, Table Mode, print center, settings, boot.
- `notice.css` is shared by the page and print output (injected as `NOTICE_CSS`).

## Character import
Roster → Import character accepts the JSON in the project doc `claude/Guild Hall Import Format.md` (keep `Roster.mapMember` in sync with it), or a sheet's text/PDF sent through Claude.

## Conventions
- Everything the DM must keep lives in `C`; UI prefs in `ygh.ui`; API key only in `ygh.apikey` (never in `C`).
- Call `commit()` after every mutation of `C`.
- Keep the dark wood & gold look (Cinzel / Crimson Pro; print uses IM Fell parchment).
- Upgrade prices are in "jobs" = one Standard job's guild fee (25%) at mid-tier; `gp` overrides.
- Bump `SCHEMA` and migrate in `normalize()` if the campaign shape changes.
