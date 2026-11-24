import * as THREE from 'three'

/** 软陶/黏土质感材质：哑光、微糙、柔和，贴近动森的低多边形软渲染 */
export function clay(color: THREE.ColorRepresentation, roughness = 0.85): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({ color, roughness })
}

/** 十六进制字符串快速建材质（可带 roughness） */
export function c(color: THREE.ColorRepresentation, roughness?: number): THREE.MeshStandardMaterial {
  return clay(color, roughness)
}

/** 让一个 Group（及其所有子网格）投射阴影，并返回该 Group */
export function castShadow<T extends THREE.Group>(root: T): T {
  root.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) {
      o.castShadow = true
      o.receiveShadow = true
    }
  })
  return root
}

/** 圆润的立方体（三边都有倒角感——用少量分段 + 球体形变近似软陶圆角） */
export function roundedBox(
  w: number,
  h: number,
  d: number,
  mat: THREE.Material,
): THREE.Mesh {
  const geo = new THREE.BoxGeometry(w, h, d, 3, 3, 3)
  // 轻微变形顶点制造软陶圆角感
  const pos = geo.attributes.position
  const v = new THREE.Vector3()
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i)
    const rx = w / 2
    const ry = h / 2
    const rz = d / 2
    const fx = Math.abs(v.x) / rx
    const fy = Math.abs(v.y) / ry
    const fz = Math.abs(v.z) / rz
    const corner = Math.min(fx, Math.min(fy, fz))
    const pull = 0.82 + 0.18 * corner
    v.x *= pull
    v.y *= pull
    v.z *= pull
    pos.setXYZ(i, v.x, v.y, v.z)
  }
  geo.computeVertexNormals()
  const mesh = new THREE.Mesh(geo, mat)
  return mesh
}

/** 通用带屋顶的小房子 */
export function makeHouse(options: {
  bodyColor: string
  roofColor: string
  doorColor?: string
  w?: number
  h?: number
  d?: number
}): THREE.Group {
  const { bodyColor, roofColor, doorColor = '#8a5a3b' } = options
  const w = options.w ?? 4
  const h = options.h ?? 3
  const d = options.d ?? 3.4
  const g = new THREE.Group()

  const body = roundedBox(w, h, d, c(bodyColor))
  body.position.y = h / 2
  g.add(body)

  // 圆顶：用圆锥 + 顶部小球
  const roof = new THREE.Mesh(new THREE.ConeGeometry(w * 0.78, h * 0.9, 4), c(roofColor))
  roof.rotation.y = Math.PI / 4
  roof.position.y = h + h * 0.45
  g.add(roof)

  const tip = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 10), c(roofColor))
  tip.position.y = h + h * 0.9
  g.add(tip)

  // 门
  const door = new THREE.Mesh(new THREE.BoxGeometry(w * 0.32, h * 0.5, 0.2), c(doorColor))
  door.position.set(0, h * 0.25, d / 2 + 0.05)
  g.add(door)

  // 两个小窗
  const winMat = c('#bfe7ff')
  const win = (x: number) => {
    const wm = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.16), winMat)
    wm.position.set(x, h * 0.55, d / 2 + 0.05)
    g.add(wm)
  }
  win(-w * 0.25)
  win(w * 0.25)

  return castShadow(g)
}
