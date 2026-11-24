import * as THREE from 'three'

/** 生成一个奶油白胶囊底 + 深棕文字的标签纹理（动森式小名牌） */
export function makeLabelTexture(text: string, sub?: string): THREE.CanvasTexture {
  const padX = 26
  const padY = sub ? 13 : 11
  const lineH = 30
  const subH = sub ? 18 : 0

  // 先用离屏 canvas 精确测量文字宽度，避免中文字符宽度被低估导致裁切
  const measure = document.createElement('canvas').getContext('2d')!
  const mainFont = '800 22px Nunito, "Noto Sans SC", sans-serif'
  const subFont = '800 15px Nunito, "Noto Sans SC", sans-serif'
  measure.font = mainFont
  const textW = measure.measureText(text).width
  let subW = 0
  if (sub) {
    measure.font = subFont
    subW = measure.measureText(sub).width
  }
  const width = Math.ceil(Math.max(textW, subW) + padX * 2)
  const height = lineH + subH + padY * 2

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!
  ctx.clearRect(0, 0, width, height)

  // 柔和投影（让标签在任意季节背景上都"浮"出来、更易读）
  ctx.save()
  ctx.shadowColor = 'rgba(70, 52, 30, 0.35)'
  ctx.shadowBlur = 8
  ctx.shadowOffsetY = 3
  // 奶油白胶囊底（近纯白不透明，四季通用，避免被雪景/浅色天空吞掉）
  const r = height / 2
  ctx.fillStyle = 'rgba(255, 253, 246, 0.98)'
  ctx.strokeStyle = 'rgba(160, 136, 96, 1)'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.roundRect(0, 0, width, height, r)
  ctx.fill()
  ctx.stroke()
  ctx.restore()

  // 主文字
  ctx.fillStyle = '#3f3020'
  ctx.font = mainFont
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, width / 2, sub ? padY + lineH / 2 : height / 2)

  // 副文字
  if (sub) {
    ctx.fillStyle = '#5f4c30'
    ctx.font = subFont
    ctx.fillText(sub, width / 2, padY + lineH + subH / 2)
  }

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.minFilter = THREE.LinearFilter
  return tex
}

/** 在对象上方创建一个始终面向相机的文字名牌 Sprite */
export function makeLabelSprite(text: string, sub?: string, y = 0, scale = 1): THREE.Sprite {
  const tex = makeLabelTexture(text, sub)
  const mat = new THREE.SpriteMaterial({ map: tex, depthTest: false, transparent: true })
  const sprite = new THREE.Sprite(mat)
  // 按纹理宽高比缩放
  const aspect = tex.image.width / tex.image.height
  const h = 1.6 * scale
  sprite.scale.set(h * aspect, h, 1)
  sprite.position.y = y
  sprite.renderOrder = 999
  return sprite
}
