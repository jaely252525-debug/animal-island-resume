import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { Tag, Button } from 'animal-island-ui'
import type { LandmarkKind } from './LandmarkArt'
import { LANDMARKS } from './IslandScene'
import {
  profile,
  workExperience,
  projects,
  skillGroups,
  contacts,
  type ExperienceItem,
} from '../data/resume'

interface IslandPanelProps {
  kind: LandmarkKind | null
  open: boolean
  origin: { x: number; y: number }
  onClose: () => void
  onSound: (kind: 'pop' | 'open' | 'close') => void
}

/** 依次浮现的内容块：index 用于 30~50ms 的交错进场 */
function Stagger({ index, children, className = '' }: { index: number; children: ReactNode; className?: string }) {
  return (
    <div className={`panel-stagger ${className}`} style={{ '--i': index } as CSSProperties}>
      {children}
    </div>
  )
}

/** 单条经历 / 项目的图鉴条目 */
function EntryBook({ item, index }: { item: ExperienceItem; index: number }) {
  return (
    <Stagger index={index} className="book-entry">
      <div className="book-entry-head">
        <span className="book-badge">{item.badge}</span>
        <div className="book-heading">
          <h3>{item.title}</h3>
          <p>{item.subtitle} <span className="book-dot">·</span> {item.period}</p>
        </div>
      </div>

      <p className="book-summary">{item.summary}</p>

      <div className="book-tags">
        {item.tags.map((t) => (
          <Tag key={t} size="small" variant="soft" color="app-teal">{t}</Tag>
        ))}
      </div>

      <div className="book-section"><span className="book-spark" />亮点收获</div>
      <ul className="book-highlights">
        {item.highlights.map((h, i) => <li key={i}>{h}</li>)}
      </ul>

      <div className="book-section"><span className="book-spark book-spark--blue" />成长时间线</div>
      <ol className="book-timeline">
        {item.timeline.map((s, i) => (
          <li key={i}>
            <span className="book-date">{s.date}</span>
            <div><strong>{s.title}</strong>{s.desc && <em>{s.desc}</em>}</div>
          </li>
        ))}
      </ol>

      {item.link && (
        <Button type="default" size="small" onClick={() => window.open(item.link?.url, '_blank', 'noopener,noreferrer')}>
          {item.link.label} ↗
        </Button>
      )}
    </Stagger>
  )
}

function AboutContent() {
  return (
    <>
      <Stagger index={1} className="about-intro">
        <div className="about-portrait" aria-hidden="true">◕‿◕</div>
        <div>
          <h3>嗨，我是 {profile.name}！</h3>
          <p>
            我是【你的学校】专业【你的专业】的在校生，正在寻找【你的求职意向】的机会。
            这里写一段简短自我介绍，突出你的性格特点与做事习惯。
          </p>
        </div>
      </Stagger>
      <Stagger index={2} className="about-facts">
        <div><span>岛主昵称</span><strong>{profile.nickname}</strong></div>
        <div><span>求职方向</span><strong>{profile.role}</strong></div>
        <div><span>当前状态</span><strong>{profile.status}</strong></div>
      </Stagger>
      <Stagger index={3} className="book-tip">
        教育背景：你的学校 · 你的学院 · 你的专业（学历）20XX.XX — 20XX.XX｜主修课程占位文字
      </Stagger>
    </>
  )
}

function SkillsContent() {
  return (
    <>
      {skillGroups.map((g, i) => (
        <Stagger key={g.title} index={i + 1} className="skill-book">
          <div className="skill-book-head">
            <span className={`skill-book-glyph skill-book-glyph--${g.icon}`} aria-hidden="true" />
            <h3>{g.title}</h3>
          </div>
          <div className="book-tags">
            {g.items.map((s) => (
              <Tag key={s} size="medium" variant="soft" color={g.color}>{s}</Tag>
            ))}
          </div>
        </Stagger>
      ))}
    </>
  )
}

function ContactContent({ onCopy }: { onCopy: (v: string) => void }) {
  return (
    <>
      <Stagger index={1} className="contact-lead">
        <p>欢迎来岛上串门！无论是聊聊机会、聊聊技术，还是单纯打个招呼，都很开心收到你的消息。</p>
      </Stagger>
      {contacts.map((c, i) => (
        <Stagger key={c.label} index={i + 2} className="contact-book">
          <span className={`contact-book-dot contact-book-dot--${c.color}`} aria-hidden="true" />
          <div className="contact-book-text">
            <span>{c.label}</span>
            <strong>{c.value}</strong>
          </div>
          {c.href && (
            <a className="contact-book-link" href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
              前往 ↗
            </a>
          )}
          {c.label === '邮箱' && (
            <button type="button" className="contact-book-copy" onClick={() => onCopy(c.value)}>复制</button>
          )}
        </Stagger>
      ))}
    </>
  )
}

export default function IslandPanel({ kind, open, origin, onClose, onSound }: IslandPanelProps) {
  const [closing, setClosing] = useState(false)
  const [copied, setCopied] = useState(false)

  const requestClose = () => {
    if (closing) return
    setClosing(true)
    onSound('close')
    window.setTimeout(() => {
      setClosing(false)
      onClose()
    }, 230)
  }

  // ESC 关闭 + 打开时锁定页面滚动
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') requestClose() }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  if (!open || !kind) return null

  const meta = LANDMARKS.find((l) => l.kind === kind)!
  const list = kind === 'work' ? workExperience : kind === 'projects' ? projects : []

  const fromX = typeof window !== 'undefined' ? (origin.x - window.innerWidth / 2) * 0.16 : 0
  const fromY = typeof window !== 'undefined' ? (origin.y - window.innerHeight / 2) * 0.16 : 0
  const panelStyle = {
    '--from-x': `${fromX}px`,
    '--from-y': `${fromY}px`,
  } as CSSProperties

  const copy = (value: string) => {
    navigator.clipboard?.writeText(value).then(() => {
      setCopied(true)
      onSound('pop')
      window.setTimeout(() => setCopied(false), 1600)
    }).catch(() => {})
  }

  return (
    <div className={`panel-overlay ${closing ? 'is-closing' : ''}`} onClick={requestClose}>
      <div
        className={`island-panel ${closing ? 'is-closing' : ''}`}
        style={panelStyle}
        role="dialog"
        aria-modal="true"
        aria-label={`${meta.sub}详情`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 手账装订孔 */}
        <div className="panel-binding" aria-hidden="true">
          <span /><span /><span /><span /><span />
        </div>

        {/* 护照式标题条 */}
        <header className="panel-header">
          <div className="panel-header-text">
            <span className="panel-kicker">ISLAND FIELD NOTES · {kind.toUpperCase()}</span>
            <h2>{meta.label}<em>{meta.sub}</em></h2>
          </div>
          <button type="button" className="panel-close" onClick={requestClose} aria-label="关闭图鉴">×</button>
        </header>

        <div className="panel-scroll">
          <Stagger index={0} className="panel-notice">
            <span className="notice-dot" />
            这是 {profile.islandName} 的{meta.sub}图鉴，往下翻查看全部内容
          </Stagger>

          {kind === 'about' && <AboutContent />}
          {kind === 'skills' && <SkillsContent />}
          {kind === 'contact' && <ContactContent onCopy={copy} />}
          {(kind === 'work' || kind === 'projects') &&
            list.map((item, i) => <EntryBook key={item.id} item={item} index={i + 1} />)}
        </div>

        <footer className="panel-footer">
          <span>✦ {profile.islandName} · 岛屿图鉴</span>
          <Button type="primary" size="small" onClick={requestClose}>收好啦</Button>
        </footer>
      </div>

      {copied && <div className="copy-toast">已复制到剪贴板 ✦</div>}
    </div>
  )
}
