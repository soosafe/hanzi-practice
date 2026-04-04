export default {
  h: '太好了',
  chars: [
    {
      zh: '太',
      story: '大 big person + the red dot',
      gloss: 'So / Very',
      svg: `<svg viewBox="0 0 90 78" fill="none">
        <circle cx="38" cy="13" r="11" fill="#1a3d6e"/>
        <circle cx="34" cy="11" r="1.8" fill="white"/>
        <circle cx="42" cy="11" r="1.8" fill="white"/>
        <path d="M33,16 Q38,21 43,16" stroke="white" stroke-width="2" stroke-linecap="round" fill="none"/>
        <line x1="38" y1="24" x2="38" y2="46" stroke="#1a3d6e" stroke-width="10" stroke-linecap="round"/>
        <line x1="38" y1="31" x2="10" y2="27" stroke="#1a3d6e" stroke-width="9" stroke-linecap="round"/>
        <line x1="38" y1="31" x2="60" y2="27" stroke="#1a3d6e" stroke-width="9" stroke-linecap="round"/>
        <line x1="38" y1="46" x2="27" y2="66" stroke="#1a3d6e" stroke-width="9" stroke-linecap="round"/>
        <line x1="38" y1="46" x2="49" y2="66" stroke="#1a3d6e" stroke-width="9" stroke-linecap="round"/>
        <circle cx="74" cy="38" r="10" fill="#b83228"/>
      </svg>`
    },
    {
      zh: '好',
      story: '女 woman + 子 child = joy',
      gloss: 'Good',
      svg: `<svg viewBox="0 0 90 78" fill="none">
        <circle cx="22" cy="13" r="9" fill="#256344"/>
        <circle cx="19" cy="11" r="1.5" fill="white"/>
        <circle cx="25" cy="11" r="1.5" fill="white"/>
        <path d="M18,15 Q22,19 26,15" stroke="white" stroke-width="1.8" stroke-linecap="round" fill="none"/>
        <line x1="22" y1="22" x2="22" y2="50" stroke="#256344" stroke-width="9" stroke-linecap="round"/>
        <line x1="22" y1="30" x2="12" y2="44" stroke="#256344" stroke-width="8" stroke-linecap="round"/>
        <line x1="22" y1="30" x2="32" y2="44" stroke="#256344" stroke-width="8" stroke-linecap="round"/>
        <line x1="22" y1="50" x2="16" y2="68" stroke="#256344" stroke-width="8" stroke-linecap="round"/>
        <line x1="22" y1="50" x2="28" y2="68" stroke="#256344" stroke-width="8" stroke-linecap="round"/>
        <text x="45" y="40" font-size="15" fill="#c0bdb7" font-family="sans-serif" text-anchor="middle" font-weight="700">+</text>
        <circle cx="68" cy="17" r="8" fill="#b83228"/>
        <circle cx="65" cy="15" r="1.4" fill="white"/>
        <circle cx="71" cy="15" r="1.4" fill="white"/>
        <path d="M64,19 Q68,23 72,19" stroke="white" stroke-width="1.6" stroke-linecap="round" fill="none"/>
        <line x1="68" y1="25" x2="68" y2="50" stroke="#b83228" stroke-width="9" stroke-linecap="round"/>
        <line x1="68" y1="32" x2="56" y2="20" stroke="#b83228" stroke-width="8" stroke-linecap="round"/>
        <line x1="68" y1="32" x2="80" y2="20" stroke="#b83228" stroke-width="8" stroke-linecap="round"/>
        <line x1="68" y1="50" x2="62" y2="66" stroke="#b83228" stroke-width="8" stroke-linecap="round"/>
        <line x1="68" y1="50" x2="74" y2="66" stroke="#b83228" stroke-width="8" stroke-linecap="round"/>
      </svg>`
    },
    {
      zh: '了',
      story: 'Hook stroke + closing dot',
      gloss: 'Done / !',
      svg: `<svg viewBox="0 0 90 78" fill="none">
        <line x1="24" y1="16" x2="58" y2="16" stroke="#8a5e00" stroke-width="8" stroke-linecap="round"/>
        <path d="M 41 16 L 41 54 Q 41 66 26 66" stroke="#8a5e00" stroke-width="8" stroke-linecap="round" fill="none"/>
        <circle cx="68" cy="62" r="9" fill="#8a5e00" opacity="0.75"/>
      </svg>`
    }
  ],
  tones: [
    {
      zh: '太',
      py: 'tài',
      tone: 4,
      desc: 'sharp drop',
      svg: `<svg viewBox="0 0 54 34">
        <path d="M 6 6 L 48 28" stroke="#1a3d6e" stroke-width="2.5" stroke-linecap="round" opacity="0.85"/>
        <polyline points="41,24 48,28 43,30" stroke="#1a3d6e" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.85"/>
      </svg>`
    },
    {
      zh: '好',
      py: 'hǎo',
      tone: 3,
      desc: 'dip then rise',
      svg: `<svg viewBox="0 0 54 34">
        <path d="M 6 8 Q 14 28 27 30 Q 40 31 48 10" stroke="#256344" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.85"/>
        <polyline points="43,16 48,10 51,17" stroke="#256344" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.85"/>
      </svg>`
    },
    {
      zh: '了',
      py: 'le',
      tone: 0,
      desc: 'soft and light',
      svg: `<svg viewBox="0 0 54 34">
        <line x1="12" y1="20" x2="42" y2="20" stroke="#8a5e00" stroke-width="1.5" stroke-linecap="round" opacity="0.25"/>
        <circle cx="27" cy="20" r="5" fill="#8a5e00" opacity="0.65"/>
      </svg>`
    }
  ],
  mnemonic: 'Sounds like "tie" + "how" + "luh". Picture someone reacting to great news: voice drops hard on tài, dips then bounces on hǎo, and whispers on le.'
}
