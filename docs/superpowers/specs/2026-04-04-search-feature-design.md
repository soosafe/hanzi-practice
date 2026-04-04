# Search Feature Design

**Date:** 2026-04-04  
**Status:** Approved

## Overview

Add a search button to the navbar (right of the dark/light mode toggle) that lets users search all words by Hanzi or Pinyin. Results appear in a dropdown; clicking a result opens a full word detail modal with a listen button.

---

## Architecture

All search logic lives in a new `src/search.js` module. `main.js` calls `initSearch(WORDS, selectedVoice)` after setup. The module owns its own DOM elements, event listeners, and state. No search logic bleeds into `main.js`.

---

## Navbar Layout

- A `nav-right` wrapper div is added to `index.html`, containing `#btnTheme` and the new `#btnSearch` (🔍).
- `nav-right` uses `display: flex; align-items: center; gap: 8px`.
- `#btnSearch` uses the same styling as `#btnTheme` (transparent, border, `btn-theme` class or equivalent).
- When search is active on desktop, a text input expands within `nav-right` (max-width ~220px, animated). The title and center mode buttons are never affected.
- On mobile (≤600px), the inline input does not expand. Instead, clicking `#btnSearch` opens a modal overlay.

---

## Search Behaviour

- Triggers on every keystroke (minimum 1 character).
- Searches across: hanzi (partial match) and pinyin (partial match, tone-insensitive using existing `normalizePinyin()` from `main.js`).
- Returns up to 10 results.
- Each dropdown row: **汉字** · pinyin · meaning.
- "No results found" shown when query has no matches.
- Dropdown closes on: Escape key, click outside, or clicking a result.

---

## Word Detail Modal

Reuses existing `.modal-overlay` / `.modal` CSS classes. Triggered by clicking a search result row.

Contents:
- Hanzi (large, CJK font)
- Pinyin
- Meaning
- HSK level badge
- Hanzi tip (if present)
- Word tip (if present)
- 🔊 Listen button — speaks the hanzi using the existing `selectedVoice` / SpeechSynthesis setup
- Close button

Closing: Close button, Escape key. The search dropdown remains open behind the modal so the user can pick another result after closing.

---

## Files Changed

| File | Change |
|------|--------|
| `index.html` | Add `nav-right` wrapper, `#btnSearch`, search input, search dropdown, search detail modal |
| `src/search.js` | New module — all search logic, event listeners, dropdown, detail modal behaviour |
| `src/main.js` | Call `initSearch(WORDS, selectedVoice)` after init |
| `src/styles/main.css` | Styles for `nav-right`, search input expand animation, search dropdown, mobile modal variant |

---

## Mobile Behaviour

On screens ≤600px:
- Clicking `#btnSearch` opens a full-screen modal overlay with a search input at the top and results listed below.
- Same search logic and result detail modal as desktop.
- No inline navbar expansion on mobile.

---

## Out of Scope

- Search history / recent searches
- Filtering results by HSK level or category
- Editing a word from the detail modal
