export default {
  h: '工作',
  chars: [
    {
      zh: '工',
      story: 'A carpenter\'s I-beam or ruler — two horizontal platforms connected by a vertical pillar, the tool of labor',
      gloss: 'Work / Labor',
      svg: `<svg viewBox="0 0 90 78" fill="none">
        <line x1="18" y1="18" x2="72" y2="18" stroke="#7c3aed" stroke-width="8" stroke-linecap="round"/>
        <line x1="45" y1="18" x2="45" y2="60" stroke="#7c3aed" stroke-width="8" stroke-linecap="round"/>
        <line x1="18" y1="60" x2="72" y2="60" stroke="#7c3aed" stroke-width="8" stroke-linecap="round"/>
      </svg>`
    },
    {
      zh: '作',
      story: 'Person 亻on the left + 乍 (suddenly making) — a person suddenly and actively creating things',
      gloss: 'Make / Do',
      svg: `<svg viewBox="0 0 90 78" fill="none">
        <circle cx="28" cy="14" r="10" fill="#1a3d6e"/>
        <circle cx="25" cy="12" r="1.6" fill="white"/>
        <circle cx="31" cy="12" r="1.6" fill="white"/>
        <path d="M24,16 Q28,20 32,16" stroke="white" stroke-width="2" stroke-linecap="round" fill="none"/>
        <line x1="28" y1="24" x2="28" y2="46" stroke="#1a3d6e" stroke-width="9" stroke-linecap="round"/>
        <line x1="28" y1="34" x2="14" y2="28" stroke="#1a3d6e" stroke-width="8" stroke-linecap="round"/>
        <line x1="28" y1="34" x2="42" y2="28" stroke="#1a3d6e" stroke-width="8" stroke-linecap="round"/>
        <line x1="28" y1="46" x2="20" y2="66" stroke="#1a3d6e" stroke-width="8" stroke-linecap="round"/>
        <line x1="28" y1="46" x2="36" y2="66" stroke="#1a3d6e" stroke-width="8" stroke-linecap="round"/>
        <line x1="54" y1="14" x2="54" y2="66" stroke="#1a3d6e" stroke-width="3" stroke-linecap="round"/>
        <line x1="54" y1="28" x2="76" y2="20" stroke="#1a3d6e" stroke-width="3" stroke-linecap="round"/>
        <line x1="54" y1="40" x2="76" y2="40" stroke="#1a3d6e" stroke-width="3" stroke-linecap="round"/>
        <line x1="54" y1="52" x2="76" y2="60" stroke="#1a3d6e" stroke-width="3" stroke-linecap="round"/>
      </svg>`
    }
  ],
  tones: [
    {
      zh: '工',
      py: 'gōng',
      tone: 1,
      desc: 'high and flat',
      svg: `<svg viewBox="0 0 54 34">
        <line x1="6" y1="12" x2="48" y2="12" stroke="#7c3aed" stroke-width="2.5" stroke-linecap="round" opacity="0.85"/>
      </svg>`
    },
    {
      zh: '作',
      py: 'zuò',
      tone: 4,
      desc: 'sharp drop',
      svg: `<svg viewBox="0 0 54 34">
        <path d="M 6 6 L 48 28" stroke="#1a3d6e" stroke-width="2.5" stroke-linecap="round" opacity="0.85"/>
        <polyline points="41,24 48,28 43,30" stroke="#1a3d6e" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.85"/>
      </svg>`
    }
  ],
  mnemonic: 'Sounds like "gong zwoh". Picture the I-beam structure (工) of a building and a busy worker (作) hammering inside it — GONG! The building bell rings to start the day (tone 1, flat). ZWO! You drop your tools and get to it (tone 4, sharp). Work time!'
}
