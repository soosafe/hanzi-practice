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

### Visual Words Section
The Visuals tab (third nav mode) shows rich character-study cards for selected words.

**Architecture:**
- `src/data/visuals/` — one JS file per word, exported from `index.js`
- `src/visuals.js` — `renderVisuals(area, words)` renders all VISUAL_WORDS cards
- Each visual word must already exist in `hsk1.js` or `hsk2.js` (meaning is pulled from the word list at render time)

**Data file format** (`src/data/visuals/<word>.js`):
```js
export default {
  h: '太好了',            // must match .h in the word list exactly
  chars: [               // one entry per character
    {
      zh: '太',
      story: '大 big person + the red dot',  // brief visual story
      gloss: 'So / Very',                    // one-line meaning
      svg: `<svg viewBox="0 0 90 78" fill="none">...</svg>`  // inline SVG illustration
    },
    // ...
  ],
  tones: [               // one entry per syllable
    {
      zh: '太',
      py: 'tài',
      tone: 4,           // 0 = neutral, 1–4 = tones
      desc: 'sharp drop',
      svg: `<svg viewBox="0 0 54 34">...</svg>`  // tone curve SVG
    },
    // ...
  ],
  mnemonic: 'Sounds like "tie" + "how" + "luh". ...'
}
```

**To add a new visual word:**
1. Create `src/data/visuals/<slug>.js` with the data above
2. Add `import <name> from './<slug>.js'` to `src/data/visuals/index.js`
3. Add `<name>` to the `VISUAL_WORDS` array in `index.js`
4. Make sure the word exists in `hsk1.js` or `hsk2.js`

**SVG guidance for character illustrations (90×78 viewBox):**
- Use stick-figure style: circles for heads, lines for limbs
- Colour-code by tone: tone 4 = `#1a3d6e` (blue), tone 3 = `#256344` (green), tone 2 = `#b83228` (red), neutral = `#8a5e00` (gold)
- Include the semantic radical as a sub-element where it adds meaning

**SVG guidance for tone curves (54×34 viewBox):**
- Tone 1: flat horizontal line
- Tone 2: rising diagonal line with arrow
- Tone 3: dip-then-rise curve with arrow
- Tone 4: falling diagonal line with arrow
- Neutral (0): small dot on a faint midline

**AI prompt template** (use this to generate new visual words):
> Create a visual word card for the Chinese word [HANZI] ([PINYIN], "[MEANING]").
> For each character, write: (1) a short visual story connecting the character's shape to its meaning, (2) a one-line gloss, (3) an SVG stick-figure illustration (90×78 viewBox, fill="none") that makes the meaning memorable.
> For each syllable, provide: tone number, a one-line tone description, and a tone-curve SVG (54×34 viewBox).
> Finally write a mnemonic using quoted English sound-alikes for the pinyin.
> Output as a JS module matching the format in src/data/visuals/tai-hao-le.js.
