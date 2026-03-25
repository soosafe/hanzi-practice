# Hanzi Practice Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Vite-powered vanilla JS web app for practicing Chinese Hanzi characters via Flashcard and Pinyin Quiz modes, deployable to Vercel for free.

**Architecture:** Single-page app with no framework. State lives in JS variables, persisted to localStorage. Pure utility functions handle filtering/scoring (unit-tested with Vitest). DOM rendering is imperative — state changes trigger full re-renders of the main content area.

**Tech Stack:** Vite 5, vanilla JS (ES modules), CSS custom properties, Vitest for unit tests, Vercel for deployment.

**Spec:** `docs/superpowers/specs/2026-03-25-hanzi-website-design.md`

---

## File Map

| File | Responsibility |
|------|----------------|
| `index.html` | App shell: navbar, filter area, main content mount point, modal markup |
| `src/styles/main.css` | All CSS: design tokens, layout, components, dark mode, responsive |
| `src/data/hsk1.js` | Exports `HSK1_WORDS` — 51 HSK 1 words with full metadata |
| `src/data/hsk2.js` | Exports `HSK2_WORDS = []` — empty placeholder |
| `src/data/index.js` | Imports all level files, exports `DEFAULT_WORDS` combined array |
| `src/main.js` | App entry: state, pure utilities, localStorage helpers, all rendering |
| `src/main.test.js` | Vitest unit tests for pure functions |
| `vite.config.js` | Vite config (minimal) |
| `package.json` | Dependencies and scripts |
| `vercel.json` | Vercel deployment config |

---

## Task 1: Scaffold the Vite project

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `index.html`
- Create: `public/illustrations/.gitkeep`
- Create: `src/styles/main.css` (empty placeholder)
- Create: `src/main.js` (empty placeholder)

- [ ] **Step 1: Create package.json**

```json
{
  "name": "hanzi-practice",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "devDependencies": {
    "vite": "^5.4.0",
    "vitest": "^1.6.0"
  }
}
```

- [ ] **Step 2: Create vite.config.js**

```js
import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
  },
})
```

- [ ] **Step 3: Create index.html shell**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="Free Hanzi practice app — flashcards and pinyin quiz for HSK vocabulary" />
  <title>Hanzi Practice</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/src/styles/main.css" />
</head>
<body>

  <!-- Navbar -->
  <nav class="navbar" role="navigation" aria-label="Main navigation">
    <div class="nav-title">汉字 Practice</div>
    <div class="nav-center" id="navModes">
      <button class="btn-mode active" id="btnFlashcard" aria-label="Switch to Flashcard mode">Flashcards</button>
      <button class="btn-mode" id="btnQuiz" aria-label="Switch to Pinyin Quiz mode">Pinyin Quiz</button>
    </div>
    <button class="btn-theme" id="btnTheme" aria-label="Toggle dark mode">🌙</button>
  </nav>

  <div class="container">

    <!-- HSK Level filter (hidden until 2+ levels exist) -->
    <div class="level-tabs hidden" id="levelTabs" aria-label="HSK level filter"></div>

    <!-- Category filter -->
    <div class="cat-tabs" id="catTabs" aria-label="Category filter"></div>

    <!-- Controls row -->
    <div class="controls">
      <button class="btn" id="btnShuffle" aria-label="Shuffle cards">Shuffle</button>
      <button class="btn" id="btnReset" aria-label="Reset known state">Reset</button>
      <button class="btn btn-accent" id="btnAddWord" aria-label="Add a new word">Add Word</button>
      <label class="toggle-label" id="unknownsToggle">
        <input type="checkbox" id="unknownsOnly" aria-label="Show unknowns only" />
        Unknowns only
      </label>
    </div>

    <!-- Progress -->
    <div class="progress-wrap" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" id="progressWrap">
      <div class="progress-bar">
        <div class="progress-fill" id="progressFill" style="width:0%"></div>
      </div>
      <div class="progress-label" id="progressLabel" aria-live="polite"></div>
    </div>

    <!-- Stats -->
    <div class="stats" id="statsBar" aria-live="polite"></div>

    <!-- Main content area -->
    <main id="mainArea"></main>

  </div>

  <!-- Voice info -->
  <div class="container">
    <p class="voice-info" id="voiceInfo" aria-live="polite"></p>
  </div>

  <!-- Add Word Modal -->
  <div class="modal-overlay hidden" id="addWordModal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
    <div class="modal" id="modalPanel">
      <h2 id="modalTitle">Add Word</h2>

      <div class="form-group">
        <label for="f-hanzi">Hanzi</label>
        <input type="text" id="f-hanzi" placeholder="e.g. 你好" autocomplete="off" />
        <p class="field-error hidden" id="err-hanzi"></p>
      </div>
      <div class="form-group">
        <label for="f-pinyin">Pinyin</label>
        <input type="text" id="f-pinyin" placeholder="e.g. nǐ hǎo" autocomplete="off" />
        <p class="field-error hidden" id="err-pinyin"></p>
      </div>
      <div class="form-group">
        <label for="f-meaning">Meaning</label>
        <input type="text" id="f-meaning" placeholder="e.g. Hello" autocomplete="off" />
        <p class="field-error hidden" id="err-meaning"></p>
      </div>
      <div class="form-group">
        <label for="f-cat">Category</label>
        <select id="f-cat">
          <option value="words">Words</option>
          <option value="time">Time</option>
          <option value="numbers">Numbers</option>
          <option value="family">Family</option>
        </select>
      </div>
      <div class="form-group">
        <label for="f-tip">Hanzi Tip <span class="optional">(optional)</span></label>
        <textarea id="f-tip" placeholder="Visual memory for the character shape" rows="2"></textarea>
      </div>
      <div class="form-group">
        <label for="f-wtip">Word Tip <span class="optional">(optional)</span></label>
        <textarea id="f-wtip" placeholder="Sound or meaning hook to remember the word" rows="2"></textarea>
      </div>

      <div class="modal-btns">
        <button class="btn" id="btnModalCancel" aria-label="Cancel and close form">Cancel</button>
        <button class="btn btn-accent" id="btnModalSubmit" aria-label="Submit new word">Add Word</button>
      </div>
    </div>
  </div>

  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

- [ ] **Step 4: Create stub files**

Create `src/styles/main.css` — empty file for now.
Create `src/main.js` — empty file for now.
Create `public/illustrations/.gitkeep` — empty file.

- [ ] **Step 5: Create .gitignore**

```
node_modules/
dist/
.env
.DS_Store
```

- [ ] **Step 6: Install dependencies**

```bash
npm install
```

Expected: `node_modules/` created, no errors.

- [ ] **Step 7: Verify dev server starts**

```bash
npm run dev
```

Expected: Vite outputs `Local: http://localhost:5173/`. Open in browser — blank page with no console errors.

- [ ] **Step 8: Commit**

```bash
git add .gitignore package.json vite.config.js index.html src/ public/
git commit -m "feat: scaffold Vite project with app shell HTML"
```

---

## Task 2: Word data layer

**Files:**
- Create: `src/data/hsk1.js`
- Create: `src/data/hsk2.js`
- Create: `src/data/index.js`
- Create: `src/main.test.js` (first tests)

- [ ] **Step 1: Create src/data/hsk1.js**

```js
export const HSK1_WORDS = [
  { h: '太好了', p: 'tài hǎo le', m: 'Great!', cat: 'words', level: 1,
    tip: '大 (big) with an extra dot on top — so big it got an exclamation dot!',
    wtip: '"Tai" literally means TOO MUCH. So 太好了 = TOO good. It went beyond good!' },
  { h: '去', p: 'qù', m: 'To go', cat: 'words', level: 1,
    tip: 'A person with a hat walking away, leaving an X mark behind them.',
    wtip: '"Qu" sounds like a cue ball being hit — cue to go, you are off!' },
  { h: '几月', p: 'jǐ yuè', m: 'What month', cat: 'time', level: 1,
    tip: '几 looks like a small folding chair. 月 is a crescent moon on its side.',
    wtip: '"Ji" means HOW MANY. So 几月 = how many moons? Which month?' },
  { h: '今天几号？', p: 'Jīntiān jǐ hào?', m: 'What date is today?', cat: 'time', level: 1,
    tip: '今 is an umbrella sheltering a person — protected in the present moment.',
    wtip: '"Jin" = now/today. "Ji hao" = which number. Today which number on the calendar?' },
  { h: '生日', p: 'shēngrì', m: 'Birthday', cat: 'words', level: 1,
    tip: '生 is a plant shooting up from the ground — something being born.',
    wtip: '"Sheng" means to be BORN. "Ri" means day. Born-day = birthday!' },
  { h: '月', p: 'yuè', m: 'Month', cat: 'time', level: 1,
    tip: 'A crescent moon lying on its side — that is exactly what this character is.',
    wtip: 'The moon completes one cycle per month. Moon = month. Same word!' },
  { h: '号', p: 'hào', m: 'Date of month', cat: 'time', level: 1,
    tip: '口 (a mouth) on top calling out a number — announcing the date!',
    wtip: '"Hao" = number or order. The 号 is just which number slot in the month.' },
  { h: '今天', p: 'jīntiān', m: 'Today', cat: 'time', level: 1,
    tip: '今 is an umbrella over a person. 天 is a big person with a line above — sky.',
    wtip: '"Jin" = now. Hear that J sound at the start? J for Just now, Just today.' },
  { h: '点', p: 'diǎn', m: "O'clock", cat: 'time', level: 1,
    tip: 'Four fire dots at the bottom like a stove burning at a precise time.',
    wtip: '"Dian" = a dot, a point. Three o clock = 3点 = 3 dots on the clock. Exact point!' },
  { h: '半', p: 'bàn', m: 'Half', cat: 'time', level: 1,
    tip: 'A vertical pole with a horizontal line slicing it exactly in the middle.',
    wtip: '"Ban" sounds like "bun" cut in half. 3点半 = 3:30 = the hour cut in half.' },
  { h: '分', p: 'fēn', m: 'Minute', cat: 'time', level: 1,
    tip: '八 (two things splitting apart) sitting above 刀 (a knife). Time being cut up.',
    wtip: '"Fen" = divide or share. Minutes divide the hour into tiny shares.' },
  { h: '什么', p: 'shénme', m: 'What', cat: 'words', level: 1,
    tip: '亻 a person on the left holding something and shrugging — what is this?',
    wtip: '"Shen-me" — when you hear it, someone is confused. WHAT? Then me?' },
  { h: '喜欢', p: 'xǐhuan', m: 'Like', cat: 'words', level: 1,
    tip: '喜 has two 口 mouths stacked on top of each other — double smiling.',
    wtip: '"Xi" = joy. "Huan" = pleased. Joy-pleased = like. Two happy feelings combined!' },
  { h: '星期', p: 'xīngqī', m: 'Week', cat: 'time', level: 1,
    tip: '星 has a sun 日 on top with a sprouting plant 生 below — stars growing.',
    wtip: '"Xing" = star. Ancient Chinese named days after stars and planets. Stars = week.' },
  { h: '上午', p: 'shàngwǔ', m: 'Late morning (AM)', cat: 'time', level: 1,
    tip: '上 is a short line sitting ABOVE a longer line — above, going up.',
    wtip: '"Shang" literally means UP. Morning = you are going UP toward noon. Energy rising!' },
  { h: '中午', p: 'zhōngwǔ', m: 'Midday', cat: 'time', level: 1,
    tip: '中 is a vertical line piercing straight through the center of a box. Bullseye!',
    wtip: '"Zhong" literally means MIDDLE. Midday = the middle of the day. Dead center!' },
  { h: '下午', p: 'xiàwǔ', m: 'Afternoon', cat: 'time', level: 1,
    tip: '下 is a short line hanging BELOW a longer line — below, going down.',
    wtip: '"Xia" literally means DOWN. Afternoon = you are going DOWN from noon. Energy dropping!' },
  { h: '早上', p: 'zǎoshàng', m: 'Early morning', cat: 'time', level: 1,
    tip: '早 is a sun 日 rising above a cross 十 — sun just cleared the horizon.',
    wtip: '"Zao" sounds like "ow!" — that is the sound you make when the alarm wakes you up early!' },
  { h: '晚上', p: 'wǎnshàng', m: 'Evening', cat: 'time', level: 1,
    tip: '晚 has 日 (sun) on the left with lots of extra strokes — a tired complicated sun.',
    wtip: '"Wan" sounds like "waning" — the moon waning, daylight waning. Everything fading out.' },
  { h: '一', p: 'yī', m: 'One', cat: 'numbers', level: 1,
    tip: 'One single horizontal stroke. That is it.',
    wtip: '"Yi" — easy. One is always the beginning. Just one stroke, just one!' },
  { h: '二', p: 'èr', m: 'Two', cat: 'numbers', level: 1,
    tip: 'Two horizontal strokes stacked. Count them: one, two.',
    wtip: '"Er" — sounds like "er" when you pause. Two options, two sides, pause between them.' },
  { h: '三', p: 'sān', m: 'Three', cat: 'numbers', level: 1,
    tip: 'Three horizontal strokes. Count them: one, two, three.',
    wtip: '"San" — like "sun" rising three times. Three suns above the horizon!' },
  { h: '四', p: 'sì', m: 'Four', cat: 'numbers', level: 1,
    tip: 'A box with two legs dangling underneath — like a table seen from the front.',
    wtip: '"Si" sounds like the Chinese word for DEATH. That is why 4 is unlucky — buildings skip floor 4!' },
  { h: '五', p: 'wǔ', m: 'Five', cat: 'numbers', level: 1,
    tip: 'Two horizontal layers connected by a vertical stroke and a hook — like a hand.',
    wtip: '"Wu" — one full hand. Hold up 5 fingers and say woo! Five fingers, wooo!' },
  { h: '六', p: 'liù', m: 'Six', cat: 'numbers', level: 1,
    tip: 'A dot on top, then two legs spreading out — a person raising arms in celebration.',
    wtip: '"Liu" sounds like "loo!" — you shout when something lucky happens! 6 is the lucky number!' },
  { h: '七', p: 'qī', m: 'Seven', cat: 'numbers', level: 1,
    tip: 'A horizontal stroke with a hook curling down at the right — like a backwards 7.',
    wtip: '"Qi" — qi is life energy. Seven days in a week, your energy flows in weekly cycles!' },
  { h: '八', p: 'bā', m: 'Eight', cat: 'numbers', level: 1,
    tip: 'Two strokes leaning away from each other — like open arms embracing good fortune.',
    wtip: '"Ba!" — shout it with confidence. 8 is the LUCKIEST number in China. People pay millions for phone numbers with 8!' },
  { h: '九', p: 'jiǔ', m: 'Nine', cat: 'numbers', level: 1,
    tip: 'A curved stroke that swoops and hooks at the bottom — like a bent arm reaching.',
    wtip: '"Jiu" also means LONG TIME in Chinese. Nine feels like almost forever — you are almost at ten!' },
  { h: '十', p: 'shí', m: 'Ten', cat: 'numbers', level: 1,
    tip: 'A perfect plus sign — vertical and horizontal strokes crossing in the center.',
    wtip: '"Shi" — ten is completion. All fingers counted. A perfect score in Chinese is 十分!' },
  { h: '明天', p: 'míngtiān', m: 'Tomorrow', cat: 'time', level: 1,
    tip: '明 is 日 sun + 月 moon side by side — both lights together make brightness.',
    wtip: '"Ming" means BRIGHT. Tomorrow is the bright day ahead — not arrived yet, but shining!' },
  { h: '昨天', p: 'zuótiān', m: 'Yesterday', cat: 'time', level: 1,
    tip: '昨 is 日 sun on the left but leaning backwards — the sun that already passed.',
    wtip: '"Zuo" — so yesterday! It is GONE. You cannot change it. Zuo = back, behind you.' },
  { h: '现在', p: 'xiànzài', m: 'Now', cat: 'time', level: 1,
    tip: '现 is a king 王 next to an eye 见 — the king appearing before your eyes.',
    wtip: '"Xian" = appear. "Zai" = exist here. Something appearing right where you are = NOW!' },
  { h: '年', p: 'nián', m: 'Year', cat: 'time', level: 1,
    tip: 'A person bent forward carrying a heavy load of grain on their back.',
    wtip: '"Nian" is also in Happy New Year — 新年快乐! Every New Year = one more 年.' },
  { h: '朋友', p: 'péngyou', m: 'Friend', cat: 'words', level: 1,
    tip: '朋 is two 月 moon shapes placed side by side — two moons always together.',
    wtip: '"Peng" sounds like PENG — a fist bump sound. Your friend peng-es you!' },
  { h: '家', p: 'jiā', m: 'Home / family', cat: 'words', level: 1,
    tip: 'A roof on top, and a pig underneath it — ancient homes always had a pig inside.',
    wtip: '"Jia" — sounds like "yeah!" When you get home you say YEAH! Home sweet home!' },
  { h: '说', p: 'shuō', m: 'To speak', cat: 'words', level: 1,
    tip: '讠 the speech radical on the left — two dots like a mouth opening. Always means talking.',
    wtip: '"Shuo" — sounds like SHOW. When you speak, you SHOW what is in your mind!' },
  { h: '做', p: 'zuò', m: 'To do', cat: 'words', level: 1,
    tip: '亻 the person radical on the left — whenever you see this, a person is doing something.',
    wtip: '"Zuo" sounds like ZOO. At the zoo you DO lots of things — you are doing, doing, doing!' },
  { h: '来', p: 'lái', m: 'To come', cat: 'words', level: 1,
    tip: 'Like a tree or cross with extra strokes reaching outward — branches growing toward you.',
    wtip: '"Lai" sounds like LIE — come lie down here! COME over here and lie down!' },
  { h: '和', p: 'hé', m: 'And', cat: 'words', level: 1,
    tip: '禾 a grain stalk on the left plus 口 a mouth on the right — sharing food together.',
    wtip: '"He" sounds like HEY — hey you AND me together! And connects things like hey connects people.' },
  { h: '也', p: 'yě', m: 'Also', cat: 'words', level: 1,
    tip: 'A single smooth curving stroke — like an echo or a tail following the main thing.',
    wtip: '"Ye" sounds like YEAH — yeah, me too! Yeah = also = me also! Easiest one!' },
  { h: '都', p: 'dōu', m: 'All / both', cat: 'words', level: 1,
    tip: '者 (gatherer person) on the left, 阝 (city/place) on the right — all people in the city.',
    wtip: '"Dou" sounds like DOE — a deer. ALL the deer in the forest. Every single one, no exceptions!' },
  { h: '这个', p: 'zhège', m: 'This one', cat: 'words', level: 1,
    tip: '这 has 辶 the movement radical at the bottom — moving right HERE toward you.',
    wtip: '"Zhe" = this (close). Think of THESE — THIS and THESE both start with TH, both are close to you!' },
  { h: '那个', p: 'nàge', m: 'That one', cat: 'words', level: 1,
    tip: '那 has 阝 on the right — a city far away on the right side, over there.',
    wtip: '"Na" sounds like NAH — nah, not this one, THAT one over there. Nah = pointing away!' },
  { h: '这些', p: 'zhèxiē', m: 'These', cat: 'words', level: 1,
    tip: '些 has two small 口 mouths at the bottom — many little things grouped close.',
    wtip: '"Zhe" = close + "xie" = some/plural. THESE = this group close to you. Close + many!' },
  { h: '那些', p: 'nàxiē', m: 'Those', cat: 'words', level: 1,
    tip: 'Same 些 many mouths, but with 那 far-away on the left — many things far away.',
    wtip: '"Na" = far + "xie" = plural. THOSE = that group over there. Far + many!' },
  { h: '会', p: 'huì', m: 'Can / able to', cat: 'words', level: 1,
    tip: '人 a person on top, cloud-like strokes below — a skilled person sheltered under their knowledge.',
    wtip: '"Hui" sounds like HEY I — hey I can do it! The hui is the sound of confidence!' },
  { h: '哥哥', p: 'gēge', m: 'Older brother', cat: 'family', level: 1,
    tip: 'Two 可 shapes stacked — repeated character shows closeness, like always being doubled up.',
    wtip: '"Ge-ge" — he is the GUY who came before you. Gege = the guy guy. Your main guy!' },
  { h: '姐姐', p: 'jiějie', m: 'Older sister', cat: 'family', level: 1,
    tip: '女 (woman) on the left plus 且 (layered, established) — a woman who is established.',
    wtip: '"Jie-jie" — she always says JEH JEH (yeah yeah) because she already knows everything!' },
  { h: '弟弟', p: 'dìdi', m: 'Younger brother', cat: 'family', level: 1,
    tip: '弓 a bow shape at the top — a young one still being shaped and bent like a bow.',
    wtip: '"Di-di" — dee dee like a little kid calling your name! Dee dee dee, that is little bro!' },
  { h: '妹妹', p: 'mèimei', m: 'Younger sister', cat: 'family', level: 1,
    tip: '女 (woman) on the left plus 未 (not yet) — a woman who has not yet fully grown.',
    wtip: '"Mei-mei" — MAY I? MAY I? Little sis always asking permission. May-may!' },
  { h: '爷爷', p: 'yéye', m: 'Grandfather paternal', cat: 'family', level: 1,
    tip: '父 the father radical on top — grandfather is the father sitting above all others.',
    wtip: '"Ye-ye" — he always says YEAH YEAH to everything you ask. Yes grandson, yes!' },
  { h: '奶奶', p: 'nǎinai', m: 'Grandmother paternal', cat: 'family', level: 1,
    tip: '女 (woman) plus 乃 an ancient symbol for nourishment and milk — the woman who feeds.',
    wtip: '"Nai-nai" — NYE NYE like waving bye-bye. Grandma always waves bye-bye at the door!' },
]
```

- [ ] **Step 2: Create src/data/hsk2.js**

```js
export const HSK2_WORDS = []
```

- [ ] **Step 3: Create src/data/index.js**

```js
import { HSK1_WORDS } from './hsk1.js'
import { HSK2_WORDS } from './hsk2.js'

export const DEFAULT_WORDS = [
  ...HSK1_WORDS,
  ...HSK2_WORDS,
]
```

- [ ] **Step 4: Write data integrity tests**

Create `src/main.test.js`:

```js
import { describe, it, expect } from 'vitest'
import { DEFAULT_WORDS } from './data/index.js'
import { HSK1_WORDS } from './data/hsk1.js'

describe('Word data integrity', () => {
  it('DEFAULT_WORDS has 51 words', () => {
    expect(DEFAULT_WORDS).toHaveLength(51)
  })

  it('every word has all required fields', () => {
    for (const w of DEFAULT_WORDS) {
      expect(w).toHaveProperty('h')
      expect(w).toHaveProperty('p')
      expect(w).toHaveProperty('m')
      expect(w).toHaveProperty('cat')
      expect(w).toHaveProperty('level')
      expect(w).toHaveProperty('tip')
      expect(w).toHaveProperty('wtip')
    }
  })

  it('all HSK1 words have level 1', () => {
    expect(HSK1_WORDS.every(w => w.level === 1)).toBe(true)
  })

  it('all cat values are valid', () => {
    const valid = new Set(['words', 'time', 'numbers', 'family'])
    expect(DEFAULT_WORDS.every(w => valid.has(w.cat))).toBe(true)
  })

  it('no duplicate Hanzi in default list', () => {
    const hanziList = DEFAULT_WORDS.map(w => w.h)
    const unique = new Set(hanziList)
    expect(unique.size).toBe(hanziList.length)
  })
})
```

- [ ] **Step 5: Run tests — expect them to pass**

```bash
npm test
```

Expected: All 5 data integrity tests PASS. If any fail, fix the data before continuing.

- [ ] **Step 6: Verify test run is clean**

```bash
npm test
```

Expected: All 5 tests PASS.

- [ ] **Step 7: Commit**

```bash
git add src/data/ src/main.test.js
git commit -m "feat: add HSK1 word data and data integrity tests"
```

---

## Task 3: Pure utility functions

**Files:**
- Modify: `src/main.js` (add pure functions only — no DOM yet)
- Modify: `src/main.test.js` (add tests for each function)

These functions take plain data and return plain data — no DOM, no side effects. They are the testable core of the app.

- [ ] **Step 1: Write failing tests for pure utilities**

Add to `src/main.test.js`:

```js
import {
  normalizePinyin,
  getAvailableLevels,
  getFilteredDeck,
  buildCatCounts,
  getStats,
} from './main.js'

describe('normalizePinyin', () => {
  it('strips tone marks', () => {
    expect(normalizePinyin('jīntiān')).toBe('jintian')
  })

  it('strips tone marks from full pinyin', () => {
    expect(normalizePinyin('tài hǎo le')).toBe('tai hao le')
  })

  it('lowercases input', () => {
    expect(normalizePinyin('NǏ HǍO')).toBe('ni hao')
  })

  it('trims whitespace', () => {
    expect(normalizePinyin('  nǐ  ')).toBe('ni')
  })

  it('allows match without tone marks', () => {
    expect(normalizePinyin('jintian')).toBe(normalizePinyin('jīntiān'))
  })
})

describe('getAvailableLevels', () => {
  it('returns empty array for empty word list', () => {
    expect(getAvailableLevels([])).toEqual([])
  })

  it('returns [1] when only HSK1 words exist', () => {
    const words = [{ level: 1 }, { level: 1 }]
    expect(getAvailableLevels(words)).toEqual([1])
  })

  it('returns sorted unique levels', () => {
    const words = [{ level: 2 }, { level: 1 }, { level: 2 }, { level: 3 }]
    expect(getAvailableLevels(words)).toEqual([1, 2, 3])
  })
})

describe('getFilteredDeck', () => {
  const words = [
    { h: 'A', cat: 'time', level: 1 },
    { h: 'B', cat: 'words', level: 1 },
    { h: 'C', cat: 'time', level: 2 },
    { h: 'D', cat: 'numbers', level: 1 },
  ]
  const knownSet = new Set(['A'])

  it('returns all words when cat=all and level=all', () => {
    expect(getFilteredDeck(words, 'all', 'all', false, knownSet)).toHaveLength(4)
  })

  it('filters by category', () => {
    const deck = getFilteredDeck(words, 'time', 'all', false, knownSet)
    expect(deck).toHaveLength(2)
    expect(deck.every(w => w.cat === 'time')).toBe(true)
  })

  it('filters by level', () => {
    const deck = getFilteredDeck(words, 'all', 1, false, knownSet)
    expect(deck).toHaveLength(3)
    expect(deck.every(w => w.level === 1)).toBe(true)
  })

  it('filters out known words when unknownsOnly=true', () => {
    const deck = getFilteredDeck(words, 'all', 'all', true, knownSet)
    expect(deck).toHaveLength(3)
    expect(deck.find(w => w.h === 'A')).toBeUndefined()
  })

  it('combines category and level filters', () => {
    const deck = getFilteredDeck(words, 'time', 1, false, knownSet)
    expect(deck).toHaveLength(1)
    expect(deck[0].h).toBe('A')
  })
})

describe('buildCatCounts', () => {
  const words = [
    { cat: 'time', level: 1 },
    { cat: 'time', level: 1 },
    { cat: 'words', level: 1 },
    { cat: 'words', level: 2 },
    { cat: 'numbers', level: 1 },
  ]

  it('counts all words when activeLevel=all', () => {
    const counts = buildCatCounts(words, 'all')
    expect(counts.all).toBe(5)
    expect(counts.time).toBe(2)
    expect(counts.words).toBe(2)
    expect(counts.numbers).toBe(1)
    expect(counts.family).toBe(0)
  })

  it('counts only level-filtered words when activeLevel is set', () => {
    const counts = buildCatCounts(words, 1)
    expect(counts.all).toBe(4)
    expect(counts.words).toBe(1)
  })
})

describe('getStats', () => {
  const deck = [{ h: 'A' }, { h: 'B' }, { h: 'C' }]
  const knownSet = new Set(['A', 'B'])

  it('counts known words within deck', () => {
    const stats = getStats(deck, knownSet)
    expect(stats.known).toBe(2)
    expect(stats.stillLearning).toBe(1)
  })

  it('returns zero counts for empty deck', () => {
    const stats = getStats([], new Set())
    expect(stats.known).toBe(0)
    expect(stats.stillLearning).toBe(0)
  })
})
```

- [ ] **Step 2: Run tests — verify they fail**

```bash
npm test
```

Expected: FAIL — functions not exported from main.js yet.

- [ ] **Step 3: Implement pure utility functions in src/main.js**

```js
// ─── Pure utility functions ───────────────────────────────────────────────────

export function normalizePinyin(s) {
  return s.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip tone diacritics
    .replace(/[^\w\s]/g, '')         // strip punctuation (ASCII-only, intentional)
    .trim()
}

export function getAvailableLevels(words) {
  return [...new Set(words.map(w => w.level))].sort((a, b) => a - b)
}

export function getFilteredDeck(words, cat, level, unknownsOnly, knownSet) {
  return words.filter(w => {
    if (cat !== 'all' && w.cat !== cat) return false
    if (level !== 'all' && w.level !== level) return false
    if (unknownsOnly && knownSet.has(w.h)) return false
    return true
  })
}

export function buildCatCounts(words, activeLevel) {
  const filtered = activeLevel === 'all' ? words : words.filter(w => w.level === activeLevel)
  const cats = ['time', 'numbers', 'words', 'family']
  const counts = { all: filtered.length }
  for (const cat of cats) {
    counts[cat] = filtered.filter(w => w.cat === cat).length
  }
  return counts
}

export function getStats(deck, knownSet) {
  const known = deck.filter(w => knownSet.has(w.h)).length
  return { known, stillLearning: deck.length - known }
}
```

- [ ] **Step 4: Run tests — verify they pass**

```bash
npm test
```

Expected: All tests PASS (data integrity + utility function tests).

- [ ] **Step 5: Commit**

```bash
git add src/main.js src/main.test.js
git commit -m "feat: add pure utility functions with full test coverage"
```

---

## Task 4: CSS design system

**Files:**
- Modify: `src/styles/main.css`

This task has no unit tests — verify visually after Task 5 (global UI).

- [ ] **Step 1: Write the full CSS**

Replace `src/styles/main.css` with:

```css
/* ── Fonts ─────────────────────────────────────────────────────────────────── */
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&display=swap');

/* ── Tokens ─────────────────────────────────────────────────────────────────── */
:root {
  --red:     #E5484D;
  --green:   #30A46C;
  --blue:    #0090FF;

  --bg:      #FAFAF8;
  --surface: #F5F3F0;
  --border:  #E7E4DF;
  --text:    #1C1917;
  --text-2:  #78716C;

  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-pill: 20px;

  --max-w: 600px;
  --font-ui: system-ui, -apple-system, sans-serif;
  --font-cjk: 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', 'SimHei', sans-serif;
}

[data-theme="dark"] {
  --bg:      #1C1917;
  --surface: #292524;
  --border:  #44403C;
  --text:    #F5F5F4;
  --text-2:  #A8A29E;
}

/* ── Reset ──────────────────────────────────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: var(--font-ui);
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
  transition: background 0.2s, color 0.2s;
}

/* ── Navbar ─────────────────────────────────────────────────────────────────── */
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
  max-width: var(--max-w);
  margin: 0 auto;
}

.nav-title {
  font-size: 16px;
  font-weight: 600;
  flex-shrink: 0;
  font-family: var(--font-cjk);
}

.nav-center {
  display: flex;
  gap: 8px;
}

.btn-mode {
  padding: 6px 14px;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text-2);
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 13px;
  font-family: var(--font-ui);
  transition: border-color 0.15s, color 0.15s;
}
.btn-mode.active {
  border-color: var(--red);
  color: var(--red);
  font-weight: 500;
}
.btn-mode:hover:not(.active) {
  border-color: var(--text-2);
  color: var(--text);
}

.btn-theme {
  background: transparent;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 16px;
  padding: 5px 9px;
  line-height: 1;
  transition: border-color 0.15s;
}
.btn-theme:hover { border-color: var(--text-2); }

/* ── Container ──────────────────────────────────────────────────────────────── */
.container {
  max-width: var(--max-w);
  margin: 0 auto;
  padding: 16px;
}

/* ── Filter tabs (shared by level + category) ───────────────────────────────── */
.level-tabs,
.cat-tabs {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.tab {
  padding: 5px 12px;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text-2);
  border-radius: var(--radius-pill);
  cursor: pointer;
  font-size: 12px;
  font-family: var(--font-ui);
  transition: border-color 0.15s, color 0.15s;
  white-space: nowrap;
}
.tab.active {
  border-color: var(--red);
  color: var(--red);
  font-weight: 500;
}
.tab:hover:not(.active) {
  border-color: var(--text-2);
  color: var(--text);
}

.tab-count {
  opacity: 0.6;
  font-size: 11px;
  margin-left: 3px;
}

/* ── Controls row ───────────────────────────────────────────────────────────── */
.controls {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

/* ── Buttons ────────────────────────────────────────────────────────────────── */
.btn {
  padding: 7px 16px;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text);
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 13px;
  font-family: var(--font-ui);
  transition: background 0.15s, border-color 0.15s;
}
.btn:hover {
  background: var(--surface);
  border-color: var(--text-2);
}

.btn-accent  { border-color: var(--red); color: var(--red); }
.btn-accent:hover { background: var(--red); color: white; }

.btn-green   { border-color: var(--green); color: var(--green); }
.btn-green:hover { background: var(--green); color: white; }

.btn-red     { border-color: var(--red); color: var(--red); }
.btn-red:hover { background: var(--red); color: white; }

.btn-blue    { border-color: var(--blue); color: var(--blue); }
.btn-blue:hover { background: var(--blue); color: white; }

/* ── Toggle ─────────────────────────────────────────────────────────────────── */
.toggle-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--text-2);
  cursor: pointer;
  margin-left: auto;
}
.toggle-label input[type="checkbox"] { accent-color: var(--red); cursor: pointer; }

/* ── Progress ───────────────────────────────────────────────────────────────── */
.progress-wrap { margin-bottom: 10px; }

.progress-bar {
  height: 4px;
  background: var(--border);
  border-radius: 2px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: var(--red);
  border-radius: 2px;
  transition: width 0.3s ease;
}
.progress-label {
  font-size: 12px;
  color: var(--text-2);
  margin-top: 4px;
}

/* ── Stats ──────────────────────────────────────────────────────────────────── */
.stats {
  font-size: 13px;
  color: var(--text-2);
  margin-bottom: 16px;
  min-height: 18px;
}

/* ── Card ───────────────────────────────────────────────────────────────────── */
.card-wrap { position: relative; }

.card {
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 28px 24px 24px;
  background: var(--bg);
  text-align: center;
}

.hanzi {
  font-family: var(--font-cjk);
  font-size: 64px;
  line-height: 1.2;
  margin-bottom: 16px;
  color: var(--text);
}

.card-meaning {
  font-size: 14px;
  color: var(--text-2);
  margin-bottom: 14px;
}

.pinyin-display {
  font-size: 22px;
  color: var(--red);
  font-weight: 500;
  margin-bottom: 6px;
}

.meaning-display {
  font-size: 16px;
  color: var(--text);
  margin-bottom: 16px;
}

/* ── Tip boxes ──────────────────────────────────────────────────────────────── */
.tips {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  text-align: left;
}

.tip-box {
  flex: 1;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 12px;
  border-top-width: 2px;
}
.tip-box.hanzi-tip { border-top-color: var(--red); }
.tip-box.word-tip  { border-top-color: var(--blue); }

.tip-label {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 6px;
}
.hanzi-tip .tip-label { color: var(--red); }
.word-tip  .tip-label { color: var(--blue); }

.tip-text {
  font-size: 13px;
  color: var(--text-2);
  line-height: 1.5;
}

/* ── Button rows ────────────────────────────────────────────────────────────── */
.btn-row {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 18px;
  flex-wrap: wrap;
}

/* ── Listen button ──────────────────────────────────────────────────────────── */
.btn-listen {
  padding: 6px 14px;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text-2);
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 13px;
  font-family: var(--font-ui);
  transition: border-color 0.15s, color 0.15s;
  margin-bottom: 16px;
}
.btn-listen:hover {
  border-color: var(--text-2);
  color: var(--text);
}

/* ── Remove button ──────────────────────────────────────────────────────────── */
.btn-remove {
  position: absolute;
  top: 10px;
  right: 12px;
  background: transparent;
  border: none;
  color: var(--text-2);
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
  transition: color 0.15s;
}
.btn-remove:hover { color: var(--red); }

/* ── Quiz input ─────────────────────────────────────────────────────────────── */
.quiz-input {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  font-size: 16px;
  font-family: var(--font-ui);
  background: var(--bg);
  color: var(--text);
  outline: none;
  transition: border-color 0.2s, background 0.2s;
  margin-bottom: 10px;
}
.quiz-input:focus  { border-color: var(--blue); }
.quiz-input.correct { border-color: var(--green); background: color-mix(in srgb, var(--green) 6%, var(--bg)); }
.quiz-input.wrong   { border-color: var(--red);   background: color-mix(in srgb, var(--red)   6%, var(--bg)); }

/* ── Quiz feedback ──────────────────────────────────────────────────────────── */
.quiz-feedback {
  font-size: 15px;
  font-weight: 500;
  min-height: 22px;
  margin-bottom: 8px;
}
.quiz-feedback.correct { color: var(--green); }
.quiz-feedback.wrong   { color: var(--red); }

/* ── Completion screen ──────────────────────────────────────────────────────── */
.completion {
  text-align: center;
  padding: 40px 16px;
}
.completion-emoji { font-size: 52px; margin-bottom: 16px; }
.completion h2 { font-size: 22px; margin-bottom: 14px; }
.completion-stats {
  font-size: 15px;
  color: var(--text-2);
  line-height: 2;
  margin-bottom: 28px;
}
.completion-stats strong { color: var(--text); }

/* ── Results screen ─────────────────────────────────────────────────────────── */
.results { text-align: center; padding: 24px 0; }
.results-emoji { font-size: 52px; margin-bottom: 12px; }
.results h2 { font-size: 20px; margin-bottom: 8px; }
.results-score { font-size: 14px; color: var(--text-2); margin-bottom: 24px; }

.wrong-list { text-align: left; margin-bottom: 24px; }
.wrong-list h3 { font-size: 13px; font-weight: 600; color: var(--text-2); margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.05em; }

.wrong-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid var(--border);
}
.wrong-item:last-child { border-bottom: none; }
.wrong-hanzi { font-family: var(--font-cjk); font-size: 30px; min-width: 40px; }
.wrong-details { flex: 1; }
.wrong-pinyin  { color: var(--red); font-size: 14px; font-weight: 500; }
.wrong-meaning { font-size: 13px; color: var(--text-2); }
.btn-play {
  background: transparent;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 5px 10px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.15s;
  color: var(--text);
}
.btn-play:hover { background: var(--surface); }

/* ── Voice info ─────────────────────────────────────────────────────────────── */
.voice-info {
  font-size: 11px;
  color: var(--text-2);
  opacity: 0.7;
  margin-top: 8px;
}

/* ── Modal ──────────────────────────────────────────────────────────────────── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 16px;
}

.modal {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 24px;
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal h2 { font-size: 18px; margin-bottom: 20px; }

.form-group { margin-bottom: 14px; }

.form-group label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-2);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 5px;
}

.optional {
  font-weight: 400;
  text-transform: none;
  letter-spacing: 0;
  font-size: 11px;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 9px 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-family: var(--font-ui);
  background: var(--bg);
  color: var(--text);
  outline: none;
  transition: border-color 0.2s;
}
.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus { border-color: var(--blue); }
.form-group textarea { resize: vertical; min-height: 56px; }

.field-error {
  font-size: 12px;
  color: var(--red);
  margin-top: 4px;
}

.modal-btns {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
}

/* ── Utility ────────────────────────────────────────────────────────────────── */
.hidden { display: none !important; }

/* ── Responsive ─────────────────────────────────────────────────────────────── */
@media (max-width: 420px) {
  .hanzi { font-size: 52px; }
  .tips { flex-direction: column; }
  .btn-row { flex-direction: column; align-items: stretch; }
  .btn-row .btn { text-align: center; }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/styles/main.css
git commit -m "feat: add full CSS design system with light/dark mode tokens"
```

---

## Task 5: App state, storage helpers, and global UI

**Files:**
- Modify: `src/main.js` (add state, storage, init, navbar, tabs, controls, progress, stats, theme)

- [ ] **Step 1: Add state, storage, and init to main.js**

Append to `src/main.js` after the pure functions:

```js
// ─── State ────────────────────────────────────────────────────────────────────

import { DEFAULT_WORDS } from './data/index.js'

let WORDS = []
let knownSet = new Set()
let mode = 'flashcard'
let activeCat = 'all'
let activeLevel = 'all'
let deck = []
let deckIndex = 0
let revealed = false
let quizAnswered = false
let quizLastCorrect = false
let lastInput = ''
let quizCorrectCount = 0
let quizWrongCount = 0
let wrongWords = []
let selectedVoice = null

// ─── Storage ──────────────────────────────────────────────────────────────────

function loadState() {
  try {
    const savedWords = localStorage.getItem('hanzi_words')
    WORDS = savedWords ? JSON.parse(savedWords) : [...DEFAULT_WORDS]
    const savedKnown = localStorage.getItem('hanzi_known')
    if (savedKnown) knownSet = new Set(JSON.parse(savedKnown))
  } catch {
    WORDS = [...DEFAULT_WORDS]
  }
}

function saveWords() {
  localStorage.setItem('hanzi_words', JSON.stringify(WORDS))
}

function saveKnown() {
  localStorage.setItem('hanzi_known', JSON.stringify([...knownSet]))
}

function saveTheme(theme) {
  localStorage.setItem('hanzi_theme', theme)
}

// ─── Theme ────────────────────────────────────────────────────────────────────

function initTheme() {
  const saved = localStorage.getItem('hanzi_theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const theme = saved || (prefersDark ? 'dark' : 'light')
  applyTheme(theme)
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme)
  const btn = document.getElementById('btnTheme')
  if (btn) {
    btn.textContent = theme === 'dark' ? '☀️' : '🌙'
    btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode')
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light'
  const next = current === 'dark' ? 'light' : 'dark'
  applyTheme(next)
  saveTheme(next)
}

// ─── Audio ────────────────────────────────────────────────────────────────────

function initVoice() {
  const tryFind = () => {
    const voices = speechSynthesis.getVoices()
    if (!voices.length) return
    const preferred = ['Tingting', 'Meijia', 'Xiaoxiao', '普通话']
    let found = null
    for (const name of preferred) {
      found = voices.find(v => v.name.includes(name) && v.lang.startsWith('zh'))
      if (found) break
    }
    if (!found) found = voices.find(v => v.lang === 'zh-CN')
    if (!found) found = voices.find(v => v.lang.startsWith('zh'))
    selectedVoice = found || null
    const info = document.getElementById('voiceInfo')
    if (info) {
      info.textContent = selectedVoice
        ? 'Voice: ' + selectedVoice.name
        : 'No Chinese voice detected'
    }
  }
  if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = tryFind
  }
  tryFind()
}

function speak(text) {
  speechSynthesis.cancel()
  const utt = new SpeechSynthesisUtterance(text)
  utt.lang = 'zh-CN'
  utt.rate = 0.8
  utt.pitch = 1.1
  if (selectedVoice) utt.voice = selectedVoice
  speechSynthesis.speak(utt)
}

// ─── Level tabs ──────────────────────────────────────────────────────────────

function renderLevelTabs() {
  const wrap = document.getElementById('levelTabs')
  const levels = getAvailableLevels(WORDS)
  if (levels.length < 2) {
    wrap.classList.add('hidden')
    return
  }
  wrap.classList.remove('hidden')
  wrap.innerHTML = [
    { id: 'all', label: 'All HSK' },
    ...levels.map(l => ({ id: l, label: 'HSK ' + l })),
  ].map(({ id, label }) =>
    `<button class="tab${activeLevel === id ? ' active' : ''}"
      aria-label="Filter by ${label}"
      data-level="${id}">${label}</button>`
  ).join('')
  wrap.querySelectorAll('.tab').forEach(btn => {
    btn.addEventListener('click', () => {
      activeLevel = btn.dataset.level === 'all' ? 'all' : Number(btn.dataset.level)
      rebuildDeck()
    })
  })
}

// ─── Category tabs ────────────────────────────────────────────────────────────

const CAT_DEFS = [
  { id: 'all', label: 'All' },
  { id: 'time', label: 'Time' },
  { id: 'numbers', label: 'Numbers' },
  { id: 'words', label: 'Words' },
  { id: 'family', label: 'Family' },
]

function renderCatTabs() {
  const wrap = document.getElementById('catTabs')
  const counts = buildCatCounts(WORDS, activeLevel)
  wrap.innerHTML = CAT_DEFS.map(({ id, label }) =>
    `<button class="tab${activeCat === id ? ' active' : ''}"
      aria-label="Filter by ${label} (${counts[id]} words)"
      data-cat="${id}">
      ${label}<span class="tab-count">${counts[id]}</span>
    </button>`
  ).join('')
  wrap.querySelectorAll('.tab').forEach(btn => {
    btn.addEventListener('click', () => {
      activeCat = btn.dataset.cat
      rebuildDeck()
    })
  })
}

// ─── Progress & stats ─────────────────────────────────────────────────────────

function updateProgress() {
  const fill = document.getElementById('progressFill')
  const label = document.getElementById('progressLabel')
  const wrap = document.getElementById('progressWrap')
  const total = deck.length
  if (!total) {
    fill.style.width = '0%'
    label.textContent = ''
    wrap.setAttribute('aria-valuenow', 0)
    return
  }
  const pct = Math.round((deckIndex / total) * 100)
  fill.style.width = pct + '%'
  label.textContent = deckIndex + ' of ' + total
  wrap.setAttribute('aria-valuenow', pct)
}

function updateStats() {
  const bar = document.getElementById('statsBar')
  if (mode === 'flashcard') {
    const { known, stillLearning } = getStats(deck, knownSet)
    bar.textContent = known + ' known, ' + stillLearning + ' still learning'
  } else {
    bar.textContent = quizCorrectCount + ' correct, ' + quizWrongCount + ' wrong'
  }
}

// ─── Deck management ──────────────────────────────────────────────────────────

function rebuildDeck() {
  const unknownsOnly = document.getElementById('unknownsOnly')?.checked ?? false
  deck = getFilteredDeck(WORDS, activeCat, activeLevel, unknownsOnly, knownSet)
  deckIndex = 0
  revealed = false
  quizAnswered = false
  quizLastCorrect = false
  lastInput = ''
  quizCorrectCount = 0
  quizWrongCount = 0
  wrongWords = []
  renderLevelTabs()
  renderCatTabs()
  updateProgress()
  updateStats()
  renderMain()
}

function shuffle() {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[deck[i], deck[j]] = [deck[j], deck[i]]
  }
  deckIndex = 0
  revealed = false
  quizAnswered = false
  updateProgress()
  renderMain()
}

// ─── Mode switching ───────────────────────────────────────────────────────────

function setMode(m) {
  mode = m
  document.getElementById('btnFlashcard').classList.toggle('active', m === 'flashcard')
  document.getElementById('btnQuiz').classList.toggle('active', m === 'quiz')
  document.getElementById('unknownsToggle').classList.toggle('hidden', m === 'quiz')
  rebuildDeck()
}

// ─── Event wiring ─────────────────────────────────────────────────────────────

function wireGlobalEvents() {
  document.getElementById('btnFlashcard').addEventListener('click', () => setMode('flashcard'))
  document.getElementById('btnQuiz').addEventListener('click', () => setMode('quiz'))
  document.getElementById('btnTheme').addEventListener('click', toggleTheme)
  document.getElementById('btnShuffle').addEventListener('click', shuffle)
  document.getElementById('btnReset').addEventListener('click', () => {
    knownSet.clear()
    saveKnown()
    rebuildDeck()
  })
  document.getElementById('btnAddWord').addEventListener('click', openModal)
  document.getElementById('unknownsOnly').addEventListener('change', rebuildDeck)
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal()
  })
}

// ─── Render dispatcher (stub — full implementation added in Task 6) ───────────

function renderMain() {
  // Filled in Task 6
}

// ─── Init ─────────────────────────────────────────────────────────────────────

function init() {
  loadState()
  initTheme()
  initVoice()
  wireGlobalEvents()
  rebuildDeck()
}

init()
```

- [ ] **Step 2: Run dev server and verify**

```bash
npm run dev
```

Open `http://localhost:5173`. Expected:
- Navbar visible with title, mode buttons, theme toggle
- Category tabs rendered with correct word counts (All: 51, Time: ~19, Numbers: 10, Words: ~16, Family: 6)
- Controls row visible
- Progress bar visible
- HSK level tabs NOT visible (only one level)
- Theme toggle switches between light and dark
- No console errors

- [ ] **Step 3: Commit**

```bash
git add src/main.js
git commit -m "feat: add app state, storage, theme toggle, and global UI"
```

---

## Task 6: Flashcard mode

**Files:**
- Modify: `src/main.js` (add flashcard rendering functions and `renderMain` dispatcher)

- [ ] **Step 1: Add flashcard rendering to main.js**

Add these functions before `init()`:

```js
// ─── Render dispatcher (replaces the Task 5 stub) ────────────────────────────

function renderMain() {
  if (mode === 'flashcard') renderFlashcard()
  else renderQuiz()
}

// ─── Flashcard mode ───────────────────────────────────────────────────────────

function renderFlashcard() {
  const area = document.getElementById('mainArea')
  if (!deck.length) {
    area.innerHTML = `<div class="completion">
      <div class="completion-emoji">🔍</div>
      <h2>No cards match this filter</h2>
      <p style="color:var(--text-2);margin-top:8px;font-size:14px">Try a different category or turn off Unknowns only.</p>
    </div>`
    return
  }
  if (deckIndex >= deck.length) {
    renderFlashcardComplete()
    return
  }
  const word = deck[deckIndex]
  area.innerHTML = `
    <div class="card-wrap">
      <div class="card">
        <button class="btn-remove" data-h="${escHtml(word.h)}" aria-label="Remove this word permanently">×</button>
        <div class="hanzi">${word.h}</div>
        <button class="btn-listen" data-h="${escHtml(word.h)}" aria-label="Listen to pronunciation">🔊 Listen</button>
        ${revealed ? revealedHTML(word) : `
          <div class="btn-row">
            <button class="btn" id="btnReveal" aria-label="Reveal pinyin and tips">Reveal</button>
          </div>
        `}
      </div>
    </div>`
  wireCardEvents()
}

function revealedHTML(word) {
  return `
    <div class="pinyin-display">${word.p}</div>
    <div class="meaning-display">${word.m}</div>
    <div class="tips">
      <div class="tip-box hanzi-tip">
        <div class="tip-label">Hanzi Tip</div>
        <div class="tip-text">${word.tip}</div>
      </div>
      <div class="tip-box word-tip">
        <div class="tip-label">Word Tip</div>
        <div class="tip-text">${word.wtip}</div>
      </div>
    </div>
    <div class="btn-row">
      <button class="btn btn-red" id="btnStillLearning" aria-label="Mark as still learning">Still Learning</button>
      <button class="btn btn-green" id="btnKnowIt" aria-label="Mark as known">Know It</button>
    </div>`
}

function wireCardEvents() {
  document.getElementById('btnReveal')?.addEventListener('click', () => {
    revealed = true
    renderFlashcard()
  })
  document.getElementById('btnKnowIt')?.addEventListener('click', () => {
    const word = deck[deckIndex]
    knownSet.add(word.h)
    saveKnown()
    deckIndex++
    revealed = false
    updateProgress()
    updateStats()
    renderFlashcard()
  })
  document.getElementById('btnStillLearning')?.addEventListener('click', () => {
    deckIndex++
    revealed = false
    updateProgress()
    renderFlashcard()
  })
  document.querySelector('.btn-listen')?.addEventListener('click', e => {
    speak(e.currentTarget.dataset.h)
  })
  document.querySelector('.btn-remove')?.addEventListener('click', e => {
    removeWord(e.currentTarget.dataset.h)
  })
}

function renderFlashcardComplete() {
  const area = document.getElementById('mainArea')
  const { known, stillLearning } = getStats(deck, knownSet)
  area.innerHTML = `
    <div class="completion">
      <div class="completion-emoji">🎉</div>
      <h2>Session Complete</h2>
      <div class="completion-stats">
        <strong>${known}</strong> known<br>
        <strong>${stillLearning}</strong> still learning
      </div>
      <button class="btn btn-accent" id="btnStartOver" aria-label="Start over from first card">Start Over</button>
    </div>`
  document.getElementById('btnStartOver').addEventListener('click', () => {
    deckIndex = 0
    revealed = false
    updateProgress()
    renderFlashcard()
  })
}

function removeWord(hanzi) {
  WORDS = WORDS.filter(w => w.h !== hanzi)
  knownSet.delete(hanzi)
  saveWords()
  saveKnown()
  deck = deck.filter(w => w.h !== hanzi)
  if (deckIndex >= deck.length && deck.length > 0) deckIndex = deck.length - 1
  revealed = false
  renderLevelTabs()
  renderCatTabs()
  updateProgress()
  updateStats()
  renderFlashcard()
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
```

- [ ] **Step 2: Verify flashcard mode in browser**

```bash
npm run dev
```

Check:
- Hanzi displays large
- Listen button speaks the word
- Reveal hides the button and shows pinyin (red) + meaning + tip boxes
- Know It increments known counter in stats and advances
- Still Learning advances without changing stats
- Remove (×) removes the word and rebuilds the deck
- Category tabs re-count correctly after removal
- Completion screen shows after last card
- Start Over resets to index 0
- Unknowns Only toggle filters immediately

- [ ] **Step 3: Commit**

```bash
git add src/main.js
git commit -m "feat: implement flashcard mode with reveal, know it, still learning, and remove"
```

---

## Task 7: Pinyin Quiz mode

**Files:**
- Modify: `src/main.js` (add quiz rendering and logic)

- [ ] **Step 1: Add quiz rendering functions to main.js**

Add before `init()`:

```js
// ─── Quiz mode ────────────────────────────────────────────────────────────────

function renderQuiz() {
  const area = document.getElementById('mainArea')
  if (!deck.length) {
    area.innerHTML = `<div class="completion">
      <div class="completion-emoji">🔍</div>
      <h2>No cards match this filter</h2>
      <p style="color:var(--text-2);margin-top:8px;font-size:14px">Try a different category.</p>
    </div>`
    return
  }
  if (deckIndex >= deck.length) {
    renderQuizResults()
    return
  }
  const word = deck[deckIndex]
  area.innerHTML = `
    <div class="card-wrap">
      <div class="card">
        <div class="hanzi">${word.h}</div>
        <div class="card-meaning">${word.m}</div>
        <button class="btn-listen" data-h="${escHtml(word.h)}" aria-label="Listen to pronunciation">🔊 Listen</button>
        ${quizAnswered ? answeredHTML(word) : unansweredHTML()}
      </div>
    </div>`
  wireQuizEvents(word)
}

function unansweredHTML() {
  return `
    <div class="quiz-feedback" id="quizFeedback"></div>
    <input class="quiz-input" id="quizInput" type="text"
      placeholder="Type pinyin…" autocomplete="off" autocapitalize="none" spellcheck="false"
      aria-label="Type the pinyin for this character" />
    <div class="btn-row">
      <button class="btn btn-accent" id="btnCheck" aria-label="Check your answer">Check</button>
    </div>`
}

function answeredHTML(word) {
  const cls = quizLastCorrect ? 'correct' : 'wrong'
  const feedbackText = quizLastCorrect
    ? 'Correct!'
    : `Not quite — ${word.p}`
  return `
    <div class="quiz-feedback ${cls}" id="quizFeedback">${feedbackText}</div>
    <input class="quiz-input ${cls}" id="quizInput" type="text"
      value="${escHtml(lastInput)}" disabled
      aria-label="Your answer" />
    ${!quizLastCorrect ? `
    <div class="tips" style="margin-top:12px">
      <div class="tip-box hanzi-tip">
        <div class="tip-label">Hanzi Tip</div>
        <div class="tip-text">${word.tip}</div>
      </div>
      <div class="tip-box word-tip">
        <div class="tip-label">Word Tip</div>
        <div class="tip-text">${word.wtip}</div>
      </div>
    </div>` : ''}
    <div class="btn-row">
      <button class="btn btn-blue" id="btnNext" aria-label="Next card">Next</button>
    </div>`
}

function wireQuizEvents(word) {
  document.querySelector('.btn-listen')?.addEventListener('click', e => speak(e.currentTarget.dataset.h))

  const input = document.getElementById('quizInput')
  if (input && !quizAnswered) {
    setTimeout(() => input.focus(), 30)
    input.addEventListener('keydown', e => { if (e.key === 'Enter') checkAnswer(word) })
  }

  document.getElementById('btnCheck')?.addEventListener('click', () => checkAnswer(word))

  document.getElementById('btnNext')?.addEventListener('click', advanceQuiz)

  if (quizAnswered) {
    document.addEventListener('keydown', function handler(e) {
      if (e.key === 'Enter') {
        document.removeEventListener('keydown', handler)
        advanceQuiz()
      }
    }, { once: true })
  }
}

function checkAnswer(word) {
  const input = document.getElementById('quizInput')
  if (!input) return
  lastInput = input.value
  quizLastCorrect = normalizePinyin(lastInput) === normalizePinyin(word.p)
  quizAnswered = true
  if (quizLastCorrect) quizCorrectCount++
  else {
    quizWrongCount++
    wrongWords.push(word)
  }
  updateStats()
  renderQuiz()
}

function advanceQuiz() {
  deckIndex++
  quizAnswered = false
  quizLastCorrect = false
  lastInput = ''
  updateProgress()
  renderQuiz()
}

function renderQuizResults() {
  const area = document.getElementById('mainArea')
  const total = quizCorrectCount + quizWrongCount
  const pct = total ? Math.round((quizCorrectCount / total) * 100) : 0
  const emoji = pct >= 90 ? '🏆' : pct >= 60 ? '💪' : '📚'

  const wrongHTML = wrongWords.length ? `
    <div class="wrong-list">
      <h3>Missed — ${wrongWords.length} word${wrongWords.length > 1 ? 's' : ''}</h3>
      ${wrongWords.map(w => `
        <div class="wrong-item">
          <div class="wrong-hanzi">${w.h}</div>
          <div class="wrong-details">
            <div class="wrong-pinyin">${w.p}</div>
            <div class="wrong-meaning">${w.m}</div>
          </div>
          <button class="btn-play" data-h="${escHtml(w.h)}" aria-label="Listen to ${w.h}">🔊</button>
        </div>`).join('')}
    </div>` : ''

  area.innerHTML = `
    <div class="results">
      <div class="results-emoji">${emoji}</div>
      <h2>Round Complete</h2>
      <div class="results-score">${quizCorrectCount} correct, ${quizWrongCount} wrong — ${pct}%</div>
      ${wrongHTML}
      <button class="btn btn-accent" id="btnTryAgain" aria-label="Try this round again">Try Again</button>
    </div>`

  area.querySelectorAll('.btn-play').forEach(btn => {
    btn.addEventListener('click', () => speak(btn.dataset.h))
  })
  document.getElementById('btnTryAgain').addEventListener('click', () => {
    deckIndex = 0
    quizAnswered = false
    quizLastCorrect = false
    lastInput = ''
    quizCorrectCount = 0
    quizWrongCount = 0
    wrongWords = []
    updateProgress()
    updateStats()
    renderQuiz()
  })
}
```

- [ ] **Step 2: Verify quiz mode in browser**

Check:
- Hanzi + meaning shown, input focused automatically
- Typing pinyin with or without tones and pressing Enter or Check works
- Correct answer: input goes green, "Correct!" shown, Next appears
- Wrong answer: input goes red, correct pinyin shown, tip boxes appear
- Enter key after answering advances to next card
- Results screen shows correct emoji, score, wrong words list with play buttons
- Try Again resets round with same deck order

- [ ] **Step 3: Commit**

```bash
git add src/main.js
git commit -m "feat: implement pinyin quiz mode with normalised comparison and results screen"
```

---

## Task 8: Add Word modal

**Files:**
- Modify: `src/main.js` (add modal open/close/validate/submit)

- [ ] **Step 1: Add modal logic to main.js**

Add before `init()`:

```js
// ─── Add Word modal ───────────────────────────────────────────────────────────

let _focusTrapFirst = null
let _focusTrapLast = null
let _preModalFocus = null

function openModal() {
  _preModalFocus = document.activeElement
  const overlay = document.getElementById('addWordModal')
  overlay.classList.remove('hidden')
  clearModalForm()
  // Focus first input
  const first = document.getElementById('f-hanzi')
  first.focus()
  // Trap focus
  const focusable = overlay.querySelectorAll(
    'button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
  _focusTrapFirst = focusable[0]
  _focusTrapLast = focusable[focusable.length - 1]
  overlay.addEventListener('keydown', trapFocus)
  overlay.addEventListener('click', overlayClickClose)
  document.getElementById('btnModalCancel').addEventListener('click', closeModal)
  document.getElementById('btnModalSubmit').addEventListener('click', submitWord)
  document.getElementById('modalPanel').addEventListener('click', e => e.stopPropagation())
}

function closeModal() {
  const overlay = document.getElementById('addWordModal')
  overlay.classList.add('hidden')
  overlay.removeEventListener('keydown', trapFocus)
  overlay.removeEventListener('click', overlayClickClose)
  if (_preModalFocus) _preModalFocus.focus()
}

function overlayClickClose(e) {
  if (e.target === document.getElementById('addWordModal')) closeModal()
}

function trapFocus(e) {
  if (e.key !== 'Tab') return
  if (e.shiftKey) {
    if (document.activeElement === _focusTrapFirst) {
      e.preventDefault()
      _focusTrapLast.focus()
    }
  } else {
    if (document.activeElement === _focusTrapLast) {
      e.preventDefault()
      _focusTrapFirst.focus()
    }
  }
}

function clearModalForm() {
  ;['f-hanzi', 'f-pinyin', 'f-meaning', 'f-tip', 'f-wtip'].forEach(id => {
    document.getElementById(id).value = ''
  })
  document.getElementById('f-cat').value = 'words'
  ;['err-hanzi', 'err-pinyin', 'err-meaning'].forEach(id => {
    const el = document.getElementById(id)
    el.textContent = ''
    el.classList.add('hidden')
  })
}

function showFieldError(fieldId, errorId, message) {
  document.getElementById(fieldId).style.borderColor = 'var(--red)'
  const err = document.getElementById(errorId)
  err.textContent = message
  err.classList.remove('hidden')
}

function clearFieldError(fieldId, errorId) {
  document.getElementById(fieldId).style.borderColor = ''
  const err = document.getElementById(errorId)
  err.textContent = ''
  err.classList.add('hidden')
}

function submitWord() {
  const h = document.getElementById('f-hanzi').value.trim()
  const p = document.getElementById('f-pinyin').value.trim()
  const m = document.getElementById('f-meaning').value.trim()
  const cat = document.getElementById('f-cat').value
  const tip = document.getElementById('f-tip').value.trim() || 'No tip provided.'
  const wtip = document.getElementById('f-wtip').value.trim() || 'No tip provided.'

  let valid = true

  clearFieldError('f-hanzi', 'err-hanzi')
  clearFieldError('f-pinyin', 'err-pinyin')
  clearFieldError('f-meaning', 'err-meaning')

  if (!h) {
    showFieldError('f-hanzi', 'err-hanzi', 'Hanzi is required.')
    valid = false
  } else if (WORDS.some(w => w.h === h)) {
    showFieldError('f-hanzi', 'err-hanzi', 'This word already exists.')
    valid = false
  }
  if (!p) { showFieldError('f-pinyin', 'err-pinyin', 'Pinyin is required.'); valid = false }
  if (!m) { showFieldError('f-meaning', 'err-meaning', 'Meaning is required.'); valid = false }

  if (!valid) return

  const newWord = { h, p, m, cat, level: 1, tip, wtip }
  WORDS.push(newWord)
  saveWords()
  closeModal()
  rebuildDeck()
}
```

- [ ] **Step 2: Verify Add Word modal in browser**

Check:
- Add Word button opens modal
- Escape key closes modal
- Clicking overlay closes modal; clicking inside modal does not
- Empty required fields show inline red errors
- Duplicate Hanzi shows "This word already exists."
- Successful submission: modal closes, word appears in deck, category tab count updates
- Tab key cycles through all focusable elements in modal only (focus trapped)

- [ ] **Step 3: Commit**

```bash
git add src/main.js
git commit -m "feat: implement Add Word modal with validation, duplicate check, and focus trap"
```

---

## Task 9: Final polish and deployment setup

**Files:**
- Create: `vercel.json`
- Modify: `index.html` (add `<link rel="icon">` and Open Graph meta tags for sharing)
- Modify: `package.json` (verify scripts)

- [ ] **Step 1: Create vercel.json**

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": null
}
```

- [ ] **Step 2: Add share meta tags to index.html `<head>`**

Add after the existing `<meta name="description">` tag:

```html
<meta property="og:title" content="Hanzi Practice" />
<meta property="og:description" content="Free Hanzi flashcards and pinyin quiz for HSK vocabulary" />
<meta property="og:type" content="website" />
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>汉</text></svg>" />
```

- [ ] **Step 3: Run final build to verify**

```bash
npm run build
```

Expected: `dist/` folder created, no errors, output shows bundled asset sizes.

- [ ] **Step 4: Preview the production build locally**

```bash
npm run preview
```

Open `http://localhost:4173`. Verify the full app works identically to dev.

- [ ] **Step 5: Run full test suite one final time**

```bash
npm test
```

Expected: All tests PASS.

- [ ] **Step 6: Commit everything**

```bash
git add vercel.json index.html
git commit -m "feat: add deployment config and Open Graph meta tags"
```

- [ ] **Step 7: Deploy to Vercel**

1. Push to GitHub: `git push`
2. Go to [vercel.com](https://vercel.com), sign in, click "Add New Project"
3. Import the GitHub repository
4. Vercel auto-detects build command and output dir from `vercel.json`
5. Click Deploy
6. Share the live URL

---

## Summary

| Task | What it delivers |
|------|-----------------|
| 1 — Scaffold | Vite project, HTML shell, dev server running |
| 2 — Data | 51 HSK1 words, data integrity tests passing |
| 3 — Utilities | Pure functions tested: normalizePinyin, filtering, stats |
| 4 — CSS | Full design system, light/dark tokens, all components styled |
| 5 — Global UI | Navbar, theme toggle, category tabs, controls, progress, stats |
| 6 — Flashcard | Full flashcard mode: reveal, know it, still learning, remove, completion |
| 7 — Quiz | Full quiz mode: input, check, tips on wrong, results screen |
| 8 — Modal | Add Word form with validation, focus trap, duplicate check |
| 9 — Deploy | Vercel config, meta tags, production build verified, live URL |
