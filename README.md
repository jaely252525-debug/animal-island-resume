# 🏝️ 动森 3D 微缩小岛 · 互动简历

用 React + TypeScript + Vite 搭的温暖岛屿风互动简历。视觉语言参考开源项目
[animal-island-ui](https://github.com/guokaigdg/animal-island-ui) 的官方设计规范（`--animal-*` 设计令牌），
并使用其官方 npm 组件库 v4.0.0。

## ✨ 核心体验

**一座可以点的小岛**：简历的 5 个模块被映射为岛上的立体地标（纯 SVG 绘制，无位图 / 无 WebGL，加载快）。

| 地标 | 简历模块 |
|---|---|
| 岛主小屋 | 关于我 |
| 岛屿灯塔 | 工作经历 |
| 果树工坊 | 项目经验 |
| 森林瞭望台 | 专业技能 |
| 海边信箱 | 联系方式 |

- **完整的立体岛屿环境**（`IslandWorld.tsx`）：不是"纯色背景 + 孤立椭圆 + 图标"，而是一整张 1200×720 的场景画——
  不规则岸线与可见土层、双层海浪与远山、沙滩、蜿蜒小径串联五个地标、溪流与木拱桥、后排针阔混交林、
  院落栅栏、路灯、长椅、野餐垫、码头、岩石与花丛，形成前 / 中 / 后景层次；地标直接"长"在地形上，共用接触阴影。

- **四套可切换的地标画风**：小岛上方一排切换按钮，点一下整座岛的 5 个地标即时换装；选择会记进 `localStorage`，刷新后保留。往下滚有 **4 行 × 5 列并排对比实验室**，可以一眼比较四套画风对同一个地标的画法，点任意格子即应用。
- **视线跟随小人偶**：站在岛中央的毛茸茸岛民会用瞳孔实时追随鼠标；离开或静止 3.5 秒自然回正，随机眨眼、轻微呼吸浮动，点击会跳一下。头顶没有对话气泡，保持画面干净。
- **地标交互**：悬停轻微上浮 + 立体阴影加深 + 名称标签；点击先播放按压回弹（`0.96 → 1.03 → 1`），随后从点击位置弹出图鉴 / 护照风格面板。
- **图鉴面板**：`cubic-bezier(0.34, 1.56, 0.64, 1)` 果冻缓动、背景虚化变暗、内容按 45ms 依次浮现、关闭缩放收起；支持 ESC / 点遮罩关闭。
- **快捷入口**：顶部导航可直接打开任意模块；下方保留完整列表视图（可展开卡片 + 详情弹窗），不想逐个点岛屿也能快速浏览。
- 点击音效由 Web Audio 实时合成，零外部资源，右下角可开关。

## 🎨 四套地标画风

| 版本 | 做法 | 视觉感觉 |
|---|---|---|
| **微缩立体** `diorama`（默认） | 多面线性渐变、顶部高光、底部 AO 软阴影 | 摆在桌上的树脂微缩摆件 |
| **扁平贴纸** `sticker` | 高饱和纯色平涂 + `feMorphology` 白色外描边 + 零模糊硬投影 + 圆形虚线底板 | 从手账上撕下来的一张贴纸徽章 |
| **像素体素** `voxel` | 全部对齐网格的 `<rect>`、阶梯三角/圆、三面明暗色阶、`crispEdges` 硬边 | 复古掌机里的 8-bit 岛屿 |
| **手绘手账** `sketch` | 米黄纸底 + 纸纹 + 胶带、微抖勾线、错位淡彩、斜线 pattern 排线阴影 | 速写本上的一页淡彩速写 |

四套共用同一个 `LandmarkKind` 与 `200×200` viewBox，所以切换画风不会改变岛上的位置、标签与点击逻辑。
静态对比图放在 `style-previews/`：

```
style-previews/
├── 00-comparison-matrix.png   ← 4×5 并排对比矩阵
├── 01-diorama.png             ← 微缩立体版小岛
├── 02-sticker.png             ← 扁平贴纸版小岛
├── 03-voxel.png               ← 像素体素版小岛
├── 04-sketch.png              ← 手绘手账版小岛
├── 10-island-desktop.png      ← 立体岛屿重做 · 桌面端实景
├── 11-island-mobile.png       ← 立体岛屿重做 · 390px 移动端实景
├── 12-panel.png               ← 图鉴详情面板
└── 13-fullpage.png            ← 整页桌面截图（小岛 → 快速浏览 → 关于我 → 画风对比）
```

### 新增一套画风（三步）

1. 在 `src/components/landmarks/` 新建 `你的风格.tsx`，导出一个 `LandmarkArtSet`：
   ```tsx
   import type { LandmarkArtSet } from './types'
   export const MY_STYLE: LandmarkArtSet = { about: House, work: Lighthouse, /* ... */ }
   ```
   每个组件返回一个 `viewBox="0 0 200 200"` 且带 `className="landmark-svg"` 的 SVG。
2. 在 `src/components/landmarks/types.ts` 的 `ArtVariant` 联合类型里加一个 id，并在 `ART_VARIANTS` 里登记名称、说明、色板、做法标签。
3. 在 `src/components/LandmarkArt.tsx` 的 `SETS` 里 import 并注册。

切换按钮、对比矩阵、持久化会自动多出一行/一个按钮，无需改其它文件。

## 🚀 启动与预览

```bash
npm install
npm run dev       # 开发，默认 http://localhost:5173
npm run build     # 生产构建
npm run preview   # 预览构建产物
```

## 📁 项目结构

```
src/
├── data/resume.ts             ← 你主要改这里：全部简历数据（每处占位都标 TODO）
├── components/
│   ├── IslandWorld.tsx        ← 立体岛屿环境：地形/土层/海浪/小径/溪流木桥/树林/装饰
│   ├── IslandScene.tsx        ← 地标排布（与 IslandWorld 同一坐标系）、按压回弹逻辑
│   ├── LandmarkArt.tsx        ← 画风统一入口（导出类型 + SETS 注册表）
│   ├── StyleGallery.tsx       ← 画风切换条 + 4×5 对比矩阵
│   ├── landmarks/
│   │   ├── types.ts           ← LandmarkKind / ArtVariant / 风格元数据
│   │   ├── diorama.tsx        ← 微缩立体
│   │   ├── sticker.tsx        ← 扁平贴纸
│   │   ├── voxel.tsx          ← 像素体素
│   │   └── sketch.tsx         ← 手绘手账
│   ├── Islander.tsx           ← 视线跟随小人偶
│   ├── IslandPanel.tsx        ← 图鉴/护照详情面板与交错进场
│   ├── ResumeCard.tsx         ← 列表视图可展开卡片
│   └── DetailModal.tsx        ← 列表视图的单条详情弹窗
├── hooks/useSound.ts          ← Web Audio 合成音效
├── App.tsx                    ← 页面组装 + 画风状态与持久化
├── index.css                  ← 官方设计令牌 + 3D 场景 + 动效 + 响应式
└── main.tsx                   ← 入口（引入 animal-island-ui/style）
```

## ✏️ 替换成你自己的简历

打开 **`src/data/resume.ts`**，每处占位后都有 `// TODO 替换` 注释：

- `profile`：姓名、昵称、求职方向、欢迎语、岛名、状态
- `workExperience` / `projects`：公司 / 项目、职位、时间、成果、标签、亮点、时间线
- `skillGroups`：技能分类与列表
- `contacts`：邮箱 / GitHub / 作品集

颜色取值来自岛屿色板：`app-pink`、`app-blue`、`app-teal`、`app-green`、`app-yellow`、`app-orange`、`purple`、`brown` 等。
「关于我」那段故事文案在 `src/App.tsx` 与 `src/components/IslandPanel.tsx`，同样可直接改。
保存后 Vite 自动刷新，**数据结构无需改动**——换画风不会影响简历内容。

## 🎯 修改小人偶 / 地标 / 动效

- **小人偶外观**：`src/components/Islander.tsx` 的 SVG 颜色与形状；`EYES` 常量控制眼睛中心与瞳孔可移动范围，`FOLLOW_RANGE` / `LERP` / `IDLE_MS` 控制跟随灵敏度与回正时间。
- **某套画风的造型**：改 `src/components/landmarks/` 下对应文件里的 path / rect 与颜色；四套互相独立，改一套不影响其它。
- **画风默认项与名称**：`types.ts` 的 `ART_VARIANTS` 顺序决定按钮顺序；默认画风在 `src/App.tsx` 的 `readVariant()` 里（当前 `diorama`）。
- **地标位置**：`src/components/IslandScene.tsx` 顶部 `LANDMARKS` 数组的 `x/y`——与 `IslandWorld` 共用的 **1200×720 坐标系百分比**，表示地标与地面的接触点（而非图标中心）。移动端会自动缩放整张地图，地标保持在地形原位。
- **岛屿环境**：地形、岸线、小径、树林、装饰都在 `src/components/IslandWorld.tsx`；想加一棵树、一段栅栏或一条岔路，直接在对应图层组里追加 SVG 即可。
- **缓动曲线**：`src/index.css` 里的 `--jelly`，当前为 `cubic-bezier(0.34, 1.56, 0.64, 1)`。切画风时地标淡入用同文件里的 `@keyframes art-swap`。
- **信息进场间隔**：`src/index.css` 的 `.panel-stagger` 中的 `45ms`。

## 📐 设计来源

配色、圆角、阴影、字体、动效取自 [animal-island-ui design-system](https://github.com/guokaigdg/animal-island-ui/tree/main/docs/design-system)：
奶油底 `#f8f8f0`、薄荷主色 `#19c8b9`、暖棕文字 `#794f27`、3D 按钮阴影 `0 5px 0 0 #bdaea0`、
Nunito + Noto Sans SC 字体。四套地标插画均为本项目独立手绘 SVG，与任何游戏公司无关联。
