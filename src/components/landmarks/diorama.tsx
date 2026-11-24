import type { LandmarkArtSet } from './types'

/**
 * 风格 A：3D 微缩岛屿地标（项目初始版本，纯 SVG）
 * ------------------------------------------------------------------
 * 立体感做法：
 *  - 每个地标都有「受光亮面 + 背光暗面 + 顶部高光 + 底部 AO 椭圆阴影」
 *  - 用 linearGradient / radialGradient 表现圆柱、球面、木板的体积
 *  - 统一 200x200 viewBox，方便在岛上定位
 *
 * 想换地标造型，直接改对应组件里的 path / 颜色即可。
 */

/** 底部环境光遮蔽阴影，所有地标共用 */
function AO({ cx = 100, cy = 178, rx = 66, ry = 12 }: { cx?: number; cy?: number; rx?: number; ry?: number }) {
  return (
    <>
      <defs>
        <filter id="landmark-ao-blur" x="-30%" y="-100%" width="160%" height="300%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>
      <g filter="url(#landmark-ao-blur)">
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#36543a" opacity="0.3" />
        <ellipse cx={cx} cy={cy - 2} rx={rx * 0.72} ry={ry * 0.62} fill="#29462f" opacity="0.16" />
      </g>
    </>
  )
}

/** 1. 岛主小屋 —— 关于我 */
function House() {
  return (
    <svg viewBox="0 0 200 200" className="landmark-svg" aria-hidden="true">
      <defs>
        <linearGradient id="h-wall" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#f8e0b0" />
          <stop offset="55%" stopColor="#eecfa0" />
          <stop offset="100%" stopColor="#d9b47e" />
        </linearGradient>
        <linearGradient id="h-side" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#c39a68" />
          <stop offset="100%" stopColor="#a87c4e" />
        </linearGradient>
        <linearGradient id="h-roof" x1="0" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#f58b7c" />
          <stop offset="55%" stopColor="#e2685f" />
          <stop offset="100%" stopColor="#c44d4c" />
        </linearGradient>
        <linearGradient id="h-roofside" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#c44d4c" />
          <stop offset="100%" stopColor="#9e3b3d" />
        </linearGradient>
        <linearGradient id="h-win" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff3c4" />
          <stop offset="100%" stopColor="#f6cf72" />
        </linearGradient>
      </defs>

      <AO rx={72} />

      {/* 右侧墙体（背光面） */}
      <path d="M140 92 L162 80 L162 150 L140 164 Z" fill="url(#h-side)" stroke="#8f6a42" strokeWidth="1.5" strokeLinejoin="round" />
      {/* 正面墙体 */}
      <rect x="48" y="92" width="92" height="72" rx="4" fill="url(#h-wall)" stroke="#a87c4e" strokeWidth="1.8" />
      {/* 木板纹理 */}
      <g stroke="#c9a274" strokeWidth="1" opacity="0.5">
        <path d="M52 112 H136 M52 132 H136 M52 152 H136" />
      </g>

      {/* 屋顶：右侧坡 + 正面坡 */}
      <path d="M94 46 L166 34 L162 80 L140 92 Z" fill="url(#h-roofside)" stroke="#8f3a39" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M40 94 L94 46 L148 94 Z" fill="url(#h-roof)" stroke="#8f3a39" strokeWidth="2" strokeLinejoin="round" />
      {/* 屋檐厚度 */}
      <path d="M40 94 L148 94 L148 99 L40 99 Z" fill="#a83e3c" />
      {/* 瓦片纹理 */}
      <g stroke="#ffb3a4" strokeWidth="1.4" opacity="0.55" fill="none" strokeLinecap="round">
        <path d="M60 84 L104 84 M68 74 L104 74 M78 64 L104 64" />
        <path d="M112 86 L142 86 M118 76 L146 76 M124 66 L150 66" />
      </g>
      {/* 屋脊高光 */}
      <path d="M94 46 L166 34" stroke="#ffd0c4" strokeWidth="2" strokeLinecap="round" opacity="0.8" />

      {/* 烟囱 */}
      <rect x="116" y="48" width="14" height="24" rx="2" fill="#b06a55" stroke="#8a4c3c" strokeWidth="1.4" />
      <rect x="113" y="45" width="20" height="6" rx="2" fill="#d08568" stroke="#8a4c3c" strokeWidth="1.2" />
      <circle cx="123" cy="34" r="5" fill="#fff" opacity="0.55" />
      <circle cx="132" cy="26" r="3.5" fill="#fff" opacity="0.4" />

      {/* 门 */}
      <rect x="84" y="120" width="30" height="44" rx="14" fill="#8a5a35" stroke="#6b4426" strokeWidth="1.8" />
      <rect x="88" y="124" width="22" height="40" rx="11" fill="#a9713f" />
      <circle cx="106" cy="145" r="2.6" fill="#ffd76e" />
      {/* 台阶 */}
      <path d="M80 164 H118 L122 170 H76 Z" fill="#d8c39c" stroke="#b09a72" strokeWidth="1.2" />

      {/* 窗户 */}
      <rect x="56" y="108" width="22" height="22" rx="5" fill="url(#h-win)" stroke="#8a5a35" strokeWidth="2" />
      <rect x="120" y="108" width="16" height="22" rx="4" fill="url(#h-win)" stroke="#8a5a35" strokeWidth="2" />
      <path d="M67 108 V130 M56 119 H78 M128 108 V130" stroke="#a9713f" strokeWidth="1.6" />
      <path d="M59 111 L64 111" stroke="#fff" strokeWidth="1.6" opacity="0.8" strokeLinecap="round" />

      {/* 门前花坛 */}
      <g>
        <circle cx="58" cy="158" r="4" fill="#f6a5b5" /><circle cx="58" cy="158" r="1.6" fill="#fff3c4" />
        <circle cx="68" cy="162" r="3.4" fill="#ffd76e" /><circle cx="68" cy="162" r="1.3" fill="#fff" />
        <circle cx="140" cy="158" r="4" fill="#b9a0ea" /><circle cx="140" cy="158" r="1.6" fill="#fff3c4" />
        <path d="M58 162 V168 M68 165 V169 M140 162 V168" stroke="#6f9c4c" strokeWidth="1.8" strokeLinecap="round" />
      </g>
    </svg>
  )
}

/** 2. 灯塔 —— 工作经历（航行轨迹与历练沉淀） */
function Lighthouse() {
  return (
    <svg viewBox="0 0 200 200" className="landmark-svg" aria-hidden="true">
      <defs>
        <clipPath id="lh-clip">
          <path d="M74 156 L126 156 L114 56 L86 56 Z" />
        </clipPath>
        <linearGradient id="lh-body" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#b9a58a" />
          <stop offset="28%" stopColor="#fdf6e4" />
          <stop offset="62%" stopColor="#f3e7cd" />
          <stop offset="100%" stopColor="#bda98c" />
        </linearGradient>
        <linearGradient id="lh-red" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#b4504d" />
          <stop offset="35%" stopColor="#f08070" />
          <stop offset="70%" stopColor="#d96158" />
          <stop offset="100%" stopColor="#a94242" />
        </linearGradient>
        <radialGradient id="lh-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff3a8" stopOpacity="0.95" />
          <stop offset="45%" stopColor="#ffdd7a" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#ffd76e" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="lh-top" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#d96158" />
          <stop offset="50%" stopColor="#f08070" />
          <stop offset="100%" stopColor="#a94242" />
        </linearGradient>
      </defs>

      <AO rx={64} />
      {/* 岩石底座 */}
      <path d="M58 168 Q62 152 76 152 H124 Q140 152 144 168 Z" fill="#9aa88c" stroke="#7c8b6d" strokeWidth="1.6" />
      <ellipse cx="100" cy="166" rx="46" ry="8" fill="#b6c39f" />

      {/* 光束 */}
      <path d="M100 40 L182 20 L182 62 Z" fill="#ffe89a" opacity="0.28" />
      <path d="M100 40 L18 20 L18 62 Z" fill="#ffe89a" opacity="0.18" />
      {/* 光晕 */}
      <circle cx="100" cy="40" r="46" fill="url(#lh-glow)" />

      {/* 塔身 */}
      <path d="M74 156 L126 156 L114 56 L86 56 Z" fill="url(#lh-body)" stroke="#a08a6c" strokeWidth="1.8" strokeLinejoin="round" />
      {/* 红白条纹 */}
      <g clipPath="url(#lh-clip)">
        <rect x="60" y="66" width="80" height="16" fill="url(#lh-red)" />
        <rect x="60" y="102" width="80" height="16" fill="url(#lh-red)" />
        <rect x="60" y="138" width="80" height="16" fill="url(#lh-red)" />
      </g>
      {/* 塔身高光 */}
      <path d="M88 58 L78 154" stroke="#fff" strokeWidth="3" opacity="0.4" strokeLinecap="round" />
      {/* 小窗 */}
      <rect x="94" y="86" width="12" height="12" rx="6" fill="#6b8fa8" stroke="#6b563c" strokeWidth="1.4" />
      <rect x="94" y="122" width="12" height="12" rx="6" fill="#6b8fa8" stroke="#6b563c" strokeWidth="1.4" />

      {/* 平台 */}
      <path d="M76 56 H124 L128 50 H72 Z" fill="#7c6b55" stroke="#5c4d3c" strokeWidth="1.2" />
      <ellipse cx="100" cy="50" rx="28" ry="6" fill="#a08d70" stroke="#6b563c" strokeWidth="1.4" />
      {/* 栏杆 */}
      <g stroke="#5c4d3c" strokeWidth="2" strokeLinecap="round">
        <path d="M76 50 V40 M88 50 V40 M112 50 V40 M124 50 V40" />
        <path d="M73 40 H127" />
      </g>

      {/* 灯室 */}
      <rect x="86" y="26" width="28" height="20" rx="3" fill="#fff3b0" stroke="#6b563c" strokeWidth="1.8" />
      <rect x="90" y="29" width="8" height="14" rx="2" fill="#fffbe0" opacity="0.9" />
      <path d="M100 26 V46" stroke="#6b563c" strokeWidth="1.4" />
      {/* 顶盖 */}
      <path d="M78 26 L100 10 L122 26 Z" fill="url(#lh-top)" stroke="#8a3b38" strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="100" cy="8" r="3.5" fill="#ffd76e" stroke="#a94242" strokeWidth="1.2" />
    </svg>
  )
}

/** 3. 果树林 —— 项目经验（每棵树结出的成果） */
function Orchard() {
  const fruit = (x: number, y: number, r = 7) => (
    <g>
      <circle cx={x} cy={y} r={r} fill="#f4864f" />
      <circle cx={x - r * 0.3} cy={y - r * 0.32} r={r * 0.42} fill="#ffb184" opacity="0.85" />
      <circle cx={x - r * 0.35} cy={y - r * 0.4} r={r * 0.16} fill="#fff" opacity="0.9" />
      <path d={`M${x} ${y - r} q2 -4 5 -4`} stroke="#6b8a3e" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </g>
  )
  return (
    <svg viewBox="0 0 200 200" className="landmark-svg" aria-hidden="true">
      <defs>
        <radialGradient id="or-crown" cx="36%" cy="28%" r="72%">
          <stop offset="0%" stopColor="#a8d878" />
          <stop offset="55%" stopColor="#7fbb5c" />
          <stop offset="100%" stopColor="#578f43" />
        </radialGradient>
        <radialGradient id="or-crown2" cx="34%" cy="26%" r="74%">
          <stop offset="0%" stopColor="#b6e08a" />
          <stop offset="55%" stopColor="#8cc766" />
          <stop offset="100%" stopColor="#5f9a49" />
        </radialGradient>
        <linearGradient id="or-trunk" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#c08a54" />
          <stop offset="45%" stopColor="#a06b3e" />
          <stop offset="100%" stopColor="#7c4f2c" />
        </linearGradient>
      </defs>

      <AO rx={74} />

      {/* 后方小树 */}
      <path d="M148 152 q-3 -26 2 -40 l10 0 q4 16 1 40 Z" fill="url(#or-trunk)" stroke="#7c4f2c" strokeWidth="1.4" />
      <circle cx="154" cy="104" r="27" fill="url(#or-crown)" stroke="#4d8039" strokeWidth="1.6" />
      <circle cx="140" cy="96" r="17" fill="url(#or-crown2)" opacity="0.95" />
      <circle cx="168" cy="98" r="15" fill="#6fae50" opacity="0.9" />
      {fruit(142, 112, 5.5)}{fruit(166, 110, 5)}

      {/* 主树 */}
      <path d="M88 158 q-6 -34 -2 -54 l18 0 q5 24 0 54 Z" fill="url(#or-trunk)" stroke="#7c4f2c" strokeWidth="1.8" />
      <path d="M96 152 q-2 -22 0 -34" stroke="#d2a06a" strokeWidth="2.4" opacity="0.55" strokeLinecap="round" />
      {/* 树冠：多球叠加做体积 */}
      <circle cx="92" cy="76" r="40" fill="url(#or-crown)" stroke="#4d8039" strokeWidth="2" />
      <circle cx="64" cy="88" r="24" fill="url(#or-crown2)" />
      <circle cx="118" cy="90" r="23" fill="#6fae50" opacity="0.92" />
      <circle cx="88" cy="52" r="24" fill="url(#or-crown2)" opacity="0.92" />
      {/* 高光 */}
      <ellipse cx="76" cy="58" rx="15" ry="9" fill="#d8f0a8" opacity="0.55" transform="rotate(-28 76 58)" />
      {/* 果实 */}
      {fruit(70, 82)}{fruit(104, 68)}{fruit(116, 98, 6)}{fruit(84, 100, 6)}{fruit(58, 70, 5.5)}
      {/* 落在地上的果子 */}
      {fruit(126, 158, 6)}{fruit(52, 158, 5)}

      {/* 小花 */}
      <g>
        <circle cx="42" cy="160" r="3" fill="#fff3c4" /><circle cx="42" cy="160" r="1.2" fill="#f6a5b5" />
        <circle cx="160" cy="162" r="3" fill="#f6a5b5" /><circle cx="160" cy="162" r="1.2" fill="#fff3c4" />
      </g>
    </svg>
  )
}

/** 4. 瞭望台 / 道具展架 —— 专业技能（能力图鉴） */
function Lookout() {
  return (
    <svg viewBox="0 0 200 200" className="landmark-svg" aria-hidden="true">
      <defs>
        <linearGradient id="lk-wood" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#e8be86" />
          <stop offset="55%" stopColor="#cf9c62" />
          <stop offset="100%" stopColor="#a87544" />
        </linearGradient>
        <linearGradient id="lk-woodside" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#a87544" />
          <stop offset="100%" stopColor="#835a34" />
        </linearGradient>
        <linearGradient id="lk-roof" x1="0" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stopColor="#8fd6cf" />
          <stop offset="60%" stopColor="#5fb9b4" />
          <stop offset="100%" stopColor="#3d918e" />
        </linearGradient>
        <linearGradient id="lk-telescope" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7d8fa8" />
          <stop offset="50%" stopColor="#5b6c85" />
          <stop offset="100%" stopColor="#3f4d63" />
        </linearGradient>
      </defs>

      <AO rx={62} />

      {/* 支架腿（前后各两条，做透视） */}
      <path d="M70 96 L62 164 L70 164 L78 96 Z" fill="url(#lk-woodside)" stroke="#7c5634" strokeWidth="1.2" />
      <path d="M130 96 L138 164 L130 164 L122 96 Z" fill="url(#lk-woodside)" stroke="#7c5634" strokeWidth="1.2" />
      <path d="M84 100 L80 162" stroke="#a87544" strokeWidth="5" strokeLinecap="round" opacity="0.7" />
      <path d="M116 100 L120 162" stroke="#a87544" strokeWidth="5" strokeLinecap="round" opacity="0.7" />
      {/* 交叉支撑 */}
      <path d="M66 146 L134 146 M68 130 L132 130" stroke="#a87544" strokeWidth="4" opacity="0.8" strokeLinecap="round" />

      {/* 下层道具格（能力图鉴） */}
      <rect x="76" y="118" width="48" height="26" rx="4" fill="url(#lk-wood)" stroke="#7c5634" strokeWidth="1.6" />
      <path d="M100 118 V144" stroke="#7c5634" strokeWidth="1.4" />
      <rect x="80" y="122" width="7" height="17" rx="1.5" fill="#f08070" />
      <rect x="88" y="122" width="6" height="17" rx="1.5" fill="#f7cd67" />
      <rect x="105" y="122" width="7" height="17" rx="1.5" fill="#82c7b6" />
      <rect x="113" y="122" width="7" height="17" rx="1.5" fill="#b9a0ea" />

      {/* 平台顶面（等距） */}
      <path d="M56 96 L100 82 L144 96 L100 110 Z" fill="url(#lk-wood)" stroke="#7c5634" strokeWidth="1.8" strokeLinejoin="round" />
      {/* 平台厚度 */}
      <path d="M56 96 L100 110 L100 118 L56 104 Z" fill="url(#lk-woodside)" stroke="#7c5634" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M100 110 L144 96 L144 104 L100 118 Z" fill="#8f6339" stroke="#7c5634" strokeWidth="1.4" strokeLinejoin="round" />

      {/* 护栏立柱 */}
      <g stroke="#8a5f38" strokeWidth="3.4" strokeLinecap="round">
        <path d="M62 94 V76 M82 88 V70 M118 88 V70 M138 94 V76" />
      </g>
      <path d="M62 76 L82 70 M118 70 L138 76" stroke="#a87544" strokeWidth="3" strokeLinecap="round" />

      {/* 望远镜 */}
      <g transform="rotate(-20 104 66)">
        <rect x="92" y="58" width="34" height="13" rx="6" fill="url(#lk-telescope)" stroke="#3f4d63" strokeWidth="1.2" />
        <rect x="122" y="56" width="8" height="17" rx="3" fill="#8fa2bb" stroke="#3f4d63" strokeWidth="1.2" />
        <ellipse cx="130" cy="64.5" rx="3" ry="7" fill="#cfeaf0" stroke="#3f4d63" strokeWidth="1" />
        <rect x="96" y="60" width="12" height="3" rx="1.5" fill="#fff" opacity="0.35" />
      </g>
      <path d="M104 74 V84 M96 84 H112" stroke="#5b6c85" strokeWidth="3" strokeLinecap="round" />

      {/* 小屋顶 */}
      <path d="M52 52 L100 28 L148 52 Z" fill="url(#lk-roof)" stroke="#2f7a78" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M52 52 L100 28 L118 37 L70 61 Z" fill="#b6e8e0" opacity="0.45" />
      <path d="M50 52 H150 V57 H50 Z" fill="#3d918e" stroke="#2f7a78" strokeWidth="1.2" />
      {/* 旗子 */}
      <path d="M100 28 V8" stroke="#7c5634" strokeWidth="2" strokeLinecap="round" />
      <path d="M100 9 L120 14 L100 20 Z" fill="#f08070" stroke="#b4504d" strokeWidth="1" />
    </svg>
  )
}

/** 5. 海边信箱 —— 联系方式 */
function Mailbox() {
  return (
    <svg viewBox="0 0 200 200" className="landmark-svg" aria-hidden="true">
      <defs>
        <linearGradient id="mb-box" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#f49a86" />
          <stop offset="38%" stopColor="#ee7166" />
          <stop offset="100%" stopColor="#c04c4c" />
        </linearGradient>
        <linearGradient id="mb-post" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#e8be86" />
          <stop offset="55%" stopColor="#c8995e" />
          <stop offset="100%" stopColor="#976b3d" />
        </linearGradient>
        <linearGradient id="mb-sand" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f6e2b4" />
          <stop offset="100%" stopColor="#e4c894" />
        </linearGradient>
      </defs>

      <AO rx={60} />

      {/* 木柱 */}
      <rect x="92" y="112" width="16" height="54" rx="3" fill="url(#mb-post)" stroke="#7c5634" strokeWidth="1.6" />
      <path d="M96 116 V162" stroke="#f0cd97" strokeWidth="2" opacity="0.6" strokeLinecap="round" />
      {/* 横撑 */}
      <rect x="78" y="132" width="44" height="7" rx="3" fill="url(#mb-post)" stroke="#7c5634" strokeWidth="1.2" />

      {/* 信件露出 */}
      <g transform="rotate(-8 100 92)">
        <rect x="86" y="76" width="30" height="20" rx="2" fill="#fffaf0" stroke="#c8b291" strokeWidth="1.4" />
        <path d="M86 78 L101 89 L116 78" fill="none" stroke="#c8b291" strokeWidth="1.4" />
        <path d="M90 92 H112" stroke="#e4d4b4" strokeWidth="1.2" />
      </g>

      {/* 信箱主体：圆顶 */}
      <path d="M58 116 V92 A42 42 0 0 1 142 92 V116 Z" fill="url(#mb-box)" stroke="#9e3b3d" strokeWidth="2" />
      {/* 顶面高光 */}
      <path d="M66 90 A34 34 0 0 1 100 58" fill="none" stroke="#ffc9b8" strokeWidth="3.5" opacity="0.7" strokeLinecap="round" />
      {/* 底部托盘厚度 */}
      <path d="M54 114 H146 V122 H54 Z" fill="#b74b4a" stroke="#8f3436" strokeWidth="1.4" />
      <path d="M58 116 H142" stroke="#ffb3a4" strokeWidth="1.6" opacity="0.5" />
      {/* 投信口 */}
      <rect x="82" y="100" width="36" height="5" rx="2.5" fill="#7c3030" opacity="0.75" />
      {/* 小门把手 */}
      <circle cx="100" cy="110" r="2.4" fill="#ffd76e" />

      {/* 红旗 */}
      <path d="M142 78 V52" stroke="#7c5634" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M142 53 L164 58 L142 65 Z" fill="#f5c31c" stroke="#c99a10" strokeWidth="1.2" strokeLinejoin="round" />
      <circle cx="142" cy="52" r="2.6" fill="#8a5a35" />

      {/* 贝壳 / 海星 */}
      <path d="M52 162 l4 -6 4 6 -3 2 1 5 -5 -3 -5 3 1 -5 Z" fill="#f4a9a0" opacity="0.9" />
      <circle cx="150" cy="163" r="4" fill="#fff8e4" stroke="#d8c39c" strokeWidth="1" />
      {/* 小海浪 */}
      <path d="M20 158 q6 -5 12 0 t12 0" stroke="#8fcbd8" strokeWidth="2.4" fill="none" opacity="0.7" strokeLinecap="round" />
      <path d="M158 154 q6 -5 12 0 t12 0" stroke="#8fcbd8" strokeWidth="2.4" fill="none" opacity="0.7" strokeLinecap="round" />
    </svg>
  )
}

/** 风格注册表：微缩立体版 */
export const DIORAMA: LandmarkArtSet = {
  about: House,
  work: Lighthouse,
  projects: Orchard,
  skills: Lookout,
  contact: Mailbox,
}
