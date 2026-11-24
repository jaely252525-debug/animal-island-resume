import { useState } from 'react'
import { Card, Tag, Button } from 'animal-island-ui'
import type { ExperienceItem } from '../data/resume'

interface ResumeCardProps {
  item: ExperienceItem
  onOpenDetail: (item: ExperienceItem) => void
  onSound: (kind: 'pop' | 'open' | 'close') => void
}

/** 单张图鉴卡片：点击可展开/收起摘要，按钮打开完整详情弹窗 */
export default function ResumeCard({ item, onOpenDetail, onSound }: ResumeCardProps) {
  const [expanded, setExpanded] = useState(false)

  const toggle = () => {
    const next = !expanded
    setExpanded(next)
    onSound(next ? 'open' : 'close')
  }

  return (
    <Card
      color={item.color}
      // 用饱和纯色而非波点壁纸：波点会把底色冲淡，导致白色标题不可读
      pattern="none"
      hoverable
      className="resume-card"
      onClick={toggle}
      role="button"
      tabIndex={0}
      aria-expanded={expanded}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          toggle()
        }
      }}
    >
      <div className="card-top">
        <span className="card-badge">{item.badge}</span>
        <span className={`card-kind card-kind--${item.kind}`}>
          {item.kind === 'work' ? '工作经历' : '项目经验'}
        </span>
      </div>

      <h3 className="card-title">{item.title}</h3>
      <p className="card-subtitle">{item.subtitle}</p>
      <p className="card-period">{item.period}</p>

      <div className="card-tags">
        {item.tags.slice(0, 4).map((tag) => (
          <Tag key={tag} size="small" variant="soft" color={item.color}>
            {tag}
          </Tag>
        ))}
      </div>

      {/* CSS Grid 0fr ↔ 1fr 展开动画，呼应库 Collapse 的实现方式 */}
      <div className={`card-collapse ${expanded ? 'is-expanded' : ''}`}>
        <div className="card-collapse-inner">
          <p className="card-summary">{item.summary}</p>
          <ul className="card-highlights">
            {item.highlights.slice(0, 2).map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
          <Button
            type="primary"
            size="small"
            onClick={(e) => {
              e.stopPropagation()
              onSound('open')
              onOpenDetail(item)
            }}
          >
            查看完整图鉴 →
          </Button>
        </div>
      </div>

      <div className="card-hint">{expanded ? '点击收起 ▲' : '点击展开图鉴 ▼'}</div>
    </Card>
  )
}
