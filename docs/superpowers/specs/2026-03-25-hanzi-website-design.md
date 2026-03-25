# Hanzi Practice Website — Design Spec
**Date:** 2026-03-25
**Status:** Approved

---

## 1. Overview

A free, public-facing single-page web app for practicing Chinese Hanzi characters. Built with vanilla JS + Vite. Designed to be shared openly with learners worldwide. Current scope is HSK 1 vocabulary; the architecture supports future HSK levels, illustrations, and new features without refactoring.

---

## 2. Project Structure

```
hanzi-practice/
├── public/
│   └── illustrations/        # Future: per-character SVG/PNG drawings (e.g. 太.png)
├── src/
│   ├── data/
│   │   ├── hsk1.js           # Exports HSK1_WORDS array (51 words)
│   │   ├── hsk2.js           # Empty placeholder — exports HSK2_WORDS = []
│   │   └── index.js          # Imports all level files, exports DEFAULT_WORDS array
│   ├── styles/
│   │   └── main.css          # All styles: light mode, dark mode, responsive
│   └── main.js               # Full app logic (both modes) including normalizePinyin utility
├── index.html
├── package.json
└── vite.config.js
```

---

## 3. Data Model

Each word object:
```js
{
  h: '太好了',           // Hanzi character(s)
  p: 'tài hǎo le',      // Pinyin with tone marks
  m: 'Great!',           // English meaning
  cat: 'words',          // Category: 'words' | 'time' | 'numbers' | 'family'
  level: 1,              // HSK level: 1 | 2 | 3 | ...
  tip: '...',            // Hanzi tip: visual memory for character shape
  wtip: '...'            // Word tip: sound/meaning hook
}
```

**Data files:**
- `hsk1.js` — exports `HSK1_WORDS` array (51 words, all current vocabulary, `level: 1`)
- `hsk2.js` — exports `HSK2_WORDS = []` (empty placeholder, ready for future words)
- `index.js` — imports all level arrays, exports combined `DEFAULT_WORDS` array

**localStorage keys:**
- `hanzi_words` — JSON array of the full working word list (see Section 4.3 for delete behaviour)
- `hanzi_known` — JSON array of Hanzi strings marked as "Know It"
- `hanzi_theme` — `'light'` | `'dark'` (user's explicit theme choice)

---

## 4. Features

### 4.1 Global (both modes)

| Feature | Detail |
|---------|--------|
| Top navbar | App title, mode switcher (Flashcards / Pinyin Quiz), theme toggle (sun/moon) |
| Category filter | Tabs: All, Time, Numbers, Words, Family — each shows word count for current active level filter |
| HSK level filter | Tabs: All HSK, HSK 1, HSK 2, … — **only rendered when `DEFAULT_WORDS` contains at least two distinct `level` values with at least one word each**. Initially hidden since only HSK 1 is populated. |
| Progress bar | Thin bar showing position in current deck, with "X of Y" label below |
| Stats bar | Flashcard: "X known, Y still learning" / Quiz: "X correct, Y wrong" |
| Shuffle button | Randomises deck order, resets deck index to 0 |
| Reset button | Clears `hanzi_known` from localStorage only. Does **not** restore permanently deleted words. |
| Add Word button | Opens modal form to add a custom word |
| Audio (Listen) | Web Speech API — auto-selects best Chinese voice by scanning for names containing: Tingting, Meijia, Xiaoxiao, "Google 普通话". Falls back to any `zh-CN` voice, then any `zh-*` voice. `lang: zh-CN`, `rate: 0.8`, `pitch: 1.1`. Detected voice name shown in small text at page bottom. If no matching voice is found at all, shows "No Chinese voice detected" — the Listen button remains enabled and attempts to speak anyway (some browsers will still produce output with the default voice). |
| localStorage | Word list + known state persisted across sessions |
| Responsive | Mobile-first, single column, max-width 600px centered on desktop |
| Theme | Sun/moon toggle in navbar. Defaults to `prefers-color-scheme` on first visit; subsequent visits use `hanzi_theme` from localStorage. |
| Accessibility | All interactive buttons carry descriptive `aria-label` attributes. Modal uses `role="dialog"` and `aria-modal="true"`. Focus is trapped inside the modal while open and restored on close. |

### 4.2 Flashcard Mode

1. Large Hanzi displayed on card
2. Listen button below character
3. **Reveal** button — on tap, the button is hidden and replaced by the revealed content: pinyin (red), English meaning, then two tip boxes side by side:
   - **HANZI TIP** — red 2px top border
   - **WORD TIP** — blue 2px top border
4. After reveal: **Still Learning** (red border) and **Know It** (green border)
   - Know It: adds Hanzi to `hanzi_known` in localStorage, increments known counter, advances
   - Still Learning: advances only, does not affect known state
5. **Unknowns Only** toggle — when activated (including mid-deck), immediately rebuilds the deck from words not in `hanzi_known` and resets deck index to 0
6. **Remove (×)** button on each card — see Section 4.3 for delete behaviour
7. **Completion screen** when deck index exceeds deck length: 🎉 emoji, "X known, Y still learning" counts, Start Over button (resets index to 0 without clearing known state)

### 4.3 Permanent Word Deletion

When the user clicks the Remove (×) button on a card:

1. The word is removed from the in-memory `WORDS` array
2. The updated array is immediately written to `hanzi_words` in localStorage
3. The word's Hanzi is also removed from `hanzi_known` if present
4. The deck is rebuilt from the updated array; if the current index is now out of bounds, it clamps to the last card
5. **Reset does not restore deleted words.** Reset only clears `hanzi_known`. To restore deleted words, the user must clear `hanzi_words` from localStorage manually (or a future "Restore Defaults" feature).

### 4.4 Pinyin Quiz Mode

1. Large Hanzi + English meaning shown
2. Listen button
3. Text input — user types pinyin (tones optional, both are accepted)
4. **Check** button (also triggered by Enter key when input is focused)
5. Correct: input border turns green, shows "Correct!" in green below input
6. Wrong: input border turns red, shows "Not quite — [correct pinyin]" in red. Both tip boxes rendered inline below the feedback text within the same card.
7. **Next** button appears after answering (also triggered by Enter key)
8. **Results screen** at end of deck:
   - Emoji based on score: 🏆 (≥90%), 💪 (≥60%), 📚 (<60%)
   - "X correct, Y wrong — Z%" summary
   - Review list of all wrong words: Hanzi (large), pinyin (red), meaning, 🔊 play button
   - Try Again button resets the round (same deck order, all counters to 0)

### 4.5 Add Word Form (modal)

| Field | Required | Notes |
|-------|----------|-------|
| Hanzi | Yes | If a word with this Hanzi already exists in the list, show inline error: "This word already exists." and block submission |
| Pinyin | Yes | |
| Meaning | Yes | |
| Category | Yes | Select: Words, Time, Numbers, Family |
| Hanzi Tip | No | Defaults to "No tip provided." if empty |
| Word Tip | No | Defaults to "No tip provided." if empty |

- `level` is automatically set to `1` for all user-added words (can be changed in a future update)
- Validation errors appear as red text directly below the relevant field
- On successful submit: word appended to `hanzi_words` in localStorage, category tabs update their counts, deck rebuilds
- Closeable via: Cancel button, Escape key, clicking the overlay

---

## 5. Design System

### 5.1 Color Tokens

```css
/* Semantic accents — same in both modes */
--red:    #E5484D;   /* primary, wrong, active */
--green:  #30A46C;   /* correct */
--blue:   #0090FF;   /* word tip accent */

/* Light mode */
--bg:       #FAFAF8;
--surface:  #F5F3F0;
--border:   #E7E4DF;
--text:     #1C1917;
--text-2:   #78716C;

/* Dark mode */
--bg:       #1C1917;
--surface:  #292524;
--border:   #44403C;
--text:     #F5F5F4;
--text-2:   #A8A29E;
```

Note: all references above are conceptual; in CSS use `var(--red)`, `var(--bg)`, etc.

### 5.2 Typography

- UI text: `system-ui, -apple-system, sans-serif`
- Hanzi characters: `'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif`
- Hanzi display size: 64px (desktop), 52px (mobile, < 420px breakpoint)
- Pinyin reveal size: 22px, `var(--red)`, weight 500

### 5.3 Components

- **Cards:** `border: 1px solid var(--border)`, `border-radius: 12px`, `padding: 24px`
- **Tip boxes:** Side by side, `border-radius: 8px`, 2px colored top border, 1px side/bottom border in `var(--border)`
- **Buttons:** Transparent background, `1px solid` border, fill on hover, `border-radius: 6px`
- **Category/level tabs:** Pill shape, `border-radius: 20px`
- **Progress bar:** 4px height, `var(--red)` fill, smooth CSS transition

### 5.4 Layout

- Mobile-first, single column
- Max-width: `600px`, centered with `margin: 0 auto`
- Tip boxes stack vertically on screens narrower than 420px
- No dashes in UI text — use "of" instead of "/" in counters (e.g. "3 of 10")

---

## 6. Pinyin Normalisation

Lives in `main.js` as a module-level utility function:

```js
function normalizePinyin(s) {
  return s.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip tone diacritics
    .replace(/[^\w\s]/g, '')         // strip remaining punctuation (ASCII-only by design)
    .trim();
}
```

Applied to both user input and stored pinyin before comparison. The `\w` pattern intentionally matches ASCII `[A-Za-z0-9_]` only — this is correct because all stored pinyin uses ASCII letters with tone diacritics that are fully removed in the NFD step before `\w` runs.

---

## 7. Deployment

**Platform:** Vercel (preferred)
**Build command:** `vite build`
**Output directory:** `dist`
**Cost:** Free tier (static site, no backend)
**Branch:** Connect the default branch of the GitHub repository (currently `master`; rename to `main` before Vercel setup if preferred)

Workflow: push to GitHub → Vercel detects push → auto-builds and deploys → live URL updated.

---

## 8. Future Considerations (Out of Scope Now)

These are NOT in scope for this version but the architecture supports them without refactoring:

| Feature | How architecture supports it |
|---------|------------------------------|
| HSK levels 2–6 | Add `hsk2.js` with real words; HSK filter tab appears automatically |
| Illustrations | Drop `[hanzi].png` into `public/illustrations/`; app can render if present |
| Drawing/stroke order | `public/illustrations/` ready for animated SVGs |
| More categories | Add new `cat` values to word objects |
| Restore Defaults button | Clear `hanzi_words` from localStorage and re-seed from `DEFAULT_WORDS` |
| Backend / accounts | No server; no auth — all state is local |
