import { describe, it, expect } from 'vitest'
import { DEFAULT_WORDS } from './data/index.js'
import { HSK1_WORDS } from './data/hsk1.js'

import {
  normalizePinyin,
  getAvailableLevels,
  getFilteredDeck,
  buildCatCounts,
  getStats,
} from './main.js'

describe('Word data integrity', () => {
  it('DEFAULT_WORDS has 64 words', () => {
    expect(DEFAULT_WORDS).toHaveLength(64)
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

  it('handles empty string', () => {
    expect(normalizePinyin('')).toBe('')
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

  it('combines unknownsOnly with category filter', () => {
    const deck = getFilteredDeck(words, 'time', 'all', true, knownSet)
    expect(deck).toHaveLength(1)
    expect(deck[0].h).toBe('C')
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

  it('returns all zeros for empty word list', () => {
    const counts = buildCatCounts([], 'all')
    expect(counts.all).toBe(0)
    expect(counts.time).toBe(0)
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

  it('ignores knownSet entries not in deck', () => {
    const stats = getStats([{ h: 'A' }, { h: 'B' }], new Set(['A', 'X']))
    expect(stats.known).toBe(1)
    expect(stats.stillLearning).toBe(1)
  })
})
