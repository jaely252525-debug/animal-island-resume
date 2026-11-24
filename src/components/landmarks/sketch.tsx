import type { ReactElement, ReactNode } from 'react'
import type { LandmarkArtSet } from './types'

/**
 * 风格 D：手绘线稿 / 淡彩手账
 * ------------------------------------------------------------------
 * - 米黄纸底 + 纸纹点 + 半透明胶带，像速写本撕下的一页
 * - 淡彩层故意错位 2px，勾线用微微弯曲的 path，保留手抖感
 * - 斜线 pattern 做铅笔排线阴影，不用任何渐变
 * - 没有 AO / 硬投影，靠线条疏密表达体积
 */
const INK = '#5b4632'
const W = {
  red: '#d98d76', redD: '#c47460',
  cream: '#f0dfb5', creamD: '#dcc495',
  yellow: '#e8c877',
  green: '#9fb87c', greenD: '#83a065',
  teal: '#7fa9b8', tealD: '#638f9e',
  wood: '#d0a878', woodD: '#b08a5c',
  sand: '#e8d3a4',
  blue: '#8aa8c0',
  white: '#fffaf0',
}

/** 手绘页面：纸、胶带、纸纹、排线 pattern */
function SketchPage({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 200 200" className="landmark-svg" aria-hidden="true">
      <defs>
        <pattern id="sk-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(38)">
          <path d="M0 0 V7" stroke={INK} strokeWidth="1" opacity="0.42" />
        </pattern>
        <pattern id="sk-dots" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="4" r="0.8" fill="#c9b48d" opacity="0.5" />
          <circle cx="11" cy="12" r="0.6" fill="#c9b48d" opacity="0.4" />
        </pattern>
      </defs>

      {/* 纸张 + 轻微倾斜 */}
      <g transform="rotate(-1.2 100 100)">
        <rect x="9" y="9" width="182" height="182" rx="14" fill="#fffaf0" stroke="#e3d5b5" strokeWidth="2" />
        <rect x="9" y="9" width="182" height="182" rx="14" fill="url(#sk-dots)" />
        {/* 手绘内框 */}
        <rect x="17" y="17" width="166" height="166" rx="10" fill="none" stroke="#d8c8a4" strokeWidth="1.4" strokeDasharray="5 6" />
        {/* 胶带 */}
        <g transform="rotate(-13 46 20)">
          <rect x="24" y="13" width="46" height="15" rx="2" fill="#f0d79f" opacity="0.72" />
          <path d="M28 16 H66 M28 25 H66" stroke="#d9bd80" strokeWidth="1" opacity="0.7" />
        </g>
      </g>

      {children}

      {/* 页脚手写下划线 + 涂鸦小星 */}
      <path d="M74 186 q26 3 52 -1" fill="none" stroke="#c9ad7f" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M170 176 l1.6 3.4 3.7.4 -2.8 2.5.8 3.6 -3.3-1.9 -3.3 1.9.8-3.6 -2.8-2.5 3.7-.4 Z" fill="#e8c877" stroke={INK} strokeWidth="0.8" strokeLinejoin="round" />
    </svg>
  )
}

/** 线稿通用笔触属性 */
const pen = {
  fill: 'none',
  stroke: INK,
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

function House(): ReactElement {
  return (
    <SketchPage>
      {/* 淡彩层（故意错位） */}
      <g opacity="0.58" transform="translate(-2 2)">
        <path d="M28 168 q40 -9 76 -6 t70 5 v10 H28 Z" fill={W.green} />
        <path d="M52 100 q46 -3 96 0 v62 H52 Z" fill={W.cream} />
        <path d="M38 102 L99 46 l61 56 Z" fill={W.red} />
        <path d="M86 162 v-28 q14 -13 28 0 v28 Z" fill={W.wood} />
        <rect x="59" y="115" width="23" height="23" rx="4" fill={W.teal} />
        <rect x="119" y="115" width="21" height="23" rx="4" fill={W.teal} />
      </g>
      {/* 铅笔排线阴影 */}
      <path d="M130 100 L150 100 L150 160 L130 160 Z" fill="url(#sk-hatch)" opacity="0.75" />
      <path d="M100 48 L160 102 L142 102 Z" fill="url(#sk-hatch)" opacity="0.6" />
      {/* 线稿 */}
      <g {...pen}>
        <path d="M27 166 q38 -8 74 -6 t72 4" />
        <path d="M52 162 V100 q47 -3 96 0 v62" />
        <path d="M52 118 q46 -2 96 0 M52 138 q47 2 96 0" strokeWidth="1.2" opacity="0.7" />
        <path d="M37 102 q2 -4 7 -7 L98 45 q2 -2 4 0 l57 50 q4 4 4 7" />
        <path d="M38 102 q61 4 124 0" />
        <path d="M122 80 l1 -26 q7 -2 14 0 l-1 19" />
        <path d="M119 54 q9 -3 20 0" />
        <path d="M58 91 q18 -2 34 0 M68 79 q16 -2 26 0 M80 65 q10 -1 16 0" strokeWidth="1.3" opacity="0.8" />
        <path d="M112 84 q16 -1 30 0 M118 72 q14 -1 26 0" strokeWidth="1.3" opacity="0.8" />
        <path d="M86 162 v-28 q14 -13 28 0 v28" />
        <circle cx="108" cy="146" r="2" fill={INK} stroke="none" />
        <rect x="59" y="115" width="23" height="23" rx="4" />
        <path d="M70 115 v23 M59 127 h23" strokeWidth="1.4" />
        <rect x="119" y="115" width="21" height="23" rx="4" />
        <path d="M129 115 v23 M119 127 h21" strokeWidth="1.4" />
        <path d="M56 158 q-3 -6 0 -9 M68 162 q-2 -5 0 -8 M142 158 q-3 -6 1 -9" strokeWidth="1.4" />
      </g>
      <g fill={W.redD} opacity="0.85"><circle cx="56" cy="149" r="3.4" /><circle cx="143" cy="149" r="3.4" /></g>
      <g fill={W.yellow} opacity="0.9"><circle cx="68" cy="153" r="3" /></g>
      {/* 涂鸦小箭头 */}
      <path d="M158 118 q8 -5 12 1 m-4 -4 l4 4 -5 2" {...pen} strokeWidth="1.3" opacity="0.7" />
    </SketchPage>
  )
}

function Lighthouse(): ReactElement {
  return (
    <SketchPage>
      {/* 光束淡彩 */}
      <g opacity="0.3" transform="translate(-2 2)">
        <path d="M100 40 L178 20 L178 62 Z" fill={W.yellow} />
        <path d="M100 40 L22 20 L22 62 Z" fill={W.yellow} />
      </g>
      <g opacity="0.58">
        <path d="M56 166 q8 -16 22 -16 h46 q14 0 20 16 Z" fill={W.greenD} />
        <path d="M76 156 L124 156 L112 56 L88 56 Z" fill={W.cream} />
        <path d="M76 78 h48 v14 H76 Z M79 114 h42 v14 H79 Z M74 140 h52 v14 H74 Z" fill={W.red} />
        <rect x="86" y="28" width="28" height="20" rx="3" fill={W.yellow} />
        <path d="M78 28 L100 12 L122 28 Z" fill={W.red} />
      </g>
      <path d="M104 58 L114 58 L126 156 L112 156 Z" fill="url(#sk-hatch)" opacity="0.7" />
      {/* 线稿 */}
      <g {...pen}>
        <path d="M54 166 q9 -17 23 -16 h46 q15 -1 21 16" />
        <path d="M76 156 l12 -100 h24 l12 100" />
        <path d="M78 78 q22 -2 44 0 M78 92 q22 2 44 0 M80 114 q20 -2 40 0 M80 128 q20 2 40 0 M74 140 q26 -2 52 0" strokeWidth="1.5" />
        <path d="M84 56 q16 -3 32 0 M74 56 q26 -3 52 0" />
        <path d="M76 50 v-10 M88 50 v-10 M112 50 v-10 M124 50 v-10 M73 40 q27 -3 54 0" strokeWidth="1.5" />
        <rect x="86" y="28" width="28" height="20" rx="3" />
        <path d="M100 28 v20" strokeWidth="1.3" />
        <path d="M78 28 L100 12 L122 28" />
        <circle cx="100" cy="9" r="2.6" />
        <circle cx="100" cy="92" r="5" />
        <circle cx="100" cy="130" r="5" />
        <path d="M100 40 L176 22 M100 40 L24 22" strokeWidth="1.2" strokeDasharray="4 5" opacity="0.65" />
      </g>
      {/* 涂鸦小星 */}
      <g fill={W.yellow} stroke={INK} strokeWidth="0.9">
        <path d="M40 54 l1.5 3.2 3.5.4 -2.6 2.4.7 3.4 -3.1-1.8 -3.1 1.8.7-3.4 -2.6-2.4 3.5-.4 Z" />
        <path d="M160 92 l1.5 3.2 3.5.4 -2.6 2.4.7 3.4 -3.1-1.8 -3.1 1.8.7-3.4 -2.6-2.4 3.5-.4 Z" />
      </g>
    </SketchPage>
  )
}

function Orchard(): ReactElement {
  const fruit = (x: number, y: number, r = 6.5, key = '') => (
    <g key={key}>
      <circle cx={x - 2} cy={y + 2} r={r} fill={W.red} opacity="0.62" />
      <g {...pen} strokeWidth="1.6">
        <circle cx={x} cy={y} r={r} />
        <path d={`M${x} ${y - r} q2 -4 5 -4`} />
      </g>
      <circle cx={x - r * 0.4} cy={y - r * 0.4} r={1.4} fill={W.white} />
    </g>
  )
  return (
    <SketchPage>
      <g opacity="0.55" transform="translate(-2 2)">
        <path d="M26 168 q40 -9 76 -6 t72 5 v10 H26 Z" fill={W.green} />
        <path d="M88 158 q-5 -30 0 -52 h22 q5 22 0 52 Z" fill={W.wood} />
        <circle cx="96" cy="80" r="40" fill={W.green} />
        <circle cx="66" cy="94" r="23" fill={W.greenD} />
        <circle cx="126" cy="92" r="22" fill={W.greenD} />
        <circle cx="94" cy="54" r="24" fill={W.green} />
        <path d="M146 152 q-3 -24 2 -34 h9 q4 12 1 34 Z" fill={W.wood} />
        <circle cx="152" cy="108" r="21" fill={W.green} />
      </g>
      <path d="M104 108 q20 4 32 -14 l0 22 q-18 8 -32 -2 Z" fill="url(#sk-hatch)" opacity="0.62" />
      <g {...pen}>
        <path d="M27 166 q40 -8 74 -6 t72 4" />
        <path d="M88 158 q-5 -30 0 -52 M110 106 q5 22 0 52" />
        <path d="M96 152 q-3 -20 0 -34" strokeWidth="1.2" opacity="0.75" />
        {/* 手抖树冠轮廓 */}
        <path d="M58 88 q-6 -20 8 -32 q8 -8 18 -8 q4 -16 20 -16 q18 0 22 16 q16 2 18 18 q8 12 0 26 q-8 14 -24 14 q-10 8 -26 4 q-20 4 -30 -8 q-8 -8 -6 -14 Z" />
        <path d="M64 60 q12 -10 24 -6 M72 104 q16 6 30 0 M118 56 q10 4 12 14" strokeWidth="1.3" opacity="0.8" />
        <path d="M146 152 q-3 -24 2 -34 M157 118 q4 12 1 34" />
        <path d="M132 108 q-4 -16 10 -20 q14 -2 20 10 q6 12 -4 20 q-12 8 -22 -2 Z" strokeWidth="1.7" />
        <path d="M40 160 q-2 -5 1 -8 M160 160 q-2 -5 1 -8" strokeWidth="1.3" />
      </g>
      {fruit(70, 82, 6.5, 'f1')}{fruit(104, 66, 6.5, 'f2')}{fruit(116, 98, 6, 'f3')}
      {fruit(84, 100, 6, 'f4')}{fruit(58, 70, 5.5, 'f5')}
      {fruit(126, 156, 6, 'f6')}{fruit(50, 156, 5, 'f7')}
      <g fill={W.white} stroke={INK} strokeWidth="0.9"><circle cx="40" cy="152" r="3" /><circle cx="160" cy="152" r="3" /></g>
    </SketchPage>
  )
}

function Lookout(): ReactElement {
  return (
    <SketchPage>
      <g opacity="0.55" transform="translate(-2 2)">
        <path d="M28 168 q40 -9 72 -6 t72 5 v10 H28 Z" fill={W.green} />
        <path d="M56 96 L100 82 L144 96 L100 110 Z" fill={W.wood} />
        <path d="M52 52 L100 28 L148 52 Z" fill={W.teal} />
        <rect x="76" y="118" width="48" height="26" rx="3" fill={W.wood} />
        <rect x="80" y="122" width="8" height="18" fill={W.red} />
        <rect x="89" y="122" width="8" height="18" fill={W.yellow} />
        <rect x="103" y="122" width="8" height="18" fill={W.teal} />
        <rect x="112" y="122" width="8" height="18" fill={W.blue} />
      </g>
      <path d="M100 110 L144 96 L144 104 L100 118 Z" fill="url(#sk-hatch)" opacity="0.72" />
      <g {...pen}>
        <path d="M27 166 q40 -8 74 -6 t72 4" />
        {/* 腿 */}
        <path d="M70 96 l-8 68 M130 96 l8 68 M84 100 l-4 62 M116 100 l4 62" strokeWidth="3" />
        <path d="M66 146 q34 3 68 0 M68 130 q32 2 64 0" strokeWidth="1.6" />
        {/* 道具格 */}
        <rect x="76" y="118" width="48" height="26" rx="3" />
        <path d="M100 118 v26" strokeWidth="1.3" />
        {/* 平台（等距） */}
        <path d="M56 96 L100 82 L144 96 L100 110 Z" />
        <path d="M56 96 l0 8 l44 14 v-8 Z M100 110 l44 -14 v8 l-44 14 Z" strokeWidth="1.5" />
        {/* 护栏 */}
        <path d="M62 94 V76 M82 88 V70 M118 88 V70 M138 94 V76" strokeWidth="2.4" />
        <path d="M62 76 L82 70 M118 70 L138 76" strokeWidth="2" />
        {/* 望远镜 */}
        <g transform="rotate(-18 104 66)">
          <rect x="92" y="58" width="32" height="13" rx="6" />
          <path d="M124 56 v17 M100 61 h14" strokeWidth="1.2" />
        </g>
        <path d="M104 74 v10 M96 84 h16" strokeWidth="2.2" />
        {/* 屋顶 */}
        <path d="M50 52 L100 27 q2 -1 3 0 l45 25" />
        <path d="M50 52 q50 3 100 0 M50 52 v5 q50 3 100 0 v-5" strokeWidth="1.5" />
        <path d="M62 46 q16 -3 28 -6" strokeWidth="1.2" opacity="0.75" />
        {/* 旗 */}
        <path d="M100 28 V9 M100 10 l20 5 -20 10" />
      </g>
      <path d="M158 118 q8 -5 12 1 m-4 -4 l4 4 -5 2" {...pen} strokeWidth="1.3" opacity="0.7" />
    </SketchPage>
  )
}

function Mailbox(): ReactElement {
  return (
    <SketchPage>
      <g opacity="0.55" transform="translate(-2 2)">
        <path d="M26 168 q40 -9 76 -6 t72 5 v10 H26 Z" fill={W.sand} />
        <rect x="92" y="112" width="16" height="52" rx="2" fill={W.wood} />
        <path d="M58 116 V92 A42 42 0 0 1 142 92 V116 Z" fill={W.red} />
        <rect x="80" y="76" width="32" height="20" rx="2" fill={W.white} />
      </g>
      <path d="M116 60 A42 42 0 0 1 142 92 V116 H120 V64 Z" fill="url(#sk-hatch)" opacity="0.6" />
      <g {...pen}>
        <path d="M27 166 q40 -8 74 -6 t72 4" />
        <rect x="92" y="112" width="16" height="52" rx="2" />
        <path d="M96 116 v44" strokeWidth="1.2" opacity="0.7" />
        <rect x="78" y="132" width="44" height="7" rx="3" />
        {/* 信件 */}
        <g transform="rotate(-8 96 86)">
          <rect x="80" y="76" width="32" height="20" rx="2" />
          <path d="M80 78 L96 90 L112 78" strokeWidth="1.3" />
        </g>
        {/* 箱体 */}
        <path d="M58 116 V92 A42 42 0 0 1 142 92 V116" />
        <path d="M54 114 q46 3 92 0 M54 122 q46 3 92 0" />
        <path d="M66 88 A34 34 0 0 1 100 58" strokeWidth="2.4" opacity="0.8" />
        <rect x="82" y="100" width="36" height="5" rx="2.5" strokeWidth="1.5" />
        <circle cx="100" cy="110" r="2" fill={INK} stroke="none" />
        {/* 旗 */}
        <path d="M142 78 V52 M142 53 l22 5 -22 12" />
        {/* 海浪 / 贝壳 */}
        <path d="M22 156 q6 -6 12 0 t12 0 M158 152 q6 -6 12 0 t12 0" strokeWidth="1.6" />
        <path d="M52 160 l3 -6 3 6 -2 2 1 4 -4 -2 -4 2 1 -4 Z" strokeWidth="1.3" />
        <circle cx="150" cy="160" r="4" strokeWidth="1.3" />
      </g>
      <g fill={W.yellow} opacity="0.85"><circle cx="142" cy="52" r="2.5" /></g>
    </SketchPage>
  )
}

/** 风格注册表：手绘手账版 */
export const SKETCH: LandmarkArtSet = {
  about: House,
  work: Lighthouse,
  projects: Orchard,
  skills: Lookout,
  contact: Mailbox,
}
