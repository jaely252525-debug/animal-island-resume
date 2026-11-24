import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'

/**
 * 视线跟随小人偶
 * ------------------------------------------------------------------
 * 实现要点：
 * 1. 监听全局 mousemove，把鼠标「屏幕坐标」通过 SVG 的 getScreenCTM().inverse()
 *    精确转换为 SVG 内部坐标（不受缩放 / 滚动影响）。
 * 2. 对每只眼睛，用鼠标相对眼睛中心的「角度」决定方向、「距离」决定强度，
 *    强度 clamp 到 1，使瞳孔偏移永远限制在眼眶范围内。
 * 3. requestAnimationFrame 里做 lerp 平滑插值，避免瞳孔瞬移。
 * 4. 鼠标离开窗口 / 长时间静止（默认 3.5s）→ 目标归零自然回正；
 *    随机间隔 3~6 秒眨眼一次。
 *
 * 想改小人偶外观：直接改下面 SVG 的颜色 / 形状，眼睛中心坐标集中在 EYES 常量。
 */

interface EyeConfig {
  cx: number
  cy: number
  rx: number
  ry: number
  pupilR: number
  maxX: number
  maxY: number
}

// 眼睛中心与眼眶尺寸（SVG viewBox 300 x 300 坐标系）
const EYES: { left: EyeConfig; right: EyeConfig } = {
  left: { cx: 116, cy: 146, rx: 25, ry: 29, pupilR: 12, maxX: 11, maxY: 12 },
  right: { cx: 184, cy: 146, rx: 25, ry: 29, pupilR: 12, maxX: 11, maxY: 12 },
}

const IDLE_MS = 3500
const FOLLOW_RANGE = 260 // 鼠标离眼睛多远(SVG单位)时达到最大偏移
const LERP = 0.14 // 平滑系数，越小越「温柔」

export interface IslanderProps {
  name?: string
}

export default function Islander({ name = '小橙' }: IslanderProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const leftPupilRef = useRef<SVGGElement>(null)
  const rightPupilRef = useRef<SVGGElement>(null)

  // 当前偏移（渲染用，ref 避免高频 re-render）
  const currentRef = useRef({
    left: { x: 0, y: 0, tx: 0, ty: 0 },
    right: { x: 0, y: 0, tx: 0, ty: 0 },
  })
  const lastMoveRef = useRef(Date.now())

  const [blinking, setBlinking] = useState(false)
  const [happy, setHappy] = useState(false)

  // 鼠标移动 → 计算两只眼睛的目标偏移
  const handleMove = useCallback((e: MouseEvent) => {
    const svg = svgRef.current
    if (!svg) return
    const ctm = svg.getScreenCTM()
    if (!ctm) return

    const local = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse())
    const c = currentRef.current

    for (const side of ['left', 'right'] as const) {
      const eye = EYES[side]
      const dx = local.x - eye.cx
      const dy = local.y - eye.cy
      const dist = Math.hypot(dx, dy)
      const angle = Math.atan2(dy, dx)
      // 距离越远强度越大，但不超过 1 → 偏移被限制在 maxX/maxY 内
      const intensity = Math.min(dist / FOLLOW_RANGE, 1)
      c[side].tx = Math.cos(angle) * eye.maxX * intensity
      c[side].ty = Math.sin(angle) * eye.maxY * intensity
    }
    lastMoveRef.current = Date.now()
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', handleMove, { passive: true })

    // 鼠标离开页面 → 目标归零
    const handleLeave = (e: MouseEvent) => {
      if (!e.relatedTarget) {
        const c = currentRef.current
        c.left.tx = c.left.ty = 0
        c.right.tx = c.right.ty = 0
        lastMoveRef.current = 0
      }
    }
    document.addEventListener('mouseout', handleLeave)

    // 平滑插值动画循环
    let raf = 0
    const tick = () => {
      const now = Date.now()
      const isIdle = now - lastMoveRef.current > IDLE_MS

      if (isIdle) {
        currentRef.current.left.tx = 0
        currentRef.current.left.ty = 0
        currentRef.current.right.tx = 0
        currentRef.current.right.ty = 0
      }

      const c = currentRef.current
      c.left.x += (c.left.tx - c.left.x) * LERP
      c.left.y += (c.left.ty - c.left.y) * LERP
      c.right.x += (c.right.tx - c.right.x) * LERP
      c.right.y += (c.right.ty - c.right.y) * LERP

      if (leftPupilRef.current)
        leftPupilRef.current.setAttribute('transform', `translate(${c.left.x.toFixed(2)} ${c.left.y.toFixed(2)})`)
      if (rightPupilRef.current)
        rightPupilRef.current.setAttribute('transform', `translate(${c.right.x.toFixed(2)} ${c.right.y.toFixed(2)})`)

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseout', handleLeave)
      cancelAnimationFrame(raf)
    }
  }, [handleMove])

  // 随机眨眼：3~6 秒一次
  useEffect(() => {
    let timer: number
    const schedule = () => {
      timer = window.setTimeout(() => {
        setBlinking(true)
        window.setTimeout(() => setBlinking(false), 260)
        schedule()
      }, 3000 + Math.random() * 3000)
    }
    schedule()
    return () => clearTimeout(timer)
  }, [])

  // 点击小人偶：开心地跳一下 + 眨眼
  const handleClick = () => {
    setHappy(true)
    setBlinking(true)
    window.setTimeout(() => setBlinking(false), 260)
    window.setTimeout(() => setHappy(false), 620)
  }

  const blinkStyle = (eye: EyeConfig): CSSProperties => ({
    transformOrigin: `${eye.cx}px ${eye.cy}px`,
    transformBox: 'view-box',
  })

  return (
    <div className="islander-wrap">
      <button
        type="button"
        className={`islander-button ${happy ? 'is-happy' : ''}`}
        onClick={handleClick}
        aria-label={`点击和岛民 ${name} 互动`}
      >
        <svg
          ref={svgRef}
          className="islander-svg"
          viewBox="0 0 300 300"
          role="img"
          aria-label={`岛民 ${name}，一只毛茸茸的小岛居民`}
        >
          <defs>
            {/* 毛茸茸边缘：湍流 + 位移，让轮廓有细密绒毛感 */}
            <filter id="fur-edge" x="-25%" y="-25%" width="150%" height="150%">
              <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves={2} seed={7} result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale={7} xChannelSelector="R" yChannelSelector="G" />
            </filter>
            <radialGradient id="body-shade" cx="42%" cy="34%" r="72%">
              <stop offset="0%" stopColor="#f6d9a8" />
              <stop offset="70%" stopColor="#e8b87e" />
              <stop offset="100%" stopColor="#d99a5b" />
            </radialGradient>
            <linearGradient id="belly" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fff4db" />
              <stop offset="100%" stopColor="#fbe3b4" />
            </linearGradient>
          </defs>

          {/* 地面阴影 */}
          <ellipse cx="150" cy="276" rx="86" ry="14" fill="#cbb392" opacity="0.45" />

          {/* 身体（毛茸茸主体） */}
          <g filter="url(#fur-edge)">
            <path
              d="M150 42
                 C 96 42 58 84 58 150
                 C 58 214 96 258 150 258
                 C 204 258 242 214 242 150
                 C 242 84 204 42 150 42 Z"
              fill="url(#body-shade)"
              stroke="#b9803f"
              strokeWidth="3"
            />
            {/* 耳朵 */}
            <circle cx="96" cy="66" r="30" fill="#e8b87e" stroke="#b9803f" strokeWidth="3" />
            <circle cx="204" cy="66" r="30" fill="#e8b87e" stroke="#b9803f" strokeWidth="3" />
          </g>
          <circle cx="96" cy="66" r="15" fill="#f6c9b4" opacity="0.9" />
          <circle cx="204" cy="66" r="15" fill="#f6c9b4" opacity="0.9" />

          {/* 头顶呆毛 */}
          <path d="M150 44 q -6 -22 12 -30 q -10 16 4 30 Z" fill="#c98a4a" />

          {/* 肚皮 */}
          <ellipse cx="150" cy="196" rx="64" ry="52" fill="url(#belly)" opacity="0.95" />

          {/* 腮红 */}
          <ellipse cx="80" cy="178" rx="17" ry="10" fill="#ef9a9a" opacity="0.55" />
          <ellipse cx="220" cy="178" rx="17" ry="10" fill="#ef9a9a" opacity="0.55" />

          {/* 左眼 */}
          <g style={blinkStyle(EYES.left)} className={blinking ? 'island-eye is-blinking' : 'island-eye'}>
            <ellipse cx={EYES.left.cx} cy={EYES.left.cy} rx={EYES.left.rx} ry={EYES.left.ry} fill="#fffdf7" stroke="#7a5230" strokeWidth="3" />
            <g ref={leftPupilRef}>
              <circle cx={EYES.left.cx} cy={EYES.left.cy} r={EYES.left.pupilR} fill="#4a3220" />
              <circle cx={EYES.left.cx - 4} cy={EYES.left.cy - 5} r="3.6" fill="#fff" />
              <circle cx={EYES.left.cx + 4} cy={EYES.left.cy + 4} r="1.8" fill="#fff" opacity="0.7" />
            </g>
          </g>

          {/* 右眼 */}
          <g style={blinkStyle(EYES.right)} className={blinking ? 'island-eye is-blinking' : 'island-eye'}>
            <ellipse cx={EYES.right.cx} cy={EYES.right.cy} rx={EYES.right.rx} ry={EYES.right.ry} fill="#fffdf7" stroke="#7a5230" strokeWidth="3" />
            <g ref={rightPupilRef}>
              <circle cx={EYES.right.cx} cy={EYES.right.cy} r={EYES.right.pupilR} fill="#4a3220" />
              <circle cx={EYES.right.cx - 4} cy={EYES.right.cy - 5} r="3.6" fill="#fff" />
              <circle cx={EYES.right.cx + 4} cy={EYES.right.cy + 4} r="1.8" fill="#fff" opacity="0.7" />
            </g>
          </g>

          {/* 鼻子 + 嘴巴 */}
          <ellipse cx="150" cy="172" rx="9" ry="6.5" fill="#7a5230" />
          <path d="M150 178 v 7 M150 185 q -13 12 -25 0 M150 185 q 13 12 25 0" fill="none" stroke="#7a5230" strokeWidth="3" strokeLinecap="round" />

          {/* 开心时的小爱心 */}
          {happy && (
            <g className="island-heart">
              <path d="M232 92 a 10 10 0 0 1 18 0 l -9 11 Z" fill="#f08080" />
            </g>
          )}
        </svg>
      </button>
    </div>
  )
}
