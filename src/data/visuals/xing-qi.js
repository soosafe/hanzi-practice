export default {
  h: '星期',
  chars: [
    {
      zh: '星',
      story: 'Sun 日 on top + life/grow 生 below — a star is a sun that grew in the sky',
      gloss: 'Star',
      svg: `<svg viewBox="0 0 90 78" fill="none">
        <circle cx="45" cy="20" r="14" fill="#7c3aed" opacity="0.15"/>
        <circle cx="45" cy="20" r="8" fill="#7c3aed"/>
        <line x1="45" y1="4" x2="45" y2="10" stroke="#7c3aed" stroke-width="3" stroke-linecap="round"/>
        <line x1="45" y1="30" x2="45" y2="36" stroke="#7c3aed" stroke-width="3" stroke-linecap="round"/>
        <line x1="29" y1="20" x2="35" y2="20" stroke="#7c3aed" stroke-width="3" stroke-linecap="round"/>
        <line x1="55" y1="20" x2="61" y2="20" stroke="#7c3aed" stroke-width="3" stroke-linecap="round"/>
        <line x1="34" y1="9" x2="38" y2="13" stroke="#7c3aed" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="52" y1="27" x2="56" y2="31" stroke="#7c3aed" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="56" y1="9" x2="52" y2="13" stroke="#7c3aed" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="34" y1="31" x2="38" y2="27" stroke="#7c3aed" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="32" y1="44" x2="58" y2="44" stroke="#7c3aed" stroke-width="3" stroke-linecap="round"/>
        <line x1="45" y1="44" x2="45" y2="62" stroke="#7c3aed" stroke-width="8" stroke-linecap="round"/>
        <line x1="30" y1="58" x2="60" y2="58" stroke="#7c3aed" stroke-width="3" stroke-linecap="round"/>
      </svg>`
    },
    {
      zh: '期',
      story: 'Moon 月 + base 其 — the moon\'s cycle marks each period of time',
      gloss: 'Period / Phase',
      svg: `<svg viewBox="0 0 90 78" fill="none">
        <path d="M28,8 Q18,20 18,40 Q18,58 28,66" stroke="#7c3aed" stroke-width="3" stroke-linecap="round" fill="none"/>
        <path d="M28,8 Q38,20 38,40 Q38,58 28,66" stroke="#7c3aed" stroke-width="3" stroke-linecap="round" fill="none"/>
        <line x1="18" y1="26" x2="38" y2="26" stroke="#7c3aed" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="18" y1="44" x2="38" y2="44" stroke="#7c3aed" stroke-width="2.5" stroke-linecap="round"/>
        <rect x="48" y="14" width="28" height="12" rx="2" stroke="#7c3aed" stroke-width="2.5" fill="none"/>
        <rect x="48" y="34" width="28" height="12" rx="2" stroke="#7c3aed" stroke-width="2.5" fill="none"/>
        <rect x="48" y="54" width="28" height="12" rx="2" stroke="#7c3aed" stroke-width="2.5" fill="none"/>
      </svg>`
    }
  ],
  tones: [
    {
      zh: '星',
      py: 'xīng',
      tone: 1,
      desc: 'high and flat',
      svg: `<svg viewBox="0 0 54 34">
        <line x1="6" y1="12" x2="48" y2="12" stroke="#7c3aed" stroke-width="2.5" stroke-linecap="round" opacity="0.85"/>
      </svg>`
    },
    {
      zh: '期',
      py: 'qī',
      tone: 1,
      desc: 'high and flat',
      svg: `<svg viewBox="0 0 54 34">
        <line x1="6" y1="12" x2="48" y2="12" stroke="#7c3aed" stroke-width="2.5" stroke-linecap="round" opacity="0.85"/>
      </svg>`
    }
  ],
  mnemonic: 'Sounds like "shing chee". Picture a SHINING star (星) in the sky that marks the passage of time in phases (期) — one week is one moon CHEE-cle. Both tones stay high and flat like a star hovering still in the night sky.'
}
