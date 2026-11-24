import type { ReactElement } from 'react'

/** 五类地标 = 五个简历模块 */
export type LandmarkKind = 'about' | 'work' | 'projects' | 'skills' | 'contact'

/** 地标画风版本 */
export type ArtVariant = 'diorama' | 'sticker' | 'voxel' | 'sketch'

/** 每种画风的一组插画（统一 200x200 viewBox） */
export type LandmarkArtSet = Record<LandmarkKind, () => ReactElement>

export interface ArtVariantMeta {
  id: ArtVariant
  /** 切换器上的短名 */
  name: string
  /** 一句风格关键词 */
  tagline: string
  /** 对比画廊里的说明 */
  desc: string
  /** 色板，用于按钮与行头的小圆点 */
  swatch: [string, string, string]
  /** 做法标签 */
  technique: string
}

export const ART_VARIANTS: ArtVariantMeta[] = [
  {
    id: 'diorama',
    name: '微缩立体',
    tagline: '当前版本 · 软萌黏土感',
    desc: '多面渐变 + 顶部高光 + 底部环境光遮蔽，像摆在桌上的树脂微缩摆件。',
    swatch: ['#f58b7c', '#a5cd75', '#8fd6cf'],
    technique: '线性渐变 / AO 软阴影',
  },
  {
    id: 'sticker',
    name: '扁平贴纸',
    tagline: '粗白描边 · 硬投影徽章',
    desc: '高饱和纯色平涂，整块白色外描边加一道斜向硬投影，像手账里撕下来的一张贴纸。',
    swatch: ['#ff8a6b', '#ffd452', '#5ec8c0'],
    technique: 'feMorphology 外描边 / 硬阴影',
  },
  {
    id: 'voxel',
    name: '像素体素',
    tagline: '8-bit 方块 · 硬边等距',
    desc: '全部由方块拼成，阶梯状轮廓、三面色阶、crispEdges 硬边，复古掌机里的岛屿。',
    swatch: ['#e2604f', '#79b95b', '#4c93c9'],
    technique: '10px 网格 / 三面明暗 / 无抗锯齿',
  },
  {
    id: 'sketch',
    name: '手绘手账',
    tagline: '细线淡彩 · 铅笔排线',
    desc: '米黄纸底、微抖的深色勾线、半透明淡彩与斜线排线阴影，像速写本上的一页。',
    swatch: ['#d98d76', '#9fb87c', '#7fa9b8'],
    technique: '不规则描边 / 斜线 pattern / 淡彩叠色',
  },
]

/** 对比画廊的列（与岛上地标一一对应） */
export const LANDMARK_COLUMNS: { kind: LandmarkKind; label: string; sub: string }[] = [
  { kind: 'about', label: '岛主小屋', sub: '关于我' },
  { kind: 'work', label: '岛屿灯塔', sub: '工作经历' },
  { kind: 'projects', label: '果树林', sub: '项目经验' },
  { kind: 'skills', label: '瞭望台', sub: '专业技能' },
  { kind: 'contact', label: '海边信箱', sub: '联系方式' },
]
