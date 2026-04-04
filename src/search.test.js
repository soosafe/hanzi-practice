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

  it('matches by English meaning', () => {
    const results = searchWords('Hello', words)
    expect(results).toHaveLength(1)
    expect(results[0].h).toBe('你好')
  })

  it('meaning search is case-insensitive', () => {
    const results = searchWords('hello', words)
    expect(results).toHaveLength(1)
    expect(results[0].h).toBe('你好')
  })

  it('matches partial meaning', () => {
    const results = searchWords('stud', words)
    expect(results).toHaveLength(1)
    expect(results[0].h).toBe('学习')
  })
})
