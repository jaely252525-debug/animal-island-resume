import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { SEASONS, makeSkyTexture, type SeasonId, type SeasonTheme } from './seasons'

export interface IslandSceneHandle {
  /** 把地标模型挂到岛上（根在脚下，自动落地到岛顶）并注册拾取 */
  addLandmark: (kind: string, model: THREE.Object3D, x: number, z: number, rotY: number, onPick: () => void) => void
  /** 移除并销毁地标模型 */
  removeLandmark: (kind: string) => void
  /** 把岛民挂到岛上 */
  addIslander: (islander: THREE.Object3D) => void
  /** 每帧回调（用于岛民视线跟随、动画等） */
  onFrame: (fn: (camera: THREE.Camera, dt: number) => void) => void
  /** 切换季节（重建场景色调与装饰） */
  setSeason: (season: SeasonId) => void
  /** 镜头飞近某个地标（丝滑运镜），完成后回调 */
  flyToLandmark: (kind: string, onDone?: () => void) => void
  /** 镜头回到小岛全景视角 */
  resetView: (onDone?: () => void) => void
}

/** 岛顶地面的世界坐标高度（地标/角色统一落地基准） */
export const GROUND_Y = 3.4

/**
 * 动森风格 3D 岛屿场景引擎。
 * 透视相机 + 柔和日光，模拟《集合啦！动物森友会》的软陶低多边形质感。
 * 支持季节切换（春/夏/秋/冬）、拖拽旋转（带惯性）、滚轮/双指缩放、俯仰角调节与空闲缓慢自转。
 */
export function useIslandScene(options: {
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  onReady: (handle: IslandSceneHandle) => void
  onPickLandmark: (kind: string) => void
  onSound: (kind: 'pop') => void
  initialSeason?: SeasonId
}) {
  const { canvasRef, onReady, onPickLandmark, onSound, initialSeason = 'spring' } = options

  const onReadyRef = useRef(onReady)
  const onPickRef = useRef(onPickLandmark)
  const onSoundRef = useRef(onSound)
  const seasonRef = useRef<SeasonId>(initialSeason)
  seasonRef.current = initialSeason
  onReadyRef.current = onReady
  onPickRef.current = onPickLandmark
  onSoundRef.current = onSound

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.12
    renderer.outputColorSpace = THREE.SRGBColorSpace

    const scene = new THREE.Scene()

    // 天空背景（渐变，动态）
    const skyMat = new THREE.MeshBasicMaterial({ side: THREE.BackSide, fog: false, depthWrite: false })
    const skyMesh = new THREE.Mesh(new THREE.SphereGeometry(150, 32, 20), skyMat)
    skyMesh.renderOrder = -10
    scene.add(skyMesh)

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 400)

    const world = new THREE.Group()
    scene.add(world)

    // ---- 光照（季节可变） ----
    const hemi = new THREE.HemisphereLight(0xffffff, 0xffffff, 1)
    scene.add(hemi)

    // 柔和环境光补足暗部，避免阴影过黑
    const ambient = new THREE.AmbientLight(0xffffff, 0.35)
    scene.add(ambient)

    const sun = new THREE.DirectionalLight(0xffffff, 1)
    sun.position.set(18, 30, 14)
    sun.castShadow = true
    sun.shadow.mapSize.set(2048, 2048)
    sun.shadow.camera.left = -45
    sun.shadow.camera.right = 45
    sun.shadow.camera.top = 45
    sun.shadow.camera.bottom = -45
    sun.shadow.camera.near = 1
    sun.shadow.camera.far = 90
    sun.shadow.bias = -0.0004
    sun.shadow.normalBias = 0.03
    sun.shadow.radius = 3 // 软阴影：加宽 PCF 滤波，让投影边缘柔和
    world.add(sun)
    world.add(sun.target)

    const fill = new THREE.DirectionalLight(0xffffff, 1)
    fill.position.set(-12, 8, -10)
    world.add(fill)

    const rim = new THREE.DirectionalLight(0xffffff, 0.4)
    rim.position.set(0, 5, -16)
    world.add(rim)

    // ---- 地形与装饰（季节可变，需要重建） ----
    const terrainGroup = new THREE.Group()
    world.add(terrainGroup)

    const decorGroup = new THREE.Group()
    world.add(decorGroup)

    // ---- 海水（分层水体：海床渐变 + 半透明海面 + 边缘白浪花环） ----
    const seaGroup = new THREE.Group()
    world.add(seaGroup)

    // 海床（底层，颜色随季节，带柔和径向明暗渐变）
    const seaFloorMat = new THREE.MeshStandardMaterial({ color: 0x7ec8e8, roughness: 0.55, metalness: 0 })
    const seaFloor = new THREE.Mesh(new THREE.CircleGeometry(56, 80), seaFloorMat)
    seaFloor.rotation.x = -Math.PI / 2
    seaFloor.position.y = -1.4
    seaFloor.receiveShadow = true
    seaGroup.add(seaFloor)

    // 海面主体（半透明，贴在地形底部边缘，透出下层的柔和层次）
    const seaMat = new THREE.MeshStandardMaterial({
      color: 0x6ec8e8,
      roughness: 0.15,
      metalness: 0.05,
      transparent: true,
      opacity: 0.92,
    })
    const sea = new THREE.Mesh(new THREE.CircleGeometry(50, 72), seaMat)
    sea.rotation.x = -Math.PI / 2
    sea.position.y = -0.5
    sea.receiveShadow = true
    seaGroup.add(sea)

    // 岛屿边缘白色浪花环（呼吸动画的泡沫环，让岛像浮在海上）
    const foamRing = buildFoamRing(28)
    seaGroup.add(foamRing.group)

    // 水面高光微光层（轻微发光，增强"水"的通透感）
    const sheenMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.08,
      depthWrite: false,
      toneMapped: false,
    })
    const sheen = new THREE.Mesh(new THREE.CircleGeometry(49.5, 72), sheenMat)
    sheen.rotation.x = -Math.PI / 2
    sheen.position.y = -0.48
    seaGroup.add(sheen)

    // ---- 云朵 ----
    const clouds = buildClouds()
    clouds.forEach((c) => world.add(c))

    // ---- 季节粒子（樱花/落叶/雪花） ----
    const particles = new THREE.Group()
    world.add(particles)
    let particleSystem: ParticleSystem | null = null

    // ---- 拾取 ----
    const pickables = new Map<string, { obj: THREE.Object3D; onPick: () => void }>()
    const landmarkPositions = new Map<string, { x: number; z: number }>()
    const frameCallbacks: Array<(camera: THREE.Camera, dt: number) => void> = []

    // 可随风摆动的树冠缓存（装饰树 + 地标附属树，applySeason/重建后刷新）
    const swayCrowns: THREE.Group[] = []
    const refreshSwayCrowns = () => {
      swayCrowns.length = 0
      world.traverse((o) => {
        if (o.userData.sway) swayCrowns.push(o as THREE.Group)
      })
    }

    /** 应用季节：更新天空/雾/光照/海水，重建地形与装饰 */
    const applySeason = (seasonId: SeasonId) => {
      const theme = SEASONS[seasonId]
      skyMat.map = makeSkyTexture(theme)
      skyMat.needsUpdate = true
      scene.fog = new THREE.Fog(theme.fogColor, theme.fogNear, theme.fogFar)
      scene.background = null // 用天空球

      hemi.color.set(theme.hemiSky)
      hemi.groundColor.set(theme.hemiGround)
      hemi.intensity = theme.hemiIntensity
      sun.color.set(theme.sunColor)
      sun.intensity = theme.sunIntensity
      fill.color.set(theme.fillColor)
      fill.intensity = theme.fillIntensity
      seaMat.color.set(theme.sea)
      seaFloorMat.color.set(theme.sea)

      // 重建地形
      while (terrainGroup.children.length) {
        const c = terrainGroup.children[0]
        terrainGroup.remove(c)
        disposeObject(c)
      }
      terrainGroup.add(buildIslandTerrain(theme))

      // 重建装饰（树、灌木、花、栅栏、桥、长椅）
      while (decorGroup.children.length) {
        const c = decorGroup.children[0]
        decorGroup.remove(c)
        disposeObject(c)
      }
      decorGroup.add(buildIslandDecor(theme))

      // 重建粒子
      if (particleSystem) {
        particles.remove(particleSystem.group)
        particleSystem.dispose()
      }
      particleSystem = buildParticles(theme)
      if (particleSystem) particles.add(particleSystem.group)

      // 刷新树冠摆动缓存
      refreshSwayCrowns()
    }

    const handle: IslandSceneHandle = {
      addLandmark: (kind, model, x, z, rotY, onPick) => {
        model.position.set(x, GROUND_Y, z)
        model.rotation.y = rotY
        world.add(model)

        // 地标底部的接触阴影（软 AO blob，让建筑"坐"在岛上而不是浮着）
        const blob = makeContactShadow(model)
        model.add(blob)

        pickables.set(kind, { obj: model, onPick })
        landmarkPositions.set(kind, { x, z })

        // 地标附属树冠加入后，刷新摆动缓存
        refreshSwayCrowns()
      },
      removeLandmark: (kind) => {
        const entry = pickables.get(kind)
        if (entry) {
          world.remove(entry.obj)
          disposeObject(entry.obj)
          pickables.delete(kind)
          landmarkPositions.delete(kind)
        }
      },
      addIslander: (islander) => {
        world.add(islander)
      },
      onFrame: (fn) => {
        frameCallbacks.push(fn)
      },
      setSeason: (seasonId) => {
        applySeason(seasonId)
      },
      flyToLandmark: () => {
        // 在相机变量初始化后赋值（见下方 flyToLandmark 实现）
      },
      resetView: () => {
        // 在相机变量初始化后赋值
      },
    }
    onReadyRef.current(handle)

    // 初始季节
    applySeason(seasonRef.current)

    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()

    // ---- 相机控制 ----
    let yaw = Math.PI / 4
    let pitch = 0.66
    let distance = 52
    let yawVelocity = 0
    let autoSpeed = 0.04
    let isDragging = false
    let lastX = 0
    let lastY = 0
    let idleTimer = 0
    let pointerMoved = false
    let pinchStartDist = 0

    // 相机看向的目标点（默认看向岛心，flyTo 时过渡到地标）
    const lookTarget = new THREE.Vector3(0, GROUND_Y * 0.95, 0)

    // 是否处于程序化运镜中（gsap 补间接管相机，暂停用户惯性/自转）
    let isTweening = false
    let tweenPitch = pitch
    let tweenYaw = yaw
    let tweenDistance = distance
    const tweenTarget = new THREE.Vector3()

    const updateCamera = () => {
      // 运镜时用 gsap 补间的值，否则用实时值（带轻微阻尼）
      let cyaw = yaw
      let cpitch = pitch
      let cdist = distance
      if (isTweening) {
        cyaw = tweenYaw
        cpitch = tweenPitch
        cdist = tweenDistance
        lookTarget.lerp(tweenTarget, 0.14)
      }

      const cp = Math.cos(cpitch)
      const sp = Math.sin(cpitch)
      camera.position.set(
        lookTarget.x + Math.sin(cyaw) * cp * cdist,
        lookTarget.y + sp * cdist,
        lookTarget.z + Math.cos(cyaw) * cp * cdist,
      )
      camera.lookAt(lookTarget)
    }

    // ---- 镜头运镜：flyTo / reset ----
    let cameraTween: gsap.core.Timeline | null = null

    const flyToLandmark = (kind: string, onDone?: () => void) => {
      const pos = landmarkPositions.get(kind)
      if (!pos) {
        onDone?.()
        return
      }
      // 停止之前的运镜
      cameraTween?.kill()

      // 同步当前值到补间起点
      tweenYaw = yaw
      tweenPitch = pitch
      tweenDistance = distance
      tweenTarget.copy(lookTarget)

      isTweening = true
      autoSpeed = 0
      idleTimer = 0

      const startYaw = yaw
      const startPitch = pitch
      const startDist = distance

      cameraTween = gsap.timeline({
        onComplete: () => {
          isTweening = false
          yaw = tweenYaw
          pitch = tweenPitch
          distance = tweenDistance
          lookTarget.copy(tweenTarget)
          onDone?.()
        },
      })

      // 目标视角：相机看向地标上方，拉近距离形成特写（yaw 基本保持，主要靠目标点平移 + 拉近）
      const targetX = pos.x
      const targetZ = pos.z

      cameraTween
        .to(tweenTarget, {
          x: targetX,
          y: GROUND_Y * 0.7,
          z: targetZ,
          duration: 1.15,
          ease: 'power2.inOut',
        }, 0)
        .to(
          {},
          {
            duration: 1.15,
            ease: 'power2.inOut',
            onUpdate: function (this: unknown) {
              const p = (this as { progress: () => number }).progress()
              tweenPitch = THREE.MathUtils.lerp(startPitch, 0.7, p)
              tweenDistance = THREE.MathUtils.lerp(startDist, 13, p)
              tweenYaw = startYaw // yaw 保持，避免绕圈
            },
          },
          0,
        )
    }

    const resetView = (onDone?: () => void) => {
      cameraTween?.kill()
      tweenYaw = yaw
      tweenPitch = pitch
      tweenDistance = distance
      tweenTarget.copy(lookTarget)

      const startPitch = pitch
      const startDist = distance

      isTweening = true
      cameraTween = gsap.timeline({
        onComplete: () => {
          isTweening = false
          yaw = tweenYaw
          pitch = tweenPitch
          distance = tweenDistance
          lookTarget.copy(tweenTarget)
          idleTimer = 0
          onDone?.()
        },
      })
        .to(tweenTarget, {
          x: 0,
          y: GROUND_Y * 0.95,
          z: 0,
          duration: 1.0,
          ease: 'power2.inOut',
        }, 0)
        .to(
          {},
          {
            duration: 1.0,
            ease: 'power2.inOut',
            onUpdate: function (this: unknown) {
              const p = (this as { progress: () => number }).progress()
              tweenPitch = THREE.MathUtils.lerp(startPitch, 0.66, p)
              tweenDistance = THREE.MathUtils.lerp(startDist, 52, p)
              tweenYaw = yaw
            },
          },
          0,
        )
    }

    // 把运镜方法挂回 handle（在相机变量初始化后）
    handle.flyToLandmark = flyToLandmark
    handle.resetView = resetView

    const setPointerFromEvent = (e: MouseEvent | Touch | PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1
      pointer.y = -((e.clientY - r.top) / r.height) * 2 + 1
    }

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true
      autoSpeed = 0
      // 用户主动拖拽时，中断正在进行的运镜补间
      if (isTweening) {
        cameraTween?.kill()
        isTweening = false
        yaw = tweenYaw
        pitch = tweenPitch
        distance = tweenDistance
        lookTarget.copy(tweenTarget)
      }
      lastX = e.clientX
      lastY = e.clientY
      yawVelocity = 0
      pointerMoved = false
      canvas.setPointerCapture(e.pointerId)
    }

    const onPointerMove = (e: PointerEvent) => {
      setPointerFromEvent(e)
      if (!isDragging) return
      const dx = e.clientX - lastX
      const dy = e.clientY - lastY
      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) pointerMoved = true
      yawVelocity = (dx / canvas.clientWidth) * 4
      yaw += yawVelocity
      pitch = THREE.MathUtils.clamp(pitch - (dy / canvas.clientHeight) * 1.6, 0.28, 1.25)
      lastX = e.clientX
      lastY = e.clientY
    }

    const onPointerUp = (e: PointerEvent) => {
      if (!isDragging) return
      isDragging = false
      idleTimer = 0
      canvas.releasePointerCapture(e.pointerId)
      if (!pointerMoved) pick(e)
    }

    const pick = (e: MouseEvent | Touch | PointerEvent) => {
      setPointerFromEvent(e)
      raycaster.setFromCamera(pointer, camera)
      const targets: THREE.Object3D[] = []
      pickables.forEach((p) => targets.push(p.obj))
      const hits = raycaster.intersectObjects(targets, true)
      if (hits.length > 0) {
        let node: THREE.Object3D | null = hits[0].object
        while (node) {
          for (const [kind, p] of pickables) {
            if (p.obj === node) {
              onSoundRef.current('pop')

              // Q 弹缩放反馈：地标模型轻盈地弹一下
              const model = p.obj
              gsap.fromTo(
                model.scale,
                { x: 1, y: 1, z: 1 },
                {
                  x: 1.06,
                  y: 1.06,
                  z: 1.06,
                  duration: 0.16,
                  yoyo: true,
                  repeat: 1,
                  ease: 'power1.out',
                },
              )

              // 镜头飞近该地标，飞到位后再展开详情
              flyToLandmark(kind, () => {
                onPickRef.current(kind)
              })
              return
            }
          }
          node = node.parent
        }
      }
    }

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      distance = THREE.MathUtils.clamp(distance + e.deltaY * 0.03, 18, 70)
    }

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        pinchStartDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY,
        )
      }
    }
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault()
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY,
        )
        distance = THREE.MathUtils.clamp(distance * (pinchStartDist / dist), 18, 70)
        pinchStartDist = dist
      }
    }

    canvas.addEventListener('pointerdown', onPointerDown)
    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerup', onPointerUp)
    canvas.addEventListener('pointercancel', onPointerUp)
    canvas.addEventListener('pointerleave', onPointerUp)
    canvas.addEventListener('wheel', onWheel, { passive: false })
    canvas.addEventListener('touchstart', onTouchStart, { passive: true })
    canvas.addEventListener('touchmove', onTouchMove, { passive: false })

    const resize = () => {
      const w = canvas.clientWidth || 1
      const h = canvas.clientHeight || 1
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      updateCamera()
    }
    resize()
    updateCamera()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    // ---- 渲染循环 ----
    let raf = 0
    let prev = performance.now()
    let lastSeason = seasonRef.current
    const animate = (now: number) => {
      raf = requestAnimationFrame(animate)
      const dt = Math.min((now - prev) / 1000, 0.05)
      prev = now

      // 监听外部季节变化
      if (seasonRef.current !== lastSeason) {
        lastSeason = seasonRef.current
        applySeason(lastSeason)
      }

      if (!isDragging) {
        idleTimer += dt
        if (idleTimer > 2.5) autoSpeed = 0.04
        yaw += autoSpeed * dt
      } else if (Math.abs(yawVelocity) > 0.0002) {
        yaw += yawVelocity * dt
        yawVelocity *= 0.9
      }

      updateCamera()

      // 天空球跟随相机
      skyMesh.position.copy(camera.position)

      const t = now * 0.0001
      clouds.forEach((c, i) => {
        c.position.x += Math.sin(t + i) * 0.003
        // 云朵缓慢上下漂浮
        c.position.y += Math.sin(t * 0.6 + i * 1.7) * 0.002
      })

      // 浪花呼吸动画
      foamRing.update(now * 0.001)

      // 树冠微风摆动（轻柔、克制）
      const swayT = now * 0.001
      for (const crown of swayCrowns) {
        const phase = crown.userData.swayPhase ?? 0
        const amp = crown.userData.swayAmp ?? 0.012
        crown.rotation.z = Math.sin(swayT * 1.2 + phase) * amp
        crown.rotation.x = Math.sin(swayT * 0.9 + phase * 1.3) * amp * 0.7
      }

      if (particleSystem) particleSystem.update(dt)

      frameCallbacks.forEach((fn) => fn(camera, dt))

      renderer.render(scene, camera)
    }
    raf = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerup', onPointerUp)
      canvas.removeEventListener('pointercancel', onPointerUp)
      canvas.removeEventListener('pointerleave', onPointerUp)
      canvas.removeEventListener('wheel', onWheel)
      canvas.removeEventListener('touchstart', onTouchStart)
      canvas.removeEventListener('touchmove', onTouchMove)
      pickables.clear()
      frameCallbacks.length = 0
      if (particleSystem) {
        particles.remove(particleSystem.group)
        particleSystem.dispose()
      }
      renderer.dispose()
    }
  }, [canvasRef])
}

function disposeObject(root: THREE.Object3D) {
  root.traverse((o) => {
    const mesh = o as THREE.Mesh
    if (mesh.isMesh) {
      mesh.geometry?.dispose()
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
      mats.forEach((m) => m?.dispose())
    }
  })
}

/**
 * 在地标底部生成一个柔和的接触阴影（AO blob）。
 * 用径向渐变 Canvas 贴图做一个扁圆片，贴在地面，模拟软陶物体的"落脚阴影"，
 * 解决纯 shadow-map 下物体与地面接触处偏硬、显"浮"的问题。
 */
function makeContactShadow(model: THREE.Object3D): THREE.Mesh {
  const box = new THREE.Box3().setFromObject(model)
  const size = box.getSize(new THREE.Vector3())
  const radius = Math.max(size.x, size.z) * 0.5

  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 128
  const ctx = canvas.getContext('2d')!
  const grad = ctx.createRadialGradient(64, 64, 8, 64, 64, 64)
  grad.addColorStop(0, 'rgba(40, 30, 18, 0.34)')
  grad.addColorStop(0.55, 'rgba(40, 30, 18, 0.16)')
  grad.addColorStop(1, 'rgba(40, 30, 18, 0)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 128, 128)

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  const mat = new THREE.MeshBasicMaterial({
    map: tex,
    transparent: true,
    depthWrite: false,
  })
  const blob = new THREE.Mesh(new THREE.PlaneGeometry(radius * 2.4, radius * 2.4), mat)
  blob.rotation.x = -Math.PI / 2
  blob.position.y = 0.02
  blob.renderOrder = 1
  return blob
}

/** 软陶质感圆形岛体：分层土台 + 草地 + 沙滩环 + 蜿蜒小径 */
function buildIslandTerrain(theme: SeasonTheme): THREE.Group {
  const g = new THREE.Group()
  const grassMat = new THREE.MeshStandardMaterial({ color: theme.grassTop, roughness: 0.88 })
  const grassDarkMat = new THREE.MeshStandardMaterial({ color: theme.grassMid, roughness: 0.9 })
  const clayMat = new THREE.MeshStandardMaterial({ color: 0xc9a06b, roughness: 0.95 })
  const sandMat = new THREE.MeshStandardMaterial({ color: theme.sand, roughness: 1 })

  const base = new THREE.Mesh(new THREE.CylinderGeometry(23, 25, 5, 56), clayMat)
  base.position.y = -1.6
  base.castShadow = true
  base.receiveShadow = true
  g.add(base)

  const mid = new THREE.Mesh(new THREE.CylinderGeometry(18, 20, 3.4, 56), grassDarkMat)
  mid.position.y = 0.7
  mid.castShadow = true
  mid.receiveShadow = true
  g.add(mid)

  const top = new THREE.Mesh(new THREE.CylinderGeometry(14.5, 16, 1.7, 56), grassMat)
  top.position.y = 2.55
  top.castShadow = true
  top.receiveShadow = true
  g.add(top)

  const beach = new THREE.Mesh(new THREE.CylinderGeometry(16.1, 16.2, 0.6, 56), sandMat)
  beach.position.y = 2.6
  g.add(beach)

  // 蜿蜒小径
  const pathMat = new THREE.MeshStandardMaterial({ color: 0xe8d5a8, roughness: 1 })
  const pathPoints = [
    { x: -5, z: -6, s: 1.4 },
    { x: -2.5, z: -3, s: 1.3 },
    { x: 0, z: 0, s: 1.5 },
    { x: 3, z: 3, s: 1.3 },
    { x: 6, z: 6, s: 1.4 },
  ]
  pathPoints.forEach((p) => {
    const seg = new THREE.Mesh(new THREE.CylinderGeometry(p.s, p.s, 0.12, 22), pathMat)
    seg.position.set(p.x, GROUND_Y + 0.02, p.z)
    seg.receiveShadow = true
    g.add(seg)
  })

  return g
}

/** 软陶圆叶树（层层叠叠的蓬松团块树冠） */
function clayTree(trunkH = 1.3, crownR = 1.3, crownColor = '#5eae5a'): THREE.Group {
  const t = new THREE.Group()
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.22, 0.32, trunkH, 10),
    new THREE.MeshStandardMaterial({ color: '#8a5a3b', roughness: 0.9 }),
  )
  trunk.position.y = trunkH / 2
  t.add(trunk)
  const crown = new THREE.Group()
  crown.userData.sway = true // 标记为可随风摆动的树冠
  crown.userData.swayPhase = Math.random() * Math.PI * 2
  crown.userData.swayAmp = 0.012 // 摆动幅度（克制）
  const leafMat = new THREE.MeshStandardMaterial({ color: crownColor, roughness: 0.85 })
  const main = new THREE.Mesh(new THREE.SphereGeometry(crownR, 18, 16), leafMat)
  crown.add(main)
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2
    const lobe = new THREE.Mesh(new THREE.SphereGeometry(crownR * 0.62, 14, 12), leafMat)
    lobe.position.set(Math.cos(a) * crownR * 0.72, crownR * 0.22, Math.sin(a) * crownR * 0.72)
    crown.add(lobe)
  }
  const topLobe = new THREE.Mesh(new THREE.SphereGeometry(crownR * 0.55, 14, 12), leafMat)
  topLobe.position.y = crownR * 0.68
  crown.add(topLobe)
  crown.position.y = trunkH + crownR * 0.62
  t.add(crown)
  t.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) {
      o.castShadow = true
      o.receiveShadow = true
    }
  })
  return t
}

/** 岛内装饰：树木、灌木、花丛、栅栏、木桥、长椅 */
function buildIslandDecor(theme: SeasonTheme): THREE.Group {
  const g = new THREE.Group()
  const bushMat = new THREE.MeshStandardMaterial({ color: theme.leafB, roughness: 0.9 })
  const bushMat2 = new THREE.MeshStandardMaterial({ color: theme.leafA, roughness: 0.9 })
  const woodMat = new THREE.MeshStandardMaterial({ color: '#a5713f', roughness: 0.9 })
  const fenceMat = new THREE.MeshStandardMaterial({ color: '#e8d8b8', roughness: 0.95 })

  const bush = (x: number, z: number, s = 1, dark = false) => {
    const m = new THREE.Mesh(
      new THREE.SphereGeometry(0.6 * s, 16, 14),
      dark ? bushMat : bushMat2,
    )
    m.position.set(x, GROUND_Y + 0.42 * s, z)
    m.scale.y = 0.8
    m.castShadow = true
    m.receiveShadow = true
    g.add(m)
  }

  const flower = (x: number, z: number, color: string) => {
    const stem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.06, 0.5, 6),
      new THREE.MeshStandardMaterial({ color: '#5a9a48', roughness: 0.9 }),
    )
    stem.position.set(x, GROUND_Y + 0.25, z)
    g.add(stem)
    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.22, 10, 10),
      new THREE.MeshStandardMaterial({ color, roughness: 0.8 }),
    )
    head.position.set(x, GROUND_Y + 0.55, z)
    g.add(head)
    const center = new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 8, 8),
      new THREE.MeshStandardMaterial({ color: '#fff2b0', roughness: 0.8 }),
    )
    center.position.set(x, GROUND_Y + 0.58, z)
    g.add(center)
  }

  const tree = (x: number, z: number, s = 1, color?: string) => {
    const t = clayTree(1.3, 1.3, color ?? theme.leafA)
    t.position.set(x, GROUND_Y, z)
    t.scale.setScalar(s)
    g.add(t)
  }

  // 沿岛缘种植的树木（海边信箱净空区：约 (9.3,5.2) 半径 3.2 内不种树/灌木，避免遮挡穿模）
  tree(-11, -3, 1.05)
  tree(-10, 3, 1.0, theme.leafB)
  tree(10, -2, 1.05, theme.leafB)
  // 原 tree(9, 6) 紧贴海边信箱(9.3,5.2)，树冠盖住信箱箱体 → 挪到右下空位 (8.5, -8.5)
  tree(8.5, -8.5, 1.0)
  tree(-7, 9, 0.9, theme.leafB)
  tree(0, -11, 1.1)
  tree(5, -10, 0.95, theme.leafB)
  tree(-3, -10, 0.9)

  // 灌木丛（11,2 距信箱约 3.6，安全；其余保持）
  bush(-8, -6, 1, true)
  bush(8, -7, 1.1)
  bush(-6, 6, 0.9)
  bush(6, 8, 1, true)
  bush(-9, 1, 0.85, true)
  bush(11, 2, 0.9)

  // 花丛（避开海边信箱净空区，避免小花挡在信箱前）
  for (let i = 0; i < 14; i++) {
    const a = Math.random() * Math.PI * 2
    const r = 6 + Math.random() * 5
    const x = Math.cos(a) * r
    const z = Math.sin(a) * r
    // 信箱净空区 (9.3, 5.2) 半径 3.2 内跳过；同时避开岛心 4 单位内的路径
    const mailboxClear = Math.hypot(x - 9.3, z - 5.2) < 3.2
    if (Math.hypot(x, z) > 4 && !mailboxClear) {
      flower(x, z, theme.flowerColors[i % theme.flowerColors.length])
    }
  }

  // 白色栅栏
  const fence = (x: number, z: number, len: number, rotY: number) => {
    const f = new THREE.Group()
    const rail1 = new THREE.Mesh(new THREE.BoxGeometry(len, 0.16, 0.12), fenceMat)
    rail1.position.y = 0.55
    f.add(rail1)
    const rail2 = new THREE.Mesh(new THREE.BoxGeometry(len, 0.16, 0.12), fenceMat)
    rail2.position.y = 0.28
    f.add(rail2)
    const n = Math.max(2, Math.round(len / 1.2) + 1)
    for (let i = 0; i < n; i++) {
      const px = -len / 2 + (i / (n - 1)) * len
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.8, 0.14), fenceMat)
      post.position.set(px, 0.4, 0)
      f.add(post)
    }
    f.position.set(x, GROUND_Y, z)
    f.rotation.y = rotY
    f.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) {
        o.castShadow = true
        o.receiveShadow = true
      }
    })
    g.add(f)
  }
  fence(-3, 7.5, 4, 0.3)
  fence(7.5, -3, 3.6, -0.4)

  // 木桥
  const bridge = new THREE.Group()
  const plank = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.18, 0.6), woodMat)
  plank.position.y = GROUND_Y + 0.14
  bridge.add(plank)
  for (let i = 0; i < 2; i++) {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.12, 0.1), woodMat)
    rail.position.set(0, GROUND_Y + 0.42, i === 0 ? 0.32 : -0.32)
    bridge.add(rail)
  }
  bridge.position.set(1, 0, 1.5)
  bridge.rotation.y = 0.6
  bridge.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) {
      o.castShadow = true
      o.receiveShadow = true
    }
  })
  g.add(bridge)

  // 长椅
  const bench = new THREE.Group()
  const seat = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.16, 0.6), woodMat)
  seat.position.y = GROUND_Y + 0.55
  bench.add(seat)
  const back = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.5, 0.14), woodMat)
  back.position.set(0, GROUND_Y + 0.95, -0.24)
  bench.add(back)
  for (const sx of [-0.7, 0.7]) {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.55, 0.5), woodMat)
    leg.position.set(sx, GROUND_Y + 0.28, 0)
    bench.add(leg)
  }
  bench.position.set(-2.5, 0, 0.5)
  bench.rotation.y = 0.5
  bench.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) {
      o.castShadow = true
      o.receiveShadow = true
    }
  })
  g.add(bench)

  return g
}

/** 岛屿边缘的白色浪花环（泡沫呼吸动画） */
function buildFoamRing(radius: number): {
  group: THREE.Group
  update: (t: number) => void
} {
  const group = new THREE.Group()

  // 一圈连续的白沫环带（扁 Torus），作为浪花的"基底"，最稳定可见
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.75,
    depthWrite: false,
    toneMapped: false,
  })
  const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.55, 12, 80), ringMat)
  ring.rotation.x = -Math.PI / 2
  ring.position.y = -0.42
  ring.renderOrder = 40
  group.add(ring)

  // 沿岛缘一圈分布的泡沫团（软陶泡沫，贴在海面与岛缘交界）
  const blobMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.9,
    depthWrite: false,
    toneMapped: false,
  })
  const foamCount = 44
  const foams: { mesh: THREE.Mesh; baseScale: number; phase: number; baseY: number }[] = []
  for (let i = 0; i < foamCount; i++) {
    const a = (i / foamCount) * Math.PI * 2
    const r = radius + (Math.random() - 0.5) * 2.6
    const isBlob = i % 2 === 0
    const geo = isBlob
      ? new THREE.SphereGeometry(1.1 + Math.random() * 0.55, 10, 8)
      : new THREE.CircleGeometry(1.2 + Math.random() * 0.55, 12)
    const mesh = new THREE.Mesh(geo, blobMat)
    mesh.renderOrder = 41
    if (!isBlob) {
      mesh.rotation.x = -Math.PI / 2
    }
    mesh.scale.y = isBlob ? 0.34 : 1
    mesh.position.set(Math.cos(a) * r, -0.42, Math.sin(a) * r)
    group.add(mesh)
    foams.push({
      mesh,
      baseScale: 0.85 + Math.random() * 0.4,
      phase: Math.random() * Math.PI * 2,
      baseY: -0.42 + (Math.random() - 0.5) * 0.12,
    })
  }

  const update = (t: number) => {
    // 环带轻微呼吸
    ringMat.opacity = 0.68 + Math.sin(t * 1.6) * 0.1
    foams.forEach((f) => {
      const breathe = 1 + Math.sin(t * 1.4 + f.phase) * 0.14
      f.mesh.scale.setScalar(f.baseScale * breathe)
      f.mesh.position.y = f.baseY + Math.sin(t * 1.8 + f.phase) * 0.05
    })
  }

  return { group, update }
}

/** 悬浮的软陶云朵 */
function buildClouds(): THREE.Group[] {
  const mat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1 })
  const clouds: THREE.Group[] = []
  const spots = [
    { x: -26, y: 24, z: -10, s: 1.1 },
    { x: 22, y: 27, z: -14, s: 1.3 },
    { x: 8, y: 29, z: 14, s: 0.95 },
    { x: -18, y: 22, z: 16, s: 1.0 },
    { x: 30, y: 30, z: 4, s: 0.85 },
  ]
  spots.forEach((sp) => {
    const c = new THREE.Group()
    const puff = (px: number, py: number, pz: number, r: number) => {
      const m = new THREE.Mesh(new THREE.SphereGeometry(r, 20, 16), mat)
      m.position.set(px, py, pz)
      c.add(m)
    }
    puff(0, 0, 0, 1.7)
    puff(1.7, 0.12, 0, 1.15)
    puff(-1.7, 0.12, 0.1, 1.15)
    puff(0.6, 0.5, 0.3, 1.05)
    puff(-0.6, 0.55, -0.2, 1.0)
    c.position.set(sp.x, sp.y, sp.z)
    c.scale.setScalar(sp.s)
    clouds.push(c)
  })
  return clouds
}

/** 季节粒子（樱花/落叶/雪花） */
interface ParticleSystem {
  group: THREE.Group
  update: (dt: number) => void
  dispose: () => void
}

function buildParticles(theme: SeasonTheme): ParticleSystem | null {
  if (theme.particle === 'none') return null

  const isSnow = theme.particle === 'snow'
  const count = isSnow ? 90 : 130
  const group = new THREE.Group()
  const geometry = new THREE.SphereGeometry(1, 8, 6)
  const targetOpacity = isSnow ? 0.95 : 0.9
  const material = new THREE.MeshBasicMaterial({
    color: theme.particleColor,
    transparent: true,
    opacity: 0, // 初始透明，切季时平滑淡入
    depthWrite: false,
    toneMapped: false,
  })

  const items: { mesh: THREE.Mesh; vx: number; vy: number; vz: number; phase: number; spin: number }[] = []
  for (let i = 0; i < count; i++) {
    const mesh = new THREE.Mesh(geometry, material)
    const s = 0.14 + Math.random() * 0.22
    // 花瓣/落叶是扁椭圆薄片，雪花接近球形
    mesh.scale.set(s, s * (isSnow ? 0.9 : 0.22), s)
    mesh.position.set(
      (Math.random() - 0.5) * 46,
      GROUND_Y + 5 + Math.random() * 24,
      (Math.random() - 0.5) * 46,
    )
    group.add(mesh)
    items.push({
      mesh,
      vx: (Math.random() - 0.5) * 1.6,
      vy: isSnow ? -(1.6 + Math.random() * 1.6) : -(0.9 + Math.random() * 1.2),
      vz: (Math.random() - 0.5) * 1.6,
      phase: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 3,
    })
  }

  let elapsed = 0
  const update = (dt: number) => {
    elapsed += dt
    const t = elapsed
    // 前 1.2 秒平滑淡入，避免切季时粒子突然蹦出
    material.opacity = Math.min(1, elapsed / 1.2) * targetOpacity
    items.forEach((it) => {
      const p = it.mesh.position
      // 水平漂移用正弦摆动（始终在动，不会停在原地）
      const sway = Math.sin(t * 1.6 + it.phase)
      p.x += (it.vx + sway * 1.4) * dt
      p.z += (it.vz + Math.cos(t * 1.3 + it.phase) * 1.2) * dt
      p.y += it.vy * dt

      // 雪花直线下落，花瓣/落叶翻滚旋转（一直旋转，不会静止）
      if (isSnow) {
        it.mesh.rotation.z += it.spin * dt
      } else {
        it.mesh.rotation.y += it.spin * dt * 1.4
        it.mesh.rotation.z += it.spin * dt
      }

      // 落到地面后回到顶部循环
      if (p.y < GROUND_Y + 0.6) {
        p.y = GROUND_Y + 20 + Math.random() * 8
        p.x = (Math.random() - 0.5) * 46
        p.z = (Math.random() - 0.5) * 46
      }
      // 飘出水平范围则拉回
      if (Math.abs(p.x) > 26 || Math.abs(p.z) > 26) {
        p.x = (Math.random() - 0.5) * 46
        p.z = (Math.random() - 0.5) * 46
      }
    })
  }

  return {
    group,
    update,
    dispose: () => {
      geometry.dispose()
      material.dispose()
    },
  }
}
