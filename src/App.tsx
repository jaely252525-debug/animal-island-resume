import { useState } from 'react'
import { Button, Card, Tag, Title, Footer } from 'animal-island-ui'
import IslandScene, { LANDMARKS } from './components/IslandScene'
import IslandPanel from './components/IslandPanel'
import ResumeCard from './components/ResumeCard'
import DetailModal from './components/DetailModal'
import type { LandmarkKind } from './components/landmarks/types'
import { useSound } from './hooks/useSound'
import {
  profile,
  workExperience,
  projects,
  skillGroups,
  contacts,
  type ExperienceItem,
  type SkillGroup,
} from './data/resume'

function SkillGlyph({ type }: { type: SkillGroup['icon'] }) {
  return <span className={`skill-glyph skill-glyph--${type}`} aria-hidden="true" />
}

export default function App() {
  const { play, enabled, setEnabled } = useSound()
  const [panelKind, setPanelKind] = useState<LandmarkKind | null>(null)
  const [panelOpen, setPanelOpen] = useState(false)
  const [panelOrigin, setPanelOrigin] = useState({ x: 0, y: 0 })
  const [selected, setSelected] = useState<ExperienceItem | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const openPanel = (kind: LandmarkKind, origin: { x: number; y: number }) => {
    setPanelKind(kind)
    setPanelOrigin(origin)
    setPanelOpen(true)
  }
  const closePanel = () => setPanelOpen(false)

  const openDetail = (item: ExperienceItem) => {
    setSelected(item)
    setModalOpen(true)
  }
  const closeDetail = () => {
    play('close')
    setModalOpen(false)
  }

  const allCards = [...workExperience, ...projects]

  return (
    <div className="site">
      {/* ===== 顶部快捷导航 ===== */}
      <nav className="top-nav" aria-label="快捷导航">
        <a className="nav-brand" href="#top" onClick={() => play('pop')}>
          <span className="nav-brand-mark" aria-hidden="true" />
          {profile.islandName}
        </a>
        <div className="nav-links">
          {LANDMARKS.map((lm) => (
            <button
              key={lm.kind}
              type="button"
              className="nav-link"
              onClick={(e) => {
                const r = e.currentTarget.getBoundingClientRect()
                play('open')
                openPanel(lm.kind, { x: r.left + r.width / 2, y: r.top + r.height / 2 })
              }}
            >
              {lm.sub}
            </button>
          ))}
          <button type="button" className="nav-link nav-link--list" onClick={() => { play('pop'); document.getElementById('island-notes')?.scrollIntoView({ behavior: 'smooth' }) }}>
            全部图鉴 ↓
          </button>
        </div>
      </nav>

      {/* ===== 3D 动森小岛 ===== */}
      <header className="hero" id="top">
        <IslandScene onOpen={openPanel} onSound={play} />
      </header>

      {/* ===== 上下板块过渡带：潜入图鉴 ===== */}
      <div className="dive-divider" aria-hidden="true">
        <a className="dive-link" href="#island-notes" onClick={() => play('pop')}>
          <span className="dive-waves">≋</span>
          潜下看看 · 岛民图鉴
          <span className="dive-arrow">↓</span>
        </a>
      </div>

      {/* ===== 声音开关 ===== */}
      <button
        className="sound-toggle"
        onClick={() => setEnabled(!enabled)}
        aria-label={enabled ? '关闭音效' : '开启音效'}
        title={enabled ? '点击关闭音效' : '点击开启音效'}
      >
        <span className={`sound-icon ${enabled ? 'is-on' : ''}`} aria-hidden="true" />
        {enabled ? '音效开' : '音效关'}
      </button>

      <main className="main">
        {/* ===== 列表视图：不想逐个点岛屿的访客可快速浏览 ===== */}
        <section className="section" id="island-notes">
          <Title size="large" color="app-orange" variant="ribbon">
            岛民图鉴 · 快速浏览
          </Title>
          <p className="section-lead">也可以直接在这里展开卡片，或点「查看完整图鉴」读完整故事</p>
          <div className="card-grid">
            {allCards.map((item) => (
              <ResumeCard key={item.id} item={item} onOpenDetail={openDetail} onSound={play} />
            ))}
          </div>
        </section>

        {/* ===== 关于我（列表视图，内容与地标面板一致） ===== */}
        <section className="section" id="about">
          <Title size="large" color="app-green" variant="ribbon">关于我 · 岛主档案</Title>
          <Card color="default" className="about-card">
            <div className="about-grid">
              <div className="about-avatar" aria-hidden="true"><span className="about-avatar-face">◕‿◕</span></div>
              <div className="about-text">
                <h2>嗨，我是 {profile.name}！</h2>
                <p>
                  我是【你的学校】专业【你的专业】的在校生，正在寻找【你的求职意向】的机会。
                  这里写一段简短自我介绍，突出你的性格特点、做事习惯与优势。
                </p>
                <p>
                  这里写第二段自我介绍，可以聊聊你的校园/项目经历、掌握的技能与工具，
                  以及你对未来岗位的期待。
                </p>
              </div>
            </div>
          </Card>
        </section>

        {/* ===== 专业技能 ===== */}
        <section className="section" id="skills">
          <Title size="large" color="app-teal" variant="ribbon">随身携带的道具 · 专业技能</Title>
          <div className="skill-grid">
            {skillGroups.map((group) => (
              <Card key={group.title} color={group.color} pattern="none" className="skill-card">
                <div className="skill-card-head">
                  <SkillGlyph type={group.icon} />
                  <h3>{group.title}</h3>
                </div>
                <div className="skill-tags">
                  {group.items.map((s) => (
                    <Tag key={s} size="medium" variant="soft" color="default">{s}</Tag>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* ===== 联系方式 ===== */}
        <section className="section" id="contact">
          <Title size="large" color="app-pink" variant="ribbon">来串门吧 · 联系方式</Title>
          <Card color="default" className="contact-card">
            <div className="contact-grid">
              {contacts.map((c) => (
                <a
                  key={c.label}
                  className="contact-item"
                  href={c.href}
                  target={c.href?.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  onClick={() => play('pop')}
                >
                  <span className={`contact-dot contact-dot--${c.color}`} aria-hidden="true" />
                  <span className="contact-label">{c.label}</span>
                  <span className="contact-value">{c.value}</span>
                </a>
              ))}
            </div>
          </Card>
        </section>

        <div className="back-to-island">
          <Button type="primary" size="large" onClick={() => { play('pop'); document.getElementById('top')?.scrollIntoView({ behavior: 'smooth' }) }}>
            ↑ 回到小岛
          </Button>
        </div>
      </main>

      <Footer className="site-footer" text="用爱与奶油色手工搭建 · Made with care on my little island" />

      <IslandPanel kind={panelKind} open={panelOpen} origin={panelOrigin} onClose={closePanel} onSound={play} />
      <DetailModal item={selected} open={modalOpen} onClose={closeDetail} />
    </div>
  )
}
