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
