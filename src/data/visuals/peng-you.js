export default {
  h: '朋友',
  chars: [
    {
      zh: '朋',
      story: 'Two moon 月 shapes side by side — two moons always paired together, matching companions',
      gloss: 'Companion',
      svg: `<svg viewBox="0 0 90 78" fill="none">
        <path d="M14,10 Q8,22 8,40 Q8,56 14,64" stroke="#b83228" stroke-width="3" stroke-linecap="round" fill="none"/>
        <path d="M14,10 Q20,22 20,40 Q20,56 14,64" stroke="#b83228" stroke-width="3" stroke-linecap="round" fill="none"/>
        <line x1="8" y1="28" x2="20" y2="28" stroke="#b83228" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="8" y1="46" x2="20" y2="46" stroke="#b83228" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M36,10 Q30,22 30,40 Q30,56 36,64" stroke="#b83228" stroke-width="3" stroke-linecap="round" fill="none"/>
        <path d="M36,10 Q42,22 42,40 Q42,56 36,64" stroke="#b83228" stroke-width="3" stroke-linecap="round" fill="none"/>
        <line x1="30" y1="28" x2="42" y2="28" stroke="#b83228" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="30" y1="46" x2="42" y2="46" stroke="#b83228" stroke-width="2.5" stroke-linecap="round"/>
        <text x="62" y="44" font-size="12" fill="#b83228" font-family="sans-serif" text-anchor="middle" font-weight="600" opacity="0.6">×2</text>
      </svg>`
    },
    {
      zh: '友',
      story: '又 hand shape repeated — two hands reaching toward each other in greeting',
      gloss: 'Friend',
      svg: `<svg viewBox="0 0 90 78" fill="none">
        <line x1="18" y1="30" x2="42" y2="20" stroke="#256344" stroke-width="9" stroke-linecap="round"/>
        <line x1="18" y1="44" x2="42" y2="54" stroke="#256344" stroke-width="9" stroke-linecap="round"/>
        <circle cx="12" cy="37" r="8" fill="#256344"/>
        <circle cx="9" cy="35" r="1.4" fill="white"/>
        <circle cx="15" cy="35" r="1.4" fill="white"/>
        <path d="M9,39 Q12,42 15,39" stroke="white" stroke-width="1.5" stroke-linecap="round" fill="none"/>
        <line x1="48" y1="44" x2="72" y2="54" stroke="#256344" stroke-width="9" stroke-linecap="round"/>
        <line x1="48" y1="30" x2="72" y2="20" stroke="#256344" stroke-width="9" stroke-linecap="round"/>
        <circle cx="78" cy="37" r="8" fill="#256344"/>
        <circle cx="75" cy="35" r="1.4" fill="white"/>
        <circle cx="81" cy="35" r="1.4" fill="white"/>
        <path d="M75,39 Q78,42 81,39" stroke="white" stroke-width="1.5" stroke-linecap="round" fill="none"/>
      </svg>`
    }
  ],
  tones: [
    {
      zh: '朋',
      py: 'péng',
      tone: 2,
      desc: 'rising',
      svg: `<svg viewBox="0 0 54 34">
        <path d="M 6 28 L 48 6" stroke="#b83228" stroke-width="2.5" stroke-linecap="round" opacity="0.85"/>
        <polyline points="41,8 48,6 47,13" stroke="#b83228" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.85"/>
      </svg>`
    },
    {
      zh: '友',
      py: 'yǒu',
      tone: 3,
      desc: 'dip then rise',
      svg: `<svg viewBox="0 0 54 34">
        <path d="M 6 8 Q 14 28 27 30 Q 40 31 48 10" stroke="#256344" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.85"/>
        <polyline points="43,16 48,10 51,17" stroke="#256344" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.85"/>
      </svg>`
    }
  ],
  mnemonic: 'Sounds like "pung yo". Picture two matching moons (朋) and two smiling people reaching for each other (友) — PUNG! Your heart leaps when you see your YO! Friends are moons that always come in pairs.'
}
