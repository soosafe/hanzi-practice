# Search Feature Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a search button to the navbar that lets users find any word by Hanzi or Pinyin, with results in a dropdown and a full detail modal with listen support.

**Architecture:** A new `src/search.js` module owns all search logic and DOM. `main.js` calls `initSearch(() => WORDS, speak)` once after init. On desktop, the search input expands inline within a new `nav-right` wrapper; on mobile (≤600px) it opens a full-screen modal overlay instead.

**Tech Stack:** Vanilla JS ES modules, Vite, Vitest for tests.

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `index.html` | Modify | Add `nav-right` wrapper, `#btnSearch`, `#searchInput` |
| `src/search.js` | Create | All search logic, dropdown, detail modal, mobile modal |
| `src/search.test.js` | Create | Tests for pure `searchWords` function |
| `src/main.js` | Modify | Import `initSearch`, call it in `init()` |
| `src/styles/main.css` | Modify | Styles for nav-right, search input, dropdown, modals |

---

## Task 1: HTML — nav-right wrapper + search button

**Files:**
- Modify: `index.html:26`

- [ ] **Step 1: Replace the standalone `#btnTheme` with a `nav-right` wrapper**

In `index.html`, find this line:
```html
    <button class="btn-theme" id="btnTheme" aria-label="Toggle dark mode">🌙</button>
```

Replace it with:
```html
    <div class="nav-right">
      <button class="btn-theme" id="btnTheme" aria-label="Toggle dark mode">🌙</button>
      <button class="btn-theme" id="btnSearch" aria-label="Search words">🔍</button>
      <input
        type="text"
        id="searchInput"
        class="search-input"
        placeholder="Search Hanzi or Pinyin…"
        autocomplete="off"
        autocapitalize="none"
        spellcheck="false"
        aria-label="Search words"
      />
    </div>
```

- [ ] **Step 2: Verify the navbar renders without breaking existing layout**

Run: `npm run dev`
Open browser at `http://localhost:5173`. The navbar should show: title | Flashcards + Pinyin Quiz | 🌙 🔍. The search input should be invisible (zero-width, not yet styled).

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add nav-right wrapper and search button to navbar"
```

---

## Task 2: CSS — nav-right, search input expand, dropdown, modals

**Files:**
- Modify: `src/styles/main.css` — after the `.btn-theme:hover` rule at line 100

- [ ] **Step 1: Add nav-right and search input styles**

After `.btn-theme:hover { border-color: var(--text-2); }`, add:

```css
/* ── Search ─────────────────────────────────────────────────────────────────── */
.nav-right {
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  flex-shrink: 0;
}

.search-input {
  width: 0;
  opacity: 0;
  padding: 5px 0;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  background: var(--bg);
  color: var(--text);
  font-size: 13px;
  font-family: var(--font-ui);
  outline: none;
  overflow: hidden;
  transition: width 0.25s ease, opacity 0.2s ease, padding 0.25s ease, border-color 0.25s ease;
}
.search-input.open {
  width: 200px;
  opacity: 1;
  padding: 5px 10px;
  border-color: var(--border);
}
.search-input:focus { border-color: var(--text-2); }

.search-dropdown {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  min-width: 280px;
  max-height: 320px;
  overflow-y: auto;
  z-index: 200;
}
.search-dropdown.hidden { display: none; }

.search-result-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  cursor: pointer;
  border-bottom: 1px solid var(--border);
  transition: background 0.1s;
}
.search-result-item:last-child { border-bottom: none; }
.search-result-item:hover { background: var(--surface); }

.search-result-hanzi {
  font-family: var(--font-cjk);
  font-size: 20px;
  font-weight: 500;
  flex-shrink: 0;
}
.search-result-meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.search-result-pinyin { font-size: 12px; color: var(--text-2); }
.search-result-meaning { font-size: 13px; color: var(--text); }

.search-no-results {
  padding: 14px;
  text-align: center;
  color: var(--text-2);
  font-size: 13px;
}

/* ── Search detail modal ────────────────────────────────────────────────────── */
.search-detail-hanzi {
  font-family: var(--font-cjk);
  font-size: 56px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 8px;
}
.search-detail-pinyin {
  text-align: center;
  color: var(--text-2);
  font-size: 18px;
  margin-bottom: 4px;
}
.search-detail-meaning {
  text-align: center;
  font-size: 16px;
  margin-bottom: 10px;
}
.search-detail-level {
  text-align: center;
  margin-bottom: 14px;
}
.search-detail-level .hsk-badge {
  display: inline-block;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-pill);
  padding: 3px 12px;
  font-size: 12px;
  color: var(--text-2);
}

/* ── Search mobile modal ────────────────────────────────────────────────────── */
.search-mobile-modal {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 480px;
}
.search-mobile-input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--bg);
  color: var(--text);
  font-size: 15px;
  font-family: var(--font-ui);
  outline: none;
}
.search-mobile-input:focus { border-color: var(--text-2); }
.search-mobile-results {
  max-height: 50vh;
  overflow-y: auto;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
}
```

- [ ] **Step 2: Verify styles in browser**

Run: `npm run dev`. The 🔍 button should appear in the navbar with the same style as 🌙. The search input should be invisible (zero-width).

- [ ] **Step 3: Commit**

```bash
git add src/styles/main.css
git commit -m "feat: add search CSS — nav-right, input expand, dropdown, modals"
```

---

## Task 3: search.js — pure searchWords function + tests (TDD)

**Files:**
- Create: `src/search.test.js`
- Create: `src/search.js` (stub for now, expand in later tasks)

- [ ] **Step 1: Write the failing tests**

Create `src/search.test.js`:

```js
import { describe, it, expect } from 'vitest'
import { searchWords } from './search.js'

const words = [
  { h: '你好', p: 'nǐ hǎo', m: 'Hello', cat: 'phrases', level: 1, tip: '', wtip: '' },
  { h: '今天', p: 'jīntiān', m: 'Today', cat: 'time', level: 1, tip: '', wtip: '' },
  { h: '学习', p: 'xuéxí', m: 'To study', cat: 'words', level: 2, tip: '', wtip: '' },
  { h: '漂亮', p: 'piàoliang', m: 'Beautiful', cat: 'words', level: 2, tip: '', wtip: '' },
]

describe('searchWords', () => {
  it('returns empty array for empty query', () => {
    expect(searchWords('', words)).toEqual([])
  })

  it('returns empty array for whitespace-only query', () => {
    expect(searchWords('   ', words)).toEqual([])
  })

  it('matches by exact hanzi', () => {
    const results = searchWords('今天', words)
    expect(results).toHaveLength(1)
    expect(results[0].h).toBe('今天')
  })

  it('matches by partial hanzi', () => {
    const results = searchWords('你', words)
    expect(results).toHaveLength(1)
    expect(results[0].h).toBe('你好')
  })

  it('matches by pinyin with tone marks', () => {
    const results = searchWords('jīn', words)
    expect(results).toHaveLength(1)
    expect(results[0].h).toBe('今天')
  })

  it('matches by pinyin without tone marks', () => {
    const results = searchWords('jin', words)
    expect(results).toHaveLength(1)
    expect(results[0].h).toBe('今天')
  })

  it('matches partial pinyin', () => {
    const results = searchWords('xue', words)
    expect(results).toHaveLength(1)
    expect(results[0].h).toBe('学习')
  })

  it('is case-insensitive for pinyin', () => {
    const results = searchWords('NI', words)
    expect(results).toHaveLength(1)
    expect(results[0].h).toBe('你好')
  })

  it('returns at most 10 results', () => {
    const manyWords = Array.from({ length: 20 }, (_, i) => ({
      h: `字${i}`, p: `zi${i}`, m: `word ${i}`, cat: 'words', level: 1, tip: '', wtip: '',
    }))
    expect(searchWords('zi', manyWords)).toHaveLength(10)
  })

  it('returns empty array when no match', () => {
    expect(searchWords('zzz', words)).toEqual([])
  })
})
```

- [ ] **Step 2: Run tests to confirm they fail**

Run: `npm test`
Expected: FAIL — `Cannot find module './search.js'`

- [ ] **Step 3: Create search.js with searchWords implementation**

Create `src/search.js`:

```js
// ─── Pure utilities (self-contained, no imports from main.js) ─────────────────

function normalizePinyin(s) {
  return s.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/g, '')
    .trim()
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// ─── Core search logic ────────────────────────────────────────────────────────

export function searchWords(query, words) {
  const trimmed = query.trim()
  if (!trimmed) return []
  const normalQ = normalizePinyin(trimmed)
  return words.filter(w => {
    if (w.h.includes(trimmed)) return true
    if (normalizePinyin(w.p).includes(normalQ)) return true
    return false
  }).slice(0, 10)
}
```

- [ ] **Step 4: Run tests to confirm they pass**

Run: `npm test`
Expected: all `searchWords` tests PASS (existing `main.test.js` tests should still pass too)

- [ ] **Step 5: Commit**

```bash
git add src/search.js src/search.test.js
git commit -m "feat: add searchWords pure function with tests"
```

---

## Task 4: search.js — initSearch, desktop dropdown

**Files:**
- Modify: `src/search.js`

- [ ] **Step 1: Add module state and initSearch function**

Append to `src/search.js` (after the `searchWords` export):

```js
// ─── Module state ─────────────────────────────────────────────────────────────

let _getWords = null
let _speak = null
let _dropdownEl = null
let _detailModalEl = null
let _mobilModalEl = null

// ─── Init ─────────────────────────────────────────────────────────────────────

export function initSearch(getWords, speak) {
  _getWords = getWords
  _speak = speak
  _createDropdown()
  _createDetailModal()
  _createMobileModal()
  _wireSearchButton()
}
```

- [ ] **Step 2: Add _createDropdown and _wireSearchButton**

Append to `src/search.js`:

```js
// ─── Dropdown ─────────────────────────────────────────────────────────────────

function _createDropdown() {
  _dropdownEl = document.createElement('div')
  _dropdownEl.id = 'searchDropdown'
  _dropdownEl.className = 'search-dropdown hidden'
  _dropdownEl.setAttribute('role', 'listbox')
  _dropdownEl.setAttribute('aria-label', 'Search results')
  const navRight = document.querySelector('.nav-right')
  navRight.appendChild(_dropdownEl)
}

function _wireSearchButton() {
  const btn = document.getElementById('btnSearch')
  const input = document.getElementById('searchInput')

  btn.addEventListener('click', () => {
    if (window.matchMedia('(max-width: 600px)').matches) {
      _openMobileModal()
    } else {
      _toggleDesktopSearch()
    }
  })

  input.addEventListener('input', () => {
    _renderDropdown(input.value)
  })

  input.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      _closeDesktopSearch()
    }
  })

  document.addEventListener('click', e => {
    const navRight = document.querySelector('.nav-right')
    if (!navRight.contains(e.target)) {
      _closeDesktopSearch()
    }
  })
}

function _toggleDesktopSearch() {
  const input = document.getElementById('searchInput')
  if (input.classList.contains('open')) {
    _closeDesktopSearch()
  } else {
    input.classList.add('open')
    input.focus()
  }
}

function _closeDesktopSearch() {
  const input = document.getElementById('searchInput')
  input.classList.remove('open')
  input.value = ''
  _dropdownEl.classList.add('hidden')
  _dropdownEl.innerHTML = ''
}

function _renderDropdown(query) {
  const results = searchWords(query, _getWords())
  _dropdownEl.innerHTML = ''

  if (!query.trim()) {
    _dropdownEl.classList.add('hidden')
    return
  }

  if (results.length === 0) {
    _dropdownEl.classList.remove('hidden')
    _dropdownEl.innerHTML = '<div class="search-no-results">No results found</div>'
    return
  }

  _dropdownEl.classList.remove('hidden')
  results.forEach(word => {
    const item = document.createElement('div')
    item.className = 'search-result-item'
    item.setAttribute('role', 'option')
    item.innerHTML = `
      <div class="search-result-hanzi">${escHtml(word.h)}</div>
      <div class="search-result-meta">
        <div class="search-result-pinyin">${escHtml(word.p)}</div>
        <div class="search-result-meaning">${escHtml(word.m)}</div>
      </div>`
    item.addEventListener('click', () => _openDetailModal(word))
    _dropdownEl.appendChild(item)
  })
}
```

- [ ] **Step 3: Verify desktop search works in browser**

Run: `npm run dev`. Click 🔍 on desktop — the input should animate open. Type `ni` — a dropdown appears with 你好. Type `jint` — shows 今天. Type `zzz` — shows "No results found". Press Escape — input collapses. Click outside — input collapses.

- [ ] **Step 4: Commit**

```bash
git add src/search.js
git commit -m "feat: add desktop search bar with dropdown results"
```

---

## Task 5: search.js — word detail modal

**Files:**
- Modify: `src/search.js`

- [ ] **Step 1: Add _createDetailModal and _openDetailModal**

Append to `src/search.js`:

```js
// ─── Detail modal ─────────────────────────────────────────────────────────────

function _createDetailModal() {
  _detailModalEl = document.createElement('div')
  _detailModalEl.className = 'modal-overlay hidden'
  _detailModalEl.id = 'searchDetailModal'
  _detailModalEl.setAttribute('role', 'dialog')
  _detailModalEl.setAttribute('aria-modal', 'true')
  _detailModalEl.setAttribute('aria-label', 'Word detail')
  _detailModalEl.innerHTML = `
    <div class="modal" id="searchDetailPanel">
      <div class="search-detail-hanzi" id="searchDetailHanzi"></div>
      <div class="search-detail-pinyin" id="searchDetailPinyin"></div>
      <div class="search-detail-meaning" id="searchDetailMeaning"></div>
      <div class="search-detail-level"><span class="hsk-badge" id="searchDetailLevel"></span></div>
      <div class="tips" id="searchDetailTips"></div>
      <div class="modal-btns">
        <button class="btn" id="searchDetailListen" aria-label="Listen to pronunciation">🔊 Listen</button>
        <button class="btn btn-accent" id="searchDetailClose" aria-label="Close word detail">Close</button>
      </div>
    </div>`
  document.body.appendChild(_detailModalEl)

  document.getElementById('searchDetailClose').addEventListener('click', _closeDetailModal)
  document.getElementById('searchDetailPanel').addEventListener('click', e => e.stopPropagation())
  _detailModalEl.addEventListener('click', _closeDetailModal)

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !_detailModalEl.classList.contains('hidden')) {
      _closeDetailModal()
    }
  })
}

function _openDetailModal(word) {
  document.getElementById('searchDetailHanzi').textContent = word.h
  document.getElementById('searchDetailPinyin').textContent = word.p
  document.getElementById('searchDetailMeaning').textContent = word.m
  document.getElementById('searchDetailLevel').textContent = 'HSK ' + word.level

  const tipsEl = document.getElementById('searchDetailTips')
  tipsEl.innerHTML = ''
  if (word.tip && word.tip !== 'No tip provided.') {
    tipsEl.innerHTML += `
      <div class="tip-box hanzi-tip">
        <div class="tip-label">Hanzi Tip</div>
        <div class="tip-text">${escHtml(word.tip)}</div>
      </div>`
  }
  if (word.wtip && word.wtip !== 'No tip provided.') {
    tipsEl.innerHTML += `
      <div class="tip-box word-tip">
        <div class="tip-label">Word Tip</div>
        <div class="tip-text">${escHtml(word.wtip)}</div>
      </div>`
  }

  const listenBtn = document.getElementById('searchDetailListen')
  listenBtn.onclick = () => _speak(word.h)

  _detailModalEl.classList.remove('hidden')
}

function _closeDetailModal() {
  _detailModalEl.classList.add('hidden')
}
```

- [ ] **Step 2: Verify detail modal in browser**

Run: `npm run dev`. Search for `ni`, click 你好 in the dropdown. A modal should appear showing the hanzi large, pinyin, meaning, HSK level badge, tips (if any), a 🔊 Listen button, and a Close button. Listen button should speak the hanzi. Close button and Escape should dismiss the modal. The search dropdown should remain open behind the modal.

- [ ] **Step 3: Commit**

```bash
git add src/search.js
git commit -m "feat: add word detail modal with listen button"
```

---

## Task 6: search.js — mobile search modal

**Files:**
- Modify: `src/search.js`

- [ ] **Step 1: Add _createMobileModal, _openMobileModal, _closeMobileModal**

Append to `src/search.js`:

```js
// ─── Mobile modal ─────────────────────────────────────────────────────────────

function _createMobileModal() {
  _mobilModalEl = document.createElement('div')
  _mobilModalEl.className = 'modal-overlay hidden'
  _mobilModalEl.id = 'searchMobileModal'
  _mobilModalEl.setAttribute('role', 'dialog')
  _mobilModalEl.setAttribute('aria-modal', 'true')
  _mobilModalEl.setAttribute('aria-label', 'Search words')
  _mobilModalEl.innerHTML = `
    <div class="modal search-mobile-modal">
      <input
        type="text"
        id="searchMobileInput"
        class="search-mobile-input"
        placeholder="Search Hanzi or Pinyin…"
        autocomplete="off"
        autocapitalize="none"
        spellcheck="false"
        aria-label="Search words"
      />
      <div id="searchMobileResults" class="search-mobile-results"></div>
      <div class="modal-btns">
        <button class="btn" id="searchMobileClose" aria-label="Close search">Close</button>
      </div>
    </div>`
  document.body.appendChild(_mobilModalEl)

  document.getElementById('searchMobileClose').addEventListener('click', _closeMobileModal)
  _mobilModalEl.querySelector('.modal').addEventListener('click', e => e.stopPropagation())
  _mobilModalEl.addEventListener('click', _closeMobileModal)

  document.getElementById('searchMobileInput').addEventListener('input', e => {
    _renderMobileResults(e.target.value)
  })

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !_mobilModalEl.classList.contains('hidden')) {
      _closeMobileModal()
    }
  })
}

function _openMobileModal() {
  _mobilModalEl.classList.remove('hidden')
  document.getElementById('searchMobileResults').innerHTML = ''
  const input = document.getElementById('searchMobileInput')
  input.value = ''
  setTimeout(() => input.focus(), 50)
}

function _closeMobileModal() {
  _mobilModalEl.classList.add('hidden')
}

function _renderMobileResults(query) {
  const container = document.getElementById('searchMobileResults')
  const results = searchWords(query, _getWords())
  container.innerHTML = ''

  if (!query.trim()) return

  if (results.length === 0) {
    container.innerHTML = '<div class="search-no-results">No results found</div>'
    return
  }

  results.forEach(word => {
    const item = document.createElement('div')
    item.className = 'search-result-item'
    item.innerHTML = `
      <div class="search-result-hanzi">${escHtml(word.h)}</div>
      <div class="search-result-meta">
        <div class="search-result-pinyin">${escHtml(word.p)}</div>
        <div class="search-result-meaning">${escHtml(word.m)}</div>
      </div>`
    item.addEventListener('click', () => {
      _closeMobileModal()
      _openDetailModal(word)
    })
    container.appendChild(item)
  })
}
```

- [ ] **Step 2: Verify mobile modal in browser**

Run: `npm run dev`. Open browser DevTools and set viewport to ≤600px (e.g. iPhone size). Click 🔍 — a full-screen modal should appear with a search input at the top. Type `jin` — results appear. Click a result — the mobile modal closes and the detail modal opens. Close or Escape dismisses the detail modal.

- [ ] **Step 3: Commit**

```bash
git add src/search.js
git commit -m "feat: add mobile search modal overlay"
```

---

## Task 7: Wire initSearch into main.js

**Files:**
- Modify: `src/main.js`

- [ ] **Step 1: Import initSearch at the top of main.js**

In `src/main.js`, after the first line:
```js
import { DEFAULT_WORDS } from './data/index.js'
```

Add:
```js
import { initSearch } from './search.js'
```

- [ ] **Step 2: Call initSearch in the init() function**

In `src/main.js`, find the `init()` function (line ~711):
```js
function init() {
  loadState()
  initTheme()
  initVoice()
  wireGlobalEvents()
  rebuildDeck()
}
```

Replace it with:
```js
function init() {
  loadState()
  initTheme()
  initVoice()
  wireGlobalEvents()
  rebuildDeck()
  initSearch(() => WORDS, speak)
}
```

- [ ] **Step 3: Run all tests**

Run: `npm test`
Expected: all tests PASS (searchWords tests + existing main.test.js tests)

- [ ] **Step 4: Full browser smoke test**

Run: `npm run dev`. Verify each of the following:

Desktop (wide viewport):
- [ ] 🔍 button appears to the right of 🌙, same styling
- [ ] Clicking 🔍 expands the input with animation
- [ ] Typing `ni` shows 你好 in dropdown
- [ ] Typing `jint` or `今` shows 今天
- [ ] Typing `zzz` shows "No results found"
- [ ] Clicking a result opens detail modal with hanzi, pinyin, meaning, HSK badge
- [ ] 🔊 Listen speaks the hanzi
- [ ] Close button and Escape close the modal; dropdown stays open
- [ ] Escape (with no modal open) collapses the search bar
- [ ] Clicking outside navbar collapses search bar
- [ ] Dark mode toggle still works; search input respects theme colors

Mobile (≤600px viewport in DevTools):
- [ ] Clicking 🔍 opens full-screen modal overlay
- [ ] Search input focuses automatically
- [ ] Results appear as you type
- [ ] Clicking a result opens the detail modal
- [ ] Close button and Escape close modals

- [ ] **Step 5: Commit**

```bash
git add src/main.js
git commit -m "feat: wire search module into app init"
```

---

## Self-Review Checklist

- [x] **Spec coverage:** All spec sections covered — navbar layout (Task 1+2), desktop inline expand (Task 4), mobile modal (Task 6), dropdown (Task 4), detail modal with listen (Task 5), `initSearch` wiring (Task 7)
- [x] **No placeholders:** All steps have real code
- [x] **Type consistency:** `searchWords(query, words)` signature consistent across test (Task 3) and usage in `_renderDropdown`/`_renderMobileResults` (Tasks 4+6). `_openDetailModal(word)` consistent across call sites in Tasks 4, 5, 6. `_speak(word.h)` consistent with `initSearch(getWords, speak)` parameter
- [x] **`escHtml` and `normalizePinyin`** duplicated inside `search.js` — no circular import with `main.js`
- [x] **`_mobilModalEl` variable name** consistent across `_createMobileModal`, `_openMobileModal`, `_closeMobileModal`
