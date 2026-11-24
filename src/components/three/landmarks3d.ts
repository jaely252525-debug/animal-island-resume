import * as THREE from 'three'
import { c, castShadow, roundedBox, makeHouse } from './clay'
import type { LandmarkKind } from '../landmarks/types'
import { SEASONS, type SeasonId } from './seasons'

/**
 * 5 个简历地标的 3D 低多边形软陶模型。
 * 所有模型「根在脚下 y=0」，由 useIslandScene 统一落地到岛顶。
 * build 接受季节参数，让地标附属的树/花/屋顶积雪随季节变化。
 */
export interface Landmark3DDef {
  kind: LandmarkKind
  label: string
  sub: string
  x: number
  z: number
  rotY: number
  build: (season?: SeasonId) => THREE.Group
}

/** 软陶圆叶树：圆柱树干 + 多个圆球拼成的蓬松树冠 */
function clayTree(trunkH = 1.2, crownR = 1.4, crownColor = '#5eae5a', fruit?: string): THREE.Group {
  const t = new THREE.Group()
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.32, trunkH, 10), c('#8a5a3b'))
  trunk.position.y = trunkH / 2
  t.add(trunk)
  // 蓬松树冠：中心大球 + 环绕小球
  const crown = new THREE.Group()
  crown.userData.sway = true
  crown.userData.swayPhase = Math.random() * Math.PI * 2
  crown.userData.swayAmp = 0.012
  const leafMat = c(crownColor)
  const main = new THREE.Mesh(new THREE.SphereGeometry(crownR, 18, 16), leafMat)
  main.position.y = 0
  crown.add(main)
  const lobes = 5
  for (let i = 0; i < lobes; i++) {
    const a = (i / lobes) * Math.PI * 2
    const lobe = new THREE.Mesh(new THREE.SphereGeometry(crownR * 0.62, 14, 12), leafMat)
    lobe.position.set(Math.cos(a) * crownR * 0.72, crownR * 0.28, Math.sin(a) * crownR * 0.72)
    crown.add(lobe)
  }
  const topLobe = new THREE.Mesh(new THREE.SphereGeometry(crownR * 0.55, 14, 12), leafMat)
  topLobe.position.y = crownR * 0.72
  crown.add(topLobe)
  crown.position.y = trunkH + crownR * 0.7
  t.add(crown)

  // 果实点缀
  if (fruit) {
    const fruitMat = c(fruit)
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2 + 0.5
      const f = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 8), fruitMat)
      f.position.set(
        Math.cos(a) * crownR * 0.85,
        trunkH + crownR * 0.5 + Math.sin(i * 2.3) * 0.25,
        Math.sin(a) * crownR * 0.85,
      )
      t.add(f)
    }
  }
  castShadow(t)
  return t
}

/** 灌木：扁圆球 */
function clayBush(r = 0.6, color = '#6fbf66'): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.SphereGeometry(r, 16, 14), c(color))
  m.position.y = r * 0.7
  m.scale.y = 0.8
  m.castShadow = true
  m.receiveShadow = true
  return m
}

/** 小花丛：细茎 + 彩色小圆花 */
function clayFlower(x: number, z: number, color = '#ff8fb0'): THREE.Group {
  const f = new THREE.Group()
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.5, 6), c('#5a9a48'))
  stem.position.y = 0.25
  f.add(stem)
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 10, 10), c(color))
  head.position.y = 0.55
  f.add(head)
  const center = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), c('#fff2b0'))
  center.position.y = 0.58
  f.add(center)
  f.position.set(x, 0, z)
  castShadow(f)
  return f
}

/** 白色栅栏段 */
function fenceSegment(length = 2.4): THREE.Group {
  const g = new THREE.Group()
  const wood = c('#e8d8b8')
  const rail1 = new THREE.Mesh(new THREE.BoxGeometry(length, 0.16, 0.12), wood)
  rail1.position.y = 0.55
  g.add(rail1)
  const rail2 = new THREE.Mesh(new THREE.BoxGeometry(length, 0.16, 0.12), wood)
  rail2.position.y = 0.28
  g.add(rail2)
  const posts = 3
  for (let i = 0; i < posts; i++) {
    const px = -length / 2 + (i / (posts - 1)) * length
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.8, 0.14), wood)
    post.position.set(px, 0.4, 0)
    g.add(post)
  }
  castShadow(g)
  return g
}

// ================= 灯塔 =================
function buildLighthouse(season: SeasonId = 'summer'): THREE.Group {
  const g = new THREE.Group()
  const white = c('#f6f3e9')
  const red = c('#e86a5e')
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.15, 5.0, 24), white)
  body.position.y = 2.5
  g.add(body)

  const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.94, 0.96, 0.8, 24), red)
  ring.position.y = 3.0
  g.add(ring)
  const ring2 = new THREE.Mesh(new THREE.CylinderGeometry(0.99, 1.01, 0.6, 24), red)
  ring2.position.y = 1.4
  g.add(ring2)

  // 顶部观景平台
  const deck = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.2, 0.3, 24), c('#4a6a5a'))
  deck.position.y = 5.1
  g.add(deck)
  const rail = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.06, 8, 24), white)
  rail.rotation.x = Math.PI / 2
  rail.position.y = 5.45
  g.add(rail)

  // 顶灯
  const lantern = new THREE.Mesh(new THREE.SphereGeometry(0.66, 18, 16), c('#ffe9a8'))
  lantern.position.y = 5.95
  g.add(lantern)
  const cap = new THREE.Mesh(new THREE.ConeGeometry(0.8, 0.7, 20), c('#4a6a5a'))
  cap.position.y = 6.5
  g.add(cap)

  // 门口 + 小窗
  const door = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.0, 0.2), c('#8a5a3b'))
  door.position.set(0, 0.5, 1.08)
  g.add(door)
  const win = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.45, 0.16), c('#bfe7ff'))
  win.position.set(0, 2.0, 1.06)
  g.add(win)

  // 冬季：顶帽积雪
  if (season === 'winter') {
    const snow = new THREE.Mesh(new THREE.ConeGeometry(0.7, 0.4, 16), c('#ffffff', 0.9))
    snow.position.y = 6.9
    g.add(snow)
  }

  return castShadow(g)
}

// ================= 果树工坊 =================
function buildOrchard(season: SeasonId = 'summer'): THREE.Group {
  const theme = SEASONS[season]
  const g = new THREE.Group()
  const house = makeHouse({ bodyColor: '#e9b46a', roofColor: '#d07a4e', w: 3.6, h: 2.8, d: 3.2 })
  g.add(house)

  // 果树（结果子的树，秋季挂橙色果，冬季变雪松白）
  const fruitA = season === 'autumn' ? '#e8605a' : season === 'winter' ? '#e8f0f4' : '#e8605a'
  const t1 = clayTree(1.3, 1.25, theme.leafA, fruitA)
  t1.position.set(-2.8, 0, 1.6)
  t1.scale.setScalar(0.95)
  g.add(t1)
  const t2 = clayTree(1.2, 1.1, theme.leafB, season === 'winter' ? '#e8f0f4' : '#ffb347')
  t2.position.set(2.8, 0, 2.2)
  t2.scale.setScalar(0.85)
  g.add(t2)

  // 灌木 + 花
  const bush = clayBush(0.55, theme.leafB)
  bush.position.set(1.6, 0, -2.6)
  g.add(bush)
  g.add(clayFlower(-2.4, -2.6, theme.flowerColors[0]))
  g.add(clayFlower(2.2, -2.4, theme.flowerColors[1]))

  // 冬季：屋顶积雪
  if (season === 'winter') addSnow(house, 3.2)

  return castShadow(g)
}

// ================= 瞭望台 =================
function buildLookout(season: SeasonId = 'summer'): THREE.Group {
  const g = new THREE.Group()
  const wood = c('#a5713f')
  const deckH = 2.4
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.3, deckH, 12), wood)
    post.position.set(Math.cos(a) * 1.35, deckH / 2, Math.sin(a) * 1.35)
    g.add(post)
  }
  const deck = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 2.0, 0.42, 18), wood)
  deck.position.y = deckH
  g.add(deck)

  // 栏杆
  const railMat = wood
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2
    const railPost = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.5, 8), railMat)
    railPost.position.set(Math.cos(a) * 1.7, deckH + 0.3, Math.sin(a) * 1.7)
    g.add(railPost)
  }

  // 顶棚
  const roof = new THREE.Mesh(new THREE.ConeGeometry(2.1, 1.15, 8), c('#d07a4e'))
  roof.position.y = deckH + 1.7
  g.add(roof)
  const centerPost = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 1.3, 12), wood)
  centerPost.position.y = deckH + 0.6
  g.add(centerPost)

  // 冬季：顶棚积雪
  if (season === 'winter') {
    const snow = new THREE.Mesh(new THREE.ConeGeometry(1.6, 0.5, 8), c('#ffffff', 0.9))
    snow.position.y = deckH + 2.1
    g.add(snow)
  }

  // 小梯子
  const ladder = new THREE.Group()
  for (let i = 0; i < 3; i++) {
    const rung = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.7, 8), wood)
    rung.rotation.z = Math.PI / 2
    rung.position.set(0.9, 0.35 + i * 0.45, 0.9)
    ladder.add(rung)
  }
  g.add(ladder)

  return castShadow(g)
}

// ================= 海边信箱 =================
function buildMailbox(season: SeasonId = 'summer'): THREE.Group {
  const theme = SEASONS[season]
  const g = new THREE.Group()
  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 1.7, 12), c('#8a5a3b'))
  post.position.y = 0.85
  g.add(post)

  const box = roundedBox(1.2, 1.0, 1.2, c('#5aa3d0'))
  box.position.y = 2.0
  g.add(box)

  // 箱体上的信件投递口（加深颜色、略加厚，让正面辨识度更高）
  const slot = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.18, 0.1), c('#2d5f86'))
  slot.position.set(0, 1.9, 0.62)
  g.add(slot)
  // 投递口下方的浅色小挡沿，强化"投信口"的层次
  const slotLip = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.06, 0.12), c('#7db4d8'))
  slotLip.position.set(0, 1.78, 0.62)
  g.add(slotLip)

  const flagPole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.8, 8), c('#999'))
  flagPole.position.set(0.55, 2.85, 0)
  g.add(flagPole)
  const flag = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.32, 0.06), c('#e8605a'))
  flag.position.set(0.78, 3.1, 0)
  g.add(flag)

  // 周围小贝壳/花（花放在信箱侧后方，避免挡正面投信口）
  g.add(clayFlower(-1.1, -0.7, theme.flowerColors[0]))
  const shell = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 8), c('#fff2e0'))
  shell.position.set(-0.8, 0.1, -0.7)
  shell.scale.y = 0.4
  g.add(shell)

  // 冬季：信箱顶部积雪
  if (season === 'winter') {
    const snow = new THREE.Mesh(new THREE.SphereGeometry(0.5, 12, 10), c('#ffffff', 0.9))
    snow.position.set(0, 2.6, 0)
    snow.scale.set(1, 0.4, 1)
    g.add(snow)
  }

  // 隐形扩展碰撞体：放大信箱的可点击区域，让远景/鼠标悬停也能稳定命中，
  // 避免被前面细小物体挡住射线。透明不渲染，仅参与 raycast。
  const hitbox = new THREE.Mesh(
    new THREE.CylinderGeometry(1.5, 1.5, 2.6, 12),
    new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false, colorWrite: false }),
  )
  hitbox.position.y = 1.5
  hitbox.userData.isHitbox = true
  g.add(hitbox)

  castShadow(g)
  // 隐形碰撞体不投射/接收阴影，避免出现透明圆柱阴影
  hitbox.castShadow = false
  hitbox.receiveShadow = false
  return g
}

// ================= 岛主小屋（核心建筑，最精细） =================
function buildCabin(season: SeasonId = 'summer'): THREE.Group {
  const theme = SEASONS[season]
  const g = new THREE.Group()
  const house = makeHouse({ bodyColor: '#f4d9a8', roofColor: '#c96a5a', w: 4.6, h: 3.3, d: 4.2 })
  g.add(house)

  // 烟囱
  const chimney = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.6, 0.7), c('#a5713f'))
  chimney.position.set(1.5, 4.0, -1.3)
  g.add(chimney)

  // 门前台阶
  const step = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.2, 0.25, 18), c('#d9bf8f'))
  step.position.set(0, 0.12, 2.3)
  g.add(step)

  // 门廊两侧的小花 + 灌木
  g.add(clayBush(0.5, theme.leafB)).position.set(-2.4, 0, 2.4)
  g.add(clayBush(0.42, theme.leafA)).position.set(2.5, 0, 2.5)
  g.add(clayFlower(-2.2, 2.6, theme.flowerColors[0]))
  g.add(clayFlower(2.3, 2.7, theme.flowerColors[1]))

  // 小屋旁的软陶树
  const tree = clayTree(1.5, 1.5, theme.leafA)
  tree.position.set(-3.3, 0, -1.2)
  tree.scale.setScalar(1.1)
  g.add(tree)

  // 栅栏
  const fence = fenceSegment(3.6)
  fence.position.set(0, 0, 3.6)
  fence.rotation.y = 0
  g.add(fence)

  // 冬季：屋顶积雪
  if (season === 'winter') addSnow(house, 4.2)

  return castShadow(g)
}

/** 给屋顶/建筑顶部铺一层软陶积雪（薄薄一层，只盖屋顶不遮挡建筑） */
function addSnow(target: THREE.Group, width: number): void {
  const snow = new THREE.Mesh(
    new THREE.SphereGeometry(width * 0.38, 16, 12),
    c('#ffffff', 0.9),
  )
  snow.position.set(0, 4.15, 0)
  snow.scale.set(1, 0.32, 0.78)
  snow.castShadow = true
  snow.receiveShadow = true
  target.add(snow)
}

export const LANDMARKS_3D: Landmark3DDef[] = [
  // 岛主小屋：岛中央偏后，作为视觉主锚点（主建筑居中）
  { kind: 'about', label: '岛主小屋', sub: '关于我', x: 0, z: -1.5, rotY: Math.PI / 6, build: buildCabin },
  // 岛屿灯塔：左后，拉开与瞭望台的距离
  { kind: 'work', label: '岛屿灯塔', sub: '工作经历', x: -8.8, z: 1.2, rotY: -0.4, build: buildLighthouse },
  // 果树工坊：右后，略向外避免标签贴顶
  { kind: 'projects', label: '果树工坊', sub: '项目经验', x: 8.6, z: -2.2, rotY: -0.35, build: buildOrchard },
  // 森林瞭望台：左前，远离小屋避免标签重叠
  { kind: 'skills', label: '森林瞭望台', sub: '专业技能', x: -4.6, z: 7.8, rotY: 0.5, build: buildLookout },
  // 海边信箱：右前靠岛缘，正面(投信口)朝默认相机视线，四周净空不遮挡
  { kind: 'contact', label: '海边信箱', sub: '联系方式', x: 9.4, z: 4.8, rotY: 1.06, build: buildMailbox },
]
