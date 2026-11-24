import type { CSSProperties } from 'react'

/**
 * 小岛地形与环境。所有装饰均为内联 SVG，无图片请求、无 WebGL。
 * 地标和岛民在 IslandScene 中按同一 1200 × 720 坐标系叠加。
 */

type TreeProps = {
  x: number
  y: number
  s?: number
  tone?: 'green' | 'light' | 'dark' | 'gold'
  pine?: boolean
  delay?: number
}

function Tree({ x, y, s = 1, tone = 'green', pine = false, delay = 0 }: TreeProps) {
  const crowns = {
    green: ['#b8df72', '#7fb84f', '#4f873d'],
    light: ['#d2eb8b', '#98c95e', '#639443'],
    dark: ['#91c462', '#5d9849', '#3f733a'],
    gold: ['#ffe18a', '#eebd55', '#c88b3f'],
  }[tone]
  return (
    <g
      transform={`translate(${x} ${y}) scale(${s})`}
      className="world-tree"
      style={{ '--tree-delay': `${delay}s` } as CSSProperties}
    >
      <ellipse cx="10" cy="7" rx="40" ry="12" fill="#355f3d" opacity=".2" />
      <path d="M-8 0 C-5-28-7-57-2-80 L12-80 C15-51 12-25 16 0Z" fill="url(#world-trunk)" />
      <path d="M1-8 C1-30 2-52 5-70" fill="none" stroke="#e0b273" strokeWidth="4" strokeLinecap="round" opacity=".55" />
      {pine ? (
        <>
          <path d="M4-142 L-43-63 H50Z" fill={crowns[2]} />
          <path d="M2-157 L-37-88 H43Z" fill={crowns[1]} />
          <path d="M-1-166 L-29-111 H30Z" fill={crowns[0]} />
          <path d="M-2-151 L-20-119" stroke="#eff8bd" strokeWidth="6" strokeLinecap="round" opacity=".35" />
        </>
      ) : (
        <>
          <circle cx="4" cy="-91" r="49" fill={crowns[2]} />
          <circle cx="-27" cy="-80" r="32" fill={crowns[1]} />
          <circle cx="32" cy="-76" r="34" fill={crowns[1]} />
          <circle cx="-8" cy="-119" r="35" fill={crowns[0]} />
          <circle cx="-30" cy="-105" r="23" fill={crowns[0]} opacity=".92" />
          <ellipse cx="-21" cy="-126" rx="18" ry="10" fill="#f3fac8" opacity=".38" transform="rotate(-25 -21 -126)" />
          <path d="M-42-79 Q-20-59 2-69 M12-105 Q34-94 45-76" fill="none" stroke="#d9ed9d" strokeWidth="3" strokeLinecap="round" opacity=".25" />
        </>
      )}
    </g>
  )
}

function Flower({ x, y, color = '#fff4df', s = 1 }: { x: number; y: number; color?: string; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 2 L-1 15 M-1 9 L-7 5 M0 11 L6 7" fill="none" stroke="#4d8b48" strokeWidth="2" strokeLinecap="round" />
      <circle cx="0" cy="-4" r="4.2" fill={color} />
      <circle cx="4" cy="0" r="4.2" fill={color} />
      <circle cx="0" cy="4" r="4.2" fill={color} />
      <circle cx="-4" cy="0" r="4.2" fill={color} />
      <circle r="2.4" fill="#f4bd4f" />
    </g>
  )
}

function Rock({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="6" cy="8" rx="29" ry="9" fill="#3a6454" opacity=".18" />
      <path d="M-25 4 Q-25-18-8-27 Q13-31 26-9 L29 5 Q4 18-25 4Z" fill="url(#world-rock)" />
      <path d="M-17-10 Q-8-24 8-21" fill="none" stroke="#e0e4c7" strokeWidth="4" strokeLinecap="round" opacity=".55" />
      <path d="M7-23 L13-5 L26-8" fill="none" stroke="#718c79" strokeWidth="2" opacity=".45" />
    </g>
  )
}

function Grass({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <path
      d="M0 0 Q-7-10-5-17 M0 0 Q0-14 4-20 M0 0 Q8-9 11-15"
      transform={`translate(${x} ${y}) scale(${s})`}
      fill="none"
      stroke="#5e9e4d"
      strokeWidth="2.3"
      strokeLinecap="round"
      opacity=".55"
    />
  )
}

function Fence({ x, y, count = 4, gap = 29 }: { x: number; y: number; count?: number; gap?: number }) {
  return (
    <g transform={`translate(${x} ${y})`} fill="url(#world-fence)" stroke="#a87743" strokeWidth="1.5">
      <path d={`M-8-27 H${count * gap + 4} V-19 H-8Z`} />
      <path d={`M-8-7 H${count * gap + 4} V1 H-8Z`} />
      {Array.from({ length: count }, (_, i) => (
        <g key={i} transform={`translate(${i * gap} 0)`}>
          <path d="M0 12 V-39 L7-47 L14-39 V12Z" />
          <path d="M4-34 V5" stroke="#f4d79b" strokeWidth="2" opacity=".65" />
        </g>
      ))}
    </g>
  )
}

function Lamp({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="4" cy="4" rx="18" ry="6" fill="#365c3e" opacity=".22" />
      <path d="M-3 0 V-63 H4 V0Z" fill="#5e6650" />
      <path d="M-10-64 L-7-85 H10 L14-64Z" fill="#fff1a7" stroke="#676a4e" strokeWidth="3" />
      <path d="M-12-86 L1-96 L14-86Z" fill="#5c6751" />
      <path d="M-5-79 H6" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity=".7" />
      <ellipse cy="-74" rx="23" ry="27" fill="url(#world-lamp-glow)" opacity=".35" />
    </g>
  )
}

const FLOWERS: Array<[number, number, string, number]> = [
  [325, 354, '#fff7e5', .8], [343, 365, '#f7a8a0', .75], [360, 349, '#f8d777', .72],
  [420, 337, '#f7a8a0', .8], [438, 347, '#fff7e5', .65], [787, 340, '#f7a8a0', .8],
  [806, 348, '#fff7e5', .72], [850, 371, '#b9a6ed', .8], [866, 360, '#f8d777', .7],
  [922, 400, '#f7a8a0', .85], [941, 408, '#fff7e5', .65], [972, 438, '#f8d777', .8],
  [265, 424, '#f7a8a0', .8], [282, 433, '#fff7e5', .7], [301, 417, '#b9a6ed', .7],
  [452, 508, '#fff7e5', .72], [466, 519, '#f7a8a0', .8], [478, 505, '#f8d777', .7],
  [723, 521, '#f7a8a0', .85], [741, 529, '#fff7e5', .7], [759, 516, '#b9a6ed', .72],
  [866, 533, '#fff7e5', .75], [883, 542, '#f7a8a0', .85], [901, 526, '#f8d777', .72],
  [533, 566, '#b9a6ed', .75], [550, 574, '#fff7e5', .65], [689, 565, '#f7a8a0', .72],
]

const GRASSES: Array<[number, number, number]> = [
  [214, 391, .7], [336, 392, .6], [393, 319, .65], [489, 333, .55], [705, 317, .65],
  [829, 322, .65], [955, 375, .55], [997, 444, .6], [927, 493, .6], [818, 491, .65],
  [708, 555, .55], [527, 525, .65], [430, 555, .6], [295, 504, .6], [201, 449, .55],
]

export default function IslandWorld() {
  return (
    <svg className="island-world" viewBox="0 0 1200 720" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <defs>
        <linearGradient id="world-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8edbd5" />
          <stop offset=".55" stopColor="#55bdc3" />
          <stop offset="1" stopColor="#319cae" />
        </linearGradient>
        <linearGradient id="world-cliff" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d7aa70" />
          <stop offset=".52" stopColor="#b98652" />
          <stop offset="1" stopColor="#8f633f" />
        </linearGradient>
        <linearGradient id="world-sand" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff0bd" />
          <stop offset=".6" stopColor="#f1d391" />
          <stop offset="1" stopColor="#dcae6c" />
        </linearGradient>
        <radialGradient id="world-grass" cx="42%" cy="25%" r="80%">
          <stop offset="0" stopColor="#cde98c" />
          <stop offset=".5" stopColor="#a7d36d" />
          <stop offset="1" stopColor="#78ad55" />
        </radialGradient>
        <linearGradient id="world-path" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f5dca0" />
          <stop offset="1" stopColor="#dfba78" />
        </linearGradient>
        <linearGradient id="world-water" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#9ce5da" />
          <stop offset=".5" stopColor="#59c2c4" />
          <stop offset="1" stopColor="#3ca5b7" />
        </linearGradient>
        <linearGradient id="world-trunk" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8b5b35" />
          <stop offset=".42" stopColor="#c18a4d" />
          <stop offset="1" stopColor="#77502f" />
        </linearGradient>
        <linearGradient id="world-rock" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#c6d1b4" />
          <stop offset=".5" stopColor="#9caf9b" />
          <stop offset="1" stopColor="#708879" />
        </linearGradient>
        <linearGradient id="world-fence" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#e8bd77" />
          <stop offset=".55" stopColor="#d39a57" />
          <stop offset="1" stopColor="#b47743" />
        </linearGradient>
        <radialGradient id="world-lamp-glow">
          <stop offset="0" stopColor="#fff6ad" />
          <stop offset="1" stopColor="#fff6ad" stopOpacity="0" />
        </radialGradient>
        <filter id="world-shadow" x="-30%" y="-50%" width="160%" height="200%">
          <feGaussianBlur stdDeviation="16" />
        </filter>
        <filter id="world-soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
        <path id="world-island-outline" d="M143 423 C121 359 190 306 289 302 C344 252 438 247 523 268 C603 214 733 218 810 258 C912 239 1032 298 1049 373 C1111 420 1074 500 1001 532 C956 593 849 615 756 592 C667 646 544 633 471 597 C377 624 268 588 229 536 C163 519 122 475 143 423Z" />
        <path id="world-grass-outline" d="M174 407 C159 354 223 323 305 323 C372 277 447 284 522 299 C608 251 711 253 793 288 C882 268 990 320 1008 382 C1054 426 1019 478 956 501 C907 554 824 567 746 548 C660 593 566 583 490 553 C405 580 311 551 273 506 C211 498 158 458 174 407Z" />
        <clipPath id="world-grass-clip"><use href="#world-grass-outline" /></clipPath>
      </defs>

      {/* 远景：海平线、邻岛与轻薄云海 */}
      <path d="M0 302 Q180 277 360 300 T720 294 T1200 298 V720 H0Z" fill="url(#world-sea)" />
      <path d="M0 313 Q200 292 400 312 T800 304 T1200 310" fill="none" stroke="#d8f4e9" strokeWidth="7" opacity=".58" />
      <g opacity=".55">
        <path d="M41 316 Q83 267 130 312 Q168 291 204 321Z" fill="#78b69b" />
        <path d="M945 304 Q991 250 1031 300 Q1074 275 1126 315Z" fill="#73ad91" />
        <path d="M62 314 Q126 303 190 320" fill="none" stroke="#d9edbd" strokeWidth="5" />
        <path d="M964 309 Q1032 294 1104 315" fill="none" stroke="#d9edbd" strokeWidth="5" />
      </g>

      {/* 海面反光与缓慢漂移的水纹 */}
      <g className="world-sea-glints" fill="none" stroke="#effff5" strokeLinecap="round">
        <path d="M31 398 H115 M70 418 H155 M1080 381 H1170 M1038 405 H1101" strokeWidth="6" opacity=".48" />
        <path d="M18 566 H97 M51 589 H142 M1071 562 H1179 M1104 590 H1156" strokeWidth="5" opacity=".6" />
        <path d="M161 663 H252 M899 675 H1011 M1029 648 H1095" strokeWidth="4" opacity=".44" />
      </g>
      <g fill="none" stroke="#287f98" strokeWidth="3" opacity=".18">
        <path d="M0 471 Q61 452 124 470 T251 469" />
        <path d="M984 475 Q1065 453 1200 479" />
        <path d="M0 627 Q90 609 175 632" />
      </g>

      {/* 岛体：投影 → 土层厚度 → 沙滩 → 草地 */}
      <ellipse cx="610" cy="617" rx="493" ry="70" fill="#236d78" opacity=".28" filter="url(#world-shadow)" />
      <use href="#world-island-outline" transform="translate(0 29)" fill="#805a3d" />
      <use href="#world-island-outline" transform="translate(0 18)" fill="url(#world-cliff)" />
      <g fill="none" stroke="#7f5739" strokeWidth="5" strokeLinecap="round" opacity=".34">
        <path d="M245 553 Q264 574 291 579 M370 600 Q402 614 438 607 M535 625 Q566 638 598 627" />
        <path d="M754 616 Q787 626 817 612 M924 589 Q950 578 966 557 M1040 506 Q1057 488 1059 467" />
      </g>
      <g fill="none" stroke="#edc58b" strokeWidth="4" strokeLinecap="round" opacity=".36">
        <path d="M282 567 L292 550 M446 612 L455 590 M662 630 L668 607 M861 611 L853 590 M1002 551 L987 535" />
      </g>
      <use href="#world-island-outline" fill="url(#world-sand)" stroke="#ffe9ae" strokeWidth="5" />
      <use href="#world-grass-outline" fill="url(#world-grass)" stroke="#8dbd5c" strokeWidth="4" />

      {/* 岸边的白色浪花在沙滩外缘形成第二层轮廓 */}
      <g fill="none" stroke="#f4fff1" strokeWidth="7" strokeLinecap="round" opacity=".82" className="world-foam">
        <path d="M144 475 Q157 513 213 531" />
        <path d="M266 575 Q330 610 392 606" />
        <path d="M487 628 Q554 653 615 638" />
        <path d="M768 620 Q842 638 905 607" />
        <path d="M997 565 Q1051 536 1074 493" />
      </g>

      <g clipPath="url(#world-grass-clip)">
        {/* 草地暗部与亮部让地表不是一块平板 */}
        <ellipse cx="496" cy="322" rx="320" ry="105" fill="#eff7b0" opacity=".14" filter="url(#world-soft)" />
        <path d="M143 474 Q295 539 420 529 T719 562 T1055 464 V650 H128Z" fill="#5c974e" opacity=".13" />

        {/* 连续小径：深色路肩 + 暖色路面，串联所有地标 */}
        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M604 405 C589 447 600 468 628 490 C658 516 620 547 612 599 M614 477 C521 457 447 447 381 472 C330 491 285 466 239 445 M634 482 C730 456 828 445 968 462 M610 525 C528 531 448 547 365 564 M635 528 C749 526 849 548 966 581" stroke="#a98750" strokeWidth="56" opacity=".36" />
          <path d="M604 405 C589 447 600 468 628 490 C658 516 620 547 612 599 M614 477 C521 457 447 447 381 472 C330 491 285 466 239 445 M634 482 C730 456 828 445 968 462 M610 525 C528 531 448 547 365 564 M635 528 C749 526 849 548 966 581" stroke="url(#world-path)" strokeWidth="43" />
          <path d="M603 410 C596 444 607 464 628 480 M652 475 C751 455 837 453 930 461 M523 536 C472 545 426 554 390 560" stroke="#fff0be" strokeWidth="5" opacity=".4" />
        </g>

        {/* 小溪：沙色河岸、青色水体、两条高光 */}
        <path d="M457 283 C443 329 479 348 440 384 C405 416 418 444 375 470 C331 499 337 528 283 551 C255 564 238 568 211 570" fill="none" stroke="#e9cb8a" strokeWidth="67" strokeLinecap="round" />
        <path d="M457 283 C443 329 479 348 440 384 C405 416 418 444 375 470 C331 499 337 528 283 551 C255 564 238 568 211 570" fill="none" stroke="url(#world-water)" strokeWidth="47" strokeLinecap="round" />
        <path d="M452 296 C449 326 468 345 439 374 M403 420 C398 441 376 453 360 464 M316 514 C298 536 271 545 248 550" fill="none" stroke="#e9fff0" strokeWidth="5" strokeLinecap="round" opacity=".64" />
        <g fill="#e9fff0" opacity=".65">
          <ellipse cx="437" cy="393" rx="11" ry="3" /><ellipse cx="342" cy="493" rx="9" ry="2.5" /><ellipse cx="278" cy="548" rx="12" ry="3" />
        </g>

        {/* 路面零星石子与草籽 */}
        <g fill="#c99d61" opacity=".48">
          <ellipse cx="622" cy="509" rx="4" ry="2" /><ellipse cx="603" cy="558" rx="5" ry="2.4" />
          <ellipse cx="697" cy="470" rx="4" ry="2" /><ellipse cx="803" cy="458" rx="5" ry="2" />
          <ellipse cx="516" cy="464" rx="4" ry="2" /><ellipse cx="481" cy="543" rx="5" ry="2.2" />
          <ellipse cx="828" cy="550" rx="4" ry="2" /><ellipse cx="916" cy="571" rx="5" ry="2.2" />
        </g>
      </g>

      {/* 后排树丛形成天际线，并遮住过于规整的地形边缘 */}
      <Tree x={196} y={382} s={.72} tone="dark" delay={-1.2} />
      <Tree x={278} y={337} s={.78} tone="green" delay={-3.1} />
      <Tree x={367} y={314} s={.69} tone="light" delay={-2.4} />
      <Tree x={449} y={306} s={.62} pine tone="dark" delay={-4} />
      <Tree x={724} y={298} s={.66} pine tone="green" delay={-1.8} />
      <Tree x={856} y={323} s={.76} tone="gold" delay={-3.6} />
      <Tree x={952} y={355} s={.78} tone="green" delay={-.8} />
      <Tree x={1020} y={409} s={.62} tone="dark" delay={-2.7} />

      {/* 小屋院落：栅栏、踏脚石、油灯与信箱前的小花坛 */}
      <Fence x={506} y={389} count={4} gap={25} />
      <Fence x={650} y={387} count={3} gap={25} />
      <g fill="#ead7a5" stroke="#c5a878" strokeWidth="2">
        <ellipse cx="601" cy="417" rx="18" ry="8" /><ellipse cx="601" cy="438" rx="16" ry="7" />
      </g>
      <Lamp x={520} y={435} s={.78} />
      <Lamp x={690} y={435} s={.78} />

      {/* 木桥：桥底阴影、拱桥侧面、桥板与栏杆 */}
      <g transform="translate(376 466) rotate(-18)">
        <ellipse cx="0" cy="18" rx="64" ry="18" fill="#315f50" opacity=".25" />
        <path d="M-57-18 Q0-38 57-18 L57 11 Q0-9-57 11Z" fill="#a66f3e" />
        <path d="M-57-25 Q0-45 57-25 L57 1 Q0-19-57 1Z" fill="#dcaa62" stroke="#966337" strokeWidth="3" />
        {[-42, -21, 0, 21, 42].map((x) => <path key={x} d={`M${x}-33 L${x}-7`} stroke="#a97540" strokeWidth="3" />)}
        <path d="M-58-42 Q0-63 58-42 M-58-15 Q0-36 58-15" fill="none" stroke="#825632" strokeWidth="5" strokeLinecap="round" />
        <path d="M-53-44 V-4 M53-44 V-4 M-27-53 V-15 M27-53 V-15" stroke="#825632" strokeWidth="5" strokeLinecap="round" />
        <path d="M-48-29 Q0-46 45-30" fill="none" stroke="#f2cd8b" strokeWidth="3" opacity=".7" />
      </g>

      {/* 灯塔下的岩石群 */}
      <Rock x={180} y={445} s={.9} />
      <Rock x={240} y={469} s={.6} />
      <Rock x={147} y={477} s={.55} />

      {/* 果树工坊外的木箱、围栏和落在路边的果子 */}
      <Fence x={870} y={430} count={4} gap={25} />
      <g transform="translate(875 478)">
        <ellipse cx="8" cy="13" rx="36" ry="9" fill="#42653d" opacity=".2" />
        <path d="M-25-18 H29 V12 H-25Z" fill="#bd8148" stroke="#895a35" strokeWidth="2" />
        <path d="M-25-18 L-13-29 H40 L29-18Z" fill="#e0aa61" stroke="#895a35" strokeWidth="2" />
        <path d="M-16-13 V7 M17-13 V7 M-23-3 H27" stroke="#efd093" strokeWidth="3" opacity=".6" />
        <circle cx="-5" cy="-21" r="7" fill="#ef8a4f" /><circle cx="12" cy="-22" r="7" fill="#f2a154" />
      </g>

      {/* 生活细节：木牌、长椅、野餐垫和提灯 */}
      <g transform="translate(503 486)">
        <path d="M-3 19 V-25 H4 V19Z" fill="#8d6038" />
        <path d="M-29-34 H30 L23-12 H-29Z" fill="#f1d08b" stroke="#9d7041" strokeWidth="3" strokeLinejoin="round" />
        <path d="M-16-25 H13 M-16-18 H5" stroke="#b48a53" strokeWidth="3" strokeLinecap="round" />
      </g>
      <g transform="translate(774 524)">
        <ellipse cx="4" cy="13" rx="51" ry="12" fill="#3f663e" opacity=".2" />
        <path d="M-42-15 H44 V-2 H-42Z M-38-34 H40 V-22 H-38Z" fill="#c68d50" stroke="#8e5e37" strokeWidth="2" />
        <path d="M-30-3 L-35 14 M31-3 L37 14 M-31-22 V-4 M31-22 V-4" stroke="#785237" strokeWidth="5" strokeLinecap="round" />
        <path d="M-31-29 H29 M-34-10 H34" stroke="#edbd78" strokeWidth="3" opacity=".65" />
      </g>
      <g transform="translate(804 574) rotate(4)">
        <path d="M-55-22 H52 V24 H-55Z" fill="#fff0d2" stroke="#e1b792" strokeWidth="3" />
        <path d="M-55-22 H52 V24 H-55Z" fill="none" stroke="#e89582" strokeWidth="6" strokeDasharray="9 8" />
        <ellipse cx="-12" cy="0" rx="15" ry="8" fill="#d5a56b" />
        <circle cx="16" cy="-4" r="8" fill="#f4c95e" /><circle cx="29" cy="5" r="7" fill="#ef9176" />
      </g>
      <Lamp x={705} y={564} s={.66} />

      {/* 右缘的木栈桥连接海面，信箱不再孤立漂在草地上 */}
      <g transform="translate(1045 559) rotate(14)">
        <path d="M-23-18 H94 V25 H-23Z" fill="#a87344" stroke="#825635" strokeWidth="3" />
        {[0, 22, 44, 66, 88].map((x) => <path key={x} d={`M${x}-17 V24`} stroke="#e1ad69" strokeWidth="4" />)}
        <path d="M-17-22 V34 M85-22 V34" stroke="#795136" strokeWidth="7" strokeLinecap="round" />
        <path d="M-17-18 H85" stroke="#efca8b" strokeWidth="3" opacity=".55" />
      </g>

      {/* 前景花草与石块，填充地标之间的视觉连接 */}
      {FLOWERS.map(([x, y, color, s], i) => <Flower key={i} x={x} y={y} color={color} s={s} />)}
      {GRASSES.map(([x, y, s], i) => <Grass key={i} x={x} y={y} s={s} />)}
      <Rock x={936} y={596} s={.55} />
      <Rock x={1076} y={520} s={.7} />
      <Rock x={287} y={587} s={.52} />
      <Tree x={185} y={491} s={.56} tone="gold" delay={-1.4} />
      <Tree x={1005} y={521} s={.52} tone="light" delay={-2.2} />

      {/* 沙滩上的贝壳、海星与岸边小石 */}
      <g transform="translate(858 612)">
        <path d="M0-9 L4-2 L12-1 L6 4 L8 12 L0 7 L-8 12 L-6 4 L-12-1 L-4-2Z" fill="#ed987d" stroke="#d47c65" strokeWidth="1.5" />
      </g>
      <g fill="#fff1cf" stroke="#d7b881" strokeWidth="1.5">
        <path d="M334 588 Q346 570 358 588 Q347 596 334 588Z" />
        <path d="M983 561 Q993 545 1005 561 Q995 570 983 561Z" />
      </g>
      <g fill="#d6ae74" opacity=".7">
        <circle cx="382" cy="601" r="3" /><circle cx="396" cy="606" r="2" /><circle cx="888" cy="602" r="3" />
        <circle cx="1018" cy="539" r="2.5" /><circle cx="223" cy="535" r="3" />
      </g>

      {/* 近景水波 */}
      <g className="world-front-waves" fill="none" stroke="#eafff4" strokeWidth="5" strokeLinecap="round" opacity=".66">
        <path d="M106 611 Q129 599 153 611 T201 611" />
        <path d="M936 655 Q960 642 984 655 T1032 655" />
        <path d="M1020 605 Q1041 594 1063 605 T1108 605" />
        <path d="M331 667 Q350 657 370 667 T410 667" />
      </g>
    </svg>
  )
}
