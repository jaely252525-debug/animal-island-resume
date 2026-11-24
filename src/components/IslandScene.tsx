import { useEffect, useRef, useState } from 'react'
import type { LandmarkKind } from './landmarks/types'
import { useIslandScene, type IslandSceneHandle } from './three/useIslandScene'
import { LANDMARKS_3D } from './three/landmarks3d'
import { makeLabelSprite } from './three/labels'
import { SEASONS, SEASON_ORDER, type SeasonId } from './three/seasons'
import { profile } from '../data/resume'

/** 顶部导航与其它模块用到的地标信息（保持原字段结构） */
export const LANDMARKS = LANDMARKS_3D.map((l) => ({
  kind: l.kind,
  label: l.label,
  sub: l.sub,
}))

/** 每个地标名牌悬浮高度（相对模型根部 y=0） */
const LABEL_HEIGHT: Record<LandmarkKind, number> = {
  about: 6.4,
  work: 7.0,
  projects: 5.8,
  skills: 5.6,
  contact: 3.4,
}

interface IslandSceneProps {
  onOpen: (kind: LandmarkKind, origin: { x: number; y: number }) => void
  onSound: (kind: 'pop' | 'open' | 'close') => void
  variant?: string
}

/**
 * 3D 动森风格岛屿：Three.js 等距软陶场景。
 * 支持季节切换、拖拽旋转、缓慢自转、视线跟随动物居民、点击地标弹出图鉴。
 */
export default function IslandScene({ onOpen, onSound }: IslandSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [season, setSeason] = useState<SeasonId>('spring')
  const handleRef = useRef<IslandSceneHandle | null>(null)
  const mountedLandmarksRef = useRef<Set<string>>(new Set())

  const mountLandmarks = (handle: IslandSceneHandle, seasonId: SeasonId) => {
    // 清理旧地标
    mountedLandmarksRef.current.forEach((kind) => handle.removeLandmark(kind))
    mountedLandmarksRef.current.clear()

    LANDMARKS_3D.forEach((lm) => {
      const model = lm.build(seasonId)
      handle.addLandmark(lm.kind, model, lm.x, lm.z, lm.rotY, () => {
        onOpen(lm.kind, { x: 0, y: 0 })
      })
      const sprite = makeLabelSprite(lm.label, lm.sub, LABEL_HEIGHT[lm.kind], 0.9)
      model.add(sprite)
      mountedLandmarksRef.current.add(lm.kind)
    })
  }

  useIslandScene({
    canvasRef,
    initialSeason: season,
    onReady: (handle: IslandSceneHandle) => {
      handleRef.current = handle
      mountLandmarks(handle, season)
    },
    onPickLandmark: (kind) => {
      const lm = LANDMARKS_3D.find((l) => l.kind === (kind as LandmarkKind))
      if (lm) onOpen(lm.kind, { x: 0, y: 0 })
    },
    onSound: (k) => onSound(k),
  })

  // 季节变化时重建地标（让地标的树/屋顶积雪随季节更新）
  useEffect(() => {
    if (handleRef.current) {
      mountLandmarks(handleRef.current, season)
    }
  }, [season])

  return (
    <div className="island-scene island-scene--3d">
      {/* 动森式岛名牌（顶部居中单行横幅，不遮挡岛屿） */}
      <div className="island-sign">
        <span className="island-sign-eyebrow">WELCOME TO · {profile.islandName}</span>
        <h1 className="island-sign-name">{profile.name}</h1>
        <p className="island-sign-role">{profile.role}</p>
      </div>

      {/* 季节切换器 */}
      <div className="season-switcher" role="group" aria-label="季节切换">
        {SEASON_ORDER.map((id) => {
          const s = SEASONS[id]
          return (
            <button
              key={id}
              type="button"
              className={`season-pill ${season === id ? 'is-active' : ''}`}
              onClick={() => {
                setSeason(id)
                onSound('pop')
              }}
            >
              <span
                className="season-swatch"
                style={{ background: `linear-gradient(180deg, ${s.skyTop}, ${s.skyBottom})` }}
                aria-hidden="true"
              />
              {s.label}
            </button>
          )
        })}
      </div>

      <div className="world-stage world-stage--3d">
        <canvas ref={canvasRef} className="island-canvas" />
        <div className="landmark-hint">
          <span aria-hidden="true" />
          拖拽旋转 · 滚轮缩放 · 上下拖动调视角
        </div>
      </div>

      <p className="scene-hint">
        <span aria-hidden="true" /> 点一点岛上的地标，翻开岛民图鉴
      </p>
    </div>
  )
}
