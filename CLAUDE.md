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
- `shoptables.js` (`DEFAULT_SHOP_TABLES`) / `shops.js` (`Shops`): Shop Generator tab (`tab-market`; the `shop` tab id is Guild Upgrades). Shops live in `C.shops` (kept ones feed Print and Table Mode; unkept capped at 8); custom ideas and write-ups go through `aiRun`/`aiButtons`. Prices stored in gp decimals (0.1 = 1 sp), shown via `Shops.coins`.
- `npctables.js` (`DEFAULT_NPC_TABLES`) / `npcs.js` (`NPCs`): Roster → NPCs subtab. One people store: `C.roster` holds guild members (kinds Founder / Active PC / Retired PC / Hired NPC, shown under Guild Members; `Roster.sorted()` returns members only) and everyone else (kind `NPC`). NPC fields: occupation, title, connection, genre, archetype, level, label, look, voice, manner, want, secret, attitude, guild, public, seat (Council tier), rival, pinned, `x` (write-up), `sb` (stat block). Generator weights blank fields (level curve in `levelCurve`). Council = NPCs with `seat`; starting members seeded once by `NPCs.ensure()` (`C.councilSeeded`), which also adds Mordecai's profile fields (`forms`, `motive`). Bridges: `fromPatron` (Kept/Final jobs auto-save; job cards have save NPC / use NPC / + guild), `fromOffer` (Peddlers), `fromStaff` (shop staff), `addToGuild` / `leaveGuild` (never touch the treasury). Table Mode "NPCs in play" and Print (NPC cheat sheet for pinned NPCs, player-facing Council Notice).
- `tableeditor.js` (`TableEditor`): form view over any table JSON (lazy collapsible sections; maps vs records via heuristics + `RECORD` set; labels/hints maps).
- `app.js` (`App`): nav, Table Mode, print center, settings (incl. backups list), quick search (Ctrl+K; `index()` + `go()`; cards carry `data-job` / `data-member` / `data-npc` / `data-id` (shops) / `data-upg` so search and `App.flash(sel)` can find them), boot.
- Saving: `saveCampaign()` writes to a linked file handle when the File System Access API exists (handle kept in IndexedDB `ygh`/kv); otherwise downloads. `IDB` also stores rolling backups (`backup(reason)`, last 25). `replaceCampaign(c, reason)` backs up first; loading a file another way unlinks the handle so a different campaign never overwrites it.
- Job Board cards are collapsed by default (`UI.jobsOpen` per id, `UI.jobsAllOpen`); secondary actions live in a `details.more` overflow menu. Roster subtabs: members / npcs / council (`NPCs.render(mode)`).
- Phone layout: `App.layout()` sets `body.mobile` (auto under 760px via matchMedia, or `UI.layout` = phone/desktop from Settings → Display). All phone CSS is scoped under `body.mobile` at the end of `styles.css`; `#mainNav` becomes a fixed bottom tab bar. Icons are inline SVGs injected into `[data-ico]` elements (`ICONS` in app.js); labels live in `.lbl` (full) / `.slbl` (short), so click handlers on those buttons must use `closest()`, not `e.target.dataset`.
- `notice.css` is shared by the page and print output (injected as `NOTICE_CSS`).

## Character import
Roster → Import character accepts the JSON in the project doc `claude/Guild Hall Import Format.md` (keep `Roster.mapMember` in sync with it), or a sheet's text/PDF sent through Claude.

## Conventions
- Everything the DM must keep lives in `C`; UI prefs in `ygh.ui`; API key only in `ygh.apikey` (never in `C`).
- Call `commit()` after every mutation of `C`. Each `commit()` pushes an undo snapshot (`UNDO`, session only); commits in the same tick coalesce into one undo step.
- Use `pickFresh(list, key)` (not `pick`) for anything players would notice repeating; recent picks are remembered in `C.recent`.
- When default tables change, bump their `version`; customized tables get an "Add new default content" merge (`mergeNew`) in Settings.
- `tools/` holds one-off content scripts (e.g. `content-v2.js`), already applied to `src/`.
- Keep the dark wood & gold look (Cinzel / Crimson Pro; print uses IM Fell parchment).
- Upgrade prices are in "jobs" = one Standard job's guild fee (25%) at mid-tier; `gp` overrides.
- Bump `SCHEMA` and migrate in `normalize()` if the campaign shape changes.
