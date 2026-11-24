import { useEffect, useRef, useState } from 'react'
import type { ExperienceItem } from '../data/resume'

interface DetailModalProps {
  item: ExperienceItem | null
  open: boolean
  onClose: () => void
}

/**
 * 动森风格对话卡片详情弹窗
 * —— 高透暖白毛玻璃 + 圆角气泡 + 清晰层级 + 打字机标题
 * 点击卡片任意处 / 点「跳过」按钮即可一键完整展示，快速浏览。
 */
export default function DetailModal({ item, open, onClose }: DetailModalProps) {
  const [closing, setClosing] = useState(false)
  const [skipped, setSkipped] = useState(false)
  // 打字机是否已完成（用于在完成后隐藏「跳过」提示）
  const [typed, setTyped] = useState(false)
  // 控制关闭动画的展示状态
  const [mounted, setMounted] = useState(false)
  const rafRef = useRef<number | null>(null)

  // 打开时重置状态
  useEffect(() => {
    if (open) {
      setMounted(true)
      setClosing(false)
      setSkipped(false)
      setTyped(false)
    } else if (mounted) {
      // 关闭：先播退场动画，再卸载
      setClosing(true)
      rafRef.current = window.setTimeout(() => {
        setMounted(false)
        setClosing(false)
      }, 260)
    }
    return () => {
      if (rafRef.current) window.clearTimeout(rafRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  // ESC 关闭 + 锁滚动
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!item || !mounted) return null

  const reveal = () => {
    setSkipped(true)
    setTyped(true)
  }

  return (
    <div
      className={`dialog-overlay ${closing ? 'is-closing' : ''}`}
      onClick={onClose}
      role="presentation"
    >
      <div
        className={`dialog-card ${closing ? 'is-closing' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={`${item.title} 详情`}
        onClick={(e) => {
          e.stopPropagation()
          // 点击卡片：若仍在打字，则一键完整展示
          if (!skipped) reveal()
        }}
      >
        {/* 对话气泡小尾巴 */}
        <span className="dialog-tail" aria-hidden="true" />

        {/* 顶部：头像 + 打字机标题 */}
        <header className="dialog-head">
          <span className="dialog-avatar" aria-hidden="true">
            {item.kind === 'work' ? '✎' : '✦'}
          </span>
          <div className="dialog-head-text">
            <span className="dialog-badge">{item.badge}</span>
            {skipped ? (
              <h2 className="dialog-title">{item.title}</h2>
            ) : (
              <TypewriterText
                text={item.title}
                speed={42}
                onDone={() => setTyped(true)}
              />
            )}
            <p className="dialog-subtitle">
              {item.subtitle} · {item.period}
            </p>
          </div>
        </header>

        {/* 正文 */}
        <div className="dialog-body">
          <p className="dialog-summary">{item.summary}</p>

          <div className="dialog-tags">
            {item.tags.map((t) => (
              <span key={t} className="dialog-tag">
                {t}
              </span>
            ))}
          </div>

          <div className="dialog-section">亮点收获</div>
          <ul className="dialog-list">
            {item.highlights.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>

          {item.timeline.length > 0 && (
            <>
              <div className="dialog-section">成长时间线</div>
              <ol className="dialog-timeline">
                {item.timeline.map((s, i) => (
                  <li key={i}>
                    <span className="dialog-date">{s.date}</span>
                    <div className="dialog-tl-body">
                      <strong>{s.title}</strong>
                      {s.desc && <span>{s.desc}</span>}
                    </div>
                  </li>
                ))}
              </ol>
            </>
          )}
        </div>

        {/* 底部操作 */}
        <footer className="dialog-foot">
          {!typed && !skipped && (
            <button type="button" className="dialog-skip" onClick={reveal}>
              跳过 · 显示全部 ▸▸
            </button>
          )}
          {item.link && (
            <a
              className="dialog-link"
              href={item.link.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {item.link.label} ↗
            </a>
          )}
          <button type="button" className="dialog-close" onClick={onClose}>
            收好啦
          </button>
        </footer>
      </div>
    </div>
  )
}

/** 轻量打字机：逐字显示文本，完成后回调 */
function TypewriterText({
  text,
  speed,
  onDone,
}: {
  text: string
  speed: number
  onDone: () => void
}) {
  const [count, setCount] = useState(0)
  const doneRef = useRef(false)

  useEffect(() => {
    setCount(0)
    doneRef.current = false
    let i = 0
    const timer = window.setInterval(() => {
      i += 1
      setCount(i)
      if (i >= text.length) {
        window.clearInterval(timer)
        if (!doneRef.current) {
          doneRef.current = true
          onDone()
        }
      }
    }, speed)
    return () => window.clearInterval(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, speed])

  return (
    <h2 className="dialog-title">
      {text.slice(0, count)}
      {count < text.length && <span className="dialog-caret" aria-hidden="true" />}
    </h2>
  )
}
