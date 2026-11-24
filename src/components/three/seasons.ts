import * as THREE from 'three'

/**
 * 季节主题系统：为岛屿场景提供春/夏/秋/冬四套配色与氛围配置。
 * 每个季节定义天空渐变、雾、光照、草色、树色、花、装饰粒子（樱花/落叶/雪花）。
 */

export type SeasonId = 'spring' | 'summer' | 'autumn' | 'winter'

export interface SeasonTheme {
  id: SeasonId
  label: string
  /** 天空顶部/底部颜色（CSS 渐变用） */
  skyTop: string
  skyBottom: string
  /** 雾颜色与范围 */
  fogColor: number
  fogNear: number
  fogFar: number
  /** 半球光（天光/地光） */
  hemiSky: number
  hemiGround: number
  hemiIntensity: number
  /** 主日光颜色/强度 */
  sunColor: number
  sunIntensity: number
  /** 补光颜色/强度 */
  fillColor: number
  fillIntensity: number
  /** 草地（顶层/中层）颜色 */
  grassTop: number
  grassMid: number
  /** 沙地颜色 */
  sand: number
  /** 海水颜色 */
  sea: number
  /** 树叶主色/次色 */
  leafA: string
  leafB: string
  /** 花丛颜色（成片点缀） */
  flowerColors: string[]
  /** 装饰粒子类型 */
  particle: 'petal' | 'leaf' | 'snow' | 'none'
  /** 粒子颜色 */
  particleColor: string
}

export const SEASONS: Record<SeasonId, SeasonTheme> = {
  spring: {
    id: 'spring',
    label: '春',
    skyTop: '#8ec9f0',
    skyBottom: '#d7f0f5',
    fogColor: 0xd7f0f5,
    fogNear: 60,
    fogFar: 210,
    hemiSky: 0xcfeaff,
    hemiGround: 0x9ecb7a,
    hemiIntensity: 1.2,
    sunColor: 0xfff3dd,
    sunIntensity: 2.6,
    fillColor: 0xbfe6ff,
    fillIntensity: 0.8,
    grassTop: 0x8fd06c,
    grassMid: 0x7fc05c,
    sand: 0xf0e0b8,
    sea: 0x6ec8e8,
    leafA: '#f7a8c4',
    leafB: '#f4c1d6',
    flowerColors: ['#ff8fb0', '#ffd166', '#ff9f7a', '#c49bff', '#7ad0e8'],
    particle: 'petal',
    particleColor: '#f7a8c4',
  },
  summer: {
    id: 'summer',
    label: '夏',
    skyTop: '#5bb8ee',
    skyBottom: '#bfe8f5',
    fogColor: 0xbfe8f5,
    fogNear: 70,
    fogFar: 220,
    hemiSky: 0xdff2ff,
    hemiGround: 0x9ecb7a,
    hemiIntensity: 1.2,
    sunColor: 0xfff2dd,
    sunIntensity: 2.8,
    fillColor: 0xbfe6ff,
    fillIntensity: 0.8,
    grassTop: 0x7ccb62,
    grassMid: 0x6bb853,
    sand: 0xf0e0b8,
    sea: 0x4fb8e0,
    leafA: '#5eae5a',
    leafB: '#6bbd62',
    flowerColors: ['#ff8fb0', '#ffd166', '#ff9f7a', '#c49bff', '#7ad0e8'],
    particle: 'none',
    particleColor: '#ffffff',
  },
  autumn: {
    id: 'autumn',
    label: '秋',
    skyTop: '#f0b878',
    skyBottom: '#f8d8b0',
    fogColor: 0xf0c8a0,
    fogNear: 60,
    fogFar: 200,
    hemiSky: 0xffe0c0,
    hemiGround: 0xb89060,
    hemiIntensity: 1.15,
    sunColor: 0xffcf8a,
    sunIntensity: 2.5,
    fillColor: 0xffd9a8,
    fillIntensity: 0.7,
    grassTop: 0xb8c46a,
    grassMid: 0xa8b45a,
    sand: 0xecd8a8,
    sea: 0x5aa8c8,
    leafA: '#e8844a',
    leafB: '#f2a84a',
    flowerColors: ['#e86a3a', '#f2a84a', '#c9a24a', '#a06a3a', '#d9c86a'],
    particle: 'leaf',
    particleColor: '#e8844a',
  },
  winter: {
    id: 'winter',
    label: '冬',
    skyTop: '#a8c8e0',
    skyBottom: '#e8f2f8',
    fogColor: 0xdfeaf2,
    fogNear: 55,
    fogFar: 190,
    hemiSky: 0xe8f2fa,
    hemiGround: 0xc8d8e0,
    hemiIntensity: 1.25,
    sunColor: 0xf2f6fa,
    sunIntensity: 2.5,
    fillColor: 0xcfe4f0,
    fillIntensity: 0.9,
    grassTop: 0xeef4f6,
    grassMid: 0xe0e8ee,
    sand: 0xf4f0e4,
    sea: 0x7ab8d0,
    leafA: '#cfe0e8',
    leafB: '#e8f0f4',
    flowerColors: ['#ffffff', '#dce8f0', '#f0f4f8'],
    particle: 'snow',
    particleColor: '#ffffff',
  },
}

export const SEASON_ORDER: SeasonId[] = ['spring', 'summer', 'autumn', 'winter']

/** 生成天空渐变的 CanvasTexture（径向/线性渐变，作为场景背景） */
export function makeSkyTexture(theme: SeasonTheme): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 32
  canvas.height = 256
  const ctx = canvas.getContext('2d')!
  const grad = ctx.createLinearGradient(0, 0, 0, 256)
  grad.addColorStop(0, theme.skyTop)
  grad.addColorStop(0.55, theme.skyBottom)
  grad.addColorStop(1, theme.skyBottom)
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 32, 256)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}
