# Yggdrasil Campaign Tools

DM prep and at-the-table tools for the **Yggdrasil** D&D 5e campaign (a guild of adventurers based in a World Tree that grows through every world).

## Get the app
Download **[`dist/Yggdrasil-Guild-Hall.html`](dist/Yggdrasil-Guild-Hall.html)** and open it in any browser. It's one self-contained file and works offline.

## What's inside
- **Job Board**: roll 6–8 tier-weighted job hooks, expand them into prep cards and in-world Quest Notices, and mark the ones you'll use as final.
- **Guild Upgrades**: the downtime shop for Facilities, Services, and Staff (I–III), add-ons, rolled Peddlers, operators, and the treasury.
- **Roster**: members, PCs, retired PCs, and hired NPCs, with skill/tool grades. Retired PCs stay in the hall as operators.
- **At the Table**: Table Mode shows jobs in play, the hall's upgrades, a revival-fee calculator, who's in the hall, and a price reference.
- **Print**: Quest Notices, the Builder's Ledger, upgrade cards, and a roster sheet.

## Saving (important)
The **campaign file** (`Save Campaign` → `yggdrasil-campaign-YYYY-MM-DD-HHMM.json`) is the source of truth. The browser keeps a working copy, but save a file after every prep session and keep the files somewhere safe. `Load Campaign` restores one. The page warns about unsaved changes. Shortcuts: **Ctrl/Cmd+S** saves the campaign file; **Ctrl/Cmd+Z** (or ↶ Undo) reverses the last change this session, including deletes.

## Claude features
Expand (job prep cards, upgrade write-ups) works three ways:
1. **Opened inside Claude** (published artifact): uses Claude directly.
2. **Downloaded file + API key**: enter a key in Settings → Claude. It stays in that browser only, never in the campaign file. Use a dedicated key with a spend limit.
3. **No connection**: fills in from the random tables, with **Copy Claude prompt / Paste result** buttons.

## Development
Source lives in `src/`. Build the single file with:
```
python3 build.py   # → dist/Yggdrasil-Guild-Hall.html
```
See `CLAUDE.md` for architecture and conventions.
