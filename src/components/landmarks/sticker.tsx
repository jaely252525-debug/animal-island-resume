import type { ReactElement, ReactNode } from 'react'
import type { LandmarkArtSet } from './types'

/**
 * 风格 B：扁平贴纸 / 徽章
 * ------------------------------------------------------------------
 * - 高饱和纯色平涂，没有任何渐变
 * - feMorphology 把整组图形的 alpha 外扩成一块白色「贴纸底」
 * - feDropShadow(stdDeviation=0) 给一道斜向硬投影（不是柔光）
 * - 圆形虚线底板 + 波点，像从手账上撕下来的一张贴纸
 */
const INK = '#4a3524'
/** 整套贴纸共用同一个底板圈色，保证 5 张像同一本图鉴里撕下来的 */
const ACCENT = '#ff8a6b'

function Sticker({ accent, children }: { accent: string; children: ReactNode }) {
  return (
    <svg viewBox="0 0 200 200" className="landmark-svg" aria-hidden="true">
      <defs>
        <filter id="st-shadow" x="-35%" y="-35%" width="175%" height="175%">
          <feDropShadow dx="4" dy="7" stdDeviation="0" floodColor="#a7814f" floodOpacity="0.5" />
        </filter>
        <filter id="st-outline" x="-25%" y="-25%" width="150%" height="150%">
          <feMorphology in="SourceAlpha" operator="dilate" radius="4.5" result="grown" />
          <feFlood floodColor="#fffdf6" result="white" />
          <feComposite in="white" in2="grown" operator="in" result="edge" />
          <feMerge>
            <feMergeNode in="edge" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <clipPath id="st-lh-clip">
          <path d="M76 158 L124 158 L112 58 L88 58 Z" />
        </clipPath>
      </defs>

      {/* 贴纸底板 */}
      <g filter="url(#st-shadow)">
        <circle cx="100" cy="100" r="91" fill="#fffaf0" stroke={accent} strokeWidth="4.5" />
        <circle cx="100" cy="100" r="81" fill="none" stroke={accent} strokeWidth="2" strokeDasharray="3 8" opacity="0.6" />
      </g>
      <g fill={accent} opacity="0.32">
        <circle cx="34" cy="42" r="3" /><circle cx="166" cy="42" r="3" />
        <circle cx="30" cy="150" r="2.5" /><circle cx="170" cy="150" r="2.5" />
      </g>
      {/* 顶部小星星装饰 */}
      <path d="M100 18 l3.2 7 7.6.8 -5.6 5.2 1.5 7.5 -6.7-3.8 -6.7 3.8 1.5-7.5 -5.6-5.2 7.6-.8 Z" fill="#ffd452" stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />

      {/* 主体：自动白描边 */}
      <g filter="url(#st-outline)" stroke={INK} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round">
        {children}
      </g>
    </svg>
  )
}

function House(): ReactElement {
  return (
    <Sticker accent={ACCENT}>
      <ellipse cx="100" cy="164" rx="66" ry="11" fill="#8fc96a" />
      {/* 烟囱先画，屋顶压住下半截 */}
      <rect x="122" y="54" width="16" height="28" rx="2" fill="#c97c5b" />
      <rect x="119" y="51" width="22" height="7" rx="2" fill="#e0936f" />
      {/* 墙体 */}
      <rect x="52" y="100" width="96" height="62" rx="5" fill="#ffd98a" />
      {/* 屋顶 */}
      <path d="M38 102 L100 46 L162 102 Z" fill="#ff7a66" />
      <rect x="37" y="100" width="126" height="8" rx="3" fill="#d95a4b" />
      <g stroke="#ffd0c0" strokeWidth="2.4" opacity="0.85">
        <path d="M60 90 H82 M72 78 H88 M84 66 H94" />
        <path d="M118 66 H130 M112 78 H134 M116 90 H142" />
      </g>
      {/* 门 */}
      <path d="M86 162 V134 a14 14 0 0 1 28 0 v28 Z" fill="#b9713f" />
      <circle cx="108" cy="146" r="2.6" fill="#ffd452" stroke="none" />
      {/* 窗 */}
      <rect x="60" y="116" width="24" height="24" rx="4" fill="#7fd6e8" />
      <path d="M72 116 V140 M60 128 H84" strokeWidth="1.8" />
      <rect x="118" y="116" width="22" height="24" rx="4" fill="#7fd6e8" />
      <path d="M129 116 V140 M118 128 H140" strokeWidth="1.8" />
      {/* 花坛 */}
      <circle cx="58" cy="156" r="4.5" fill="#ff9fb4" />
      <circle cx="68" cy="160" r="4" fill="#ffd452" />
      <circle cx="142" cy="158" r="4.5" fill="#b39ae8" />
    </Sticker>
  )
}

function Lighthouse(): ReactElement {
  return (
    <Sticker accent={ACCENT}>
      {/* 光束 */}
      <path d="M100 42 L148 32 L148 56 Z" fill="#ffe38a" opacity="0.55" stroke="none" />
      <path d="M100 42 L52 32 L52 56 Z" fill="#ffe38a" opacity="0.4" stroke="none" />
      {/* 岩石 */}
      <path d="M52 168 q6 -18 20 -18 h56 q14 0 20 18 Z" fill="#a8b89a" />
      <ellipse cx="100" cy="149" rx="28" ry="6" fill="#c3d0ad" stroke="none" />
      {/* 塔身 */}
      <path d="M76 158 L124 158 L112 58 L88 58 Z" fill="#fff6e0" />
      <g clipPath="url(#st-lh-clip)" stroke="none">
        <rect x="70" y="68" width="60" height="16" fill="#f0574b" />
        <rect x="70" y="104" width="60" height="16" fill="#f0574b" />
        <rect x="70" y="138" width="60" height="16" fill="#f0574b" />
      </g>
      {/* 小窗 */}
      <circle cx="100" cy="94" r="6" fill="#7fd6e8" />
      <circle cx="100" cy="130" r="6" fill="#7fd6e8" />
      {/* 平台 + 栏杆 */}
      <rect x="74" y="52" width="52" height="8" rx="2" fill="#6e8ca8" />
      <g strokeWidth="2.6"><path d="M78 52 V42 M90 52 V42 M110 52 V42 M122 52 V42 M74 42 H126" /></g>
      {/* 灯室 */}
      <rect x="86" y="30" width="28" height="22" rx="3" fill="#ffd452" />
      <path d="M100 30 V52" strokeWidth="1.8" />
      <path d="M78 30 L100 14 L122 30 Z" fill="#f0574b" />
      <circle cx="100" cy="12" r="3.5" fill="#ffd452" />
      {/* 星星 */}
      <g fill="#ffd452" strokeWidth="1.4">
        <path d="M42 44 l2 4.5 5 .5 -3.7 3.4 1 5 -4.3-2.5 -4.3 2.5 1-5 -3.7-3.4 5-.5 Z" />
        <path d="M158 84 l2 4.5 5 .5 -3.7 3.4 1 5 -4.3-2.5 -4.3 2.5 1-5 -3.7-3.4 5-.5 Z" />
      </g>
    </Sticker>
  )
}

function Orchard(): ReactElement {
  const fruit = (x: number, y: number, r = 7) => (
    <g>
      <circle cx={x} cy={y} r={r} fill="#ff5e4d" />
      <circle cx={x - r * 0.34} cy={y - r * 0.36} r={r * 0.24} fill="#fff" stroke="none" />
      <path d={`M${x} ${y - r} q2 -4 5 -4`} strokeWidth="1.8" fill="none" />
    </g>
  )
  return (
    <Sticker accent={ACCENT}>
      <ellipse cx="100" cy="164" rx="70" ry="11" fill="#8fc96a" />
      {/* 后方小树 */}
      <path d="M146 156 q-3 -24 2 -34 h9 q4 12 1 34 Z" fill="#b6763e" />
      <circle cx="152" cy="110" r="22" fill="#58b45c" />
      {fruit(144, 116, 5)}{fruit(162, 112, 4.5)}
      {/* 主树干 */}
      <path d="M88 160 q-5 -30 0 -52 h24 q5 22 0 52 Z" fill="#b6763e" />
      {/* 树冠：纯色圆块叠出层次 */}
      <circle cx="98" cy="80" r="40" fill="#6fcb6b" />
      <circle cx="66" cy="94" r="23" fill="#58b45c" />
      <circle cx="128" cy="94" r="22" fill="#58b45c" />
      <circle cx="94" cy="56" r="24" fill="#8bdd7b" />
      <path d="M78 50 q10 -8 20 -6" stroke="#d8f2ae" strokeWidth="3.5" fill="none" opacity="0.9" />
      {fruit(72, 84)}{fruit(108, 68)}{fruit(118, 100, 6)}{fruit(86, 102, 6)}{fruit(60, 72, 5.5)}
      {/* 落果 */}
      {fruit(128, 158, 6)}{fruit(52, 158, 5)}
      {/* 小花 */}
      <circle cx="42" cy="160" r="3.5" fill="#fff3c4" />
      <circle cx="160" cy="160" r="3.5" fill="#ff9fb4" />
    </Sticker>
  )
}

function Lookout(): ReactElement {
  return (
    <Sticker accent={ACCENT}>
      <ellipse cx="100" cy="166" rx="64" ry="10" fill="#8fc96a" />
      {/* 支架腿 */}
      <g fill="#b6763e">
        <rect x="62" y="98" width="10" height="64" rx="2" transform="rotate(-5 67 130)" />
        <rect x="128" y="98" width="10" height="64" rx="2" transform="rotate(5 133 130)" />
        <rect x="80" y="102" width="8" height="58" rx="2" />
        <rect x="112" y="102" width="8" height="58" rx="2" />
      </g>
      <path d="M64 140 H136 M66 124 H134" strokeWidth="4" />
      {/* 道具格 */}
      <rect x="76" y="120" width="48" height="26" rx="3" fill="#e0a55c" />
      <g strokeWidth="1.4">
        <rect x="80" y="124" width="8" height="18" rx="1" fill="#ff7a66" />
        <rect x="89" y="124" width="8" height="18" rx="1" fill="#ffd452" />
        <rect x="103" y="124" width="8" height="18" rx="1" fill="#5ec8c0" />
        <rect x="112" y="124" width="8" height="18" rx="1" fill="#b39ae8" />
      </g>
      {/* 平台 + 护栏 */}
      <rect x="50" y="94" width="100" height="12" rx="3" fill="#e0a55c" />
      <g strokeWidth="3"><path d="M56 94 V76 M76 94 V76 M124 94 V76 M144 94 V76 M54 76 H146" /></g>
      {/* 望远镜 */}
      <g transform="rotate(-18 104 66)">
        <rect x="90" y="58" width="34" height="14" rx="6" fill="#6e8ca8" />
        <rect x="120" y="56" width="9" height="18" rx="3" fill="#9bb4cc" />
        <ellipse cx="129" cy="65" rx="3" ry="8" fill="#d7eff5" />
      </g>
      <path d="M104 74 V84 M96 84 H112" strokeWidth="3" />
      {/* 屋顶 */}
      <path d="M44 56 L100 26 L156 56 Z" fill="#4fc3bc" />
      <rect x="42" y="54" width="116" height="8" rx="3" fill="#3ba39c" />
      <path d="M58 48 L76 48 M70 40 L86 40" stroke="#c9f2ec" strokeWidth="3" />
      {/* 旗 */}
      <path d="M100 26 V10" strokeWidth="2.6" />
      <path d="M100 11 L120 16 L100 22 Z" fill="#ff7a66" />
    </Sticker>
  )
}

function Mailbox(): ReactElement {
  return (
    <Sticker accent={ACCENT}>
      <ellipse cx="100" cy="164" rx="68" ry="11" fill="#f2d99a" />
      {/* 木柱 + 横撑 */}
      <rect x="92" y="112" width="16" height="52" rx="3" fill="#b6763e" />
      <rect x="78" y="132" width="44" height="8" rx="3" fill="#c98a4e" />
      {/* 信件 */}
      <g transform="rotate(-8 100 92)">
        <rect x="86" y="74" width="30" height="22" rx="2" fill="#fffaf0" />
        <path d="M86 76 L101 88 L116 76" fill="none" strokeWidth="1.8" />
      </g>
      {/* 箱体 */}
      <path d="M56 116 V92 A44 44 0 0 1 144 92 V116 Z" fill="#ff6f61" />
      <path d="M64 88 A36 36 0 0 1 100 54" fill="none" stroke="#ffc2ac" strokeWidth="4" />
      <rect x="52" y="114" width="96" height="10" rx="3" fill="#d9504a" />
      <rect x="82" y="100" width="36" height="6" rx="3" fill="#8e3b34" strokeWidth="1.4" />
      <circle cx="100" cy="110" r="2.6" fill="#ffd452" stroke="none" />
      {/* 红旗 */}
      <path d="M144 78 V52" strokeWidth="3" />
      <path d="M144 53 L166 58 L144 65 Z" fill="#ffc93c" />
      {/* 海浪 + 贝壳 */}
      <path d="M36 152 q6 -6 12 0 t12 0" fill="none" stroke="#6ec0d4" strokeWidth="3" />
      <path d="M148 150 q6 -6 12 0 t12 0" fill="none" stroke="#6ec0d4" strokeWidth="3" />
      <circle cx="48" cy="160" r="4" fill="#fff8e4" />
      <path d="M148 160 l3 -5 3 5 -2 2 1 3 -4 -2 -4 2 1 -3 Z" fill="#ff9fb4" strokeWidth="1.4" />
    </Sticker>
  )
}

/** 风格注册表：扁平贴纸版 */
export const STICKER: LandmarkArtSet = {
  about: House,
  work: Lighthouse,
  projects: Orchard,
  skills: Lookout,
  contact: Mailbox,
}
