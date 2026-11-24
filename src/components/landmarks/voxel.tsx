import type { ReactElement, ReactNode } from 'react'
import type { LandmarkArtSet } from './types'

/**
 * 风格 C：像素体素 / 8-bit 方块
 * ------------------------------------------------------------------
 * - 所有形状都是对齐 2px / 8px 网格的 <rect>，没有任何圆角或渐变
 * - 阶梯状轮廓（Tri / Blob）代替三角形与圆形
 * - 每个块用「亮面 / 主色 / 暗面」三色阶做体积
 * - shapeRendering="crispEdges" 关掉抗锯齿，硬边像素感
 */
const C = {
  paper: '#fff6dd',
  paperD: '#efe3bd',
  ink: '#4a3b2c',
  red: '#e2604f', redD: '#bd4438', redL: '#f4856f',
  cream: '#ffe9b8', creamD: '#e0bd81', creamL: '#fff3d2',
  yellow: '#ffd452', yellowD: '#e5ad2c',
  green: '#79b95b', greenD: '#56913f', greenL: '#a3d77a',
  teal: '#5ec8c0', tealD: '#3ba39c', tealL: '#9be3d9',
  blue: '#4c93c9', blueD: '#3474a8', blueL: '#8fc4e6',
  wood: '#c58a4e', woodD: '#9c6734', woodL: '#e0a86b',
  sand: '#f2d99a', sandD: '#d9bd76',
  white: '#fffaf0', whiteD: '#e3d7bb',
}

/** 整套卡带共用同一个角标色，保证 5 张像同一盒游戏卡带 */
const ACCENT = C.red

/** 一个像素方块 */
function R({ x, y, w, h, c, o }: { x: number; y: number; w: number; h: number; c: string; o?: number }) {
  return <rect x={x} y={y} width={w} height={h} fill={c} opacity={o} />
}

/** 阶梯三角形（屋顶 / 灯塔顶），从顶点逐行加宽 */
function Tri({ cx, top, rows, unit, c }: { cx: number; top: number; rows: number; unit: number; c: string }) {
  return (
    <>
      {Array.from({ length: rows }, (_, i) => {
        const half = (i + 1) * unit
        return <R key={i} x={cx - half} y={top + i * unit} w={half * 2} h={unit} c={c} />
      })}
    </>
  )
}

/** 阶梯圆（树冠 / 信箱顶），逐行给半宽 */
function Blob({ cx, top, widths, unit, c }: { cx: number; top: number; widths: number[]; unit: number; c: string }) {
  return (
    <>
      {widths.map((w, i) => <R key={i} x={cx - w} y={top + i * unit} w={w * 2} h={unit} c={c} />)}
    </>
  )
}

/** 游戏卡带式底板 */
function Cartridge({ accent, children }: { accent: string; children: ReactNode }) {
  return (
    <svg viewBox="0 0 200 200" className="landmark-svg" shapeRendering="crispEdges" aria-hidden="true">
      {/* 像素投影 */}
      <R x={16} y={16} w={176} h={176} c={C.ink} o={0.14} />
      {/* 深边 */}
      <R x={10} y={10} w={172} h={172} c={C.ink} />
      {/* 纸底 */}
      <R x={18} y={18} w={156} h={156} c={C.paper} />
      <R x={18} y={18} w={156} h={6} c={C.paperD} />
      {/* 四角像素角标 */}
      <g fill={accent}>
        <R x={22} y={22} w={14} h={4} c={accent} /><R x={22} y={22} w={4} h={14} c={accent} />
        <R x={164} y={22} w={14} h={4} c={accent} /><R x={176} y={22} w={4} h={14} c={accent} />
        <R x={22} y={174} w={14} h={4} c={accent} /><R x={22} y={162} w={4} h={16} c={accent} />
        <R x={164} y={174} w={14} h={4} c={accent} /><R x={176} y={162} w={4} h={16} c={accent} />
      </g>
      {/* 波点（方块版） */}
      <g fill={C.paperD}>
        <R x={32} y={44} w={4} h={4} c={C.paperD} /><R x={164} y={52} w={4} h={4} c={C.paperD} />
        <R x={36} y={140} w={4} h={4} c={C.paperD} /><R x={160} y={136} w={4} h={4} c={C.paperD} />
      </g>
      {children}
    </svg>
  )
}

function Grass() {
  return (
    <>
      <R x={18} y={158} w={156} h={16} c={C.greenD} />
      <R x={18} y={158} w={156} h={18} c={C.green} />
      <R x={18} y={158} w={156} h={5} c={C.greenL} />
    </>
  )
}

function House(): ReactElement {
  return (
    <Cartridge accent={ACCENT}>
      <Grass />
      {/* 烟囱（先画，屋顶压住） */}
      <R x={124} y={52} w={16} h={28} c={C.redD} />
      <R x={122} y={50} w={20} h={6} c={C.redL} />
      {/* 墙体 */}
      <R x={50} y={100} w={100} h={58} c={C.cream} />
      <R x={50} y={100} w={100} h={6} c={C.creamL} />
      <R x={140} y={100} w={10} h={58} c={C.creamD} />
      {/* 门 */}
      <R x={86} y={126} w={28} h={32} c={C.woodD} />
      <R x={90} y={130} w={20} h={28} c={C.wood} />
      <R x={106} y={144} w={4} h={4} c={C.yellow} />
      {/* 窗 */}
      <R x={56} y={112} w={26} h={26} c={C.ink} />
      <R x={60} y={116} w={18} h={18} c={C.blue} />
      <R x={68} y={116} w={4} h={18} c={C.white} />
      <R x={60} y={124} w={18} h={4} c={C.white} />
      <R x={120} y={112} w={24} h={26} c={C.ink} />
      <R x={124} y={116} w={16} h={18} c={C.blue} />
      <R x={131} y={116} w={3} h={18} c={C.white} />
      <R x={124} y={124} w={16} h={4} c={C.white} />
      {/* 屋顶：阶梯三角 */}
      <Tri cx={100} top={48} rows={6} unit={10} c={C.red} />
      <R x={40} y={98} w={30} h={10} c={C.redL} />
      <R x={40} y={88} w={20} h={10} c={C.redL} />
      <R x={130} y={98} w={30} h={10} c={C.redD} />
      <R x={36} y={106} w={128} h={8} c={C.redD} />
      {/* 花 */}
      <R x={42} y={150} w={6} h={6} c={C.yellow} />
      <R x={150} y={150} w={6} h={6} c={C.redL} />
      <R x={62} y={152} w={4} h={4} c={C.white} />
    </Cartridge>
  )
}

function Lighthouse(): ReactElement {
  return (
    <Cartridge accent={ACCENT}>
      <Grass />
      {/* 光束（像素块） */}
      <R x={146} y={42} w={24} h={8} c={C.yellow} o={0.55} />
      <R x={160} y={54} w={18} h={8} c={C.yellow} o={0.4} />
      <R x={30} y={42} w={24} h={8} c={C.yellow} o={0.45} />
      <R x={20} y={54} w={20} h={8} c={C.yellow} o={0.32} />
      {/* 岩石 */}
      <R x={54} y={148} w={92} h={10} c={C.greenD} />
      <R x={48} y={158} w={104} h={16} c={C.greenD} />
      {/* 塔身：四段阶梯 */}
      <R x={70} y={126} w={60} h={32} c={C.white} />
      <R x={76} y={100} w={48} h={30} c={C.white} />
      <R x={80} y={72} w={40} h={30} c={C.white} />
      <R x={84} y={54} w={32} h={20} c={C.white} />
      <R x={122} y={126} w={8} h={32} c={C.whiteD} />
      <R x={116} y={100} w={8} h={30} c={C.whiteD} />
      <R x={112} y={72} w={8} h={30} c={C.whiteD} />
      <R x={108} y={54} w={8} h={20} c={C.whiteD} />
      {/* 红白条纹 */}
      <R x={70} y={138} w={60} h={14} c={C.red} />
      <R x={76} y={110} w={48} h={14} c={C.red} />
      <R x={80} y={82} w={40} h={12} c={C.red} />
      {/* 小窗 */}
      <R x={94} y={126} w={12} h={10} c={C.blue} />
      <R x={94} y={94} w={12} h={10} c={C.blue} />
      {/* 平台 + 栏杆 */}
      <R x={68} y={48} w={64} h={8} c={C.blueD} />
      <R x={72} y={40} w={6} h={8} c={C.blueD} />
      <R x={122} y={40} w={6} h={8} c={C.blueD} />
      {/* 灯室 */}
      <R x={82} y={28} w={36} h={20} c={C.yellow} />
      <R x={88} y={30} w={24} h={8} c={C.white} />
      {/* 顶盖 */}
      <Tri cx={100} top={10} rows={3} unit={8} c={C.red} />
      {/* 星星 */}
      <R x={38} y={48} w={6} h={6} c={C.yellow} />
      <R x={156} y={82} w={6} h={6} c={C.yellow} />
      <R x={32} y={112} w={4} h={4} c={C.white} />
    </Cartridge>
  )
}

function Orchard(): ReactElement {
  const fruit = (x: number, y: number, s = 10) => (
    <g key={`${x}-${y}`}>
      <R x={x} y={y} w={s} h={s} c={C.red} />
      <R x={x + 2} y={y + 2} w={3} h={3} c={C.redL} />
      <R x={x + s - 3} y={y + s - 3} w={3} h={3} c={C.redD} />
    </g>
  )
  return (
    <Cartridge accent={ACCENT}>
      <Grass />
      {/* 后方小树 */}
      <R x={142} y={112} w={12} h={46} c={C.woodD} />
      <Blob cx={148} top={84} widths={[10, 18, 22, 18]} unit={10} c={C.greenD} />
      <R x={138} y={86} w={14} h={8} c={C.greenL} />
      {fruit(140, 106, 8)}{fruit(156, 112, 8)}
      {/* 主树干 */}
      <R x={88} y={106} w={24} h={52} c={C.wood} />
      <R x={88} y={106} w={6} h={52} c={C.woodL} />
      <R x={106} y={106} w={6} h={52} c={C.woodD} />
      {/* 树冠：阶梯圆 */}
      <Blob cx={96} top={40} widths={[14, 26, 34, 40, 44, 44, 40, 34, 24]} unit={10} c={C.green} />
      <R x={68} y={50} w={24} h={10} c={C.greenL} />
      <R x={60} y={60} w={16} h={10} c={C.greenL} />
      <R x={108} y={110} w={28} h={10} c={C.greenD} />
      <R x={120} y={80} w={20} h={30} c={C.greenD} />
      {/* 果实 */}
      {fruit(66, 76)}{fruit(98, 54)}{fruit(116, 88)}{fruit(82, 100)}{fruit(58, 66)}
      {/* 落果 + 小花 */}
      {fruit(126, 150, 10)}{fruit(44, 150, 8)}
      <R x={34} y={152} w={6} h={6} c={C.white} />
      <R x={160} y={152} w={6} h={6} c={C.yellow} />
    </Cartridge>
  )
}

function Lookout(): ReactElement {
  return (
    <Cartridge accent={ACCENT}>
      <Grass />
      {/* 四条腿 */}
      <R x={60} y={100} w={10} h={58} c={C.woodD} />
      <R x={130} y={100} w={10} h={58} c={C.woodD} />
      <R x={80} y={104} w={8} h={54} c={C.wood} />
      <R x={112} y={104} w={8} h={54} c={C.wood} />
      {/* 横撑 */}
      <R x={62} y={138} w={76} h={8} c={C.woodD} />
      <R x={64} y={120} w={72} h={6} c={C.woodD} />
      {/* 道具格 */}
      <R x={76} y={122} w={48} h={26} c={C.wood} />
      <R x={80} y={126} w={9} h={18} c={C.red} />
      <R x={90} y={126} w={9} h={18} c={C.yellow} />
      <R x={101} y={126} w={9} h={18} c={C.teal} />
      <R x={111} y={126} w={9} h={18} c={C.blue} />
      {/* 平台 */}
      <R x={48} y={92} w={104} h={10} c={C.woodL} />
      <R x={48} y={102} w={104} h={6} c={C.woodD} />
      {/* 护栏 */}
      <R x={52} y={72} w={8} h={22} c={C.woodD} />
      <R x={140} y={72} w={8} h={22} c={C.woodD} />
      <R x={52} y={72} w={96} h={6} c={C.wood} />
      {/* 望远镜（方块版） */}
      <R x={88} y={78} w={26} h={12} c={C.blueD} />
      <R x={88} y={78} w={26} h={4} c={C.blueL} />
      <R x={112} y={76} w={8} h={16} c={C.blue} />
      <R x={118} y={78} w={4} h={12} c={C.white} />
      {/* 屋顶 */}
      <Tri cx={100} top={26} rows={4} unit={10} c={C.teal} />
      <R x={60} y={36} w={16} h={10} c={C.tealL} />
      <R x={70} y={26} w={10} h={10} c={C.tealL} />
      <R x={42} y={64} w={116} h={8} c={C.tealD} />
      {/* 旗 */}
      <R x={98} y={12} w={4} h={16} c={C.woodD} />
      <R x={102} y={14} w={18} h={10} c={C.red} />
      <R x={102} y={14} w={18} h={4} c={C.redL} />
    </Cartridge>
  )
}

function Mailbox(): ReactElement {
  return (
    <Cartridge accent={ACCENT}>
      <R x={18} y={158} w={156} h={16} c={C.sandD} />
      <R x={18} y={158} w={156} h={18} c={C.sand} />
      <R x={18} y={158} w={156} h={5} c={C.white} o={0.6} />
      {/* 柱 + 横撑 */}
      <R x={92} y={108} w={16} h={50} c={C.wood} />
      <R x={92} y={108} w={4} h={50} c={C.woodL} />
      <R x={104} y={108} w={4} h={50} c={C.woodD} />
      <R x={76} y={130} w={48} h={8} c={C.woodD} />
      {/* 信件 */}
      <R x={86} y={74} w={30} h={20} c={C.white} />
      <R x={86} y={74} w={30} h={4} c={C.whiteD} />
      <R x={98} y={82} w={6} h={4} c={C.whiteD} />
      {/* 箱体：阶梯圆顶 */}
      <R x={74} y={64} w={52} h={12} c={C.red} />
      <R x={56} y={76} w={88} h={40} c={C.red} />
      <R x={60} y={78} w={20} h={10} c={C.redL} />
      <R x={132} y={76} w={12} h={40} c={C.redD} />
      <R x={50} y={114} w={100} h={10} c={C.redD} />
      <R x={82} y={98} w={36} h={6} c={C.ink} />
      <R x={98} y={108} w={4} h={4} c={C.yellow} />
      {/* 红旗 */}
      <R x={142} y={54} w={6} h={50} c={C.woodD} />
      <R x={148} y={56} w={20} h={12} c={C.yellow} />
      <R x={148} y={56} w={20} h={4} c={C.white} o={0.6} />
      {/* 海浪 / 贝壳 */}
      <R x={26} y={150} w={16} h={4} c={C.blueL} />
      <R x={38} y={146} w={12} h={4} c={C.blueL} />
      <R x={154} y={148} w={16} h={4} c={C.blueL} />
      <R x={46} y={154} w={8} h={6} c={C.white} />
      <R x={150} y={154} w={8} h={6} c={C.redL} />
    </Cartridge>
  )
}

/** 风格注册表：像素体素版 */
export const VOXEL: LandmarkArtSet = {
  about: House,
  work: Lighthouse,
  projects: Orchard,
  skills: Lookout,
  contact: Mailbox,
}
