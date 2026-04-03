# Hanzi Practice App — Claude Code Notes

## Project Overview
A flashcard/quiz app for learning Chinese (Hanzi). Built with vanilla JS + Vite.
Words are stored in `src/data/hsk1.js` and `src/data/hsk2.js`, exported via `src/data/index.js`.

## Key Architectural Decisions

### localStorage and DEFAULT_WORDS
The app persists the word list in `localStorage` (`hanzi_words`) so users can add custom words.
**Important:** `DEFAULT_WORDS` (from the data files) is always used as the source of truth for built-in words.
In `loadState()`, the pattern is:
- Take all words from `DEFAULT_WORDS` (always up to date)
- Append any user-added custom words from localStorage (words not in DEFAULT_WORDS)
- Save back to localStorage

**Do not revert this to using the saved localStorage words directly.** If you do, any changes made to the data files (new words, corrected HSK levels, updated tips) will be silently ignored for returning users.

### Adding New Words
Add words to `src/data/hsk1.js` or `src/data/hsk2.js`. They will automatically appear for all users on next load.

### Adding New Categories
Categories are hardcoded in two places in `src/main.js` — update both:
1. `buildCatCounts` — the `cats` array
2. `CAT_DEFS` — the array of `{ id, label }` objects

Also add the new `<option>` to the `#f-cat` select in `index.html`.

### HSK Levels
Always look up the correct HSK level on hsk.academy before assigning a level to a word.
Words not in the official HSK list should be assigned a level based on their component words' difficulty.
HSK levels confirmed so far: 旅游/游泳 = 2, 同事/结婚/应该 = 3, 计划 = 4, 家庭 = 5, 双胞胎 = 6.
