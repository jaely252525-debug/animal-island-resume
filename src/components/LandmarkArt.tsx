import { DIORAMA } from './landmarks/diorama'
import { STICKER } from './landmarks/sticker'
import { VOXEL } from './landmarks/voxel'
import { SKETCH } from './landmarks/sketch'
import type { LandmarkKind, ArtVariant, LandmarkArtSet } from './landmarks/types'

/**
 * 地标插画统一入口
 * ------------------------------------------------------------------
 * 四套画风共用同一个 LandmarkKind 与 200x200 viewBox，
 * 因此切换画风时岛上的位置、标签、点击逻辑完全不用改。
 *
 * 想新增画风：在 src/components/landmarks/ 下新建一个导出
 * LandmarkArtSet 的模块，在 types.ts 的 ArtVariant / ART_VARIANTS
 * 与下面的 SETS 里各登记一项即可。
 */
export type { LandmarkKind, ArtVariant, ArtVariantMeta } from './landmarks/types'
export { ART_VARIANTS, LANDMARK_COLUMNS } from './landmarks/types'

const SETS: Record<ArtVariant, LandmarkArtSet> = {
  diorama: DIORAMA,
  sticker: STICKER,
  voxel: VOXEL,
  sketch: SKETCH,
}

export default function LandmarkArt({
  kind,
  variant = 'diorama',
}: {
  kind: LandmarkKind
  variant?: ArtVariant
}) {
  const Art = SETS[variant][kind]
  return <Art />
}
