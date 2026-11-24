import { Fragment } from 'react'
import { Title } from 'animal-island-ui'
import LandmarkArt, { ART_VARIANTS, LANDMARK_COLUMNS } from './LandmarkArt'
import type { ArtVariant } from './LandmarkArt'

interface Props {
  value: ArtVariant
  onChange: (v: ArtVariant) => void
  onSound: (kind: 'pop' | 'open' | 'close') => void
}

/** 小岛上方的画风切换条 */
export function StyleSwitcher({ value, onChange, onSound }: Props) {
  return (
    <div className="style-switcher" role="group" aria-label="地标画风切换">
      <span className="style-switcher-label">地标画风</span>
      <div className="style-switcher-pills">
        {ART_VARIANTS.map((v) => (
          <button
            key={v.id}
            type="button"
            className={`style-pill ${value === v.id ? 'is-active' : ''}`}
            aria-pressed={value === v.id}
            onClick={() => {
              if (value === v.id) return
              onSound('pop')
              onChange(v.id)
            }}
          >
            <span
              className="style-pill-swatch"
              style={{ background: `linear-gradient(135deg, ${v.swatch[0]} 0 34%, ${v.swatch[1]} 34% 68%, ${v.swatch[2]} 68%)` }}
              aria-hidden="true"
            />
            {v.name}
          </button>
        ))}
      </div>
      <a className="style-switcher-more" href="#style-lab">并排对比 ↓</a>
    </div>
  )
}

/** 4 行 × 5 列画风对比矩阵 */
export default function StyleGallery({ value, onChange, onSound }: Props) {
  const select = (v: ArtVariant, scrollBack = false) => {
    onSound('pop')
    onChange(v)
    if (scrollBack) {
      window.setTimeout(() => document.getElementById('top')?.scrollIntoView({ behavior: 'smooth' }), 60)
    }
  }

  return (
    <section className="section style-lab" id="style-lab">
      <Title size="large" color="app-teal" variant="ribbon">地标风格实验室</Title>
      <p className="section-lead">
        同一座小岛的四种画法。点任意一格即可把该画风应用到岛上的全部地标，也可以点「用这套」直接回到小岛看效果。
      </p>

      <div className="style-matrix">
        <div className="matrix-corner">画风 ＼ 地标</div>
        {LANDMARK_COLUMNS.map((col) => (
          <div className="matrix-col-head" key={col.kind}>
            <strong>{col.label}</strong>
            <em>{col.sub}</em>
          </div>
        ))}

        {ART_VARIANTS.map((v) => (
          <Fragment key={v.id}>
            <div className={`matrix-row-head ${value === v.id ? 'is-active' : ''}`}>
              <span className="matrix-row-dots" aria-hidden="true">
                {v.swatch.map((c) => <i key={c} style={{ background: c }} />)}
              </span>
              <div className="matrix-row-title">
                <strong>{v.name}</strong>
                <em>{v.tagline}</em>
              </div>
              <span className="matrix-row-tech">{v.technique}</span>
              <p className="matrix-row-desc">{v.desc}</p>
              <button
                type="button"
                className={`matrix-apply ${value === v.id ? 'is-current' : ''}`}
                onClick={() => select(v.id, true)}
              >
                {value === v.id ? '正在使用' : '用这套 ↑'}
              </button>
            </div>

            {LANDMARK_COLUMNS.map((col, i) => (
              <button
                type="button"
                key={col.kind}
                className={`matrix-cell ${i === 3 ? 'matrix-cell--tail1' : ''} ${i === 4 ? 'matrix-cell--tail2' : ''} ${value === v.id ? 'is-active' : ''}`}
                onClick={() => select(v.id)}
                aria-label={`应用${v.name}风格的${col.label}`}
                title={`${v.name} · ${col.label}`}
              >
                <span className="matrix-cell-art"><LandmarkArt kind={col.kind} variant={v.id} /></span>
                <span className="matrix-cell-name">{col.label}</span>
                <span className="matrix-cell-check" aria-hidden="true">✓</span>
              </button>
            ))}
          </Fragment>
        ))}
      </div>

      <p className="style-lab-foot">
        四套画风共用同一个地标类型与 200×200 viewBox，切换不会改变岛上的位置、标签与点击逻辑。
        想再加一套画风，按项目 <code>README.md</code> 里「新增一套地标画风」的三步即可。
      </p>
    </section>
  )
}
