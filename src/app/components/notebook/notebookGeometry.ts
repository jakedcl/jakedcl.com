import * as THREE from 'three'

/** Outer-corner radius on the cover (opposite the spine). */
export const COVER_CORNER_RADIUS = 0.1
/** Page stack matches cover outer rounding (tiny outer/edge inset). */
export const PAGE_CORNER_RADIUS = 0.09

function notebookOutline(width: number, depth: number, radius: number) {
  const r = Math.min(radius, width * 0.28, depth * 0.28)
  const hw = width / 2
  const hd = depth / 2
  const shape = new THREE.Shape()
  // Spine on -X stays square; +X outer corners are rounded.
  shape.moveTo(-hw, -hd)
  shape.lineTo(-hw, hd)
  shape.lineTo(hw - r, hd)
  shape.absarc(hw - r, hd - r, r, Math.PI / 2, 0, true)
  shape.lineTo(hw, -hd + r)
  shape.absarc(hw - r, -hd + r, r, 0, -Math.PI / 2, true)
  shape.lineTo(-hw, -hd)
  return shape
}

function faceGroup(normal: THREE.Vector3) {
  const ax = Math.abs(normal.x)
  const ay = Math.abs(normal.y)
  const az = Math.abs(normal.z)
  if (ax >= ay && ax >= az) return normal.x >= 0 ? 0 : 1
  if (ay >= ax && ay >= az) return normal.y >= 0 ? 2 : 3
  return normal.z >= 0 ? 4 : 5
}

/**
 * Box-like slab, centered like BoxGeometry.
 * Material groups match BoxGeometry: +X, -X, +Y, -Y, +Z, -Z.
 * UVs on the large faces put image-top toward -Z (away from the desk camera).
 * The -Y face also flips U so the inside cover reads left-to-right when open.
 */
export function createNotebookSlabGeometry(
  width: number,
  height: number,
  depth: number,
  radius: number,
  curveSegments = 8,
) {
  const shape = notebookOutline(width, depth, radius)
  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: height,
    bevelEnabled: false,
    curveSegments,
    steps: 1,
  })
  geom.rotateX(-Math.PI / 2)
  geom.translate(0, -height / 2, 0)
  geom.computeVertexNormals()

  const pos = geom.getAttribute('position')
  const uv = geom.getAttribute('uv')
  if (!uv || !pos) {
    geom.computeBoundingSphere()
    return geom
  }

  // Recent ExtrudeGeometry is often non-indexed; build a sequential index so we
  // can regroup to BoxGeometry material order (+X,-X,+Y,-Y,+Z,-Z). Without this,
  // Extrude's 2 default groups black out marble/page maps on material-2.
  if (!geom.index) {
    const seq = new Uint32Array(pos.count)
    for (let i = 0; i < pos.count; i++) seq[i] = i
    geom.setIndex(new THREE.BufferAttribute(seq, 1))
  }
  const index = geom.index!

  const a = new THREE.Vector3()
  const b = new THREE.Vector3()
  const c = new THREE.Vector3()
  const ab = new THREE.Vector3()
  const ac = new THREE.Vector3()
  const n = new THREE.Vector3()
  const buckets: number[][] = [[], [], [], [], [], []]

  for (let i = 0; i < index.count; i += 3) {
    const i0 = index.getX(i)
    const i1 = index.getX(i + 1)
    const i2 = index.getX(i + 2)
    a.fromBufferAttribute(pos, i0)
    b.fromBufferAttribute(pos, i1)
    c.fromBufferAttribute(pos, i2)
    ab.subVectors(b, a)
    ac.subVectors(c, a)
    n.crossVectors(ab, ac)
    if (n.lengthSq() < 1e-12) continue
    n.normalize()
    buckets[faceGroup(n)].push(i0, i1, i2)
  }

  const next: number[] = []
  geom.clearGroups()
  for (let g = 0; g < 6; g++) {
    const start = next.length
    next.push(...buckets[g])
    geom.addGroup(start, buckets[g].length, g)
  }
  geom.setIndex(next)

  const hw = width / 2
  const hd = depth / 2
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const y = pos.getY(i)
    const z = pos.getZ(i)
    if (Math.abs(y) < height * 0.35) continue
    const u = (x + hw) / width
    const v = (hd - z) / depth
    if (y < 0) {
      uv.setXY(i, 1 - u, v)
    } else {
      uv.setXY(i, u, v)
    }
  }
  uv.needsUpdate = true
  geom.computeVertexNormals()
  geom.computeBoundingSphere()
  return geom
}
