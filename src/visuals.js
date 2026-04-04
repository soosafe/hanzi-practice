import { VISUAL_WORDS } from './data/visuals/index.js'

const TONE_COLORS = {
  0: '#7a7974',
  1: '#c05000',
  2: '#b83228',
  3: '#256344',
  4: '#1a3d6e',
}

export function renderVisuals(area, words) {
  if (!VISUAL_WORDS.length) {
    area.innerHTML = `<div class="completion">
      <div class="completion-emoji">🎨</div>
      <h2>No Visual Words Yet</h2>
      <p style="color:var(--text-2);margin-top:8px;font-size:14px">Visual word cards will appear here.</p>
    </div>`
    return
  }

  area.innerHTML = VISUAL_WORDS.map(data => _buildCard(data, words)).join('')
}

function _buildCard(data, words) {
  const wordEntry = words.find(w => w.h === data.h)
  const meaning = wordEntry ? esc(wordEntry.m) : ''
  const cols = Math.min(data.chars.length, 4)

  const charsHTML = data.chars.map(c => `
    <div class="v-char-box">
      <div class="v-char-zh">${esc(c.zh)}</div>
      <div class="v-char-visual">${c.svg}</div>
      <div class="v-char-story">${esc(c.story)}</div>
      <div class="v-char-gloss">${esc(c.gloss)}</div>
    </div>`).join('')

  const tonesHTML = data.tones.map(t => {
    const color = TONE_COLORS[t.tone] ?? TONE_COLORS[0]
    return `
    <div class="v-tone-unit">
      <div class="v-tone-zh" style="color:${color}">${esc(t.zh)}</div>
      <div class="v-tone-svg">${t.svg}</div>
      <div class="v-tone-py">${esc(t.py)}</div>
      <div class="v-tone-desc">${esc(t.desc)}</div>
    </div>`
  }).join('')

  const pinyinHTML = data.tones.map(t => {
    const color = TONE_COLORS[t.tone] ?? TONE_COLORS[0]
    return `<span class="v-py" style="color:${color}">${esc(t.py)}</span>`
  }).join('')

  // Bold quoted words in the mnemonic
  const mnemonicHTML = esc(data.mnemonic)
    .replace(/&quot;([^&]+)&quot;/g, '<strong>"$1"</strong>')

  return `
    <div class="v-card">
      <div class="v-card-head">
        <div class="v-eyebrow">Character Study</div>
        <div class="v-hanzi">${esc(data.h)}</div>
        <div class="v-pinyin-row">${pinyinHTML}</div>
        <div class="v-meaning">${meaning}</div>
      </div>
      <div class="v-card-body">
        <div class="v-section-label">Character Elements</div>
        <div class="v-chars-grid" style="grid-template-columns:repeat(${cols},1fr)">
          ${charsHTML}
        </div>
        <div class="v-section-label">How to Say It</div>
        <div class="v-tip-box">
          <div class="v-tip-label">Tone Guide · Memory Tip</div>
          <div class="v-tone-row">${tonesHTML}</div>
          <div class="v-mnemonic">${mnemonicHTML}</div>
        </div>
      </div>
    </div>`
}

// SVG content comes from trusted data files — inserted via innerHTML intentionally.
// All other fields go through esc() before rendering.
function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
