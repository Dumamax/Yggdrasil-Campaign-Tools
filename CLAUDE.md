# Yggdrasil Campaign Tools: notes for Claude

The canonical lore and design decisions live in the claude.ai Project **"D&D - Yggdrasil"** (`claude/World Bible.md`, `claude/Price Reference.md`, `claude/Guild Upgrade Catalog (draft).md`). If you can't reach it, ask Max for the latest World Bible before changing game rules or content.

## What this is
A single-file HTML app ("Guild Hall"), hosted on GitHub Pages from this public repo (root `index.html` redirects to `dist/`) and also usable offline as a downloaded file. Opens in a read-only **Player View**; the DM unlocks **DM View** with a password for prep and the table. The DM does not have Claude; Max does. Data must never depend on Claude-hosted storage.

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
- Print: `printSections()` lists handouts (players' first, DM-only last); each is a `.pr-sec` starting on a new page (US Letter, .5in margins, `PRINT_BASE`). `paginate()` simulates breaks (blocks that mustn't split: notices, shops, cards, ledger `tbody` per upgrade, NPC boxes) to count pages; with Two-sided (`UI.print.duplex`) a blank page follows any odd-length section. Ink-friendly (`UI.print.ink`) wraps output in `.ink`: overrides in `PRINT_BASE` strip fills/shadows to black line-work (double rules, ❦ ornaments). New printable blocks should be added to the `paginate()` selector and `PRINT_BASE` avoid-break list.
- `standing.js` (`Standing`): guild standing points (display name/short label configurable in `S.cp`; don't hard-code "Contribution Points"). State `C.guild.cp` = `{pts, log[]}` (pts = progress toward the next rank; log entries Job/Deed/Adjust/Promotion/Demotion). Unit = a Standard job at the guild's rank = 3 × (rank+1) (matches job `contribution`); step cost = `S.cp.stepJobs[tier]` units, deeds = `S.cp.deeds[size]` units. Jobs: ⋯ menu Completed / Failed / Reopen (`h.done`). Promotion is a DM click, never automatic; leftover points carry over. Strip renders into every `.standing-host` (Job Board, Guild Upgrades, Table Mode); player print section "Guild Standing".
- `access.js`: Player/DM View and GitHub sync. `isDM()` = `S.dmHash` matches `ygh.dm` in this browser (casual protection only; the campaign isn't encrypted). Player tabs `p-*` render read-only handouts from the print functions into `#tab-p` (`renderPlayer` in app.js); `body.player` hides every editing control and shortcuts. `Sync` pulls `data/campaign.json` via the GitHub contents API (players every 60s, conditional requests), and `saveCampaign()` commits it when this browser has a token (`ygh.ghtoken`, never in `C`); sha mismatch → conflict dialog (overwrite / load theirs). `ask()`/`modal()` are the dialog helpers.
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
