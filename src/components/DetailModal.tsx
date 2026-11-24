import { Modal, Tag, Button, Typewriter } from 'animal-island-ui'
import type { ExperienceItem } from '../data/resume'

interface DetailModalProps {
  item: ExperienceItem | null
  open: boolean
  onClose: () => void
}

/** 简历图鉴详情弹窗 —— 使用 animal-island-ui 的 game 异形 Modal */
export default function DetailModal({ item, open, onClose }: DetailModalProps) {
  if (!item) return null

  return (
    <Modal
      open={open}
      variant="game"
      onClose={onClose}
      width={640}
      title={
        <span className="modal-title">
          <span className="modal-badge">{item.badge}</span>
          <Typewriter speed={45} trigger={item.id}>
            {item.title}
          </Typewriter>
        </span>
      }
      footer={
        <div className="modal-footer">
          {item.link && (
            <Button type="primary" size="middle" onClick={() => window.open(item.link?.url, '_blank', 'noopener,noreferrer')}>
              {item.link.label}
            </Button>
          )}
          <Button type="default" size="middle" onClick={onClose}>
            收好啦
          </Button>
        </div>
      }
    >
      <div className="modal-body">
        <p className="modal-subtitle">
          {item.subtitle} <span className="modal-dot">·</span> {item.period}
        </p>

        <p className="modal-summary">{item.summary}</p>

        <div className="modal-tags">
          {item.tags.map((tag) => (
            <Tag key={tag} size="medium" variant="soft" color="app-teal">
              {tag}
            </Tag>
          ))}
        </div>

        <div className="modal-section-title"><span className="section-spark" />亮点收获</div>
        <ul className="highlight-list">
          {item.highlights.map((h, i) => (
            <li key={i}>{h}</li>
          ))}
        </ul>

        <div className="modal-section-title"><span className="section-spark section-spark--blue" />成长时间线</div>
        <ol className="timeline">
          {item.timeline.map((step, i) => (
            <li key={i} className="timeline-item">
              <span className="timeline-date">{step.date}</span>
              <div className="timeline-content">
                <strong>{step.title}</strong>
                {step.desc && <span>{step.desc}</span>}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Modal>
  )
}
