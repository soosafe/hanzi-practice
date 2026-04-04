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

  // Determine if query is pinyin or hanzi
  const isHanzi = /[\u4E00-\u9FFF]/.test(trimmed)
  const normalQ = normalizePinyin(trimmed)

  // Score each word based on match quality
  const scored = words.map(w => {
    let score = 0

    if (isHanzi) {
      // Query is hanzi: match against hanzi only
      if (w.h === trimmed) score = 1000      // exact match
      else if (w.h.includes(trimmed)) score = 500  // partial match
    } else {
      // Query is pinyin: match against pinyin only (if normalQ is non-empty after normalization)
      if (normalQ && normalizePinyin(w.p).includes(normalQ)) score = 100
    }

    return { word: w, score }
  }).filter(s => s.score > 0)

  // Sort by score (descending) and slice to 10
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map(s => s.word)
}

// ─── Module state ─────────────────────────────────────────────────────────────

let _getWords = null
let _speak = null
let _dropdownEl = null
let _detailModalEl = null
let _mobileModalEl = null

// ─── Init ─────────────────────────────────────────────────────────────────────

export function initSearch(getWords, speak) {
  _getWords = getWords
  _speak = speak
  _createDropdown()
  _createDetailModal()
  _createMobileModal()
  _wireSearchButton()
}

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

// ─── Mobile modal ─────────────────────────────────────────────────────────────

function _createMobileModal() {
  _mobileModalEl = document.createElement('div')
  _mobileModalEl.className = 'modal-overlay hidden'
  _mobileModalEl.id = 'searchMobileModal'
  _mobileModalEl.setAttribute('role', 'dialog')
  _mobileModalEl.setAttribute('aria-modal', 'true')
  _mobileModalEl.setAttribute('aria-label', 'Search words')
  _mobileModalEl.innerHTML = `
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
  document.body.appendChild(_mobileModalEl)

  document.getElementById('searchMobileClose').addEventListener('click', _closeMobileModal)
  _mobileModalEl.querySelector('.modal').addEventListener('click', e => e.stopPropagation())
  _mobileModalEl.addEventListener('click', _closeMobileModal)

  document.getElementById('searchMobileInput').addEventListener('input', e => {
    _renderMobileResults(e.target.value)
  })

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !_mobileModalEl.classList.contains('hidden')) {
      _closeMobileModal()
    }
  })
}

function _openMobileModal() {
  _mobileModalEl.classList.remove('hidden')
  document.getElementById('searchMobileResults').innerHTML = ''
  const input = document.getElementById('searchMobileInput')
  input.value = ''
  setTimeout(() => input.focus(), 50)
}

function _closeMobileModal() {
  _mobileModalEl.classList.add('hidden')
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
