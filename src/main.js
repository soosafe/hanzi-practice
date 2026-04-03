import { DEFAULT_WORDS } from './data/index.js'

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
  const cats = ['time', 'numbers', 'words', 'family', 'hobbies', 'phrases']
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

// ─── State ────────────────────────────────────────────────────────────────────

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
    if (savedWords) {
      const parsed = JSON.parse(savedWords)
      const defaultSet = new Set(DEFAULT_WORDS.map(w => w.h))
      const userAddedWords = parsed.filter(w => !defaultSet.has(w.h))
      WORDS = [...DEFAULT_WORDS, ...userAddedWords]
      saveWords()
    } else {
      WORDS = [...DEFAULT_WORDS]
    }
  } catch {
    WORDS = [...DEFAULT_WORDS]
  }
  try {
    const savedKnown = localStorage.getItem('hanzi_known')
    if (savedKnown) knownSet = new Set(JSON.parse(savedKnown))
  } catch {
    // knownSet remains an empty Set — acceptable degradation
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
  { id: 'hobbies', label: 'Hobbies' },
  { id: 'phrases', label: 'Phrases' },
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

// ─── Render dispatcher (replaces the Task 5 stub) ────────────────────────────

function renderMain() {
  if (mode === 'flashcard') renderFlashcard()
  else renderQuiz()
}

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
        <div class="card-meaning">${escHtml(word.m)}</div>
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
    : `Not quite — ${escHtml(word.p)}`
  return `
    <div class="quiz-feedback ${cls}" id="quizFeedback">${feedbackText}</div>
    <input class="quiz-input ${cls}" id="quizInput" type="text"
      value="${escHtml(lastInput)}" disabled
      aria-label="Your answer" />
    ${!quizLastCorrect ? `
    <div class="tips" style="margin-top:12px">
      <div class="tip-box hanzi-tip">
        <div class="tip-label">Hanzi Tip</div>
        <div class="tip-text">${escHtml(word.tip)}</div>
      </div>
      <div class="tip-box word-tip">
        <div class="tip-label">Word Tip</div>
        <div class="tip-text">${escHtml(word.wtip)}</div>
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
            <div class="wrong-pinyin">${escHtml(w.p)}</div>
            <div class="wrong-meaning">${escHtml(w.m)}</div>
          </div>
          <button class="btn-play" data-h="${escHtml(w.h)}" aria-label="Listen to ${escHtml(w.h)}">🔊</button>
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
    <div class="pinyin-display">${escHtml(word.p)}</div>
    <div class="meaning-display">${escHtml(word.m)}</div>
    <div class="tips">
      <div class="tip-box hanzi-tip">
        <div class="tip-label">Hanzi Tip</div>
        <div class="tip-text">${escHtml(word.tip)}</div>
      </div>
      <div class="tip-box word-tip">
        <div class="tip-label">Word Tip</div>
        <div class="tip-text">${escHtml(word.wtip)}</div>
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

// ─── Add Word modal ───────────────────────────────────────────────────────────

let _focusTrapFirst = null
let _focusTrapLast = null
let _preModalFocus = null

function openModal() {
  _preModalFocus = document.activeElement
  const overlay = document.getElementById('addWordModal')
  overlay.classList.remove('hidden')
  clearModalForm()
  const first = document.getElementById('f-hanzi')
  first.focus()
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

// ─── Init ─────────────────────────────────────────────────────────────────────

function init() {
  loadState()
  initTheme()
  initVoice()
  wireGlobalEvents()
  rebuildDeck()
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  init()
}
